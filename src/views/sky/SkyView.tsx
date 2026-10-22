import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Clock, Compass, Layers, Minus, Plus, RotateCcw, Search } from 'lucide-react';
import type { SatRec } from '../../lib/live/sgp4';
import skyData from '../../data/sky.json';
import { issLook, issState, loadIss } from '../../lib/live/iss';
import { SkyEngine, type SkyData, type SkyObject, type SkyLabels, type ViewInfo } from '../../sky/engine';
import { requestOrientationPermission, startOrientation } from '../../sky/orientation';
import { useSettings, type SkyLayers } from '../../state/settings';
import { useI18n } from '../../i18n';
import { activeShowers } from '../../lib/meteors';
import { compass, compassLabels, compassLong, fmtDateTime, fmtInt, fmtTime } from '../../lib/format';
import { Sheet } from '../../components/Sheet';
import { InfoPanel } from './InfoPanel';
import { SearchPanel } from './SearchPanel';

const data = skyData as unknown as SkyData;
type Panel = null | 'layers' | 'search' | 'time';
type GyroState = 'off' | 'starting' | 'on' | 'denied' | 'unsupported';

/** Wandelt den `focus`-Parameter aus der URL in ein Himmelsobjekt um */
function parseFocus(focus: string | null): SkyObject | null {
  if (!focus) return null;
  if (focus === 'iss') return { kind: 'iss' };
  const [kind, rest] = [focus.slice(0, focus.indexOf(':')), focus.slice(focus.indexOf(':') + 1)];
  if (kind === 'body') return { kind: 'body', id: rest as never };
  if (kind === 'meteor') return { kind: 'meteor', id: rest };
  if (kind === 'dso') {
    const index = data.messier.findIndex((m) => m.id === rest);
    return index >= 0 ? { kind: 'dso', index } : null;
  }
  if (kind === 'coord') {
    const [ra, dec, label] = rest.split(',');
    return { kind: 'point', ra: +ra, dec: +dec, label: decodeURIComponent(label ?? '') };
  }
  return null;
}

interface IssInfoData {
  az: number;
  alt: number;
  rangeKm: number;
  altKm: number;
  speedKmh: number;
  lit: boolean;
}

