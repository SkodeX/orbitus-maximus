// Wetter von Open-Meteo (kostenlos, ohne API-Key, CC BY 4.0): Wolken in drei Schichten plus die Werte,
// aus denen wir Luftruhe (Seeing), Durchsicht (Transparenz) und Taugefahr abschätzen.

export interface CloudForecast {
  times: number[]; // ms, volle Stunden
  total: number[];
  low: number[];
  mid: number[];
  high: number[];
  /** Relative Luftfeuchte am Boden (%) */
  humidity: number[];
  /** Temperatur und Taupunkt am Boden (°C) */
  temp: number[];
  dew: number[];
  /** Wind am Boden und im Jetstream-Niveau (250 hPa, ~10 km Höhe), km/h */
  wind: number[];
  jet: number[];
  /** Temperatur in 850 hPa (~1,5 km Höhe), °C */
  temp850: number[];
  /** Aerosol-Dicke (Staub, Rauch, Dunst), falls verfügbar */
  aod: (number | null)[];
}

const cache = new Map<string, { at: number; data: Promise<CloudForecast> }>();
const TTL = 30 * 60_000;

const getJson = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error(`Open-Meteo ${r.status}`);
    return r.json();
  });

export function fetchClouds(lat: number, lon: number): Promise<CloudForecast> {
  const key = `${lat.toFixed(2)},${lon.toFixed(2)}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL) return hit.data;

  const loc = `latitude=${lat.toFixed(4)}&longitude=${lon.toFixed(4)}`;
  const url =
    `https://api.open-meteo.com/v1/forecast?${loc}` +
    '&hourly=cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,relative_humidity_2m,temperature_2m,dew_point_2m,wind_speed_10m,wind_speed_250hPa,temperature_850hPa' +
    '&timeformat=unixtime&timezone=auto&past_days=1&forecast_days=3';
  // Aerosole kommen aus einer eigenen Schnittstelle; fehlen sie, schätzen wir die Durchsicht nur aus der Feuchte
  const aerosol = getJson(`https://air-quality-api.open-meteo.com/v1/air-quality?${loc}&hourly=aerosol_optical_depth&timeformat=unixtime&past_days=1&forecast_days=3`)
    .then((j) => new Map<number, number>((j.hourly.time as number[]).map((t, i) => [t * 1000, j.hourly.aerosol_optical_depth[i]])))
    .catch(() => new Map<number, number>());

  const data = Promise.all([getJson(url), aerosol]).then(([j, aod]) => {
    const h = j.hourly;
    const times = (h.time as number[]).map((t) => t * 1000);
    return {
      times,
      total: h.cloud_cover,
      low: h.cloud_cover_low,
      mid: h.cloud_cover_mid,
      high: h.cloud_cover_high,
      humidity: h.relative_humidity_2m,
      temp: h.temperature_2m,
      dew: h.dew_point_2m,
      wind: h.wind_speed_10m,
      jet: h.wind_speed_250hPa,
      temp850: h.temperature_850hPa,
      aod: times.map((t) => aod.get(t) ?? null),
    };
  });
  data.catch(() => cache.delete(key));
  cache.set(key, { at: Date.now(), data });
  return data;
}

/** Stunden der Vorhersage innerhalb eines Zeitraums */
export function cloudHours(f: CloudForecast, from: Date, to: Date) {
  const out: { t: number; i: number; total: number; low: number; mid: number; high: number }[] = [];
  f.times.forEach((t, i) => {
    if (t >= from.getTime() - 30 * 60_000 && t <= to.getTime()) {
      out.push({ t, i, total: f.total[i], low: f.low[i], mid: f.mid[i], high: f.high[i] });
    }
  });
  return out;
}

export function cloudAverage(f: CloudForecast, from: Date, to: Date): number | null {
  const hours = cloudHours(f, from, to).filter((h) => h.total != null);
  if (!hours.length) return null;
  return hours.reduce((sum, h) => sum + h.total, 0) / hours.length;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * Luftruhe (Seeing) als Schulnote 1–5, 5 = sehr ruhig. Eine Faustregel, keine echte Turbulenzrechnung:
 * Starker Jetstream in 10 km Höhe und böiger Bodenwind lassen Sterne flimmern; ein großer
 * Temperaturunterschied zwischen Boden und 1,5 km Höhe deutet auf aufsteigende, unruhige Luft.
 */
export function seeingScore(f: CloudForecast, i: number): number | null {
  const jet = f.jet[i];
  const wind = f.wind[i];
  if (jet == null || wind == null) return null;
  let s = 5 - Math.max(0, jet - 50) / 40 - Math.max(0, wind - 15) / 12;
  const lapse = f.temp[i] != null && f.temp850[i] != null ? f.temp[i] - f.temp850[i] : null;
  if (lapse != null && lapse > 12) s -= (lapse - 12) / 6;
  return clamp(Math.round(s * 2) / 2, 1, 5);
}

/** Durchsicht (Transparenz) 1–5, 5 = glasklar: Aerosole, Feuchte und dünne hohe Wolken trüben */
export function transparencyScore(f: CloudForecast, i: number): number | null {
  const rh = f.humidity[i];
  if (rh == null) return null;
  const aod = f.aod[i];
  let s = 5;
  if (aod != null) s -= Math.max(0, aod - 0.08) / 0.07;
  s -= Math.max(0, rh - 65) / 9;
  if (f.high[i] != null) s -= Math.min(f.high[i], 60) / 30;
  return clamp(Math.round(s * 2) / 2, 1, 5);
}

/** Beschlägt die Optik? Temperatur nahe am Taupunkt */
export const dewRisk = (f: CloudForecast, i: number) => f.temp[i] != null && f.dew[i] != null && f.temp[i] - f.dew[i] < 2.5;
