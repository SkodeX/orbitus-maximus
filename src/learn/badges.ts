// Abzeichen und ihre Bedingungen
import { ARTICLES } from './articles';
import { QUESTIONS } from './quiz';
import type { Progress } from './progress';
import type { ArticleCategory } from './types';

export interface Badge {
  id: string;
  de: { name: string; hint: string };
  en: { name: string; hint: string };
  check: (p: Progress) => boolean;
}

const allCorrect = (cat: ArticleCategory) => (p: Progress) =>
  QUESTIONS.filter((q) => q.category === cat).every((q) => p.correct.includes(q.id));

export const TOOLS = ['scale', 'travel', 'weight'] as const;

export const BADGES: Badge[] = [
  {
    id: 'first-steps',
    de: { name: 'Erste Schritte', hint: 'Spiele deine erste Quizrunde.' },
    en: { name: 'First steps', hint: 'Play your first quiz round.' },
    check: (p) => p.quizzes.length >= 1,
  },
  {
    id: 'perfect',
    de: { name: 'Volltreffer', hint: 'Beantworte eine ganze Runde fehlerfrei.' },
    en: { name: 'Bullseye', hint: 'Answer a whole round without a mistake.' },
    check: (p) => p.quizzes.some((q) => q.total >= 10 && q.score === q.total),
  },
  {
    id: 'quizmaster',
    de: { name: 'Quizmaster', hint: 'Spiele zehn Quizrunden.' },
    en: { name: 'Quizmaster', hint: 'Play ten quiz rounds.' },
    check: (p) => p.quizzes.length >= 10,
  },
  {
    id: 'solar',
    de: { name: 'Planetenkenner', hint: 'Beantworte jede Frage zum Sonnensystem einmal richtig.' },
    en: { name: 'Planet expert', hint: 'Answer every solar system question correctly once.' },
    check: allCorrect('solar'),
  },
  {
    id: 'stars',
    de: { name: 'Sternenkenner', hint: 'Beantworte jede Frage zu Sternen und Galaxien einmal richtig.' },
    en: { name: 'Star expert', hint: 'Answer every star and galaxy question correctly once.' },
    check: allCorrect('stars'),
  },
  {
    id: 'observing',
    de: { name: 'Himmelsgucker', hint: 'Beantworte jede Frage zum Beobachten einmal richtig.' },
    en: { name: 'Sky watcher', hint: 'Answer every observing question correctly once.' },
    check: allCorrect('observing'),
  },
  {
    id: 'spaceflight',
    de: { name: 'Raumfahrt-Profi', hint: 'Beantworte jede Frage zur Raumfahrt einmal richtig.' },
    en: { name: 'Spaceflight pro', hint: 'Answer every spaceflight question correctly once.' },
    check: allCorrect('spaceflight'),
  },
  {
    id: 'reader',
    de: { name: 'Leseratte', hint: 'Lies fünf Lexikon-Artikel.' },
    en: { name: 'Bookworm', hint: 'Read five encyclopedia articles.' },
    check: (p) => p.read.length >= 5,
  },
  {
    id: 'encyclopedia',
    de: { name: 'Wandelndes Lexikon', hint: 'Lies alle Lexikon-Artikel.' },
    en: { name: 'Walking encyclopedia', hint: 'Read every encyclopedia article.' },
    check: (p) => ARTICLES.every((a) => p.read.includes(a.id)),
  },
  {
    id: 'explorer',
    de: { name: 'Entdecker', hint: 'Probiere alle drei Werkzeuge unter „Größen & Distanzen“ aus.' },
    en: { name: 'Explorer', hint: 'Try all three tools under “Sizes & distances”.' },
    check: (p) => TOOLS.every((t) => p.tools.includes(t)),
  },
];

export const award = (p: Progress) => BADGES.filter((b) => b.check(p)).map((b) => b.id);
