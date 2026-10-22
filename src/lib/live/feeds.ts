// Live-Feeds: Raketenstarts, Menschen im All, NASA-Bild des Tages, Weltraum-News.
// Alle Quellen sind kostenlos und ohne Login abrufbar; die Daten werden kompakt gecacht.
import { cachedFetch } from './cache';

const LL2 = 'https://ll.thespacedevs.com/2.3.0';
const MIN = 60_000;

// ------------------------------------------------------------------ Raketenstarts

export interface Launch {
  id: string;
  name: string;
  rocket: string;
  mission: string;
  missionText: string;
  orbit: string;
  provider: string;
  net: string;
  precision: string; // Minute, Hour, Day, Month …
  status: string; // Go, TBC, TBD, Hold, In Flight, Success …
  statusName: string;
  pad: string;
  location: string;
  country: string;
  lat: number | null;
  lon: number | null;
  image: string | null;
  links: string[];
}

interface Ll2Launch {
  id: string;
  name: string;
  net: string;
  net_precision?: { name?: string } | null;
  status?: { abbrev?: string; name?: string };
  image?: { image_url?: string; thumbnail_url?: string } | string | null;
  launch_service_provider?: { name?: string };
  rocket?: { configuration?: { full_name?: string; name?: string } };
  mission?: { name?: string; description?: string; orbit?: { abbrev?: string; name?: string }; info_urls?: { url: string }[]; vid_urls?: { url: string }[] } | null;
  pad?: { name?: string; latitude?: string | number; longitude?: string | number; location?: { name?: string }; country?: { alpha_2_code?: string } };
}

export function loadLaunches() {
  return cachedFetch<Launch[]>('launches', `${LL2}/launches/upcoming/?limit=12&mode=normal`, 30 * MIN, (raw) =>
    ((raw as { results: Ll2Launch[] }).results ?? []).map((l) => {
      const img = typeof l.image === 'string' ? l.image : (l.image?.thumbnail_url ?? l.image?.image_url ?? null);
      const [rocket, mission] = l.name.split(' | ');
      const lat = Number(l.pad?.latitude);
      const lon = Number(l.pad?.longitude);
      return {
        id: l.id,
        name: l.name,
        rocket: l.rocket?.configuration?.full_name ?? rocket,
        mission: l.mission?.name ?? mission ?? '',
        missionText: l.mission?.description ?? '',
        orbit: l.mission?.orbit?.abbrev ?? '',
        provider: l.launch_service_provider?.name ?? '',
        net: l.net,
        precision: l.net_precision?.name ?? 'Minute',
        status: l.status?.abbrev ?? '',
        statusName: l.status?.name ?? '',
        pad: l.pad?.name ?? '',
        location: l.pad?.location?.name ?? '',
        country: l.pad?.country?.alpha_2_code ?? '',
        lat: Number.isFinite(lat) ? lat : null,
        lon: Number.isFinite(lon) ? lon : null,
        image: img,
        links: [...(l.mission?.vid_urls ?? []), ...(l.mission?.info_urls ?? [])].map((u) => u.url).slice(0, 2),
      };
    }),
  );
}

// ------------------------------------------------------------------ Menschen im All

export interface Astronaut {
  id: number;
  name: string;
  agency: string;
  country: string;
  image: string | null;
  timeInSpace: string;
  flights: number;
  wiki: string | null;
}

interface Ll2Astronaut {
  id: number;
  name: string;
  agency?: { abbrev?: string; name?: string };
  nationality?: { alpha_2_code?: string }[];
  image?: { thumbnail_url?: string; image_url?: string } | null;
  time_in_space?: string;
  flights_count?: number;
  wiki?: string | null;
}

export function loadAstronauts() {
  return cachedFetch<Astronaut[]>('astronauts', `${LL2}/astronauts/?in_space=true&limit=30&mode=normal`, 12 * 60 * MIN, (raw) =>
    ((raw as { results: Ll2Astronaut[] }).results ?? []).map((a) => ({
      id: a.id,
      name: a.name,
      agency: a.agency?.abbrev || a.agency?.name || '',
      country: a.nationality?.[0]?.alpha_2_code ?? '',
      image: a.image?.thumbnail_url ?? a.image?.image_url ?? null,
      timeInSpace: a.time_in_space ?? '',
      flights: a.flights_count ?? 0,
      wiki: a.wiki ?? null,
    })),
  );
}

// ------------------------------------------------------------------ NASA-Bild des Tages
// Das „Image of the Day“ von nasa.gov über deren WordPress-Schnittstelle. (Die APOD-Schnittstelle
// api.nasa.gov liefert seit dem Umzug von APOD auf science.nasa.gov nur noch das NASA-Logo als Bild.)

export interface NasaImage {
  id: number;
  date: string;
  title: string;
  text: string;
  image: string;
  full: string;
  link: string;
}

const plain = (html: string) => new DOMParser().parseFromString(html, 'text/html').documentElement.textContent?.trim() ?? '';

interface WpImagePost {
  id: number;
  date: string;
  link: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  _embedded?: { 'wp:featuredmedia'?: { source_url?: string; media_details?: { sizes?: Record<string, { source_url: string }> } }[] };
}

export function loadNasaImages() {
  return cachedFetch<NasaImage[]>(
    'nasa.images',
    'https://www.nasa.gov/wp-json/wp/v2/image-article?per_page=12&_embed=wp:featuredmedia&_fields=id,date,link,title,excerpt,_links,_embedded',
    60 * MIN,
    (raw) =>
      (raw as WpImagePost[]).flatMap((p) => {
        const media = p._embedded?.['wp:featuredmedia']?.[0];
        const sizes = media?.media_details?.sizes ?? {};
        const image = sizes.large?.source_url ?? sizes['1536x1536']?.source_url ?? media?.source_url;
        if (!image) return [];
        return [
          {
            id: p.id,
            date: p.date,
            title: plain(p.title.rendered),
            text: plain(p.excerpt.rendered),
            image,
            full: media?.source_url ?? image,
            link: p.link,
          },
        ];
      }),
  );
}

// ------------------------------------------------------------------ News

export interface Article {
  id: number;
  title: string;
  url: string;
  image: string | null;
  site: string;
  summary: string;
  published: string;
}

export function loadNews() {
  return cachedFetch<Article[]>('news', 'https://api.spaceflightnewsapi.net/v4/articles/?limit=12', 20 * MIN, (raw) =>
    ((raw as { results: { id: number; title: string; url: string; image_url: string; news_site: string; summary: string; published_at: string }[] }).results ?? []).map(
      (a) => ({
        id: a.id,
        title: a.title,
        url: a.url,
        image: a.image_url || null,
        site: a.news_site,
        summary: a.summary,
        published: a.published_at,
      }),
    ),
  );
}
