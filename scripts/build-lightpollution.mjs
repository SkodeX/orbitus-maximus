// Erzeugt das globale Lichtverschmutzungs-Raster public/data/lightpollution.png
// aus dem „New World Atlas of Artificial Night Sky Brightness“ (Falchi et al. 2016).
//
// ── Quelle & Lizenz ─────────────────────────────────────────────────────────────
//   Falchi, F.; Cinzano, P.; Duriscoe, D.; Kyba, C. C. M.; Elvidge, C. D.; Baugh, K.;
//   Portnov, B.; Rybnikova, N. A.; Furgoni, R. (2016): Supplement to: The New World Atlas
//   of Artificial Night Sky Brightness. V. 1.1. GFZ Data Services.
//   https://doi.org/10.5880/GFZ.1.4.2016.001
//   Paper: Falchi et al. (2016), Science Advances 2(6), e1600377,
//   https://doi.org/10.1126/sciadv.1600377
//   Lizenz: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/) – laut
//   Landingpage gilt sie seit dem 13.11.2019 (Ende der Sperrfrist). Die README im ZIP stammt
//   noch von 2016 und verweist für Änderungen der Nutzungsbedingungen auf diese Landingpage.
//   Weitergabe abgeleiteter Daten ist damit erlaubt: nur nicht-kommerziell, mit Namensnennung
//   beider Zitate und dem Hinweis, dass die Daten verändert (vergröbert, quantisiert) wurden.
//   Die Land/Wasser-Maske stammt aus Natural Earth (gemeinfrei): world-atlas/land-10m.json
//   (liegt in node_modules) und ne_10m_lakes.geojson.
//
// ── Eingabe besorgen ────────────────────────────────────────────────────────────
//   Landingpage https://doi.org/10.5880/GFZ.1.4.2016.001 → „Download data and description“,
//   oder direkt per FTP (684 MB):
//     ftp://datapub.gfz-potsdam.de/download/10.5880.GFZ.1.4.2016.001/World_Atlas_2015.zip
//   Das ZIP enthält World_Atlas_2015.tif (3,0 GB, Float32, 43200 × 17406 Pixel à 30″,
//   Kacheln 128 × 128, unkomprimiert, Werte = künstliche Zenit-Leuchtdichte in mcd/m²).
//   Entpacken ist nicht nötig: Das Skript liest das TIFF als Datenstrom direkt aus dem ZIP
//   (es nimmt aber auch die entpackte .tif).
//   Seen (optional, sonst wird die Datei automatisch von GitHub geladen):
//     https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_lakes.geojson
//
// ── Aufruf ──────────────────────────────────────────────────────────────────────
//   node scripts/build-lightpollution.mjs <World_Atlas_2015.zip|.tif> [ne_10m_lakes.geojson]
//   Optionen: --block=N  Kantenlänge einer Zielzelle in Quellpixeln (Standard 5 → 2,5′ = 1/24°;
//                        4 → 2′ wird größer als 2 MiB, 6 → 0,05° ≈ 1,2 MB)
//             --out=PFAD Zieldatei (Standard public/data/lightpollution.png)
//
// ── Ausgabeformat (muss zu src/lib/observe/lightPollution.ts passen) ────────────
//   8-Bit-Graustufen-PNG, plattkartenförmig (equirectangular), Zeile 0 = Norden.
//   Bei --block=5: 8640 × 3240 Zellen à 1/24° (0,0416667°, ≈ 4,6 km N–S, ≈ 2,9 km O–W bei 52°N).
//   Grenzen (Zellkanten): Nord 75,0041667° (= 75° + 1/240°), Süd −59,9958333° (= −60° + 1/240°),
//   West −180°, Ost +180°. Der kleine Versatz von 15″ kommt vom Quellraster, dessen
//   Pixelmitten auf ganzzahligen Vielfachen von 30″ liegen; der Atlas endet bei −59,996°.
//   Zellmitte (Zeile y, Spalte x): lat = 75,0041667 − (y + 0,5)·Δ, lon = −180 + (x + 0,5)·Δ.
//
//   Pixelwert v = 2·q + t
//     t = 1, wenn die Zelle trockenes Land ist (Zellmitte an Land oder ≥ 5 von 9
//         Stichproben an Land und nicht in einem See), sonst 0 (Meer, große Seen).
//     q = 0…127 = quantisiertes Verhältnis ratio = künstlich/natürlich, „gedämpft logarithmisch“:
//         q = clamp(round(30 · log10(1 + ratio / 0,25)), 0, 127)
//         Rückrechnung: ratio = 0,25 · (10^(q/30) − 1)   (q = 0 → ratio = 0, q = 127 → ≈ 4250)
//         ratio = L_künstlich / 0,174 mcd/m² (natürlicher Hintergrund 174 µcd/m² ≙ 22,0 mag/arcsec²,
//         wie im Atlas). Für ratio ≫ 0,25 sind das Schritte von 1/30 dex (≈ 0,08 mag), für kleine
//         Werte wird die Skala linear (Schritt ≈ 0,02 im Verhältnis); q = 0 heißt ratio < 0,0098,
//         also SQM > 21,989 – genau die Grenze Bortle 1/2 (21,99). Gegenüber rein logarithmischen
//         Stufen spart das viele unnötige Abstufungen im praktisch natürlichen Bereich (< 1 %);
//         so bleibt die Datei unter 2 MiB (Workbox-Grenze fürs Vorab-Caching im Service Worker).
//         Hellste Zelle (Gasfackeln in Venezuela, 9,65°N 63,6°W): ratio ≈ 1630 → q = 114.
//
//   Bündelung: arithmetisches Mittel der linearen Leuchtdichte aller 5 × 5 Quellpixel einer Zelle.
//   Das entspricht der mittleren Himmelshelligkeit in der Zelle und passt zur bilinearen
//   Interpolation zwischen Zellmitten in der App. Max-Pooling würde dunkle Orte am Stadtrand
//   verschwinden lassen, Min-Pooling helle Orte schönen; die Himmelsaufhellung ist ohnehin
//   räumlich glatt, die Unterschiede betreffen vor allem Stadtränder.