export default function SkyView({ focus, at }: { focus: string | null; at: number | null }) {
  const { settings, setLayer } = useSettings();
  const { t, lang } = useI18n();
  const place = settings.place!;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<SkyEngine | null>(null);
  const stopGyro = useRef<(() => void) | null>(null);
  const [view, setView] = useState<ViewInfo>({ az: 180, alt: 35, fov: 100 });
  const [selected, setSelected] = useState<SkyObject | null>(null);
  const [panel, setPanel] = useState<Panel>(null);
  const [gyro, setGyro] = useState<GyroState>('off');
  const [offsetMin, setOffsetMin] = useState(0);
  const [now, setNow] = useState(() => new Date());
  const time = useMemo(() => new Date(now.getTime() + offsetMin * 60_000), [now, offsetMin]);

  const labels: SkyLabels = useMemo(
    () => ({
      body: (id) => t(`body.${id}`),
      constellation: (c) => (lang === 'de' ? c.de : c.la),
      dso: (m) => {
        const name = lang === 'de' ? m.de : m.en;
        return name ? `${m.id} ${name}` : m.id;
      },
      meteor: (s) => (lang === 'de' ? s.de : s.en),
      dirs: compassLabels(lang),
    }),
    [t, lang],
  );

  // Engine einmalig anlegen
  useEffect(() => {
    const engine = new SkyEngine(canvasRef.current!, data, settings.layers, labels, {
      onSelect: (obj) => {
        setSelected(obj);
        if (obj) setPanel(null);
      },
      onView: setView,
    });
    engineRef.current = engine;
    return () => {
      engine.destroy();
      engineRef.current = null;
      stopGyro.current?.();
    };
    // Nur beim ersten Rendern: Layer und Beschriftungen werden unten separat nachgeführt
  }, []);

  useEffect(() => {
    engineRef.current?.setObserver(place.lat, place.lon, place.elevation ?? 0);
  }, [place.lat, place.lon, place.elevation]);

  useEffect(() => {
    const e = engineRef.current;
    if (!e) return;
    e.showers = activeShowers(time);
    e.setTime(time);
  }, [time]);

  useEffect(() => {
    const e = engineRef.current;
    if (!e) return;
    e.layers = settings.layers;
    e.invalidate();
  }, [settings.layers]);

  useEffect(() => {
    const e = engineRef.current;
    if (!e) return;
    e.labels = labels;
    e.invalidate();
  }, [labels]);

  // Uhr weiterlaufen lassen (die Sterne wandern etwa 0,25° pro Minute)
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 5_000);
    return () => window.clearInterval(id);
  }, []);

  // ISS: Bahnmodell laden und Position zur Kartenzeit jede Sekunde nachführen
  const [rec, setRec] = useState<SatRec | null>(null);
  const [issInfo, setIssInfo] = useState<IssInfoData | null>(null);
  const pendingIssFocus = useRef(false);
  useEffect(() => {
    loadIss().then(setRec, () => undefined);
  }, []);
  useEffect(() => {
    if (!rec) return;
    const update = () => {
      const e = engineRef.current;
      if (!e) return;
      const t = new Date(Date.now() + offsetMin * 60_000);
      const look = issLook(rec, t, place);
      const st = issState(rec, t);
      if (!look || !st) {
        e.iss = null;
        e.issTrack = null;
        e.invalidate();
        return;
      }
      e.iss = { az: look.az, alt: look.alt, lit: st.lit };
      // Bahn am Himmel einzeichnen, wenn die ISS in den ±8 Minuten über dem Horizont steht
      const track: { az: number; alt: number }[] = [];
      for (let k = -32; k <= 32; k++) {
        const lk = issLook(rec, new Date(t.getTime() + k * 15_000), place);
        if (lk) track.push({ az: lk.az, alt: lk.alt });
      }
      e.issTrack = track.some((p) => p.alt > 0) ? track : null;
      if (pendingIssFocus.current) {
        pendingIssFocus.current = false;
        e.focus({ kind: 'iss' }, 100);
      }
      e.invalidate();
      setIssInfo({ az: look.az, alt: look.alt, rangeKm: look.rangeKm, altKm: st.altKm, speedKmh: st.speedKmh, lit: st.lit });
    };
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, [rec, place, offsetMin]);

  // Ziel aus der URL (z. B. aus dem Planer oder dem ISS-Tracker)
  useEffect(() => {
    const obj = parseFocus(focus);
    const e = engineRef.current;
    if (!obj || !e) return;
    if (obj.kind === 'iss') {
      if (at) setOffsetMin((at - Date.now()) / 60_000);
      pendingIssFocus.current = true;
      setSelected(obj);
      return;
    }
    e.showers = activeShowers(new Date());
    e.focus(obj, obj.kind === 'body' && (obj.id === 'moon' || obj.id === 'sun') ? 40 : 60);
    setSelected(obj);
  }, [focus, at]);

  const focusObject = useCallback((obj: SkyObject) => {
    engineRef.current?.focus(obj);
    setSelected(obj);
    setPanel(null);
  }, []);

  const closeInfo = useCallback(() => {
    engineRef.current?.select(null);
    setSelected(null);
  }, []);

  async function toggleGyro() {
    const e = engineRef.current;
    if (!e) return;
    if (gyro === 'on' || gyro === 'starting') {
      stopGyro.current?.();
      stopGyro.current = null;
      e.setGyro(null);
      setGyro('off');
      return;
    }
    const res = await requestOrientationPermission();
    if (res !== 'granted') {
      setGyro(res === 'unsupported' ? 'unsupported' : 'denied');
      return;
    }
    setGyro('starting');
    let got = false;
    stopGyro.current = startOrientation((b) => {
      if (!got) {
        got = true;
        setGyro('on');
      }
      e.setGyro(b);
    });
    // Desktop-Browser melden das Event, liefern aber keine Daten
    window.setTimeout(() => {
      if (!got) {
        stopGyro.current?.();
        stopGyro.current = null;
        setGyro('unsupported');
      }
    }, 1500);
  }

  const live = offsetMin === 0;
  const gyroMsg = gyro === 'denied' ? t('sky.gyroDenied') : gyro === 'unsupported' ? t('sky.gyroUnsupported') : null;

  return (
    <div className="sky">
      <canvas ref={canvasRef} className="sky-canvas" />

      <div className="sky-top">
        <button className={`sky-chip ${live ? '' : 'is-shifted'}`} onClick={() => setPanel(panel === 'time' ? null : 'time')}>
          <Clock size={15} />
          <span>
            {live ? t('sky.live') : t('sky.shifted')} ·{' '}
            {Math.abs(offsetMin) > 720 ? fmtDateTime(time, place.tz, lang) : fmtTime(time, place.tz, lang)}
          </span>
        </button>
        <div className="sky-zoom">
          <button className="icon-btn" onClick={() => engineRef.current?.zoom(1 / 1.35)} aria-label={t('sky.zoomIn')}>
            <Plus size={18} />
          </button>
          <button className="icon-btn" onClick={() => engineRef.current?.zoom(1.35)} aria-label={t('sky.zoomOut')}>
            <Minus size={18} />
          </button>
        </div>
      </div>

      <div className="sky-readout" aria-live="off">
        <span>{compass(view.az, lang)}</span> {Math.round(view.az)}° · {t('sky.altShort')} {Math.round(view.alt)}° · {t('sky.fov')} {Math.round(view.fov)}°
        {gyro === 'on' && <em> · {t('sky.gyroHint')}</em>}
      </div>

      {gyroMsg && (
        <div className="sky-toast" role="status" onClick={() => setGyro('off')}>
          {gyroMsg}
        </div>
      )}

      <nav className="sky-tools" aria-label={t('sky.tools')}>
        <button className={`tool ${gyro === 'on' ? 'is-on' : ''}`} onClick={toggleGyro} aria-pressed={gyro === 'on'}>
          <Compass size={20} />
          <span>{gyro === 'on' ? t('sky.gyroOn') : t('sky.gyro')}</span>
        </button>
        <button className={`tool ${panel === 'search' ? 'is-on' : ''}`} onClick={() => setPanel(panel === 'search' ? null : 'search')}>
          <Search size={20} />
          <span>{t('sky.search')}</span>
        </button>
        <button className={`tool ${panel === 'layers' ? 'is-on' : ''}`} onClick={() => setPanel(panel === 'layers' ? null : 'layers')}>
          <Layers size={20} />
          <span>{t('sky.layers')}</span>
        </button>
        <button className={`tool ${panel === 'time' ? 'is-on' : ''}`} onClick={() => setPanel(panel === 'time' ? null : 'time')}>
          <Clock size={20} />
          <span>{t('sky.time')}</span>
        </button>
      </nav>

      {panel === 'layers' && (
        <Sheet title={t('sky.layers')} onClose={() => setPanel(null)} closeLabel={t('common.close')}>
          <ul className="toggle-list">
            {(Object.keys(settings.layers) as (keyof SkyLayers)[]).map((key) => (
              <li key={key}>
                <label className="toggle">
                  <span>{t(`layer.${key}`)}</span>
                  <input type="checkbox" checked={settings.layers[key]} onChange={(e) => setLayer(key, e.target.checked)} />
                  <span className="switch" aria-hidden="true" />
                </label>
              </li>
            ))}
          </ul>
        </Sheet>
      )}

      {panel === 'time' && (
        <Sheet title={t('sky.timeTitle')} onClose={() => setPanel(null)} closeLabel={t('common.close')}>
          <p className="time-now">{fmtDateTime(time, place.tz, lang)}</p>
          <input
            className="range"
            type="range"
            min={-720}
            max={720}
            step={10}
            value={Math.max(-720, Math.min(720, offsetMin))}
            onChange={(e) => setOffsetMin(Number(e.target.value))}
            aria-label={t('sky.timeSlider')}
          />
          <div className="range-labels">
            <span>−12 h</span>
            <span>{t('sky.now')}</span>
            <span>+12 h</span>
          </div>
          <div className="btn-row">
            <button className="btn btn-ghost btn-sm" onClick={() => setOffsetMin((m) => m - 60)}>
              −1 h
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => setOffsetMin(0)} disabled={live}>
              <RotateCcw size={15} /> {t('sky.backToNow')}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => setOffsetMin((m) => m + 60)}>
              +1 h
            </button>
          </div>
        </Sheet>
      )}

      {panel === 'search' && (
        <Sheet title={t('sky.search')} onClose={() => setPanel(null)} closeLabel={t('common.close')}>
          <SearchPanel data={data} time={time} onPick={focusObject} />
        </Sheet>
      )}

      {selected && !panel && (
        <Sheet title={<InfoPanel.Title obj={selected} data={data} />} onClose={closeInfo} closeLabel={t('common.close')}>
          {selected.kind === 'iss' ? <IssInfo info={issInfo} /> : <InfoPanel obj={selected} data={data} time={time} />}
        </Sheet>
      )}
    </div>
  );
}

