// Erzeugt kompakte Himmelsdaten für die Sternkarte aus dem d3-celestial-Katalog.
// Aufruf: npm run sky-data  →  schreibt src/data/sky.json
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { geoContains } from 'd3-geo';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'node_modules', 'd3-celestial', 'data');
const read = (f) => JSON.parse(readFileSync(join(src, f), 'utf8'));

// d3-celestial speichert RA als Länge im Bereich -180..180 Grad
const ra360 = (lon) => +(((lon % 360) + 360) % 360).toFixed(3);
const r3 = (n) => +n.toFixed(3);

// ---- Sterne (bis Größe 6) ----
const starFeatures = read('stars.6.json').features;
const stars = starFeatures
  .map((f) => [ra360(f.geometry.coordinates[0]), r3(f.geometry.coordinates[1]), +f.properties.mag.toFixed(2), +(+f.properties.bv || 0).toFixed(2), f.id])
  .sort((a, b) => a[2] - b[2]);

// ---- Sternnamen: Eigennamen (bis 4,5 mag) und Bayer-/Flamsteed-Bezeichnungen (bis 5,5 mag) ----
const names = read('starnames.json');
const starNames = {};
for (const s of stars) {
  const n = names[s[4]];
  if (!n) continue;
  const proper = n.name && s[2] <= 4.5 ? n.name : '';
  const desig = n.bayer || n.flam || '';
  if (proper || (desig && s[2] <= 5.5)) starNames[s[4]] = { n: proper, c: n.c || '', b: desig };
}

// ---- Sternbilder ----
const cons = read('constellations.json').features.map((f) => ({
  id: f.id,
  de: f.properties.de || f.properties.name,
  en: f.properties.name,
  la: f.properties.name,
  gen: f.properties.gen,
  rank: +f.properties.rank,
  ra: ra360(f.geometry.coordinates[0]),
  dec: r3(f.geometry.coordinates[1]),
}));
const lines = {};
for (const f of read('constellations.lines.json').features) {
  lines[f.id] = f.geometry.coordinates.map((line) => line.map(([lon, lat]) => [ra360(lon), r3(lat)]));
}

// ---- Messier-Objekte ----
const dsoNames = read('dsonames.json');
const messier = read('messier.json').features.map((f) => {
  const p = f.properties;
  const loc = dsoNames[p.desig] || {};
  const en = (loc.name || p.alt || '').replace('´', "'");
  return {
    id: f.id,
    ngc: p.desig,
    en,
    de: loc.de || en,
    type: p.type,
    mag: p.mag,
    dim: p.dim,
    ra: ra360(f.geometry.coordinates[0]),
    dec: r3(f.geometry.coordinates[1]),
  };
});

// ---- Milchstraße als Punktwolke ----
// Gleichmäßig verteilte Punkte auf der Himmelskugel; Helligkeit = Anzahl der Konturebenen, die den Punkt enthalten.
const mw = read('mw.json').features;
const N = 24000;
const golden = Math.PI * (3 - Math.sqrt(5));
const milkyWay = [];
const coverage = new Array(mw.length).fill(0);
for (let i = 0; i < N; i++) {
  const z = 1 - (2 * (i + 0.5)) / N;
  const lat = (Math.asin(z) * 180) / Math.PI;
  let lon = (((i * golden) * 180) / Math.PI) % 360;
  if (lon > 180) lon -= 360;
  let level = 0;
  mw.forEach((f, k) => {
    if (geoContains(f, [lon, lat])) {
      level++;
      coverage[k]++;
    }
  });
  if (level > 0) milkyWay.push([ra360(lon), r3(lat), level]);
}
coverage.forEach((c, k) => console.log(`Milchstraße ${mw[k].id}: ${((100 * c) / N).toFixed(1)} % des Himmels`));

const out = { stars, starNames, constellations: cons, lines, messier, milkyWay };
const target = join(root, 'src', 'data', 'sky.json');
mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, JSON.stringify(out));

// Kleine Namensliste für den Planer (ohne die großen Sternkataloge)
const consNames = Object.fromEntries(cons.map((c) => [c.id, { de: c.de, en: c.en }]));
writeFileSync(join(root, 'src', 'data', 'constellation-names.json'), JSON.stringify(consNames));
console.log(
  `sky.json: ${stars.length} Sterne, ${Object.keys(starNames).length} Namen, ${cons.length} Sternbilder, ` +
    `${messier.length} Messier, ${milkyWay.length} Milchstraßen-Punkte, ${(JSON.stringify(out).length / 1024).toFixed(0)} KB`,
);
