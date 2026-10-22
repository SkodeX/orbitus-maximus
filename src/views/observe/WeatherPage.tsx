import { useEffect, useMemo, useState, type ReactNode } from 'react';
import * as A from 'astronomy-engine';
import { Droplets } from 'lucide-react';
import { useI18n, type MsgKey } from '../../i18n';
import { useSettings } from '../../state/settings';
import { computeNight, observerOf } from '../../lib/astro';
import { dewRisk, fetchClouds, seeingScore, transparencyScore, type CloudForecast } from '../../lib/weather';
import { fmtDay, fmtHour, fmtNum, fmtTime, localDayKey } from '../../lib/format';
import { ToolHead } from './ObserveView';

interface Hour {
  t: number;
  i: number;
  sunAlt: number;
  moonAlt: number;
  moonIllum: number;
  seeing: number | null;
  transp: number | null;
  dew: boolean;
}

/** Farbe für einen Wert zwischen schlecht (0) und gut (1) */
const goodBad = (k: number) => `hsl(${Math.round(k * 130)}, 62%, ${30 + k * 12}%)`;
const cloudColor = (pct: number) => {
  const k = Math.max(0, Math.min(1, pct / 100));
  // Klar = tiefblau, bedeckt = hellgrau
  return `rgb(${Math.round(18 + k * 150)},${Math.round(36 + k * 140)},${Math.round(84 + k * 100)})`;
};

