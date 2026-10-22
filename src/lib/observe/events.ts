// Himmelsereignisse der kommenden Monate, komplett im Browser berechnet:
// Mondphasen, Supermonde, Meteorströme, Finsternisse, Jahreszeiten, Oppositionen,
// größte Elongationen sowie enge Begegnungen von Mond und Planeten.
import * as A from 'astronomy-engine';
import { SHOWERS } from '../meteors';
import { lunarEclipses, solarEclipses } from './eclipses';

export type EventCategory = 'moon' | 'meteors' | 'eclipse' | 'planets' | 'conjunction' | 'season';

export interface SkyEvent {
  id: string;
  category: EventCategory;
  start: Date;
  /** Ende, falls das Ereignis eine Dauer hat */
  end?: Date;
  /** Schlüssel des Titels und Werte zum Einsetzen */
  key: string;
  vars: Record<string, string | number>;
  /** Link in die App */
  link?: string;
}

const PLANETS: [A.Body, string][] = [
  [A.Body.Mercury, 'mercury'],
  [A.Body.Venus, 'venus'],
  [A.Body.Mars, 'mars'],
  [A.Body.Jupiter, 'jupiter'],
  [A.Body.Saturn, 'saturn'],
];
const OUTER: [A.Body, string][] = [
  [A.Body.Mars, 'mars'],
  [A.Body.Jupiter, 'jupiter'],
  [A.Body.Saturn, 'saturn'],
  [A.Body.Uranus, 'uranus'],
  [A.Body.Neptune, 'neptune'],
];
const DAY = 86_400_000;

/** Winkelabstand zweier Körper am Himmel (geozentrisch, Grad) */
function separation(a: A.Body, b: A.Body, t: A.AstroTime) {
  return A.AngleBetween(A.GeoVector(a, t, true), A.GeoVector(b, t, true));
}

/** Lokale Minima einer Funktion über einen Zeitraum, verfeinert per Intervallschachtelung */
function minima(from: number, to: number, stepMs: number, f: (t: number) => number, below: number) {
  const out: { t: number; v: number }[] = [];
  let prev2 = f(from);
  let prev = f(from + stepMs);
  for (let t = from + 2 * stepMs; t <= to; t += stepMs) {
    const cur = f(t);
    if (prev < prev2 && prev <= cur && prev < below) {
      // Goldener Schnitt im Intervall [t − 2·step, t]
      let lo = t - 2 * stepMs;
      let hi = t;
      for (let i = 0; i < 24; i++) {
        const m1 = hi - (hi - lo) / 1.618;
        const m2 = lo + (hi - lo) / 1.618;
        if (f(m1) < f(m2)) hi = m2;
        else lo = m1;
      }
      const tm = (lo + hi) / 2;
      out.push({ t: tm, v: f(tm) });
    }
    prev2 = prev;
    prev = cur;
  }
  return out;
}

