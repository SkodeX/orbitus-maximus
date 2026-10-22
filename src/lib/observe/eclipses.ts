// Sonnen- und Mondfinsternisse mit astronomy-engine: Liste, Umstände am eigenen Ort,
// Zentrallinie einer Sonnenfinsternis und die Geometrie für den Finsternis-Simulator.
import * as A from 'astronomy-engine';

const AU_KM = 149_597_870.7;
const R_EARTH_KM = 6378.137;
const R_MOON_KM = 1737.4;
const R_SUN_KM = 695_700;
const DEG = Math.PI / 180;

export interface SolarEclipse {
  kind: A.EclipseKind;
  peak: Date;
  /** Ort der größten Finsternis (bei zentralen Finsternissen) */
  lat: number | null;
  lon: number | null;
  /** Bedeckungsgrad der Sonnenfläche am Ort der größten Finsternis (0–1) */
  obscuration: number | null;
  /** Umstände am eigenen Ort, falls dort etwas zu sehen ist */
  local: LocalCircumstances | null;
}

export interface LocalCircumstances {
  kind: A.EclipseKind;
  obscuration: number;
  begin: { t: Date; alt: number };
  peak: { t: Date; alt: number };
  end: { t: Date; alt: number };
  totalBegin: { t: Date; alt: number } | null;
  totalEnd: { t: Date; alt: number } | null;
  /** Steht die Sonne während der Finsternis irgendwann über dem Horizont? */
  visible: boolean;
}

export interface LunarEclipse {
  kind: A.EclipseKind;
  peak: Date;
  obscuration: number;
  /** Halbe Dauer der Phasen in Minuten */
  sdPenum: number;
  sdPartial: number;
  sdTotal: number;
  /** Höhe des Mondes am eigenen Ort zur Mitte der Finsternis */
  moonAlt: number;
}

const ev = (e: A.EclipseEvent) => ({ t: e.time.date, alt: e.altitude });

/** Die nächsten Sonnenfinsternisse weltweit, mit den Umständen am eigenen Ort */
export function solarEclipses(from: Date, count: number, obs: A.Observer): SolarEclipse[] {
  const locals: LocalCircumstances[] = [];
  let l = A.SearchLocalSolarEclipse(from, obs);
  // Lokale Finsternisse im selben Zeitraum vorab sammeln (etwa zwei pro Jahr weltweit, deutlich weniger lokal)
  const until = from.getTime() + count * 200 * 86_400_000;
  while (l.peak.time.date.getTime() < until) {
    locals.push({
      kind: l.kind,
      obscuration: l.obscuration,
      begin: ev(l.partial_begin),
      peak: ev(l.peak),
      end: ev(l.partial_end),
      totalBegin: l.total_begin ? ev(l.total_begin) : null,
      totalEnd: l.total_end ? ev(l.total_end) : null,
      visible: [l.partial_begin, l.peak, l.partial_end].some((e) => e.altitude > 0),
    });
    l = A.NextLocalSolarEclipse(l.peak.time, obs);
  }

  const out: SolarEclipse[] = [];
  let g = A.SearchGlobalSolarEclipse(from);
  for (let i = 0; i < count; i++) {
    const peak = g.peak.date;
    const local = locals.find((x) => Math.abs(x.peak.t.getTime() - peak.getTime()) < 12 * 3_600_000) ?? null;
    out.push({ kind: g.kind, peak, lat: g.latitude ?? null, lon: g.longitude ?? null, obscuration: g.obscuration ?? null, local });
    g = A.NextGlobalSolarEclipse(g.peak);
  }
  return out;
}

export function lunarEclipses(from: Date, count: number, obs: A.Observer): LunarEclipse[] {
  const out: LunarEclipse[] = [];
  let e = A.SearchLunarEclipse(from);
  for (let i = 0; i < count; i++) {
    const t = e.peak;
    const eq = A.Equator(A.Body.Moon, t, obs, true, true);
    out.push({
      kind: e.kind,
      peak: t.date,
      obscuration: e.obscuration,
      sdPenum: e.sd_penum,
      sdPartial: e.sd_partial,
      sdTotal: e.sd_total,
      moonAlt: A.Horizon(t, obs, eq.ra, eq.dec, 'normal').altitude,
    });
    e = A.NextLunarEclipse(e.peak);
  }
  return out;
}

/** Erdfeste Länge/Breite eines geozentrischen J2000-Vektors (Einheit egal) zur Zeit t */
function toGeo(v: A.Vector, t: A.AstroTime) {
  const d = A.RotateVector(A.Rotation_EQJ_EQD(t), v);
  const gast = A.SiderealTime(t);
  const lon = ((((Math.atan2(d.y, d.x) / DEG - gast * 15) % 360) + 540) % 360) - 180;
  const geocentric = Math.atan2(d.z, Math.hypot(d.x, d.y));
  // Geozentrische → geografische Breite (Abplattung der Erde)
  const lat = Math.atan(Math.tan(geocentric) / (1 - 1 / 298.257) ** 2) / DEG;
  return { lat, lon };
}

/**
 * Zentrallinie einer Sonnenfinsternis: wo die Achse des Mondschattens die Erde trifft.
 * Liefert zusammenhängende Abschnitte (Breite/Länge) im Minutentakt.
 */
