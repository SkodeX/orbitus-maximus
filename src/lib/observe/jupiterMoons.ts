// Die vier Galileischen Monde, wie man sie von der Erde aus neben Jupiter sieht,
// samt Ereignissen: Durchgang vor Jupiter, Verdeckung, Verfinsterung und Schattendurchgang.
import * as A from 'astronomy-engine';

const AU_KM = 149_597_870.7;
const R_JUP_KM = 71_492;
const R = R_JUP_KM / AU_KM;
const C_AU_PER_DAY = 173.1446;
/** Polarradius / Äquatorradius */
export const JUPITER_FLATTENING = 0.9351;

export const MOONS = ['io', 'europa', 'ganymede', 'callisto'] as const;
export type MoonId = (typeof MOONS)[number];

export interface MoonView {
  id: MoonId;
  /** Abstand von Jupiters Mitte in Jupiterradien: x nach Osten (am Himmel links), y nach Norden */
  x: number;
  y: number;
  /** > 0: vor Jupiter (zur Erde hin) */
  z: number;
  /** Mond steht vor bzw. hinter der Scheibe, steckt im Jupiterschatten, oder sein Schatten liegt auf Jupiter */
  transit: boolean;
  occulted: boolean;
  eclipsed: boolean;
  shadow: { x: number; y: number } | null;
}

export interface JupiterView {
  moons: MoonView[];
  /** Positionswinkel des Jupiter-Nordpols (Grad, von Norden über Osten) */
  poleAngle: number;
  /** Scheinbarer Durchmesser in Bogensekunden */
  diameter: number;
}

type V = [number, number, number];
const dot = (a: V, b: V) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const norm = (a: V): V => {
  const l = Math.hypot(a[0], a[1], a[2]);
  return [a[0] / l, a[1] / l, a[2] / l];
};
const cross = (a: V, b: V): V => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

/** Liegt ein Punkt (in Jupiterradien, Himmelsebene) auf der abgeplatteten Scheibe? */
function onDisk(x: number, y: number, pole: number) {
  const a = (pole * Math.PI) / 180;
  // In Koordinaten entlang des Äquators (u) und der Polachse (v) drehen
  const u = x * Math.cos(a) - y * Math.sin(a);
  const v = x * Math.sin(a) + y * Math.cos(a);
  return u * u + (v / JUPITER_FLATTENING) ** 2 < 1;
}

export function jupiterView(date: Date): JupiterView {
  const t = A.MakeTime(date);
  const J = A.GeoVector(A.Body.Jupiter, t, true);
  const dist = Math.hypot(J.x, J.y, J.z);
  // Lichtlaufzeit: Wir sehen das System so, wie es vor rund 40 Minuten war
  const tl = t.AddDays(-dist / C_AU_PER_DAY);
  const info = A.JupiterMoons(tl);
  const los = norm([J.x, J.y, J.z]);
  const east = norm(cross([0, 0, 1], los));
  const north = cross(los, east);

  const axis = A.RotationAxis(A.Body.Jupiter, tl).north;
  const pole: V = [axis.x, axis.y, axis.z];
  const poleAngle = (Math.atan2(dot(pole, east), dot(pole, north)) * 180) / Math.PI;

  // Richtung des Sonnenlichts am Ort Jupiters (von der Sonne weg)
  const H = A.HelioVector(A.Body.Jupiter, tl);
  const away = norm([H.x, H.y, H.z]);

  const moons = MOONS.map((id) => {
    const s = info[id];
    const p: V = [s.x, s.y, s.z];
    const x = dot(p, east) / R;
    const y = dot(p, north) / R;
    const z = -dot(p, los) / R;
    const inside = onDisk(x, y, poleAngle);
    // Im Schatten: hinter Jupiter (von der Sonne aus) und nah an der Schattenachse
    const along = dot(p, away);
    const perp = Math.sqrt(Math.max(0, dot(p, p) - along * along));
    const eclipsed = along > 0 && perp < R;
    // Schatten des Mondes auf Jupiter: Strahl vom Mond weg von der Sonne trifft die Kugel
    let shadow: MoonView['shadow'] = null;
    if (along < 0 && perp < R) {
      // Erster Treffpunkt auf der Jupiteroberfläche entlang der Schattenrichtung
      const s = -along - Math.sqrt(R * R - perp * perp);
      const hit: V = [p[0] + away[0] * s, p[1] + away[1] * s, p[2] + away[2] * s];
      // Nur sichtbar, wenn die Stelle zur Erde zeigt
      if (-dot(hit, los) > 0) shadow = { x: dot(hit, east) / R, y: dot(hit, north) / R };
    }
    return { id, x, y, z, transit: inside && z > 0, occulted: inside && z < 0, eclipsed, shadow };
  });

  const diameter = ((2 * R_JUP_KM) / (dist * AU_KM)) * (180 / Math.PI) * 3600;
  return { moons, poleAngle, diameter };
}

export type EventKind = 'transit' | 'shadow' | 'occultation' | 'eclipse';
export interface MoonEvent {
  moon: MoonId;
  kind: EventKind;
  start: Date;
  end: Date;
}

/** Ereignisse in einem Zeitraum (2-Minuten-Raster) */
export function jupiterEvents(from: Date, hours: number): MoonEvent[] {
  const out: MoonEvent[] = [];
  const open = new Map<string, Date>();
  const step = 2 * 60_000;
  for (let ms = from.getTime(); ms <= from.getTime() + hours * 3_600_000; ms += step) {
    const d = new Date(ms);
    const v = jupiterView(d);
    for (const m of v.moons) {
      const states: [EventKind, boolean][] = [
        ['transit', m.transit],
        ['shadow', !!m.shadow],
        ['occultation', m.occulted],
        ['eclipse', m.eclipsed && !m.occulted],
      ];
      for (const [kind, on] of states) {
        const key = `${m.id}:${kind}`;
        if (on && !open.has(key)) open.set(key, d);
        if (!on && open.has(key)) {
          out.push({ moon: m.id, kind, start: open.get(key)!, end: d });
          open.delete(key);
        }
      }
    }
  }
  for (const [key, start] of open) {
    const [moon, kind] = key.split(':') as [MoonId, EventKind];
    out.push({ moon, kind, start, end: new Date(from.getTime() + hours * 3_600_000) });
  }
  return out.sort((a, b) => a.start.getTime() - b.start.getTime());
}
