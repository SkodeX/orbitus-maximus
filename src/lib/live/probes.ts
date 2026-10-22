// Raumsonden: vorberechnete JPL-Horizons-Bahnen laden und Positionen, Abstände und Tempo bestimmen.
// Die Daten erzeugt scripts/build-ephemerides.mjs (Horizons erlaubt keine Browserabfragen).
// Koordinaten: heliozentrisch, Ekliptik J2000 (ICRF), Astronomische Einheiten; Zeiten als JD (TDB).
import { Body, HelioVector, MakeTime, RotateVector, Rotation_EQJ_ECL } from 'astronomy-engine';

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

/** Gleichmäßiges Raster für die Zeit ab 2024 – wird kubisch interpoliert */
export interface ProbeNow {
  /** JD (TDB) des ersten Punkts */
  t0: number;
  /** Schrittweite in Tagen */
  step: number;
  /** 'earth': Werte sind geozentrisch (JWST), sonst heliozentrisch */
  center?: 'earth';
  /** flach [x0, y0, z0, x1, …] in AE */
  xyz: number[];
}

/** Grobe Bahn vom Start bis zum Datenende mit variabler Schrittweite – wird linear interpoliert */
export interface ProbePath {
  /** JD (TDB), aufsteigend */
  jd: number[];
  /** flach, heliozentrisch, AE */
  xyz: number[];
}

export interface Probe {
  id: string;
  /** Horizons-Kennung, z. B. '-31' */
  horizons: string;
  /** Startdatum YYYY-MM-DD */
  launch: string;
  agency: string;
  color: string;
  name: { de: string; en: string };
  /** ein Satz: was die Sonde gerade tut */
  status: { de: string; en: string };
  now: ProbeNow | null;
  path: ProbePath;
}

export interface ProbeData {
  generated: string;
  probes: Probe[];
}

export const AU_KM = 149_597_870.7;
const C_KM_S = 299_792.458;

let dataPromise: Promise<ProbeData> | null = null;

