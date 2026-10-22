// Datenformat der Wissens-Inhalte (Lexikon, Zeitstrahl, Quiz). Jeder Eintrag trägt Deutsch und Englisch.
import type { SolarId } from '../solar/bodies';

export type ArticleCategory = 'solar' | 'stars' | 'observing' | 'spaceflight';

export interface ArticleText {
  title: string;
  /** Ein Satz, der neugierig macht */
  summary: string;
  sections: { heading?: string; text: string }[];
  /** Kurze Kennzahlen; bei Körpern mit `solarId` weglassen – die App zeigt dort ihren eigenen Steckbrief */
  facts?: { label: string; value: string }[];
}

export interface Article {
  id: string;
  category: ArticleCategory;
  /** Verknüpfung ins 3D-Sonnensystem */
  solarId?: SolarId;
  /** Verknüpfung in die Sternkarte, z. B. 'body:mars', 'dso:M31', 'meteor:per' */
  skyFocus?: string;
  /** Verwandte Artikel (IDs) */
  related: string[];
  de: ArticleText;
  en: ArticleText;
}

export type TimelineCategory = 'humans' | 'moon' | 'planets' | 'telescopes' | 'stations';

export interface TimelineEvent {
  id: string;
  /** 'YYYY-MM-DD' oder 'YYYY-MM', wie allgemein angegeben (meist UTC) */
  date: string;
  category: TimelineCategory;
  /** Agentur bzw. Land, z. B. 'NASA', 'UdSSR', 'ESA', 'CNSA', 'ISRO', 'SpaceX' */
  agency: string;
  /** Passender Lexikon-Artikel */
  article?: string;
  de: { title: string; text: string };
  en: { title: string; text: string };
}

export interface QuizQuestion {
  id: string;
  category: ArticleCategory;
  difficulty: 1 | 2 | 3;
  /** Index der richtigen Antwort in `options` (in beiden Sprachen dieselbe Reihenfolge) */
  answer: number;
  /** Lexikon-Artikel zum Nachlesen */
  article?: string;
  de: { q: string; options: string[]; explain: string };
  en: { q: string; options: string[]; explain: string };
}
