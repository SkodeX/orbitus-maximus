// Lichtverschmutzung am Beobachtungsort: künstliche Himmelsaufhellung im Zenit, daraus die
// Himmelshelligkeit (SQM, mag/arcsec²) und die Bortle-Klasse – offline aus einem globalen Raster.
//
// Daten: Falchi, F. et al. (2016): Supplement to: The New World Atlas of Artificial Night Sky
// Brightness. GFZ Data Services, https://doi.org/10.5880/GFZ.1.4.2016.001 und Falchi et al. (2016),
// Science Advances 2(6), e1600377, https://doi.org/10.1126/sciadv.1600377 – Lizenz CC BY-NC 4.0.
// Für die App vergröbert und quantisiert (scripts/build-lightpollution.mjs), Land/Wasser aus
// Natural Earth. Modellwerte aus Satellitendaten von 2014/2015, gerechnet für etwa 1 Uhr nachts;
// am frühen Abend ist der Himmel meist etwas heller (bis ≈ 0,3 mag).
//
// Rasterformat (public/data/lightpollution.png): 8-Bit-Graustufen-PNG, plattkartenförmig,
// 8640 × 3240 Zellen à 1/24°, Nordkante 75° + 1/240°, Westkante −180°, Zeile 0 = Norden.
// Pixelwert v = 2·q + Land (Land = 1: Zelle ist überwiegend trockenes Land, 0: Meer/großer See),
// ratio = künstlich/natürlich = 0,25 · (10^(q/30) − 1). Details siehe Build-Skript.

export type Bortle = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface LightGrid {
  width: number;
  height: number;
  /** Nordkante des Rasters (Grad) */
  north: number;
  /** Westkante des Rasters (Grad) */
  west: number;
  /** Kantenlänge einer Zelle (Grad) */
  cell: number;
  /** Rohwerte v = 2·q + Land; Zelle (x, y) liegt bei data[offset + y·stride + x] */
  data: Uint8Array;
  stride: number;
  offset: number;
}

export interface SkyBrightness {
  /** Künstliche Aufhellung im Verhältnis zum natürlichen Nachthimmel (0 = unberührt) */
  ratio: number;
  /** Gesamthelligkeit im Zenit in mag/arcsec² (natürlicher Hintergrund 22,0) */
  sqm: number;
  bortle: Bortle;
  /**
   * false außerhalb des Rasters (nördlich von 75° N, südlich von 60° S): Dort hat der Atlas keine
   * Satellitendaten (Spitzbergen, Antarktis); angenommen wird dann ein natürlicher Himmel.
   */
  covered: boolean;
}

export interface DarkPlace {
  lat: number;
  lon: number;
  /** Entfernung in km (Großkreis) */
  km: number;
  /** Richtung vom Standort aus, Grad (0 = Nord, 90 = Ost) */
  bearing: number;
  sqm: number;
  bortle: Bortle;
}

/** Quellenangabe für die Oberfläche (CC BY-NC 4.0 verlangt Namensnennung und Änderungshinweis) */
export const LIGHT_POLLUTION_CREDIT =
  'Lichtverschmutzung: Falchi et al. (2016), „The New World Atlas of Artificial Night Sky Brightness“, ' +
  'GFZ Data Services, doi:10.5880/GFZ.1.4.2016.001; Science Advances, doi:10.1126/sciadv.1600377. ' +
  'Lizenz CC BY-NC 4.0 (creativecommons.org/licenses/by-nc/4.0), für Orbitus Maximus vergröbert und quantisiert. ' +
  'Land/Wasser: Natural Earth.';

// ---- Rastergeometrie (muss zu scripts/build-lightpollution.mjs passen) ----
const NORTH = 75 + 1 / 240;
const WEST = -180;
/** Nord-Süd-Ausdehnung: 75,0042° N … 59,9958° S */
const LAT_SPAN = 135;
const NATURAL_SQM = 22.0;

/** ratio je Pixelwert v (q = v >> 1) */
const RATIO = new Float64Array(256);
for (let v = 0; v < 256; v++) RATIO[v] = 0.25 * (10 ** ((v >> 1) / 30) - 1);

// ---- Bortle-Klassen aus der Zenit-Helligkeit ----
// Gängige SQM-Grenzen (u. a. Wikipedia „Bortle scale“): Klasse 1 ab 21,99, 2 ab 21,89, 3 ab 21,69,
// 4 ab 20,49, 5 ab 19,50, 6 ab 18,94, 7 ab 18,38. Die Tabelle fasst 8 und 9 unter 18,38 zusammen;
// wir trennen sie bei 17,80 (künstlich ≈ 47-mal heller als der natürliche Himmel, Großstadtkern).
// Bortle beschreibt eigentlich den ganzen Himmel, nicht nur den Zenit – das ist eine Näherung.
const BORTLE_SQM: readonly number[] = [21.99, 21.89, 21.69, 20.49, 19.5, 18.94, 18.38, 17.8];

