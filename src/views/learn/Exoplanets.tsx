import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Search } from 'lucide-react';
import { useI18n, type MsgKey } from '../../i18n';
import { loadExoplanets, type DiscoveryMethod, type Exoplanet } from '../../lib/catalogs';
import { fmtInt, fmtNum, fold } from '../../lib/format';

const PC_LY = 3.2616;
type SizeClass = 'earth' | 'super' | 'mini' | 'neptune' | 'giant';
const SIZES: SizeClass[] = ['earth', 'super', 'mini', 'neptune', 'giant'];
const sizeOf = (r: number | null): SizeClass | null =>
  r == null ? null : r < 1.25 ? 'earth' : r < 2 ? 'super' : r < 4 ? 'mini' : r < 8 ? 'neptune' : 'giant';
/** Grobe Auswahl: gesteinsgroß und Temperatur, bei der flüssiges Wasser denkbar wäre */
const temperate = (p: Exoplanet) => p.radius != null && p.radius < 1.8 && p.teq != null && p.teq > 180 && p.teq < 310;
type Sort = 'dist' | 'year' | 'radius';

export function Exoplanets() {
  const { t, lang } = useI18n();
  const [all, setAll] = useState<Exoplanet[] | null>(null);
  const [error, setError] = useState(false);
  const [q, setQ] = useState('');
  const [method, setMethod] = useState<DiscoveryMethod | null>(null);
  const [size, setSize] = useState<SizeClass | null>(null);
  const [onlyTemperate, setOnlyTemperate] = useState(false);
  const [sort, setSort] = useState<Sort>('dist');
  const [limit, setLimit] = useState(40);
  const [open, setOpen] = useState<string | null>(null);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    loadExoplanets().then(setAll, () => setError(true));
  }, []);

  const stats = useMemo(() => {
    if (!all) return null;
    const years = new Map<number, number>();
    for (const p of all) if (p.year) years.set(p.year, (years.get(p.year) ?? 0) + 1);
    const ys = [...years.keys()].sort((a, b) => a - b);
    const from = Math.max(1995, ys[0] ?? 1995);
    const to = ys[ys.length - 1] ?? 2026;
    const perYear = Array.from({ length: to - from + 1 }, (_, i) => ({ year: from + i, n: years.get(from + i) ?? 0 }));
    const methods = new Map<DiscoveryMethod, number>();
    for (const p of all) methods.set(p.method, (methods.get(p.method) ?? 0) + 1);
    return {
      perYear,
      methods: [...methods.entries()].sort((a, b) => b[1] - a[1]),
      temperate: all.filter(temperate).length,
      systems: new Set(all.map((p) => p.host)).size,
    };
  }, [all]);

  const list = useMemo(() => {
    if (!all) return [];
    const f = fold(q);
    const out = all.filter(
      (p) => (!f || fold(`${p.name} ${p.host}`).includes(f)) && (!method || p.method === method) && (!size || sizeOf(p.radius) === size) && (!onlyTemperate || temperate(p)),
    );
    const key = (p: Exoplanet) => (sort === 'dist' ? (p.dist ?? 1e9) : sort === 'year' ? -(p.year ?? 0) : -(p.radius ?? -1));
    return out.sort((a, b) => key(a) - key(b));
  }, [all, q, method, size, onlyTemperate, sort]);

  const maxYear = stats ? Math.max(...stats.perYear.map((y) => y.n)) : 1;
  const peak = stats ? stats.perYear.reduce((b, y, i) => (y.n > stats.perYear[b].n ? i : b), 0) : 0;
  const shown = stats ? stats.perYear[hover ?? peak] : null;

  return (
    <div className="page learn exo">
      <header className="page-head">
        <a className="back-link" href="#/wissen">
          <ArrowLeft size={16} /> {t('learn.eyebrow')}
        </a>
        <h1>{t('exo.title')}</h1>
        <p className="lead muted">{t('exo.lead')}</p>
      </header>

      {error && <p className="muted">{t('live.error')}</p>}
      {!all && !error && <p className="muted">{t('live.loading')}</p>}

      {stats && all && (
        <>
          <div className="wx-summary">
            <article className="card wx-stat">
              <p className="card-kicker">{t('exo.count')}</p>
              <strong>{fmtInt(all.length, lang)}</strong>
            </article>
            <article className="card wx-stat">
              <p className="card-kicker">{t('exo.systems')}</p>
              <strong>{fmtInt(stats.systems, lang)}</strong>
            </article>
            <article className="card wx-stat">
              <p className="card-kicker">{t('exo.temperate')}</p>
              <strong>{fmtInt(stats.temperate, lang)}</strong>
            </article>
          </div>

          <section className="card exo-chart-card">
            <p className="muted small">
              {t('exo.perYear')} · <span className="diary-chart-value">{shown && t('exo.yearValue', { year: shown.year, n: shown.n })}</span>
            </p>
            <div className="exo-bars" role="img" aria-label={t('exo.perYear')}>
              {stats.perYear.map((y, i) => (
                <button
                  key={y.year}
                  className={`diary-bar ${i === (hover ?? peak) ? 'is-on' : ''}`}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => setHover(i)}
                  aria-label={`${y.year}: ${y.n}`}
                >
                  <span style={{ height: `${(y.n / maxYear) * 100}%` }} />
                </button>
              ))}
            </div>
            <div className="exo-axis muted small">
              <span>{stats.perYear[0].year}</span>
              <span>{stats.perYear[stats.perYear.length - 1].year}</span>
            </div>
            <p className="muted small">
              {stats.methods.map(([m, n]) => `${t(`exo.method.${m}` as MsgKey)} ${fmtInt(n, lang)}`).join(' · ')}
            </p>
          </section>

          <label className="search-box">
            <Search size={18} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('exo.search')} />
          </label>
          <div className="filter-chips">
            {SIZES.map((s) => (
              <button key={s} className={`chip ${size === s ? 'is-on' : ''}`} onClick={() => setSize(size === s ? null : s)}>
                {t(`exo.size.${s}` as MsgKey)}
              </button>
            ))}
            <button className={`chip ${onlyTemperate ? 'is-on' : ''}`} onClick={() => setOnlyTemperate(!onlyTemperate)}>
              {t('exo.onlyTemperate')}
            </button>
          </div>
          <div className="filter-chips">
            {stats.methods.map(([m]) => (
              <button key={m} className={`chip ${method === m ? 'is-on' : ''}`} onClick={() => setMethod(method === m ? null : m)}>
                {t(`exo.method.${m}` as MsgKey)}
              </button>
            ))}
          </div>
          <div className="list-tools">
            <span className="muted small">{t('exo.results', { n: fmtInt(list.length, lang) })}</span>
            <div className="segmented" role="radiogroup" aria-label={t('lists.sort')}>
              {(['dist', 'year', 'radius'] as Sort[]).map((s) => (
                <button key={s} role="radio" aria-checked={sort === s} className={sort === s ? 'is-on' : ''} onClick={() => setSort(s)}>
                  {t(`exo.sort.${s}`)}
                </button>
              ))}
            </div>
          </div>

          <ul className="exo-list">
            {list.slice(0, limit).map((p) => (
              <li key={p.name} className="card exo-item">
                <button className="list-title" onClick={() => setOpen(open === p.name ? null : p.name)} aria-expanded={open === p.name}>
                  <strong>{p.name}</strong>
                  <span className="muted small">
                    {p.dist != null ? t('exo.ly', { n: fmtNum(p.dist * PC_LY, lang, p.dist * PC_LY < 100 ? 1 : 0) }) : '–'}
                    {p.radius != null && ` · ${fmtNum(p.radius, lang, 1)} ${t('exo.earthR')}`}
                    {p.year && ` · ${p.year}`}
                    {temperate(p) && ` · ${t('exo.temperateTag')}`}
                  </span>
                </button>
                {open === p.name && <ExoDetail p={p} />}
              </li>
            ))}
          </ul>
          {list.length > limit && (
            <button className="btn btn-ghost" onClick={() => setLimit(limit + 60)}>
              {t('exo.more')}
            </button>
          )}
          <p className="note">{t('exo.source')}</p>
        </>
      )}
    </div>
  );
}

