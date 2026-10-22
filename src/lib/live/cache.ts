// Kleiner Cache für Live-Daten in localStorage: schont Rate-Limits und liefert offline den letzten Stand.

interface Entry<T> {
  at: number;
  data: T;
}

const PREFIX = 'orbitus.cache.';

export function readCache<T>(key: string): Entry<T> | null {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as Entry<T>) : null;
  } catch {
    return null;
  }
}

export function writeCache<T>(key: string, data: T) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify({ at: Date.now(), data }));
  } catch {
    // Speicher voll: dann eben ohne Cache
  }
}

export interface CachedResult<T> {
  data: T;
  at: number;
  stale: boolean;
}

const inflight = new Map<string, Promise<CachedResult<unknown>>>();

/**
 * Holt JSON (bzw. Text) von `url`, wandelt es mit `map` in ein kompaktes Format und cacht es `ttlMs` lang.
 * Schlägt der Abruf fehl, wird – falls vorhanden – der alte Stand zurückgegeben.
 */
export function cachedFetch<T>(
  key: string,
  url: string,
  ttlMs: number,
  map: (raw: unknown) => T,
  as: 'json' | 'text' = 'json',
): Promise<CachedResult<T>> {
  const hit = readCache<T>(key);
  if (hit && Date.now() - hit.at < ttlMs) return Promise.resolve({ ...hit, stale: false });
  const running = inflight.get(key);
  if (running) return running as Promise<CachedResult<T>>;

  const p = fetch(url)
    .then((r) => {
      if (!r.ok) throw new Error(`${r.status} ${url}`);
      return as === 'json' ? r.json() : r.text();
    })
    .then((raw) => {
      const data = map(raw);
      writeCache(key, data);
      return { data, at: Date.now(), stale: false };
    })
    .catch((err) => {
      if (hit) return { ...hit, stale: true };
      throw err;
    })
    .finally(() => inflight.delete(key));
  inflight.set(key, p);
  return p;
}
