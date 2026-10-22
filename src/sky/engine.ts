// Canvas-Renderer der Live-Sternkarte.
// Sternkoordinaten liegen als J2000-Einheitsvektoren vor; pro Bild werden sie mit einer Matrix
// (J2000 → Horizont → Kamera) gedreht und stereografisch projiziert.
import * as A from 'astronomy-engine';
import { BODIES, angularDiameterDeg, type BodyId } from '../lib/astro';
import type { MeteorShower } from '../lib/meteors';
import type { SkyLayers } from '../state/settings';
import { basisFromView, rotateAzimuth, type Basis, type Vec3 } from './orientation';

export interface SkyConstellation {
  id: string;
  de: string;
  en: string;
  la: string;
  gen: string;
  rank: number;
  ra: number;
  dec: number;
}
export interface SkyDso {
  id: string;
  ngc: string;
  en: string;
  de: string;
  type: string;
  mag: number;
  dim: string;
  ra: number;
  dec: number;
}
export interface SkyData {
  stars: [number, number, number, number, number][]; // ra, dec, mag, B-V, HIP
  starNames: Record<string, { n: string; c: string; b: string }>; // Eigenname (kann leer sein), Sternbild, Bayer/Flamsteed
  constellations: SkyConstellation[];
  lines: Record<string, [number, number][][]>;
  messier: SkyDso[];
  milkyWay: [number, number, number][];
}

export type SkyObject =
  | { kind: 'body'; id: BodyId }
  | { kind: 'star'; index: number }
  | { kind: 'dso'; index: number }
  | { kind: 'constellation'; index: number }
  | { kind: 'meteor'; id: string }
  | { kind: 'point'; ra: number; dec: number; label: string }
  | { kind: 'iss' };

export interface IssSky {
  az: number;
  alt: number;
  lit: boolean;
}

export interface SkyLabels {
  body: (id: BodyId) => string;
  constellation: (c: SkyConstellation) => string;
  dso: (m: SkyDso) => string;
  meteor: (s: MeteorShower) => string;
  dirs: string[];
}

export interface ViewInfo {
  az: number;
  alt: number;
  fov: number;
}

interface Hit {
  x: number;
  y: number;
  r: number;
  pri: number;
  obj: SkyObject;
}

const DEG = Math.PI / 180;
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
const dotv = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const BODY_ORDER: BodyId[] = ['sun', 'neptune', 'uranus', 'saturn', 'jupiter', 'mars', 'mercury', 'venus', 'moon'];
const BODY_COLOR: Record<BodyId, string> = {
  sun: '#fff1c4',
  moon: '#f4f1e8',
  mercury: '#d6cdc2',
  venus: '#fff3d1',
  mars: '#ff8e63',
  jupiter: '#f5dcb4',
  saturn: '#f1de9f',
  uranus: '#aaf0f2',
  neptune: '#8ea8ff',
};
const FONT = '"Inter Variable", "Inter", system-ui, sans-serif';

function radecVec(raDeg: number, decDeg: number): Vec3 {
  const ra = raDeg * DEG;
  const dec = decDeg * DEG;
  return [Math.cos(dec) * Math.cos(ra), Math.cos(dec) * Math.sin(ra), Math.sin(dec)];
}

const BV_TABLE: [number, [number, number, number]][] = [
  [-0.4, [155, 176, 255]],
  [-0.2, [170, 191, 255]],
  [0.0, [202, 215, 255]],
  [0.3, [248, 247, 255]],
  [0.6, [255, 244, 234]],
  [1.0, [255, 222, 180]],
  [1.4, [255, 204, 140]],
  [2.0, [255, 170, 110]],
];
function bvColor(bv: number) {
  const x = clamp(bv, -0.4, 2.0);
  let i = 0;
  while (i < BV_TABLE.length - 2 && x > BV_TABLE[i + 1][0]) i++;
  const [x0, c0] = BV_TABLE[i];
  const [x1, c1] = BV_TABLE[i + 1];
  const k = (x - x0) / (x1 - x0);
  // etwas zu Weiß hin mischen, damit die Farben edel statt bunt wirken
  const mix = (a: number, b: number) => Math.round((a + (b - a) * k) * 0.8 + 255 * 0.2);
  return `rgb(${mix(c0[0], c1[0])},${mix(c0[1], c1[1])},${mix(c0[2], c1[2])})`;
}

const SKY_STOPS: [number, [number, number, number]][] = [
  [-18, [3, 4, 11]],
  [-12, [6, 10, 30]],
  [-6, [15, 26, 61]],
  [-2, [34, 52, 108]],
  [2, [61, 100, 168]],
  [10, [79, 134, 204]],
];
function skyRgb(sunAlt: number): [number, number, number] {
  if (sunAlt <= SKY_STOPS[0][0]) return SKY_STOPS[0][1];
  for (let i = 0; i < SKY_STOPS.length - 1; i++) {
    const [a, ca] = SKY_STOPS[i];
    const [b, cb] = SKY_STOPS[i + 1];
    if (sunAlt <= b) {
      const k = (sunAlt - a) / (b - a);
      return [ca[0] + (cb[0] - ca[0]) * k, ca[1] + (cb[1] - ca[1]) * k, ca[2] + (cb[2] - ca[2]) * k];
    }
  }
  return SKY_STOPS[SKY_STOPS.length - 1][1];
}

