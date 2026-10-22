import { useEffect, useMemo, useRef, useState } from 'react';
import { geoEquirectangular, geoGraticule10, geoPath } from 'd3-geo';
import { Map as MapIcon, Pause, Play, Sun } from 'lucide-react';
import { useI18n } from '../../i18n';
import { useSettings } from '../../state/settings';
import { observerOf } from '../../lib/astro';
import { LAND } from '../../lib/live/land';
import { centralLine, earthShadow, lunarEclipses, solarEclipses, sunMoonDisks, transits, type LocalCircumstances, type LunarEclipse, type SolarEclipse } from '../../lib/observe/eclipses';
import { fmtDate, fmtDateTime, fmtNum, fmtTime } from '../../lib/format';
import { ToolHead } from './ObserveView';

type Tab = 'solar' | 'lunar' | 'transits';

export function EclipsesPage() {
  const { t } = useI18n();
  const { settings } = useSettings();
  const place = settings.place!;
  const [tab, setTab] = useState<Tab>('solar');
  const obs = useMemo(() => observerOf(place), [place]);
  const solar = useMemo(() => solarEclipses(new Date(), 10, obs), [obs]);
  const lunar = useMemo(() => lunarEclipses(new Date(), 10, obs), [obs]);

  return (
    <div className="page observe">
      <ToolHead eyebrow={t('observe.tool.eclipses')} title={t('ecl.title')} lead={t('ecl.lead')} />
      <div className="segmented ecl-tabs" role="tablist">
        {(['solar', 'lunar', 'transits'] as Tab[]).map((k) => (
          <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'is-on' : ''} onClick={() => setTab(k)}>
            {t(`ecl.tab.${k}`)}
          </button>
        ))}
      </div>
      {tab === 'solar' && (
        <div className="ecl-list">
          {solar.map((e) => (
            <SolarCard key={e.peak.getTime()} e={e} />
          ))}
        </div>
      )}
      {tab === 'lunar' && (
        <div className="ecl-list">
          {lunar.map((e) => (
            <LunarCard key={e.peak.getTime()} e={e} />
          ))}
        </div>
      )}
      {tab === 'transits' && <Transits />}
      <p className="note">{t('ecl.source')}</p>
    </div>
  );
}

