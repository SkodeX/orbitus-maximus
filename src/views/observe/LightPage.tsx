import { useEffect, useMemo, useRef, useState } from 'react';
import { ExternalLink, MapPin } from 'lucide-react';
import { useI18n, type MsgKey } from '../../i18n';
import { useSettings } from '../../state/settings';
import { darkerPlacesNear, LIGHT_POLLUTION_CREDIT, loadLightPollution, skyAt, type DarkPlace, type LightGrid } from '../../lib/observe/lightPollution';
import { compassLong, fmtInt, fmtNum } from '../../lib/format';
import { ToolHead } from './ObserveView';

const RANGE_KM = 150;
/** Grenzgröße mit bloßem Auge je Bortle-Klasse (Mitte der üblichen Spanne) */
const NELM = [0, 7.8, 7.3, 6.8, 6.3, 5.8, 5.3, 4.8, 4.3, 4.0];

// Farbverlauf von dunkel (natürlicher Himmel) nach hell (Stadt), stetig heller werdend
const STOPS: [number, [number, number, number]][] = [
  [22.0, [5, 6, 15]],
  [21.5, [22, 28, 70]],
  [20.8, [58, 44, 110]],
  [20.0, [120, 58, 120]],
  [19.2, [190, 80, 100]],
  [18.5, [240, 130, 80]],
  [17.8, [255, 200, 120]],
  [17.0, [255, 245, 220]],
];

/** Farbe für eine Himmelshelligkeit (mag/arcsec²) */
function sqmColor(sqm: number): [number, number, number] {
  if (sqm >= STOPS[0][0]) return STOPS[0][1];
  for (let i = 1; i < STOPS.length; i++) {
    const [s1, c1] = STOPS[i];
    if (sqm >= s1) {
      const [s0, c0] = STOPS[i - 1];
      const k = (s0 - sqm) / (s0 - s1);
      return [0, 1, 2].map((j) => Math.round(c0[j] + (c1[j] - c0[j]) * k)) as [number, number, number];
    }
  }
  return STOPS[STOPS.length - 1][1];
}

function LocalMap({ grid, lat, lon, places }: { grid: LightGrid; lat: number; lon: number; places: DarkPlace[] }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const N = 220;
    c.width = N;
    c.height = N;
    const ctx = c.getContext('2d')!;
    const img = ctx.createImageData(N, N);
    const kmPerDegLat = 111.2;
    const kmPerDegLon = 111.2 * Math.cos((lat * Math.PI) / 180);
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        const dx = ((x + 0.5) / N - 0.5) * 2 * RANGE_KM;
        const dy = (0.5 - (y + 0.5) / N) * 2 * RANGE_KM;
        const s = skyAt(grid, lat + dy / kmPerDegLat, lon + dx / Math.max(1, kmPerDegLon));
        const [r, g, b] = sqmColor(s.sqm);
        const i = (y * N + x) * 4;
        img.data[i] = r;
        img.data[i + 1] = g;
        img.data[i + 2] = b;
        img.data[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  }, [grid, lat, lon]);

  const pos = (p: { lat: number; lon: number }) => {
    const kmPerDegLon = 111.2 * Math.cos((lat * Math.PI) / 180);
    const x = 50 + (((p.lon - lon) * kmPerDegLon) / (2 * RANGE_KM)) * 100;
    const y = 50 - (((p.lat - lat) * 111.2) / (2 * RANGE_KM)) * 100;
    return { left: `${x}%`, top: `${y}%` };
  };

  return (
    <div className="lp-map">
      <canvas ref={ref} />
      <span className="lp-me" style={pos({ lat, lon })}>
        <MapPin size={18} />
      </span>
      {places.map((p, i) => (
        <span key={i} className="lp-dark" style={pos(p)}>
          {i + 1}
        </span>
      ))}
      <span className="lp-scale">{RANGE_KM} km</span>
    </div>
  );
}

export function LightPage() {
  const { t, lang } = useI18n();
  const { settings } = useSettings();
  const place = settings.place!;
  const [grid, setGrid] = useState<LightGrid | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    loadLightPollution().then(setGrid, () => setError(true));
  }, []);

  const here = grid ? skyAt(grid, place.lat, place.lon) : null;
  const places = useMemo(() => (grid ? darkerPlacesNear(grid, place.lat, place.lon, RANGE_KM) : []), [grid, place.lat, place.lon]);

  return (
    <div className="page observe">
      <ToolHead eyebrow={t('observe.tool.light')} title={t('lp.title')} lead={t('lp.lead')} />
      {error && <p className="muted">{t('live.error')}</p>}
      {!grid && !error && <p className="muted">{t('lp.loading')}</p>}
      {here && grid && (
        <>
          <div className="ep-layout">
            <section className="card lp-here">
              <p className="card-kicker">{t('lp.here', { place: place.name })}</p>
              <div className="lp-bortle">
                <strong className={`lp-class lp-class--${here.bortle}`}>{here.bortle}</strong>
                <div>
                  <h3>{t(`lp.b${here.bortle}` as MsgKey)}</h3>
                  <p className="muted small">{t('lp.sqm', { sqm: fmtNum(here.sqm, lang, 2) })}</p>
                </div>
              </div>
              <div className="lp-scalebar" aria-hidden="true">
                {Array.from({ length: 9 }, (_, i) => (
                  <span key={i} className={`lp-class--${i + 1} ${here.bortle === i + 1 ? 'is-on' : ''}`}>
                    {i + 1}
                  </span>
                ))}
              </div>
              <p>{t(`lp.b${here.bortle}Text` as MsgKey)}</p>
              <p className="muted small">{t('lp.nelm', { mag: fmtNum(NELM[here.bortle], lang, 1) })}</p>
              {!here.covered && <p className="muted small">{t('lp.notCovered')}</p>}
            </section>
            <section className="card">
              <p className="card-kicker">{t('lp.darker', { km: RANGE_KM })}</p>
              <LocalMap grid={grid} lat={place.lat} lon={place.lon} places={places} />
              {places.length === 0 ? (
                <p className="muted small">{t('lp.noneDarker')}</p>
              ) : (
                <ol className="lp-list">
                  {places.map((p, i) => (
                    <li key={i}>
                      <span className="lp-num">{i + 1}</span>
                      <span>
                        <strong>
                          {t('lp.placeLine', { km: fmtInt(p.km, lang), dir: compassLong(p.bearing, lang) })}
                        </strong>
                        <span className="muted small">
                          Bortle {p.bortle} · {fmtNum(p.sqm, lang, 2)} mag/″²
                        </span>
                      </span>
                      <a
                        className="icon-btn"
                        href={`https://www.openstreetmap.org/?mlat=${p.lat.toFixed(4)}&mlon=${p.lon.toFixed(4)}#map=11/${p.lat.toFixed(4)}/${p.lon.toFixed(4)}`}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={t('lp.openMap')}
                        title={t('lp.openMap')}
                      >
                        <ExternalLink size={16} />
                      </a>
                    </li>
                  ))}
                </ol>
              )}
              <p className="note">{t('lp.mapNote')}</p>
            </section>
          </div>
          <div className="duo">
            <article className="card">
              <h3>{t('lp.whatTitle')}</h3>
              <p className="muted">{t('lp.whatText')}</p>
            </article>
            <article className="card">
              <h3>{t('lp.tipsTitle')}</h3>
              <p className="muted">{t('lp.tipsText')}</p>
            </article>
          </div>
          <p className="note">{lang === 'de' ? LIGHT_POLLUTION_CREDIT : t('lp.credit')}</p>
        </>
      )}
    </div>
  );
}
