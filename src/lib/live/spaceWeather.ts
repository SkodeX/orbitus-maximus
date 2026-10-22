// Weltraumwetter vom Space Weather Prediction Center der NOAA
import { cachedFetch } from './cache';

const SWPC = 'https://services.swpc.noaa.gov';
const MIN = 60_000;

export interface Scales {
  /** aktuell (Tag 0) und Vorhersage für die nächsten Tage */
  now: { G: number; S: number; R: number };
  forecast: { date: string; G: number; S: number | null; R: number | null; rMinor: number | null; rMajor: number | null }[];
}

const num = (x: string | null | undefined) => (x == null || x === '' ? null : Number(x));

export function loadScales() {
  return cachedFetch<Scales>('swpc.scales', `${SWPC}/products/noaa-scales.json`, 15 * MIN, (raw) => {
    const j = raw as Record<string, { DateStamp: string; R: { Scale: string | null; MinorProb: string | null; MajorProb: string | null }; S: { Scale: string | null; Prob: string | null }; G: { Scale: string | null } }>;
    const cur = j['0'];
    return {
      now: { G: num(cur?.G?.Scale) ?? 0, S: num(cur?.S?.Scale) ?? 0, R: num(cur?.R?.Scale) ?? 0 },
      forecast: ['1', '2', '3']
        .filter((k) => j[k])
        .map((k) => ({
          date: j[k].DateStamp,
          G: num(j[k].G?.Scale) ?? 0,
          S: num(j[k].S?.Prob),
          R: num(j[k].R?.Scale),
          rMinor: num(j[k].R?.MinorProb),
          rMajor: num(j[k].R?.MajorProb),
        })),
    };
  });
}

export interface KpPoint {
  t: number;
  kp: number;
  kind: 'observed' | 'estimated' | 'predicted';
}

export function loadKpForecast() {
  return cachedFetch<KpPoint[]>('swpc.kpforecast', `${SWPC}/products/noaa-planetary-k-index-forecast.json`, 30 * MIN, (raw) => {
    // Neues Format: Objekte; altes Format: Tabelle mit Kopfzeile
    const rows = raw as ({ time_tag: string; kp: number | string; observed: string } | string[])[];
    return rows
      .map((r) =>
        Array.isArray(r)
          ? { time: r[0], kp: Number(r[1]), kind: r[2] }
          : { time: r.time_tag, kp: Number(r.kp), kind: r.observed },
      )
      .filter((r) => Number.isFinite(r.kp))
      .map((r) => ({
        t: Date.parse(r.time.endsWith('Z') ? r.time : `${r.time.replace(' ', 'T')}Z`),
        kp: r.kp,
        kind: (r.kind === 'observed' || r.kind === 'estimated' ? r.kind : 'predicted') as KpPoint['kind'],
      }));
  });
}

export function loadKpNow() {
  return cachedFetch<{ kp: number; t: number }>('swpc.kpnow', `${SWPC}/json/planetary_k_index_1m.json`, 5 * MIN, (raw) => {
    const rows = raw as { time_tag: string; estimated_kp: number; kp_index: number }[];
    const last = rows[rows.length - 1];
    return { kp: last.estimated_kp ?? last.kp_index, t: Date.parse(`${last.time_tag}Z`) };
  });
}

export interface SolarWind {
  speed: number | null;
  bt: number | null;
  bz: number | null;
  flareNow: string | null;
  flareMax: string | null;
  flareMaxTime: string | null;
}

export async function loadSolarWind() {
  const [speed, mag, flare] = await Promise.allSettled([
    cachedFetch('swpc.speed', `${SWPC}/products/summary/solar-wind-speed.json`, 5 * MIN, (raw) => (raw as { proton_speed: number }[])[0]?.proton_speed ?? null),
    cachedFetch('swpc.mag', `${SWPC}/products/summary/solar-wind-mag-field.json`, 5 * MIN, (raw) => (raw as { bt: number; bz_gsm: number }[])[0] ?? null),
    cachedFetch('swpc.flare', `${SWPC}/json/goes/primary/xray-flares-latest.json`, 5 * MIN, (raw) => (raw as { current_class: string; max_class: string; max_time: string }[])[0] ?? null),
  ]);
  const v = <T,>(r: PromiseSettledResult<{ data: T }>) => (r.status === 'fulfilled' ? r.value.data : null);
  const m = v(mag);
  const f = v(flare);
  const data: SolarWind = {
    speed: v(speed),
    bt: m?.bt ?? null,
    bz: m?.bz_gsm ?? null,
    flareNow: f?.current_class ?? null,
    flareMax: f?.max_class ?? null,
    flareMaxTime: f?.max_time ?? null,
  };
  return { data, at: Date.now(), stale: false };
}

// ------------------------------------------------------------------ Polarlicht

// Geomagnetischer Nordpol (Dipol, IGRF 2025)
const POLE_LAT = 80.8;
const POLE_LON = -72.8;

export function geomagneticLatitude(lat: number, lon: number) {
  const r = Math.PI / 180;
  const s =
    Math.sin(lat * r) * Math.sin(POLE_LAT * r) + Math.cos(lat * r) * Math.cos(POLE_LAT * r) * Math.cos((lon - POLE_LON) * r);
  return Math.asin(s) / r;
}

/**
 * Ab welchem Kp-Wert ist Polarlicht am Horizont des Ortes zu erwarten?
 * Faustregel: Die Sichtbarkeitsgrenze wandert pro Kp-Stufe gut 2° Richtung Äquator.
 */
export function kpNeeded(lat: number, lon: number) {
  const mlat = Math.abs(geomagneticLatitude(lat, lon));
  return Math.max(0, Math.min(9, (65 - mlat) / 2.3));
}

export type KpLevel = 'quiet' | 'unsettled' | 'active' | 'storm' | 'severe';
export function kpLevel(kp: number): KpLevel {
  if (kp < 3) return 'quiet';
  if (kp < 4) return 'unsettled';
  if (kp < 5) return 'active';
  if (kp < 7) return 'storm';
  return 'severe';
}