function ExoDetail({ p }: { p: Exoplanet }) {
  const { t, lang } = useI18n();
  const r = p.radius;
  // Größenvergleich: Erde, Planet (und Jupiter als Maßstab für große Planeten)
  const max = Math.max(r ?? 1, 1);
  const px = (x: number) => 8 + (x / max) * 52;
  const star = p.teff == null ? '#fff' : p.teff > 7000 ? '#cfe0ff' : p.teff > 5300 ? '#fff4d6' : p.teff > 3900 ? '#ffd9a0' : '#ffad7a';
  return (
    <div className="exo-detail">
      {r != null && (
        <svg viewBox="0 0 260 130" className="exo-compare" role="img" aria-label={t('exo.compare')}>
          <circle cx={70} cy={65} r={px(1)} fill="#4f86e8" />
          <text x={70} y={124} className="exo-label">
            {t('exo.earth')}
          </text>
          <circle cx={185} cy={65} r={px(r)} fill={r > 6 ? '#d9b38c' : r > 2 ? '#7fc4d9' : '#b98b6b'} />
          <text x={185} y={124} className="exo-label">
            {p.name.length > 18 ? p.name.slice(0, 17) + '…' : p.name}
          </text>
        </svg>
      )}
      <dl className="detail-grid">
        <dt>{t('exo.host')}</dt>
        <dd>
          <span className="exo-star" style={{ background: star }} /> {p.host}
          {p.vmag != null && ` · ${fmtNum(p.vmag, lang, 1)} mag`}
        </dd>
        {p.mass != null && (
          <>
            <dt>{t('exo.mass')}</dt>
            <dd>{p.mass > 300 ? t('exo.jupiters', { n: fmtNum(p.mass / 317.8, lang, 1) }) : t('exo.earths', { n: fmtNum(p.mass, lang, 1) })}</dd>
          </>
        )}
        {p.period != null && (
          <>
            <dt>{t('exo.period')}</dt>
            <dd>{p.period < 2 ? t('exo.hours', { n: fmtNum(p.period * 24, lang, 1) }) : p.period > 730 ? t('exo.years', { n: fmtNum(p.period / 365.25, lang, 1) }) : t('exo.days', { n: fmtNum(p.period, lang, 1) })}</dd>
          </>
        )}
        {p.a != null && (
          <>
            <dt>{t('exo.distStar')}</dt>
            <dd>{fmtNum(p.a, lang, p.a < 1 ? 3 : 1)} AE</dd>
          </>
        )}
        {p.teq != null && (
          <>
            <dt>{t('exo.temp')}</dt>
            <dd>{fmtInt(p.teq - 273, lang)} °C</dd>
          </>
        )}
        <dt>{t('exo.method')}</dt>
        <dd>{t(`exo.method.${p.method}` as MsgKey)}</dd>
        {p.pnum != null && p.pnum > 1 && (
          <>
            <dt>{t('exo.inSystem')}</dt>
            <dd>{p.pnum}</dd>
          </>
        )}
      </dl>
      <p className="muted small">{t(`exo.methodText.${p.method}` as MsgKey)}</p>
      {p.ra != null && p.dec != null && (
        <a className="link small" href={`#/sky?focus=coord:${p.ra},${p.dec},${encodeURIComponent(p.host)}`}>
          {t('exo.showStar')} <ArrowRight size={14} />
        </a>
      )}
    </div>
  );
}
