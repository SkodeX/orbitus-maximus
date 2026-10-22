// Die großen jährlichen Meteorströme (Werte nach dem Kalender der International Meteor Organization).
// Daten als [Monat, Tag]; das Maximum verschiebt sich von Jahr zu Jahr um etwa einen Tag.

export interface MeteorShower {
  id: string;
  de: string;
  en: string;
  start: [number, number];
  end: [number, number];
  peak: [number, number];
  zhr: number;
  ra: number; // Radiant, Grad
  dec: number;
  speed: number; // km/s
  parent: string;
}

export const SHOWERS: MeteorShower[] = [
  { id: 'qua', de: 'Quadrantiden', en: 'Quadrantids', start: [12, 28], end: [1, 12], peak: [1, 3], zhr: 80, ra: 230, dec: 49, speed: 41, parent: '2003 EH1' },
  { id: 'lyr', de: 'Lyriden', en: 'Lyrids', start: [4, 14], end: [4, 30], peak: [4, 22], zhr: 18, ra: 271, dec: 34, speed: 49, parent: 'C/1861 G1 (Thatcher)' },
  { id: 'eta', de: 'Eta-Aquariiden', en: 'Eta Aquariids', start: [4, 19], end: [5, 28], peak: [5, 6], zhr: 50, ra: 338, dec: -1, speed: 66, parent: '1P/Halley' },
  { id: 'sda', de: 'Südliche Delta-Aquariiden', en: 'Southern Delta Aquariids', start: [7, 12], end: [8, 23], peak: [7, 31], zhr: 25, ra: 340, dec: -16, speed: 41, parent: '96P/Machholz' },
  { id: 'per', de: 'Perseiden', en: 'Perseids', start: [7, 17], end: [8, 24], peak: [8, 12], zhr: 100, ra: 48, dec: 58, speed: 59, parent: '109P/Swift-Tuttle' },
  { id: 'dra', de: 'Draconiden', en: 'Draconids', start: [10, 6], end: [10, 10], peak: [10, 8], zhr: 10, ra: 262, dec: 54, speed: 20, parent: '21P/Giacobini-Zinner' },
  { id: 'ori', de: 'Orioniden', en: 'Orionids', start: [10, 2], end: [11, 7], peak: [10, 21], zhr: 20, ra: 95, dec: 16, speed: 66, parent: '1P/Halley' },
  { id: 'leo', de: 'Leoniden', en: 'Leonids', start: [11, 6], end: [11, 30], peak: [11, 17], zhr: 15, ra: 152, dec: 22, speed: 71, parent: '55P/Tempel-Tuttle' },
  { id: 'gem', de: 'Geminiden', en: 'Geminids', start: [12, 4], end: [12, 20], peak: [12, 14], zhr: 150, ra: 112, dec: 33, speed: 35, parent: '(3200) Phaethon' },
  { id: 'urs', de: 'Ursiden', en: 'Ursids', start: [12, 17], end: [12, 26], peak: [12, 22], zhr: 10, ra: 217, dec: 76, speed: 33, parent: '8P/Tuttle' },
];

const ordinal = ([m, d]: [number, number]) => m * 100 + d;

export function isActive(s: MeteorShower, month: number, day: number) {
  const x = ordinal([month, day]);
  const a = ordinal(s.start);
  const b = ordinal(s.end);
  return a <= b ? x >= a && x <= b : x >= a || x <= b;
}

/** Tage bis zum nächsten Maximum (0 = heute) */
export function daysToPeak(s: MeteorShower, today: Date) {
  const y = today.getFullYear();
  const base = Date.UTC(y, today.getMonth(), today.getDate());
  let peak = Date.UTC(y, s.peak[0] - 1, s.peak[1]);
  if (peak < base - 86_400_000) peak = Date.UTC(y + 1, s.peak[0] - 1, s.peak[1]);
  return Math.round((peak - base) / 86_400_000);
}

export function peakDate(s: MeteorShower, today: Date) {
  const d = new Date(today);
  d.setDate(d.getDate() + daysToPeak(s, today));
  return d;
}

/** Aktive Ströme und die nächsten Maxima, sortiert nach Nähe zum Maximum */
export function showerOutlook(today: Date, count = 3) {
  const m = today.getMonth() + 1;
  const d = today.getDate();
  return SHOWERS.map((s) => ({ shower: s, active: isActive(s, m, d), days: daysToPeak(s, today) }))
    .sort((a, b) => a.days - b.days)
    .slice(0, count);
}

export const activeShowers = (date: Date) => SHOWERS.filter((s) => isActive(s, date.getMonth() + 1, date.getDate()));
