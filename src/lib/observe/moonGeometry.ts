// Wo stehen Erde und Sonne, vom Mond aus gesehen? Selenografische Länge/Breite des Erd- und des
// Sonnenmittelpunkts nach Meeus, „Astronomical Algorithms“, Kap. 53 (optische Libration; die kleine
// physische Libration wird vernachlässigt). Daraus ergeben sich Libration, Lichtgrenze und Colongitude.
import * as A from 'astronomy-engine';

const DEG = Math.PI / 180;
const I = 1.54242 * DEG; // Neigung des Mondäquators gegen die Ekliptik

const norm360 = (x: number) => ((x % 360) + 360) % 360;
const norm180 = (x: number) => ((((x + 180) % 360) + 360) % 360) - 180;

/** Selenografische Koordinaten eines Punktes mit ekliptikaler Länge λ und Breite β (Grad, Ekliptik des Datums) */
function selenographic(lambda: number, beta: number, T: number) {
  const omega = 125.0445479 - 1934.1362891 * T + 0.0020754 * T * T;
  const F = 93.272095 + 483202.0175233 * T - 0.0036539 * T * T;
  const W = (lambda - omega) * DEG;
  const b = beta * DEG;
  const Aang = Math.atan2(Math.sin(W) * Math.cos(b) * Math.cos(I) - Math.sin(b) * Math.sin(I), Math.cos(W) * Math.cos(b));
  const lon = norm180(Aang / DEG - F);
  const lat = Math.asin(-Math.sin(W) * Math.cos(b) * Math.sin(I) - Math.sin(b) * Math.cos(I)) / DEG;
  return { lat, lon };
}

export interface MoonGeometry {
  /** Punkt auf dem Mond, über dem die Erde im Zenit steht (= Libration) */
  earth: { lat: number; lon: number };
  /** Punkt, über dem die Sonne im Zenit steht */
  sun: { lat: number; lon: number };
  /** Colongitude der Sonne: 0° ≈ erstes Viertel (Lichtgrenze bei 0°), 90° Vollmond, 180° letztes Viertel */
  colongitude: number;
  /** Beleuchteter Anteil (0–1) und Phasenwinkel seit Neumond (0–360°) */
  illumination: number;
  phase: number;
  distanceKm: number;
}

export function moonGeometry(date: Date): MoonGeometry {
  const t = A.MakeTime(date);
  const T = t.tt / 36525;
  const moon = A.EclipticGeoMoon(t);
  const sun = A.SunPosition(t);
  const earth = selenographic(moon.lon, moon.lat, T);
  // Sonne vom Mond aus (Meeus 53.2): heliozentrische Länge/Breite des Mondes
  const D = moon.dist; // AE
  const R = sun.vec.Length();
  const lH = sun.elon + 180 + (D / R) * (180 / Math.PI) * Math.cos(moon.lat * DEG) * Math.sin((sun.elon - moon.lon) * DEG);
  const bH = (D / R) * moon.lat;
  const s = selenographic(lH, bH, T);
  const ill = A.Illumination(A.Body.Moon, t);
  return {
    earth,
    sun: s,
    colongitude: norm360(90 - s.lon),
    illumination: ill.phase_fraction,
    phase: A.MoonPhase(t),
    distanceKm: D * 149_597_870.7,
  };
}

/** Selenografisch → Einheitsvektor (x zur Erde bei 0°/0°, y nach Norden, z nach Westen) wie im 3D-Atlas */
export function selVec(lat: number, lon: number): [number, number, number] {
  const c = Math.cos(lat * DEG);
  return [c * Math.cos(lon * DEG), Math.sin(lat * DEG), -c * Math.sin(lon * DEG)];
}

/** Höhe der Sonne (Grad) über einem Punkt der Mondoberfläche */
export function sunAltitudeAt(g: MoonGeometry, lat: number, lon: number) {
  const p = selVec(lat, lon);
  const s = selVec(g.sun.lat, g.sun.lon);
  return Math.asin(Math.max(-1, Math.min(1, p[0] * s[0] + p[1] * s[1] + p[2] * s[2]))) / DEG;
}
