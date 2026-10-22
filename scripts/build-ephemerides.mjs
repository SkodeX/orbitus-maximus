// Ephemeriden für Raumsonden und Saturnmonde aus JPL Horizons vorberechnen.
//
// Der Browser kann die Horizons-API nicht direkt abfragen (kein CORS), deshalb
// rechnen wir beim Build vor und legen kompakte JSON-Dateien ab:
//   public/data/probes.json        Sondenbahnen (heliozentrisch, Ekliptik J2000, AE, Zeitskala TDB)
//   public/data/saturn-moons.json  oskulierende Bahnelemente der großen Saturnmonde
//
// Aufruf:  node scripts/build-ephemerides.mjs [--only=probes|moons] [--verify]
//   --verify  lädt die "now"-Tabellen zusätzlich mit halber Schrittweite und meldet den
//             Fehler der kubischen Interpolation in den Intervallmitten (nur zur Kontrolle,
//             z. B. wenn sich Bahnen geändert haben und die Schrittweiten neu zu prüfen sind)
//
// Das Skript lässt den Build nie scheitern: Ist Horizons nicht erreichbar oder schlägt eine
// Abfrage fehl, bleiben die bisherigen Daten (ganze Datei bzw. einzelne Sonde/Mond) erhalten.
// Es gibt dann nur eine Warnung und den Exit-Code 0. Ändern sich die Daten nicht, wird die
// Datei nicht neu geschrieben (idempotent).
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(root, 'public', 'data');
const PROBES_FILE = join(OUT_DIR, 'probes.json');
const MOONS_FILE = join(OUT_DIR, 'saturn-moons.json');

const API = 'https://ssd.jpl.nasa.gov/api/horizons.api';
const PAUSE_MS = 400; // höfliche Pause vor jeder Anfrage (Anfragen laufen nacheinander)
const MAX_ROWS = 40_000; // Zeilen je Abfrage; Horizons erlaubt mehr, große Antworten teilen wir auf

const args = process.argv.slice(2);
const VERIFY = args.includes('--verify');
const ONLY = args.find((a) => a.startsWith('--only='))?.slice(7);

// ---------------------------------------------------------------------------
// Zeit: Julianisches Datum aus einem Kalenderdatum (reine Kalenderumrechnung,
// die Zeitskala ist bei Horizons-Vektoren und -Elementen immer TDB)
// ---------------------------------------------------------------------------
const jdOf = (iso) => Date.parse(iso.length <= 10 ? `${iso}T00:00:00Z` : iso) / 86_400_000 + 2_440_587.5;
const MINUTE = 1 / 1440;
const NOW_START = jdOf('2024-01-01');
const NOW_STOP = jdOf('2035-01-01');

const round = (v, d) => Number(v.toFixed(d));

