// Handy-Lagesensor → Blickrichtung der Rückkamera im Horizontsystem
// Horizontsystem (wie astronomy-engine "HOR"): x = Norden, y = Westen, z = Zenit

export type Vec3 = [number, number, number];
export interface Basis {
  r: Vec3; // Bildschirm rechts
  u: Vec3; // Bildschirm oben
  f: Vec3; // Blickrichtung (aus der Rückseite des Geräts)
}

const DEG = Math.PI / 180;

export const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a: Vec3, b: Vec3): Vec3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export function normalize(v: Vec3): Vec3 {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
}

/** Basis für eine Blickrichtung (Azimut von Nord über Ost, Höhe über dem Horizont) */
export function basisFromView(azDeg: number, altDeg: number): Basis {
  const A = azDeg * DEG;
  const h = altDeg * DEG;
  const f: Vec3 = [Math.cos(h) * Math.cos(A), -Math.cos(h) * Math.sin(A), Math.sin(h)];
  const u: Vec3 = [-Math.sin(h) * Math.cos(A), Math.sin(h) * Math.sin(A), Math.cos(h)];
  return { r: cross(f, u), u, f };
}

/** Basis um die Zenitachse drehen (Azimut um `deg` erhöhen) */
export function rotateAzimuth(b: Basis, deg: number): Basis {
  const c = Math.cos(deg * DEG);
  const s = Math.sin(deg * DEG);
  const rot = (v: Vec3): Vec3 => [v[0] * c + v[1] * s, -v[0] * s + v[1] * c, v[2]];
  return { r: rot(b.r), u: rot(b.u), f: rot(b.f) };
}

/** Rotationsmatrix nach W3C (R = Rz(α)·Rx(β)·Ry(γ)), Gerätekoordinaten → Ost/Nord/Oben */
function basisFromEuler(alpha: number, beta: number, gamma: number, screenAngle: number): Basis {
  const cA = Math.cos(alpha * DEG);
  const sA = Math.sin(alpha * DEG);
  const cB = Math.cos(beta * DEG);
  const sB = Math.sin(beta * DEG);
  const cG = Math.cos(gamma * DEG);
  const sG = Math.sin(gamma * DEG);
  const m11 = cA * cG - sA * sB * sG;
  const m12 = -cB * sA;
  const m13 = cG * sA * sB + cA * sG;
  const m21 = cG * sA + cA * sB * sG;
  const m22 = cA * cB;
  const m23 = sA * sG - cA * cG * sB;
  const m31 = -cB * sG;
  const m32 = sB;
  const m33 = cB * cG;

  const devX: Vec3 = [m11, m21, m31];
  const devY: Vec3 = [m12, m22, m32];
  const back: Vec3 = [-m13, -m23, -m33];
  // Querformat: Bildschirmachsen gegenüber den Geräteachsen drehen
  const c = Math.cos(screenAngle * DEG);
  const s = Math.sin(screenAngle * DEG);
  const right: Vec3 = [devX[0] * c - devY[0] * s, devX[1] * c - devY[1] * s, devX[2] * c - devY[2] * s];
  const up: Vec3 = [devX[0] * s + devY[0] * c, devX[1] * s + devY[1] * c, devX[2] * s + devY[2] * c];
  const toHor = (v: Vec3): Vec3 => [v[1], -v[0], v[2]];
  return { r: toHor(right), u: toHor(up), f: toHor(back) };
}

function blend(a: Basis, b: Basis, k: number): Basis {
  const lerp = (x: Vec3, y: Vec3): Vec3 => [x[0] + (y[0] - x[0]) * k, x[1] + (y[1] - x[1]) * k, x[2] + (y[2] - x[2]) * k];
  const f = normalize(lerp(a.f, b.f));
  let u = lerp(a.u, b.u);
  const d = dot(u, f);
  u = normalize([u[0] - f[0] * d, u[1] - f[1] * d, u[2] - f[2] * d]);
  return { r: cross(f, u), u, f };
}

const angleDiff = (a: number, b: number) => ((a - b + 540) % 360) - 180;

function screenAngle() {
  const legacy = (window as unknown as { orientation?: number }).orientation;
  const a = screen.orientation?.angle ?? legacy ?? 0;
  return ((a % 360) + 360) % 360;
}

export const orientationSupported = () => typeof window !== 'undefined' && 'DeviceOrientationEvent' in window;

/** Auf dem iPhone muss die Freigabe direkt aus einem Tipp heraus angefragt werden */
export async function requestOrientationPermission(): Promise<'granted' | 'denied' | 'unsupported'> {
  if (!orientationSupported()) return 'unsupported';
  const DOE = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<'granted' | 'denied'> };
  if (typeof DOE.requestPermission === 'function') {
    try {
      return await DOE.requestPermission();
    } catch {
      return 'denied';
    }
  }
  return 'granted';
}

/**
 * Startet die Sensorabfrage. iOS liefert ein relatives α plus `webkitCompassHeading`;
 * daraus wird laufend ein geglätteter Kompass-Versatz berechnet, damit Norden stimmt.
 */
export function startOrientation(onBasis: (b: Basis, absolute: boolean) => void): () => void {
  let offset: number | null = null;
  let smooth: Basis | null = null;
  const absoluteEvent = 'ondeviceorientationabsolute' in window;

  const handler = (e: DeviceOrientationEvent) => {
    if (e.alpha == null || e.beta == null || e.gamma == null) return;
    let alpha = e.alpha;
    let absolute = e.absolute || absoluteEvent;
    const heading = (e as DeviceOrientationEvent & { webkitCompassHeading?: number }).webkitCompassHeading;
    if (typeof heading === 'number' && heading >= 0) {
      const target = 360 - heading - alpha;
      offset = offset == null ? target : offset + angleDiff(target, offset) * 0.05;
      alpha += offset;
      absolute = true;
    }
    const b = basisFromEuler(alpha, e.beta, e.gamma, screenAngle());
    smooth = smooth ? blend(smooth, b, 0.35) : b;
    onBasis(smooth, absolute);
  };

  const type = absoluteEvent ? 'deviceorientationabsolute' : 'deviceorientation';
  window.addEventListener(type, handler as EventListener);
  return () => window.removeEventListener(type, handler as EventListener);
}
