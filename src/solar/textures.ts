// Im Browser erzeugte Oberflächen für Körper ohne NASA-Karte (Mond, Merkur, Uranus, Sonne …),
// außerdem Wolkenschichten, Saturnringe und Leuchthöfe. Alles auf Canvas, ohne Downloads.

type Rgb = [number, number, number];

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Wertrauschen, in x periodisch (für nahtlose Kugelkarten) */
function makeNoise(seed: number) {
  const hash = (x: number, y: number) => {
    let h = (x * 374761393 + y * 668265263 + seed * 2147483647) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  };
  const smooth = (t: number) => t * t * (3 - 2 * t);
  const value = (x: number, y: number, period: number) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = smooth(x - xi);
    const yf = smooth(y - yi);
    const x0 = ((xi % period) + period) % period;
    const x1 = (x0 + 1) % period;
    const a = hash(x0, yi);
    const b = hash(x1, yi);
    const c = hash(x0, yi + 1);
    const d = hash(x1, yi + 1);
    return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
  };
  /** Fraktales Rauschen 0..1; u, v in 0..1, `freq` Zellen über den Umfang */
  return (u: number, v: number, freq: number, octaves = 5, stretchY = 0.5) => {
    let sum = 0;
    let amp = 0.5;
    let norm = 0;
    let f = freq;
    for (let o = 0; o < octaves; o++) {
      sum += amp * value(u * f, v * f * stretchY, f);
      norm += amp;
      amp *= 0.5;
      f *= 2;
    }
    return sum / norm;
  };
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const mix = (a: Rgb, b: Rgb, t: number): Rgb => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

function canvas(w: number, h: number) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