export function skyEvents(from: Date, months: number, obs: A.Observer): SkyEvent[] {
  const until = new Date(from.getTime() + months * 30.44 * DAY);
  const inRange = (d: Date) => d >= from && d <= until;
  const out: SkyEvent[] = [];

  // Mondphasen
  let q = A.SearchMoonQuarter(from);
  while (q.time.date <= until) {
    const kind = ['new', 'first', 'full', 'last'][q.quarter];
    out.push({ id: `moon-${q.time.date.getTime()}`, category: 'moon', start: q.time.date, key: `ev.moon.${kind}`, vars: {}, link: '#/sky?focus=body:moon' });
    q = A.NextMoonQuarter(q);
  }

  // Supermond: Vollmond nahe am erdnächsten Punkt der Mondbahn
  let ap = A.SearchLunarApsis(from);
  while (ap.time.date <= until) {
    if (ap.kind === A.ApsisKind.Pericenter) {
      const full = out.find((e) => e.key === 'ev.moon.full' && Math.abs(e.start.getTime() - ap.time.date.getTime()) < 1.5 * DAY);
      if (full && ap.dist_km < 362_000) {
        full.key = 'ev.moon.super';
        full.vars = { km: Math.round(ap.dist_km).toLocaleString() };
      }
    }
    ap = A.NextLunarApsis(ap);
  }

  // Meteorströme (Maxima wiederholen sich jährlich)
  for (let y = from.getFullYear(); y <= until.getFullYear(); y++) {
    for (const s of SHOWERS) {
      const d = new Date(Date.UTC(y, s.peak[0] - 1, s.peak[1], 0));
      if (!inRange(d)) continue;
      const illum = A.Illumination(A.Body.Moon, d).phase_fraction;
      out.push({
        id: `met-${s.id}-${y}`,
        category: 'meteors',
        start: d,
        key: 'ev.meteor',
        vars: { id: s.id, zhr: s.zhr, moon: Math.round(illum * 100) },
        link: `#/sky?focus=meteor:${s.id}`,
      });
    }
  }

  // Finsternisse
  for (const e of solarEclipses(from, 4, obs)) {
    if (!inRange(e.peak)) continue;
    const l = e.local;
    out.push({
      id: `sol-${e.peak.getTime()}`,
      category: 'eclipse',
      start: l?.visible ? l.begin.t : e.peak,
      end: l?.visible ? l.end.t : undefined,
      key: l?.visible ? 'ev.solarLocal' : 'ev.solar',
      vars: { kind: e.kind, pct: l ? Math.round(l.obscuration * 100) : 0 },
      link: '#/beobachten/finsternisse',
    });
  }
  for (const e of lunarEclipses(from, 4, obs)) {
    if (!inRange(e.peak)) continue;
    // Kernschattenphase, bei reinen Halbschattenfinsternissen die ganze Finsternis
    const sd = (e.sdPartial || e.sdPenum) * 60_000;
    out.push({
      id: `lun-${e.peak.getTime()}`,
      category: 'eclipse',
      start: new Date(e.peak.getTime() - sd),
      end: new Date(e.peak.getTime() + sd),
      key: e.moonAlt > 0 ? 'ev.lunarVisible' : 'ev.lunar',
      vars: { kind: e.kind },
      link: '#/beobachten/finsternisse',
    });
  }

  // Jahreszeiten
  for (let y = from.getFullYear(); y <= until.getFullYear(); y++) {
    const s = A.Seasons(y);
    (
      [
        [s.mar_equinox, 'marEquinox'],
        [s.jun_solstice, 'junSolstice'],
        [s.sep_equinox, 'sepEquinox'],
        [s.dec_solstice, 'decSolstice'],
      ] as const
    ).forEach(([t, k]) => {
      if (inRange(t.date)) out.push({ id: `season-${k}-${y}`, category: 'season', start: t.date, key: `ev.season.${k}`, vars: { south: obs.latitude < 0 ? 1 : 0 } });
    });
  }

  // Oppositionen der äußeren Planeten
  for (const [body, id] of OUTER) {
    const t = A.SearchRelativeLongitude(body, 0, from);
    if (inRange(t.date)) {
      const mag = A.Illumination(body, t).mag;
      out.push({ id: `opp-${id}-${t.date.getTime()}`, category: 'planets', start: t.date, key: 'ev.opposition', vars: { planet: id, mag: Math.round(mag * 10) / 10 }, link: `#/sky?focus=body:${id}` });
    }
  }

  // Größte Elongationen von Merkur und Venus
  for (const [body, id] of PLANETS.slice(0, 2)) {
    let t = from;
    for (let i = 0; i < 8; i++) {
      const e = A.SearchMaxElongation(body, t);
      if (!inRange(e.time.date)) break;
      out.push({
        id: `elong-${id}-${e.time.date.getTime()}`,
        category: 'planets',
        start: e.time.date,
        key: e.visibility === 'evening' ? 'ev.elongEvening' : 'ev.elongMorning',
        vars: { planet: id, deg: Math.round(e.elongation) },
        link: `#/sky?focus=body:${id}`,
      });
      t = new Date(e.time.date.getTime() + 10 * DAY);
    }
  }

  // Mond bei hellen Planeten (unter 3°)
  for (const [body, id] of PLANETS.slice(1)) {
    for (const m of minima(from.getTime(), until.getTime(), 3 * 3_600_000, (t) => separation(A.Body.Moon, body, A.MakeTime(new Date(t))), 3)) {
      out.push({ id: `conj-moon-${id}-${m.t}`, category: 'conjunction', start: new Date(m.t), key: 'ev.moonNear', vars: { planet: id, deg: Math.round(m.v * 10) / 10 }, link: `#/sky?focus=body:${id}` });
    }
  }

  // Zwei Planeten dicht beieinander (unter 2°), nicht zu nah an der Sonne
  for (let i = 0; i < PLANETS.length; i++) {
    for (let j = i + 1; j < PLANETS.length; j++) {
      const [a, ida] = PLANETS[i];
      const [b, idb] = PLANETS[j];
      for (const m of minima(from.getTime(), until.getTime(), DAY, (t) => separation(a, b, A.MakeTime(new Date(t))), 2)) {
        const d = new Date(m.t);
        if (A.AngleFromSun(a, d) < 12) continue;
        out.push({ id: `conj-${ida}-${idb}-${m.t}`, category: 'conjunction', start: d, key: 'ev.planetsNear', vars: { a: ida, b: idb, deg: Math.round(m.v * 10) / 10 }, link: `#/sky?focus=body:${ida}` });
      }
    }
  }

  return out.sort((a, b) => a.start.getTime() - b.start.getTime());
}
