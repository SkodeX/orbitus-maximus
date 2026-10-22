// Kataloge aus public/data/ (erzeugt von scripts/build-catalogs.mjs) und Bahnrechnung für Kleinkörper und Kometen.
//
// Alle Katalogdateien haben denselben kompakten Aufbau:
//   { "meta": {...}, "cols": ["name", "host", ...], "rows": [[...], [...], ...] }
// Jede Zeile ist ein Array in der Reihenfolge von "cols"; fehlende Werte sind null. Die Lader wandeln die
// Zeilen in Objekte mit den Spaltennamen als Schlüssel um (siehe die Row- und Objekttypen unten).
import * as A from 'astronomy-engine';

// ---------------------------------------------------------------------------------------------
// Dateiformat
// ---------------------------------------------------------------------------------------------

export interface CatalogMeta {
  source: string;
  url: string;
  /** Erzeugungsdatum (YYYY-MM-DD) */
  generated: string;
  count: number;
  /** Bezugssystem und Einheiten (Kleinkörper, Kometen, Sterne) */
  frame?: string;
  /** Kometen: betrachtetes Periheldurchgangs-Fenster als JD [von, bis] */
  window?: [number, number];
}

export interface CatalogFile<Row extends readonly unknown[]> {
  meta: CatalogMeta;
  cols: string[];
  rows: Row[];
}

// ---- exoplanets.json ----

/** Entdeckungsmethode; 'timing' = Pulsar-, Pulsations- und Bedeckungs-Timing, 'other' = alles Übrige */
export type DiscoveryMethod = 'transit' | 'rv' | 'imaging' | 'microlensing' | 'ttv' | 'astrometry' | 'timing' | 'other';

/** Eine Zeile in exoplanets.json (NASA Exoplanet Archive, pscomppars) */
export type ExoplanetRow = [
  name: string,
  host: string,
  ra: number | null, // Grad (J2000), 3 Nachkommastellen
  dec: number | null, // Grad
  dist: number | null, // Entfernung in Parsec
  radius: number | null, // Erdradien
  mass: number | null, // Erdmassen (oft nur Mindestmasse M·sin i)
  period: number | null, // Umlaufzeit in Tagen
  a: number | null, // große Halbachse in AE
  teq: number | null, // Gleichgewichtstemperatur in K
  year: number | null, // Entdeckungsjahr
  method: DiscoveryMethod,
  teff: number | null, // Effektivtemperatur des Sterns in K
  vmag: number | null, // V-Helligkeit des Systems
  pnum: number | null, // Anzahl bekannter Planeten im System
];

export interface Exoplanet {
  name: string;
  host: string;
  ra: number | null;
  dec: number | null;
  dist: number | null;
  radius: number | null;
  mass: number | null;
  period: number | null;
  a: number | null;
  teq: number | null;
  year: number | null;
  method: DiscoveryMethod;
  teff: number | null;
  vmag: number | null;
  pnum: number | null;
}

// ---- smallbodies.json ----

/**
 * SBDB-Bahnklasse: IMB/MBA/OMB (innerer/mittlerer/äußerer Hauptgürtel), TJN (Jupiter-Trojaner), TNO,
 * IEO/ATE/APO/AMO (erdnahe Objekte), CEN (Zentauren) u. a.
 */
export type OrbitClass = string;

/**
 * Eine Zeile in smallbodies.json. Oskulierende heliozentrische Bahnelemente, bezogen auf Ekliptik und
 * Äquinoktium J2000. Der Name fehlt (Zeile nur 9 Einträge lang) bei kleinen oder unbenannten Objekten.
 */
export type SmallBodyRow = [
  a: number, // große Halbachse in AE
  e: number, // Exzentrizität (< 1)
  i: number, // Bahnneigung in Grad
  om: number, // Länge des aufsteigenden Knotens in Grad
  w: number, // Argument des Perihels in Grad
  ma: number, // mittlere Anomalie zur Epoche in Grad
  epoch: number, // Epoche der Elemente als JD (TDB)
  H: number, // absolute Helligkeit
  cls: OrbitClass,
  name?: string,
];

export interface SmallBody {
  a: number;
  e: number;
  i: number;
  om: number;
  w: number;
  ma: number;
  epoch: number;
  H: number;
  class: OrbitClass;
  /** IAU-Name nur für große bzw. bekannte Objekte, sonst null */
  name: string | null;
}

