// Wolkenvorhersage von Open-Meteo (kostenlos, ohne API-Key, CC BY 4.0)

export interface CloudForecast {
  times: number[]; // ms, volle Stunden
  total: number[];
  low: number[];
  mid: number[];
  high: number[];
}

const cache = new Map<string, { at: number; data: Promise<CloudForecast> }>();
const TTL = 30 * 60_000;

export function fetchClouds(lat: number, lon: number): Promise<CloudForecast> {
  const key = `${lat.toFixed(2)},${lon.toFixed(2)}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL) return hit.data;

  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lon.toFixed(4)}` +
    '&hourly=cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high' +
    '&timeformat=unixtime&timezone=auto&past_days=1&forecast_days=3';
  const data = fetch(url)
    .then((r) => {
      if (!r.ok) throw new Error(`Open-Meteo ${r.status}`);
      return r.json();
    })
    .then((j) => ({
      times: (j.hourly.time as number[]).map((t) => t * 1000),
      total: j.hourly.cloud_cover,
      low: j.hourly.cloud_cover_low,
      mid: j.hourly.cloud_cover_mid,
      high: j.hourly.cloud_cover_high,
    }));
  data.catch(() => cache.delete(key));
  cache.set(key, { at: Date.now(), data });
  return data;
}

/** Stunden der Vorhersage innerhalb eines Zeitraums */
export function cloudHours(f: CloudForecast, from: Date, to: Date) {
  const out: { t: number; total: number; low: number; mid: number; high: number }[] = [];
  f.times.forEach((t, i) => {
    if (t >= from.getTime() - 30 * 60_000 && t <= to.getTime()) {
      out.push({ t, total: f.total[i], low: f.low[i], mid: f.mid[i], high: f.high[i] });
    }
  });
  return out;
}

export function cloudAverage(f: CloudForecast, from: Date, to: Date): number | null {
  const hours = cloudHours(f, from, to).filter((h) => h.total != null);
  if (!hours.length) return null;
  return hours.reduce((sum, h) => sum + h.total, 0) / hours.length;
}
