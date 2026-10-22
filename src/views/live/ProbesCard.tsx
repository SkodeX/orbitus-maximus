import { useEffect, useMemo, useState } from 'react';
import * as A from 'astronomy-engine';
import { Orbit } from 'lucide-react';
import { useI18n } from '../../i18n';
import { useNow } from '../../lib/useNow';
import { distanceFromEarthKm, distanceFromSunKm, lightTimeSeconds, loadProbes, probePosition, speedKms, type ProbeData } from '../../lib/live/probes';
import { fmtKm, fmtLightTime, fmtNum } from '../../lib/format';

const AU_KM = 149_597_870.7;
const ECL = A.Rotation_EQJ_ECL();
const PLANETS: [A.Body, string, number][] = [
  [A.Body.Mercury, 'mercury', 0.387],
  [A.Body.Venus, 'venus', 0.723],
  [A.Body.Earth, 'earth', 1],
  [A.Body.Mars, 'mars', 1.524],
  [A.Body.Jupiter, 'jupiter', 5.203],
  [A.Body.Saturn, 'saturn', 9.537],
  [A.Body.Uranus, 'uranus', 19.19],
  [A.Body.Neptune, 'neptune', 30.07],
];

// Logarithmischer Maßstab, damit Merkur und Voyager 1 (über 170 AE) auf dieselbe Karte passen
const R_MAX = 200;
const scale = (au: number) => Math.log1p(au / 0.25) / Math.log1p(R_MAX / 0.25);

function eclXY(v: { x: number; y: number; z: number }) {
  return { x: v.x, y: v.y, r: Math.hypot(v.x, v.y) };
}

/** Wo die Raumsonden gerade sind: Karte von oben und Liste mit Entfernungen */
export function ProbesCard() {
  const { t, lang } = useI18n();
  const [data, setData] = useState<ProbeData | null>(null);
  const [error, setError] = useState(false);
  const now = useNow(60_000);
  useEffect(() => {
    loadProbes().then(setData, () => setError(true));
  }, []);

  const rows = useMemo(() => {
    if (!data) return [];
    return data.probes
      .map((p) => {
        const pos = probePosition(p, now);
        if (!pos) return null;
        const earthKm = distanceFromEarthKm(p, now);
        return { p, pos, earthKm, sunKm: distanceFromSunKm(p, now), speed: speedKms(p, now) };
      })
      .filter((r): r is NonNullable<typeof r> => !!r && r.earthKm != null)
      .sort((a, b) => b.earthKm! - a.earthKm!);
  }, [data, now]);

  const planets = useMemo(
    () =>
      PLANETS.map(([body, id, a]) => {
        const v = A.RotateVector(ECL, A.HelioVector(body, now));
        return { id, a, ...eclXY(v) };
      }),
    [now],
  );

  const S = 150; // halbe Kartengröße in SVG-Einheiten
  const toSvg = (x: number, y: number) => {
    const r = Math.hypot(x, y);
    const k = r ? (scale(r) * S) / r : 0;
    // Ekliptik von Norden gesehen: x nach rechts, y nach oben
    return [x * k, -y * k];
  };

  return (
    <article className="card probes-card">
      <p className="card-kicker">{t('probes.kicker')}</p>
      <h3>{t('probes.title')}</h3>
      <p className="muted small">{t('probes.lead')}</p>
      {error && <p className="muted">{t('live.error')}</p>}
      {!data && !error && <p className="muted">{t('live.loading')}</p>}
      {data && (
        <div className="probes-layout">
          <svg className="probes-map" viewBox={`${-S - 10} ${-S - 10} ${2 * S + 20} ${2 * S + 20}`} role="img" aria-label={t('probes.mapLabel')}>
            {planets.map((pl) => (
              <circle key={pl.id} r={scale(pl.a) * S} className="probes-orbit" />
            ))}
            {[50, 100, 150].map((au) => (
              <g key={au}>
                <circle r={scale(au) * S} className="probes-ring" />
                <text x={0} y={-scale(au) * S - 3} className="probes-ring-label">
                  {au} {t('unit.au')}
                </text>
              </g>
            ))}
            <circle r={4} className="probes-sun" />
            {planets.map((pl) => {
              const [x, y] = toSvg(pl.x, pl.y);
              return <circle key={pl.id} cx={x} cy={y} r={pl.id === 'earth' ? 3 : 2.4} className={`probes-planet probes-planet--${pl.id}`} />;
            })}
            {rows.map(({ p, pos }) => {
              const [x, y] = toSvg(pos.x, pos.y);
              return (
                <g key={p.id}>
                  <circle cx={x} cy={y} r={3.2} fill={p.color} />
                  <text x={x + 5} y={y + 3} className="probes-label" fill={p.color}>
                    {p.name[lang]}
                  </text>
                </g>
              );
            })}
          </svg>
          <ul className="probes-list">
            {rows.map(({ p, earthKm, sunKm, speed }) => (
              <li key={p.id}>
                <span className="probes-dot" style={{ background: p.color }} />
                <div>
                  <strong>{p.name[lang]}</strong>
                  <span className="muted small">
                    {p.agency} · {t('probes.since', { year: p.launch.slice(0, 4) })}
                  </span>
                  <p className="small">{p.status[lang]}</p>
                  <p className="probes-stats small">
                    <span>
                      {t('probes.fromEarth')} <b>{fmtKm(earthKm!, lang)}</b>
                    </span>
                    <span>
                      {t('probes.signal')} <b>{fmtLightTime(lightTimeSeconds(earthKm!), lang)}</b>
                    </span>
                    {sunKm != null && (
                      <span>
                        {t('probes.fromSun')} <b>{fmtNum(sunKm / AU_KM, lang, sunKm / AU_KM < 10 ? 2 : 1)} {t('unit.au')}</b>
                      </span>
                    )}
                    {speed != null && (
                      <span>
                        {t('probes.speed')} <b>{fmtNum(speed, lang, 1)} km/s</b>
                      </span>
                    )}
                  </p>
                  <a className="link small" href={`#/system?probe=${p.id}`}>
                    <Orbit size={14} /> {t('probes.in3d')}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="note">{t('probes.source')}</p>
    </article>
  );
}
