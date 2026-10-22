import { useEffect, useMemo, useRef, useState } from 'react';
import { BookMarked, FlipVertical2, LocateFixed, X } from 'lucide-react';
import { useI18n, type MsgKey } from '../../i18n';
import { useNow } from '../../lib/useNow';
import { MOON_FEATURES, type MoonFeature } from '../../lib/observe/moonFeatures';
import { moonGeometry, sunAltitudeAt, selVec } from '../../lib/observe/moonGeometry';
import { fmtDate, fmtInt, fmtNum } from '../../lib/format';
import { useSettings } from '../../state/settings';
import { ToolHead } from './ObserveView';
import { MoonEngine } from './moonEngine';

const GROUPS: { key: string; types: MoonFeature['type'][] }[] = [
  { key: 'maria', types: ['mare'] },
  { key: 'craters', types: ['crater'] },
  { key: 'relief', types: ['mons', 'vallis', 'rima', 'other'] },
  { key: 'landings', types: ['landing'] },
];

/** Mondatlas: 3D-Mond mit Namen, aktueller Lichtgrenze und Landeplätzen */
export default function MoonAtlas({ feature }: { feature: string | null }) {
  const { t, lang } = useI18n();
  const { settings } = useSettings();
  const tz = settings.place!.tz;
  const host = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const engine = useRef<MoonEngine | null>(null);
  const now = useNow(5 * 60_000);
  const [days, setDays] = useState(0);
  const [selected, setSelected] = useState<string | null>(feature);
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [flipped, setFlipped] = useState(false);
  const date = useMemo(() => new Date(now.getTime() + days * 86_400_000), [now, days]);
  const g = useMemo(() => moonGeometry(date), [date]);
  const nameOf = (f: MoonFeature) => (lang === 'de' && f.de ? f.de : f.name);

  useEffect(() => {
    const e = new MoonEngine(host.current!, layer.current!, MOON_FEATURES, nameOf, setSelected);
    engine.current = e;
    e.setGeometry(moonGeometry(new Date()), true);
    if (feature) e.focus(feature);
    return () => {
      e.dispose();
      engine.current = null;
    };
    // Engine nur einmal anlegen; Sprache und Zeit werden unten nachgeführt
  }, [lang]);

  useEffect(() => {
    engine.current?.setGeometry(g, false);
  }, [g]);

  useEffect(() => {
    engine.current?.select(selected);
  }, [selected]);

  useEffect(() => {
    const e = engine.current;
    if (!e) return;
    e.filter = new Set(GROUPS.filter((gr) => !hidden.has(gr.key)).flatMap((gr) => gr.types));
    e.invalidate();
  }, [hidden]);

  // An der Lichtgrenze: niedrige Sonne wirft lange Schatten – dort sieht man Relief am besten
  const terminator = useMemo(() => {
    const e = selVec(g.earth.lat, g.earth.lon);
    return MOON_FEATURES.filter((f) => {
      if (f.visibility > 3 || f.type === 'landing') return false;
      const p = selVec(f.lat, f.lon);
      if (p[0] * e[0] + p[1] * e[1] + p[2] * e[2] < 0.25) return false;
      const alt = sunAltitudeAt(g, f.lat, f.lon);
      return alt > 0.3 && alt < 12;
    }).sort((a, b) => (b.diameter ?? 0) - (a.diameter ?? 0));
  }, [g]);

  const sel = MOON_FEATURES.find((f) => f.id === selected) ?? null;
  const selAlt = sel ? sunAltitudeAt(g, sel.lat, sel.lon) : 0;
  const waxing = g.phase < 180;
  const libLon = g.earth.lon;
  const libLat = g.earth.lat;

  return (
    <div className="page observe moon-page">
      <ToolHead eyebrow={t('observe.tool.moon')} title={t('moon.title')} lead={t('moon.lead')} />

      <div className="moon-stage" ref={host}>
        <div className="moon-labels" ref={layer} />
        <div className="moon-tools">
          <button className="icon-btn" onClick={() => engine.current?.setGeometry(g, true)} aria-label={t('moon.earthView')} title={t('moon.earthView')}>
            <LocateFixed size={18} />
          </button>
          <button
            className={`icon-btn ${flipped ? 'is-on' : ''}`}
            onClick={() => {
              setFlipped(!flipped);
              engine.current?.setFlipped(!flipped);
            }}
            aria-pressed={flipped}
            aria-label={t('moon.flip')}
            title={t('moon.flip')}
          >
            <FlipVertical2 size={18} />
          </button>
        </div>
        {sel && (
          <div className="moon-info card">
            <button className="icon-btn" onClick={() => setSelected(null)} aria-label={t('common.close')}>
              <X size={16} />
            </button>
            <p className="card-kicker">{t(`moon.type.${sel.type}` as MsgKey)}</p>
            <strong>{nameOf(sel)}</strong>
            {lang === 'de' && sel.de && <span className="muted small">{sel.name}</span>}
            <p className="small">{sel.info[lang]}</p>
            <p className="muted small">
              {sel.diameter ? `${fmtInt(sel.diameter, lang)} km · ` : ''}
              {sel.mission ? `${fmtDate(new Date(sel.mission.date), 'UTC', lang)} · ${sel.mission.agency} · ` : ''}
              {selAlt > 0 ? t('moon.sunAlt', { alt: fmtNum(selAlt, lang, 0) }) : t('moon.dark')}
            </p>
            <a className="link small" href={`#/tagebuch/neu?obj=${encodeURIComponent(nameOf(sel))}`}>
              <BookMarked size={14} /> {t('diary.addFromSky')}
            </a>
          </div>
        )}
      </div>

      <div className="moon-bar">
        <p>
          <strong>{t('moon.lit', { pct: Math.round(g.illumination * 100) })}</strong> · {waxing ? t('moon.waxing') : t('moon.waning')} · {fmtDate(date, tz, lang)}
        </p>
        <input className="range" type="range" min={-15} max={15} step={0.25} value={days} onChange={(e) => setDays(Number(e.target.value))} aria-label={t('moon.timeSlider')} />
        <div className="range-labels">
          <span>−15 {t('moon.days')}</span>
          <button className="link" onClick={() => setDays(0)}>
            {t('sky.now')}
          </button>
          <span>+15 {t('moon.days')}</span>
        </div>
        <div className="filter-chips">
          {GROUPS.map((gr) => (
            <button
              key={gr.key}
              className={`chip ${hidden.has(gr.key) ? '' : 'is-on'}`}
              onClick={() => {
                const n = new Set(hidden);
                if (n.has(gr.key)) n.delete(gr.key);
                else n.add(gr.key);
                setHidden(n);
              }}
            >
              {t(`moon.group.${gr.key}` as MsgKey)}
            </button>
          ))}
        </div>
      </div>

      <div className="duo">
        <section className="card">
          <p className="card-kicker">{t('moon.terminator')}</p>
          <p className="muted small">{t('moon.terminatorText')}</p>
          <div className="chips moon-term">
            {terminator.slice(0, 14).map((f) => (
              <button key={f.id} className="chip" onClick={() => engine.current?.focus(f.id)}>
                {nameOf(f)}
              </button>
            ))}
            {!terminator.length && <span className="muted small">{t('moon.terminatorNone')}</span>}
          </div>
        </section>
        <section className="card">
          <p className="card-kicker">{t('moon.libration')}</p>
          <p className="muted small">
            {t('moon.librationText', {
              lon: fmtNum(Math.abs(libLon), lang, 1),
              ew: libLon >= 0 ? t('moon.east') : t('moon.west'),
              lat: fmtNum(Math.abs(libLat), lang, 1),
              ns: libLat >= 0 ? t('moon.north') : t('moon.south'),
            })}
          </p>
          <dl className="detail-grid">
            <dt>{t('moon.colongitude')}</dt>
            <dd>{fmtNum(g.colongitude, lang, 1)}°</dd>
            <dt>{t('moon.distance')}</dt>
            <dd>{fmtInt(g.distanceKm, lang)} km</dd>
          </dl>
        </section>
      </div>
      <p className="note">{t('moon.source')}</p>
    </div>
  );
}
