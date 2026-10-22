// ISS: Bahnelemente (TLE) laden, Position berechnen und Überflüge für einen Ort vorhersagen.
// Die Rechnung läuft komplett im Browser mit SGP4 (satellite.js).
import * as sat from './sgp4';
import { altitudeOf, observerOf, type Place } from '../astro';
import { readCache, writeCache } from './cache';

const TLE_KEY = 'tle.25544';
const TLE_TTL = 12 * 3_600_000;
const AU_KM = 149_597_870.7;

interface Tle {
  l1: string;
  l2: string;
}

async function fetchTle(): Promise<Tle> {
  try {
    const txt = await fetch('https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=TLE').then((r) => {
      if (!r.ok) throw new Error(String(r.status));
      return r.text();
    });
    const lines = txt.split(/\r?\n/).map((s) => s.trim());
    const l1 = lines.find((l) => l.startsWith('1 '));
    const l2 = lines.find((l) => l.startsWith('2 '));
    if (l1 && l2) return { l1, l2 };
    throw new Error('Kein TLE');
  } catch {
    // Ersatzquelle
    const j = await fetch('https://api.wheretheiss.at/v1/satellites/25544/tles').then((r) => r.json());
    return { l1: j.line1, l2: j.line2 };
  }
}

let satrecPromise: Promise<sat.SatRec> | null = null;

/** Bahnmodell der ISS (TLE wird 12 h gecacht, bei Netzfehlern gilt der letzte Stand) */
export function loadIss(): Promise<sat.SatRec> {
  if (!satrecPromise) {
    satrecPromise = (async () => {
      const hit = readCache<Tle>(TLE_KEY);
      let tle = hit && Date.now() - hit.at < TLE_TTL ? hit.data : null;
      if (!tle) {
        try {
          tle = await fetchTle();
          writeCache(TLE_KEY, tle);
        } catch (e) {
          if (!hit) throw e;
          tle = hit.data;
        }
      }
      return sat.twoline2satrec(tle.l1, tle.l2);
    })();
    satrecPromise.catch(() => (satrecPromise = null));
  }
  return satrecPromise;
}

export function tleEpoch(rec: sat.SatRec) {
  const year = rec.epochyr < 57 ? 2000 + rec.epochyr : 1900 + rec.epochyr;
  return new Date(Date.UTC(year, 0, 1) + (rec.epochdays - 1) * 86_400_000);
}

const isLit = (eci: sat.EciVec3<number>, date: Date) => sat.shadowFraction(sat.sunPos(sat.jday(date)).rsun, eci) < 0.5;

export interface IssState {
  lat: number;
  lon: number;
  altKm: number;
  speedKmh: number;
  lit: boolean;
}

export function issState(rec: sat.SatRec, date: Date): IssState | null {
  const pv = sat.propagate(rec, date);
  if (!pv) return null;
  const gd = sat.eciToGeodetic(pv.position, sat.gstime(date));
  const v = pv.velocity;
  return {
    lat: sat.degreesLat(gd.latitude),
    lon: sat.degreesLong(gd.longitude),
    altKm: gd.height,
    speedKmh: Math.hypot(v.x, v.y, v.z) * 3600,
    lit: isLit(pv.position, date),
  };
}

/** Bodenspur als [Länge, Breite]-Paare */
export function groundTrack(rec: sat.SatRec, from: Date, to: Date, stepSec = 30): [number, number][] {
  const out: [number, number][] = [];
  for (let t = from.getTime(); t <= to.getTime(); t += stepSec * 1000) {
    const s = issState(rec, new Date(t));
    if (s) out.push([s.lon, s.lat]);
  }
  return out;
}

const geodetic = (p: Place) => ({
  longitude: sat.degreesToRadians(p.lon),
  latitude: sat.degreesToRadians(p.lat),
  height: (p.elevation ?? 0) / 1000,
});

export interface IssLook {
  az: number;
  alt: number;
  rangeKm: number;
}

/** Richtung zur ISS vom Beobachtungsort aus */
export function issLook(rec: sat.SatRec, date: Date, place: Place): IssLook | null {
  const pv = sat.propagate(rec, date);
  if (!pv) return null;
  const la = sat.ecfToLookAngles(geodetic(place), sat.eciToEcf(pv.position, sat.gstime(date)));
  return { az: (la.azimuth * 180) / Math.PI, alt: (la.elevation * 180) / Math.PI, rangeKm: la.rangeSat };
}