function SolarCard({ e }: { e: SolarEclipse }) {
  const { t, lang } = useI18n();
  const { settings } = useSettings();
  const tz = settings.place!.tz;
  const [show, setShow] = useState<null | 'map' | 'sim'>(null);
  const central = e.kind === 'total' || e.kind === 'annular';
  const l = e.local;
  return (
    <article className="card ecl-card">
      <div className="ecl-head">
        <span className={`badge ecl-kind ecl-kind--${e.kind}`}>{t(`ecl.kind.${e.kind}`)}</span>
        <h3>{fmtDate(e.peak, tz, lang)}</h3>
      </div>
      {e.lat != null && e.lon != null && <p className="muted small">{t('ecl.greatest', { lat: fmtNum(e.lat, lang, 0), lon: fmtNum(e.lon, lang, 0) })}</p>}
      <p className={`ecl-local ${l?.visible ? 'is-visible' : ''}`}>
        <Sun size={15} />
        {l?.visible
          ? t('ecl.localSolar', {
              pct: Math.round(l.obscuration * 100),
              from: fmtTime(l.begin.t, tz, lang),
              to: fmtTime(l.end.t, tz, lang),
              alt: Math.round(Math.max(l.peak.alt, 0)),
            })
          : t('ecl.notHere')}
      </p>
      {l?.visible && l.totalBegin && l.totalEnd && (
        <p className="ecl-total">{t(e.kind === 'annular' ? 'ecl.annularHere' : 'ecl.totalHere', { from: fmtTime(l.totalBegin.t, tz, lang), sec: Math.round((l.totalEnd.t.getTime() - l.totalBegin.t.getTime()) / 1000) })}</p>
      )}
      <div className="btn-row ecl-actions">
        {central && (
          <button className={`btn btn-sm ${show === 'map' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setShow(show === 'map' ? null : 'map')}>
            <MapIcon size={15} /> {t('ecl.map')}
          </button>
        )}
        {l?.visible && (
          <button className={`btn btn-sm ${show === 'sim' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setShow(show === 'sim' ? null : 'sim')}>
            <Play size={15} /> {t('ecl.simulate')}
          </button>
        )}
      </div>
      {show === 'map' && <PathMap e={e} />}
      {show === 'sim' && l && <SolarSim local={l} />}
    </article>
  );
}

/** Weltkarte mit der Zentrallinie (Totalität bzw. Ringförmigkeit) und dem eigenen Ort */
function PathMap({ e }: { e: SolarEclipse }) {
  const { t } = useI18n();
  const { settings } = useSettings();
  const place = settings.place!;
  const W = 720;
  const H = 360;
  const line = useMemo(() => centralLine(e.peak), [e.peak]);
  const proj = useMemo(() => geoEquirectangular().fitSize([W, H], { type: 'Sphere' }), []);
  const path = geoPath(proj);
  // Linie an der Datumsgrenze auftrennen
  const segments: [number, number][][] = [];
  for (const p of line) {
    const last = segments[segments.length - 1];
    const prev = last?.[last.length - 1];
    if (!last || (prev && Math.abs(prev[0] - p.lon) > 180)) segments.push([[p.lon, p.lat]]);
    else last.push([p.lon, p.lat]);
  }
  const me = proj([place.lon, place.lat]);
  const gm = e.lat != null && e.lon != null ? proj([e.lon, e.lat]) : null;
  return (
    <figure className="ecl-map">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={t('ecl.mapLabel')}>
        <path d={path({ type: 'Sphere' }) ?? ''} className="map-sphere" />
        <path d={path(geoGraticule10()) ?? ''} className="map-grid" />
        <path d={path(LAND) ?? ''} className="map-land" />
        {segments.map((s, i) => (
          <path key={i} d={path({ type: 'LineString', coordinates: s }) ?? ''} className={`ecl-path ecl-path--${e.kind}`} />
        ))}
        {gm && <circle cx={gm[0]} cy={gm[1]} r={5} className="ecl-gm" />}
        {me && <circle cx={me[0]} cy={me[1]} r={4} className="map-me" />}
      </svg>
      <figcaption className="muted small">{t(e.kind === 'annular' ? 'ecl.mapAnnular' : 'ecl.mapTotal')}</figcaption>
    </figure>
  );
}

/** Simulator: Sonne und Mond, wie sie am eigenen Ort aneinander vorbeiziehen */
function SolarSim({ local }: { local: LocalCircumstances }) {
  const { t, lang } = useI18n();
  const { settings } = useSettings();
  const place = settings.place!;
  const obs = useMemo(() => observerOf(place), [place]);
  const t0 = local.begin.t.getTime() - 10 * 60_000;
  const t1 = local.end.t.getTime() + 10 * 60_000;
  const [time, setTime] = useState(local.peak.t.getTime());
  const [playing, setPlaying] = useState(false);
  const raf = useRef(0);
  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    const step = (now: number) => {
      // Die ganze Finsternis in etwa 20 Sekunden
      setTime((x) => {
        const next = x + ((now - last) / 20_000) * (t1 - t0);
        return next > t1 ? t0 : next;
      });
      last = now;
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [playing, t0, t1]);

  const g = sunMoonDisks(new Date(time), obs);
  const S = 100;
  const k = (S * 0.42) / g.sunR;
  // Himmel wird mit zunehmender Bedeckung dunkler (stark erst ab ~90 %)
  const dark = Math.pow(g.obscuration, 6);
  const sky = `rgb(${Math.round(70 - 65 * dark)},${Math.round(130 - 122 * dark)},${Math.round(200 - 180 * dark)})`;
  return (
    <div className="ecl-sim">
      <svg viewBox={`${-S} ${-S} ${2 * S} ${2 * S}`} role="img" aria-label={t('ecl.simulate')}>
        <rect x={-S} y={-S} width={2 * S} height={2 * S} fill={g.sunAlt > 0 ? sky : '#1b1d2a'} />
        {g.obscuration > 0.995 && <circle r={g.sunR * k * 2.4} fill="url(#corona)" />}
        <defs>
          <radialGradient id="corona">
            <stop offset="0.4" stopColor="rgba(255,255,255,0.9)" />
            <stop offset="1" stopColor="rgba(200,220,255,0)" />
          </radialGradient>
        </defs>
        <circle r={g.sunR * k} fill="#ffd36b" />
        <circle cx={-g.dx * k} cy={-g.dy * k} r={g.moonR * k} fill={g.sunAlt > 0 ? '#11131c' : '#2a2c3a'} />
        {g.sunAlt <= 0 && (
          <text y={S - 12} textAnchor="middle" className="ecl-sim-note">
            {t('ecl.sunDown')}
          </text>
        )}
      </svg>
      <div className="ecl-sim-controls">
        <button className="icon-btn" onClick={() => setPlaying((p) => !p)} aria-label={playing ? t('ecl.pause') : t('ecl.play')}>
          {playing ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <input className="range" type="range" min={t0} max={t1} step={30_000} value={time} onChange={(e) => setTime(Number(e.target.value))} aria-label={t('ecl.simTime')} />
      </div>
      <p className="ecl-sim-readout">
        <strong>{fmtTime(new Date(time), place.tz, lang)}</strong> · {t('ecl.covered', { pct: Math.round(g.obscuration * 100) })} · {t('ecl.sunAlt', { alt: Math.round(g.sunAlt) })}
      </p>
      <p className="muted small">{t('ecl.safety')}</p>
    </div>
  );
}

function LunarCard({ e }: { e: LunarEclipse }) {
  const { t, lang } = useI18n();
  const { settings } = useSettings();
  const tz = settings.place!.tz;
  const [show, setShow] = useState(false);
  const visible = e.moonAlt > 0;
  const minutes = (m: number) => Math.round(m * 2);
  return (
    <article className="card ecl-card">
      <div className="ecl-head">
        <span className={`badge ecl-kind ecl-kind--${e.kind}`}>{t(`ecl.kind.${e.kind}`)}</span>
        <h3>{fmtDate(e.peak, tz, lang)}</h3>
      </div>
      <p className={`ecl-local ${visible ? 'is-visible' : ''}`}>
        {visible ? t('ecl.localLunar', { time: fmtTime(e.peak, tz, lang), alt: Math.round(e.moonAlt) }) : t('ecl.moonDown', { time: fmtDateTime(e.peak, tz, lang) })}
      </p>
      <p className="muted small">
        {e.sdTotal > 0 && `${t('ecl.totality')} ${minutes(e.sdTotal)} min · `}
        {e.sdPartial > 0 && `${t('ecl.partialPhase')} ${minutes(e.sdPartial)} min · `}
        {t('ecl.penumbral')} {minutes(e.sdPenum)} min
      </p>
      <div className="btn-row ecl-actions">
        <button className={`btn btn-sm ${show ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setShow(!show)}>
          <Play size={15} /> {t('ecl.shadowDiagram')}
        </button>
      </div>
      {show && <ShadowDiagram e={e} />}
    </article>
  );
}

/** Weg des Mondes durch Halb- und Kernschatten der Erde */
function ShadowDiagram({ e }: { e: LunarEclipse }) {
  const { t, lang } = useI18n();
  const { settings } = useSettings();
  const tz = settings.place!.tz;
  const center = earthShadow(e.peak);
  const steps = useMemo(() => {
    const out = [];
    const half = Math.ceil(e.sdPenum / 30) * 30;
    for (let m = -half; m <= half; m += 30) out.push({ m, g: earthShadow(new Date(e.peak.getTime() + m * 60_000)) });
    return out;
  }, [e]);
  const S = 100;
  const k = (S * 0.85) / Math.max(center.penumbra + center.moonR * 2, 60);
  return (
    <figure className="ecl-shadow">
      <svg viewBox={`${-S} ${-S} ${2 * S} ${2 * S}`} role="img" aria-label={t('ecl.shadowDiagram')}>
        <rect x={-S} y={-S} width={2 * S} height={2 * S} fill="#05060f" />
        <circle r={center.penumbra * k} fill="rgba(120,130,170,0.25)" />
        <circle r={center.umbra * k} fill="rgba(120,40,30,0.55)" />
        {steps.map(({ m, g }) => (
          <g key={m}>
            <circle cx={-g.dx * k} cy={-g.dy * k} r={g.moonR * k} fill={m === 0 ? 'rgba(255,170,120,0.85)' : 'rgba(230,230,220,0.18)'} stroke="rgba(255,255,255,0.35)" strokeWidth={0.4} />
          </g>
        ))}
      </svg>
      <figcaption className="muted small">{t('ecl.shadowCaption', { time: fmtTime(e.peak, tz, lang), pct: fmtNum(e.obscuration * 100, lang, 0) })}</figcaption>
    </figure>
  );
}

function Transits() {
  const { t, lang } = useI18n();
  const { settings } = useSettings();
  const tz = settings.place!.tz;
  const list = useMemo(() => transits(new Date()), []);
  return (
    <div className="ecl-list">
      {list.map((x) => (
        <article key={x.body} className="card ecl-card">
          <div className="ecl-head">
            <span className="badge">{t(`body.${x.body}` as 'body.venus')}</span>
            <h3>{fmtDate(x.peak, tz, lang)}</h3>
          </div>
          <p className="muted">{t(`ecl.transit.${x.body}` as 'ecl.transit.venus', { from: fmtDateTime(x.start, tz, lang), to: fmtTime(x.finish, tz, lang) })}</p>
        </article>
      ))}
      <p className="muted small">{t('ecl.transitNote')}</p>
    </div>
  );
}