function sprite(size: number, stops: [number, string][]) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  for (const [o, col] of stops) grad.addColorStop(o, col);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

interface BodyState {
  v: Vec3;
  diamDeg: number;
  mag: number;
}

export interface EngineOptions {
  onSelect?: (obj: SkyObject | null) => void;
  onView?: (v: ViewInfo) => void;
}

export class SkyEngine {
  private ctx: CanvasRenderingContext2D;
  private W = 0;
  private H = 0;
  private dpr = 1;
  private raf = 0;
  private resizeObs: ResizeObserver;

  private starVec: Float32Array;
  private starColor: string[];
  private mwVec: Float32Array;
  private mwLevel: Uint8Array;
  private dsoVec: Float32Array;
  private conVec: Float32Array;
  private segs: Float32Array;
  private glow = sprite(64, [
    [0, 'rgba(255,255,255,1)'],
    [0.18, 'rgba(255,255,255,0.35)'],
    [1, 'rgba(255,255,255,0)'],
  ]);
  private mwSprite = sprite(64, [
    [0, 'rgba(196,206,255,1)'],
    [0.5, 'rgba(196,206,255,0.45)'],
    [1, 'rgba(196,206,255,0)'],
  ]);

  private observer = new A.Observer(52.5, 13.4, 0);
  private time = new Date();
  private M = [1, 0, 0, 0, 1, 0, 0, 0, 1];
  private bodies = new Map<BodyId, BodyState>();
  private moonPhase = 0.5;
  private sunAlt = -30;

  private view: ViewInfo = { az: 180, alt: 35, fov: 100 };
  private gyro: Basis | null = null;
  private azOffset = 0;
  private anim: { from: ViewInfo; to: ViewInfo; t0: number; dur: number } | null = null;

  layers: SkyLayers;
  labels: SkyLabels;
  showers: MeteorShower[] = [];
  /** Position der ISS zur aktuellen Kartenzeit (Höhe/Azimut) und Bahn des Überflugs */
  iss: IssSky | null = null;
  issTrack: { az: number; alt: number }[] | null = null;
  selected: SkyObject | null = null;
  private hits: Hit[] = [];

  private pointers = new Map<number, { x: number; y: number }>();
  private drag: { x: number; y: number; az: number; alt: number; offset: number; moved: boolean } | null = null;
  private pinch: { dist: number; fov: number } | null = null;

  constructor(
    private canvas: HTMLCanvasElement,
    private data: SkyData,
    layers: SkyLayers,
    labels: SkyLabels,
    private opts: EngineOptions = {},
  ) {
    this.ctx = canvas.getContext('2d')!;
    this.layers = layers;
    this.labels = labels;

    const n = data.stars.length;
    this.starVec = new Float32Array(n * 3);
    this.starColor = new Array(n);
    data.stars.forEach(([ra, dec, , bv], i) => {
      this.starVec.set(radecVec(ra, dec), i * 3);
      this.starColor[i] = bvColor(bv);
    });
    this.mwVec = new Float32Array(data.milkyWay.length * 3);
    this.mwLevel = new Uint8Array(data.milkyWay.length);
    data.milkyWay.forEach(([ra, dec, level], i) => {
      this.mwVec.set(radecVec(ra, dec), i * 3);
      this.mwLevel[i] = level;
    });
    this.dsoVec = new Float32Array(data.messier.length * 3);
    data.messier.forEach((m, i) => this.dsoVec.set(radecVec(m.ra, m.dec), i * 3));
    this.conVec = new Float32Array(data.constellations.length * 3);
    data.constellations.forEach((c, i) => this.conVec.set(radecVec(c.ra, c.dec), i * 3));
    const segs: number[] = [];
    for (const polylines of Object.values(data.lines)) {
      for (const line of polylines) {
        for (let i = 0; i < line.length - 1; i++) segs.push(...radecVec(...line[i]), ...radecVec(...line[i + 1]));
      }
    }
    this.segs = new Float32Array(segs);

    canvas.addEventListener('pointerdown', this.onDown);
    canvas.addEventListener('pointermove', this.onMove);
    canvas.addEventListener('pointerup', this.onUp);
    canvas.addEventListener('pointercancel', this.onUp);
    canvas.addEventListener('wheel', this.onWheel, { passive: false });
    this.resizeObs = new ResizeObserver(() => this.resize());
    this.resizeObs.observe(canvas);
    this.resize();
    this.updateEphemeris();
    document.fonts?.ready.then(() => this.invalidate());
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.resizeObs.disconnect();
    this.canvas.removeEventListener('pointerdown', this.onDown);
    this.canvas.removeEventListener('pointermove', this.onMove);
    this.canvas.removeEventListener('pointerup', this.onUp);
    this.canvas.removeEventListener('pointercancel', this.onUp);
    this.canvas.removeEventListener('wheel', this.onWheel);
  }

  // ---------------------------------------------------------------- Zustand

  setObserver(lat: number, lon: number, elevation = 0) {
    this.observer = new A.Observer(lat, lon, elevation);
    this.updateEphemeris();
  }

  setTime(t: Date) {
    this.time = t;
    this.updateEphemeris();
  }

  setGyro(b: Basis | null) {
    this.gyro = b;
    if (!b) this.azOffset = 0;
    else this.anim = null;
    this.invalidate();
  }

  zoom(factor: number) {
    this.view.fov = clamp(this.view.fov * factor, 4, 200);
    this.invalidate();
  }