// ---------------------------------------------------------------------------
// Sonden. Schrittweiten der "now"-Tabellen sind so gewählt, dass die kubische
// Interpolation (4-Punkt-Lagrange) höchstens 0,001 AE vom Horizons-Wert abweicht
// (geprüft mit --verify gegen die halbe Schrittweite). Ausnahmen: Sprünge zwischen
// zwei Bahnlösungen in den Horizons-Daten selbst lassen sich nicht wegglätten.
// path: Stützstellen für die grobe Bahn vom Start bis zum Datenende; base = Grundraster in
// Tagen, fine = feinere Fenster [von, bis (null = Datenende), Schritt] z. B. um
// Planetenvorbeiflüge. Danach wird die Bahn ausgedünnt (siehe TOL_MIN/TOL_REL).
// ---------------------------------------------------------------------------
const PROBES = [
  {
    id: 'voyager1', horizons: '-31', launch: '1977-09-05', agency: 'NASA', color: '#f6c945',
    name: { de: 'Voyager 1', en: 'Voyager 1' },
    status: {
      de: 'Fliegt seit 2012 als fernstes von Menschen gebautes Objekt durch den interstellaren Raum und ist im November 2026 erstmals einen Lichttag von der Erde entfernt.',
      en: 'The most distant human-made object has been travelling through interstellar space since 2012 and reaches one light-day from Earth for the first time in November 2026.',
    },
    nowStep: 30,
    path: {
      base: 5,
      fine: [['1979-01-04', '1979-05-04', 0.25], ['1980-09-13', '1981-01-11', 0.25]], // Jupiter, Saturn (±60 d)
    },
  },
  {
    id: 'voyager2', horizons: '-32', launch: '1977-08-20', agency: 'NASA', color: '#f39c4a',
    name: { de: 'Voyager 2', en: 'Voyager 2' },
    status: {
      de: 'Durchquert seit 2018 den interstellaren Raum und misst mit ihren letzten noch eingeschalteten Instrumenten Teilchen und Magnetfelder.',
      en: 'Crossing interstellar space since 2018, it keeps measuring particles and magnetic fields with its last instruments still switched on.',
    },
    nowStep: 30,
    path: {
      base: 5,
      fine: [
        ['1979-05-10', '1979-09-07', 0.25], // Jupiter
        ['1981-06-26', '1981-10-24', 0.25], // Saturn
        ['1985-11-25', '1986-03-25', 0.25], // Uranus
        ['1989-06-26', '1989-10-24', 0.25], // Neptun
      ],
    },
  },
  {
    id: 'newhorizons', horizons: '-98', launch: '2006-01-19', agency: 'NASA', color: '#5dade2',
    name: { de: 'New Horizons', en: 'New Horizons' },
    status: {
      de: 'Erkundet nach Pluto (2015) und Arrokoth (2019) den äußeren Kuipergürtel und die Heliosphäre, mehr als 60 AE von der Sonne entfernt.',
      en: 'After Pluto (2015) and Arrokoth (2019), it is exploring the outer Kuiper Belt and the heliosphere more than 60 AU from the Sun.',
    },
    nowStep: 30,
    path: { base: 5, fine: [['2006-12-30', '2007-04-29', 0.25]] }, // Jupiter
  },
  {
    id: 'parker', horizons: '-96', launch: '2018-08-12', agency: 'NASA', color: '#ef5350',
    name: { de: 'Parker Solar Probe', en: 'Parker Solar Probe' },
    status: {
      de: 'Taucht alle 88 Tage bis auf 6,1 Millionen Kilometer an die Sonnenoberfläche heran und ist dabei mit rund 690.000 km/h das schnellste je gebaute Objekt.',
      en: 'Every 88 days it dives to within 6.1 million km of the Sun’s surface, reaching about 690,000 km/h – the fastest object ever built.',
    },
    nowStep: 10 / 24, // enge Periheldurchgänge (0,046 AE) brauchen ein feines Raster
    path: { base: 0.25 },
  },
  {
    id: 'juno', horizons: '-61', launch: '2011-08-05', agency: 'NASA', color: '#ab83f5',
    name: { de: 'Juno', en: 'Juno' },
    status: {
      de: 'Umkreist Jupiter seit 2016 auf einer polaren Bahn und untersucht in seiner verlängerten Mission Atmosphäre, Magnetfeld und Monde des Riesenplaneten.',
      en: 'In a polar orbit around Jupiter since 2016, it is studying the giant planet’s atmosphere, magnetic field and moons in an extended mission.',
    },
    nowStep: 4 / 24, // Perijovdurchgänge in 1,06 Jupiterradien Abstand
    path: { base: 0.5, fine: [['2016-06-20', null, 0.125]] },
  },
  {
    id: 'jwst', horizons: '-170', launch: '2021-12-25', agency: 'NASA/ESA/CSA', color: '#e8d9a8',
    name: { de: 'James-Webb-Weltraumteleskop', en: 'James Webb Space Telescope' },
    status: {
      de: 'Beobachtet vom Lagrange-Punkt L2 aus, 1,5 Millionen Kilometer von der Erde entfernt, im Infrarotlicht die ersten Galaxien, Sternentstehung und die Atmosphären von Exoplaneten.',
      en: 'From the L2 point 1.5 million km from Earth, it observes the earliest galaxies, star formation and exoplanet atmospheres in infrared light.',
    },
    // Geozentrisch gespeichert: so ist der Erdabstand (~0,01 AE) unabhängig von der Genauigkeit
    // des Erdmodells in der App; heliozentrisch = Erde (astronomy-engine) + diese Tabelle
    nowStep: 2,
    nowCenter: 'earth',
    path: { base: 1 },
  },
  {
    id: 'europaclipper', horizons: '-159', launch: '2024-10-14', agency: 'NASA', color: '#4dd0e1',
    name: { de: 'Europa Clipper', en: 'Europa Clipper' },
    status: {
      de: 'Holt sich am 3. Dezember 2026 an der Erde Schwung und erreicht im April 2030 Jupiter, um dessen Eismond Europa zu untersuchen.',
      en: 'It swings past Earth for a gravity assist on 3 December 2026 and reaches Jupiter in April 2030 to investigate the icy moon Europa.',
    },
    nowStep: 0.75, // ab 2030 Bahnen um Jupiter
    path: { base: 0.5, fine: [['2030-04-01', null, 0.25]] },
  },
  {
    id: 'juice', horizons: '-28', launch: '2023-04-14', agency: 'ESA', color: '#26a69a',
    name: { de: 'JUICE', en: 'JUICE' },
    status: {
      de: 'Hat im September 2026 zum zweiten Mal an der Erde Schwung geholt und ist unterwegs zu Jupiter, den es im Juli 2031 erreicht, um später den Mond Ganymed zu umkreisen.',
      en: 'After its second Earth gravity assist in September 2026 it is heading for Jupiter, arriving in July 2031 and later entering orbit around the moon Ganymede.',
    },
    nowStep: 1.5,
    path: { base: 0.5 },
  },
  {
    id: 'bepicolombo', horizons: '-121', launch: '2018-10-20', agency: 'ESA/JAXA', color: '#9ccc65',
    name: { de: 'BepiColombo', en: 'BepiColombo' },
    status: {
      de: 'Erreicht im November 2026 nach acht Jahren Reise den Merkur, wo zwei Orbiter von ESA und JAXA in eine Umlaufbahn einschwenken.',
      en: 'After an eight-year journey it arrives at Mercury in November 2026, where two orbiters from ESA and JAXA enter orbit.',
    },
    nowStep: 2,
    path: { base: 0.25 },
  },
  {
    id: 'solarorbiter', horizons: '-144', launch: '2020-02-10', agency: 'ESA/NASA', color: '#ff8a65',
    name: { de: 'Solar Orbiter', en: 'Solar Orbiter' },
    status: {
      de: 'Umrundet die Sonne auf einer zunehmend geneigten Bahn und liefert die ersten Bilder ihrer Polregionen; ein Venus-Vorbeiflug im Dezember 2026 kippt die Bahn weiter.',
      en: 'Circling the Sun on an increasingly inclined orbit, it returns the first images of the solar poles; a Venus flyby in December 2026 tilts the orbit further.',
    },
    nowStep: 1.5,
    path: { base: 0.25 },
  },
  {
    id: 'lucy', horizons: '-49', launch: '2021-10-16', agency: 'NASA', color: '#f06292',
    name: { de: 'Lucy', en: 'Lucy' },
    status: {
      de: 'Ist unterwegs zu den Trojaner-Asteroiden, die Jupiter auf seiner Bahn vorauseilen, und erreicht im August 2027 ihr erstes Hauptziel Eurybates.',
      en: 'It is on its way to the Trojan asteroids that lead Jupiter in its orbit and reaches its first main target, Eurybates, in August 2027.',
    },
    nowStep: 1, // Erd-Vorbeiflüge Dezember 2024 und Dezember 2030
    path: { base: 0.5 },
  },
  {
    id: 'psyche', horizons: '-255', launch: '2023-10-13', agency: 'NASA', color: '#90a4ae',
    name: { de: 'Psyche', en: 'Psyche' },
    status: {
      de: 'Fliegt nach dem Mars-Vorbeiflug im Mai 2026 mit Ionentriebwerken zum Metallasteroiden (16) Psyche, den sie im Sommer 2029 erreicht.',
      en: 'After its Mars flyby in May 2026 it is using ion thrusters to reach the metal-rich asteroid (16) Psyche in summer 2029.',
    },
    nowStep: 2,
    path: { base: 0.5 },
  },
  {
    id: 'hera', horizons: '-91', launch: '2024-10-07', agency: 'ESA', color: '#7986cb',
    name: { de: 'Hera', en: 'Hera' },
    status: {
      de: 'Erreicht Ende 2026 den Doppelasteroiden Didymos und Dimorphos, um die Folgen des DART-Einschlags von 2022 zu vermessen.',
      en: 'Arriving at the binary asteroid Didymos and Dimorphos at the end of 2026, it will survey the aftermath of the 2022 DART impact.',
    },
    nowStep: 5,
    path: { base: 0.5 },
  },
];

