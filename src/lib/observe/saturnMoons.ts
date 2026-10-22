// Saturnmonde: scheinbare Stellung der großen Monde relativ zum Planeten, wie im Teleskop.
// Grundlage sind oskulierende Bahnelemente aus JPL Horizons (scripts/build-ephemerides.mjs),
// gespeichert alle 10 Tage. Für einen Zeitpunkt nehmen wir den nächstgelegenen Elementsatz und
// rechnen höchstens ±5 Tage mit einer reinen Keplerbahn weiter (Fehler < 0,05 Saturnradien).
// Bezugssystem der Elemente: ICRF/J2000-Äquator (wie EQJ in astronomy-engine).
import { Body, GeoVector, MakeTime, RotationAxis } from 'astronomy-engine';

export interface SaturnMoonSeries {
  id: string;
  /** Horizons-Kennung, z. B. '606' */
  horizons: string;
  name: string;
  /** JD (TDB) des ersten Elementsatzes */
  t0: number;
  /** Abstand der Sätze in Tagen */
  step: number;
  /** flach, je Satz: a [km], e, i [°], Ω [°], ω [°], M [°], n [°/Tag] */
  el: number[];
}

export interface SaturnMoonData {
  generated: string;
  saturnRadiusKm: number;
  moons: SaturnMoonSeries[];
}

/**
 * Scheinbare Lage eines Mondes relativ zur Saturnmitte in Saturn-Äquatorradien (60 268 km):
 * x > 0 = Ost (in einer Ansicht mit Norden oben LINKS), y > 0 = Nord,
 * z > 0 = zur Erde hin (vor dem Planeten), z < 0 = dahinter.
 */
export interface SaturnMoonPosition {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
}

const SATURN_RADIUS_KM = 60_268;
const AU_KM = 149_597_870.7;
const C_KM_S = 299_792.458;
const EL_LEN = 7;
const RAD = Math.PI / 180;

let dataPromise: Promise<SaturnMoonData> | null = null;

/** Elementdaten laden (einmalig; nach einem Fehler wird beim nächsten Aufruf erneut versucht) */
export function loadSaturnMoons(): Promise<SaturnMoonData> {
  if (!dataPromise) {
    dataPromise = fetch(`${import.meta.env.BASE_URL}data/saturn-moons.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`saturn-moons.json: HTTP ${r.status}`);
        return r.json() as Promise<SaturnMoonData>;
      })
      .catch((e: unknown) => {
        dataPromise = null;
        throw e;
      });
  }
  return dataPromise;
}

type V3 = [number, number, number];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

/** Saturnzentrischer Ort eines Mondes (km, ICRF/EQJ) zur Zeit jd (TDB) oder null außerhalb der Daten */
function moonVector(m: SaturnMoonSeries, jd: number): V3 | null {
  const count = m.el.length / EL_LEN;
  const k = Math.round((jd - m.t0) / m.step);
  // nur innerhalb der Daten (± ein halber Schritt am Rand)
  if (count === 0 || k < 0 || k >= count) return null;
  const o = k * EL_LEN;
  const [a, e, inc, node, peri, M0, n] = m.el.slice(o, o + EL_LEN);
  const dt = jd - (m.t0 + k * m.step);

  // Keplergleichung E − e·sin E = M per Newton-Verfahren
  const M = (((M0 + n * dt) % 360) + 360) % 360 * RAD;
  let E = M + e * Math.sin(M);
  for (let i = 0; i < 8; i++) {
    const d = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    E -= d;
    if (Math.abs(d) < 1e-12) break;
  }
  const xo = a * (Math.cos(E) - e);
  const yo = a * Math.sqrt(1 - e * e) * Math.sin(E);

  // Bahnebene → ICRF: Drehung um ω, i und Ω
  const cO = Math.cos(node * RAD), sO = Math.sin(node * RAD);
  const cw = Math.cos(peri * RAD), sw = Math.sin(peri * RAD);
  const ci = Math.cos(inc * RAD), si = Math.sin(inc * RAD);
  return [
    xo * (cO * cw - sO * sw * ci) - yo * (cO * sw + sO * cw * ci),
    xo * (sO * cw + cO * sw * ci) - yo * (sO * sw - cO * cw * ci),
    xo * sw * si + yo * cw * si,
  ];
}

/** Blickrichtung Erde → Saturn (lichtlaufzeitkorrigiert) und Himmelsrichtungen Ost/Nord, alles EQJ */
function skyFrame(date: Date) {
  const g = GeoVector(Body.Saturn, date, false);
  const dist = Math.hypot(g.x, g.y, g.z);
  const s: V3 = [g.x / dist, g.y / dist, g.z / dist];
  const h = Math.hypot(s[0], s[1]); // cos δ
  const east: V3 = [-s[1] / h, s[0] / h, 0];
  const north: V3 = [(-s[2] * s[0]) / h, (-s[2] * s[1]) / h, h];
  return { s, east, north, distKm: dist * AU_KM };
}

/**
 * Scheinbare Stellung der Monde relativ zur Saturnmitte, von der Erde aus gesehen.
 * Die Monde werden zur Zeit date − Lichtlaufzeit berechnet (wie Saturn selbst), die
 * Versätze sind Winkelabstände, umgerechnet mit Saturns Entfernung in Saturnradien.
 */
export function saturnMoonPositions(data: SaturnMoonData, date: Date): SaturnMoonPosition[] {
  const f = skyFrame(date);
  const jd = 2_451_545 + MakeTime(date).tt - f.distKm / C_KM_S / 86_400;
  const out: SaturnMoonPosition[] = [];
  for (const m of data.moons) {
    const r = moonVector(m, jd);
    if (!r) continue;
    const along = dot(r, f.s); // > 0: hinter Saturn (weiter weg von der Erde)
    // Perspektive: nähere Monde erscheinen minimal weiter vom Planeten entfernt
    const scale = f.distKm / (f.distKm + along) / SATURN_RADIUS_KM;
    out.push({
      id: m.id,
      name: m.name,
      x: dot(r, f.east) * scale,
      y: dot(r, f.north) * scale,
      z: -along / SATURN_RADIUS_KM,
    });
  }
  return out;
}

/** Saturns Nordpol (Einheitsvektor EQJ) nach IAU-Rotationsmodell */
function saturnPole(date: Date): V3 {
  const n = RotationAxis(Body.Saturn, date).north;
  return [n.x, n.y, n.z];
}

/**
 * Ringöffnung B in Grad: saturnozentrische Breite der Erde. B > 0 = wir blicken auf die
 * Nordseite der Ringe (Nordpol zur Erde geneigt), B < 0 = Südseite, 0 = Kantenstellung.
 */
export function saturnRingTilt(date: Date): number {
  const { s } = skyFrame(date);
  return Math.asin(-dot(saturnPole(date), s)) / RAD;
}

/**
 * Positionswinkel des Saturn-Nordpols in Grad: gemessen am Himmel von Norden über Osten
 * (0° = Pol zeigt nach Norden, 90° = nach Osten). Die Ringe liegen senkrecht dazu.
 */
export function saturnNorthPolePA(date: Date): number {
  const { east, north } = skyFrame(date);
  const p = saturnPole(date);
  const pa = Math.atan2(dot(p, east), dot(p, north)) / RAD;
  return (pa + 360) % 360;
}
