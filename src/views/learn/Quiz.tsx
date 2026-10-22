import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Award, Check, RotateCcw, X } from 'lucide-react';
import { useI18n } from '../../i18n';
import { QUESTIONS } from '../../learn/quiz';
import { ARTICLES } from '../../learn/articles';
import { BADGES, award } from '../../learn/badges';
import { updateProgress, useProgress, type QuizScope } from '../../learn/progress';
import type { ArticleCategory, QuizQuestion } from '../../learn/types';

const ROUND = 10;
const SCOPES: QuizScope[] = ['all', 'solar', 'stars', 'observing', 'spaceflight'];

interface Item {
  q: QuizQuestion;
  /** Anzeige-Reihenfolge der Antworten (Indizes ins Original) */
  order: number[];
}

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Zehn Fragen, bevorzugt solche, die noch nie richtig beantwortet wurden */
function buildRound(scope: QuizScope, correct: string[]): Item[] {
  const pool = QUESTIONS.filter((q) => scope === 'all' || q.category === scope);
  const fresh = shuffle(pool.filter((q) => !correct.includes(q.id)));
  const known = shuffle(pool.filter((q) => correct.includes(q.id)));
  return [...fresh, ...known]
    .slice(0, ROUND)
    .sort((a, b) => a.difficulty - b.difficulty)
    .map((q) => ({ q, order: shuffle([0, 1, 2, 3]) }));
}

