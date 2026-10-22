// Kleine Sternkarte eines Himmelsausschnitts (stereografisch, Norden oben, Osten links) –
// für Sternbild-Trainer und Mythen. Unabhängig vom Standort, wie in einem Sternatlas.
import { useEffect, useRef } from 'react';
import skyData from '../../data/sky.json';
import type { SkyData } from '../../sky/engine';

export const sky = skyData as unknown as SkyData;
const DEG = Math.PI / 180;

export interface ChartView {
  ra: number;
  dec: number;
  fov: number;
}

/** Ausschnitt, der ein Sternbild mit etwas Rand zeigt */
export function viewOf(conId: string): ChartView {
  const c = sky.constellations.find((x) => x.id === conId)!;
  let max = 8;
  for (const line of sky.lines[conId] ?? []) for (const [ra, dec] of line) max = Math.max(max, sep(c.ra, c.dec, ra, dec));
  return { ra: c.ra, dec: c.dec, fov: Math.min(100, Math.max(24, max * 2.6)) };
}

export function sep(ra1: number, d1: number, ra2: number, d2: number) {
  const c = Math.sin(d1 * DEG) * Math.sin(d2 * DEG) + Math.cos(d1 * DEG) * Math.cos(d2 * DEG) * Math.cos((ra1 - ra2) * DEG);
  return Math.acos(Math.max(-1, Math.min(1, c))) / DEG;
}

function projector(v: ChartView, W: number, H: number) {
  const scale = Math.min(W, H) / 2 / (2 * Math.tan((v.fov * DEG) / 4));
  const d0 = v.dec * DEG;
  const sd0 = Math.sin(d0);
  const cd0 = Math.cos(d0);
  const project = (ra: number, dec: number) => {
    const d = dec * DEG;
    const dra = (ra - v.ra) * DEG;
    const cosc = sd0 * Math.sin(d) + cd0 * Math.cos(d) * Math.cos(dra);
    if (cosc < -0.3) return null;
    const k = 2 / (1 + cosc);
    const x = k * Math.cos(d) * Math.sin(dra);
    const y = k * (cd0 * Math.sin(d) - sd0 * Math.cos(d) * Math.cos(dra));
    return { x: W / 2 - x * scale, y: H / 2 - y * scale };
  };
  const unproject = (sx: number, sy: number) => {
    const x = (W / 2 - sx) / scale;
    const y = (H / 2 - sy) / scale;
    const rho = Math.hypot(x, y);
    if (rho < 1e-9) return { ra: v.ra, dec: v.dec };
    const c = 2 * Math.atan(rho / 2);
    const dec = Math.asin(Math.cos(c) * sd0 + (y * Math.sin(c) * cd0) / rho) / DEG;
    const ra = v.ra + Math.atan2(x * Math.sin(c), rho * cd0 * Math.cos(c) - y * sd0 * Math.sin(c)) / DEG;
    return { ra: ((ra % 360) + 360) % 360, dec };
  };
  return { project, unproject, scale };
}

export function ConstellationChart({
  view,
  lines = [],
  labels = [],
  magLimit = 5.2,
  onTap,
  marker,
  className = '',
}: {
  view: ChartView;
  /** Sternbilder, deren Linien gezeichnet werden */
  lines?: string[];
  /** Sternbilder, deren Namen erscheinen ([id, Text]) */
  labels?: [string, string][];
  magLimit?: number;
  onTap?: (ra: number, dec: number) => void;
  /** Markierung (z. B. getippte Stelle) */
  marker?: { ra: number; dec: number; ok: boolean } | null;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      const ctx = canvas.getContext('2d')!;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const W = rect.width;
      const H = rect.height;
      const { project } = projector(view, W, H);
      const bg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.7);
      bg.addColorStop(0, '#0d1433');
      bg.addColorStop(1, '#03040b');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Linien
      ctx.strokeStyle = 'rgba(138,164,255,0.7)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      for (const id of lines) {
        for (const line of sky.lines[id] ?? []) {
          let pen = false;
          for (const [ra, dec] of line) {
            const p = project(ra, dec);
            if (!p) {
              pen = false;
              continue;
            }
            if (pen) ctx.lineTo(p.x, p.y);
            else ctx.moveTo(p.x, p.y);
            pen = true;
          }
        }
      }
      ctx.stroke();

      // Sterne
      for (const [ra, dec, mag, bv] of sky.stars) {
        if (mag > magLimit) continue;
        const p = project(ra, dec);
        if (!p || p.x < -5 || p.y < -5 || p.x > W + 5 || p.y > H + 5) continue;
        const r = Math.max(0.6, 3.4 - mag * 0.55);
        ctx.fillStyle = bv > 1 ? '#ffd9b0' : bv < 0 ? '#cfe0ff' : '#ffffff';
        ctx.globalAlpha = Math.min(1, 1.25 - mag / 7);
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Namen
      ctx.font = '600 13px Inter Variable, sans-serif';
      ctx.textAlign = 'center';
      for (const [id, text] of labels) {
        const c = sky.constellations.find((x) => x.id === id);
        const p = c && project(c.ra, c.dec);
        if (!p) continue;
        ctx.fillStyle = 'rgba(255,213,154,0.95)';
        ctx.fillText(text, p.x, p.y);
      }

      if (marker) {
        const p = project(marker.ra, marker.dec);
        if (p) {
          ctx.strokeStyle = marker.ok ? '#6be3a4' : '#ff8a80';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 14, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    };
    draw();
    const obs = new ResizeObserver(draw);
    obs.observe(canvas);
    return () => obs.disconnect();
  }, [view, lines.join(), labels.map((l) => l.join(':')).join(), magLimit, marker]);

  return (
    <canvas
      ref={ref}
      className={`con-chart ${className}`}
      onClick={(e) => {
        if (!onTap) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const { unproject } = projector(view, rect.width, rect.height);
        const p = unproject(e.clientX - rect.left, e.clientY - rect.top);
        onTap(p.ra, p.dec);
      }}
    />
  );
}