/** Astro-Wetter für die nächsten zwei Nächte: Wolken in drei Höhen, Luftruhe, Durchsicht, Tau, Mond */
export function WeatherPage() {
  const { t, lang } = useI18n();
  const { settings } = useSettings();
  const place = settings.place!;
  const tz = place.tz;
  const [f, setF] = useState<CloudForecast | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    fetchClouds(place.lat, place.lon).then(setF, () => setError(true));
  }, [place.lat, place.lon]);

  const hours = useMemo<Hour[]>(() => {
    if (!f) return [];
    const obs = observerOf(place);
    const from = Date.now() - 3_600_000;
    const to = Date.now() + 52 * 3_600_000;
    const out: Hour[] = [];
    f.times.forEach((ts, i) => {
      if (ts < from || ts > to) return;
      const time = A.MakeTime(new Date(ts));
      const hor = (b: A.Body) => {
        const eq = A.Equator(b, time, obs, true, true);
        return A.Horizon(time, obs, eq.ra, eq.dec, 'normal').altitude;
      };
      out.push({
        t: ts,
        i,
        sunAlt: hor(A.Body.Sun),
        moonAlt: hor(A.Body.Moon),
        moonIllum: A.Illumination(A.Body.Moon, time).phase_fraction,
        seeing: seeingScore(f, i),
        transp: transparencyScore(f, i),
        dew: dewRisk(f, i),
      });
    });
    return out;
  }, [f, place]);

  // Zusammenfassung der kommenden dunklen Stunden
  const night = useMemo(() => computeNight(place, new Date()), [place]);
  const tonight = hours.filter((h) => night.darkFrom && night.darkTo && h.t >= night.darkFrom.getTime() - 1_800_000 && h.t <= night.darkTo.getTime());
  const avg = (vals: (number | null)[]) => {
    const v = vals.filter((x): x is number => x != null);
    return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null;
  };
  const sum = f && tonight.length ? { clouds: avg(tonight.map((h) => f.total[h.i])), seeing: avg(tonight.map((h) => h.seeing)), transp: avg(tonight.map((h) => h.transp)) } : null;

  // Längstes Fenster mit wenig Wolken in der Dunkelheit
  const best = useMemo(() => {
    if (!f) return null;
    let cur: Hour[] = [];
    let top: Hour[] = [];
    for (const h of hours) {
      if (h.sunAlt < -12 && f.total[h.i] <= 30) cur.push(h);
      else cur = [];
      if (cur.length > top.length) top = [...cur];
    }
    return top.length >= 2 ? { from: top[0].t, to: top[top.length - 1].t + 3_600_000 } : null;
  }, [f, hours]);

  const days: { key: string; label: string; span: number }[] = [];
  for (const h of hours) {
    const key = localDayKey(new Date(h.t), tz);
    const last = days[days.length - 1];
    if (last?.key === key) last.span++;
    else days.push({ key, label: fmtDay(new Date(h.t), tz, lang), span: 1 });
  }

  const row = (label: MsgKey, cell: (h: Hour) => { bg?: string; text?: string | number; title?: string; node?: ReactNode }) => (
    <tr>
      <th scope="row">{t(label)}</th>
      {hours.map((h) => {
        const c = cell(h);
        return (
          <td key={h.t} style={c.bg ? { background: c.bg } : undefined} title={c.title} className={h.sunAlt > -6 ? 'is-day' : ''}>
            {c.node ?? c.text ?? ''}
          </td>
        );
      })}
    </tr>
  );

  return (
    <div className="page observe">
      <ToolHead eyebrow={t('observe.tool.weather')} title={t('wx.title', { place: place.name })} lead={t('wx.lead')} />

      {error && <p className="muted">{t('conditions.cloudsError')}</p>}
      {!f && !error && <p className="muted">{t('conditions.cloudsLoading')}</p>}

      {f && (
        <>
          <div className="wx-summary">
            <article className="card wx-stat">
              <p className="card-kicker">{t('wx.tonightClouds')}</p>
              <strong>{sum?.clouds != null ? `${Math.round(sum.clouds)} %` : '–'}</strong>
            </article>
            <article className="card wx-stat">
              <p className="card-kicker">{t('wx.seeing')}</p>
              <strong>{sum?.seeing != null ? `${fmtNum(sum.seeing, lang, 1)} / 5` : '–'}</strong>
            </article>
            <article className="card wx-stat">
              <p className="card-kicker">{t('wx.transparency')}</p>
              <strong>{sum?.transp != null ? `${fmtNum(sum.transp, lang, 1)} / 5` : '–'}</strong>
            </article>
            <article className="card wx-stat">
              <p className="card-kicker">{t('wx.best')}</p>
              <strong>{best ? `${fmtTime(new Date(best.from), tz, lang)}–${fmtTime(new Date(best.to), tz, lang)}` : t('wx.bestNone')}</strong>
            </article>
          </div>

          <div className="card wx-board-card">
            <div className="wx-scroll">
              <table className="wx-board">
                <thead>
                  <tr>
                    <th />
                    {days.map((d) => (
                      <th key={d.key} colSpan={d.span} className="wx-day">
                        {d.label}
                      </th>
                    ))}
                  </tr>
                  <tr>
                    <th />
                    {hours.map((h) => (
                      <th key={h.t} className={`wx-hour ${h.sunAlt > -6 ? 'is-day' : ''}`}>
                        {fmtHour(new Date(h.t), tz, lang)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {row('wx.dark', (h) => ({
                    bg: h.sunAlt > 0 ? '#c9a24a' : h.sunAlt > -6 ? '#6b5a8a' : h.sunAlt > -12 ? '#2e3570' : h.sunAlt > -18 ? '#1a1f4a' : '#070a1c',
                    title: `${t('wx.sunAlt')}: ${Math.round(h.sunAlt)}°`,
                  }))}
                  {row('wx.clouds', (h) => ({ bg: cloudColor(f.total[h.i]), text: f.total[h.i], title: `${f.total[h.i]} %` }))}
                  {row('wx.low', (h) => ({ bg: cloudColor(f.low[h.i]), title: `${f.low[h.i]} %` }))}
                  {row('wx.mid', (h) => ({ bg: cloudColor(f.mid[h.i]), title: `${f.mid[h.i]} %` }))}
                  {row('wx.high', (h) => ({ bg: cloudColor(f.high[h.i]), title: `${f.high[h.i]} %` }))}
                  {row('wx.seeing', (h) => ({ bg: h.seeing != null ? goodBad((h.seeing - 1) / 4) : undefined, text: h.seeing != null ? Math.round(h.seeing) : '' }))}
                  {row('wx.transparency', (h) => ({ bg: h.transp != null ? goodBad((h.transp - 1) / 4) : undefined, text: h.transp != null ? Math.round(h.transp) : '' }))}
                  {row('wx.humidity', (h) => ({ bg: goodBad(1 - Math.max(0, (f.humidity[h.i] - 50) / 50)), text: f.humidity[h.i] }))}
                  {row('wx.dew', (h) => ({ node: h.dew ? <Droplets size={12} /> : null, title: `${fmtNum(f.temp[h.i], lang, 0)} °C / ${t('wx.dewPoint')} ${fmtNum(f.dew[h.i], lang, 0)} °C` }))}
                  {row('wx.wind', (h) => ({ text: Math.round(f.wind[h.i]), bg: goodBad(1 - Math.min(1, f.wind[h.i] / 40)), title: `${Math.round(f.wind[h.i])} km/h` }))}
                  {row('wx.moon', (h) => ({
                    bg: h.moonAlt > 0 ? `rgba(255,236,190,${0.12 + h.moonIllum * 0.6})` : undefined,
                    title: h.moonAlt > 0 ? `${Math.round(h.moonIllum * 100)} %, ${Math.round(h.moonAlt)}°` : t('wx.moonDown'),
                  }))}
                </tbody>
              </table>
            </div>
            <p className="note">{t('wx.legend')}</p>
          </div>

          <div className="duo">
            <article className="card">
              <h3>{t('wx.seeingTitle')}</h3>
              <p className="muted">{t('wx.seeingText')}</p>
            </article>
            <article className="card">
              <h3>{t('wx.transpTitle')}</h3>
              <p className="muted">{t('wx.transpText')}</p>
            </article>
          </div>
          <p className="note">{t('wx.source')}</p>
        </>
      )}
    </div>
  );
}