export function Quiz({ scope: initial }: { scope: ArticleCategory | null }) {
  const { t, lang } = useI18n();
  const progress = useProgress();
  const [scope, setScope] = useState<QuizScope>(initial ?? 'all');
  const [items, setItems] = useState<Item[] | null>(null);
  const [index, setIndex] = useState(0);
  const [picks, setPicks] = useState<number[]>([]);
  const [earned, setEarned] = useState<string[] | null>(null);
  const explainRef = useRef<HTMLDivElement>(null);
  const answeredNow = items ? picks[index] !== undefined : false;

  // Nach dem Antworten die Erklärung ins Bild holen (auf dem Handy liegt sie sonst unter der Navigation)
  useEffect(() => {
    if (answeredNow) explainRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [answeredNow, index]);

  const start = (s: QuizScope = scope) => {
    setScope(s);
    setItems(buildRound(s, progress.correct));
    setIndex(0);
    setPicks([]);
    setEarned(null);
  };

  const isCorrect = (item: Item, displayIdx: number) => item.order[displayIdx] === item.q.answer;

  // ---------------------------------------------------------------- Start
  if (!items) {
    const last = progress.quizzes.slice(-1)[0];
    return (
      <div className="page learn">
        <header className="page-head">
          <a className="back-link" href="#/wissen">
            <ArrowLeft size={16} /> {t('learn.eyebrow')}
          </a>
          <h1>{t('learn.quiz')}</h1>
          <p className="lead muted">{t('learn.quizLead', { n: ROUND })}</p>
        </header>
        <div className="card quiz-start">
          <p className="card-kicker">{t('learn.chooseTopic')}</p>
          <div className="option-grid">
            {SCOPES.map((s) => {
              const count = QUESTIONS.filter((q) => s === 'all' || q.category === s).length;
              const done = QUESTIONS.filter((q) => (s === 'all' || q.category === s) && progress.correct.includes(q.id)).length;
              return (
                <button key={s} className={`option quiz-scope ${scope === s ? 'is-on' : ''}`} onClick={() => setScope(s)}>
                  <strong>{s === 'all' ? t('learn.allTopics') : t(`learn.cat.${s}`)}</strong>
                  <small className="muted">{t('learn.mastered', { n: done, total: count })}</small>
                </button>
              );
            })}
          </div>
          <button className="btn btn-primary" onClick={() => start()}>
            {t('learn.startQuiz')} <ArrowRight size={18} />
          </button>
          {last && <p className="muted small">{t('learn.lastRound', { score: last.score, total: last.total })}</p>}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------- Ergebnis
  if (earned) {
    const score = items.filter((it, k) => isCorrect(it, picks[k])).length;
    const pct = score / items.length;
    const msg = pct === 1 ? 'learn.result.perfect' : pct >= 0.7 ? 'learn.result.great' : pct >= 0.4 ? 'learn.result.good' : 'learn.result.tryAgain';
    const wrong = items.map((it, k) => ({ it, k })).filter(({ it, k }) => !isCorrect(it, picks[k]));
    return (
      <div className="page learn">
        <div className="card quiz-result">
          <p className="card-kicker">{t('learn.resultKicker')}</p>
          <p className="quiz-score">
            {score}
            <span> / {items.length}</span>
          </p>
          <h2>{t(msg)}</h2>
          {earned.length > 0 && (
            <ul className="earned">
              {earned.map((id) => {
                const b = BADGES.find((x) => x.id === id)!;
                return (
                  <li key={id}>
                    <Award size={20} /> {t('learn.newBadge')}: <strong>{b[lang].name}</strong>
                  </li>
                );
              })}
            </ul>
          )}
          <div className="btn-row">
            <button className="btn btn-primary" onClick={() => start()}>
              <RotateCcw size={16} /> {t('learn.again')}
            </button>
            <button className="btn btn-ghost" onClick={() => setItems(null)}>
              {t('learn.otherTopic')}
            </button>
          </div>
        </div>
        {wrong.length > 0 && (
          <section className="section">
            <h2 className="lexicon-cat">{t('learn.review')}</h2>
            <ul className="review-list">
              {wrong.map(({ it }) => {
                const text = it.q[lang];
                const art = it.q.article ? ARTICLES.find((a) => a.id === it.q.article) : null;
                return (
                  <li key={it.q.id} className="card">
                    <strong>{text.q}</strong>
                    <p className="review-answer">
                      <Check size={15} /> {text.options[it.q.answer]}
                    </p>
                    <p className="muted">{text.explain}</p>
                    {art && (
                      <a className="link" href={`#/wissen/lexikon/${art.id}`}>
                        {t('learn.readMore', { title: art[lang].title })} <ArrowRight size={14} />
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>
    );
  }

  // ---------------------------------------------------------------- Frage
  const item = items[index];
  const text = item.q[lang];
  const pick = picks[index];
  const answered = pick !== undefined;

  const choose = (k: number) => {
    if (answered) return;
    const next = [...picks];
    next[index] = k;
    setPicks(next);
  };

  const proceed = () => {
    if (index < items.length - 1) {
      setIndex(index + 1);
      return;
    }
    const score = items.filter((it, k) => isCorrect(it, picks[k])).length;
    const right = items.filter((it, k) => isCorrect(it, picks[k])).map((it) => it.q.id);
    const got = updateProgress(
      (p) => ({
        ...p,
        quizzes: [...p.quizzes, { at: Date.now(), scope, score, total: items.length }].slice(-100),
        correct: [...new Set([...p.correct, ...right])],
      }),
      award,
    );
    setEarned(got);
  };

  return (
    <div className="page learn">
      <div className="quiz-top">
        <button className="back-link" onClick={() => setItems(null)}>
          <X size={16} /> {t('learn.quitQuiz')}
        </button>
        <span className="muted small">{t('learn.questionOf', { n: index + 1, total: items.length })}</span>
      </div>
      <div className="meter quiz-meter">
        <span style={{ width: `${((index + (answered ? 1 : 0)) / items.length) * 100}%` }} />
      </div>
      <div className="card quiz-card">
        <p className="card-kicker">
          {t(`learn.cat.${item.q.category}`)} · {'★'.repeat(item.q.difficulty)}
        </p>
        <h2 className="quiz-q">{text.q}</h2>
        <div className="quiz-options">
          {item.order.map((orig, k) => {
            const state = !answered ? '' : orig === item.q.answer ? 'is-right' : k === pick ? 'is-wrong' : 'is-dim';
            return (
              <button key={k} className={`quiz-option ${state}`} onClick={() => choose(k)} disabled={answered}>
                <span className="quiz-letter">{'ABCD'[k]}</span>
                <span>{text.options[orig]}</span>
                {answered && orig === item.q.answer && <Check size={18} />}
                {answered && k === pick && orig !== item.q.answer && <X size={18} />}
              </button>
            );
          })}
        </div>
        {answered && (
          <div ref={explainRef} className={`quiz-explain ${isCorrect(item, pick) ? 'is-right' : 'is-wrong'}`}>
            <strong>{isCorrect(item, pick) ? t('learn.correct') : t('learn.wrong')}</strong>
            <p>{text.explain}</p>
            <button className="btn btn-primary btn-sm" onClick={proceed}>
              {index < items.length - 1 ? t('learn.next') : t('learn.finish')} <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