  getView(): ViewInfo {
    const f = this.basis().f;
    return { az: (((Math.atan2(-f[1], f[0]) / DEG) % 360) + 360) % 360, alt: Math.asin(clamp(f[2], -1, 1)) / DEG, fov: this.view.fov };
  }

  invalidate() {
    if (!this.raf) this.raf = requestAnimationFrame(this.frame);
  }

  private updateEphemeris() {
    const rot = A.Rotation_EQJ_HOR(this.time, this.observer);
    const t = A.MakeTime(this.time);
    const cols = [
      A.RotateVector(rot, new A.Vector(1, 0, 0, t)),
      A.RotateVector(rot, new A.Vector(0, 1, 0, t)),
      A.RotateVector(rot, new A.Vector(0, 0, 1, t)),
    ];
    this.M = [cols[0].x, cols[1].x, cols[2].x, cols[0].y, cols[1].y, cols[2].y, cols[0].z, cols[1].z, cols[2].z];

    for (const id of BODY_ORDER) {
      const eq = A.Equator(BODIES[id], t, this.observer, false, true);
      const l = Math.hypot(eq.vec.x, eq.vec.y, eq.vec.z);
      this.bodies.set(id, {
        v: [eq.vec.x / l, eq.vec.y / l, eq.vec.z / l],
        diamDeg: angularDiameterDeg(id, eq.dist),
        mag: id === 'sun' ? -26.7 : A.Illumination(BODIES[id], t).mag,
      });
    }
    this.moonPhase = A.Illumination(A.Body.Moon, t).phase_fraction;
    const sun = this.bodies.get('sun')!.v;
    this.sunAlt = Math.asin(clamp(this.M[6] * sun[0] + this.M[7] * sun[1] + this.M[8] * sun[2], -1, 1)) / DEG;
    this.invalidate();
  }

  /** Horizontkoordinaten (Azimut, Höhe) eines Objekts zur aktuellen Zeit */
  horizontalOf(obj: SkyObject): { az: number; alt: number } | null {
    if (obj.kind === 'iss') return this.iss ? { az: this.iss.az, alt: this.iss.alt } : null;
    const v = this.vectorOf(obj);
    if (!v) return null;
    const M = this.M;
    const x = M[0] * v[0] + M[1] * v[1] + M[2] * v[2];
    const y = M[3] * v[0] + M[4] * v[1] + M[5] * v[2];
    const z = M[6] * v[0] + M[7] * v[1] + M[8] * v[2];
    return { az: (((Math.atan2(-y, x) / DEG) % 360) + 360) % 360, alt: Math.asin(clamp(z, -1, 1)) / DEG };
  }

  private vectorOf(obj: SkyObject): Vec3 | null {
    switch (obj.kind) {
      case 'body':
        return this.bodies.get(obj.id)?.v ?? null;
      case 'star':
        return [this.starVec[obj.index * 3], this.starVec[obj.index * 3 + 1], this.starVec[obj.index * 3 + 2]];
      case 'dso':
        return [this.dsoVec[obj.index * 3], this.dsoVec[obj.index * 3 + 1], this.dsoVec[obj.index * 3 + 2]];
      case 'constellation':
        return [this.conVec[obj.index * 3], this.conVec[obj.index * 3 + 1], this.conVec[obj.index * 3 + 2]];
      case 'meteor': {
        const s = this.showers.find((x) => x.id === obj.id);
        return s ? radecVec(s.ra, s.dec) : null;
      }
      case 'point':
        return radecVec(obj.ra, obj.dec);
      case 'iss':
        return null;
    }
  }

  /** Objekt auswählen und (ohne Lagesensor) sanft dorthin schwenken */
  focus(obj: SkyObject, fov?: number) {
    this.selected = obj;
    const h = this.horizontalOf(obj);
    if (h && !this.gyro) {
      const target = { az: h.az, alt: clamp(h.alt, -30, 89), fov: fov ?? Math.min(this.view.fov, 70) };
      this.anim = { from: { ...this.getView(), fov: this.view.fov }, to: target, t0: performance.now(), dur: 900 };
    }
    this.invalidate();
  }

  select(obj: SkyObject | null) {
    this.selected = obj;
    this.invalidate();
  }

  // ---------------------------------------------------------------- Eingabe

