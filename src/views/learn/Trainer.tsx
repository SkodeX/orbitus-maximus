import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, RotateCcw, X } from 'lucide-react';
import { useI18n } from '../../i18n';
import { updateProgress, useProgress, type Progress } from '../../learn/progress';
import { constellationAt } from '../../lib/astro';
import consNames from '../../data/constellation-names.json';
import { ConstellationChart, sep, sky, viewOf, type ChartView } from './ConstellationChart';

type Mode = 'recognize' | 'find';
type Deck = 'famous' | 'common' | 'all';

const NAMES = consNames as Record<string, { de: string; en: string }>;
// Karteikasten: Wartezeit bis zur nächsten Wiederholung je Fach
const INTERVALS = [0, 1, 3, 7, 16, 35].map((d) => d * 86_400_000);
const DECKS: Record<Deck, string[]> = {
  famous: sky.constellations.filter((c) => c.rank === 1).map((c) => c.id),
  common: sky.constellations.filter((c) => c.rank <= 2).map((c) => c.id),
  all: sky.constellations.map((c) => c.id),
};

const shuffle = <T,>(a: T[]) => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};

/** Nächste Karte: fällige zuerst, dann neue, sonst eine zufällige */
function nextCard(deck: string[], cards: Progress['cards'], last: string | null) {
  const now = Date.now();
  const due = deck.filter((id) => cards[id] && cards[id].due <= now && id !== last).sort((a, b) => cards[a].due - cards[b].due);
  if (due.length) return due[0];
  const fresh = deck.filter((id) => !cards[id] && id !== last);
  if (fresh.length) return fresh[Math.floor(Math.random() * fresh.length)];
  const rest = deck.filter((id) => id !== last);
  return rest[Math.floor(Math.random() * rest.length)];
}

function grade(id: string, ok: boolean) {
  updateProgress((p) => {
    const box = ok ? Math.min(5, (p.cards[id]?.box ?? 0) + 1) : 0;
    return {
      ...p,
      cards: { ...p.cards, [id]: { box, due: Date.now() + INTERVALS[box], at: Date.now() } },
      tools: p.tools.includes('trainer') ? p.tools : [...p.tools, 'trainer'],
    };
  });
}

