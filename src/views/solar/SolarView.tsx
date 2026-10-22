import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Clock, Home, Pause, Play, Ruler } from 'lucide-react';
import skyData from '../../data/sky.json';
import { SolarEngine, type ScaleMode } from '../../solar/engine';
import { BODY, EARTH_RADIUS_KM, PLANET_ORDER, type SolarId } from '../../solar/bodies';
import type { SkyData } from '../../sky/engine';
import { useSettings } from '../../state/settings';
import { useI18n, type MsgKey } from '../../i18n';
import { fmtDate, fmtInt, fmtNum } from '../../lib/format';
import { Sheet } from '../../components/Sheet';
import { PlanetGlyph } from '../../components/PlanetGlyph';
import type { BodyId } from '../../lib/astro';
import { distanceFromEarthKm, lightTimeSeconds, speedKms, type Probe } from '../../lib/live/probes';
import { fmtKm, fmtLightTime } from '../../lib/format';

const SPEEDS = [
  { id: 'pause', days: 0 },
  { id: 'real', days: 1 / 86_400 },
  { id: 'hour', days: 1 / 24 },
  { id: 'day', days: 1 },
  { id: 'week', days: 7 },
  { id: 'month', days: 30.44 },
  { id: 'year', days: 365.25 },
] as const;
type SpeedId = (typeof SPEEDS)[number]['id'];

const MODES: ScaleMode[] = ['overview', 'distance', 'size'];
const SKY_BODIES = new Set<SolarId>(['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune']);

