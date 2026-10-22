// Orbitus Maximus – Push-Server (Supabase Edge Function, Deno).
// Läuft alle 10 Minuten per pg_cron und prüft für jedes Abo: ISS-Überflug, Polarlicht, klare Nacht, Meteorstrom.
// Außerdem: Testnachricht an das eigene Gerät (mit Nutzer-Token).
import { createClient } from 'npm:@supabase/supabase-js@2';
import webpush from 'npm:web-push@3.6.7';
import * as sat from 'npm:satellite.js@5.0.0';
import * as A from 'npm:astronomy-engine@2.1.19';

const SITE = 'https://skodex.github.io/orbitus-maximus/';
const VAPID_PUBLIC = 'BOrpSPFu-fMldVG9Bw040xQKWeR_MYncn19RFgbdRI54mkrDUG3mIaCnHbwY8JsgZCwPozmsgUOoXxkOHtWGtws';
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

interface Sub {
  endpoint: string;
  user_id: string;
  p256dh: string;
  auth: string;
  lat: number;
  lon: number;
  tz: string;
  place_name: string | null;
  lang: 'de' | 'en';
  prefs: Record<string, boolean>;
}

interface Message {
  key: string;
  title: string;
  body: string;
  url: string;
}

async function secret(name: string): Promise<string> {
  const { data, error } = await supabase.rpc('orbitus_secret', { secret_name: name });
  if (error || !data) throw new Error(`Secret ${name} fehlt`);
  return data as string;
}

let vapidReady = false;
async function setupVapid() {
  if (vapidReady) return;
  webpush.setVapidDetails(SITE, VAPID_PUBLIC, await secret('orbitus_vapid_private'));
  vapidReady = true;
}

async function send(sub: Sub, m: Message) {
  await webpush.sendNotification(
    { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
    JSON.stringify({ title: m.title, body: m.body, url: m.url, tag: m.key }),
    { TTL: 1800 },
  );
}

// ---------------------------------------------------------------- Hilfen für Zeit und Richtung

const fmtTime = (d: Date, tz: string, lang: string) =>
  new Intl.DateTimeFormat(lang === 'de' ? 'de-DE' : 'en-GB', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: tz }).format(d);