import { createReadStream, openSync, readSync, closeSync, fstatSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createInflateRaw } from 'node:zlib';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { feature } from 'topojson-client';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// ---- Parameter ----
const NATURAL_MCD = 0.174; // natürlicher Hintergrund in mcd/m² (= 22,0 mag/arcsec²)
const KNEE = 0.25; // Übergang linear → logarithmisch (im Verhältnis künstlich/natürlich)
const STEPS_PER_DEX = 30;
const Q_MAX = 127;
const encodeRatio = (ratio) => Math.max(0, Math.min(Q_MAX, Math.round(Math.log10(1 + ratio / KNEE) * STEPS_PER_DEX)));
const LAT_NORTH = 75; // gewünschte Nordgrenze (wird auf die nächste Quellpixelkante aufgerundet)
const SUPERSAMPLE = 3; // Stichproben je Zellkante für die Landmaske
const LAKES_URL = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_lakes.geojson';

const args = process.argv.slice(2);
const opt = (name, def) => {
  const a = args.find((s) => s.startsWith(`--${name}=`));
  return a ? a.slice(name.length + 3) : def;
};
const positional = args.filter((s) => !s.startsWith('--'));
const input = positional[0];
const lakesPath = positional[1];
const BLOCK = Number(opt('block', '5'));
const outPath = resolve(opt('out', join(root, 'public', 'data', 'lightpollution.png')));
if (!input || !(BLOCK >= 1)) {
  console.error('Aufruf: node scripts/build-lightpollution.mjs <World_Atlas_2015.zip|.tif> [ne_10m_lakes.geojson] [--block=5] [--out=…]');
  process.exit(1);
}

