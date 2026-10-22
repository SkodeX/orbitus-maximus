import type { Place } from './astro';
import type { Lang } from '../state/settings';

export interface GeoResult extends Place {
  id: number;
  country?: string;
}

/** Ortssuche über die Open-Meteo-Geocoding-API */
export async function searchPlaces(query: string, lang: Lang, signal?: AbortSignal): Promise<GeoResult[]> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=8&language=${lang}&format=json`;
  const r = await fetch(url, { signal });
  if (!r.ok) throw new Error(`Geocoding ${r.status}`);
  const j = await r.json();
  return (j.results ?? []).map(
    (x: {
      id: number;
      name: string;
      admin1?: string;
      country?: string;
      latitude: number;
      longitude: number;
      elevation?: number;
      timezone?: string;
    }) => ({
      id: x.id,
      name: x.name,
      region: [x.admin1, x.country].filter(Boolean).join(', '),
      country: x.country,
      lat: x.latitude,
      lon: x.longitude,
      elevation: x.elevation ?? 0,
      tz: x.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      source: 'search' as const,
    }),
  );
}

/** Ortsname zu GPS-Koordinaten (BigDataCloud, kostenloser Client-Endpunkt) */
export async function reverseName(lat: number, lon: number, lang: Lang): Promise<{ name: string; region?: string } | null> {
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=${lang}`;
    const r = await fetch(url);
    if (!r.ok) return null;
    const j = await r.json();
    const name = j.city || j.locality || j.principalSubdivision;
    if (!name) return null;
    return { name, region: [j.principalSubdivision, j.countryName].filter((s: string) => s && s !== name).join(', ') };
  } catch {
    return null;
  }
}

export function getGpsPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('unsupported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: false, timeout: 15_000, maximumAge: 10 * 60_000 });
  });
}