// Toleranz für die vereinfachte Bahn (lineare Interpolation): max(TOL_MIN, TOL_REL · r)
const TOL_MIN = 0.001; // AE
const TOL_REL = 0.0005; // relativ zum Sonnenabstand

// ---------------------------------------------------------------------------
// Saturnmonde: oskulierende Elemente relativ zum Saturnmittelpunkt (CENTER 500@699).
// Bezugsebene: REF_PLANE=FRAME, also die xy-Ebene des ICRF (≈ Erdäquator J2000).
// So entstehen aus den Elementen direkt Vektoren im gleichen System, in dem
// astronomy-engine rechnet (EQJ), ohne zusätzliche Drehung in die Saturnäquatorebene.
// rate: 'mean' = mittlere Bewegung aus den Nachbarsätzen (Bahnlänge Ω+ω+M) – nötig für die
// inneren Monde, weil Saturns Abplattung (J2) ihre echte Umlaufrate merklich von der
// oskulierenden Keplerrate abweichen lässt; 'osc' = oskulierende Rate von Horizons
// (für Titan und Iapetus genauer, dort dominiert die Störung durch die Sonne).
// ---------------------------------------------------------------------------
const MOONS = [
  { id: 'mimas', horizons: '601', name: 'Mimas', rate: 'mean' },
  { id: 'enceladus', horizons: '602', name: 'Enceladus', rate: 'mean' },
  { id: 'tethys', horizons: '603', name: 'Tethys', rate: 'mean' },
  { id: 'dione', horizons: '604', name: 'Dione', rate: 'mean' },
  { id: 'rhea', horizons: '605', name: 'Rhea', rate: 'mean' },
  { id: 'titan', horizons: '606', name: 'Titan', rate: 'osc' },
  { id: 'iapetus', horizons: '608', name: 'Iapetus', rate: 'osc' },
];
const MOON_START = jdOf('2025-01-01');
const MOON_STOP = jdOf('2033-01-05'); // letzter Satz deckt mit ±5 Tagen noch den 31.12.2032 ab
const MOON_STEP = 10; // Tage → die App propagiert höchstens ±5 Tage

