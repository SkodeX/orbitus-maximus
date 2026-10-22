// Alle aktiven Satelliten von CelesTrak (rund 16.000 Bahnen, etwa 2,7 MB).
// Die Datei ist groß, deshalb liegt sie nicht im localStorage, sondern im Cache Storage des Browsers (12 h).
import * as sat from './sgp4';

const URL = 'https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=tle';
const TTL = 12 * 3_600_000;
const CACHE = 'orbitus-satellites';

export type SatGroup = 'starlink' | 'oneweb' | 'kuiper' | 'china' | 'gnss' | 'stations' | 'geo' | 'other';
export const SAT_GROUPS: SatGroup[] = ['starlink', 'oneweb', 'kuiper', 'china', 'gnss', 'geo', 'stations', 'other'];

export interface Sat {
  name: string;
  id: number;
  group: SatGroup;
  rec: sat.SatRec;
}

export interface SatCatalog {
  at: number;
  sats: Sat[];
}

function classify(name: string, revPerDay: number): SatGroup {
  if (/^STARLINK/.test(name)) return 'starlink';
  if (/^ONEWEB/.test(name)) return 'oneweb';
  if (/^KUIPER/.test(name)) return 'kuiper';
  if (/^(QIANFAN|HULIANWANG|GUOWANG)/.test(name)) return 'china';
  if (/^(ISS |ISS\(|CSS |TIANHE|WENTIAN|MENGTIAN)/.test(name)) return 'stations';
  if (/NAVSTAR|GPS |GLONASS|BEIDOU|GALILEO|GSAT0|QZS|IRNSS|NVS-/.test(name)) return 'gnss';
  // Geostationär: eine Umrundung pro Sterntag
  if (revPerDay > 0.95 && revPerDay < 1.05) return 'geo';
  return 'other';
}

async function fetchTle(): Promise<{ text: string; at: number }> {
  const cache = 'caches' in window ? await caches.open(CACHE).catch(() => null) : null;
  const hit = cache ? await cache.match(URL) : undefined;
  const hitAt = Number(hit?.headers.get('x-orbitus-at') ?? 0);
  if (hit && Date.now() - hitAt < TTL) return { text: await hit.text(), at: hitAt };
  try {
    const r = await fetch(URL);
    // CelesTrak gibt dieselbe Liste höchstens alle zwei Stunden an dieselbe Adresse heraus (sonst 403);
    // dann die wichtigsten Teillisten einzeln holen
    const text = r.ok ? await r.text() : r.status === 403 ? await fetchGroups() : '';
    if (!text.includes('\n1 ')) throw new Error(`Keine Bahndaten (${r.status})`);
    const at = Date.now();
    await cache?.put(URL, new Response(text, { headers: { 'content-type': 'text/plain', 'x-orbitus-at': String(at) } })).catch(() => undefined);
    return { text, at };
  } catch (e) {
    if (hit) return { text: await hit.text(), at: hitAt };
    throw e;
  }
}

const GROUPS = ['starlink', 'oneweb', 'kuiper', 'qianfan', 'gnss', 'geo', 'stations', 'weather', 'resource', 'science', 'planet', 'spire', 'iridium-NEXT', 'globalstar', 'orbcomm', 'cubesat', 'other-comm', 'military'];

/** Teillisten zusammensetzen; doppelte Satelliten (gleiche NORAD-Nummer) nur einmal */
async function fetchGroups(): Promise<string> {
  const parts = await Promise.allSettled(
    GROUPS.map((g) =>
      fetch(`https://celestrak.org/NORAD/elements/gp.php?GROUP=${g}&FORMAT=tle`).then((r) => (r.ok ? r.text() : '')),
    ),
  );
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of parts) {
    if (p.status !== 'fulfilled') continue;
    const lines = p.value.split(/\r?\n/);
    for (let i = 0; i + 2 < lines.length; i += 3) {
      const id = lines[i + 1]?.slice(2, 7);
      if (!lines[i + 1]?.startsWith('1 ') || seen.has(id)) continue;
      seen.add(id);
      out.push(lines[i], lines[i + 1], lines[i + 2]);
    }
  }
  return out.join('\n');
}

let pending: Promise<SatCatalog> | null = null;

/** Lädt und zerlegt die Bahndaten; das Zerlegen läuft in Häppchen, damit die Seite bedienbar bleibt */
export function loadSatellites(onProgress?: (share: number) => void): Promise<SatCatalog> {
  if (!pending) {
    pending = (async () => {
      const { text, at } = await fetchTle();
      const lines = text.split(/\r?\n/);
      const sats: Sat[] = [];
      for (let i = 0; i + 2 < lines.length; i += 3) {
        const name = lines[i].trim();
        const l1 = lines[i + 1];
        const l2 = lines[i + 2];
        if (!l1?.startsWith('1 ') || !l2?.startsWith('2 ')) continue;
        try {
          const rec = sat.twoline2satrec(l1, l2);
          if (rec.error) continue;
          const revPerDay = (rec.no * 1440) / (2 * Math.PI);
          sats.push({ name, id: Number(l1.slice(2, 7)), group: classify(name, revPerDay), rec });
        } catch {
          // fehlerhafte Zeile überspringen
        }
        if (i % 3000 === 0) {
          onProgress?.(i / lines.length);
          await new Promise((r) => setTimeout(r));
        }
      }
      return { at, sats };
    })();
    pending.catch(() => (pending = null));
  }
  return pending;
}
