import { useEffect, useMemo, useState } from 'react';
import * as A from 'astronomy-engine';
import { AlertTriangle, ArrowRight, ExternalLink } from 'lucide-react';
import { useI18n } from '../../i18n';
import { useSettings } from '../../state/settings';
import { bestFixedAltitude, computeNight, constellationAt, observerOf } from '../../lib/astro';
import { cometMagnitude, cometRaDec, loadComets, type Comet } from '../../lib/catalogs';
import { cachedFetch } from '../../lib/live/cache';
import { useLive } from '../../lib/live/useLive';
import { fmtDate, fmtDateTime, fmtInt, fmtMag, fmtNum, fmtTime } from '../../lib/format';
import consNames from '../../data/constellation-names.json';
import { ToolHead } from './ObserveView';

const LD_KM = 384_400;
const DAY = 86_400_000;
const jdToDate = (jd: number) => new Date((jd - 2_440_587.5) * DAY);

interface Neo {
  id: string;
  name: string;
  url: string;
  time: number;
  km: number;
  speed: number;
  dMin: number;
  dMax: number;
  hazardous: boolean;
}

/** Erdnahe Asteroiden der nächsten 7 Tage (NASA NeoWs, öffentlicher Demo-Schlüssel) */
function loadNeos() {
  const start = new Date().toISOString().slice(0, 10);
  return cachedFetch<Neo[]>('neows', `https://api.nasa.gov/neo/rest/v1/feed?start_date=${start}&api_key=DEMO_KEY`, 6 * 3_600_000, (raw) => {
    const days = (raw as { near_earth_objects: Record<string, unknown[]> }).near_earth_objects;
    const out: Neo[] = [];
    for (const list of Object.values(days)) {
      for (const o of list as {
        id: string;
        name: string;
        nasa_jpl_url: string;
        is_potentially_hazardous_asteroid: boolean;
        estimated_diameter: { meters: { estimated_diameter_min: number; estimated_diameter_max: number } };
        close_approach_data: { epoch_date_close_approach: number; miss_distance: { kilometers: string }; relative_velocity: { kilometers_per_second: string }; orbiting_body: string }[];
      }[]) {
        const ca = o.close_approach_data.find((c) => c.orbiting_body === 'Earth');
        if (!ca) continue;
        out.push({
          id: o.id,
          name: o.name.replace(/[()]/g, '').trim(),
          url: o.nasa_jpl_url.replace('http://', 'https://'),
          time: ca.epoch_date_close_approach,
          km: Number(ca.miss_distance.kilometers),
          speed: Number(ca.relative_velocity.kilometers_per_second),
          dMin: o.estimated_diameter.meters.estimated_diameter_min,
          dMax: o.estimated_diameter.meters.estimated_diameter_max,
          hazardous: o.is_potentially_hazardous_asteroid,
        });
      }
    }
    return out.sort((a, b) => a.km - b.km);
  });
}

/** Helligkeitsverlauf ±60 Tage als kleine Linie (heute markiert) */
function MagCurve({ c, now }: { c: Comet; now: Date }) {
  const { t, lang } = useI18n();
  const pts = useMemo(() => {
    const out: { d: number; m: number }[] = [];
    for (let d = -60; d <= 60; d += 4) {
      const m = cometMagnitude(c, new Date(now.getTime() + d * DAY));
      if (m != null) out.push({ d, m });
    }
    return out;
  }, [c, now]);
  if (pts.length < 3) return null;
  const lo = Math.min(...pts.map((p) => p.m));
  const hi = Math.max(...pts.map((p) => p.m));
  const span = Math.max(1, hi - lo);
  const x = (d: number) => ((d + 60) / 120) * 200;
  const y = (m: number) => 6 + ((m - lo) / span) * 48; // heller = weiter oben
  const best = pts.reduce((b, p) => (p.m < b.m ? p : b));
  return (
    <figure className="comet-curve">
      <svg viewBox="0 0 200 60" role="img" aria-label={t('comets.curve')}>
        <line x1={x(0)} x2={x(0)} y1={0} y2={60} className="comet-today" />
        <path d={pts.map((p, i) => `${i ? 'L' : 'M'}${x(p.d)},${y(p.m)}`).join(' ')} className="comet-line" />
      </svg>
      <figcaption className="muted small">
        {t('comets.curveText', { best: fmtMag(best.m, lang), date: fmtDate(new Date(now.getTime() + best.d * DAY), 'UTC', lang) })}
      </figcaption>
    </figure>
  );
}

