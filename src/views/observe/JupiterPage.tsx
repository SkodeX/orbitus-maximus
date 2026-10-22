import { useMemo, useState } from 'react';
import * as A from 'astronomy-engine';
import { ArrowRight } from 'lucide-react';
import { useI18n } from '../../i18n';
import { useSettings } from '../../state/settings';
import { useNow } from '../../lib/useNow';
import { observerOf } from '../../lib/astro';
import { JUPITER_FLATTENING, jupiterEvents, jupiterView, MOONS, type MoonId } from '../../lib/observe/jupiterMoons';
import { fmtDateTime, fmtNum, fmtTime } from '../../lib/format';
import { ToolHead } from './ObserveView';
import { SaturnSection } from './SaturnSection';

export const MOON_COLORS: Record<MoonId, string> = { io: '#ffd36b', europa: '#cfe0ff', ganymede: '#c9b8a6', callisto: '#9aa2c0' };

/** Jupiter mit seinen Monden, wie im Teleskop (Norden oben, Osten links) */
function JupiterDiagram({ date }: { date: Date }) {
  const { t } = useI18n();
  const v = jupiterView(date);
  const maxX = Math.max(16, ...v.moons.map((m) => Math.abs(m.x) + 2));
  const W = 2 * maxX;
  return (
    <svg className="jup-diagram" viewBox={`${-maxX} -4 ${W} 8`} role="img" aria-label={t('jup.diagramLabel')}>
      <line x1={-maxX} x2={maxX} y1={0} y2={0} stroke="rgba(255,255,255,0.06)" strokeWidth={0.05} />
      <g transform={`rotate(${-v.poleAngle})`}>
        <ellipse rx={1} ry={JUPITER_FLATTENING} fill="#e3c9a3" />
        <rect x={-1} y={-0.32} width={2} height={0.14} fill="#b48a62" opacity={0.8} />
        <rect x={-1} y={0.12} width={2} height={0.16} fill="#b48a62" opacity={0.8} />
      </g>
      {v.moons.map((m) =>
        m.shadow ? <circle key={`s-${m.id}`} cx={-m.shadow.x} cy={-m.shadow.y} r={0.12} fill="#000" /> : null,
      )}
      {v.moons
        .filter((m) => !m.occulted)
        .map((m) => (
          <g key={m.id} opacity={m.eclipsed ? 0.25 : 1}>
            <circle cx={-m.x} cy={-m.y} r={0.3} fill={MOON_COLORS[m.id]} />
            <text x={-m.x} y={-m.y + (m.id === 'europa' || m.id === 'callisto' ? 1.2 : -0.7)} className="jup-label">
              {t(`jup.moon.${m.id}`).slice(0, 1)}
            </text>
          </g>
        ))}
      <text x={-maxX + 0.4} y={3.4} className="jup-dir">
        {t('jup.east')}
      </text>
      <text x={maxX - 0.4} y={3.4} className="jup-dir" textAnchor="end">
        {t('jup.west')}
      </text>
    </svg>
  );
}