// ---- Datenstrom: TIFF direkt oder als Eintrag aus dem ZIP ----
function openTiffStream(file) {
  if (!file.toLowerCase().endsWith('.zip')) return createReadStream(file, { highWaterMark: 1 << 22 });
  const fd = openSync(file, 'r');
  const size = fstatSync(fd).size;
  // End-of-Central-Directory suchen (letzte ≤ 64 KB)
  const tailLen = Math.min(size, 65557);
  const tail = Buffer.alloc(tailLen);
  readSync(fd, tail, 0, tailLen, size - tailLen);
  let eocd = -1;
  for (let i = tailLen - 22; i >= 0; i--) if (tail.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
  if (eocd < 0) throw new Error('Kein gültiges ZIP (EOCD fehlt)');
  const cdCount = tail.readUInt16LE(eocd + 10);
  const cdSize = tail.readUInt32LE(eocd + 12);
  const cdOffset = tail.readUInt32LE(eocd + 16);
  if (cdOffset === 0xffffffff) throw new Error('ZIP64 wird nicht unterstützt – bitte die .tif entpacken');
  const cd = Buffer.alloc(cdSize);
  readSync(fd, cd, 0, cdSize, cdOffset);
  let entry = null;
  for (let i = 0, p = 0; i < cdCount; i++) {
    const nameLen = cd.readUInt16LE(p + 28), extraLen = cd.readUInt16LE(p + 30), commentLen = cd.readUInt16LE(p + 32);
    const name = cd.subarray(p + 46, p + 46 + nameLen).toString('utf8');
    if (/\.tiff?$/i.test(name)) {
      entry = { name, method: cd.readUInt16LE(p + 10), csize: cd.readUInt32LE(p + 20), local: cd.readUInt32LE(p + 42) };
      break;
    }
    p += 46 + nameLen + extraLen + commentLen;
  }
  if (!entry) throw new Error('Keine .tif im ZIP gefunden');
  const lh = Buffer.alloc(30);
  readSync(fd, lh, 0, 30, entry.local);
  const dataStart = entry.local + 30 + lh.readUInt16LE(26) + lh.readUInt16LE(28);
  closeSync(fd);
  console.log(`ZIP-Eintrag ${entry.name}: ${(entry.csize / 1e6).toFixed(0)} MB komprimiert`);
  const raw = createReadStream(file, { start: dataStart, end: dataStart + entry.csize - 1, highWaterMark: 1 << 22 });
  if (entry.method === 0) return raw;
  if (entry.method !== 8) throw new Error(`ZIP-Methode ${entry.method} wird nicht unterstützt`);
  return raw.pipe(createInflateRaw({ chunkSize: 1 << 20 }));
}

// Liest einen Datenstrom streng vorwärts; hält nur den noch benötigten Rest im Speicher.
class SeqReader {
  constructor(stream) {
    this.it = stream[Symbol.asyncIterator]();
    this.buf = Buffer.alloc(0);
    this.pos = 0; // absolute Position von buf[0]
  }
  async ensure(end) {
    const parts = [this.buf];
    let have = this.pos + this.buf.length;
    while (have < end) {
      const { value, done } = await this.it.next();
      if (done) throw new Error('Unerwartetes Dateiende');
      parts.push(value);
      have += value.length;
    }
    if (parts.length > 1) this.buf = Buffer.concat(parts);
  }
  async read(offset, length) {
    if (offset < this.pos) throw new Error('Rückwärtslesen nicht möglich (TIFF-Aufbau nicht unterstützt)');
    await this.ensure(offset + length);
    const s = offset - this.pos;
    const out = this.buf.subarray(s, s + length);
    // Alles davor wird nicht mehr gebraucht
    this.buf = this.buf.subarray(s);
    this.pos = offset;
    return out;
  }
}

// ---- TIFF-Kopf lesen (klassisches TIFF, Little Endian, Float32, unkomprimiert) ----
async function readTiffHeader(r) {
  await r.ensure(8);
  const h = r.buf;
  if (h.toString('latin1', 0, 2) !== 'II' || h.readUInt16LE(2) !== 42) throw new Error('Nur klassisches Little-Endian-TIFF wird unterstützt');
  const ifd = h.readUInt32LE(4);
  await r.ensure(ifd + 2);
  const n = r.buf.readUInt16LE(ifd);
  await r.ensure(ifd + 2 + n * 12 + 4);
  const SIZE = { 1: 1, 2: 1, 3: 2, 4: 4, 11: 4, 12: 8, 16: 8 };
  const raw = [];
  let needEnd = 0;
  for (let i = 0; i < n; i++) {
    const e = ifd + 2 + i * 12;
    const tag = r.buf.readUInt16LE(e), type = r.buf.readUInt16LE(e + 2), count = r.buf.readUInt32LE(e + 4);
    const bytes = (SIZE[type] ?? 1) * count;
    const off = bytes <= 4 ? e + 8 : r.buf.readUInt32LE(e + 8);
    raw.push({ tag, type, count, off });
    needEnd = Math.max(needEnd, off + bytes);
  }
  await r.ensure(needEnd); // Kopfdaten liegen bei diesem Atlas vor den Kacheln
  const b = r.buf;
  const tags = {};
  for (const { tag, type, count, off } of raw) {
    const vals = [];
    if (type === 2) tags[tag] = b.toString('latin1', off, off + count).replace(/\0+$/, '');
    else {
      for (let k = 0; k < count; k++) {
        if (type === 3) vals.push(b.readUInt16LE(off + 2 * k));
        else if (type === 4) vals.push(b.readUInt32LE(off + 4 * k));
        else if (type === 12) vals.push(b.readDoubleLE(off + 8 * k));
        else if (type === 11) vals.push(b.readFloatLE(off + 4 * k));
        else vals.push(b[off + k]);
      }
      tags[tag] = vals;
    }
  }
  const one = (t) => tags[t]?.[0];
  const width = one(256), height = one(257);
  if (one(258) !== 32 || (one(339) ?? 1) !== 3 || (one(259) ?? 1) !== 1 || (one(277) ?? 1) !== 1) {
    throw new Error('Erwartet: 1 Kanal Float32, unkomprimiert');
  }
  const tiled = tags[322] !== undefined;
  const blockW = tiled ? one(322) : width;
  const blockH = tiled ? one(323) : one(278) ?? height;
  const offsets = tiled ? tags[324] : tags[273];
  const counts = tiled ? tags[325] : tags[279];
  const across = Math.ceil(width / blockW);
  const [sx, sy] = tags[33550];
  const [, , , x0, y0] = tags[33922];
  const nodata = tags[42113] !== undefined ? Number(tags[42113]) : NaN;
  return { width, height, blockW, blockH, offsets, counts, across, x0, y0, sx, sy, nodata };
}

// ---- Land/Wasser-Maske per Scanline-Füllung (gerade/ungerade Regel, planar in Grad) ----
function rasterRows(rings, sw, sh, lon0, lat0, dx, dy) {
  // Kanten je Stichprobenzeile sammeln: x-Schnittpunkte mit der Zeilenmitte
  const counts = new Uint32Array(sh + 1);
  const each = (fn) => {
    for (const ring of rings) {
      for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const [xa, ya] = ring[j], [xb, yb] = ring[i];
        if (ya === yb) continue;
        const ua = (lat0 - ya) / dy - 0.5, ub = (lat0 - yb) / dy - 0.5;
        const lo = Math.max(0, Math.ceil(Math.min(ua, ub))), hi = Math.min(sh - 1, Math.ceil(Math.max(ua, ub)) - 1);
        for (let k = lo; k <= hi; k++) fn(k, xa + ((xb - xa) * (k - ua)) / (ub - ua));
      }
    }
  };
  each((k) => counts[k + 1]++);
  for (let k = 0; k < sh; k++) counts[k + 1] += counts[k];
  const xs = new Float64Array(counts[sh]);
  const fill = counts.slice(0, sh);
  each((k, x) => (xs[fill[k]++] = x));
  // Liefert für Zeile k die Spaltenbereiche [m0, m1) im Inneren
  return (k, row, value) => {
    const seg = xs.subarray(counts[k], counts[k + 1]).sort();
    for (let i = 0; i + 1 < seg.length; i += 2) {
      const m0 = Math.max(0, Math.ceil((seg[i] - lon0) / dx - 0.5));
      const m1 = Math.min(sw, Math.ceil((seg[i + 1] - lon0) / dx - 0.5));
      if (m1 > m0) row.fill(value, m0, m1);
    }
  };
}