export function bortleFromSqm(sqm: number): Bortle {
  for (let i = 0; i < BORTLE_SQM.length; i++) if (sqm >= BORTLE_SQM[i]) return (i + 1) as Bortle;
  return 9;
}

export const sqmFromRatio = (ratio: number) => NATURAL_SQM - 2.5 * Math.log10(1 + Math.max(0, ratio));

// ---- Laden & Dekodieren ----
let pending: Promise<LightGrid> | null = null;

/** Lädt und dekodiert das Raster einmalig (≈ 1,8 MB Download, ≈ 28 MB im Speicher). */
export function loadLightPollution(): Promise<LightGrid> {
  if (!pending) {
    pending = loadGrid().catch((err) => {
      pending = null; // beim nächsten Aufruf neu versuchen
      throw err;
    });
  }
  return pending;
}

async function loadGrid(): Promise<LightGrid> {
  const res = await fetch(`${import.meta.env.BASE_URL}data/lightpollution.png`);
  if (!res.ok) throw new Error(`Lichtverschmutzungsdaten nicht ladbar (HTTP ${res.status})`);
  const bytes = new Uint8Array(await res.arrayBuffer());
  let pixels: Omit<LightGrid, 'north' | 'west' | 'cell'>;
  try {
    // Eigener PNG-Dekoder: bitgenau, ohne Farbmanagement, ohne Canvas-Größengrenzen (iOS: 16,7 MP)
    // und ohne das Rauschen, das Safari/Firefox/Brave zum Schutz vor Fingerprinting in
    // Canvas-Auslesungen mischen. DecompressionStream gibt es ab Safari 16.4.
    pixels = await decodeGrayPng(bytes);
  } catch {
    pixels = await decodeWithCanvas(bytes);
  }
  const cell = 360 / pixels.width;
  if (Math.abs(pixels.height * cell - LAT_SPAN) > cell / 2) {
    throw new Error('Unerwartete Rastergröße der Lichtverschmutzungsdaten');
  }
  return { ...pixels, north: NORTH, west: WEST, cell };
}

/** Dekodiert ein nicht verschachteltes 8-Bit-Graustufen-PNG; die Filterbytes bleiben im Puffer stehen. */
async function decodeGrayPng(bytes: Uint8Array<ArrayBuffer>) {
  if (typeof DecompressionStream === 'undefined') throw new Error('DecompressionStream fehlt');
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (dv.getUint32(0) !== 0x89504e47 || dv.getUint32(4) !== 0x0d0a1a0a) throw new Error('Kein PNG');
  let width = 0;
  let height = 0;
  const idat: Uint8Array<ArrayBuffer>[] = [];
  for (let o = 8; o + 8 <= bytes.length; ) {
    const len = dv.getUint32(o);
    const type = dv.getUint32(o + 4);
    if (type === 0x49484452) {
      // IHDR: nur Bittiefe 8, Farbtyp 0 (Grau), ohne Interlacing
      width = dv.getUint32(o + 8);
      height = dv.getUint32(o + 12);
      if (bytes[o + 16] !== 8 || bytes[o + 17] !== 0 || bytes[o + 20] !== 0) throw new Error('PNG-Format nicht unterstützt');
    } else if (type === 0x49444154) idat.push(bytes.subarray(o + 8, o + 8 + len));
    else if (type === 0x49454e44) break;
    o += 12 + len;
  }
  if (!width || !idat.length) throw new Error('PNG unvollständig');
  const stream = new Blob(idat).stream().pipeThrough(new DecompressionStream('deflate'));
  const raw = new Uint8Array(await new Response(stream).arrayBuffer());
  const stride = width + 1;
  if (raw.length < stride * height) throw new Error('PNG-Daten zu kurz');
  // Zeilenfilter rückgängig machen (an Ort und Stelle; vorige Zeile ist schon entschlüsselt)
  for (let y = 0; y < height; y++) {
    const row = y * stride + 1;
    const up = row - stride;
    const filter = raw[row - 1];
    if (filter === 0) continue;
    for (let x = 0; x < width; x++) {
      const a = x > 0 ? raw[row + x - 1] : 0;
      const b = y > 0 ? raw[up + x] : 0;
      let pred: number;
      if (filter === 1) pred = a;
      else if (filter === 2) pred = b;
      else if (filter === 3) pred = (a + b) >> 1;
      else if (filter === 4) {
        const c = x > 0 && y > 0 ? raw[up + x - 1] : 0;
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        pred = pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      } else throw new Error(`Unbekannter PNG-Filter ${filter}`);
      raw[row + x] = (raw[row + x] + pred) & 255;
    }
  }
  return { width, height, data: raw, stride, offset: 1 };
}

