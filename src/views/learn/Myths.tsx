import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Search } from 'lucide-react';
import { useI18n, type MsgKey } from '../../i18n';
import { MYTHS, type MythCulture } from '../../learn/myths';
import consNames from '../../data/constellation-names.json';
import { fold } from '../../lib/format';
import { ConstellationChart, viewOf } from './ConstellationChart';

const NAMES = consNames as Record<string, { de: string; en: string }>;
const CULTURES: MythCulture[] = ['greek', 'roman', 'babylonian', 'egyptian', 'arabic', 'chinese', 'indian', 'aboriginal', 'polynesian', 'norse', 'indigenous-american', 'african', 'origin'];

export function Myths({ con }: { con: string | null }) {
  return con && NAMES[con] ? <MythDetail con={con} /> : <MythList />;
}

function MythList() {
  const { t, lang } = useI18n();
  const [q, setQ] = useState('');
  const [culture, setCulture] = useState<MythCulture | null>(null);
  const used = CULTURES.filter((c) => MYTHS.some((m) => m.culture === c));

  const groups = useMemo(() => {
    const m = new Map<string, typeof MYTHS>();
    for (const x of MYTHS) {
      if (culture && x.culture !== culture) continue;
      const hay = fold(`${NAMES[x.con]?.de} ${NAMES[x.con]?.en} ${x[lang].title}`);
      if (q && !hay.includes(fold(q))) continue;
      m.set(x.con, [...(m.get(x.con) ?? []), x]);
    }
    return [...m.entries()].sort((a, b) => NAMES[a[0]][lang].localeCompare(NAMES[b[0]][lang], lang));
  }, [q, culture, lang]);

  return (
    <div className="page learn">
      <header className="page-head">
        <a className="back-link" href="#/wissen">
          <ArrowLeft size={16} /> {t('learn.eyebrow')}
        </a>
        <h1>{t('myths.title')}</h1>
        <p className="lead muted">{t('myths.lead')}</p>
      </header>
      <label className="search-box">
        <Search size={18} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('myths.search')} />
      </label>
      <div className="filter-chips">
        <button className={`chip ${culture === null ? 'is-on' : ''}`} onClick={() => setCulture(null)}>
          {t('myths.allCultures')}
        </button>
        {used.map((c) => (
          <button key={c} className={`chip ${culture === c ? 'is-on' : ''}`} onClick={() => setCulture(culture === c ? null : c)}>
            {t(`myths.culture.${c}` as MsgKey)}
          </button>
        ))}
      </div>
      <div className="myth-grid">
        {groups.map(([con, list]) => (
          <a key={con} className="card myth-card" href={`#/wissen/mythen/${con}`}>
            <p className="card-kicker">{[...new Set(list.map((m) => t(`myths.culture.${m.culture}` as MsgKey)))].join(' · ')}</p>
            <h3>{NAMES[con][lang]}</h3>
            <p className="muted small">{list[0][lang].title}</p>
          </a>
        ))}
      </div>
      {!groups.length && <p className="muted">{t('search.none')}</p>}
    </div>
  );
}

function MythDetail({ con }: { con: string }) {
  const { t, lang } = useI18n();
  const list = MYTHS.filter((m) => m.con === con);
  const view = useMemo(() => viewOf(con), [con]);
  const ids = Object.keys(NAMES).sort((a, b) => NAMES[a][lang].localeCompare(NAMES[b][lang], lang));
  const i = ids.indexOf(con);
  const prev = ids[(i - 1 + ids.length) % ids.length];
  const next = ids[(i + 1) % ids.length];
  return (
    <div className="page learn myth-page">
      <header className="page-head">
        <a className="back-link" href="#/wissen/mythen">
          <ArrowLeft size={16} /> {t('myths.title')}
        </a>
        <h1>{NAMES[con][lang]}</h1>
        {lang === 'de' && NAMES[con].en !== NAMES[con].de && <p className="muted">{NAMES[con].en}</p>}
      </header>
      <ConstellationChart view={view} lines={[con]} className="myth-chart" />
      <div className="myth-stories">
        {list.map((m, k) => (
          <article key={k} className="card">
            <p className="card-kicker">{t(`myths.culture.${m.culture}` as MsgKey)}</p>
            <h3>{m[lang].title}</h3>
            <p>{m[lang].text}</p>
          </article>
        ))}
      </div>
      <div className="btn-row myth-actions">
        <a className="btn btn-primary btn-sm" href={`#/sky?focus=con:${con}`}>
          {t('common.showInSky')} <ArrowRight size={15} />
        </a>
        <a className="btn btn-ghost btn-sm" href="#/wissen/trainer">
          {t('trainer.title')}
        </a>
      </div>
      <nav className="article-nav">
        <a href={`#/wissen/mythen/${prev}`}>← {NAMES[prev][lang]}</a>
        <a href={`#/wissen/mythen/${next}`}>{NAMES[next][lang]} →</a>
      </nav>
    </div>
  );
}
