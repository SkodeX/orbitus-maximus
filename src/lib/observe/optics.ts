// Teleskope, Ferngläser und Okulare: Kennzahlen, die man beim Beobachten braucht.
// Faustformeln wie in der Amateurastronomie üblich (Vergrößerung = Brennweite Teleskop / Brennweite Okular usw.).

export interface Telescope {
  id: string;
  kind: 'telescope';
  name: string;
  /** Öffnung (Objektiv- bzw. Spiegeldurchmesser) in mm */
  aperture: number;
  /** Brennweite in mm */
  focal: number;
}

export interface Binoculars {
  id: string;
  kind: 'binoculars';
  name: string;
  magnification: number;
  aperture: number;
  /** Echtes Gesichtsfeld in Grad (steht meist auf dem Fernglas, z. B. „6,5°“ oder „114 m/1000 m“) */
  fov: number;
}

export type Instrument = Telescope | Binoculars;

export interface Eyepiece {
  id: string;
  /** Brennweite in mm */
  focal: number;
  /** Eigengesichtsfeld in Grad (Plössl ~52°, Weitwinkel ~68°, Ultraweitwinkel ~82°) */
  afov: number;
}

export interface Optics {
  instruments: Instrument[];
  eyepieces: Eyepiece[];
  /** Gewähltes Gerät (bei Teleskopen mit Okular) für den Kreis in der Sternkarte */
  active: { instrument: string; eyepiece: string | null } | null;
  /** Gesichtsfeld als Kreis in der Sternkarte zeigen */
  showFov: boolean;
}

export const DEFAULT_OPTICS: Optics = {
  instruments: [
    { id: 'bino-10x50', kind: 'binoculars', name: '10×50', magnification: 10, aperture: 50, fov: 6.5 },
    { id: 'scope-130', kind: 'telescope', name: 'Newton 130/900', aperture: 130, focal: 900 },
  ],
  eyepieces: [
    { id: 'ep-25', focal: 25, afov: 52 },
    { id: 'ep-10', focal: 10, afov: 52 },
  ],
  active: { instrument: 'bino-10x50', eyepiece: null },
  showFov: false,
};

export interface OpticsStats {
  magnification: number;
  /** Echtes Gesichtsfeld in Grad */
  trueFov: number;
  /** Austrittspupille in mm (ideal 2–7 mm; größer als die Augenpupille verschenkt Licht) */
  exitPupil: number;
  /** Sinnvolle Höchstvergrößerung (etwa doppelte Öffnung in mm) */
  maxUseful: number;
  /** Kleinste sinnvolle Vergrößerung (Austrittspupille 7 mm) */
  minUseful: number;
  /** Grenzgröße: schwächste noch sichtbare Sterne (unter dunklem Himmel) */
  limitingMag: number;
  /** Auflösungsvermögen nach Dawes in Bogensekunden */
  resolution: number;
  /** Lichtsammelleistung im Vergleich zum Auge (7 mm Pupille) */
  lightGain: number;
  /** Öffnungsverhältnis f/… (nur Teleskope) */
  focalRatio: number | null;
}

export function opticsStats(inst: Instrument, ep: Eyepiece | null): OpticsStats | null {
  const D = inst.aperture;
  let magnification: number;
  let trueFov: number;
  if (inst.kind === 'binoculars') {
    magnification = inst.magnification;
    trueFov = inst.fov;
  } else {
    if (!ep) return null;
    magnification = inst.focal / ep.focal;
    trueFov = ep.afov / magnification;
  }
  return {
    magnification,
    trueFov,
    exitPupil: D / magnification,
    maxUseful: 2 * D,
    minUseful: D / 7,
    limitingMag: 2.7 + 5 * Math.log10(D),
    resolution: 116 / D,
    lightGain: (D / 7) ** 2,
    focalRatio: inst.kind === 'telescope' ? inst.focal / D : null,
  };
}

/** Gesichtsfeld „114 m auf 1000 m“ → Grad */
export const metersPer1000ToDeg = (m: number) => (2 * Math.atan(m / 2000) * 180) / Math.PI;

export const newId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

/** Beschriftung eines Geräts, z. B. „Newton 130/900 · 25 mm (36×)“ */
export function opticsLabel(inst: Instrument, ep: Eyepiece | null, stats: OpticsStats | null) {
  if (inst.kind === 'binoculars' || !ep || !stats) return inst.name;
  return `${inst.name} · ${ep.focal} mm (${Math.round(stats.magnification)}×)`;
}
