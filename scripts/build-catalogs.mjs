// Erzeugt kompakte Kataloge für Exoplaneten, Kleinkörper, Kometen und Nachbarsterne in public/data/.
// Die Quellen erlauben keinen Abruf aus dem Browser (kein CORS), deshalb wird beim Bauen ein Schnappschuss gezogen.
//
// Quellen:
//   exoplanets.json  – NASA Exoplanet Archive, TAP-Tabelle pscomppars (alle bestätigten Planeten)
//                      https://exoplanetarchive.ipac.caltech.edu/TAP/sync
//   smallbodies.json – JPL Small-Body Database Query API (Bahnelemente) und SBDB API (Einzelobjekte)
//                      https://ssd-api.jpl.nasa.gov/sbdb_query.api, https://ssd-api.jpl.nasa.gov/sbdb.api
//   comets.json      – JPL Small-Body Database Query API (Kometen mit Gesamthelligkeits-Parametern M1/K1)
//   (beide)          – JPL Horizons API: aktuelle oskulierende Elemente für Objekte mit alter Bahnlösung
//                      https://ssd.jpl.nasa.gov/api/horizons.api
//   neighbors.json   – Hipparcos-Hauptkatalog I/239/hip_main über VizieR TAP (CDS Strasbourg),
//                      https://tapvizier.cds.unistra.fr/TAPVizieR/tap/sync; beste Parallaxe (meist Gaia DR3),
//                      Spektraltyp und Gliese-/GJ-Nummer aus SIMBAD TAP (CDS),
//                      https://simbad.cds.unistra.fr/simbad/sim-tap/sync; Namen außerdem aus src/data/sky.json
//                      und einer festen Liste bekannter Nachbarn
//
// Aufruf: node scripts/build-catalogs.mjs [exoplanets] [smallbodies] [comets] [neighbors]
// (ohne Argumente werden alle Kataloge erzeugt)
//
// Das Skript läuft auch in der CI bei jedem Deploy und darf den Build nie abbrechen: Schlägt eine Quelle fehl
// oder liefert sie unplausible Daten, bleibt die vorhandene Datei unverändert und es geht mit dem nächsten
// Katalog weiter. Der Exit-Code ist immer 0.
import { readFileSync, writeFileSync, mkdirSync, existsSync, renameSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'data');
const today = new Date().toISOString().slice(0, 10);

// ---------------------------------------------------------------------------------------------
// Hilfsfunktionen
// ---------------------------------------------------------------------------------------------

const num = (x) => (x == null || x === '' ? null : Number.isFinite(+x) ? +x : null);
// Auf n signifikante Stellen runden (null bleibt null)
const sig = (x, n) => {
  const v = num(x);
  return v == null ? null : +v.toPrecision(n);
};
// Auf d Nachkommastellen runden
const fix = (x, d) => {
  const v = num(x);
  return v == null ? null : +v.toFixed(d);
};
const int = (x) => {
  const v = num(x);
  return v == null ? null : Math.round(v);
};
// Winkel auf 0..360 Grad normieren
const deg360 = (x) => ((x % 360) + 360) % 360;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** JSON per GET abrufen, mit Zeitlimit und zwei Wiederholungen. */
async function getJson(url, { timeout = 120_000, tries = 3 } = {}) {
  let lastErr;
  for (let k = 0; k < tries; k++) {
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(timeout),
        headers: { 'user-agent': 'orbitus-maximus-catalog-builder' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}: ${(await res.text()).slice(0, 200)}`);
      return await res.json();
    } catch (err) {
      lastErr = err;
      if (k < tries - 1) await sleep(3000 * (k + 1));
    }
  }
  throw lastErr;
}

/** TAP-Abfrage (ADQL) per POST, Antwort im VOTable-JSON-Format {metadata, data}. */
async function tapQuery(endpoint, adql, { timeout = 120_000, tries = 3 } = {}) {
  let lastErr;
  for (let k = 0; k < tries; k++) {
    try {
      const body = new URLSearchParams({ REQUEST: 'doQuery', LANG: 'ADQL', FORMAT: 'json', QUERY: adql });
      const res = await fetch(endpoint, { method: 'POST', body, signal: AbortSignal.timeout(timeout) });
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}: ${(await res.text()).slice(0, 200)}`);
      const j = await res.json();
      if (!Array.isArray(j.data) || !Array.isArray(j.metadata)) throw new Error('unerwartetes TAP-Antwortformat');
      const cols = j.metadata.map((m) => m.name);
      return j.data.map((row) => Object.fromEntries(cols.map((c, i) => [c, row[i]])));
    } catch (err) {
      lastErr = err;
      if (k < tries - 1) await sleep(3000 * (k + 1));
    }
  }
  throw lastErr;
}

const SBDB_QUERY = 'https://ssd-api.jpl.nasa.gov/sbdb_query.api';
const SBDB = 'https://ssd-api.jpl.nasa.gov/sbdb.api';