/** Grobe Helligkeitsschätzung (Standardhelligkeit −1,3 mag auf 1000 km, diffuse Kugel) */
function magnitude(satEci: sat.EciVec3<number>, date: Date, place: Place, rangeKm: number) {
  const gmst = sat.gstime(date);
  const obs = sat.ecfToEci(sat.geodeticToEcf(geodetic(place)), gmst);
  const sun = sat.sunPos(sat.jday(date)).rsun;
  const toSun = [sun.x * AU_KM - satEci.x, sun.y * AU_KM - satEci.y, sun.z * AU_KM - satEci.z];
  const toObs = [obs.x - satEci.x, obs.y - satEci.y, obs.z - satEci.z];
  const cos =
    (toSun[0] * toObs[0] + toSun[1] * toObs[1] + toSun[2] * toObs[2]) / (Math.hypot(...toSun) * Math.hypot(...toObs));
  const phase = Math.acos(Math.min(1, Math.max(-1, cos)));
  const f = Math.sin(phase) + (Math.PI - phase) * Math.cos(phase);
  return -1.3 + 5 * Math.log10(rangeKm / 1000) - 2.5 * Math.log10(Math.max(f, 1e-3));
}

export interface PassPoint {
  t: Date;
  az: number;
  alt: number;
}

export interface IssPass {
  rise: Date;
  set: Date;
  /** Höchster Punkt des ganzen Überflugs */
  peak: PassPoint;
  /** Sichtbarer Teil: ISS im Sonnenlicht, Himmel dunkel genug, mindestens 10° hoch */
  visible: boolean;
  appear: PassPoint | null;
  vanish: PassPoint | null;
  visiblePeak: PassPoint | null;
  /** Verschwindet die ISS im Erdschatten (statt am Horizont)? */
  intoShadow: boolean;
  mag: number;
  track: PassPoint[];
}

/** Alle Überflüge (über 10° Höhe) in den nächsten `days` Tagen */
export function predictPasses(rec: sat.SatRec, place: Place, from: Date, days = 7): IssPass[] {
  const obs = observerOf(place);
  const el = (t: number) => issLook(rec, new Date(t), place)?.alt ?? -90;
  const refine = (a: number, b: number) => {
    const upA = el(a) > 0;
    for (let i = 0; i < 16; i++) {
      const m = (a + b) / 2;
      if (el(m) > 0 === upA) a = m;
      else b = m;
    }
    return (a + b) / 2;
  };

  const analyze = (rise: number, set: number): IssPass | null => {
    const samples: (PassPoint & { range: number; lit: boolean })[] = [];
    for (let t = rise; t <= set; t += 10_000) {
      const d = new Date(t);
      const pv = sat.propagate(rec, d);
      const lk = issLook(rec, d, place);
      if (!pv || !lk) continue;
      samples.push({ t: d, az: lk.az, alt: lk.alt, range: lk.rangeKm, lit: isLit(pv.position, d) });
    }
    if (!samples.length) return null;
    const peak = samples.reduce((a, b) => (b.alt > a.alt ? b : a));
    if (peak.alt < 10) return null;
    const dark = altitudeOf('sun', peak.t, obs) < -4;
    const vis = dark ? samples.filter((s) => s.alt >= 10 && s.lit) : [];
    const visiblePeak = vis.length ? vis.reduce((a, b) => (b.alt > a.alt ? b : a)) : null;
    let mag = 9;
    if (visiblePeak) {
      const pv = sat.propagate(rec, visiblePeak.t);
      if (pv) mag = magnitude(pv.position, visiblePeak.t, place, visiblePeak.range);
    }
    const last = vis[vis.length - 1];
    const pick = (s: PassPoint | undefined | null) => (s ? { t: s.t, az: s.az, alt: s.alt } : null);
    return {
      rise: new Date(rise),
      set: new Date(set),
      peak: pick(peak)!,
      visible: vis.length > 0,
      appear: pick(vis[0]),
      vanish: pick(last),
      visiblePeak: pick(visiblePeak),
      intoShadow: !!last && last.alt > 12 && samples.some((s) => s.t > last.t && !s.lit),
      mag: Math.max(-4.5, Math.min(4, mag)),
      track: samples.map((s) => ({ t: s.t, az: s.az, alt: s.alt })),
    };
  };

  const passes: IssPass[] = [];
  const step = 60_000;
  const end = from.getTime() + days * 86_400_000;
  let t = from.getTime();
  let prev = el(t);
  let rise: number | null = prev > 0 ? t : null;
  for (t += step; t <= end; t += step) {
    const cur = el(t);
    if (prev <= 0 && cur > 0) rise = refine(t - step, t);
    else if (prev > 0 && cur <= 0 && rise != null) {
      const p = analyze(rise, refine(t - step, t));
      if (p) passes.push(p);
      rise = null;
    }
    prev = cur;
  }
  return passes;
}