function IssInfo({ info }: { info: IssInfoData | null }) {
  const { t, lang } = useI18n();
  if (!info) return <p className="muted">{t('live.loading')}</p>;
  const up = info.alt > 0;
  return (
    <div className="info">
      <p className="info-type">{t('type.iss')}</p>
      <p className={`info-pos ${up ? 'is-up' : 'is-down'}`}>
        {up ? t('info.up', { dir: compassLong(info.az, lang), alt: Math.round(info.alt) }) : t('info.down')}
      </p>
      <p className="muted">{t('about.iss')}</p>
      <dl className="detail-grid">
        <dt>{t('info.issRange')}</dt>
        <dd>{fmtInt(info.rangeKm, lang)} km</dd>
        <dt>{t('iss.altitude')}</dt>
        <dd>{fmtInt(info.altKm, lang)} km</dd>
        <dt>{t('iss.speed')}</dt>
        <dd>{fmtInt(info.speedKmh, lang)} km/h</dd>
        <dt>{t('iss.onBoard')}</dt>
        <dd>{info.lit ? t('iss.lit') : t('iss.shadow')}</dd>
      </dl>
      <a className="link" href={`#/tagebuch/neu?obj=ISS&t=${Date.now()}`}>
        {t('diary.addFromSky')} <ArrowRight size={15} />
      </a>
      <a className="link" href="#/live">
        {t('iss.toTracker')} <ArrowRight size={15} />
      </a>
    </div>
  );
}
