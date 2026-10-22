// Astronomische Berechnungen rund um "Was ist heute Nacht am Himmel?"
// Alle Positionen kommen aus astronomy-engine und gelten topozentrisch für den Beobachtungsort.
import * as A from 'astronomy-engine';

export type PlanetId = 'mercury' | 'venus' | 'mars' | 'jupiter' | 'saturn' | 'uranus' | 'neptune';
export type BodyId = 'sun' | 'moon' | PlanetId;
export const PLANET_IDS: PlanetId[] = ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];

export const BODIES: Record<BodyId, A.Body> = {
  sun: A.Body.Sun,
  moon: A.Body.Moon,
  mercury: A.Body.Mercury,
  venus: A.Body.Venus,
  mars: A.Body.Mars,
  jupiter: A.Body.Jupiter,
  saturn: A.Body.Saturn,
  uranus: A.Body.Uranus,
  neptune: A.Body.Neptune,
};

// Äquatorradien in km, für scheinbare Durchmesser
const RADIUS_KM: Record<BodyId, number> = {
  sun: 695_700,
  moon: 1_737.4,
  mercury: 2_439.7,
  venus: 6_051.8,
  mars: 3_396.2,
  jupiter: 71_492,
  saturn: 60_268,
  uranus: 25_559,
  neptune: 24_764,
};
export const AU_KM = 149_597_870.7;
const HOUR = 3_600_000;

export interface Place {
  name: string;
  region?: string;
  lat: number;
  lon: number;
  elevation?: number;
  tz: string;
  source: 'gps' | 'search';
}

export const observerOf = (p: Pick<Place, 'lat' | 'lon' | 'elevation'>) => new A.Observer(p.lat, p.lon, p.elevation ?? 0);
export const addHours = (d: Date, h: number) => new Date(d.getTime() + h * HOUR);

export interface Position {
  az: number;
  alt: number;
  ra: number; // Stunden, Äquinoktium des Datums
  dec: number;
  raJ2000: number;
  decJ2000: number;
  distAu: number;
}

export function positionOf(id: BodyId, date: Date, obs: A.Observer): Position {
  const body = BODIES[id];
  const ofDate = A.Equator(body, date, obs, true, true);
  const hor = A.Horizon(date, obs, ofDate.ra, ofDate.dec, 'normal');
  const j2000 = A.Equator(body, date, obs, false, true);
  return {
    az: hor.azimuth,
    alt: hor.altitude,
    ra: ofDate.ra,
    dec: ofDate.dec,
    raJ2000: j2000.ra,
    decJ2000: j2000.dec,
    distAu: ofDate.dist,
  };
}

function horizontal(body: A.Body, time: A.AstroTime, obs: A.Observer) {
  const eq = A.Equator(body, time, obs, true, true);
  const hor = A.Horizon(time, obs, eq.ra, eq.dec, 'normal');
  return { alt: hor.altitude, az: hor.azimuth };
}

export const altitudeOf = (id: BodyId, date: Date, obs: A.Observer) => horizontal(BODIES[id], A.MakeTime(date), obs).alt;

export const angularDiameterDeg = (id: BodyId, distAu: number) =>
  (2 * Math.atan(RADIUS_KM[id] / (distAu * AU_KM)) * 180) / Math.PI;

export const constellationAt = (raJ2000Hours: number, decJ2000: number) => A.Constellation(raJ2000Hours, decJ2000).symbol;

export const magnitudeOf = (id: BodyId, date: Date) => A.Illumination(BODIES[id], date).mag;

export type SkyState = 'day' | 'civil' | 'nautical' | 'astro' | 'night';
export function skyState(sunAlt: number): SkyState {
  if (sunAlt > -0.833) return 'day';
  if (sunAlt > -6) return 'civil';
  if (sunAlt > -12) return 'nautical';
  if (sunAlt > -18) return 'astro';
  return 'night';
}

function riseSet(body: A.Body, obs: A.Observer, dir: 1 | -1, start: Date, days: number): Date | null {
  return A.SearchRiseSet(body, obs, dir, start, days)?.date ?? null;
}

export interface RiseSetInfo {
  rise: Date | null;
  set: Date | null;
  transit: { time: Date; alt: number } | null;
}