/** Ausweichweg: Browser dekodiert, wir lesen den Rotkanal kachelweise aus einer Canvas. */
async function decodeWithCanvas(bytes: Uint8Array<ArrayBuffer>) {
  const bmp = await createImageBitmap(new Blob([bytes], { type: 'image/png' }), {
    colorSpaceConversion: 'none',
    premultiplyAlpha: 'none',
  });
  try {
    const { width, height } = bmp;
    // Kacheln klein halten: iOS begrenzt Canvas-Flächen (16,7 MP) und -Kantenlängen
    const tw = Math.min(width, 4096);
    const th = Math.min(height, 1024);
    let read: (sx: number, sy: number, w: number, h: number) => Uint8ClampedArray;
    if (typeof OffscreenCanvas !== 'undefined') {
      const ctx = new OffscreenCanvas(tw, th).getContext('2d', { willReadFrequently: true });
      if (!ctx) throw new Error('Kein 2D-Kontext');
      read = (sx, sy, w, h) => {
        ctx.clearRect(0, 0, tw, th);
        ctx.drawImage(bmp, sx, sy, w, h, 0, 0, w, h);
        return ctx.getImageData(0, 0, w, h).data;
      };
    } else {
      const canvas = document.createElement('canvas');
      canvas.width = tw;
      canvas.height = th;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) throw new Error('Kein 2D-Kontext');
      read = (sx, sy, w, h) => {
        ctx.clearRect(0, 0, tw, th);
        ctx.drawImage(bmp, sx, sy, w, h, 0, 0, w, h);
        return ctx.getImageData(0, 0, w, h).data;
      };
    }
    const data = new Uint8Array(width * height);
    for (let sy = 0; sy < height; sy += th) {
      for (let sx = 0; sx < width; sx += tw) {
        const w = Math.min(tw, width - sx);
        const h = Math.min(th, height - sy);
        const rgba = read(sx, sy, w, h);
        for (let y = 0; y < h; y++) {
          const dst = (sy + y) * width + sx;
          for (let x = 0; x < w; x++) data[dst + x] = rgba[(y * w + x) * 4];
        }
      }
    }
    return { width, height, data, stride: width, offset: 0 };
  } finally {
    bmp.close();
  }
}

// ---- Abfragen ----
const cellValue = (g: LightGrid, x: number, y: number) => {
  const yy = y < 0 ? 0 : y >= g.height ? g.height - 1 : y;
  const xx = ((x % g.width) + g.width) % g.width; // Datumsgrenze: Längen umlaufend
  return g.data[g.offset + yy * g.stride + xx];
};

/** Himmelshelligkeit am Ort, bilinear zwischen den Zellmitten interpoliert (linear in der Leuchtdichte). */
export function skyAt(grid: LightGrid, lat: number, lon: number): SkyBrightness {
  const south = grid.north - grid.height * grid.cell;
  if (!(lat >= south && lat <= grid.north)) return { ratio: 0, sqm: NATURAL_SQM, bortle: 1, covered: false };
  const fx = (lon - grid.west) / grid.cell - 0.5;
  const fy = (grid.north - lat) / grid.cell - 0.5;
  const x0 = Math.floor(fx);
  const y0 = Math.floor(fy);
  const tx = fx - x0;
  const ty = fy - y0;
  const r00 = RATIO[cellValue(grid, x0, y0)];
  const r10 = RATIO[cellValue(grid, x0 + 1, y0)];
  const r01 = RATIO[cellValue(grid, x0, y0 + 1)];
  const r11 = RATIO[cellValue(grid, x0 + 1, y0 + 1)];
  const ratio = (r00 * (1 - tx) + r10 * tx) * (1 - ty) + (r01 * (1 - tx) + r11 * tx) * ty;
  const sqm = sqmFromRatio(ratio);
  return { ratio, sqm, bortle: bortleFromSqm(sqm), covered: true };
}

const R_EARTH = 6371.0088;
const RAD = Math.PI / 180;

