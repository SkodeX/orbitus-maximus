import type { CSSProperties } from 'react';
import type { MoonReport, Night, PlanetReport } from '../../lib/astro';
import { fmtHour, fmtTime } from '../../lib/format';
import { useI18n } from '../../i18n';
import type { CloudForecast } from '../../lib/weather';
import { cloudHours } from '../../lib/weather';

const SKY_COLORS: [number, string][] = [
  [-18, '#05070f'],
  [-12, '#0b1230'],
  [-6, '#17224a'],
  [0, '#2a3f7a'],
  [6, '#3d64a8'],
];
function skyColor(alt: number) {
  for (const [limit, col] of SKY_COLORS) if (alt < limit) return col;
  return SKY_COLORS[SKY_COLORS.length - 1][1];
}

const PLANET_COLOR: Record<string, string> = {
  mercury: '#cfc6bb',
  venus: '#ffe9b8',
  mars: '#ff8e63',
  jupiter: '#f2cf9c',
  saturn: '#ecd48b',
  uranus: '#9fe8ec',
  neptune: '#8ea8ff',
};

interface Props {
  night: Night;
  planets: PlanetReport[];
  moon: MoonReport;
  clouds: CloudForecast | null;
  now: Date;
  tz: string;
}

/** Zeitleiste der Nacht: Dämmerung, Wolken, Mond und Planeten auf einen Blick */
export function NightTimeline({ night, planets, moon, clouds, now, tz }: Props) {
  const { t, lang } = useI18n();
  const t0 = night.from.getTime();
  const span = night.to.getTime() - t0;
  const pct = (ms: number) => ((ms - t0) / span) * 100;
  const step = night.samples.length > 1 ? night.samples[1].t - night.samples[0].t : 600_000;

  const skyStops = night.samples.map((s) => `${skyColor(s.sunAlt)} ${pct(s.t).toFixed(2)}%`).join(', ');

  // Abschnitte, in denen eine Bedingung erfüllt ist
  const segments = (test: (i: number) => boolean) => {
    const out: { from: number; to: number }[] = [];
    let open: number | null = null;
    night.samples.forEach((s, i) => {
      if (test(i)) {
        if (open === null) open = s.t;
      } else if (open !== null) {
        out.push({ from: open, to: s.t });
        open = null;
      }
    });
    if (open !== null) out.push({ from: open, to: night.to.getTime() });
    return out;
  };
  const seg = (from: number, to: number, style?: CSSProperties, cls = 'tl-seg') => (
    <span key={`${from}-${to}`} className={cls} style={{ left: `${pct(from)}%`, width: `${Math.max(0.6, pct(to) - pct(from))}%`, ...style }} />
  );

  // Volle Stunden in der Zeitzone des Ortes
  const ticks: number[] = [];
  const firstMinute = Number(fmtTime(night.from, tz, lang).split(':')[1]);
  for (let tt = t0 + ((60 - firstMinute) % 60) * 60_000; tt <= night.to.getTime(); tt += 3_600_000) ticks.push(tt);

  const hours = clouds ? cloudHours(clouds, night.from, night.to) : [];
  const nowPct = pct(now.getTime());
  const sorted = [...planets].sort((a, b) => b.windows.length - a.windows.length);

  return (
    <div className="timeline" role="img" aria-label={t('timeline.aria')}>
      <div className="tl-row tl-axis">
        <span className="tl-label" />
        <div className="tl-track">
          {ticks.map((tt, i) => (
            <span key={tt} className={`tl-tick ${i % 2 ? 'tl-tick--odd' : ''}`} style={{ left: `${pct(tt)}%` }}>
              {fmtHour(new Date(tt), tz, lang)}
            </span>
          ))}
        </div>
      </div>

      <div className="tl-row">
        <span className="tl-label">{t('timeline.sky')}</span>
        <div className="tl-track tl-sky" style={{ background: `linear-gradient(90deg, ${skyStops})` }}>
          {night.darkFrom && night.darkTo && (
            <span className="tl-dark" style={{ left: `${pct(night.darkFrom.getTime())}%`, width: `${pct(night.darkTo.getTime()) - pct(night.darkFrom.getTime())}%` }}>
              {t('timeline.dark')}
            </span>
          )}
        </div>
      </div>

      <div className="tl-row">
        <span className="tl-label">{t('timeline.clouds')}</span>
        <div className="tl-track tl-clouds">
          {hours.length === 0 && <span className="tl-empty">{clouds ? '–' : t('timeline.cloudsLoading')}</span>}
          {hours.map((h) => (
            <span
              key={h.t}
              className="tl-cloud"
              title={`${fmtTime(new Date(h.t), tz, lang)}: ${h.total} %`}
              style={{ left: `${pct(h.t - 1_800_000)}%`, width: `${(3_600_000 / span) * 100}%`, opacity: 0.08 + (h.total / 100) * 0.85 }}
            />
          ))}
        </div>
      </div>

      <div className="tl-row">
        <span className="tl-label">{t('body.moon')}</span>
        <div className="tl-track">
          {segments((i) => night.samples[i].moonAlt > 0).map((s) =>
            seg(s.from, s.to, { background: `rgba(244,241,232,${0.25 + moon.illum * 0.6})` }),
          )}
        </div>
      </div>

      {sorted.map((p) => (
        <div className="tl-row" key={p.id}>
          <span className="tl-label">{t(`body.${p.id}`)}</span>
          <div className="tl-track">
            {segments((i) => night.samples[i].planets[p.id].alt > 0).map((s) => seg(s.from, s.to, undefined, 'tl-seg tl-seg--up'))}
            {p.windows.map((w) => seg(w.from.getTime(), w.to.getTime() + step, { background: PLANET_COLOR[p.id] }))}
          </div>
        </div>
      ))}

      {nowPct >= 0 && nowPct <= 100 && (
        <div className="tl-now" style={{ '--x': nowPct / 100 } as CSSProperties}>
          <span>{t('timeline.now')}</span>
        </div>
      )}
      <p className="tl-legend">
        <span className="tl-key tl-key--vis" /> {t('timeline.legendVisible')}
        <span className="tl-key tl-key--up" /> {t('timeline.legendUp')}
      </p>
    </div>
  );
}