export function Trainer() {
  const { t, lang } = useI18n();
  const progress = useProgress();
  const [mode, setMode] = useState<Mode>('recognize');
  const [deckId, setDeckId] = useState<Deck>('famous');
  const deck = DECKS[deckId];
  const [card, setCard] = useState(() => nextCard(DECKS.famous, progress.cards, null));
  const [answer, setAnswer] = useState<string | null>(null);
  const [tap, setTap] = useState<{ ra: number; dec: number; ok: boolean } | null>(null);
  const [round, setRound] = useState({ ok: 0, total: 0 });
  const name = (id: string) => NAMES[id]?.[lang] ?? id;

  const options = useMemo(() => shuffle([card, ...shuffle(deck.filter((x) => x !== card)).slice(0, 3)]), [card, deck]);
  // Beim Finden: Ausschnitt so verschieben, dass das Sternbild nicht genau in der Mitte liegt
  const findView = useMemo<ChartView>(() => {
    const v = viewOf(card);
    const a = Math.random() * Math.PI * 2;
    const off = 18 + Math.random() * 10;
    const dec = Math.max(-80, Math.min(80, v.dec + Math.sin(a) * off));
    const ra = v.ra + (Math.cos(a) * off) / Math.max(0.3, Math.cos((v.dec * Math.PI) / 180));
    return { ra: ((ra % 360) + 360) % 360, dec, fov: 110 };
  }, [card]);

  const known = deck.filter((id) => (progress.cards[id]?.box ?? 0) >= 3).length;
  const answered = answer != null || tap != null;
  const correct = mode === 'recognize' ? answer === card : !!tap?.ok;

  const next = () => {
    setCard(nextCard(deck, progress.cards, card));
    setAnswer(null);
    setTap(null);
  };
  const choose = (id: string) => {
    if (answered) return;
    setAnswer(id);
    grade(card, id === card);
    setRound((r) => ({ ok: r.ok + (id === card ? 1 : 0), total: r.total + 1 }));
  };
  const onTap = (ra: number, dec: number) => {
    if (answered) return;
    const hit = constellationAt(ra / 15, dec);
    const ok = hit === card;
    setTap({ ra, dec, ok });
    if (!ok) setAnswer(hit);
    grade(card, ok);
    setRound((r) => ({ ok: r.ok + (ok ? 1 : 0), total: r.total + 1 }));
  };

  const recView = useMemo(() => viewOf(card), [card]);
  const tapped = mode === 'find' && tap && !tap.ok ? answer : null;

  return (
    <div className="page learn trainer">
      <header className="page-head">
        <a className="back-link" href="#/wissen">
          <ArrowLeft size={16} /> {t('learn.eyebrow')}
        </a>
        <h1>{t('trainer.title')}</h1>
        <p className="lead muted">{t('trainer.lead')}</p>
      </header>

      <div className="trainer-bar">
        <div className="segmented" role="radiogroup" aria-label={t('trainer.mode')}>
          {(['recognize', 'find'] as Mode[]).map((m) => (
            <button
              key={m}
              role="radio"
              aria-checked={mode === m}
              className={mode === m ? 'is-on' : ''}
              onClick={() => {
                setMode(m);
                setAnswer(null);
                setTap(null);
              }}
            >
              {t(`trainer.mode.${m}`)}
            </button>
          ))}
        </div>
        <div className="filter-chips">
          {(['famous', 'common', 'all'] as Deck[]).map((d) => (
            <button
              key={d}
              className={`chip ${deckId === d ? 'is-on' : ''}`}
              onClick={() => {
                setDeckId(d);
                setCard(nextCard(DECKS[d], progress.cards, null));
                setAnswer(null);
                setTap(null);
              }}
            >
              {t(`trainer.deck.${d}`, { n: DECKS[d].length })}
            </button>
          ))}
        </div>
      </div>

      <section className="card trainer-card">
        <p className="trainer-q">{mode === 'recognize' ? t('trainer.qRecognize') : t('trainer.qFind', { name: name(card) })}</p>
        {mode === 'recognize' ? (
          <ConstellationChart view={recView} lines={[card]} labels={answered ? [[card, name(card)]] : []} />
        ) : (
          <ConstellationChart
            view={findView}
            lines={answered ? [card, ...(tapped ? [tapped] : [])] : []}
            labels={answered ? [[card, name(card)], ...(tapped ? ([[tapped, name(tapped)]] as [string, string][]) : [])] : []}
            onTap={onTap}
            marker={tap}
            magLimit={4.8}
          />
        )}

        {mode === 'recognize' && (
          <div className="trainer-options">
            {options.map((id) => (
              <button
                key={id}
                className={`btn btn-ghost ${answered && id === card ? 'is-right' : ''} ${answered && id === answer && id !== card ? 'is-wrong' : ''}`}
                onClick={() => choose(id)}
                disabled={answered && id !== card && id !== answer}
              >
                {name(id)}
              </button>
            ))}
          </div>
        )}

        {answered && (
          <div className={`trainer-result ${correct ? 'is-right' : 'is-wrong'}`}>
            {correct ? <Check size={18} /> : <X size={18} />}
            <span>
              {correct
                ? t('trainer.right', { name: name(card) })
                : mode === 'find' && answer
                  ? t('trainer.wrongFind', { name: name(card), hit: name(answer) })
                  : t('trainer.wrong', { name: name(card) })}
            </span>
          </div>
        )}
        {answered && (
          <div className="btn-row">
            <a className="btn btn-ghost btn-sm" href={`#/wissen/mythen/${card}`}>
              {t('trainer.myth')}
            </a>
            <a className="btn btn-ghost btn-sm" href={`#/sky?focus=con:${card}`}>
              {t('common.showInSky')}
            </a>
            <button className="btn btn-primary btn-sm" onClick={next}>
              {t('trainer.next')} <ArrowRight size={15} />
            </button>
          </div>
        )}
        {mode === 'find' && !answered && sep(findView.ra, findView.dec, recView.ra, recView.dec) > 0 && <p className="muted small">{t('trainer.findHint')}</p>}
      </section>

      <p className="trainer-stats muted">
        {t('trainer.stats', { known, total: deck.length })}
        {round.total > 0 && ` · ${t('trainer.round', { ok: round.ok, total: round.total })}`}
        {round.total > 0 && (
          <button className="link" onClick={() => setRound({ ok: 0, total: 0 })}>
            <RotateCcw size={13} />
          </button>
        )}
      </p>
      <p className="note">{t('trainer.note')}</p>
    </div>
  );
}