function ringsOf(geometries) {
  const rings = [];
  for (const g of geometries) {
    if (!g) continue;
    if (g.type === 'Polygon') rings.push(...g.coordinates);
    else if (g.type === 'MultiPolygon') for (const p of g.coordinates) rings.push(...p);
  }
  return rings;
}

async function buildDryMask(W, H, lon0, lat0, cell) {
  const landTopo = JSON.parse(readFileSync(join(root, 'node_modules', 'world-atlas', 'land-10m.json'), 'utf8'));
  const land = feature(landTopo, landTopo.objects.land);
  const landRings = ringsOf((land.features ?? [land]).map((f) => f.geometry));
  let lakesJson;
  if (lakesPath) lakesJson = readFileSync(lakesPath, 'utf8');
  else {
    try {
      console.log('Lade Natural-Earth-Seen …');
      const res = await fetch(LAKES_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      lakesJson = await res.text();
    } catch (e) {
      console.warn(`Warnung: Seen nicht verfügbar (${e.message}) – große Seen gelten als Land.`);
    }
  }
  const lakeRings = lakesJson ? ringsOf(JSON.parse(lakesJson).features.map((f) => f.geometry)) : [];
  const S = SUPERSAMPLE, sw = W * S, sh = H * S, d = cell / S;
  const landRow = rasterRows(landRings, sw, sh, lon0, lat0, d, d);
  const lakeRow = rasterRows(lakeRings, sw, sh, lon0, lat0, d, d);
  const hits = new Uint8Array(W * H);
  const centre = new Uint8Array(W * H);
  const row = new Uint8Array(sw);
  const mid = (S - 1) >> 1;
  for (let k = 0; k < sh; k++) {
    row.fill(0);
    landRow(k, row, 1);
    lakeRow(k, row, 0);
    const base = ((k / S) | 0) * W;
    const isMid = k % S === mid;
    for (let m = 0; m < sw; m++) {
      if (!row[m]) continue;
      const c = base + ((m / S) | 0);
      hits[c]++;
      if (isMid && m % S === mid) centre[c] = 1;
    }
  }
  const dry = new Uint8Array(W * H);
  const need = Math.floor((S * S) / 2) + 1;
  for (let i = 0; i < dry.length; i++) dry[i] = centre[i] || hits[i] >= need ? 1 : 0;
  console.log(`Landmaske: ${landRings.length} Land-, ${lakeRings.length} Seeringe`);
  return dry;
}

// ---- Hauptteil ----
const t0 = Date.now();
const reader = new SeqReader(openTiffStream(input));
const tif = await readTiffHeader(reader);
console.log(`TIFF ${tif.width} × ${tif.height}, Block ${tif.blockW} × ${tif.blockH}, Pixel ${tif.sx}° × ${tif.sy}°, Ecke ${tif.x0}/${tif.y0}`);
// Quellraster: Pixel sind exakt 30″ groß (im TIFF gerundet als 0,00833333 gespeichert)
const PIX = 1 / 120;
if (Math.abs(tif.sx - PIX) > 1e-7 || Math.abs(tif.sy - PIX) > 1e-7 || Math.abs(tif.x0 + 180) > 1e-6) {
  throw new Error('Unerwartete Georeferenzierung – Skript prüfen');
}
const srcTop = Math.round(tif.y0 * 240) / 240; // 85,0541667 = 85° + 13/240°
const r0 = Math.floor((srcTop - LAT_NORTH) / PIX + 1e-9); // erste Quellzeile im Ziel
// Die App rechnet mit vollen 360° × 135° → N muss 43200 und 16200 teilen (4, 5, 6, 8, 10, 12 …)
if (tif.width % BLOCK || (tif.height - r0) % BLOCK) throw new Error(`--block=${BLOCK} teilt das Raster nicht ohne Rest`);
const W = Math.floor(tif.width / BLOCK);
const H = Math.floor((tif.height - r0) / BLOCK);
const CELL = BLOCK * PIX;
const latTop = srcTop - r0 * PIX;
const latBottom = latTop - H * CELL;
console.log(`Ziel: ${W} × ${H} Zellen à ${CELL.toFixed(6)}°, Breite ${latTop.toFixed(7)} … ${latBottom.toFixed(7)}, Länge −180 … ${(-180 + W * CELL).toFixed(4)}`);

const sum = new Float64Array(W * H);
const cnt = new Uint16Array(W * H);
let nodataPx = 0, maxVal = 0, maxAt = null, northMax = 0, northLit = 0;
const order = Array.from(tif.offsets.keys()).sort((a, b) => tif.offsets[a] - tif.offsets[b]);
const lastRow = r0 + H * BLOCK;
const lastCol = W * BLOCK;
let done = 0;
for (const b of order) {
  const tx = b % tif.across, ty = Math.floor(b / tif.across);
  const rowA = ty * tif.blockH, colA = tx * tif.blockW;
  const bytes = await reader.read(tif.offsets[b], tif.counts[b]);
  if (rowA >= lastRow) continue;
  const f = new Float32Array(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.length));
  const rows = Math.min(tif.blockH, tif.height - rowA, f.length / tif.blockW);
  const cols = Math.min(tif.blockW, tif.width - colA);
  for (let y = 0; y < rows; y++) {
    const r = rowA + y;
    if (r >= lastRow) break;
    const line = y * tif.blockW;
    if (r < r0) {
      for (let x = 0; x < cols; x++) {
        const v = f[line + x];
        if (v > northMax && v < 1e30) northMax = v;
        if (v > NATURAL_MCD * 0.01 && v < 1e30) northLit++;
      }
      continue;
    }
    const oy = (((r - r0) / BLOCK) | 0) * W;
    for (let x = 0; x < cols; x++) {
      const c = colA + x;
      if (c >= lastCol) break;
      const v = f[line + x];
      if (!(v >= 0) || v > 1e30 || v === tif.nodata) { nodataPx++; continue; }
      const i = oy + ((c / BLOCK) | 0);
      sum[i] += v;
      cnt[i]++;
      if (v > maxVal) { maxVal = v; maxAt = [r, c]; }
    }
  }
  if (++done % 5000 === 0) process.stdout.write(`  ${done}/${order.length} Kacheln, ${((Date.now() - t0) / 1000).toFixed(0)} s\r`);
}
console.log(`\nKacheln gelesen in ${((Date.now() - t0) / 1000).toFixed(0)} s. Ungültige Pixel: ${nodataPx}`);
console.log(`Maximum ${maxVal.toFixed(3)} mcd/m² (ratio ${(maxVal / NATURAL_MCD).toFixed(0)}) bei lat ${(srcTop - (maxAt[0] + 0.5) * PIX).toFixed(3)}, lon ${(-180 + (maxAt[1] + 0.5) * PIX).toFixed(3)}`);
console.log(`Nördlich der Grenze: Maximum ${northMax.toFixed(4)} mcd/m², ${northLit} Pixel über 1 % des natürlichen Himmels`);

