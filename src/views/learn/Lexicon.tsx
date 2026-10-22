import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Orbit, Search, Sparkles, Trophy } from 'lucide-react';
import { useI18n } from '../../i18n';
import { ARTICLES } from '../../learn/articles';
import { award } from '../../learn/badges';
import { updateProgress, useProgress } from '../../learn/progress';
import type { Article, ArticleCategory } from '../../learn/types';
import { BODY, EARTH_RADIUS_KM } from '../../solar/bodies';
import { PlanetGlyph } from '../../components/PlanetGlyph';
import { fmtInt, fmtNum, fold } from '../../lib/format';
import type { BodyId } from '../../lib/astro';

const CATS: ArticleCategory[] = ['solar', 'stars', 'observing', 'spaceflight'];
const GLYPHS = new Set(['sun', 'moon', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto']);

function Glyph({ a, size }: { a: Article; size: number }) {
  if (!a.solarId || !GLYPHS.has(a.solarId)) return null;
  return <PlanetGlyph id={a.solarId as BodyId | 'earth' | 'pluto'} size={size} />;
}

export function Lexicon() {
  const { t, lang } = useI18n();
  const progress = useProgress();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<ArticleCategory | 'all'>('all');

  const list = useMemo(() => {
    const f = fold(q.trim());
    return ARTICLES.filter((a) => (cat === 'all' || a.category === cat) && (!f || fold(`${a[lang].title} ${a[lang].summary}`).includes(f)));
  }, [q, cat, lang]);

  return (
    <div className="page learn">
      <header className="page-head">
        <a className="back-link" href="#/wissen">
          <ArrowLeft size={16} /> {t('learn.eyebrow')}
        </a>
        <h1>{t('learn.lexicon')}</h1>
        <p className="lead muted">{t('learn.lexiconLead')}</p>
      </header>

      <div className="lexicon-tools">
        <label className="search-box">
          <Search size={18} />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('learn.searchPlaceholder')} />
        </label>
        <div className="filter-chips">
          {(['all', ...CATS] as const).map((c) => (
            <button key={c} className={`chip ${cat === c ? 'is-on' : ''}`} onClick={() => setCat(c)}>
              {c === 'all' ? t('learn.all') : t(`learn.cat.${c}`)}
            </button>
          ))}
        </div>
      </div>

      {CATS.filter((c) => list.some((a) => a.category === c)).map((c) => (
        <section key={c} className="section lexicon-section">
          <h2 className="lexicon-cat">{t(`learn.cat.${c}`)}</h2>
          <div className="article-grid">
            {list
              .filter((a) => a.category === c)
              .map((a) => (
                <a key={a.id} className="card article-card" href={`#/wissen/lexikon/${a.id}`}>
                  <div className="article-card-head">
                    <Glyph a={a} size={34} />
                    <h3>{a[lang].title}</h3>
                    {progress.read.includes(a.id) && (
                      <span className="read-mark" title={t('learn.read')}>
                        <Check size={14} />
                      </span>
                    )}
                  </div>
                  <p className="muted">{a[lang].summary}</p>
                </a>
              ))}
          </div>
        </section>
      ))}
      {list.length === 0 && <p className="muted">{t('search.none')}</p>}
    </div>
  );
}

export function ArticlePage({ id }: { id: string }) {
  const { t, lang } = useI18n();
  const index = ARTICLES.findIndex((a) => a.id === id);
  const a = ARTICLES[index];

  // Als gelesen markieren, sobald der Artikel ein paar Sekunden offen ist
  useEffect(() => {
    if (!a) return;
    const timer = window.setTimeout(
      () => updateProgress((p) => (p.read.includes(a.id) ? p : { ...p, read: [...p.read, a.id] }), award),
      4000,
    );
    return () => window.clearTimeout(timer);
  }, [a]);

  if (!a) {
    return (
      <div className="page learn">
        <p className="muted">{t('search.none')}</p>
        <a className="link" href="#/wissen/lexikon">
          {t('learn.lexicon')}
        </a>
      </div>
    );
  }

  const text = a[lang];
  const body = a.solarId ? BODY[a.solarId] : null;
  const prev = ARTICLES[(index - 1 + ARTICLES.length) % ARTICLES.length];
  const next = ARTICLES[(index + 1) % ARTICLES.length];

  return (
    <article className="page learn article">
      <header className="page-head article-head">
        <a className="back-link" href="#/wissen/lexikon">
          <ArrowLeft size={16} /> {t('learn.lexicon')}
        </a>
        <div className="article-title">
          <Glyph a={a} size={64} />
          <div>
            <p className="eyebrow">{t(`learn.cat.${a.category}`)}</p>
            <h1>{text.title}</h1>
          </div>
        </div>
        <p className="lead">{text.summary}</p>
      </header>

      <div className="article-layout">
        <div className="article-body">
          {text.sections.map((s, i) => (
            <section key={i}>
              {s.heading && <h2>{s.heading}</h2>}
              <p>{s.text}</p>
            </section>
          ))}
        </div>

        <aside className="article-side">
          {body?.facts && (
            <div className="card">
              <p className="card-kicker">{t('learn.factsheet')}</p>
              <dl className="detail-grid">
                <dt>{t('solar.stat.diameter')}</dt>
                <dd>
                  {fmtInt(body.radiusKm * 2, lang)} km
                  {body.id !== 'earth' && <small className="block muted">{t('solar.timesEarth', { x: fmtNum(body.radiusKm / EARTH_RADIUS_KM, lang, body.radiusKm < EARTH_RADIUS_KM ? 2 : 1) })}</small>}
                </dd>
                {body.facts.distanceAu != null && (
                  <>
                    <dt>{t('learn.meanDistance')}</dt>
                    <dd>
                      {fmtNum(body.facts.distanceAu, lang, body.facts.distanceAu < 10 ? 2 : 1)} AE
                      <small className="block muted">
                        {fmtInt((body.facts.distanceAu * 149_597_870.7) / 1e6, lang)} {t('unit.mioKm')}
                      </small>
                    </dd>
                  </>
                )}
                {body.facts.yearD && (
                  <>
                    <dt>{t('solar.stat.year')}</dt>
                    <dd>
                      {body.facts.yearD < 1000
                        ? t('solar.days', { n: fmtNum(body.facts.yearD, lang, body.facts.yearD < 100 ? 1 : 0) })
                        : t('solar.years', { n: fmtNum(body.facts.yearD / 365.25, lang, 1) })}
                    </dd>
                  </>
                )}
                <dt>{t('solar.stat.day')}</dt>
                <dd>{body.facts.dayLabel[lang]}</dd>
                {body.facts.moons && (
                  <>
                    <dt>{t('solar.stat.moons')}</dt>
                    <dd>{body.facts.moons}</dd>
                  </>
                )}
                <dt>{t('solar.stat.temp')}</dt>
                <dd>{lang === 'en' ? body.facts.tempC.replace(' bis ', ' to ').replace('.', ',') : body.facts.tempC}</dd>
                <dt>{t('solar.stat.gravity')}</dt>
                <dd>{fmtNum(body.facts.gravity, lang, 1)} m/s²</dd>
              </dl>
            </div>
          )}
          {text.facts && text.facts.length > 0 && (
            <div className="card">
              <p className="card-kicker">{t('learn.facts')}</p>
              <dl className="detail-grid">
                {text.facts.map((f) => (
                  <div key={f.label} className="contents">
                    <dt>{f.label}</dt>
                    <dd>{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
          <div className="card article-actions">
            {a.solarId && (
              <a className="btn btn-ghost btn-sm" href={`#/system?focus=${a.solarId}`}>
                <Orbit size={16} /> {t('learn.in3d')}
              </a>
            )}
            {a.skyFocus && (
              <a className="btn btn-ghost btn-sm" href={`#/sky?focus=${a.skyFocus}`}>
                <Sparkles size={16} /> {t('common.showInSky')}
              </a>
            )}
            <a className="btn btn-ghost btn-sm" href={`#/wissen/quiz?cat=${a.category}`}>
              <Trophy size={16} /> {t('learn.quizCat', { cat: t(`learn.cat.${a.category}`) })}
            </a>
          </div>
          {a.related.length > 0 && (
            <div className="card">
              <p className="card-kicker">{t('learn.related')}</p>
              <div className="related">
                {a.related
                  .map((r) => ARTICLES.find((x) => x.id === r))
                  .filter((x): x is Article => !!x)
                  .map((r) => (
                    <a key={r.id} className="chip" href={`#/wissen/lexikon/${r.id}`}>
                      {r[lang].title}
                    </a>
                  ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      <nav className="article-nav">
        <a href={`#/wissen/lexikon/${prev.id}`}>
          <ArrowLeft size={16} /> {prev[lang].title}
        </a>
        <a href={`#/wissen/lexikon/${next.id}`}>
          {next[lang].title} <ArrowRight size={16} />
        </a>
      </nav>
    </article>
  );
}
