import { useEffect, useRef, useState } from 'react';
import { Award, BookOpen, Clock3, Ruler, Sparkles, Trophy } from 'lucide-react';
import { useI18n } from '../../i18n';
import { useProgress } from '../../learn/progress';
import { BADGES } from '../../learn/badges';
import { ARTICLES } from '../../learn/articles';
import { TIMELINE } from '../../learn/timeline';
import { QUESTIONS } from '../../learn/quiz';
import { Lexicon, ArticlePage } from './Lexicon';
import { Timeline } from './Timeline';
import { Sizes } from './Sizes';
import { Quiz } from './Quiz';
import type { ArticleCategory } from '../../learn/types';

export default function LearnView({ path, query }: { path: string; query: URLSearchParams }) {
  const parts = path.split('/').filter(Boolean);
  const section = parts[1] ?? '';
  const sub = parts[2];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [path]);

  return (
    <>
      {section === 'lexikon' && (sub ? <ArticlePage id={sub} /> : <Lexicon />)}
      {section === 'zeitstrahl' && <Timeline />}
      {section === 'groessen' && <Sizes />}
      {section === 'quiz' && <Quiz scope={(query.get('cat') as ArticleCategory | null) ?? null} />}
      {!['lexikon', 'zeitstrahl', 'groessen', 'quiz'].includes(section) && <LearnHub />}
      <BadgeToast />
    </>
  );
}

/** Zeigt kurz an, wenn ein neues Abzeichen dazugekommen ist */
function BadgeToast() {
  const { t, lang } = useI18n();
  const progress = useProgress();
  const seen = useRef(progress.badges.length);
  const [fresh, setFresh] = useState<string | null>(null);
  useEffect(() => {
    if (progress.badges.length > seen.current) {
      setFresh(progress.badges[progress.badges.length - 1].id);
      const id = window.setTimeout(() => setFresh(null), 4500);
      seen.current = progress.badges.length;
      return () => window.clearTimeout(id);
    }
    seen.current = progress.badges.length;
  }, [progress.badges]);
  const badge = BADGES.find((b) => b.id === fresh);
  if (!badge) return null;
  return (
    <div className="badge-toast" role="status">
      <Award size={22} />
      <div>
        <small>{t('learn.newBadge')}</small>
        <strong>{badge[lang].name}</strong>
      </div>
    </div>
  );
}

/** Artikel des Tages: wechselt täglich, für alle gleich */
function articleOfTheDay() {
  const day = Math.floor(Date.now() / 86_400_000);
  return ARTICLES[day % ARTICLES.length];
}

function LearnHub() {
  const { t, lang } = useI18n();
  const progress = useProgress();
  const read = progress.read.filter((id) => ARTICLES.some((a) => a.id === id)).length;
  const best = progress.quizzes.reduce((m, q) => Math.max(m, q.total ? q.score / q.total : 0), 0);
  const tip = articleOfTheDay();
  const years = [TIMELINE[0]?.date.slice(0, 4), TIMELINE[TIMELINE.length - 1]?.date.slice(0, 4)];
  const cats: ArticleCategory[] = ['solar', 'stars', 'observing', 'spaceflight'];

  return (
    <div className="page learn">
      <header className="page-head">
        <p className="eyebrow">{t('learn.eyebrow')}</p>
        <h1>
          {t('learn.titleA')} <span className="grad">{t('learn.titleB')}</span>
        </h1>
        <p className="lead muted">{t('learn.lead')}</p>
      </header>

      <div className="learn-grid">
        <a className="card learn-card" href="#/wissen/lexikon">
          <BookOpen size={26} />
          <h3>{t('learn.lexicon')}</h3>
          <p className="muted">{t('learn.lexiconText', { n: ARTICLES.length })}</p>
          <div className="meter" aria-label={t('learn.readOf', { n: read, total: ARTICLES.length })}>
            <span style={{ width: `${(read / Math.max(1, ARTICLES.length)) * 100}%` }} />
          </div>
          <small className="muted">{t('learn.readOf', { n: read, total: ARTICLES.length })}</small>
        </a>
        <a className="card learn-card" href="#/wissen/zeitstrahl">
          <Clock3 size={26} />
          <h3>{t('learn.timeline')}</h3>
          <p className="muted">{t('learn.timelineText', { n: TIMELINE.length, from: years[0] ?? '', to: years[1] ?? '' })}</p>
        </a>
        <a className="card learn-card" href="#/wissen/groessen">
          <Ruler size={26} />
          <h3>{t('learn.sizes')}</h3>
          <p className="muted">{t('learn.sizesText')}</p>
        </a>
        <a className="card learn-card" href="#/wissen/quiz">
          <Trophy size={26} />
          <h3>{t('learn.quiz')}</h3>
          <p className="muted">{t('learn.quizText', { n: QUESTIONS.length })}</p>
          {progress.quizzes.length > 0 && (
            <small className="muted">{t('learn.quizStats', { n: progress.quizzes.length, best: Math.round(best * 100) })}</small>
          )}
        </a>
      </div>

      {tip && (
        <section className="section">
          <a className="card tip-of-day" href={`#/wissen/lexikon/${tip.id}`}>
            <p className="card-kicker">
              <Sparkles size={14} /> {t('learn.tipOfDay')} · {t(`learn.cat.${tip.category}`)}
            </p>
            <h3>{tip[lang].title}</h3>
            <p className="muted">{tip[lang].summary}</p>
            <span className="link">{t('learn.readArticle')} →</span>
          </a>
        </section>
      )}

      <section className="section">
        <div className="section-head">
          <p className="eyebrow">{t('learn.badgesEyebrow')}</p>
          <h2>{t('learn.badgesTitle', { n: progress.badges.length, total: BADGES.length })}</h2>
        </div>
        <ul className="badge-grid">
          {BADGES.map((b) => {
            const got = progress.badges.find((x) => x.id === b.id);
            return (
              <li key={b.id} className={`badge-item ${got ? 'is-earned' : ''}`}>
                <span className="badge-medal">
                  <Award size={22} />
                </span>
                <strong>{b[lang].name}</strong>
                <small className="muted">{b[lang].hint}</small>
              </li>
            );
          })}
        </ul>
        <div className="quiz-cats">
          {cats.map((c) => (
            <a key={c} className="chip" href={`#/wissen/quiz?cat=${c}`}>
              {t('learn.quizCat', { cat: t(`learn.cat.${c}`) })}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
