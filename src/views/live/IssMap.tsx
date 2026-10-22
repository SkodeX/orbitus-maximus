import { useEffect, useRef } from 'react';
import * as A from 'astronomy-engine';
import { geoCircle, geoEquirectangular, geoGraticule10, geoOrthographic, geoPath, type GeoPermissibleObjects } from 'd3-geo';
import type { SatRec } from '../../lib/live/sgp4';
import { groundTrack, issState } from '../../lib/live/iss';
import { LAND } from '../../lib/live/land';
import type { Place } from '../../lib/astro';

export type MapMode = 'globe' | 'map';

/** Punkt auf der Erde, über dem die Sonne gerade im Zenit steht */
function subsolarPoint(date: Date): [number, number] {
  const eq = A.Equator(A.Body.Sun, date, new A.Observer(0, 0, 0), true, false);
  let lon = (eq.ra - A.SiderealTime(date)) * 15;
  lon = ((lon + 540) % 360) - 180;
  return [lon, eq.dec];
}

interface Props {
  rec: SatRec;
  place: Place;
  now: Date;
  mode: MapMode;
  sites?: { lat: number; lon: number }[];
}

/** Weltkarte oder Globus mit Tag-Nacht-Grenze, ISS, Bodenspur und eigenem Standort */
export function IssMap({ rec, place, now, mode, sites = [] }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const size = useRef({ w: 0, h: 0, dpr: 1 });

  useEffect(() => {
    const canvas = ref.current!;
    const obs = new ResizeObserver(() => {
      const r = canvas.getBoundingClientRect();
      size.current = { w: r.width, h: r.height, dpr: Math.min(window.devicePixelRatio || 1, 2) };
      canvas.width = Math.round(r.width * size.current.dpr);
      canvas.height = Math.round(r.height * size.current.dpr);
      canvas.dispatchEvent(new Event('redraw'));
    });
    obs.observe(canvas);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const canvas = ref.current!;
    const draw = () => {
      const { w, h, dpr } = size.current;
      if (!w || !h) return;
      const ctx = canvas.getContext('2d')!;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const iss = issState(rec, now);
      if (!iss) return;
      const globe = mode === 'globe';
      const pad = globe ? 14 : 0;
      const projection = globe
        ? geoOrthographic()
            .rotate([-iss.lon, -Math.max(-35, Math.min(35, iss.lat)) * 0.8])
            .fitExtent(
              [
                [pad, pad],
                [w - pad, h - pad],
              ],
              { type: 'Sphere' },
            )
        : geoEquirectangular().fitSize([w, h], { type: 'Sphere' });
      const path = geoPath(projection, ctx);
      const shape = (o: GeoPermissibleObjects) => {
        ctx.beginPath();
        path(o);
      };

      // Ozean und Atmosphärenschein
      if (globe) {
        const [cx, cy] = projection.translate();
        const r = projection.scale();
        const glow = ctx.createRadialGradient(cx, cy, r * 0.96, cx, cy, r * 1.12);
        glow.addColorStop(0, 'rgba(110,150,255,0.35)');
        glow.addColorStop(1, 'rgba(110,150,255,0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, w, h);
        const ocean = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.35, r * 0.1, cx, cy, r);
        ocean.addColorStop(0, '#13204d');
        ocean.addColorStop(1, '#060a1f');
        ctx.fillStyle = ocean;
      } else {
        ctx.fillStyle = '#081029';
      }
      shape({ type: 'Sphere' });
      ctx.fill();

      shape(geoGraticule10());
      ctx.strokeStyle = 'rgba(140,160,230,0.09)';
      ctx.lineWidth = 0.7;
      ctx.stroke();

      shape(LAND);
      ctx.fillStyle = '#1f2b57';
      ctx.fill();
      ctx.strokeStyle = 'rgba(160,180,240,0.28)';
      ctx.lineWidth = 0.6;
      ctx.stroke();

      // Nachtseite in Stufen (Dämmerung bis tiefe Nacht)
      const [slon, slat] = subsolarPoint(now);
      const anti: [number, number] = [slon + 180, -slat];
      for (const radius of [90, 84, 78, 72]) {
        shape(geoCircle().center(anti).radius(radius)());
        ctx.fillStyle = 'rgba(1,2,10,0.2)';
        ctx.fill();
      }

      // Startplätze der nächsten Raketenstarts
      for (const s of sites) {
        const p = projection([s.lon, s.lat]);
        if (!p || (globe && !isFront(projection, s.lon, s.lat))) continue;
        ctx.fillStyle = 'rgba(255,168,107,0.9)';
        ctx.beginPath();
        ctx.moveTo(p[0], p[1] - 5);
        ctx.lineTo(p[0] + 4, p[1] + 3);
        ctx.lineTo(p[0] - 4, p[1] + 3);
        ctx.closePath();
        ctx.fill();
      }

      // Bodenspur: vergangene 45 und kommende 90 Minuten
      const past = groundTrack(rec, new Date(now.getTime() - 45 * 60_000), now, 30);
      const future = groundTrack(rec, now, new Date(now.getTime() + 90 * 60_000), 30);
      shape({ type: 'LineString', coordinates: past });
      ctx.strokeStyle = 'rgba(138,164,255,0.35)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      shape({ type: 'LineString', coordinates: future });
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = 'rgba(200,214,255,0.85)';
      ctx.stroke();
      ctx.setLineDash([]);

      // Sichtbarkeitskreis: hier steht die ISS über dem Horizont
      const footprint = (Math.acos(6371 / (6371 + iss.altKm)) * 180) / Math.PI;
      shape(geoCircle().center([iss.lon, iss.lat]).radius(footprint)());
      ctx.fillStyle = 'rgba(138,164,255,0.07)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(138,164,255,0.45)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Eigener Standort
      const me = projection([place.lon, place.lat]);
      if (me && (!globe || isFront(projection, place.lon, place.lat))) {
        ctx.fillStyle = '#6be3a4';
        ctx.strokeStyle = 'rgba(5,6,15,0.9)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(me[0], me[1], 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.font = '600 11px "Inter Variable", system-ui, sans-serif';
        ctx.fillStyle = '#c9f7df';
        ctx.fillText(place.name, me[0] + 8, me[1] + 4);
      }

      // ISS
      const p = projection([iss.lon, iss.lat]);
      if (p) {
        const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], 22);
        g.addColorStop(0, iss.lit ? 'rgba(255,255,255,0.9)' : 'rgba(170,190,255,0.7)');
        g.addColorStop(1, 'rgba(170,190,255,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p[0], p[1], 22, 0, Math.PI * 2);
        ctx.fill();
        drawStation(ctx, p[0], p[1]);
      }

      if (globe) {
        shape({ type: 'Sphere' });
        ctx.strokeStyle = 'rgba(150,180,255,0.35)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };
    draw();
    canvas.addEventListener('redraw', draw);
    return () => canvas.removeEventListener('redraw', draw);
  }, [rec, place, now, mode, sites]);

  return <canvas ref={ref} className={`iss-map iss-map--${mode}`} aria-hidden="true" />;
}

function isFront(projection: { rotate(): [number, number, number] }, lon: number, lat: number) {
  const [rl, rp] = projection.rotate();
  const r = Math.PI / 180;
  const cLat = -rp * r;
  const cLon = -rl * r;
  const cos = Math.sin(cLat) * Math.sin(lat * r) + Math.cos(cLat) * Math.cos(lat * r) * Math.cos(lon * r - cLon);
  return cos > 0;
}

/** Kleines Stations-Symbol: Modul mit zwei Solarflügeln */
function drawStation(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-2.5, -2.5, 5, 5);
  ctx.fillStyle = '#ffd59a';
  ctx.fillRect(-12, -4, 7, 8);
  ctx.fillRect(5, -4, 7, 8);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-5, 0);
  ctx.lineTo(5, 0);
  ctx.stroke();
  ctx.restore();
}