// ---- comets.json ----

/**
 * Eine Zeile in comets.json: Kometen mit Perihel im Fenster (meta.window) und bekannten Helligkeitsparametern,
 * dazu periodische Kometen mit q < 2 AE, deren nächstes Perihel ins Fenster fällt. Elemente heliozentrisch,
 * Ekliptik und Äquinoktium J2000. tp bezieht sich auf die Epoche der Bahnlösung und kann bei periodischen
 * Kometen einen oder mehrere Umläufe zurückliegen.
 */
export type CometRow = [
  name: string, // z. B. "2P/Encke", "C/2025 A6 (Lemmon)"
  q: number, // Periheldistanz in AE
  e: number, // Exzentrizität (auch ≥ 1)
  i: number, // Grad
  om: number, // Grad
  w: number, // Grad
  tp: number, // Zeitpunkt des Periheldurchgangs als JD (TDB)
  epoch: number, // Epoche der Bahnlösung als JD (TDB)
  M1: number | null, // absolute Gesamthelligkeit
  K1: number | null, // Steigungsparameter der Gesamthelligkeit
];

export interface Comet {
  name: string;
  q: number;
  e: number;
  i: number;
  om: number;
  w: number;
  tp: number;
  epoch: number;
  M1: number | null;
  K1: number | null;
}

// ---- neighbors.json ----

/** Eine Zeile in neighbors.json: Hipparcos-Sterne bis 50 Lichtjahre, nach Entfernung sortiert */
export type NeighborRow = [
  hip: number, // Hipparcos-Nummer
  ra: number, // Grad, ICRS, Epoche J2000.0
  dec: number, // Grad
  distLy: number, // Entfernung in Lichtjahren (aus der Hipparcos-Parallaxe)
  vmag: number | null, // scheinbare V-Helligkeit
  bv: number | null, // Farbindex B−V
  sp: string | null, // gekürzter Spektraltyp, z. B. "M5V", "G2V", "DA"
  name: string, // Eigenname, Bayer/Flamsteed + Sternbild, Gliese-Nummer oder "HIP n"
];

export interface Neighbor {
  hip: number;
  ra: number;
  dec: number;
  distLy: number;
  vmag: number | null;
  bv: number | null;
  sp: string | null;
  name: string;
}

// ---------------------------------------------------------------------------------------------
// Laden
// ---------------------------------------------------------------------------------------------

/** Zeilen anhand der Spaltennamen in Objekte umwandeln (robust gegen geänderte Spaltenreihenfolge). */
export function decodeCatalog<T>(file: CatalogFile<readonly unknown[]>): T[] {
  const { cols, rows } = file;
  return rows.map((r) => {
    const o: Record<string, unknown> = {};
    for (let k = 0; k < cols.length; k++) o[cols[k]] = r[k] ?? null;
    return o as T;
  });
}

const loaded = new Map<string, Promise<unknown[]>>();
const metas = new Map<string, CatalogMeta>();

function loadCatalog<T>(file: string): Promise<T[]> {
  let p = loaded.get(file);
  if (!p) {
    p = fetch(`${import.meta.env.BASE_URL}data/${file}`)
      .then((res) => {
        if (!res.ok) throw new Error(`${file}: HTTP ${res.status}`);
        return res.json() as Promise<CatalogFile<readonly unknown[]>>;
      })
      .then((json) => {
        metas.set(file, json.meta);
        return decodeCatalog<T>(json);
      });
    // Bei Fehlern beim nächsten Aufruf erneut versuchen
    p.catch(() => loaded.delete(file));
    loaded.set(file, p);
  }
  return p as Promise<T[]>;
}

export const loadExoplanets = () => loadCatalog<Exoplanet>('exoplanets.json');
export const loadSmallBodies = () => loadCatalog<SmallBody>('smallbodies.json');
export const loadComets = () => loadCatalog<Comet>('comets.json');
export const loadNeighbors = () => loadCatalog<Neighbor>('neighbors.json');

/** Metadaten (Quelle, Erzeugungsdatum …) eines bereits geladenen Katalogs */
export const catalogMeta = (file: 'exoplanets.json' | 'smallbodies.json' | 'comets.json' | 'neighbors.json') => metas.get(file);

// ---------------------------------------------------------------------------------------------
// Bahnrechnung (Zweikörperproblem)
// ---------------------------------------------------------------------------------------------