function distBearing(lat1: number, lon1: number, lat2: number, lon2: number) {
  const p1 = lat1 * RAD;
  const p2 = lat2 * RAD;
  const dl = (lon2 - lon1) * RAD;
  const h = Math.sin((p2 - p1) / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  const km = 2 * R_EARTH * Math.asin(Math.min(1, Math.sqrt(h)));
  const y = Math.sin(dl) * Math.cos(p2);
  const x = Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dl);
  const bearing = ((Math.atan2(y, x) / RAD) + 360) % 360;
  return { km, bearing };
}

/**
 * Bis zu 6 deutlich dunklere Orte im Umkreis: mindestens eine Bortle-Klasse besser als hier und
 * mindestens 0,5 mag dunkler (Ausnahme: Ziele der Klassen 1–3, deren Grenzen enger liegen).
 * Nur Zellen, die überwiegend trockenes Land sind (kein Meer, keine großen Seen).
 * Je 45°-Richtungssektor gewinnt die dunkelste Klasse und darin der nächste Ort; dazu kommt
 * der nächstgelegene dunklere Ort überhaupt. Sortiert nach Bortle-Klasse, dann Entfernung.
 * Koordinaten sind Zellmitten (1/24°, in Mitteleuropa ≈ 4,6 × 2,9 km).
 */
export function darkerPlacesNear(grid: LightGrid, lat: number, lon: number, maxKm = 150): DarkPlace[] {
  const here = skyAt(grid, lat, lon);
  const target = here.bortle - 1;
  if (target < 1) return [];

  const sectors: (DarkPlace | undefined)[] = new Array(8);
  let nearest: DarkPlace | undefined;
  const minSqm = here.sqm + 0.5;
  const order = (a: DarkPlace, b: DarkPlace) => a.bortle - b.bortle || a.km - b.km;
  const better = (a: DarkPlace, b: DarkPlace | undefined) => !b || order(a, b) < 0;

  const dLat = maxKm / 111.2;
  const yA = Math.max(0, Math.floor((grid.north - (lat + dLat)) / grid.cell));
  const yB = Math.min(grid.height - 1, Math.floor((grid.north - (lat - dLat)) / grid.cell));
  for (let y = yA; y <= yB; y++) {
    const cLat = grid.north - (y + 0.5) * grid.cell;
    // Breitester Längenbereich in dieser Zeile (zur Polseite hin wird er größer)
    const cosLat = Math.cos(Math.min(89, Math.abs(cLat) + grid.cell) * RAD);
    const dLon = Math.min(180, maxKm / (111.32 * Math.max(cosLat, 1e-6)));
    const xA = Math.floor((lon - dLon - grid.west) / grid.cell);
    const xB = Math.floor((lon + dLon - grid.west) / grid.cell);
    for (let x = xA; x <= xB && x - xA < grid.width; x++) {
      const v = cellValue(grid, x, y);
      if (!(v & 1)) continue; // Wasser
      const sqm = sqmFromRatio(RATIO[v]);
      const bortle = bortleFromSqm(sqm);
      if (bortle > target || (sqm < minSqm && bortle > 3)) continue;
      let cLon = grid.west + (x + 0.5) * grid.cell;
      cLon = ((((cLon + 180) % 360) + 360) % 360) - 180;
      const { km, bearing } = distBearing(lat, lon, cLat, cLon);
      if (km > maxKm) continue;
      const place: DarkPlace = { lat: round4(cLat), lon: round4(cLon), km: Math.round(km * 10) / 10, bearing: Math.round(bearing), sqm: Math.round(sqm * 100) / 100, bortle };
      const s = Math.floor(((bearing + 22.5) % 360) / 45);
      if (better(place, sectors[s])) sectors[s] = place;
      if (!nearest || place.km < nearest.km || (place.km === nearest.km && bortle < nearest.bortle)) nearest = place;
    }
  }

  const picks = sectors.filter((p): p is DarkPlace => !!p).sort(order);
  const result: DarkPlace[] = [];
  // Nachbarsektoren finden oft fast denselben Ort – Doppelte (< 15 km) aussortieren
  const tooClose = (p: DarkPlace) => result.some((q) => distBearing(p.lat, p.lon, q.lat, q.lon).km < 15);
  for (const p of picks) if (result.length < 6 && !tooClose(p)) result.push(p);
  if (nearest && !result.includes(nearest) && !tooClose(nearest)) {
    if (result.length >= 6) result.pop();
    result.push(nearest);
    result.sort(order);
  }
  return result;
}

const round4 = (n: number) => Math.round(n * 1e4) / 1e4;
