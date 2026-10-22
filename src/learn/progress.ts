// Lernfortschritt: gelesene Artikel, Quizrunden, benutzte Werkzeuge und Abzeichen.
// Liegt vorerst im localStorage; in Phase 5 wird er mit dem Konto synchronisiert.
import { useSyncExternalStore } from 'react';
import type { ArticleCategory } from './types';

export type QuizScope = ArticleCategory | 'all';

export interface Progress {
  read: string[];
  quizzes: { at: number; scope: QuizScope; score: number; total: number }[];
  /** Fragen, die mindestens einmal richtig beantwortet wurden */
  correct: string[];
  tools: string[];
  badges: { id: string; at: number }[];
  /** Abgehakte Objekte der Beobachtungslisten (IDs wie 'M31', 'C14', 'albireo') */
  observed: string[];
  /** Erledigte Aufgaben der Lernpfade ('pfad:aufgabe') */
  pathTasks: string[];
  /** Sternbild-Trainer: Lernkarten nach dem Karteikasten-Prinzip (Fach 0–5, nächste Wiederholung) */
  cards: Record<string, { box: number; due: number; at: number }>;
}

const KEY = 'orbitus.progress.v1';
const EMPTY: Progress = { read: [], quizzes: [], correct: [], tools: [], badges: [], observed: [], pathTasks: [], cards: {} };

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...EMPTY, ...(JSON.parse(raw) as Partial<Progress>) };
  } catch {
    // privat oder kaputt: leer starten
  }
  return EMPTY;
}

let state: Progress = load();
const listeners = new Set<() => void>();

function save(next: Progress) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Speicher voll: Fortschritt gilt dann nur für diese Sitzung
  }
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function useProgress() {
  return useSyncExternalStore(subscribe, () => state);
}

export function getProgress() {
  return state;
}

/** Fortschritt ändern; `award` prüft danach, ob neue Abzeichen fällig sind, und gibt deren IDs zurück */
export function updateProgress(fn: (p: Progress) => Progress, award?: (p: Progress) => string[]): string[] {
  let next = fn(state);
  const earned = award ? award(next).filter((id) => !next.badges.some((b) => b.id === id)) : [];
  if (earned.length) next = { ...next, badges: [...next.badges, ...earned.map((id) => ({ id, at: Date.now() }))] };
  save(next);
  return earned;
}

export function resetProgress() {
  save(EMPTY);
}