export function centralLine(peak: Date): { lat: number; lon: number; t: Date }[] {
  const R = R_EARTH_KM / AU_KM;
  const pts: { lat: number; lon: number; t: Date }[] = [];
  for (let m = -200; m <= 200; m += 2) {
    const t = A.MakeTime(new Date(peak.getTime() + m * 60_000));
    const S = A.GeoVector(A.Body.Sun, t, true);
    const M = A.GeoMoon(t);
    let dx = M.x - S.x;
    let dy = M.y - S.y;
    let dz = M.z - S.z;
    const n = Math.hypot(dx, dy, dz);
    dx /= n;
    dy /= n;
    dz /= n;
    const md = M.x * dx + M.y * dy + M.z * dz;
    const disc = md * md - (M.x * M.x + M.y * M.y + M.z * M.z) + R * R;
    if (disc < 0) continue;
    const s = -md - Math.sqrt(disc);
    const P = new A.Vector(M.x + s * dx, M.y + s * dy, M.z + s * dz, t);
    pts.push({ ...toGeo(P, t), t: t.date });
  }
  return pts;
}

export interface DiskGeometry {
  /** Scheinbare Radien in Bogenminuten */
  sunR: number;
  moonR: number;
  /** Mond relativ zur Sonne in Bogenminuten (x nach Osten = links, y nach Norden) */
  dx: number;
  dy: number;
  sunAlt: number;
  /** Bedeckter Anteil der Sonnenfläche (0–1) */
  obscuration: number;
}

/** Fläche der Überlappung zweier Kreise */
function overlap(r1: number, r2: number, d: number) {
  if (d >= r1 + r2) return 0;
  if (d <= Math.abs(r1 - r2)) return Math.PI * Math.min(r1, r2) ** 2;
  const a = r1 * r1 * Math.acos((d * d + r1 * r1 - r2 * r2) / (2 * d * r1));
  const b = r2 * r2 * Math.acos((d * d + r2 * r2 - r1 * r1) / (2 * d * r2));
  const c = 0.5 * Math.sqrt((-d + r1 + r2) * (d + r1 - r2) * (d - r1 + r2) * (d + r1 + r2));
  return a + b - c;
}

/** Sonne und Mond, wie sie am eigenen Ort zur Zeit t am Himmel stehen (für den Simulator) */
export function sunMoonDisks(t: Date, obs: A.Observer): DiskGeometry {
  const time = A.MakeTime(t);
  const s = A.Equator(A.Body.Sun, time, obs, true, true);
  const m = A.Equator(A.Body.Moon, time, obs, true, true);
  const sunR = Math.atan(R_SUN_KM / (s.dist * AU_KM)) / DEG * 60;
  const moonR = Math.atan(R_MOON_KM / (m.dist * AU_KM)) / DEG * 60;
  const dRa = (((m.ra - s.ra) * 15 + 540) % 360) - 180;
  const dx = dRa * Math.cos(s.dec * DEG) * 60;
  const dy = (m.dec - s.dec) * 60;
  const d = Math.hypot(dx, dy);
  return {
    sunR,
    moonR,
    dx,
    dy,
    sunAlt: A.Horizon(time, obs, s.ra, s.dec, 'normal').altitude,
    obscuration: overlap(sunR, moonR, d) / (Math.PI * sunR * sunR),
  };
}

export interface ShadowGeometry {
  /** Radien von Kern- und Halbschatten der Erde in Bogenminuten */
  umbra: number;
  penumbra: number;
  moonR: number;
  /** Mond relativ zur Schattenmitte in Bogenminuten (x Osten, y Norden) */
  dx: number;
  dy: number;
}

/** Erdschatten und Mond bei einer Mondfinsternis (geozentrisch) */
export function earthShadow(t: Date): ShadowGeometry {
  const time = A.MakeTime(t);
  const S = A.GeoVector(A.Body.Sun, time, true);
  const M = A.GeoMoon(time);
  const sunDist = Math.hypot(S.x, S.y, S.z) * AU_KM;
  const moonDist = Math.hypot(M.x, M.y, M.z) * AU_KM;
  const piMoon = Math.asin(R_EARTH_KM / moonDist);
  const piSun = Math.asin(R_EARTH_KM / sunDist);
  const sSun = Math.asin(R_SUN_KM / sunDist);
  // Faktor 1,02: die Erdatmosphäre vergrößert den Schatten etwas
  const umbra = (1.02 * (piMoon + piSun - sSun)) / DEG * 60;
  const penumbra = (1.02 * (piMoon + piSun + sSun)) / DEG * 60;
  const anti = A.EquatorFromVector(new A.Vector(-S.x, -S.y, -S.z, time));
  const moon = A.EquatorFromVector(M);
  const dRa = (((moon.ra - anti.ra) * 15 + 540) % 360) - 180;
  return {
    umbra,
    penumbra,
    moonR: Math.asin(R_MOON_KM / moonDist) / DEG * 60,
    dx: dRa * Math.cos(anti.dec * DEG) * 60,
    dy: (moon.dec - anti.dec) * 60,
  };
}

/** Kommende Durchgänge von Merkur und Venus vor der Sonne */
export function transits(from: Date) {
  return [A.Body.Mercury, A.Body.Venus].map((body) => {
    const tr = A.SearchTransit(body, from);
    return { body: body === A.Body.Mercury ? 'mercury' : 'venus', start: tr.start.date, peak: tr.peak.date, finish: tr.finish.date, separation: tr.separation };
  });
}