// ---------------------------------------------------------------------------
// Horizons-Zugriff
// ---------------------------------------------------------------------------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const warn = (msg) => console.warn(`⚠ ${msg}`);
const firstLines = (text) => text.trim().split('\n').slice(0, 3).join(' ').slice(0, 300);

// Ist Horizons einmal endgültig nicht erreichbar, sparen wir uns alle weiteren Versuche
let unreachable = null;

/** Eine Horizons-Anfrage; liefert den Ergebnistext (auch Fehlermeldungen von Horizons) */
async function horizons(params) {
  if (unreachable) throw unreachable;
  const qs = new URLSearchParams({ format: 'json', OBJ_DATA: 'NO', MAKE_EPHEM: 'YES', CSV_FORMAT: 'YES', ...params });
  let lastError;
  for (let attempt = 0; attempt < 3; attempt++) {
    await sleep(PAUSE_MS + attempt * 3000);
    try {
      const res = await fetch(`${API}?${qs}`, { signal: AbortSignal.timeout(60_000) });
      if (res.status >= 500 || res.status === 429) throw new Error(`HTTP ${res.status}`);
      const body = await res.json().catch(() => ({}));
      if (!res.ok) return String(body.error ?? body.message ?? `HTTP ${res.status}`);
      return String(body.result ?? body.error ?? '');
    } catch (e) {
      lastError = e; // Netz- oder Serverfehler: kurz warten und erneut versuchen
    }
  }
  unreachable = new Error(`Horizons nicht erreichbar (${lastError?.message ?? lastError})`);
  throw unreachable;
}

/** Tabellenzeilen zwischen $$SOE und $$EOE als Spaltenlisten, oder null */
function parseTable(text) {
  const a = text.indexOf('$$SOE');
  const b = text.indexOf('$$EOE');
  if (a < 0 || b < 0) return null;
  return text
    .slice(a + 5, b)
    .trim()
    .split('\n')
    .filter((l) => l.trim())
    .map((l) => l.split(',').map((s) => s.trim()));
}