const dry = await buildDryMask(W, H, -180, latTop, CELL);

const px = new Uint8Array(W * H);
const hist = new Uint32Array(Q_MAX + 1);
let empty = 0, maxMean = 0;
for (let i = 0; i < px.length; i++) {
  let q = 0;
  if (cnt[i]) {
    const mean = sum[i] / cnt[i];
    if (mean > maxMean) maxMean = mean;
    q = encodeRatio(mean / NATURAL_MCD);
  } else empty++;
  hist[q]++;
  px[i] = (q << 1) | dry[i];
}
console.log(`Zellen ohne Daten: ${empty}; hellste Zelle ${maxMean.toFixed(3)} mcd/m² (ratio ${(maxMean / NATURAL_MCD).toFixed(1)}, q ${encodeRatio(maxMean / NATURAL_MCD)})`);
console.log(`Anteil Land: ${((dry.reduce((a, b) => a + b, 0) / dry.length) * 100).toFixed(1)} %; q=0: ${((hist[0] / px.length) * 100).toFixed(1)} %`);

const png = await sharp(Buffer.from(px.buffer), { raw: { width: W, height: H, channels: 1 } })
  .toColourspace('b-w') // sonst schreibt sharp RGB
  .png({ compressionLevel: 9, adaptiveFiltering: true, palette: false })
  .toBuffer();
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, png);
console.log(`→ ${outPath}: ${W} × ${H}, ${(png.length / 1024).toFixed(0)} KiB, ${((Date.now() - t0) / 1000).toFixed(0)} s gesamt`);