/** Gaußsche Gravitationskonstante: Bahnbewegung in rad/Tag für a in AE */
const GAUSS_K = 0.01720209895;
/** Lichtgeschwindigkeit in AE pro Tag */
const C_AU_DAY = 173.1446326846693;
const DEG = Math.PI / 180;
const TWO_PI = 2 * Math.PI;

/** Elemente mit großer Halbachse und mittlerer Anomalie zur Epoche (Asteroiden, TNOs) */
export interface EpochElements {
  a: number;
  e: number;
  i: number;
  om: number;
  w: number;
  ma: number;
  epoch: number;
}

/** Elemente mit Periheldistanz und Periheldurchgang (Kometen; auch parabolisch und hyperbolisch) */
export interface PerihelionElements {
  q: number;
  e: number;
  i: number;
  om: number;
  w: number;
  tp: number;
}

export type OrbitElements = EpochElements | PerihelionElements;

export type Vec3 = [number, number, number];

/** Julianisches Datum in Terrestrischer Zeit (≈ TDB) für ein Datum – passend zu den Epochen der Bahnelemente */
export function julianDateTT(date: Date | A.AstroTime): number {
  return A.MakeTime(date).tt + 2451545.0;
}

/** Keplergleichung E − e·sin E = M für 0 ≤ e < 1 (Newton von oben, konvergiert monoton). */
function solveKepler(M: number, e: number): number {
  // M auf −π..π reduzieren und Symmetrie nutzen
  let m = M - TWO_PI * Math.round(M / TWO_PI);
  const sign = m < 0 ? -1 : 1;
  m *= sign;
  let E = Math.min(m + e, Math.PI);
  for (let k = 0; k < 100; k++) {
    const f = E - e * Math.sin(E) - m;
    const d = f / (1 - e * Math.cos(E));
    E -= d;
    if (Math.abs(d) < 1e-14 * (1 + E)) break;
  }
  return sign * E;
}

/** Hyperbolische Keplergleichung e·sinh H − H = M für e > 1 (Newton von einer oberen Schranke aus). */
function solveHyperbolic(M: number, e: number): number {
  const sign = M < 0 ? -1 : 1;
  const m = Math.abs(M);
  const c = Math.cbrt(6 * m);
  let H = Math.min(c, Math.asinh((m + c) / e));
  for (let k = 0; k < 200; k++) {
    const f = e * Math.sinh(H) - H - m;
    const d = f / (e * Math.cosh(H) - 1);
    H -= d;
    if (!(Math.abs(d) > 1e-14 * (1 + H))) break;
  }
  return sign * H;
}

/**
 * Position in der Bahnebene [x zum Perihel, y in Bewegungsrichtung] in AE.
 */
function orbitPlanePosition(el: OrbitElements, jd: number): [number, number] {
  const e = el.e;
  if ('tp' in el) {
    const q = el.q;
    const dt = jd - el.tp;
    if (Math.abs(e - 1) < 1e-6) {
      // Parabel: Barkersche Gleichung s + s³/3 = k·Δt / √(2q³) mit s = tan(ν/2)
      const W = (3 * GAUSS_K * dt) / Math.sqrt(2 * q * q * q);
      const w = Math.abs(W);
      const Y = Math.cbrt(w / 2 + Math.sqrt((w * w) / 4 + 1));
      const s = Math.sign(W) * (Y - 1 / Y);
      return [q * (1 - s * s), 2 * q * s];
    }
    if (e < 1) {
      const a = q / (1 - e);
      const E = solveKepler((GAUSS_K / Math.sqrt(a * a * a)) * dt, e);
      return [a * (Math.cos(E) - e), a * Math.sqrt(1 - e * e) * Math.sin(E)];
    }
    // Hyperbel
    const a = q / (e - 1);
    const H = solveHyperbolic((GAUSS_K / Math.sqrt(a * a * a)) * dt, e);
    return [a * (e - Math.cosh(H)), a * Math.sqrt(e * e - 1) * Math.sinh(H)];
  }
  const a = el.a;
  const M = el.ma * DEG + (GAUSS_K / Math.sqrt(a * a * a)) * (jd - el.epoch);
  const E = solveKepler(M, e);
  return [a * (Math.cos(E) - e), a * Math.sqrt(1 - e * e) * Math.sin(E)];
}