/** Klassisches „Jupitermond-Diagramm“: Zeit nach unten, Abstand von Jupiter waagerecht */
function MoonChart({ from, hours }: { from: Date; hours: number }) {
  const { lang } = useI18n();
  const { settings } = useSettings();
  const tz = settings.place!.tz;
  const step = 20; // Minuten
  const samples = useMemo(() => {
    const out: { t: number; xs: Record<MoonId, number>; z: Record<MoonId, number> }[] = [];
    for (let m = 0; m <= hours * 60; m += step) {
      const d = new Date(from.getTime() + m * 60_000);
      const v = jupiterView(d);
      const xs = {} as Record<MoonId, number>;
      const z = {} as Record<MoonId, number>;
      for (const mo of v.moons) {
        xs[mo.id] = mo.x;
        z[mo.id] = mo.z;
      }
      out.push({ t: d.getTime(), xs, z });
    }
    return out;
  }, [from, hours]);
  const X = 28;
  const H = 100;
  const y = (i: number) => (i / (samples.length - 1)) * H;
  return (
    <svg className="jup-chart" viewBox={`${-X} -4 ${2 * X} ${H + 8}`} preserveAspectRatio="none" role="img">
      <rect x={-1} y={0} width={2} height={H} fill="rgba(227,201,163,0.35)" />
      {samples.map((s, i) =>
        i % (360 / step) === 0 ? (
          <g key={s.t}>
            <line x1={-X} x2={X} y1={y(i)} y2={y(i)} stroke="rgba(255,255,255,0.08)" strokeWidth={0.15} />
            <text x={-X + 0.5} y={y(i) - 0.6} className="jup-time">
              {fmtTime(new Date(s.t), tz, lang)}
            </text>
          </g>
        ) : null,
      )}
      {MOONS.map((id) => (
        <path
          key={id}
          d={samples.map((s, i) => `${i ? 'L' : 'M'}${-s.xs[id]},${y(i)}`).join(' ')}
          fill="none"
          stroke={MOON_COLORS[id]}
          strokeWidth={0.45}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

export function JupiterPage() {
  const { t, lang } = useI18n();
  const { settings } = useSettings();
  const place = settings.place!;
  const now = useNow(60_000);
  const [offsetH, setOffsetH] = useState(0);
  const date = new Date(now.getTime() + offsetH * 3_600_000);
  const v = jupiterView(date);
  const events = useMemo(() => jupiterEvents(new Date(Math.floor(now.getTime() / 600_000) * 600_000), 72), [Math.floor(now.getTime() / 600_000)]);

  const obs = observerOf(place);
  const eq = A.Equator(A.Body.Jupiter, date, obs, true, true);
  const alt = A.Horizon(date, obs, eq.ra, eq.dec, 'normal').altitude;
  const sunEq = A.Equator(A.Body.Sun, date, obs, true, true);
  const sunAlt = A.Horizon(date, obs, sunEq.ra, sunEq.dec, 'normal').altitude;

  return (
    <div className="page observe">
      <ToolHead eyebrow={t('observe.tool.jupiter')} title={t('jup.title')} lead={t('jup.lead')} />

      <section className="card jup-card">
        <p className="card-kicker">{offsetH ? fmtDateTime(date, place.tz, lang) : t('jup.now')}</p>
        <JupiterDiagram date={date} />
        <input className="range" type="range" min={-24} max={72} step={0.25} value={offsetH} onChange={(e) => setOffsetH(Number(e.target.value))} aria-label={t('jup.timeSlider')} />
        <div className="range-labels">
          <span>−24 h</span>
          <button className="link" onClick={() => setOffsetH(0)}>
            {t('sky.now')}
          </button>
          <span>+72 h</span>
        </div>
        <ul className="jup-moons">
          {v.moons.map((m) => (
            <li key={m.id}>
              <span className="probes-dot" style={{ background: MOON_COLORS[m.id] }} />
              <strong>{t(`jup.moon.${m.id}`)}</strong>
              <span className="muted small">
                {m.occulted
                  ? t('jup.state.occulted')
                  : m.transit
                    ? t('jup.state.transit')
                    : m.eclipsed
                      ? t('jup.state.eclipsed')
                      : t('jup.state.side', { side: m.x > 0 ? t('jup.east') : t('jup.west'), d: fmtNum(Math.abs(m.x), lang, 1) })}
                {m.shadow ? ` · ${t('jup.state.shadow')}` : ''}
              </span>
            </li>
          ))}
        </ul>
        <p className={`muted small ${alt > 0 && sunAlt < -6 ? 'is-good' : ''}`}>
          {alt > 0 ? t('jup.visibleNow', { alt: Math.round(alt) }) : t('jup.belowHorizon')} · {t('jup.size', { d: fmtNum(v.diameter, lang, 0) })}
        </p>
        <a className="link" href="#/sky?focus=body:jupiter">
          {t('common.showInSky')} <ArrowRight size={15} />
        </a>
      </section>

      <div className="duo">
        <section className="card">
          <p className="card-kicker">{t('jup.events')}</p>
          {events.length === 0 && <p className="muted">{t('jup.noEvents')}</p>}
          <ul className="jup-events">
            {events.slice(0, 24).map((e, i) => (
              <li key={i}>
                <span className="probes-dot" style={{ background: MOON_COLORS[e.moon] }} />
                <span>
                  <strong>{t(`jup.event.${e.kind}`, { moon: t(`jup.moon.${e.moon}`) })}</strong>
                  <span className="muted small">
                    {fmtDateTime(e.start, place.tz, lang)} – {fmtTime(e.end, place.tz, lang)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <p className="note">{t('jup.eventsNote')}</p>
        </section>
        <section className="card">
          <p className="card-kicker">{t('jup.chart')}</p>
          <MoonChart from={now} hours={48} />
          <p className="note">{t('jup.chartNote')}</p>
        </section>
      </div>

      <SaturnSection />
    </div>
  );
}