/** SBDB-Query-API: liefert Datensätze als Objekte (Feldname → Wert, Zahlen als Strings). */
async function sbdbQuery(params) {
  const url = `${SBDB_QUERY}?${new URLSearchParams({ 'full-prec': '1', ...params })}`;
  const j = await getJson(url);
  if (!Array.isArray(j.fields) || !Array.isArray(j.data)) throw new Error(`SBDB: unerwartete Antwort ${JSON.stringify(j).slice(0, 200)}`);
  return j.data.map((row) => Object.fromEntries(j.fields.map((f, i) => [f, row[i]])));
}

/** Datei atomar schreiben: kompakt, aber eine Zeile pro Datensatz (lesbare Diffs). */
function writeCatalog(file, meta, cols, rows) {
  mkdirSync(outDir, { recursive: true });
  const head = JSON.stringify({ meta: { ...meta, generated: today, count: rows.length }, cols });
  const text = `${head.slice(0, -1)},"rows":[\n${rows.map((r) => JSON.stringify(r)).join(',\n')}\n]}\n`;
  JSON.parse(text); // Selbsttest: gültiges JSON?
  const path = join(outDir, file);
  const tmp = `${path}.tmp`;
  writeFileSync(tmp, text);
  renameSync(tmp, path);
  return Buffer.byteLength(text);
}

/** Vorhandene Ausgabedatei lesen (für Rückgriffe), oder null. */
function readExisting(file) {
  try {
    const path = join(outDir, file);
    return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : null;
  } catch {
    return null;
  }
}

// Julianisches Datum (UT) aus Kalenderdatum bzw. für jetzt
const jdOf = (y, m, d) => Date.UTC(y, m - 1, d) / 86_400_000 + 2440587.5;
const jdNow = () => Date.now() / 86_400_000 + 2440587.5;

const HORIZONS = 'https://ssd.jpl.nasa.gov/api/horizons.api';
// Höchstens so lange werden Bahnelemente bei Horizons nachgeladen (danach bleiben die SBDB-Elemente)
const HORIZONS_BUDGET_MS = 240_000;
let horizonsFailures = 0;

/**
 * Oskulierende heliozentrische Bahnelemente (Ekliptik J2000) eines Kleinkörpers von JPL Horizons zum heutigen
 * Datum 0 Uhr TDB, numerisch mit allen Störungen integriert. `expect` muss im Namen des gefundenen Objekts
 * vorkommen (Schutz vor Verwechslungen).
 */