const MONTHS = { JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6, JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12 };

/** Liest „No ephemeris for target … prior to/after A.D. 2024-OCT-14 16:15:03.7124 TDB“ */
function parseCoverageLimit(text) {
  const m = text.match(/(prior to|after)\s+A\.D\.\s+(\d{4})-([A-Z]{3})-(\d{2})\s+(\d{2}):(\d{2})(?::(\d{2}(?:\.\d+)?))?/i);
  if (!m || !MONTHS[m[3].toUpperCase()]) return null;
  const jd = Date.UTC(+m[2], MONTHS[m[3].toUpperCase()] - 1, +m[4], +m[5], +m[6]) / 86_400_000 + 2_440_587.5 + Number(m[7] ?? 0) / 86_400;
  return { kind: /prior/i.test(m[1]) ? 'start' : 'stop', jd };
}

const vectorParams = (cmd, center) => ({
  COMMAND: `'${cmd}'`,
  EPHEM_TYPE: 'VECTORS',
  CENTER: `'${center}'`,
  REF_PLANE: 'ECLIPTIC',
  REF_SYSTEM: 'ICRF',
  OUT_UNITS: 'AU-D',
  VEC_TABLE: '1',
  VEC_CORR: 'NONE',
});
const jdParam = (jd) => `'JD${jd.toFixed(6)}'`;

/**
 * Engt [start, stop] auf den Zeitraum ein, für den Horizons Daten hat.
 * Horizons meldet Grenzen als Text („prior to …“/„after …“); wir lesen sie aus und fragen erneut.
 */
async function coverage(cmd, start, stop) {
  for (let attempt = 0; attempt < 5; attempt++) {
    if (stop - start < 1) return null;
    const text = await horizons({
      ...vectorParams(cmd, '500@10'),
      START_TIME: jdParam(start),
      STOP_TIME: jdParam(stop),
      STEP_SIZE: `'${Math.floor(stop - start)} d'`, // Schritt darf die Spanne nicht überschreiten
    });
    if (parseTable(text)) return [start, stop];
    const limit = parseCoverageLimit(text);
    if (!limit) throw new Error(firstLines(text));
    if (limit.kind === 'start') start = Math.max(start, limit.jd + MINUTE);
    else stop = Math.min(stop, limit.jd - MINUTE);
  }
  return null;
}

/** Gleichmäßiges Raster [start, start + k·step ≤ stop] als Zeilen [jd, x, y, z]; teilt große Abfragen auf */
async function vectorSeries(cmd, center, start, stop, step) {
  const minutes = Math.round(step * 1440);
  const count = Math.floor((stop - start) / step + 1e-9) + 1;
  const rows = [];
  for (let k0 = 0; k0 < count; k0 += MAX_ROWS) {
    const a = start + k0 * step;
    const b = start + (Math.min(count, k0 + MAX_ROWS) - 1) * step;
    const text = await horizons({
      ...vectorParams(cmd, center),
      START_TIME: jdParam(a),
      // kleiner Zuschlag, damit Rundung den letzten Rasterpunkt nicht abschneidet
      STOP_TIME: jdParam(b + 2e-6),
      STEP_SIZE: `'${minutes} min'`,
    });
    const table = parseTable(text);
    if (!table) throw new Error(firstLines(text));
    for (const c of table) rows.push([+c[0], +c[2], +c[3], +c[4]]);
  }
  // Plausibilität: lückenloses Raster mit der erwarteten Schrittweite
  const bad = rows.some((r, i) => !r.every(Number.isFinite) || (i > 0 && Math.abs(r[0] - rows[i - 1][0] - step) > 1e-5));
  if (bad || rows.length !== count) throw new Error(`unerwartetes Raster (${rows.length} statt ${count} Zeilen)`);
  return rows;
}

// ---------------------------------------------------------------------------
// Numerik
// ---------------------------------------------------------------------------

/** 4-Punkt-Lagrange-Interpolation auf gleichmäßigem Raster – identisch zur App (src/lib/live/probes.ts) */
function lagrange(xyz, n, s) {
  const i = Math.min(Math.floor(s), n - 2);
  const w = Math.min(Math.max(i - 1, 0), n - 4);
  const u = s - w;
  const a = u, b = u - 1, c = u - 2, d = u - 3;
  const g = [(-b * c * d) / 6, (a * c * d) / 2, (-a * b * d) / 2, (a * b * c) / 6];
  const out = [0, 0, 0];
  for (let k = 0; k < 4; k++) for (let j = 0; j < 3; j++) out[j] += g[k] * xyz[(w + k) * 3 + j];
  return out;
}

