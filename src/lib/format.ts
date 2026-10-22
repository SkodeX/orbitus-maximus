import type { Lang } from '../state/settings';

const formatters = new Map<string, Intl.DateTimeFormat>();
function dtf(locale: string, tz: string, opts: Intl.DateTimeFormatOptions) {
  const key = `${locale}|${tz}|${JSON.stringify(opts)}`;
  let f = formatters.get(key);
  if (!f) {
    f = new Intl.DateTimeFormat(locale, { ...opts, timeZone: tz });
    formatters.set(key, f);
  }
  return f;
}

export const localeOf = (lang: Lang) => (lang === 'de' ? 'de-DE' : 'en-GB');

export const fmtTime = (d: Date | null | undefined, tz: string, lang: Lang) =>
  d ? dtf(localeOf(lang), tz, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(d) : '–';

export const fmtHour = (d: Date, tz: string, lang: Lang) =>
  dtf(localeOf(lang), tz, { hour: '2-digit', hourCycle: 'h23' }).format(d).replace(/\D/g, '');

export const fmtWeekday = (d: Date, tz: string, lang: Lang) =>
  dtf(localeOf(lang), tz, { weekday: 'long', day: 'numeric', month: 'long' }).format(d);

export const fmtDay = (d: Date, tz: string, lang: Lang) =>
  dtf(localeOf(lang), tz, { weekday: 'short', day: 'numeric', month: 'short' }).format(d);

export const fmtDate = (d: Date, tz: string, lang: Lang) =>
  dtf(localeOf(lang), tz, { day: 'numeric', month: 'long', year: 'numeric' }).format(d);

export const fmtDateTime = (d: Date, tz: string, lang: Lang) =>
  dtf(localeOf(lang), tz, { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(d);

/** Kalendertag (YYYY-MM-DD) in der Zeitzone des Ortes */
export const localDayKey = (d: Date, tz: string) => dtf('en-CA', tz, { year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);

/** Uhrzeit, mit kurzem Wochentag, wenn sie nicht in dieselbe Nacht fällt */
export function fmtEventTime(d: Date | null, ref: Date, tz: string, lang: Lang) {
  if (!d) return '–';
  const hours = Math.abs(d.getTime() - ref.getTime()) / 3_600_000;
  if (hours <= 20) return fmtTime(d, tz, lang);
  return dtf(localeOf(lang), tz, { weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(d);
}

export function fmtDuration(ms: number, lang: Lang) {
  const total = Math.max(0, Math.round(ms / 60_000));
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (lang === 'de') return h ? `${h} Std ${m} Min` : `${m} Min`;
  return h ? `${h} h ${m} min` : `${m} min`;
}

const DIRS = {
  de: ['N', 'NO', 'O', 'SO', 'S', 'SW', 'W', 'NW'],
  en: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'],
};
const DIRS_LONG = {
  de: ['Norden', 'Nordosten', 'Osten', 'Südosten', 'Süden', 'Südwesten', 'Westen', 'Nordwesten'],
  en: ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'],
};
const dirIndex = (az: number) => Math.round((((az % 360) + 360) % 360) / 45) % 8;
export const compass = (az: number, lang: Lang) => DIRS[lang][dirIndex(az)];
export const compassLong = (az: number, lang: Lang) => DIRS_LONG[lang][dirIndex(az)];
export const compassLabels = (lang: Lang) => DIRS[lang];

export const fmtNum = (n: number, lang: Lang, digits = 1) =>
  n.toLocaleString(localeOf(lang), { minimumFractionDigits: digits, maximumFractionDigits: digits });

export const fmtInt = (n: number, lang: Lang) => Math.round(n).toLocaleString(localeOf(lang));

export const fmtDeg = (d: number) => `${Math.round(d)}°`;

export function fmtRA(hours: number) {
  const h = Math.floor(hours);
  const m = (hours - h) * 60;
  return `${h}h ${m.toFixed(1)}m`;
}

export function fmtDec(deg: number) {
  const sign = deg < 0 ? '−' : '+';
  const a = Math.abs(deg);
  let d = Math.floor(a);
  let m = Math.round((a - d) * 60);
  if (m === 60) {
    d += 1;
    m = 0;
  }
  return `${sign}${d}° ${m}′`;
}

export const fmtMag = (m: number, lang: Lang) => (m < 0 ? '−' : '') + fmtNum(Math.abs(m), lang, 1);

export function fmtCoords(lat: number, lon: number, lang: Lang) {
  const ns = lat >= 0 ? 'N' : 'S';
  const ew = lon >= 0 ? (lang === 'de' ? 'O' : 'E') : 'W';
  return `${fmtNum(Math.abs(lat), lang, 2)}° ${ns}, ${fmtNum(Math.abs(lon), lang, 2)}° ${ew}`;
}

/** Diakritika entfernen, für tolerante Suche */
export const fold = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