/** Auf-, Untergang und Höchststand ab `from` (innerhalb von gut einem Tag). */
export function riseSetOf(body: A.Body, obs: A.Observer, from: Date): RiseSetInfo {
  const rise = riseSet(body, obs, +1, from, 1.05);
  const set = riseSet(body, obs, -1, rise ?? from, 1.05);
  const ha = A.SearchHourAngle(body, obs, 0, rise ?? from, +1);
  return { rise, set, transit: { time: ha.time.date, alt: ha.hor.altitude } };
}

/** Auf- und Untergang eines Fixsterns oder Deep-Sky-Objekts (J2000-Koordinaten). */
export function fixedRiseSet(raHours: number, decDeg: number, obs: A.Observer, from: Date): RiseSetInfo {
  A.DefineStar(A.Body.Star1, raHours, decDeg, 1000);
  return riseSetOf(A.Body.Star1, obs, from);
}

// ---------------------------------------------------------------------------
// Die Nacht

export interface NightSample {
  t: number;
  sunAlt: number;
  moonAlt: number;
  planets: Record<PlanetId, { alt: number; az: number }>;
}

export interface Night {
  kind: 'normal' | 'polarDay' | 'polarNight';
  sunset: Date | null;
  sunrise: Date | null;
  civilDusk: Date | null;
  nauticalDusk: Date | null;
  astroDusk: Date | null;
  astroDawn: Date | null;
  nauticalDawn: Date | null;
  civilDawn: Date | null;
  /** Zeitraum, in dem es wirklich dunkel ist (astronomisch, sonst nautisch) */
  darkFrom: Date | null;
  darkTo: Date | null;
  darkKind: 'astro' | 'nautical' | null;
  /** Zeitachse für die Darstellung: 1 h vor Sonnenuntergang bis 1 h nach Sonnenaufgang */
  from: Date;
  to: Date;
  samples: NightSample[];
}

export const SAMPLE_MINUTES = 10;

/** Die aktuelle Nacht (falls die Sonne schon untergegangen ist) oder die kommende. */
export function computeNight(place: Place, now: Date): Night {
  const obs = observerOf(place);
  const sunNow = altitudeOf('sun', now, obs);
  let sunset: Date | null;
  let sunrise: Date | null;
  if (sunNow < -0.833) {
    sunset = riseSet(A.Body.Sun, obs, -1, now, -1.2);
    sunrise = riseSet(A.Body.Sun, obs, +1, now, 1.2);
  } else {
    sunset = riseSet(A.Body.Sun, obs, -1, now, 1.2);
    sunrise = sunset ? riseSet(A.Body.Sun, obs, +1, sunset, 1.2) : null;
  }

  let kind: Night['kind'] = 'normal';
  let start = sunset;
  let end = sunrise;
  if (!start || !end) {
    kind = sunNow < -0.833 ? 'polarNight' : 'polarDay';
    start = start ?? (kind === 'polarNight' ? addHours(now, -4) : now);
    end = end ?? addHours(start, 14);
  }

  const span = (end.getTime() - start.getTime()) / 86_400_000;
  const crossing = (dir: 1 | -1, alt: number) => A.SearchAltitude(A.Body.Sun, obs, dir, start, span, alt)?.date ?? null;
  const civilDusk = crossing(-1, -6);
  const nauticalDusk = crossing(-1, -12);
  const astroDusk = crossing(-1, -18);
  const astroDawn = crossing(+1, -18);
  const nauticalDawn = crossing(+1, -12);
  const civilDawn = crossing(+1, -6);

  let darkKind: Night['darkKind'] = null;
  let darkFrom: Date | null = null;
  let darkTo: Date | null = null;
  if (astroDusk && astroDawn && astroDawn > astroDusk) {
    darkKind = 'astro';
    darkFrom = astroDusk;
    darkTo = astroDawn;
  } else if (nauticalDusk && nauticalDawn && nauticalDawn > nauticalDusk) {
    darkKind = 'nautical';
    darkFrom = nauticalDusk;
    darkTo = nauticalDawn;
  }

  const from = addHours(start, -1);
  const to = addHours(end, 1);
  const samples: NightSample[] = [];
  for (let t = from.getTime(); t <= to.getTime(); t += SAMPLE_MINUTES * 60_000) {
    const time = A.MakeTime(new Date(t));
    const planets = {} as NightSample['planets'];
    for (const id of PLANET_IDS) planets[id] = horizontal(BODIES[id], time, obs);
    samples.push({
      t,
      sunAlt: horizontal(A.Body.Sun, time, obs).alt,
      moonAlt: horizontal(A.Body.Moon, time, obs).alt,
      planets,
    });
  }

  return {
    kind,
    sunset,
    sunrise,
    civilDusk,
    nauticalDusk,
    astroDusk,
    astroDawn,
    nauticalDawn,
    civilDawn,
    darkFrom,
    darkTo,
    darkKind,
    from,
    to,
    samples,
  };
}