/** Pixelweise füllen; `fn` liefert RGB(A) 0..255 */
function paint(w: number, h: number, fn: (u: number, v: number) => number[]) {
  const c = canvas(w, h);
  const ctx = c.getContext('2d')!;
  const img = ctx.createImageData(w, h);
  const d = img.data;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const p = fn(x / w, y / h);
      const i = (y * w + x) * 4;
      d[i] = p[0];
      d[i + 1] = p[1];
      d[i + 2] = p[2];
      d[i + 3] = p.length > 3 ? p[3] : 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

/** Krater als helle Ränder mit dunkler Mulde; horizontal gestreckt, damit sie auf der Kugel rund wirken */
function craters(c: HTMLCanvasElement, count: number, seed: number, maxR: number, strength = 1) {
  const ctx = c.getContext('2d')!;
  const rnd = mulberry32(seed);
  const { width: w, height: h } = c;
  for (let i = 0; i < count; i++) {
    const y = h * (0.08 + 0.84 * rnd());
    const x = w * rnd();
    const r = Math.pow(rnd(), 2.2) * maxR + 1.5;
    const lat = (0.5 - y / h) * Math.PI;
    const sx = 1 / Math.max(0.25, Math.cos(lat));
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(sx, 1);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
    g.addColorStop(0, `rgba(0,0,0,${0.28 * strength})`);
    g.addColorStop(0.7, `rgba(0,0,0,${0.12 * strength})`);
    g.addColorStop(0.86, `rgba(255,255,255,${0.22 * strength})`);
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  return c;
}

export type ProceduralStyle = 'sun' | 'moon' | 'mercury' | 'uranus' | 'ganymede' | 'callisto' | 'charon';

export function proceduralTexture(style: ProceduralStyle): HTMLCanvasElement {
  switch (style) {
    case 'sun': {
      const n = makeNoise(11);
      return paint(1024, 512, (u, v) => {
        const g = n(u, v, 48, 4);
        const big = n(u, v, 6, 3);
        const t = Math.min(1, Math.max(0, g * 1.25 - 0.1 + (big - 0.5) * 0.4));
        const c = mix([235, 110, 20], [255, 222, 140], t);
        return c;
      });
    }
    case 'moon': {
      const n = makeNoise(3);
      const c = paint(1024, 512, (u, v) => {
        const base = n(u, v, 10, 6);
        const maria = smoothstep(0.52, 0.62, n(u + 0.3, v, 3, 4));
        const t = 0.62 + (base - 0.5) * 0.35 - maria * 0.22;
        const g = Math.max(0, Math.min(1, t)) * 255;
        return [g * 1.02, g, g * 0.96];
      });
      return craters(c, 380, 5, 22);
    }
    case 'mercury': {
      const n = makeNoise(17);
      const c = paint(1024, 512, (u, v) => {
        const base = n(u, v, 12, 6);
        const dark = smoothstep(0.55, 0.68, n(u, v, 4, 3));
        const t = 0.55 + (base - 0.5) * 0.4 - dark * 0.12;
        const g = Math.max(0, Math.min(1, t)) * 255;
        return [g * 1.05, g * 0.98, g * 0.9];
      });
      return craters(c, 650, 9, 26, 1.2);
    }
    case 'uranus': {
      const n = makeNoise(23);
      return paint(512, 256, (u, v) => {
        const band = Math.sin(v * Math.PI * 9) * 0.03 + (n(u, v, 6, 3, 8) - 0.5) * 0.05;
        const t = Math.min(1, Math.max(0, 0.55 + band + (0.5 - Math.abs(v - 0.5)) * 0.15));
        return mix([118, 196, 206], [196, 240, 242], t);
      });
    }
    case 'ganymede': {
      const n = makeNoise(29);
      const c = paint(512, 256, (u, v) => {
        const light = smoothstep(0.45, 0.6, n(u, v, 5, 5));
        const grain = (n(u, v, 40, 3) - 0.5) * 0.12;
        return mix([96, 86, 74], [184, 174, 158], Math.min(1, Math.max(0, light + grain)));
      });
      return craters(c, 120, 31, 10, 0.8);
    }
    case 'callisto': {
      const n = makeNoise(37);
      const c = paint(512, 256, (u, v) => {
        const t = 0.32 + (n(u, v, 12, 5) - 0.5) * 0.25;
        const g = t * 255;
        return [g * 1.05, g * 0.97, g * 0.88];
      });
      const ctx = c.getContext('2d')!;
      const rnd = mulberry32(41);
      for (let i = 0; i < 900; i++) {
        ctx.fillStyle = `rgba(235,230,220,${0.25 + rnd() * 0.6})`;
        ctx.beginPath();
        ctx.arc(rnd() * 512, 20 + rnd() * 216, rnd() * 1.6 + 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
      return c;
    }
    case 'charon': {
      const n = makeNoise(43);
      return paint(512, 256, (u, v) => {
        const g = 0.6 + (n(u, v, 8, 5) - 0.5) * 0.3;
        const cap = smoothstep(0.2, 0.05, v); // rötliche Nordpolregion „Mordor Macula“
        return mix([g * 255, g * 248, g * 238], [122, 74, 58], cap * 0.85);
      });
    }
  }
}

/** Wolkenschicht (RGBA) für Erde oder Venus */
export function cloudTexture(kind: 'earth' | 'venus'): HTMLCanvasElement {
  if (kind === 'earth') {
    const n = makeNoise(53);
    return paint(1024, 512, (u, v) => {
      const lat = Math.abs(v - 0.5) * 2;
      // Wolkenbänder in den gemäßigten Breiten, wenig über den Subtropen
      const belt = 0.75 + 0.25 * Math.cos(lat * Math.PI * 2.2);
      const c = n(u, v, 7, 6, 0.6) * belt;
      const a = smoothstep(0.4, 0.66, c) * 0.9;
      return [255, 255, 255, a * 255];
    });
  }
  const n = makeNoise(59);
  return paint(512, 256, (u, v) => {
    const swirl = n(u + n(u, v, 3, 2) * 0.15, v, 6, 5, 2.4);
    const t = 0.55 + (swirl - 0.5) * 0.6;
    const c = mix([214, 172, 104], [250, 232, 188], Math.min(1, Math.max(0, t)));
    return [c[0], c[1], c[2], 225];
  });
}

/** Radiales Profil der Saturnringe: C-Ring, B-Ring, Cassini-Teilung, A-Ring mit Encke-Lücke */
export function ringTexture(): HTMLCanvasElement {
  const w = 1024;
  const c = canvas(w, 4);
  const ctx = c.getContext('2d')!;
  const n = makeNoise(61);
  // Radien in Saturnradien: Ring von 1,24 bis 2,27
  const inner = 1.24;
  const outer = 2.27;
  for (let x = 0; x < w; x++) {
    const r = inner + ((outer - inner) * x) / w;
    let a = 0;
    let bright = 0.75;
    if (r < 1.53) {
      a = 0.18 + (r - inner) * 0.4; // C-Ring, dünn
      bright = 0.55;
    } else if (r < 1.95) {
      a = 0.85; // B-Ring, dicht und hell
      bright = 0.95;
    } else if (r < 2.03) {
      a = 0.08; // Cassini-Teilung
    } else if (r < 2.27) {
      a = r > 2.21 && r < 2.215 ? 0.1 : 0.6; // A-Ring mit Encke-Lücke
      bright = 0.82;
    }
    const grain = (n(x / w, 0.5, 220, 3) - 0.5) * 0.3;
    a = Math.max(0, Math.min(1, a + grain * a));
    const b = Math.max(0, Math.min(1, bright + grain * 0.3));
    ctx.fillStyle = `rgba(${Math.round(232 * b)},${Math.round(214 * b)},${Math.round(178 * b)},${a})`;
    ctx.fillRect(x, 0, 1, 4);
  }
  return c;
}

/** Weicher Leuchthof für Sonne und Markierungen */
export function glowTexture(stops: [number, string][]): HTMLCanvasElement {
  const s = 256;
  const c = canvas(s, s);
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  for (const [o, col] of stops) g.addColorStop(o, col);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  return c;
}