/** Sondendaten laden (einmalig, danach aus dem Speicher; nach einem Fehler wird erneut versucht) */
export function loadProbes(): Promise<ProbeData> {
  if (!dataPromise) {
    dataPromise = fetch(`${import.meta.env.BASE_URL}data/probes.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`probes.json: HTTP ${r.status}`);
        return r.json() as Promise<ProbeData>;
      })
      .catch((e: unknown) => {
        dataPromise = null;
        throw e;
      });
  }
  return dataPromise;
}

/** Julianisches Datum in TDB (≈ TT) für einen Zeitpunkt */
export const julianDateTdb = (date: Date) => 2_451_545 + MakeTime(date).tt;

/** 4-Punkt-Lagrange-Interpolation im Raster (identisch zum Prüfcode im Build-Skript) */
function interpNow(now: ProbeNow, jd: number): Vec3 | null {
  const n = now.xyz.length / 3;
  const s = (jd - now.t0) / now.step;
  if (n < 4 || s < 0 || s > n - 1) return null;
  const i = Math.min(Math.floor(s), n - 2);
  // Fenster aus vier Punkten um das Intervall [i, i+1], am Rand verschoben
  const w = Math.min(Math.max(i - 1, 0), n - 4);
  const u = s - w;
  const a = u, b = u - 1, c = u - 2, d = u - 3;
  const g0 = (-b * c * d) / 6;
  const g1 = (a * c * d) / 2;
  const g2 = (-a * b * d) / 2;
  const g3 = (a * b * c) / 6;
  const p = now.xyz;
  const k = w * 3;
  return {
    x: g0 * p[k] + g1 * p[k + 3] + g2 * p[k + 6] + g3 * p[k + 9],
    y: g0 * p[k + 1] + g1 * p[k + 4] + g2 * p[k + 7] + g3 * p[k + 10],
    z: g0 * p[k + 2] + g1 * p[k + 5] + g2 * p[k + 8] + g3 * p[k + 11],
  };
}

/** Lineare Interpolation der groben Bahn */
function interpPath(path: ProbePath, jd: number): Vec3 | null {
  const t = path.jd;
  const n = t.length;
  if (n === 0 || jd < t[0] || jd > t[n - 1]) return null;
  if (n === 1) return { x: path.xyz[0], y: path.xyz[1], z: path.xyz[2] };
  // binäre Suche nach dem Intervall [t[lo], t[lo+1]]
  let lo = 0;
  let hi = n - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (t[mid] <= jd) lo = mid;
    else hi = mid;
  }
  const f = (jd - t[lo]) / (t[hi] - t[lo]);
  const p = path.xyz;
  const k = lo * 3;
  return {
    x: p[k] + (p[k + 3] - p[k]) * f,
    y: p[k + 1] + (p[k + 4] - p[k + 1]) * f,
    z: p[k + 2] + (p[k + 5] - p[k + 2]) * f,
  };
}

const EQJ_TO_ECL = Rotation_EQJ_ECL();

/** Heliozentrische Erdposition, Ekliptik J2000, AE (astronomy-engine, Genauigkeit ~1000 km) */
export function earthPosition(date: Date): Vec3 {
  const v = RotateVector(EQJ_TO_ECL, HelioVector(Body.Earth, date));
  return { x: v.x, y: v.y, z: v.z };
}

/** Geozentrische Position aus der "now"-Tabelle, falls die Sonde dort geozentrisch gespeichert ist */
function geocentricNow(p: Probe, date: Date): Vec3 | null {
  return p.now?.center === 'earth' ? interpNow(p.now, julianDateTdb(date)) : null;
}

/**
 * Heliozentrische Position (Ekliptik J2000, AE) zum Zeitpunkt date:
 * kubisch aus "now", sonst linear aus "path", außerhalb aller Daten null.
 */
export function probePosition(p: Probe, date: Date): Vec3 | null {
  const jd = julianDateTdb(date);
  if (p.now) {
    const v = interpNow(p.now, jd);
    if (v) {
      if (p.now.center !== 'earth') return v;
      const e = earthPosition(date);
      return { x: e.x + v.x, y: e.y + v.y, z: e.z + v.z };
    }
  }
  return interpPath(p.path, jd);
}

const length = (v: Vec3) => Math.hypot(v.x, v.y, v.z);

/** Abstand zur Erde in km (geometrisch, ohne Lichtlaufzeit) oder null */
export function distanceFromEarthKm(p: Probe, date: Date): number | null {
  const geo = geocentricNow(p, date);
  if (geo) return length(geo) * AU_KM;
  const pos = probePosition(p, date);
  if (!pos) return null;
  const e = earthPosition(date);
  return Math.hypot(pos.x - e.x, pos.y - e.y, pos.z - e.z) * AU_KM;
}

/** Abstand zur Sonne in km oder null */
export function distanceFromSunKm(p: Probe, date: Date): number | null {
  const pos = probePosition(p, date);
  return pos ? length(pos) * AU_KM : null;
}

/** Heliozentrische Geschwindigkeit in km/s (zentraler Differenzenquotient über ±30 min) oder null */
export function speedKms(p: Probe, date: Date): number | null {
  const H_MS = 1_800_000;
  const t = date.getTime();
  const pos = probePosition(p, date);
  if (!pos) return null;
  // am Rand der Daten einseitig differenzieren
  const before = probePosition(p, new Date(t - H_MS));
  const after = probePosition(p, new Date(t + H_MS));
  const a = before ?? pos;
  const b = after ?? pos;
  const dtSec = ((before ? H_MS : 0) + (after ? H_MS : 0)) / 1000;
  if (dtSec === 0) return null;
  return (Math.hypot(b.x - a.x, b.y - a.y, b.z - a.z) * AU_KM) / dtSec;
}

/** Lichtlaufzeit in Sekunden für eine Strecke in km */
export const lightTimeSeconds = (km: number) => km / C_KM_S;