// ---------------------------------------------------------------------------
// Planeten

export interface TimeWindow {
  from: Date;
  to: Date;
}

export type Equipment = 'naked' | 'binoculars' | 'telescope';

export interface PlanetReport extends RiseSetInfo {
  id: PlanetId;
  mag: number;
  illum: number;
  distAu: number;
  diameterArcsec: number;
  constellation: string;
  elongation: number;
  side: 'morning' | 'evening';
  now: Position;
  windows: TimeWindow[];
  best: { time: Date; alt: number; az: number } | null;
  eye: Equipment;
}

/** Wann ist ein Planet heute Nacht gut zu sehen? Hoch genug und der Himmel dunkel genug für seine Helligkeit. */
export function planetReport(id: PlanetId, night: Night, obs: A.Observer, now: Date): PlanetReport {
  const body = BODIES[id];
  const ill = A.Illumination(body, now);
  const mag = ill.mag;
  const sunLimit = mag < -1 ? -4 : mag < 1.5 ? -7 : -12;
  const altLimit = id === 'mercury' || id === 'venus' ? 4 : 8;

  const windows: TimeWindow[] = [];
  let best: PlanetReport['best'] = null;
  let open: number | null = null;
  let last = 0;
  for (const s of night.samples) {
    const p = s.planets[id];
    const ok = s.sunAlt < sunLimit && p.alt > altLimit;
    if (ok) {
      if (open === null) open = s.t;
      last = s.t;
      if (!best || p.alt > best.alt) best = { time: new Date(s.t), alt: p.alt, az: p.az };
    } else if (open !== null) {
      windows.push({ from: new Date(open), to: new Date(last) });
      open = null;
    }
  }
  if (open !== null) windows.push({ from: new Date(open), to: new Date(last) });

  const pos = positionOf(id, now, obs);
  const elong = A.Elongation(body, now);
  const rs = riseSetOf(body, obs, addHours(night.from, -4));
  return {
    id,
    mag,
    illum: ill.phase_fraction,
    distAu: pos.distAu,
    diameterArcsec: angularDiameterDeg(id, pos.distAu) * 3600,
    constellation: constellationAt(pos.raJ2000, pos.decJ2000),
    elongation: elong.elongation,
    side: elong.visibility === 'morning' ? 'morning' : 'evening',
    now: pos,
    windows,
    best,
    eye: mag <= 5.5 ? 'naked' : mag <= 8.5 ? 'binoculars' : 'telescope',
    ...rs,
  };
}

// ---------------------------------------------------------------------------
// Mond

export type MoonPhaseKey =
  | 'new'
  | 'waxingCrescent'
  | 'firstQuarter'
  | 'waxingGibbous'
  | 'full'
  | 'waningGibbous'
  | 'lastQuarter'
  | 'waningCrescent';

export function moonPhaseKey(angle: number): MoonPhaseKey {
  if (angle < 7 || angle >= 353) return 'new';
  if (angle < 83) return 'waxingCrescent';
  if (angle < 97) return 'firstQuarter';
  if (angle < 173) return 'waxingGibbous';
  if (angle < 187) return 'full';
  if (angle < 263) return 'waningGibbous';
  if (angle < 277) return 'lastQuarter';
  return 'waningCrescent';
}