export function CometsPage() {
  const { t, lang } = useI18n();
  const { settings } = useSettings();
  const place = settings.place!;
  const [comets, setComets] = useState<Comet[] | null>(null);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const neos = useLive(loadNeos, []);
  const now = useMemo(() => new Date(), []);
  useEffect(() => {
    loadComets().then(setComets, () => setError(true));
  }, []);
  const conName = (id: string) => (consNames as Record<string, { de: string; en: string }>)[id]?.[lang] ?? id;

  const visible = useMemo(() => {
    if (!comets) return [];
    const night = computeNight(place, now);
    const from = night.darkFrom ?? night.sunset ?? night.from;
    const to = night.darkTo ?? night.sunrise ?? night.to;
    const obs = observerOf(place);
    return comets
      .map((c) => {
        const mag = cometMagnitude(c, now);
        if (mag == null || mag > 13) return null;
        const pos = cometRaDec(c, now);
        const elong = A.AngleBetween(A.GeoVector(A.Body.Sun, now, true), raDecVec(pos.ra, pos.dec));
        const best = bestFixedAltitude(pos.ra, pos.dec, from, to, obs);
        const later = cometMagnitude(c, new Date(now.getTime() + 30 * DAY));
        return { c, mag, pos, elong, best, trend: later == null ? 0 : later - mag };
      })
      .filter((x): x is NonNullable<typeof x> => !!x)
      .sort((a, b) => a.mag - b.mag)
      .slice(0, 25);
  }, [comets, place, now]);

  const level = (m: number) => (m < 6 ? 'eye' : m < 9 ? 'binoculars' : 'telescope');

  return (
    <div className="page observe">
      <ToolHead eyebrow={t('observe.tool.comets')} title={t('comets.title')} lead={t('comets.lead')} />

      <section className="section">
        <div className="section-head">
          <h2>{t('comets.now')}</h2>
          <p className="muted">{t('comets.nowLead')}</p>
        </div>
        {error && <p className="muted">{t('live.error')}</p>}
        {!comets && !error && <p className="muted">{t('live.loading')}</p>}
        {comets && !visible.length && <p className="muted">{t('comets.none')}</p>}
        <ul className="list-items">
          {visible.map(({ c, mag, pos, elong, best, trend }) => (
            <li key={c.name} className="card comet-item">
              <span className={`comet-mag comet-mag--${level(mag)}`}>{fmtMag(mag, lang)}</span>
              <div className="list-body">
                <button className="list-title" onClick={() => setOpen(open === c.name ? null : c.name)} aria-expanded={open === c.name}>
                  <strong>{c.name}</strong>
                  <span className="muted small">
                    {t(`comets.level.${level(mag)}`)} · {conName(constellationAt(pos.ra / 15, pos.dec))} · {trend < -0.3 ? t('comets.brighter') : trend > 0.3 ? t('comets.fainter') : t('comets.steady')}
                  </span>
                </button>
                <span className={`list-best small ${best.alt > 15 && elong > 25 ? 'is-good' : 'muted'}`}>
                  {elong < 20 ? t('comets.nearSun') : best.alt > 0 ? t('lists.best', { time: fmtTime(best.time, place.tz, lang), alt: Math.round(best.alt) }) : t('lists.notTonight')}
                </span>
                {open === c.name && (
                  <div className="list-more">
                    <MagCurve c={c} now={now} />
                    <dl className="detail-grid">
                      <dt>{t('comets.perihelion')}</dt>
                      <dd>
                        {fmtDate(jdToDate(c.tp), 'UTC', lang)} · {fmtNum(c.q, lang, 2)} AE
                      </dd>
                      <dt>{t('comets.fromEarth')}</dt>
                      <dd>{fmtNum(pos.delta, lang, 2)} AE</dd>
                      <dt>{t('comets.fromSun')}</dt>
                      <dd>{fmtNum(pos.r, lang, 2)} AE</dd>
                    </dl>
                    <div className="btn-row">
                      <a className="link small" href={`#/sky?focus=coord:${pos.ra.toFixed(3)},${pos.dec.toFixed(3)},${encodeURIComponent(c.name)}`}>
                        {t('common.showInSky')} <ArrowRight size={14} />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
        <p className="note">{t('comets.note')}</p>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>{t('neo.title')}</h2>
          <p className="muted">{t('neo.lead')}</p>
        </div>
        {neos.error && !neos.data && <p className="muted">{t('live.error')}</p>}
        {!neos.data && !neos.error && <p className="muted">{t('live.loading')}</p>}
        <ul className="list-items">
          {(neos.data ?? []).slice(0, 15).map((n) => (
            <li key={n.id} className="card neo-item">
              <div className="list-body">
                <strong>
                  {n.name} {n.hazardous && <AlertTriangle size={14} className="inline-icon neo-haz" aria-label={t('neo.hazardous')} />}
                </strong>
                <span className="muted small">
                  {fmtDateTime(new Date(n.time), place.tz, lang)} · {t('neo.size', { min: fmtInt(n.dMin, lang), max: fmtInt(n.dMax, lang) })} ·{' '}
                  {fmtNum(n.speed, lang, 1)} km/s
                </span>
              </div>
              <span className="neo-dist">
                <strong>{fmtNum(n.km / LD_KM, lang, n.km < LD_KM * 10 ? 1 : 0)}</strong>
                <small className="muted">{t('neo.ld')}</small>
              </span>
              <a className="icon-btn" href={n.url} target="_blank" rel="noreferrer" aria-label="NASA/JPL">
                <ExternalLink size={15} />
              </a>
            </li>
          ))}
        </ul>
        <p className="note">{t('neo.note')}</p>
      </section>
    </div>
  );
}

function raDecVec(raDeg: number, decDeg: number) {
  const r = (raDeg * Math.PI) / 180;
  const d = (decDeg * Math.PI) / 180;
  return new A.Vector(Math.cos(d) * Math.cos(r), Math.cos(d) * Math.sin(r), Math.sin(d), A.MakeTime(new Date()));
}
