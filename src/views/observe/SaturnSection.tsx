import { useEffect, useState } from 'react';
import { useI18n } from '../../i18n';
import { useNow } from '../../lib/useNow';
import { loadSaturnMoons, saturnMoonPositions, saturnNorthPolePA, saturnRingTilt, type SaturnMoonData } from '../../lib/observe/saturnMoons';
import { fmtNum } from '../../lib/format';

const COLORS: Record<string, string> = {
  mimas: '#9aa2c0',
  enceladus: '#ffffff',
  tethys: '#cfe0ff',
  dione: '#cfd6e6',
  rhea: '#e6dcc8',
  titan: '#ffb36b',
  iapetus: '#c9b8a6',
};

/** Saturn mit Ringen und seinen größeren Monden (Norden oben, Osten links) */
export function SaturnSection() {
  const { t, lang } = useI18n();
  const now = useNow(60_000);
  const [data, setData] = useState<SaturnMoonData | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    loadSaturnMoons().then(setData, () => setError(true));
  }, []);

  const tilt = saturnRingTilt(now);
  const moons = data ? saturnMoonPositions(data, now) : [];
  // Positionswinkel der Saturnachse am Himmel (für die Lage der Ringe)
  const pa = saturnNorthPolePA(now);
  const ry = Math.max(0.02, Math.abs(Math.sin((tilt * Math.PI) / 180)));
  const span = Math.max(12, ...moons.filter((m) => m.id !== 'iapetus').map((m) => Math.abs(m.x) + 2));

  return (
    <section className="card sat-moons-card">
      <p className="card-kicker">{t('satm.kicker')}</p>
      <h3>{t('satm.title')}</h3>
      <p className="muted small">{t('satm.tilt', { deg: fmtNum(Math.abs(tilt), lang, 1) })}</p>
      {error && <p className="muted">{t('live.error')}</p>}
      <svg className="jup-diagram" viewBox={`${-span} -5 ${2 * span} 10`} role="img" aria-label={t('satm.title')}>
        <g transform={`rotate(${-pa})`}>
          <ellipse rx={2.27} ry={2.27 * ry} fill="none" stroke="#d9c48f" strokeWidth={0.35} opacity={0.85} />
          <ellipse rx={1.75} ry={1.75 * ry} fill="none" stroke="#b9a676" strokeWidth={0.25} opacity={0.7} />
          <ellipse rx={1} ry={0.9} fill="#e6d3a2" />
        </g>
        {moons
          .filter((m) => Math.abs(m.x) < span && !(m.z < 0 && Math.hypot(m.x, m.y) < 1))
          .map((m) => (
            <g key={m.id}>
              <circle cx={-m.x} cy={-m.y} r={m.id === 'titan' ? 0.42 : 0.28} fill={COLORS[m.id] ?? '#fff'} />
              {(m.id === 'titan' || m.id === 'rhea' || m.id === 'dione' || m.id === 'tethys') && (
                <text x={-m.x} y={-m.y - 0.6} className="jup-label">
                  {m.name.slice(0, 2)}
                </text>
              )}
            </g>
          ))}
        <text x={-span + 0.4} y={4.4} className="jup-dir">
          {t('jup.east')}
        </text>
        <text x={span - 0.4} y={4.4} className="jup-dir" textAnchor="end">
          {t('jup.west')}
        </text>
      </svg>
      <ul className="jup-moons">
        {moons.map((m) => (
          <li key={m.id}>
            <span className="probes-dot" style={{ background: COLORS[m.id] ?? '#fff' }} />
            <strong>{m.name}</strong>
            <span className="muted small">{t('satm.side', { side: m.x > 0 ? t('jup.east') : t('jup.west'), d: fmtNum(Math.abs(m.x), lang, 1) })}</span>
          </li>
        ))}
      </ul>
      <p className="note">{t('satm.note')}</p>
    </section>
  );
}