  private resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.W = Math.max(1, rect.width);
    this.H = Math.max(1, rect.height);
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.round(this.W * this.dpr);
    this.canvas.height = Math.round(this.H * this.dpr);
    this.invalidate();
  }

  private scale() {
    return Math.min(this.W, this.H) / 2 / (2 * Math.tan((this.view.fov * DEG) / 4));
  }

  private onDown = (e: PointerEvent) => {
    this.canvas.setPointerCapture(e.pointerId);
    this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    this.anim = null;
    if (this.pointers.size === 1) {
      const v = this.getView();
      this.drag = { x: e.clientX, y: e.clientY, az: v.az, alt: v.alt, offset: this.azOffset, moved: false };
    } else if (this.pointers.size === 2) {
      const [a, b] = [...this.pointers.values()];
      this.pinch = { dist: Math.hypot(a.x - b.x, a.y - b.y), fov: this.view.fov };
      if (this.drag) this.drag.moved = true;
    }
  };

  private onMove = (e: PointerEvent) => {
    if (!this.pointers.has(e.pointerId)) return;
    this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (this.pointers.size >= 2 && this.pinch) {
      const [a, b] = [...this.pointers.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      this.view.fov = clamp((this.pinch.fov * this.pinch.dist) / Math.max(dist, 1), 4, 200);
      this.invalidate();
      return;
    }
    const d = this.drag;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (Math.abs(dx) + Math.abs(dy) > 5) d.moved = true;
    if (!d.moved) return;
    const degPerPx = 1 / this.scale() / DEG;
    if (this.gyro) {
      this.azOffset = d.offset - dx * degPerPx;
    } else {
      this.view.az = d.az - dx * degPerPx;
      this.view.alt = clamp(d.alt + dy * degPerPx, -89.5, 89.5);
    }
    this.invalidate();
  };

  private onUp = (e: PointerEvent) => {
    const d = this.drag;
    const wasTap = d && !d.moved && this.pointers.size === 1;
    this.pointers.delete(e.pointerId);
    if (this.pointers.size < 2) this.pinch = null;
    if (this.pointers.size === 0) this.drag = null;
    if (wasTap && e.type === 'pointerup') {
      const rect = this.canvas.getBoundingClientRect();
      this.pick(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  private onWheel = (e: WheelEvent) => {
    e.preventDefault();
    this.anim = null;
    this.zoom(Math.exp(e.deltaY * 0.0015));
  };

  private pick(x: number, y: number) {
    let best: Hit | null = null;
    let bestScore = Infinity;
    for (const h of this.hits) {
      const d = Math.hypot(h.x - x, h.y - y);
      if (d > Math.max(h.r + 10, 22)) continue;
      const score = d - h.pri * 8;
      if (score < bestScore) {
        bestScore = score;
        best = h;
      }
    }
    this.selected = best?.obj ?? null;
    this.opts.onSelect?.(this.selected);
    this.invalidate();
  }

  // ---------------------------------------------------------------- Zeichnen

  private basis(): Basis {
    if (this.gyro) return this.azOffset ? rotateAzimuth(this.gyro, this.azOffset) : this.gyro;
    return basisFromView(this.view.az, this.view.alt);
  }

  private frame = (now: number) => {
    this.raf = 0;
    if (this.anim) {
      const a = this.anim;
      const k = clamp((now - a.t0) / a.dur, 0, 1);
      const e = 1 - Math.pow(1 - k, 3);
      const dAz = ((a.to.az - a.from.az + 540) % 360) - 180;
      this.view.az = a.from.az + dAz * e;
      this.view.alt = a.from.alt + (a.to.alt - a.from.alt) * e;
      this.view.fov = a.from.fov + (a.to.fov - a.from.fov) * e;
      if (k >= 1) this.anim = null;
    }
    this.render();
    this.opts.onView?.(this.getView());
    if (this.anim) this.invalidate();
  };

  private render() {
    const { ctx, W, H } = this;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    const B = this.basis();
    const M = this.M;
    // Kombinierte Matrix J2000 → Kamera
    const C = new Float64Array(9);
    const rows = [B.r, B.u, B.f];
    for (let k = 0; k < 3; k++)
      for (let j = 0; j < 3; j++) C[k * 3 + j] = rows[k][0] * M[j] + rows[k][1] * M[3 + j] + rows[k][2] * M[6 + j];
    const m6 = M[6];
    const m7 = M[7];
    const m8 = M[8];
    const scale = this.scale();
    const cx0 = W / 2;
    const cy0 = H / 2;
    const fov = this.view.fov;
    const L = this.layers;
    const ground = L.ground;
    const dark = clamp((-this.sunAlt - 4) / 14, 0, 1);
    const hits: Hit[] = [];
    let selPos: { x: number; y: number; r: number } | null = null;
    const sel = this.selected;

    // J2000-Vektor → Bildschirm; liefert null, wenn hinter dem Betrachter oder (bei Boden) unter dem Horizont
    const out = { x: 0, y: 0, k: 1, hz: 0 };
    const project = (x: number, y: number, z: number, margin = 40, allowBelow = !ground) => {
      const hz = m6 * x + m7 * y + m8 * z;
      if (!allowBelow && hz < -0.003) return null;
      const cz = C[6] * x + C[7] * y + C[8] * z;
      if (cz < -0.2) return null;
      const k = 2 / (1 + cz);
      const sx = cx0 + (C[0] * x + C[1] * y + C[2] * z) * k * scale;
      const sy = cy0 - (C[3] * x + C[4] * y + C[5] * z) * k * scale;
      if (sx < -margin || sx > W + margin || sy < -margin || sy > H + margin) return null;
      out.x = sx;
      out.y = sy;
      out.k = k;
      out.hz = hz;
      return out;
    };
    // Horizontvektor → Bildschirm
    const projectHor = (h: Vec3) => {
      const cz = B.f[0] * h[0] + B.f[1] * h[1] + B.f[2] * h[2];
      if (cz < -0.3) return null;
      const k = 2 / (1 + cz);
      return {
        x: cx0 + (B.r[0] * h[0] + B.r[1] * h[1] + B.r[2] * h[2]) * k * scale,
        y: cy0 - (B.u[0] * h[0] + B.u[1] * h[1] + B.u[2] * h[2]) * k * scale,
      };
    };
    const horVec = (azDeg: number, altDeg: number): Vec3 => {
      const a = azDeg * DEG;
      const h = altDeg * DEG;
      return [Math.cos(h) * Math.cos(a), -Math.cos(h) * Math.sin(a), Math.sin(h)];
    };

    // --- Himmel
    const [sr, sg, sb] = skyRgb(this.sunAlt);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.fillStyle = `rgb(${sr | 0},${sg | 0},${sb | 0})`;
    ctx.fillRect(0, 0, W, H);

    const sun = this.bodies.get('sun')!;
    if (this.sunAlt > -16) {
      const p = project(sun.v[0], sun.v[1], sun.v[2], 4000, true);
      if (p) {
        const a = 0.4 * clamp((this.sunAlt + 16) / 16, 0, 1);
        const rad = 70 * DEG * scale;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad);
        g.addColorStop(0, `rgba(255,190,130,${a})`);
        g.addColorStop(1, 'rgba(255,170,110,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }
    }

    // --- Milchstraße
    if (L.milkyWay && dark > 0.05) {
      ctx.globalCompositeOperation = 'lighter';
      const v = this.mwVec;
      const radAng = 2.4 * DEG * scale;
      for (let i = 0; i < this.mwLevel.length; i++) {
        const p = project(v[i * 3], v[i * 3 + 1], v[i * 3 + 2], 60);
        if (!p) continue;
        const r = radAng * p.k;
        ctx.globalAlpha = this.mwLevel[i] * 0.02 * dark;
        ctx.drawImage(this.mwSprite, p.x - r, p.y - r, r * 2, r * 2);
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }

    // --- Koordinatennetz (Höhe/Azimut)
    if (L.grid) {
      ctx.strokeStyle = 'rgba(140,160,220,0.16)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      const poly = (pts: Vec3[]) => {
        let pen = false;
        for (const h of pts) {
          const p = projectHor(h);
          if (!p) {
            pen = false;
            continue;
          }
          if (pen) ctx.lineTo(p.x, p.y);
          else ctx.moveTo(p.x, p.y);
          pen = true;
        }
      };
      for (const alt of [30, 60]) poly(Array.from({ length: 121 }, (_, i) => horVec(i * 3, alt)));
      for (let az = 0; az < 360; az += 30) poly(Array.from({ length: 30 }, (_, i) => horVec(az, i * 3)));
      ctx.stroke();
    }

    // --- Sternbildlinien
    if (L.constellations) {
      ctx.strokeStyle = `rgba(125,150,230,${0.22 + 0.2 * dark})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      const s = this.segs;
      for (let i = 0; i < s.length; i += 6) {
        const a = project(s[i], s[i + 1], s[i + 2], 2000, true);
        if (!a) continue;
        const ax = a.x;
        const ay = a.y;
        const b = project(s[i + 3], s[i + 4], s[i + 5], 2000, true);
        if (!b) continue;
        ctx.moveTo(ax, ay);
        ctx.lineTo(b.x, b.y);
      }
      ctx.stroke();
    }

    ctx.textBaseline = 'middle';

    // --- Sternbildnamen
    if (L.constellationNames) {
      const maxRank = fov > 130 ? 1 : fov > 75 ? 2 : 3;
      ctx.font = `600 10.5px ${FONT}`;
      ctx.textAlign = 'center';
      ctx.fillStyle = `rgba(160,178,235,${0.4 + 0.25 * dark})`;
      this.data.constellations.forEach((c, i) => {
        if (c.rank > maxRank) return;
        const p = project(this.conVec[i * 3], this.conVec[i * 3 + 1], this.conVec[i * 3 + 2], 0);
        if (!p) return;
        const label = this.labels.constellation(c).toUpperCase();
        ctx.fillText(label, p.x, p.y);
        hits.push({ x: p.x, y: p.y, r: 14, pri: 0, obj: { kind: 'constellation', index: i } });
        if (sel?.kind === 'constellation' && sel.index === i) selPos = { x: p.x, y: p.y, r: 16 };
      });
    }

    // --- Deep-Sky (bei Tageslicht nur das ausgewählte Objekt)
    const night = dark > 0.25;
    if (L.deepSky || sel?.kind === 'dso') {
      const magLimit = fov > 120 ? 5 : fov > 60 ? 7.5 : 12;
      ctx.lineWidth = 1.2;
      ctx.textAlign = 'left';
      ctx.font = `500 10.5px ${FONT}`;
      this.data.messier.forEach((m, i) => {
        const isSel = sel?.kind === 'dso' && sel.index === i;
        if (!isSel && (!L.deepSky || !night || m.mag > magLimit)) return;
        const p = project(this.dsoVec[i * 3], this.dsoVec[i * 3 + 1], this.dsoVec[i * 3 + 2], 20);
        if (!p) return;
        const { x, y } = p;
        const galaxy = m.type === 's' || m.type === 'e' || m.type === 'i';
        const nebula = m.type === 'sfr' || m.type === 'rn' || m.type === 'snr' || m.type === 'pn';
        const col = galaxy ? '255,184,140' : nebula ? '255,150,205' : '140,210,255';
        ctx.strokeStyle = `rgba(${col},${0.5 + 0.35 * dark})`;
        ctx.beginPath();
        if (galaxy) ctx.ellipse(x, y, 6, 3, -0.5, 0, Math.PI * 2);
        else if (nebula) ctx.rect(x - 4, y - 4, 8, 8);
        else if (m.type === 'gc') {
          ctx.arc(x, y, 4.5, 0, Math.PI * 2);
          ctx.moveTo(x - 4.5, y);
          ctx.lineTo(x + 4.5, y);
          ctx.moveTo(x, y - 4.5);
          ctx.lineTo(x, y + 4.5);
        } else {
          ctx.setLineDash([2, 2]);
          ctx.arc(x, y, 5, 0, Math.PI * 2);
        }
        ctx.stroke();
        ctx.setLineDash([]);
        if (fov < 100 || m.mag < 5) {
          ctx.fillStyle = `rgba(${col},${0.55 + 0.3 * dark})`;
          ctx.fillText(this.labels.dso(m), x + 9, y);
        }
        hits.push({ x, y, r: 8, pri: 2, obj: { kind: 'dso', index: i } });
        if (sel?.kind === 'dso' && sel.index === i) selPos = { x, y, r: 10 };
      });
    }

    // --- Meteor-Radianten
    if ((L.meteors && night) || sel?.kind === 'meteor') {
      ctx.strokeStyle = 'rgba(255,214,130,0.85)';
      ctx.fillStyle = 'rgba(255,214,130,0.9)';
      ctx.lineWidth = 1.3;
      ctx.font = `600 11px ${FONT}`;
      ctx.textAlign = 'left';
      for (const s of this.showers) {
        if (!(L.meteors && night) && !(sel?.kind === 'meteor' && sel.id === s.id)) continue;
        const v = radecVec(s.ra, s.dec);
        const p = project(v[0], v[1], v[2], 20);
        if (!p) continue;
        const { x, y } = p;
        ctx.beginPath();
        for (let k = 0; k < 8; k++) {
          const a = (k * Math.PI) / 4;
          ctx.moveTo(x + Math.cos(a) * 4, y + Math.sin(a) * 4);
          ctx.lineTo(x + Math.cos(a) * 10, y + Math.sin(a) * 10);
        }
        ctx.stroke();
        ctx.fillText(this.labels.meteor(s), x + 13, y);
        hits.push({ x, y, r: 10, pri: 2, obj: { kind: 'meteor', id: s.id } });
        if (sel?.kind === 'meteor' && sel.id === s.id) selPos = { x, y, r: 12 };
      }
    }

    // --- Sterne
    const limit = (5.0 + clamp((100 - fov) / 40, 0, 1.5)) * dark + 2.6 * (1 - dark);
    const boost = clamp(1 + (60 - fov) / 120, 1, 1.5);
    const dayDim = 0.45 + 0.55 * dark;
    const stars = this.data.stars;
    const sv = this.starVec;
    const nameLimit = fov > 120 ? 1.0 : fov > 70 ? 1.9 : fov > 35 ? 2.9 : 4.5;
    const named: { x: number; y: number; r: number; name: string }[] = [];
    for (let i = 0; i < stars.length; i++) {
      const mag = stars[i][2];
      if (mag > limit) break; // nach Helligkeit sortiert
      const p = project(sv[i * 3], sv[i * 3 + 1], sv[i * 3 + 2], 12);
      if (!p) continue;
      const { x, y } = p;
      const r = clamp(0.55 + (limit - mag) * 0.62, 0.55, 5.2) * boost;
      const a = clamp(0.35 + (limit - mag) * 0.35, 0.25, 1) * dayDim;
      if (mag < 1.6) {
        ctx.globalAlpha = a * 0.55;
        const g = r * 5;
        ctx.drawImage(this.glow, x - g, y - g, g * 2, g * 2);
      }
      ctx.globalAlpha = a;
      ctx.fillStyle = this.starColor[i];
      if (r < 1) ctx.fillRect(x - r, y - r, r * 2, r * 2);
      else {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      const info = this.data.starNames[stars[i][4]];
      hits.push({ x, y, r: r + 2, pri: info?.n ? 1.5 : 1, obj: { kind: 'star', index: i } });
      if (sel?.kind === 'star' && sel.index === i) selPos = { x, y, r: r + 3 };
      if (L.starNames && info?.n && mag <= nameLimit) named.push({ x, y, r, name: info.n });
    }
    ctx.globalAlpha = 1;
    if (named.length) {
      ctx.font = `500 11px ${FONT}`;
      ctx.textAlign = 'left';
      ctx.fillStyle = `rgba(222,228,255,${0.5 + 0.3 * dark})`;
      for (const s of named) ctx.fillText(s.name, s.x + s.r + 5, s.y + 1);
    }

    // --- Sonne, Mond, Planeten
    for (const id of BODY_ORDER) {
      const b = this.bodies.get(id)!;
      const p = project(b.v[0], b.v[1], b.v[2], 60);
      if (!p) continue;
      const { x, y } = p;
      const diamPx = b.diamDeg * DEG * scale * p.k;
      let r: number;
      if (id === 'sun') {
        r = Math.max(9, diamPx / 2);
        const g = ctx.createRadialGradient(x, y, r * 0.6, x, y, r * 6);
        g.addColorStop(0, 'rgba(255,230,170,0.6)');
        g.addColorStop(1, 'rgba(255,200,120,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r * 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = BODY_COLOR.sun;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      } else if (id === 'moon') {
        r = Math.max(8, diamPx / 2);
        ctx.globalAlpha = 0.35 * Math.max(dark, 0.3);
        ctx.drawImage(this.glow, x - r * 5, y - r * 5, r * 10, r * 10);
        ctx.globalAlpha = 1;
        this.drawMoon(x, y, r, b.v, sun.v, project);
      } else {
        r = Math.max(clamp(3.4 - 0.42 * b.mag, 2.2, 6) * boost, diamPx / 2);
        ctx.globalAlpha = 0.6;
        ctx.drawImage(this.glow, x - r * 4, y - r * 4, r * 8, r * 8);
        ctx.globalAlpha = 1;
        ctx.fillStyle = BODY_COLOR[id];
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        if (id === 'saturn') {
          ctx.strokeStyle = 'rgba(241,222,159,0.8)';
          ctx.lineWidth = Math.max(1, r * 0.3);
          ctx.beginPath();
          ctx.ellipse(x, y, r * 2.1, r * 0.75, -0.35, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      ctx.font = `600 12px ${FONT}`;
      ctx.textAlign = 'left';
      ctx.fillStyle = BODY_COLOR[id];
      ctx.fillText(this.labels.body(id), x + r + 6, y + 1);
      hits.push({ x, y, r: r + 4, pri: 4, obj: { kind: 'body', id } });
      if (sel?.kind === 'body' && sel.id === id) selPos = { x, y, r: r + 3 };
    }

    // --- ISS: Bahn des aktuellen bzw. gewählten Überflugs und die Station selbst
    if (this.issTrack && this.issTrack.length > 1) {
      ctx.strokeStyle = 'rgba(200,214,255,0.55)';
      ctx.lineWidth = 1.4;
      ctx.setLineDash([4, 5]);
      ctx.beginPath();
      let pen = false;
      for (const s of this.issTrack) {
        const p = s.alt < -1 && ground ? null : projectHor(horVec(s.az, s.alt));
        if (!p) {
          pen = false;
          continue;
        }
        if (pen) ctx.lineTo(p.x, p.y);
        else ctx.moveTo(p.x, p.y);
        pen = true;
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }
    if (this.iss && (this.iss.alt > 0 || !ground)) {
      const p = projectHor(horVec(this.iss.az, this.iss.alt));
      if (p && p.x > -20 && p.x < W + 20 && p.y > -20 && p.y < H + 20) {
        const lit = this.iss.lit;
        ctx.globalAlpha = lit ? 0.9 : 0.4;
        ctx.drawImage(this.glow, p.x - 18, p.y - 18, 36, 36);
        ctx.globalAlpha = 1;
        ctx.fillStyle = lit ? '#ffffff' : 'rgba(170,185,230,0.8)';
        ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
        ctx.fillStyle = lit ? '#ffd59a' : 'rgba(170,185,230,0.6)';
        ctx.fillRect(p.x - 9, p.y - 3, 5, 6);
        ctx.fillRect(p.x + 4, p.y - 3, 5, 6);
        ctx.font = `700 12px ${FONT}`;
        ctx.textAlign = 'left';
        ctx.fillStyle = '#dfe6ff';
        ctx.fillText('ISS', p.x + 13, p.y + 1);
        hits.push({ x: p.x, y: p.y, r: 12, pri: 5, obj: { kind: 'iss' } });
        if (sel?.kind === 'iss') selPos = { x: p.x, y: p.y, r: 9 };
      }
    }

    // --- Ad-hoc-Ziel (z. B. Doppelsternhaufen aus dem Planer)
    if (sel?.kind === 'point') {
      const v = radecVec(sel.ra, sel.dec);
      const p = project(v[0], v[1], v[2], 0);
      if (p) {
        ctx.font = `600 11px ${FONT}`;
        ctx.textAlign = 'left';
        ctx.fillStyle = 'rgba(140,210,255,0.95)';
        ctx.fillText(sel.label, p.x + 14, p.y);
        selPos = { x: p.x, y: p.y, r: 9 };
      }
    }

    // --- Boden und Horizont
    this.drawGround(B, scale, ground, dark);
    const dirs = this.labels.dirs;
    ctx.textAlign = 'center';
    for (let i = 0; i < 8; i++) {
      const p = projectHor(horVec(i * 45, -2.2));
      if (!p || p.x < -20 || p.x > W + 20 || p.y < -20 || p.y > H + 20) continue;
      const main = i % 2 === 0;
      ctx.font = `${main ? 700 : 600} ${main ? 14 : 11}px ${FONT}`;
      ctx.fillStyle = i === 0 ? '#ff8f80' : main ? 'rgba(225,232,255,0.92)' : 'rgba(170,182,225,0.75)';
      ctx.fillText(dirs[i], p.x, p.y + 6);
    }

    // --- Auswahl
    if (sel) {
      if (selPos) {
        const { x, y, r } = selPos as { x: number; y: number; r: number };
        ctx.strokeStyle = 'rgba(138,164,255,0.95)';
        ctx.lineWidth = 1.6;
        const R = r + 7;
        const gap = 0.45;
        ctx.beginPath();
        for (let q = 0; q < 4; q++) {
          const a0 = (q * Math.PI) / 2 + gap;
          ctx.moveTo(x + Math.cos(a0) * R, y + Math.sin(a0) * R);
          ctx.arc(x, y, R, a0, a0 + Math.PI / 2 - gap * 2);
        }
        ctx.stroke();
      } else if (sel.kind === 'iss') {
        if (this.iss) {
          const h = horVec(this.iss.az, this.iss.alt);
          this.drawOffscreenArrow(dotv(B.r, h), dotv(B.u, h));
        }
      } else {
        const v = this.vectorOf(sel);
        if (v) this.drawOffscreenArrow(C[0] * v[0] + C[1] * v[1] + C[2] * v[2], C[3] * v[0] + C[4] * v[1] + C[5] * v[2]);
      }
    }

    this.hits = hits;
  }

  private drawMoon(
    x: number,
    y: number,
    r: number,
    moon: Vec3,
    sun: Vec3,
    project: (x: number, y: number, z: number, margin?: number, allowBelow?: boolean) => { x: number; y: number } | null,
  ) {
    const ctx = this.ctx;
    // Richtung zur Sonne auf dem Bildschirm: kleiner Schritt vom Mond in Richtung Sonne
    const d = moon[0] * sun[0] + moon[1] * sun[1] + moon[2] * sun[2];
    const t: Vec3 = [sun[0] - moon[0] * d, sun[1] - moon[1] * d, sun[2] - moon[2] * d];
    const tl = Math.hypot(t[0], t[1], t[2]) || 1;
    const q = project(moon[0] + (t[0] / tl) * 0.01, moon[1] + (t[1] / tl) * 0.01, moon[2] + (t[2] / tl) * 0.01, 5000, true);
    const angle = q ? Math.atan2(q.y - y, q.x - x) : 0;
    const k = this.moonPhase;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = 'rgba(38,40,54,0.95)';
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = BODY_COLOR.moon;
    ctx.beginPath();
    ctx.arc(0, 0, r, -Math.PI / 2, Math.PI / 2);
    ctx.ellipse(0, 0, r * Math.abs(1 - 2 * k), r, 0, Math.PI / 2, -Math.PI / 2, k < 0.5);
    ctx.fill();
    ctx.restore();
  }

  private drawGround(B: Basis, scale: number, fill: boolean, dark: number) {
    const { ctx, W, H } = this;
    const px = B.r[2];
    const py = B.u[2];
    const pz = B.f[2];
    const cx0 = W / 2;
    const cy0 = H / 2;
    const glowCol = this.sunAlt > -12 ? '255,160,110' : '90,110,190';
    const glowA = this.sunAlt > -12 ? 0.22 : 0.12;

    const path = new Path2D();
    let groundPath: Path2D | null = null;
    if (Math.abs(pz) > 1e-4 && 2 / Math.abs(pz) * scale < 1e6) {
      // Der Horizont ist in der stereografischen Projektion ein Kreis
      const cx = cx0 + ((2 * px) / pz) * scale;
      const cy = cy0 - ((2 * py) / pz) * scale;
      const R = (2 / Math.abs(pz)) * scale;
      path.arc(cx, cy, R, 0, Math.PI * 2);
      groundPath = new Path2D();
      if (pz > 0) groundPath.rect(-10, -10, W + 20, H + 20);
      groundPath.arc(cx, cy, R, 0, Math.PI * 2);
    } else {
      // Blick genau auf den Horizont: Gerade durch die Mitte
      const len = Math.hypot(px, py) || 1;
      const dx = -py / len;
      const dy = px / len;
      const big = (W + H) * 4;
      const ax = cx0 + dx * big;
      const ay = cy0 - dy * big;
      const bx = cx0 - dx * big;
      const by = cy0 + dy * big;
      path.moveTo(ax, ay);
      path.lineTo(bx, by);
      const nx = -px / len;
      const ny = -py / len;
      groundPath = new Path2D();
      groundPath.moveTo(ax, ay);
      groundPath.lineTo(bx, by);
      groundPath.lineTo(bx + nx * big, by - ny * big);
      groundPath.lineTo(ax + nx * big, ay - ny * big);
      groundPath.closePath();
    }

    ctx.strokeStyle = `rgba(${glowCol},${glowA * 0.5})`;
    ctx.lineWidth = 34;
    ctx.stroke(path);
    ctx.strokeStyle = `rgba(${glowCol},${glowA})`;
    ctx.lineWidth = 12;
    ctx.stroke(path);

    if (fill && groundPath) {
      const day = 1 - dark;
      ctx.fillStyle = `rgba(${Math.round(6 + 16 * day)},${Math.round(8 + 22 * day)},${Math.round(15 + 14 * day)},0.96)`;
      ctx.fill(groundPath, 'evenodd');
    }
    ctx.strokeStyle = 'rgba(150,170,230,0.55)';
    ctx.lineWidth = 1.2;
    ctx.stroke(path);
  }

  /** Pfeil am Bildrand in Richtung eines Objekts außerhalb des Sichtfelds (x/y in Kamerakoordinaten) */
  private drawOffscreenArrow(x: number, y: number) {
    const { ctx, W, H } = this;
    const ang = Math.atan2(-y, x);
    const cx = W / 2;
    const cy = H / 2;
    const rx = W / 2 - 34;
    const ry = H / 2 - 110;
    const t = Math.min(Math.abs(rx / (Math.cos(ang) || 1e-6)), Math.abs(ry / (Math.sin(ang) || 1e-6)));
    const ax = cx + Math.cos(ang) * t;
    const ay = cy + Math.sin(ang) * t;
    ctx.save();
    ctx.translate(ax, ay);
    ctx.rotate(ang);
    ctx.fillStyle = 'rgba(138,164,255,0.95)';
    ctx.beginPath();
    ctx.moveTo(14, 0);
    ctx.lineTo(-8, -10);
    ctx.lineTo(-3, 0);
    ctx.lineTo(-8, 10);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}
