import { useEffect, useState } from 'react';
import type { CachedResult } from './cache';

export interface LiveState<T> {
  data: T | null;
  at: number | null;
  stale: boolean;
  error: boolean;
}

/** Lädt Live-Daten über eine Loader-Funktion und lädt alle `refreshMs` neu */
export function useLive<T>(load: () => Promise<CachedResult<T>>, deps: unknown[], refreshMs = 0): LiveState<T> {
  const [state, setState] = useState<LiveState<T>>({ data: null, at: null, stale: false, error: false });

  useEffect(() => {
    let alive = true;
    const run = () =>
      load()
        .then((r) => alive && setState({ data: r.data, at: r.at, stale: r.stale, error: false }))
        .catch(() => alive && setState((s) => ({ ...s, error: true })));
    run();
    const id = refreshMs ? window.setInterval(run, refreshMs) : 0;
    return () => {
      alive = false;
      if (id) window.clearInterval(id);
    };
    // Die Loader-Funktion ändert sich nur mit den übergebenen deps
  }, deps);

  return state;
}