export default function SolarView({ focus, probe }: { focus: string | null; probe?: string | null }) {
  const { settings } = useSettings();
  const { t, lang } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const engineRef = useRef<SolarEngine | null>(null);
  const [failed, setFailed] = useState(false);
  const [selected, setSelected] = useState<SolarId | null>(null);
  const [date, setDate] = useState(() => new Date());
  const [speed, setSpeed] = useState<SpeedId>('day');
  const lastSpeed = useRef<SpeedId>('day');
  const [mode, setMode] = useState<ScaleMode>('overview');
  const [panel, setPanel] = useState<null | 'time' | 'scale'>(null);
  const tz = settings.place?.tz ?? Intl.DateTimeFormat().resolvedOptions().timeZone;

  const names = useMemo(() => ({ name: (id: SolarId) => t(`solar.name.${id}` as MsgKey), probe: (p: Probe) => p.name[lang] }), [t, lang]);
  const [probeId, setProbeId] = useState<string | null>(null);
  const [showProbes, setShowProbes] = useState(true);
  const [showBelts, setShowBelts] = useState(true);

  useEffect(() => {
    let engine: SolarEngine;
    try {
      engine = new SolarEngine(ref.current!, skyData as unknown as SkyData, names, {
        onSelect: (id) => {
          setSelected(id);
          if (id) setProbeId(null);
        },
        onTick: setDate,
        onProbe: (id) => {
          setProbeId(id);
          engine.flyToProbe(id);
        },
      });
    } catch {
      setFailed(true);
      return;
    }
    engine.speed = SPEEDS.find((s) => s.id === 'day')!.days;
    engineRef.current = engine;
    return () => {
      engine.destroy();
      engineRef.current = null;
    };
    // Nur einmal anlegen; Namen und Tempo werden unten nachgeführt
  }, []);

  useEffect(() => {
    engineRef.current?.setNames(names);
  }, [names]);

  // Ziel aus der URL, z. B. aus dem Lexikon
  useEffect(() => {
    if (!focus || !(focus in BODY)) return;
    const id = window.setTimeout(() => engineRef.current?.select(focus as SolarId, true), 300);
    return () => window.clearTimeout(id);
  }, [focus]);

  // Raumsonde aus der URL (z. B. aus dem Live-Bereich): warten, bis die Bahndaten geladen sind
  useEffect(() => {
    if (!probe) return;
    let tries = 0;
    const id = window.setInterval(() => {
      const e = engineRef.current;
      if (e?.flyToProbe(probe) || ++tries > 40) {
        window.clearInterval(id);
        if (e?.probe(probe)) setProbeId(probe);
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [probe]);

  useEffect(() => {
    engineRef.current?.setExtras({ probes: showProbes, belts: showBelts });
  }, [showProbes, showBelts]);

  useEffect(() => {
    const e = engineRef.current;
    if (e) e.speed = SPEEDS.find((s) => s.id === speed)!.days;
    if (speed !== 'pause') lastSpeed.current = speed;
  }, [speed]);

  const pick = (id: SolarId) => {
    setPanel(null);
    engineRef.current?.select(id, true);
  };

  const jump = (days: number | 'today') => {
    const e = engineRef.current;
    if (!e) return;
    e.setTime(days === 'today' ? Date.now() : e.time + days * 86_400_000);
  };

  if (failed) {
    return (
      <div className="solar solar--failed">
        <p className="muted">{t('solar.noWebgl')}</p>
      </div>
    );
  }

  return (
    <div className="solar">
      <div ref={ref} className="solar-stage" />

      <div className="sky-top solar-top">
        <button className={`sky-chip ${speed === 'pause' ? 'is-shifted' : ''}`} onClick={() => setPanel(panel === 'time' ? null : 'time')}>
          <Clock size={15} />
          <span>
            {fmtDate(date, tz, lang)} · {t(`solar.speed.${speed}`)}
          </span>
        </button>
      </div>

      <p className="solar-hint">{t('solar.hint')}</p>

      <div className="solar-strip" role="toolbar" aria-label={t('solar.bodies')}>
        {PLANET_ORDER.map((id) => (
          <button key={id} className={`solar-chip ${selected === id || BODY[selected ?? 'sun']?.parent === id ? 'is-on' : ''}`} onClick={() => pick(id)}>
            <PlanetGlyph id={id as BodyId | 'earth' | 'pluto'} size={20} />
            <span>{t(`solar.name.${id}` as MsgKey)}</span>
          </button>
        ))}
      </div>

      <nav className="sky-tools solar-tools" aria-label={t('sky.tools')}>
        <button className="tool" onClick={() => setSpeed(speed === 'pause' ? lastSpeed.current : 'pause')} aria-pressed={speed !== 'pause'}>
          {speed === 'pause' ? <Play size={20} /> : <Pause size={20} />}
          <span>{speed === 'pause' ? t('solar.play') : t('solar.pause')}</span>
        </button>
        <button className={`tool ${panel === 'time' ? 'is-on' : ''}`} onClick={() => setPanel(panel === 'time' ? null : 'time')}>
          <Clock size={20} />
          <span>{t('solar.tempo')}</span>
        </button>
        <button className={`tool ${panel === 'scale' ? 'is-on' : ''}`} onClick={() => setPanel(panel === 'scale' ? null : 'scale')}>
          <Ruler size={20} />
          <span>{t(`solar.mode.${mode}`)}</span>
        </button>
        <button className="tool" onClick={() => engineRef.current?.home()}>
          <Home size={20} />
          <span>{t('solar.home')}</span>
        </button>
      </nav>

      {panel === 'time' && (
        <Sheet title={t('solar.timeTitle')} onClose={() => setPanel(null)} closeLabel={t('common.close')}>
          <p className="time-now">{fmtDate(date, tz, lang)}</p>
          <div className="option-grid">
            {SPEEDS.map((s) => (
              <button key={s.id} className={`option ${speed === s.id ? 'is-on' : ''}`} onClick={() => setSpeed(s.id)}>
                {t(`solar.speed.${s.id}`)}
              </button>
            ))}
          </div>
          <div className="btn-row" style={{ marginTop: 16 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => jump(-365.25)}>
              −1 {t('solar.year')}
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => jump('today')}>
              {t('common.today')}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => jump(365.25)}>
              +1 {t('solar.year')}
            </button>
          </div>
        </Sheet>
      )}

      {panel === 'scale' && (
        <Sheet title={t('solar.scaleTitle')} onClose={() => setPanel(null)} closeLabel={t('common.close')}>
          <ul className="mode-list">
            {MODES.map((m) => (
              <li key={m}>
                <button
                  className={`mode ${mode === m ? 'is-on' : ''}`}
                  onClick={() => {
                    setMode(m);
                    engineRef.current?.setMode(m);
                    setPanel(null);
                  }}
                >
                  <strong>{t(`solar.mode.${m}`)}</strong>
                  <span className="muted small">{t(`solar.mode.${m}Text`)}</span>
                </button>
              </li>
            ))}
          </ul>
          <ul className="toggle-list solar-extras">
            <li>
              <label className="toggle">
                <span>{t('solar.showProbes')}</span>
                <input type="checkbox" checked={showProbes} onChange={(e) => setShowProbes(e.target.checked)} />
                <span className="switch" aria-hidden="true" />
              </label>
            </li>
            <li>
              <label className="toggle">
                <span>{t('solar.showBelts')}</span>
                <input type="checkbox" checked={showBelts} onChange={(e) => setShowBelts(e.target.checked)} />
                <span className="switch" aria-hidden="true" />
              </label>
            </li>
          </ul>
          <p className="muted small">{t('solar.beltsLegend')}</p>
          <a className="link" href="#/system/nachbarn">
            {t('nb.title')} <ArrowRight size={15} />
          </a>
        </Sheet>
      )}

      {probeId && !selected && !panel && (
        <Sheet title={engineRef.current?.probe(probeId)?.name[lang] ?? ''} onClose={() => setProbeId(null)} closeLabel={t('common.close')}>
          <ProbeInfo id={probeId} engine={engineRef.current} date={date} />
        </Sheet>
      )}

      {selected && !panel && (
        <Sheet title={t(`solar.name.${selected}` as MsgKey)} onClose={() => engineRef.current?.select(null)} closeLabel={t('common.close')}>
          <BodyInfo id={selected} engine={engineRef.current} onPick={pick} />
        </Sheet>
      )}
    </div>
  );
}

function BodyInfo({ id, engine, onPick }: { id: SolarId; engine: SolarEngine | null; onPick: (id: SolarId) => void }) {
  const { t, lang } = useI18n();
  const def = BODY[id];
  const text = def.text[lang];
  const live = engine?.info(id) ?? { sunAu: null, earthAu: null };
  const au = (x: number) => `${fmtNum(x, lang, x < 10 ? 2 : 1)} AE · ${fmtInt((x * 149_597_870.7) / 1e6, lang)} ${t('unit.mioKm')}`;
  const year = (d: number) => (d < 1000 ? t('solar.days', { n: fmtNum(d, lang, d < 100 ? 1 : 0) }) : t('solar.years', { n: fmtNum(d / 365.25, lang, 1) }));
  const moons = def.type !== 'moon' ? BODIES_BY_PARENT[id] ?? [] : [];

  return (
    <div className="info">
      <p className="info-type">
        {t(`solar.type.${def.type}`)} · {text.tagline}
      </p>
      <p className="muted">{text.about}</p>
      <dl className="detail-grid">
        <dt>{t('solar.stat.diameter')}</dt>
        <dd>
          {fmtInt(def.radiusKm * 2, lang)} km
          {id !== 'earth' && ` · ${t('solar.timesEarth', { x: fmtNum(def.radiusKm / EARTH_RADIUS_KM, lang, def.radiusKm < EARTH_RADIUS_KM ? 2 : 1) })}`}
        </dd>
        {live.sunAu != null && (
          <>
            <dt>{t('solar.stat.sunDist')}</dt>
            <dd>{au(live.sunAu)}</dd>
            <dt>{t('solar.stat.light')}</dt>
            <dd>{t('solar.minutes', { n: fmtNum((live.sunAu * 499.005) / 60, lang, 1) })}</dd>
          </>
        )}
        {live.earthAu != null && (
          <>
            <dt>{t('solar.stat.earthDist')}</dt>
            <dd>{au(live.earthAu)}</dd>
          </>
        )}
        {def.type === 'moon' && (
          <>
            <dt>{t('solar.stat.parentDist')}</dt>
            <dd>{fmtInt(def.orbitKm!, lang)} km</dd>
            <dt>{t('solar.stat.period')}</dt>
            <dd>{year(def.periodD!)}</dd>
          </>
        )}
        {def.facts && (
          <>
            {def.facts.yearD && (
              <>
                <dt>{t('solar.stat.year')}</dt>
                <dd>{year(def.facts.yearD)}</dd>
              </>
            )}
            <dt>{t('solar.stat.day')}</dt>
            <dd>{def.facts.dayLabel[lang]}</dd>
            {def.facts.moons && (
              <>
                <dt>{t('solar.stat.moons')}</dt>
                <dd>{def.facts.moons}</dd>
              </>
            )}
            <dt>{t('solar.stat.temp')}</dt>
            <dd>{lang === 'en' ? def.facts.tempC.replace(' bis ', ' to ').replace('.', ',') : def.facts.tempC}</dd>
            <dt>{t('solar.stat.gravity')}</dt>
            <dd>
              {fmtNum(def.facts.gravity, lang, 1)} m/s²
              <small className="block muted">{t('solar.weight', { kg: fmtInt((70 * def.facts.gravity) / BODY.earth.facts!.gravity, lang) })}</small>
            </dd>
          </>
        )}
      </dl>
      {text.fact && (
        <div className="fun-fact">
          <strong>{t('solar.didYouKnow')}</strong>
          <p>{text.fact}</p>
        </div>
      )}
      {moons.length > 0 && (
        <div className="moon-chips">
          {moons.map((m) => (
            <button key={m} className="chip" onClick={() => onPick(m)}>
              {t(`solar.name.${m}` as MsgKey)}
            </button>
          ))}
        </div>
      )}
      {SKY_BODIES.has(id) && (
        <a className="link" href={`#/sky?focus=body:${id}`}>
          {t('common.showInSky')} <ArrowRight size={15} />
        </a>
      )}
    </div>
  );
}

const BODIES_BY_PARENT: Partial<Record<SolarId, SolarId[]>> = {
  earth: ['moon'],
  jupiter: ['io', 'europa', 'ganymede', 'callisto'],
  saturn: ['titan'],
  pluto: ['charon'],
};

/** Steckbrief einer Raumsonde zur Zeit der Simulation */
function ProbeInfo({ id, engine, date }: { id: string; engine: SolarEngine | null; date: Date }) {
  const { t, lang } = useI18n();
  const p = engine?.probe(id);
  if (!p) return null;
  const km = distanceFromEarthKm(p, date);
  const v = speedKms(p, date);
  return (
    <div className="info">
      <p className="info-type">
        {p.agency} · {t('probes.since', { year: p.launch.slice(0, 4) })}
      </p>
      <p className="muted">{p.status[lang]}</p>
      <dl className="detail-grid">
        {km != null && (
          <>
            <dt>{t('probes.fromEarth')}</dt>
            <dd>{fmtKm(km, lang)}</dd>
            <dt>{t('probes.signal')}</dt>
            <dd>{fmtLightTime(lightTimeSeconds(km), lang)}</dd>
          </>
        )}
        {v != null && (
          <>
            <dt>{t('probes.speed')}</dt>
            <dd>{fmtNum(v, lang, 1)} km/s</dd>
          </>
        )}
      </dl>
      <a className="link" href="#/live#probes">
        {t('probes.toLive')} <ArrowRight size={15} />
      </a>
    </div>
  );
}