const localDate = (d: Date, tz: string) => new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(d);
const localHour = (d: Date, tz: string) => Number(new Intl.DateTimeFormat('en-GB', { hour: '2-digit', hourCycle: 'h23', timeZone: tz }).format(d));
const DIRS = { de: ['Norden', 'Nordosten', 'Osten', 'Südosten', 'Süden', 'Südwesten', 'Westen', 'Nordwesten'], en: ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'] };
const dir = (az: number, lang: 'de' | 'en') => DIRS[lang][Math.round((((az % 360) + 360) % 360) / 45) % 8];
const num = (x: number, lang: string, digits = 1) => x.toLocaleString(lang === 'de' ? 'de-DE' : 'en-GB', { maximumFractionDigits: digits, minimumFractionDigits: digits });

function sunAltitude(date: Date, lat: number, lon: number) {
  const obs = new A.Observer(lat, lon, 0);
  const eq = A.Equator(A.Body.Sun, date, obs, true, true);
  return A.Horizon(date, obs, eq.ra, eq.dec, 'normal').altitude;
}

// ---------------------------------------------------------------- ISS

async function loadIss() {
  const txt = await fetch('https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=TLE').then((r) => r.text());
  const lines = txt.split(/\r?\n/).map((s) => s.trim());
  return sat.twoline2satrec(lines.find((l) => l.startsWith('1 '))!, lines.find((l) => l.startsWith('2 '))!);
}

/** Liegt die ISS im Sonnenlicht? (zylindrischer Erdschatten) */
function issLit(eci: { x: number; y: number; z: number }, date: Date) {
  const s = A.GeoVector(A.Body.Sun, date, true);
  const l = Math.hypot(s.x, s.y, s.z);
  const u = [s.x / l, s.y / l, s.z / l];
  const proj = eci.x * u[0] + eci.y * u[1] + eci.z * u[2];
  if (proj > 0) return true;
  const perp = Math.hypot(eci.x - proj * u[0], eci.y - proj * u[1], eci.z - proj * u[2]);
  return perp > 6371;
}

function issAlert(sub: Sub, rec: sat.SatRec, now: Date): Message | null {
  const gd = { longitude: sat.degreesToRadians(sub.lon), latitude: sat.degreesToRadians(sub.lat), height: 0 };
  let appear: { t: Date; az: number; alt: number } | null = null;
  let peak: { t: Date; az: number; alt: number } | null = null;
  let vanish: { t: Date; az: number } | null = null;
  for (let t = now.getTime(); t <= now.getTime() + 40 * 60_000; t += 20_000) {
    const d = new Date(t);
    const pv = sat.propagate(rec, d);
    if (!pv.position || typeof pv.position === 'boolean') continue;
    const look = sat.ecfToLookAngles(gd, sat.eciToEcf(pv.position, sat.gstime(d)));
    const alt = (look.elevation * 180) / Math.PI;
    const az = (look.azimuth * 180) / Math.PI;
    const visible = alt >= 10 && issLit(pv.position, d) && sunAltitude(d, sub.lat, sub.lon) < -4;
    if (visible) {
      appear ??= { t: d, az, alt };
      if (!peak || alt > peak.alt) peak = { t: d, az, alt };
      vanish = { t: d, az };
    } else if (appear) break;
  }
  if (!appear || !peak || !vanish) return null;
  const minutes = Math.round((appear.t.getTime() - now.getTime()) / 60_000);
  // Nur Überflüge melden, die in 3 bis 25 Minuten beginnen
  if (minutes < 3 || minutes > 25) return null;
  const de = sub.lang === 'de';
  const time = fmtTime(appear.t, sub.tz, sub.lang);
  return {
    key: `iss:${appear.t.toISOString().slice(0, 16)}`,
    title: de ? `ISS in ${minutes} Minuten sichtbar` : `ISS visible in ${minutes} minutes`,
    body: de
      ? `Um ${time} taucht sie im ${dir(appear.az, 'de')} auf, steigt bis ${Math.round(peak.alt)}° im ${dir(peak.az, 'de')} und zieht Richtung ${dir(vanish.az, 'de')}.`
      : `At ${time} it appears in the ${dir(appear.az, 'en')}, climbs to ${Math.round(peak.alt)}° in the ${dir(peak.az, 'en')} and heads ${dir(vanish.az, 'en')}.`,
    url: `#/sky?focus=iss&t=${appear.t.getTime()}`,
  };
}

// ---------------------------------------------------------------- Polarlicht

async function loadKp() {
  const rows = (await fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json').then((r) => r.json())) as (
    | { time_tag: string; kp: number | string }
    | string[]
  )[];
  return rows
    .map((r) => (Array.isArray(r) ? { t: r[0], kp: Number(r[1]) } : { t: r.time_tag, kp: Number(r.kp) }))
    .filter((r) => Number.isFinite(r.kp))
    .map((r) => ({ t: Date.parse(r.t.endsWith('Z') ? r.t : `${r.t.replace(' ', 'T')}Z`), kp: r.kp }));
}

function kpNeeded(lat: number, lon: number) {
  const r = Math.PI / 180;
  const s = Math.sin(lat * r) * Math.sin(80.8 * r) + Math.cos(lat * r) * Math.cos(80.8 * r) * Math.cos((lon + 72.8) * r);
  const mlat = Math.abs(Math.asin(s) / r);
  return Math.max(0, Math.min(9, (65 - mlat) / 2.3));
}

function auroraAlert(sub: Sub, kp: { t: number; kp: number }[], now: Date): Message | null {
  const soon = kp.filter((p) => p.t >= now.getTime() - 3 * 3_600_000 && p.t <= now.getTime() + 6 * 3_600_000);
  if (!soon.length) return null;
  const max = Math.max(...soon.map((p) => p.kp));
  const needed = kpNeeded(sub.lat, sub.lon);
  if (max < needed) return null;
  const darkSoon = [0, 1.5, 3, 4.5].some((h) => sunAltitude(new Date(now.getTime() + h * 3_600_000), sub.lat, sub.lon) < -10);
  if (!darkSoon) return null;
  const de = sub.lang === 'de';
  const toward = sub.lat >= 0 ? (de ? 'Norden' : 'north') : de ? 'Süden' : 'south';
  return {
    key: `aurora:${localDate(now, sub.tz)}`,
    title: de ? 'Polarlicht möglich!' : 'Aurora possible!',
    body: de
      ? `Erwartet wird bis Kp ${num(max, 'de')} – bei dir reicht etwa Kp ${Math.ceil(needed)}. Such dir einen dunklen Ort mit freier Sicht nach ${toward}; die Handykamera sieht oft mehr als das Auge.`
      : `Up to Kp ${num(max, 'en')} is expected – about Kp ${Math.ceil(needed)} is enough where you are. Find a dark spot with a clear view ${toward}; phone cameras often see more than your eyes.`,
    url: '#/live',
  };
}

// ---------------------------------------------------------------- Klare Nacht

async function clearNightAlert(sub: Sub, now: Date, cache: Map<string, number[][]>): Promise<Message | null> {
  const hour = localHour(now, sub.tz);
  if (hour < 16 || hour > 21) return null;
  // Dunkle Stunden bis 2 Uhr nachts (Sonne unter −12°)
  const darkHours: number[] = [];
  for (let h = 0; h <= 12; h++) {
    const t = new Date(now.getTime() + h * 3_600_000);
    if (sunAltitude(t, sub.lat, sub.lon) < -12) darkHours.push(Math.floor(t.getTime() / 3_600_000) * 3_600_000);
  }
  if (darkHours.length < 3) return null;
  const key = `${sub.lat.toFixed(1)},${sub.lon.toFixed(1)}`;
  if (!cache.has(key)) {
    const j = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${sub.lat}&longitude=${sub.lon}&hourly=cloud_cover&timeformat=unixtime&forecast_days=2`,
    ).then((r) => r.json());
    cache.set(key, (j.hourly.time as number[]).map((t, i) => [t * 1000, j.hourly.cloud_cover[i] as number]));
  }
  const clouds = cache.get(key)!.filter(([t]) => darkHours.includes(t)).map(([, c]) => c);
  if (!clouds.length) return null;
  const avg = clouds.reduce((a, b) => a + b, 0) / clouds.length;
  if (avg > 25) return null;
  const moon = A.Illumination(A.Body.Moon, now).phase_fraction;
  const de = sub.lang === 'de';
  const darkFrom = fmtTime(new Date(darkHours[0]), sub.tz, sub.lang);
  const moonNote =
    moon > 0.7
      ? de
        ? ` Der Mond ist zu ${Math.round(moon * 100)} % beleuchtet – gut für Mond und Planeten.`
        : ` The Moon is ${Math.round(moon * 100)} % lit – great for the Moon and planets.`
      : de
        ? ' Wenig Mondlicht – ideal für Sterne und Galaxien.'
        : ' Little moonlight – ideal for stars and galaxies.';
  return {
    key: `clear:${localDate(now, sub.tz)}`,
    title: de ? 'Klare Nacht in Sicht ✨' : 'Clear night ahead ✨',
    body: de
      ? `Ab etwa ${darkFrom} ist es dunkel, im Schnitt nur ${Math.round(avg)} % Wolken.${moonNote}`
      : `Dark from about ${darkFrom}, only ${Math.round(avg)} % cloud on average.${moonNote}`,
    url: '#/',
  };
}

// ---------------------------------------------------------------- Meteorströme

const SHOWERS = [
  { id: 'qua', de: 'Quadrantiden', en: 'Quadrantids', peak: [1, 3], zhr: 80 },
  { id: 'lyr', de: 'Lyriden', en: 'Lyrids', peak: [4, 22], zhr: 18 },
  { id: 'eta', de: 'Eta-Aquariiden', en: 'Eta Aquariids', peak: [5, 6], zhr: 50 },
  { id: 'sda', de: 'Südliche Delta-Aquariiden', en: 'Southern Delta Aquariids', peak: [7, 31], zhr: 25 },
  { id: 'per', de: 'Perseiden', en: 'Perseids', peak: [8, 12], zhr: 100 },
  { id: 'ori', de: 'Orioniden', en: 'Orionids', peak: [10, 21], zhr: 20 },
  { id: 'leo', de: 'Leoniden', en: 'Leonids', peak: [11, 17], zhr: 15 },
  { id: 'gem', de: 'Geminiden', en: 'Geminids', peak: [12, 14], zhr: 150 },
];

function meteorAlert(sub: Sub, now: Date): Message | null {
  const hour = localHour(now, sub.tz);
  if (hour < 16 || hour > 21) return null;
  const [y, m, d] = localDate(now, sub.tz).split('-').map(Number);
  const s = SHOWERS.find((x) => x.peak[0] === m && x.peak[1] === d);
  if (!s) return null;
  const de = sub.lang === 'de';
  return {
    key: `meteor:${s.id}:${y}`,
    title: de ? `Heute Nacht: ${s.de}` : `Tonight: ${s.en}`,
    body: de
      ? `Der Meteorstrom erreicht sein Maximum – unter dunklem Himmel bis zu ${s.zhr} Sternschnuppen pro Stunde. Am meisten siehst du in der zweiten Nachthälfte.`
      : `The meteor shower peaks tonight – up to ${s.zhr} meteors an hour under dark skies. You’ll see the most after midnight.`,
    url: `#/sky?focus=meteor:${s.id}`,
  };
}

// ---------------------------------------------------------------- Ablauf

async function runAlerts() {
  await setupVapid();
  const { data: subs, error } = await supabase.from('push_subscriptions').select('*');
  if (error) throw error;
  const now = new Date();
  const [rec, kp] = await Promise.all([loadIss().catch(() => null), loadKp().catch(() => [])]);
  const cloudCache = new Map<string, number[][]>();
  let sent = 0;

  for (const sub of (subs ?? []) as Sub[]) {
    const prefs = { iss: true, aurora: true, clear: true, meteors: true, ...sub.prefs };
    const candidates: (Message | null)[] = [];
    try {
      if (prefs.iss && rec) candidates.push(issAlert(sub, rec, now));
      if (prefs.aurora) candidates.push(auroraAlert(sub, kp, now));
      if (prefs.clear) candidates.push(await clearNightAlert(sub, now, cloudCache));
      if (prefs.meteors) candidates.push(meteorAlert(sub, now));
    } catch (e) {
      console.error('Prüfung fehlgeschlagen', sub.endpoint.slice(-12), e);
    }
    const messages = candidates.filter((m): m is Message => !!m);
    if (!messages.length) continue;

    const { data: done } = await supabase
      .from('push_log')
      .select('key')
      .eq('endpoint', sub.endpoint)
      .in(
        'key',
        messages.map((m) => m.key),
      );
    for (const m of messages.filter((x) => !done?.some((d) => d.key === x.key))) {
      try {
        await send(sub, m);
        await supabase.from('push_log').insert({ endpoint: sub.endpoint, key: m.key });
        sent++;
      } catch (e) {
        const status = (e as { statusCode?: number }).statusCode;
        // Abo abgelaufen oder zurückgezogen: aufräumen
        if (status === 404 || status === 410) {
          await supabase.from('push_subscriptions').delete().eq('endpoint', sub.endpoint);
          break;
        }
        console.error('Senden fehlgeschlagen', status, e);
      }
    }
  }
  await supabase.from('push_log').delete().lt('sent_at', new Date(now.getTime() - 30 * 86_400_000).toISOString());
  return { subscriptions: subs?.length ?? 0, sent };
}

async function sendTest(req: Request, body: { endpoint?: string; lang?: string }) {
  const token = req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '');
  const { data: auth } = await supabase.auth.getUser(token ?? '');
  if (!auth.user || !body.endpoint) return new Response('unauthorized', { status: 401, headers: CORS });
  const { data: sub } = await supabase.from('push_subscriptions').select('*').eq('endpoint', body.endpoint).eq('user_id', auth.user.id).maybeSingle();
  if (!sub) return new Response('not found', { status: 404, headers: CORS });
  await setupVapid();
  const de = (body.lang ?? (sub as Sub).lang) === 'de';
  await send(sub as Sub, {
    key: 'test',
    title: 'Orbitus Maximus',
    body: de ? 'Benachrichtigungen funktionieren! Wir melden uns, wenn am Himmel etwas los ist. 🚀' : 'Notifications are working! We’ll let you know when something is happening in the sky. 🚀',
    url: '#/settings',
  });
  return Response.json({ ok: true }, { headers: CORS });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  try {
    const body = await req.json().catch(() => ({}));
    if (body.test) return await sendTest(req, body);
    // Zeitgesteuerter Aufruf: nur mit dem Cron-Schlüssel aus dem Vault
    const expected = await secret('orbitus_cron_key');
    if (req.headers.get('x-cron-key') !== expected) return new Response('forbidden', { status: 403 });
    return Response.json(await runAlerts());
  } catch (e) {
    console.error(e);
    return new Response(String(e), { status: 500, headers: CORS });
  }
});
