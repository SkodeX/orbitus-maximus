import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Place } from '../lib/astro';

export type Lang = 'de' | 'en';

export interface SkyLayers {
  constellations: boolean;
  constellationNames: boolean;
  starNames: boolean;
  deepSky: boolean;
  milkyWay: boolean;
  meteors: boolean;
  grid: boolean;
  ground: boolean;
}

export interface Settings {
  lang: Lang;
  place: Place | null;
  recentPlaces: Place[];
  redMode: boolean;
  layers: SkyLayers;
}

const KEY = 'orbitus.settings.v1';

export const DEFAULT_LAYERS: SkyLayers = {
  constellations: true,
  constellationNames: true,
  starNames: true,
  deepSky: true,
  milkyWay: true,
  meteors: true,
  grid: false,
  ground: true,
};

function load(): Settings {
  const lang: Lang = navigator.language?.toLowerCase().startsWith('de') ? 'de' : 'en';
  const base: Settings = { lang, place: null, recentPlaces: [], redMode: false, layers: DEFAULT_LAYERS };
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const saved = JSON.parse(raw) as Partial<Settings>;
      return { ...base, ...saved, layers: { ...DEFAULT_LAYERS, ...saved.layers } };
    }
  } catch {
    // Privater Modus oder kaputter Eintrag: mit Standardwerten weiter
  }
  return base;
}

interface SettingsCtx {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
  setPlace: (p: Place) => void;
  setLayer: (key: keyof SkyLayers, on: boolean) => void;
}

const Ctx = createContext<SettingsCtx | null>(null);

const samePlace = (a: Place, b: Place) => Math.abs(a.lat - b.lat) < 0.01 && Math.abs(a.lon - b.lon) < 0.01;

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(settings));
    } catch {
      // Speicher voll oder gesperrt – Einstellungen gelten dann nur für diese Sitzung
    }
  }, [settings]);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = settings.lang;
    root.classList.toggle('red-mode', settings.redMode);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', settings.redMode ? '#000000' : '#05060f');
  }, [settings.lang, settings.redMode]);

  const update = useCallback((patch: Partial<Settings>) => setSettings((s) => ({ ...s, ...patch })), []);

  const setPlace = useCallback(
    (p: Place) =>
      setSettings((s) => ({
        ...s,
        place: p,
        recentPlaces: [p, ...s.recentPlaces.filter((r) => !samePlace(r, p))].slice(0, 6),
      })),
    [],
  );

  const setLayer = useCallback(
    (key: keyof SkyLayers, on: boolean) => setSettings((s) => ({ ...s, layers: { ...s.layers, [key]: on } })),
    [],
  );

  const value = useMemo(() => ({ settings, update, setPlace, setLayer }), [settings, update, setPlace, setLayer]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSettings() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useSettings außerhalb von SettingsProvider');
  return ctx;
}
