import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Moon, Sun, Video } from 'lucide-react';
import type { SatRec } from '../../lib/live/sgp4';
import { issState, predictPasses, tleEpoch, type IssPass } from '../../lib/live/iss';
import { isOverLand } from '../../lib/live/land';
import { compass, fmtDay, fmtInt, fmtMag, fmtNum, fmtTime, localDayKey } from '../../lib/format';
import { useNow } from '../../lib/useNow';
import { useSettings } from '../../state/settings';
import { useI18n } from '../../i18n';
import { IssMap, type MapMode } from './IssMap';
import type { Launch } from '../../lib/live/feeds';

export function brightnessKey(mag: number) {
  if (mag <= -3) return 'iss.mag.extreme' as const;
  if (mag <= -2) return 'iss.mag.veryBright' as const;
  if (mag <= -1) return 'iss.mag.bright' as const;
  if (mag <= 0.5) return 'iss.mag.good' as const;
  return 'iss.mag.faint' as const;
}

export function IssCard({ rec, passes, launches }: { rec: SatRec; passes: IssPass[] | null; launches: Launch[] | null }) {
  const { settings } = useSettings();
  const { t, lang } = useI18n();
  const place = settings.place!;
  const tz = place.tz;
  const now = useNow(1000);
  const [mode, setMode] = useState<MapMode>(() => (localStorage.getItem('orbitus.issMode') as MapMode) || 'globe');
  useEffect(() => {
    try {
      localStorage.setItem('orbitus.issMode', mode);
    } catch {
      // egal
    }
  }, [mode]);

  const state = issState(rec, now);
  const sites = useMemo(
    () => (launches ?? []).filter((l) => l.lat != null && l.lon != null).slice(0, 6).map((l) => ({ lat: l.lat!, lon: l.lon! })),
    [launches],
  );
  const periodMin = (2 * Math.PI) / rec.no;
  const visible = (passes ?? []).filter((p) => p.visible && p.vanish && p.vanish.t > now).slice(0, 6);
  const nextAny = (passes ?? []).find((p) => p.set > now);
  const today = localDayKey(now, tz);
  const tomorrow = localDayKey(new Date(now.getTime() + 86_400_000), tz);

  return (
    <article className="card iss-card">
      <div className="iss-head">
        <div>
          <p className="card-kicker">
            <span className="live-dot" /> {t('iss.kicker')}
          </p>
          <h3>{t('iss.title')}</h3>
        </div>
        <div className="segmented" role="radiogroup" aria-label={t('iss.view')}>
          {(['globe', 'map'] as MapMode[]).map((m) => (
            <button key={m} role="radio" aria-checked={mode === m} className={mode === m ? 'is-on' : ''} onClick={() => setMode(m)}>
              {t(`iss.${m}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="iss-body">
        <div className={`iss-visual iss-visual--${mode}`}>
          <IssMap rec={rec} place={place} now={now} mode={mode} sites={sites} />
          <p className="iss-legend">
            <span className="key key--track" /> {t('iss.legendTrack')} <span className="key key--zone" /> {t('iss.legendZone')}{' '}
            <span className="key key--me" /> {t('iss.legendMe')} {sites.length > 0 && <><span className="key key--site" /> {t('iss.legendSites')}</>}
          </p>
        </div>

        <div className="iss-side">
          {state && (
            <dl className="iss-stats">
              <div>
                <dt>{t('iss.altitude')}</dt>
                <dd>{fmtInt(state.altKm, lang)} km</dd>
              </div>
              <div>
                <dt>{t('iss.speed')}</dt>
                <dd>{fmtInt(state.speedKmh, lang)} km/h</dd>
              </div>
              <div>
                <dt>{t('iss.position')}</dt>
                <dd>
                  {fmtNum(Math.abs(state.lat), lang, 1)}° {state.lat >= 0 ? 'N' : 'S'}, {fmtNum(Math.abs(state.lon), lang, 1)}°{' '}
                  {state.lon >= 0 ? (lang === 'de' ? 'O' : 'E') : 'W'}
                  <small>{isOverLand(state.lon, state.lat) ? t('iss.overLand') : t('iss.overSea')}</small>
                </dd>
              </div>
              <div>
                <dt>{t('iss.onBoard')}</dt>
                <dd className="iss-daynight">
                  {state.lit ? <Sun size={16} /> : <Moon size={16} />} {state.lit ? t('iss.day') : t('iss.night')}
                </dd>
              </div>
            </dl>
          )}
          <p className="muted small">{t('iss.orbit', { min: Math.round(periodMin), n: fmtNum(1440 / periodMin, lang, 1) })}</p>

          <h4>{t('iss.passesTitle')}</h4>
          {!passes && <p className="muted">{t('iss.computing')}</p>}
          {passes && visible.length === 0 && (
            <p className="muted">
              {t('iss.noVisible')}
              {nextAny && ` ${t('iss.nextAny', { time: `${fmtDay(nextAny.peak.t, tz, lang)}, ${fmtTime(nextAny.peak.t, tz, lang)}` })}`}
            </p>
          )}
          <ul className="pass-list">
            {visible.map((p) => {
              const a = p.appear!;
              const v = p.vanish!;
              const pk = p.visiblePeak!;
              const day = localDayKey(a.t, tz);
              const dayLabel = day === today ? t('common.today') : day === tomorrow ? t('common.tomorrow') : fmtDay(a.t, tz, lang);
              const live = now >= a.t && now <= v.t;
              return (
                <li key={a.t.getTime()} className={live ? 'is-live' : ''}>
                  <div className="pass-top">
                    <strong>
                      {dayLabel} · {fmtTime(a.t, tz, lang)}
                    </strong>
                    <span className={`badge ${p.mag <= -2 ? 'badge--hot' : 'badge--on'}`}>
                      {live ? t('iss.nowVisible') : t(brightnessKey(p.mag))}
                    </span>
                  </div>
                  <p className="muted">
                    {t('iss.passPath', {
                      from: compass(a.az, lang),
                      to: compass(v.az, lang),
                      alt: Math.round(pk.alt),
                      dir: compass(pk.az, lang),
                      min: Math.max(1, Math.round((v.t.getTime() - a.t.getTime()) / 60_000)),
                    })}
                    {p.intoShadow && ` ${t('iss.intoShadow')}`}
                  </p>
                  <p className="pass-foot">
                    <span className="muted small">
                      {t('iss.magValue', { mag: fmtMag(p.mag, lang) })}
                    </span>
                    <a className="link" href={`#/sky?focus=iss&t=${a.t.getTime()}`}>
                      {t('common.showInSky')} <ArrowRight size={15} />
                    </a>
                  </p>
                </li>
              );
            })}
          </ul>
          <p className="note">{t('iss.howToSpot')}</p>
          <p className="iss-links">
            <a className="link" href="https://www.youtube.com/@NASA/streams" target="_blank" rel="noreferrer">
              <Video size={16} /> {t('iss.liveVideo')}
            </a>
            <span className="muted small">{t('iss.tleAge', { date: fmtDay(tleEpoch(rec), tz, lang) })}</span>
          </p>
        </div>
      </div>
    </article>
  );
}

/** Überflüge berechnen, sobald Bahn und Ort feststehen (dauert einige Millisekunden) */
export function usePasses(rec: SatRec | null) {
  const { settings } = useSettings();
  const place = settings.place!;
  const [passes, setPasses] = useState<IssPass[] | null>(null);
  useEffect(() => {
    if (!rec) return;
    setPasses(null);
    const id = window.setTimeout(() => setPasses(predictPasses(rec, place, new Date(), 7)), 30);
    return () => window.clearTimeout(id);
  }, [rec, place]);
  return passes;
}