/**
 * Vereinfacht eine Bahn (Zeilen [jd, x, y, z]) nach Douglas-Peucker, aber zeitbezogen:
 * Ein Punkt darf entfallen, wenn die lineare Interpolation in der Zeit zwischen den
 * verbleibenden Nachbarn ihn bis auf die Toleranz trifft. So taugt der Pfad auch als
 * Positionsquelle und nicht nur zum Zeichnen.
 */
function simplifyPath(rows) {
  const n = rows.length;
  if (n <= 2) return rows;
  const keep = new Uint8Array(n);
  keep[0] = keep[n - 1] = 1;
  const stack = [[0, n - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    const A = rows[a], B = rows[b];
    let worst = -1;
    let worstRatio = 1;
    for (let i = a + 1; i < b; i++) {
      const P = rows[i];
      const u = (P[0] - A[0]) / (B[0] - A[0]);
      const dx = A[1] + (B[1] - A[1]) * u - P[1];
      const dy = A[2] + (B[2] - A[2]) * u - P[2];
      const dz = A[3] + (B[3] - A[3]) * u - P[3];
      const tol = Math.max(TOL_MIN, TOL_REL * Math.hypot(P[1], P[2], P[3]));
      const ratio = Math.hypot(dx, dy, dz) / tol;
      if (ratio > worstRatio) {
        worstRatio = ratio;
        worst = i;
      }
    }
    if (worst > 0) {
      keep[worst] = 1;
      stack.push([a, worst], [worst, b]);
    }
  }
  return rows.filter((_, i) => keep[i]);
}

// ---------------------------------------------------------------------------
// Sonden
// ---------------------------------------------------------------------------
const toJd = (v) => (typeof v === 'number' ? v : jdOf(v)); // Datum (YYYY-MM-DD) oder schon JD
const nextGrid = (jd, step) => Math.ceil((jd - 0.5) / step - 1e-9) * step + 0.5; // Raster ab 0 h TDB

async function buildProbe(cfg) {
  const launch = jdOf(cfg.launch);
  const cov = await coverage(cfg.horizons, launch - 1, NOW_STOP);
  if (!cov) throw new Error('keine Bahndaten');
  const [covStart, covStop] = cov;

  // ---- "now": gleichmäßiges Raster ab 2024 (bzw. Datenbeginn) bis Datenende/2035 ----
  let now = null;
  const step = cfg.nowStep;
  const t0 = Math.max(NOW_START, Math.ceil(covStart - 0.5) + 0.5);
  const nowCount = Math.floor((covStop - t0) / step + 1e-9) + 1;
  let nowStop = covStop;
  if (nowCount >= 4) {
    nowStop = t0 + (nowCount - 1) * step;
    const center = cfg.nowCenter === 'earth' ? '500@399' : '500@10';
    const digits = cfg.nowCenter === 'earth' ? 8 : 6; // geozentrisch: kleine Zahlen, mehr Stellen
    const rows = await vectorSeries(cfg.horizons, center, t0, nowStop, step);
    now = { t0, step, ...(cfg.nowCenter === 'earth' ? { center: 'earth' } : {}), xyz: rows.flatMap((r) => [round(r[1], digits), round(r[2], digits), round(r[3], digits)]) };
    if (VERIFY) await verifyNow(cfg, center, now, rows.length);
  }

  // ---- "path": grobe Bahn vom Start bis zum Ende der Daten (variable Schrittweite) ----
  // zusätzlich die ersten zehn Tage fein, damit der Pfad kurz nach dem Start beginnt
  const launchWindow = [covStart, covStart + 10, 0.125];
  const segments = [[null, null, cfg.path.base], launchWindow, ...(cfg.path.fine ?? [])];
  const byJd = new Map();
  for (const [from, to, segStep] of segments) {
    const a = nextGrid(Math.max(covStart, from ? toJd(from) : covStart), segStep);
    const b = Math.min(nowStop, to ? toJd(to) : nowStop);
    if (b - a < segStep) continue;
    for (const r of await vectorSeries(cfg.horizons, '500@10', a, b, segStep)) byJd.set(round(r[0], 5), r);
  }
  const raw = [...byJd.values()].sort((p, q) => p[0] - q[0]);
  if (raw.length < 2) throw new Error('zu wenige Bahnpunkte');
  const kept = simplifyPath(raw);
  const path = {
    jd: kept.map((r) => round(r[0], 4)),
    xyz: kept.flatMap((r) => [round(r[1], 6), round(r[2], 6), round(r[3], 6)]),
  };

  const { nowStep: _s, nowCenter: _c, path: _p, ...meta } = cfg;
  console.log(
    `✓ ${cfg.id.padEnd(14)} now ${now ? `${now.xyz.length / 3} × ${+(step * 24).toFixed(2)} h` : '–'}, ` +
      `path ${kept.length}/${raw.length} Punkte, Daten ${jdToIso(covStart)} … ${jdToIso(covStop)}`,
  );
  return { ...meta, now, path };
}

const jdToIso = (jd) => new Date((jd - 2_440_587.5) * 86_400_000).toISOString().slice(0, 10);

/** Kontrolle: Interpolationsfehler in den Intervallmitten gegen Horizons-Daten mit halber Schrittweite */
async function verifyNow(cfg, center, now, n) {
  const half = await vectorSeries(cfg.horizons, center, now.t0, now.t0 + (n - 1) * now.step, now.step / 2);
  let max = 0;
  let at = 0;
  for (let k = 1; k < half.length; k += 2) {
    const q = lagrange(now.xyz, n, k / 2);
    const e = Math.hypot(q[0] - half[k][1], q[1] - half[k][2], q[2] - half[k][3]);
    if (e > max) [max, at] = [e, half[k][0]];
  }
  console.log(`  ↳ Prüfung ${cfg.id}: max. Interpolationsfehler ${max.toExponential(2)} AE am ${jdToIso(at)}${max > 1e-3 ? '  (> 0,001 AE!)' : ''}`);
}

async function buildProbes() {
  const previous = new Map();
  try {
    if (existsSync(PROBES_FILE)) for (const p of JSON.parse(readFileSync(PROBES_FILE, 'utf8')).probes ?? []) previous.set(p.id, p);
  } catch {
    warn('Vorhandene probes.json nicht lesbar – wird neu aufgebaut');
  }

  const probes = [];
  for (const cfg of PROBES) {
    try {
      probes.push(await buildProbe(cfg));
    } catch (e) {
      const old = previous.get(cfg.id);
      warn(`${cfg.id}: ${e.message}${old ? ' – behalte bisherige Daten' : ' – Sonde entfällt'}`);
      if (old) {
        // Bahndaten von früher, Beschreibung aus der aktuellen Konfiguration
        const { nowStep: _s, nowCenter: _c, path: _p, ...meta } = cfg;
        probes.push({ ...meta, now: old.now, path: old.path });
      }
    }
  }
  if (!probes.length) return warn('Keine Sondendaten – probes.json bleibt unverändert');

  const head = {
    generated: new Date().toISOString(),
    source: 'JPL Horizons (https://ssd.jpl.nasa.gov/horizons/)',
    frame: 'heliozentrisch, Ekliptik J2000 (ICRF), AE; JWST-"now" geozentrisch; Zeiten JD (TDB)',
  };
  writeIfChanged(PROBES_FILE, head, 'probes', probes);
}

// ---------------------------------------------------------------------------
// Saturnmonde
// ---------------------------------------------------------------------------
async function buildMoon(cfg) {
  const text = await horizons({
    COMMAND: `'${cfg.horizons}'`,
    EPHEM_TYPE: 'ELEMENTS',
    CENTER: "'500@699'",
    REF_PLANE: 'FRAME',
    REF_SYSTEM: 'ICRF',
    OUT_UNITS: 'KM-D',
    START_TIME: jdParam(MOON_START),
    STOP_TIME: jdParam(MOON_STOP),
    STEP_SIZE: `'${MOON_STEP} d'`,
  });
  const table = parseTable(text);
  if (!table) throw new Error(firstLines(text));
  // Spalten: JDTDB, Datum, EC, QR, IN, OM, W, Tp, N, MA, TA, A, AD, PR
  const sets = table.map((c) => ({ jd: +c[0], e: +c[2], i: +c[4], node: +c[5], peri: +c[6], n: +c[8], M: +c[9], a: +c[11] }));
  if (sets.length < 3 || sets.some((s, k) => !Object.values(s).every(Number.isFinite) || (k > 0 && Math.abs(s.jd - sets[k - 1].jd - MOON_STEP) > 1e-6))) {
    throw new Error('unerwartete Elementtabelle');
  }

  // Umlaufrate je Satz (°/Tag)
  const rates = sets.map((s, k) => {
    if (cfg.rate !== 'mean') return s.n;
    const p = sets[Math.max(0, k - 1)];
    const q = sets[Math.min(sets.length - 1, k + 1)];
    const dt = q.jd - p.jd;
    let dl = q.node + q.peri + q.M - (p.node + p.peri + p.M);
    dl += 360 * Math.round((s.n * dt - dl) / 360); // volle Umläufe ergänzen
    return dl / dt;
  });

  const el = sets.flatMap((s, k) => [
    round(s.a, 0),
    round(s.e, 6),
    round(s.i, 4),
    round(((s.node % 360) + 360) % 360, 4),
    round(((s.peri % 360) + 360) % 360, 4),
    round(((s.M % 360) + 360) % 360, 4),
    round(rates[k], 6),
  ]);
  console.log(`✓ ${cfg.id.padEnd(10)} ${sets.length} Elementsätze`);
  return { id: cfg.id, horizons: cfg.horizons, name: cfg.name, t0: sets[0].jd, step: MOON_STEP, el };
}

async function buildMoons() {
  const previous = new Map();
  try {
    if (existsSync(MOONS_FILE)) for (const m of JSON.parse(readFileSync(MOONS_FILE, 'utf8')).moons ?? []) previous.set(m.id, m);
  } catch {
    warn('Vorhandene saturn-moons.json nicht lesbar – wird neu aufgebaut');
  }

  const moons = [];
  for (const cfg of MOONS) {
    try {
      moons.push(await buildMoon(cfg));
    } catch (e) {
      const old = previous.get(cfg.id);
      warn(`${cfg.id}: ${e.message}${old ? ' – behalte bisherige Daten' : ' – Mond entfällt'}`);
      if (old) moons.push(old);
    }
  }
  if (!moons.length) return warn('Keine Monddaten – saturn-moons.json bleibt unverändert');

  const head = {
    generated: new Date().toISOString(),
    source: 'JPL Horizons (https://ssd.jpl.nasa.gov/horizons/)',
    frame: 'saturnzentrisch, oskulierende Elemente bezogen auf die ICRF-xy-Ebene (≈ Erdäquator J2000); Zeiten JD (TDB)',
    elements: 'je Satz: a [km], e, i [°], Ω [°], ω [°], M [°], n [°/Tag] (Umlaufrate für die Propagation)',
    saturnRadiusKm: 60268,
  };
  writeIfChanged(MOONS_FILE, head, 'moons', moons);
}

// ---------------------------------------------------------------------------
// Ausgabe
// ---------------------------------------------------------------------------

/** Schreibt { ...head, [key]: items } (ein Eintrag pro Zeile) – nur wenn sich die Daten geändert haben */
function writeIfChanged(file, head, key, items) {
  const body = `[\n${items.map((it) => JSON.stringify(it)).join(',\n')}\n]`;
  const text = `${JSON.stringify(head).slice(0, -1)},"${key}":${body}}\n`;
  try {
    if (existsSync(file)) {
      const old = JSON.parse(readFileSync(file, 'utf8'));
      const strip = (o) => JSON.stringify({ ...o, generated: undefined });
      if (strip(old) === strip(JSON.parse(text))) {
        console.log(`= ${file.slice(root.length + 1)} unverändert`);
        return;
      }
    }
  } catch {
    // alte Datei kaputt: einfach neu schreiben
  }
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(file, text);
  console.log(`→ ${file.slice(root.length + 1)} geschrieben (${(text.length / 1024).toFixed(0)} kB)`);
}

try {
  if (ONLY !== 'moons') await buildProbes();
  if (ONLY !== 'probes') await buildMoons();
} catch (e) {
  warn(`Ephemeriden nicht aktualisiert: ${e?.message ?? e}`);
}
process.exit(0);