/**
 * Heliozentrische Position [x, y, z] in AE, bezogen auf Ekliptik und Äquinoktium J2000, zum Zeitpunkt jd (TT/TDB).
 * Asteroiden über mittlere Anomalie und Epoche (elliptisch), Kometen über q und tp (elliptisch, parabolisch
 * nach Barker oder hyperbolisch). Reines Zweikörperproblem ohne Bahnstörungen.
 */
export function keplerPosition(el: OrbitElements, jd: number): Vec3 {
  const [x, y] = orbitPlanePosition(el, jd);
  const co = Math.cos(el.om * DEG);
  const so = Math.sin(el.om * DEG);
  const cw = Math.cos(el.w * DEG);
  const sw = Math.sin(el.w * DEG);
  const ci = Math.cos(el.i * DEG);
  const si = Math.sin(el.i * DEG);
  // Einheitsvektoren P (zum Perihel) und Q (90° weiter in Bewegungsrichtung)
  const px = cw * co - sw * so * ci;
  const py = cw * so + sw * co * ci;
  const pz = sw * si;
  const qx = -sw * co - cw * so * ci;
  const qy = -sw * so + cw * co * ci;
  const qz = cw * si;
  return [x * px + y * qx, x * py + y * qy, x * pz + y * qz];
}

let eqjToEcl: A.RotationMatrix | null = null;
let eclToEqj: A.RotationMatrix | null = null;

/** Heliozentrische Position der Erde in AE, Ekliptik und Äquinoktium J2000 */
export function heliocentricEarth(date: Date | A.AstroTime): Vec3 {
  eqjToEcl ??= A.Rotation_EQJ_ECL();
  const v = A.RotateVector(eqjToEcl, A.HelioVector(A.Body.Earth, date));
  return [v.x, v.y, v.z];
}

export interface SkyPosition {
  /** Rektaszension in Grad (J2000, astrometrisch: Lichtlaufzeit berücksichtigt, ohne Aberration) */
  ra: number;
  /** Deklination in Grad */
  dec: number;
  /** Abstand zur Erde in AE */
  delta: number;
  /** Abstand zur Sonne in AE */
  r: number;
}

/** Geozentrische J2000-Position eines Kleinkörpers oder Kometen, mit Lichtlaufzeit. */
export function bodyRaDec(el: OrbitElements, date: Date | A.AstroTime): SkyPosition {
  const time = A.MakeTime(date);
  const jd = time.tt + 2451545.0;
  const earth = heliocentricEarth(time);
  let p = keplerPosition(el, jd);
  let g: Vec3 = [p[0] - earth[0], p[1] - earth[1], p[2] - earth[2]];
  // Lichtlaufzeit: Objekt dort, wo es das jetzt ankommende Licht ausgesandt hat
  for (let k = 0; k < 2; k++) {
    const tau = Math.hypot(g[0], g[1], g[2]) / C_AU_DAY;
    p = keplerPosition(el, jd - tau);
    g = [p[0] - earth[0], p[1] - earth[1], p[2] - earth[2]];
  }
  eclToEqj ??= A.Rotation_ECL_EQJ();
  const v = A.RotateVector(eclToEqj, new A.Vector(g[0], g[1], g[2], time));
  const delta = Math.hypot(v.x, v.y, v.z);
  const ra = ((Math.atan2(v.y, v.x) / DEG) % 360 + 360) % 360;
  const dec = Math.asin(v.z / delta) / DEG;
  return { ra, dec, delta, r: Math.hypot(p[0], p[1], p[2]) };
}

/** Geozentrische J2000-Position eines Kometen (Grad), mit Abständen zu Erde und Sonne */
export const cometRaDec = (c: Comet, date: Date | A.AstroTime): SkyPosition => bodyRaDec(c, date);

/**
 * Geschätzte Gesamthelligkeit eines Kometen: m = M1 + 5·log10(Δ) + K1·log10(r).
 * null, wenn die Helligkeitsparameter fehlen. Kometen weichen oft um mehrere Größenklassen davon ab.
 */
export function cometMagnitude(c: Comet, date: Date | A.AstroTime): number | null {
  if (c.M1 == null || c.K1 == null) return null;
  const { delta, r } = bodyRaDec(c, date);
  return c.M1 + 5 * Math.log10(delta) + c.K1 * Math.log10(r);
}