async function horizonsElements(command, expect) {
  const jd0 = Math.floor(jdNow() - 0.5) + 0.5;
  const params = new URLSearchParams({
    format: 'json',
    COMMAND: `'${command}'`,
    OBJ_DATA: 'NO',
    MAKE_EPHEM: 'YES',
    EPHEM_TYPE: 'ELEMENTS',
    CENTER: "'500@10'",
    TLIST: `'${jd0}'`,
    REF_PLANE: 'ECLIPTIC',
    REF_SYSTEM: 'J2000',
    OUT_UNITS: 'AU-D',
    CSV_FORMAT: 'YES',
  });
  // Nach drei Netzwerkfehlern in Folge gilt Horizons für diesen Lauf als nicht erreichbar
  if (horizonsFailures >= 3) throw new Error('Horizons nicht erreichbar');
  let j;
  try {
    j = await getJson(`${HORIZONS}?${params}`, { timeout: 60_000, tries: 2 });
    horizonsFailures = 0;
  } catch (err) {
    horizonsFailures++;
    throw err;
  }
  const text = String(j.result ?? '');
  const target = /Target body name:\s*(.+?)\s*\{/.exec(text)?.[1] ?? '';
  if (!target.includes(expect)) throw new Error(`anderes Objekt gefunden: "${target || text.slice(0, 80).trim()}"`);
  const block = text.split('$$SOE')[1]?.split('$$EOE')[0];
  if (!block) throw new Error('keine Elemente');
  // Spalten: JDTDB, Datum, EC, QR, IN, OM, W, Tp, N, MA, TA, A, AD, PR
  const f = block.trim().split('\n')[0].split(',').map((x) => x.trim());
  const el = { jd: +f[0], EC: +f[2], QR: +f[3], IN: +f[4], OM: +f[5], W: +f[6], TP: +f[7], MA: +f[9], A: +f[11] };
  if (![el.jd, el.EC, el.QR, el.IN, el.OM, el.W, el.TP].every(Number.isFinite)) throw new Error('unlesbare Elemente');
  return el;
}

// ---------------------------------------------------------------------------------------------
// 1. Exoplaneten
// ---------------------------------------------------------------------------------------------

// Entdeckungsmethode → Kurzcode
const METHOD = {
  Transit: 'transit',
  'Radial Velocity': 'rv',
  Imaging: 'imaging',
  Microlensing: 'microlensing',
  'Transit Timing Variations': 'ttv',
  Astrometry: 'astrometry',
  'Pulsar Timing': 'timing',
  'Pulsation Timing Variations': 'timing',
  'Eclipse Timing Variations': 'timing',
};

async function buildExoplanets() {
  const adql =
    'select pl_name,hostname,ra,dec,sy_dist,pl_rade,pl_bmasse,pl_orbper,pl_orbsmax,pl_eqt,' +
    'disc_year,discoverymethod,st_teff,sy_vmag,sy_pnum from pscomppars order by hostname,pl_name';
  const url = `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?${new URLSearchParams({ query: adql, format: 'json' })}`;
  const list = await getJson(url, { timeout: 180_000 });
  if (!Array.isArray(list) || list.length < 5000) throw new Error(`nur ${list?.length} Planeten erhalten`);

  const cols = ['name', 'host', 'ra', 'dec', 'dist', 'radius', 'mass', 'period', 'a', 'teq', 'year', 'method', 'teff', 'vmag', 'pnum'];
  const rows = list
    .filter((p) => p.pl_name)
    .map((p) => [
      p.pl_name,
      p.hostname ?? '',
      fix(p.ra, 3),
      fix(p.dec, 3),
      sig(p.sy_dist, 4), // pc
      sig(p.pl_rade, 3), // Erdradien
      sig(p.pl_bmasse, 4), // Erdmassen (bzw. M·sin i)
      sig(p.pl_orbper, 6), // Tage
      sig(p.pl_orbsmax, 4), // AE
      int(p.pl_eqt), // K
      int(p.disc_year),
      METHOD[p.discoverymethod] ?? 'other',
      int(p.st_teff), // K
      fix(p.sy_vmag, 2),
      int(p.sy_pnum),
    ]);
  const bytes = writeCatalog(
    'exoplanets.json',
    { source: 'NASA Exoplanet Archive, Planetary Systems Composite Parameters (pscomppars)', url: 'https://exoplanetarchive.ipac.caltech.edu' },
    cols,
    rows,
  );
  return `${rows.length} Planeten, ${(bytes / 1024).toFixed(0)} KB`;
}

// ---------------------------------------------------------------------------------------------
// 2. Kleinkörper (Asteroiden, Trojaner, TNOs, NEOs)
// ---------------------------------------------------------------------------------------------

const SB_FIELDS = 'full_name,pdes,name,class,a,e,i,om,w,ma,epoch,H';

// Gruppen: jeweils die hellsten (kleinstes H, also meist größten) Objekte einer Bahnklasse
const SB_GROUPS = [
  { key: 'main', classes: 'IMB,MBA,OMB', limit: 4000, nameH: 8 },
  { key: 'trojans', classes: 'TJN', limit: 400, nameH: 9.5 },
  { key: 'tno', classes: 'TNO', limit: 800, nameH: 99 },
  { key: 'neo', classes: 'IEO,ATE,APO,AMO', limit: 300, nameH: 99 },
];

// Bekannte Einzelobjekte (Raumsonden-Ziele u. a.), die nicht unter den hellsten ihrer Klasse sind
const SB_EXTRA = ['433', '3200', '4179', '25143', '65803', '99942', '101955', '162173', '152830', '52246', '486958', '2060', '2024 YR4'];

// Pluto zeichnet die App selbst
const SB_EXCLUDE = new Set(['134340']);

/** Objektname aus SBDB: IAU-Name, sonst (für sehr große Objekte) die vorläufige Bezeichnung. */
function sbName(name, pdes, H, nameH) {
  if (name) return H == null || H < nameH ? name : null;
  if (H != null && H < 4 && pdes && !/^\d+$/.test(pdes)) return pdes;
  return null;
}

function sbRow(o, nameH) {
  const H = num(o.H);
  const row = [
    sig(o.a, 7),
    fix(o.e, 6),
    fix(o.i, 4),
    fix(deg360(+o.om), 4),
    fix(deg360(+o.w), 4),
    fix(deg360(+o.ma), 4),
    num(o.epoch),
    fix(H, 2),
    o.class,
  ];
  const name = sbName(o.name, o.pdes, H, nameH);
  if (name) row.push(name);
  return row;
}

async function sbdbSingle(sstr) {
  const j = await getJson(`${SBDB}?${new URLSearchParams({ sstr, 'phys-par': '1', 'full-prec': '1' })}`, { tries: 2 });
  if (!j.orbit || !j.object) throw new Error(`${sstr}: kein Objekt`);
  const el = Object.fromEntries(j.orbit.elements.map((e) => [e.name, e.value]));
  const H = (j.phys_par ?? []).find((p) => p.name === 'H')?.value ?? null;
  const full = j.object.fullname ?? '';
  // "99942 Apophis (2004 MN4)" → "Apophis"; "(2024 YR4)" → keine IAU-Benennung
  const m = /^\s*\d+\s+([^(]+?)\s*(\(|$)/.exec(full);
  return {
    full_name: full,
    pdes: j.object.des,
    name: m ? m[1] : j.object.des,
    class: j.object.orbit_class?.code ?? 'AST',
    a: el.a,
    e: el.e,
    i: el.i,
    om: el.om,
    w: el.w,
    ma: el.ma,
    epoch: j.orbit.epoch,
    H,
  };
}

async function buildSmallBodies() {
  const bodies = [];
  const seen = new Set();
  const counts = {};
  for (const g of SB_GROUPS) {
    const list = await sbdbQuery({
      fields: SB_FIELDS,
      'sb-class': g.classes,
      // condition_code ≤ 5: nur einigermaßen gesicherte Bahnen (sonst landen verlorene TNOs mit
      // Ein-Nacht-Bahnen und angenommener Kreisbahn unter den "hellsten")
      'sb-cdata': JSON.stringify({ AND: ['H|DF', 'a|DF', 'ma|DF', 'condition_code|LE|5'] }),
      sort: 'H',
      limit: String(g.limit),
    });
    if (list.length < g.limit * 0.9) throw new Error(`${g.key}: nur ${list.length} Objekte`);
    let n = 0;
    for (const o of list) {
      if (SB_EXCLUDE.has(o.pdes) || seen.has(o.pdes)) continue;
      if (!(+o.a > 0 && +o.e < 1)) continue;
      seen.add(o.pdes);
      bodies.push({ o, nameH: g.nameH });
      n++;
    }
    counts[g.key] = n;
  }
  // Einzelobjekte – Fehler hier sind nicht fatal
  let extra = 0;
  for (const sstr of SB_EXTRA) {
    try {
      const o = await sbdbSingle(sstr);
      if (seen.has(o.pdes) || SB_EXCLUDE.has(o.pdes) || !(+o.a > 0 && +o.e < 1)) continue;
      seen.add(o.pdes);
      bodies.push({ o, nameH: 99 });
      extra++;
    } catch (err) {
      console.warn(`[catalogs] smallbodies: ${sstr} übersprungen (${err.message})`);
    }
  }
  counts.extra = extra;

  // Bahnlösungen mit alter Epoche (z. B. Bennu, Epoche 2011) durch heutige Elemente von Horizons ersetzen –
  // sonst laufen sie im Zweikörperproblem um Grad davon. Fehler sind nicht fatal.
  const now = jdNow();
  let refreshed = 0;
  for (const { o } of bodies.filter(({ o }) => Math.abs(+o.epoch - now) > 365).slice(0, 40)) {
    try {
      const h = await horizonsElements(/^\d+$/.test(o.pdes) ? `${o.pdes};` : `DES=${o.pdes};`, o.pdes);
      if (!(h.A > 0 && h.EC < 1 && Math.abs(h.A - +o.a) / +o.a < 0.2)) throw new Error('Bahn weicht zu stark ab');
      Object.assign(o, { a: h.A, e: h.EC, i: h.IN, om: h.OM, w: h.W, ma: h.MA, epoch: h.jd });
      refreshed++;
    } catch (err) {
      console.warn(`[catalogs] smallbodies: ${String(o.full_name).trim()} – Horizons-Elemente nicht verfügbar (${err.message})`);
    }
  }
  counts.horizons = refreshed;

  const rows = bodies.map(({ o, nameH }) => sbRow(o, nameH));
  // Plausibilitätsprüfung: Ceres muss dabei sein
  if (!rows.some((r) => r[9] === 'Ceres')) throw new Error('Ceres fehlt – Antwort unplausibel');

  const cols = ['a', 'e', 'i', 'om', 'w', 'ma', 'epoch', 'H', 'class', 'name'];
  const bytes = writeCatalog(
    'smallbodies.json',
    {
      source: 'JPL Small-Body Database (SBDB) Query API; alte Bahnlösungen aktualisiert mit JPL Horizons',
      url: 'https://ssd-api.jpl.nasa.gov/sbdb_query.api',
      frame: 'heliozentrisch, Ekliptik und Äquinoktium J2000; Winkel in Grad, a in AE, epoch als JD (TDB)',
    },
    cols,
    rows,
  );
  return `${rows.length} Körper (${Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(', ')}), ${(bytes / 1024).toFixed(0)} KB`;
}

// ---------------------------------------------------------------------------------------------
// 3. Kometen
// ---------------------------------------------------------------------------------------------

const COMET_FIELDS = 'full_name,pdes,name,prefix,class,q,e,i,om,w,tp,epoch,M1,K1,per';
// Gebräuchliche Namen für interstellare Objekte (SBDB führt sie unter ihrer C/-Bezeichnung)
const COMET_ALIAS = { '2025 N1': '3I/ATLAS', '2019 Q4': '2I/Borisov' };

async function buildComets() {
  // Zeitfenster: vom 1. Januar des Vorjahres bis zum 31. Dezember in drei Jahren (2026 → 2025-01-01 … 2029-12-31)
  const y = new Date().getUTCFullYear();
  const t0 = jdOf(y - 1, 1, 1);
  const t1 = jdOf(y + 3, 12, 31) + 1;

  // a) Periheldurchgang im Fenster und Helligkeitsparameter bekannt
  const a = await sbdbQuery({
    fields: COMET_FIELDS,
    'sb-kind': 'c',
    'sb-xfrag': '1',
    'sb-cdata': JSON.stringify({ AND: [`tp|RG|${t0}|${t1}`, 'M1|DF', 'K1|DF'] }),
  });
  // b) Periodische Kometen mit q < 2 AE, deren nächstes Perihel (tp + k·P) ins Fenster fällt –
  //    bei älteren Bahnlösungen liegt das in der SBDB gespeicherte tp oft eine Umlaufzeit zurück
  const bAll = await sbdbQuery({
    fields: COMET_FIELDS,
    'sb-kind': 'c',
    'sb-xfrag': '1',
    'sb-cdata': JSON.stringify({ AND: ['q|LT|2', 'e|LT|1', 'tp|DF', 'per|DF'] }),
  });
  const b = bAll.filter((o) => {
    if (o.prefix !== 'P') return false;
    const tp = +o.tp;
    const P = +o.per;
    if (!(P > 0)) return false;
    const next = tp + Math.ceil((t0 - tp) / P) * P;
    return next <= t1;
  });
  if (a.length < 20 || b.length < 20) throw new Error(`zu wenige Kometen (${a.length}/${b.length})`);

  const items = [];
  const seen = new Set();
  for (const o of [...a, ...b]) {
    if (seen.has(o.pdes)) continue;
    if (!(num(o.q) > 0) || num(o.e) == null || num(o.tp) == null) continue;
    seen.add(o.pdes);
    const full = String(o.full_name).trim();
    const name = COMET_ALIAS[o.pdes] ? `${COMET_ALIAS[o.pdes]} (${full.replace(/\s*\(.*\)$/, '')})` : full;
    items.push({ name, pdes: o.pdes, q: +o.q, e: +o.e, i: +o.i, om: +o.om, w: +o.w, tp: +o.tp, epoch: +o.epoch, M1: o.M1, K1: o.K1 });
  }
  const refreshed = await refreshCometElements(items);

  const rows = items.map((c) => [
    c.name,
    sig(c.q, 8),
    fix(c.e, 8),
    fix(c.i, 4),
    fix(deg360(c.om), 4),
    fix(deg360(c.w), 4),
    fix(c.tp, 5),
    c.epoch,
    fix(c.M1, 1),
    fix(c.K1, 2),
  ]);
  rows.sort((p, q) => p[6] - q[6]);

  const cols = ['name', 'q', 'e', 'i', 'om', 'w', 'tp', 'epoch', 'M1', 'K1'];
  const bytes = writeCatalog(
    'comets.json',
    {
      source: 'JPL Small-Body Database (SBDB) Query API; alte Bahnlösungen aktualisiert mit JPL Horizons',
      url: 'https://ssd-api.jpl.nasa.gov/sbdb_query.api',
      frame: 'heliozentrisch, Ekliptik und Äquinoktium J2000; q in AE, Winkel in Grad, tp/epoch als JD (TDB)',
      window: [t0, t1],
    },
    cols,
    rows,
  );
  return `${rows.length} Kometen (Fenster ${a.length}, periodisch ${b.length}, Bahn aktualisiert ${refreshed}), ${(bytes / 1024).toFixed(0)} KB`;
}

/**
 * Kurzperiodische Kometen mit alter Bahnlösung (Epoche > 1 Jahr entfernt) wandern im reinen Zweikörperproblem
 * durch Jupiterstörungen schnell um Grad ab. Für sie holt das Skript bei JPL Horizons oskulierende Elemente zum
 * heutigen Datum (numerisch mit allen Störungen integriert). Elemente aus einem früheren Lauf, deren Epoche
 * jünger als 180 Tage ist, werden wiederverwendet. Fehler sind nicht fatal: dann bleiben die SBDB-Elemente.
 */
async function refreshCometElements(items) {
  const now = jdNow();
  const old = readExisting('comets.json');
  const prev = new Map();
  if (old?.cols && old.rows) {
    for (const r of old.rows) prev.set(r[old.cols.indexOf('name')], Object.fromEntries(old.cols.map((c, k) => [c, r[k]])));
  }
  const started = Date.now();
  let count = 0;
  for (const c of items) {
    if (!(c.e < 1)) continue;
    const a = c.q / (1 - c.e);
    if (a > 34 || Math.abs(c.epoch - now) <= 365) continue; // nur Umlaufzeiten unter ~200 Jahren
    const p = prev.get(c.name);
    if (p && p.epoch > c.epoch && Math.abs(p.epoch - now) < 180) {
      Object.assign(c, { q: p.q, e: p.e, i: p.i, om: p.om, w: p.w, tp: p.tp, epoch: p.epoch });
      count++;
      continue;
    }
    if (Date.now() - started > HORIZONS_BUDGET_MS) continue;
    try {
      const { jd, EC, QR, IN, OM, W, TP } = await horizonsElements(`DES=${c.pdes};CAP;NOFRAG`, c.pdes);
      // Grobe Plausibilität: Jupiter-Begegnungen können q deutlich verschieben, aber nicht beliebig
      if (!(QR > c.q / 2 && QR < c.q * 2 && EC >= 0 && EC < 1.2)) {
        throw new Error(`Horizons-Bahn weicht zu stark ab (q ${c.q.toFixed(3)} → ${QR.toFixed(3)}, e ${EC.toFixed(3)})`);
      }
      Object.assign(c, { q: QR, e: EC, i: IN, om: OM, w: W, tp: TP, epoch: jd });
      count++;
    } catch (err) {
      console.warn(`[catalogs] comets: ${c.name} – Horizons-Elemente nicht verfügbar (${err.message})`);
    }
  }
  return count;
}

// ---------------------------------------------------------------------------------------------
// 4. Nachbarsterne (bis 50 Lichtjahre)
// ---------------------------------------------------------------------------------------------

const LY_PER_PC = 3.261563777;
const MAX_LY = 50;

// Bekannte Nachbarn mit gebräuchlichen Namen (HIP-Nummern per SIMBAD geprüft); haben Vorrang vor allem anderen
const NEIGHBOR_NAMES = {
  70890: 'Proxima Centauri',
  71683: 'Alpha Centauri A',
  71681: 'Alpha Centauri B',
  87937: "Barnard's Star",
  54035: 'Lalande 21185',
  92403: 'Ross 154',
  16537: 'Epsilon Eridani',
  114046: 'Lacaille 9352',
  57548: 'Ross 128',
  104214: '61 Cygni A',
  104217: '61 Cygni B',
  91768: 'Struve 2398 A',
  91772: 'Struve 2398 B',
  1475: 'Groombridge 34 A',
  108870: 'Epsilon Indi',
  8102: 'Tau Ceti',
  5643: 'YZ Ceti',
  36208: "Luyten's Star",
  24186: "Kapteyn's Star",
  105090: 'Lacaille 8760',
  110893: 'Kruger 60',
  30920: 'Ross 614',
  80824: 'Wolf 1061',
  439: 'Gliese 1',
  3829: "Van Maanen's Star",
  49908: 'Groombridge 1618',
  19849: '40 Eridani A',
  112460: 'EV Lacertae',
  88601: '70 Ophiuchi',
  21088: 'Stein 2051',
  53020: 'Wolf 358',
  84405: '36 Ophiuchi',
  84478: '36 Ophiuchi C',
  15510: '82 Eridani',
  113283: 'Fomalhaut B',
  74995: 'Gliese 581',
  113020: 'Gliese 876',
  106440: 'Gliese 832',
  86162: 'Gliese 687',
  85523: 'Gliese 674',
  29295: 'Gliese 229',
  117473: 'Gliese 908',
};

const GREEK = {
  α: 'Alpha', β: 'Beta', γ: 'Gamma', δ: 'Delta', ε: 'Epsilon', ζ: 'Zeta', η: 'Eta', θ: 'Theta', ι: 'Iota', κ: 'Kappa',
  λ: 'Lambda', μ: 'Mu', ν: 'Nu', ξ: 'Xi', ο: 'Omicron', π: 'Pi', ρ: 'Rho', σ: 'Sigma', τ: 'Tau', υ: 'Upsilon',
  φ: 'Phi', χ: 'Chi', ψ: 'Psi', ω: 'Omega',
};
const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };

/** Bayer-/Flamsteed-Bezeichnung + Genitiv des Sternbilds, z. B. "ε" + "Eri" → "Epsilon Eridani". */
function bayerName(b, con, genitive) {
  const gen = genitive[con];
  if (!b || !gen) return null;
  const m = /^([α-ω])(\d*)$/.exec(b);
  if (m) return `${GREEK[m[1]] ?? m[1]}${[...m[2]].map((d) => SUP[d]).join('')} ${gen}`;
  return `${b} ${gen}`; // Flamsteed-Nummer oder lateinischer Buchstabe
}

/** Spektraltyp kürzen: "M5Ve" → "M5V", "M2/M3V" → "M2V", "A0m..." → "A0", "DC:" → "DC". */
function shortSpType(s) {
  // Am-Sterne in k/h/m-Notation ("kA5hF0mF2") nach dem Wasserstofflinien-Typ einordnen
  const t = String(s ?? '').trim().replace(/^k[A-Z]\d+(?:\.\d+)?h(?=[OBAFGKM])/, '');
  if (!t) return null;
  const wd = /^D[ABCOQZGX]?/.exec(t);
  if (wd) return wd[0];
  const m = /^(sd|d)?([OBAFGKM])(\d+(?:\.\d+)?)?:?(?:\/[OBAFGKM]?\d*(?:\.\d+)?)?:?\s*(IV|VI|V|III|II|I)?/.exec(t);
  if (!m) return t.slice(0, 6);
  // "dM4" (Zwerg) → "M4V"
  const lum = m[4] ?? (m[1] === 'd' ? 'V' : '');
  return `${m[1] === 'sd' ? 'sd' : ''}${m[2]}${(m[3] ?? '').replace(/\.0$/, '')}${lum}`;
}

/** "GJ 412 A" → "Gliese 412 A" (Nummern unter 1000), sonst "GJ 1005". */
function gjName(id) {
  const m = /^GJ\s+(\d+(?:\.\d+)?)(.*)$/.exec(id.replace(/\s+/g, ' ').trim());
  if (!m) return null;
  const n = m[1].replace(/\.0$/, '');
  return `${parseFloat(n) < 1000 ? 'Gliese' : 'GJ'} ${n}${m[2]}`;
}

const SIMBAD_TAP = 'https://simbad.cds.unistra.fr/simbad/sim-tap/sync';

/**
 * Zusatzinfos aus SIMBAD für eine Liste von HIP-Nummern: Objekttyp, beste Parallaxe (meist Gaia), Spektraltyp
 * und Gliese-/GJ-Bezeichnung. Ergebnis: Map HIP → { otype, plx, sp, gj }.
 */
async function simbadInfo(hips) {
  const ids = hips.map((h) => `'HIP ${h}'`).join(',');
  const out = new Map();
  const get = (hip) => out.get(hip) ?? out.set(hip, { otype: null, plx: null, sp: null, gj: null, gjNum: Infinity }).get(hip);
  const hipOf = (id) => +String(id).replace(/\D/g, '');

  const basic = await tapQuery(
    SIMBAD_TAP,
    'SELECT i.id AS hip, b.otype, b.plx_value AS plx, b.sp_type AS sp FROM ident AS i ' +
      `JOIN basic AS b ON b.oid = i.oidref WHERE i.id IN (${ids})`,
    { tries: 2 },
  );
  for (const r of basic) Object.assign(get(hipOf(r.hip)), { otype: r.otype ?? null, plx: num(r.plx), sp: r.sp || null });

  const gj = await tapQuery(
    SIMBAD_TAP,
    'SELECT i1.id AS hip, i2.id AS gj FROM ident AS i1 JOIN ident AS i2 ON i1.oidref = i2.oidref ' +
      `WHERE i1.id IN (${ids}) AND i2.id LIKE 'GJ %'`,
    { tries: 2 },
  );
  for (const r of gj) {
    const e = get(hipOf(r.hip));
    const name = gjName(String(r.gj));
    const n = parseFloat(String(r.gj).replace(/^GJ\s+/, ''));
    // Bevorzugt die ursprüngliche Gliese-Nummer ("GJ 563.2 A" vor "GJ 9495 A"), bei Gleichstand die kürzeste
    // Bezeichnung ("GJ 144" vor "GJ 144.0", "GJ 644" vor "GJ 644 A")
    if (name && (n < e.gjNum || (n === e.gjNum && name.length < e.gj.length))) Object.assign(e, { gj: name, gjNum: n });
  }
  return out;
}

async function buildNeighbors() {
  // Kandidaten mit Spielraum (Hipparcos-Parallaxe > 50 mas, also bis etwa 65 Lichtjahre)
  const rows0 = await tapQuery(
    'https://tapvizier.cds.unistra.fr/TAPVizieR/tap/sync',
    'SELECT HIP, RAICRS, DEICRS, Plx, e_Plx, Vmag, "B-V", SpType, pmRA, pmDE FROM "I/239/hip_main" WHERE Plx > 50',
  );
  if (rows0.length < 500) throw new Error(`nur ${rows0.length} Sterne erhalten`);
  const candidates = rows0.filter((r) => r.HIP && r.RAICRS != null && r.DEICRS != null && r.Plx > 0);

  // Hipparcos enthält Scheinnachbarn mit falscher Parallaxe (z. B. R CrA, GJ 563.2) und fehlerhafte Einträge
  // (HIP 114110). Deshalb zählt die beste Parallaxe aus SIMBAD (meist Gaia DR3; Objekttyp "err" = Fehleintrag),
  // nur ohne SIMBAD-Wert die Hipparcos-Parallaxe. SIMBAD liefert außerdem bessere Spektraltypen und
  // Gliese-Nummern. Ist SIMBAD nicht erreichbar, gelten Auswahl, Entfernungen, Typen und Namen der letzten
  // Ausgabe, ohne eine solche nur Hipparcos (Parallaxe > 65,2 mas mit höchstens 20 % Fehler).
  let simbad = null;
  let prev = null;
  try {
    simbad = await simbadInfo(candidates.map((s) => s.HIP));
  } catch (err) {
    console.warn(`[catalogs] neighbors: SIMBAD nicht erreichbar (${err.message}) – nutze die letzte Ausgabe`);
    const old = readExisting('neighbors.json');
    if (old?.cols && old.rows) {
      prev = new Map(old.rows.map((r) => [r[old.cols.indexOf('hip')], Object.fromEntries(old.cols.map((c, k) => [c, r[k]]))]));
    }
  }
  const hipLy = (s) => (s.e_Plx == null || s.e_Plx / s.Plx <= 0.2 ? (1000 / s.Plx) * LY_PER_PC : Infinity);
  const stars = candidates
    .map((s) => {
      let ly;
      if (simbad) {
        const info = simbad.get(s.HIP);
        if (info?.otype === 'err') ly = Infinity;
        else ly = info?.plx > 0 ? (1000 / info.plx) * LY_PER_PC : hipLy(s);
      } else if (prev) {
        ly = prev.get(s.HIP)?.distLy ?? Infinity;
      } else {
        ly = hipLy(s);
      }
      return { ...s, ly };
    })
    .filter((s) => s.ly <= MAX_LY)
    .sort((p, q) => p.ly - q.ly || p.HIP - q.HIP);

  // Namen aus der Sternkarte
  const sky = JSON.parse(readFileSync(join(root, 'src', 'data', 'sky.json'), 'utf8'));
  const genitive = Object.fromEntries(sky.constellations.map((c) => [c.id, c.gen]));

  const rows = stars.map((s) => {
    // Position mit der Eigenbewegung von J1991.25 auf J2000.0 bringen
    const dt = 2000 - 1991.25;
    const cosd = Math.cos((s.DEICRS * Math.PI) / 180);
    const ra = deg360(s.RAICRS + (((s.pmRA ?? 0) / 3.6e6) * dt) / Math.max(cosd, 1e-6));
    const dec = s.DEICRS + ((s.pmDE ?? 0) / 3.6e6) * dt;
    const sn = sky.starNames[String(s.HIP)];
    const info = simbad?.get(s.HIP);
    const old = prev?.get(s.HIP);
    const name =
      NEIGHBOR_NAMES[s.HIP] ??
      (sn?.n || null) ??
      (sn ? bayerName(sn.b, sn.c, genitive) : null) ??
      info?.gj ??
      old?.name ??
      `HIP ${s.HIP}`;
    const sp = shortSpType(info?.sp) ?? old?.sp ?? shortSpType(s.SpType);
    return [s.HIP, fix(ra, 4), fix(dec, 4), fix(s.ly, 2), fix(s.Vmag, 2), fix(s['B-V'], 2), sp, name];
  });
  if (!rows.some((r) => r[0] === 70890)) throw new Error('Proxima Centauri fehlt – Antwort unplausibel');

  const cols = ['hip', 'ra', 'dec', 'distLy', 'vmag', 'bv', 'sp', 'name'];
  const bytes = writeCatalog(
    'neighbors.json',
    {
      source:
        'Hipparcos-Hauptkatalog (ESA 1997, VizieR I/239/hip_main); Entfernung, Spektraltyp und Gliese-Nummer aus SIMBAD (CDS), Parallaxen meist Gaia DR3',
      url: 'https://vizier.cds.unistra.fr/viz-bin/VizieR?-source=I/239',
      frame: 'Position ICRS, Epoche J2000.0 (Hipparcos, mit Eigenbewegung umgerechnet); V und B−V aus Hipparcos',
    },
    cols,
    rows,
  );
  const named = rows.filter((r) => !String(r[7]).startsWith('HIP ')).length;
  return `${rows.length} Sterne (${named} mit Namen), ${(bytes / 1024).toFixed(0)} KB`;
}

// ---------------------------------------------------------------------------------------------
// Ablauf
// ---------------------------------------------------------------------------------------------

const BUILDERS = { exoplanets: buildExoplanets, smallbodies: buildSmallBodies, comets: buildComets, neighbors: buildNeighbors };

const wanted = process.argv.slice(2).filter((a) => a in BUILDERS);
for (const key of wanted.length ? wanted : Object.keys(BUILDERS)) {
  const t = Date.now();
  try {
    const info = await BUILDERS[key]();
    console.log(`[catalogs] ${key}: ${info} (${((Date.now() - t) / 1000).toFixed(1)} s)`);
  } catch (err) {
    console.warn(`[catalogs] ${key}: FEHLER – ${err?.message ?? err}; vorhandene Datei bleibt unverändert`);
  }
}
process.exitCode = 0;
