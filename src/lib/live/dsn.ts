// Deep Space Network live: welche Antennen in Goldstone, Madrid und Canberra gerade mit welcher Raumsonde funken.
// Quelle: NASA „DSN Now“ (eyes.nasa.gov/dsn), aktualisiert alle paar Sekunden.
import { cachedFetch } from './cache';

const BASE = 'https://eyes.nasa.gov/dsn';

export type DsnSite = 'gdscc' | 'mdscc' | 'cdscc';

export interface DsnConfig {
  /** Kürzel (klein geschrieben) → ausgeschriebener Name, z. B. 'vgr1' → 'Voyager 1' */
  crafts: Record<string, string>;
  /** Antenne → Standort und Größe ('70M', '34M' …) */
  dishes: Record<string, { site: DsnSite; type: string }>;
}

export interface DsnLink {
  dish: string;
  site: DsnSite;
  /** Kürzel der Sonde, wie es DSN Now liefert (z. B. 'VGR1') */
  craft: string;
  up: boolean;
  down: boolean;
  /** Datenrate der Abwärtsverbindung in bit/s */
  rate: number;
  band: string;
  /** Entfernung in km, falls bekannt */
  rangeKm: number | null;
  /** Signallaufzeit hin und zurück in Sekunden, falls bekannt */
  rtlt: number | null;
  az: number;
  el: number;
}

export interface DsnNow {
  at: number;
  links: DsnLink[];
  /** Antennen gesamt bzw. in Wartung */
  dishes: number;
}

const xml = (text: string) => new DOMParser().parseFromString(text, 'text/xml');
const num = (v: string | null) => {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : null;
};

export function loadDsnConfig() {
  return cachedFetch<DsnConfig>(
    'dsn.config',
    `${BASE}/config.xml`,
    7 * 86_400_000,
    (raw) => {
      const doc = xml(raw as string);
      const crafts: DsnConfig['crafts'] = {};
      doc.querySelectorAll('spacecraft').forEach((s) => {
        crafts[(s.getAttribute('name') ?? '').toLowerCase()] = s.getAttribute('friendlyName') ?? '';
      });
      const dishes: DsnConfig['dishes'] = {};
      doc.querySelectorAll('site').forEach((site) => {
        site.querySelectorAll('dish').forEach((d) => {
          dishes[d.getAttribute('name') ?? ''] = { site: site.getAttribute('name') as DsnSite, type: d.getAttribute('type') ?? '' };
        });
      });
      return { crafts, dishes };
    },
    'text',
  );
}

export function loadDsn() {
  return cachedFetch<DsnNow>(
    'dsn.now',
    `${BASE}/data/dsn.xml?r=${Math.floor(Date.now() / 5000)}`,
    20_000,
    (raw) => {
      const doc = xml(raw as string);
      const links: DsnLink[] = [];
      let site: DsnSite = 'gdscc';
      let dishes = 0;
      // Stationen und Antennen stehen nacheinander auf derselben Ebene
      for (const el of Array.from(doc.documentElement.children)) {
        if (el.tagName === 'station') site = el.getAttribute('name') as DsnSite;
        if (el.tagName !== 'dish') continue;
        dishes++;
        const dish = el.getAttribute('name') ?? '';
        const ups = Array.from(el.getElementsByTagName('upSignal'));
        const downs = Array.from(el.getElementsByTagName('downSignal'));
        for (const target of Array.from(el.getElementsByTagName('target'))) {
          const craft = target.getAttribute('name') ?? '';
          // 'DSN' steht für Wartung oder Tests ohne Sonde
          if (!craft || craft === 'DSN' || target.getAttribute('id') === '99') continue;
          const up = ups.find((s) => s.getAttribute('spacecraft') === craft && s.getAttribute('active') === 'true');
          const down = downs.find((s) => s.getAttribute('spacecraft') === craft && s.getAttribute('active') === 'true');
          if (!up && !down) continue;
          links.push({
            dish,
            site,
            craft,
            up: !!up,
            down: !!down,
            rate: num(down?.getAttribute('dataRate') ?? null) ?? 0,
            band: down?.getAttribute('band') ?? up?.getAttribute('band') ?? '',
            rangeKm: num(target.getAttribute('downlegRange')) || num(target.getAttribute('uplegRange')),
            rtlt: num(target.getAttribute('rtlt')),
            az: Number(el.getAttribute('azimuthAngle')) || 0,
            el: Number(el.getAttribute('elevationAngle')) || 0,
          });
        }
      }
      return { at: Date.now(), links, dishes };
    },
    'text',
  );
}

/** Lesbarer Name einer Sonde */
export const craftName = (cfg: DsnConfig | null, code: string) => cfg?.crafts[code.toLowerCase()] || code;