export interface MoonReport extends RiseSetInfo {
  phaseAngle: number;
  phase: MoonPhaseKey;
  illum: number;
  waxing: boolean;
  mag: number;
  distKm: number;
  diameterDeg: number;
  constellation: string;
  now: Position;
  next: { new: Date; firstQuarter: Date; full: Date; lastQuarter: Date };
  /** Anteil der dunklen Stunden, in denen der Mond über dem Horizont steht (0–1) */
  upInDark: number | null;
}

export function moonReport(night: Night, obs: A.Observer, now: Date): MoonReport {
  const phaseAngle = A.MoonPhase(now);
  const ill = A.Illumination(A.Body.Moon, now);
  const pos = positionOf('moon', now, obs);

  const next = {} as MoonReport['next'];
  const keys = ['new', 'firstQuarter', 'full', 'lastQuarter'] as const;
  let q = A.SearchMoonQuarter(now);
  for (let i = 0; i < 4; i++) {
    next[keys[q.quarter]] = q.time.date;
    q = A.NextMoonQuarter(q);
  }

  let upInDark: number | null = null;
  if (night.darkFrom && night.darkTo) {
    const dark = night.samples.filter((s) => s.t >= night.darkFrom!.getTime() && s.t <= night.darkTo!.getTime());
    if (dark.length) upInDark = dark.filter((s) => s.moonAlt > 0).length / dark.length;
  }

  return {
    phaseAngle,
    phase: moonPhaseKey(phaseAngle),
    illum: ill.phase_fraction,
    waxing: phaseAngle < 180,
    mag: ill.mag,
    distKm: pos.distAu * AU_KM,
    diameterDeg: angularDiameterDeg('moon', pos.distAu),
    constellation: constellationAt(pos.raJ2000, pos.decJ2000),
    now: pos,
    next,
    upInDark,
    ...riseSetOf(A.Body.Moon, obs, addHours(night.from, -4)),
  };
}

// ---------------------------------------------------------------------------
// Beobachtungsbedingungen

export type ConditionLevel = 'excellent' | 'good' | 'fair' | 'poor';

export function rateConditions(night: Night, moon: MoonReport, cloudAvg: number | null) {
  const moonPenalty = moon.illum * (moon.upInDark ?? 0.5);
  const cloudFactor = cloudAvg == null ? 0.75 : 1 - cloudAvg / 100;
  const darkFactor = night.darkKind === 'astro' ? 1 : night.darkKind === 'nautical' ? 0.75 : 0.5;
  const score = Math.round(100 * cloudFactor * (1 - 0.45 * moonPenalty) * darkFactor);
  const level: ConditionLevel = score >= 75 ? 'excellent' : score >= 55 ? 'good' : score >= 35 ? 'fair' : 'poor';
  return { score, level, moonPenalty };
}

// ---------------------------------------------------------------------------
// Fixe Objekte (Sterne, Deep-Sky, Radianten) zu einem Zeitpunkt in Höhe/Azimut umrechnen

export function fixedHorizontal(raDeg: number, decDeg: number, date: Date, obs: A.Observer) {
  const rot = A.Rotation_EQJ_HOR(date, obs);
  const ra = (raDeg * Math.PI) / 180;
  const dec = (decDeg * Math.PI) / 180;
  const time = A.MakeTime(date);
  const v = new A.Vector(Math.cos(dec) * Math.cos(ra), Math.cos(dec) * Math.sin(ra), Math.sin(dec), time);
  const s = A.HorizonFromVector(A.RotateVector(rot, v), 'normal');
  return { az: s.lon, alt: s.lat };
}

/** Höchster Stand eines fixen Objekts innerhalb eines Zeitfensters (stündlich abgetastet). */
export function bestFixedAltitude(raDeg: number, decDeg: number, from: Date, to: Date, obs: A.Observer) {
  let best = { time: from, alt: -90, az: 0 };
  const stepMs = 30 * 60_000;
  for (let t = from.getTime(); t <= to.getTime(); t += stepMs) {
    const d = new Date(t);
    const h = fixedHorizontal(raDeg, decDeg, d, obs);
    if (h.alt > best.alt) best = { time: d, alt: h.alt, az: h.az };
  }
  return best;
}
