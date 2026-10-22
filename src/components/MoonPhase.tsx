/**
 * Mondphase als SVG. `illum` = beleuchteter Anteil (0–1); zunehmend ist rechts beleuchtet
 * (Nordhalbkugel), auf der Südhalbkugel gespiegelt.
 */
export function MoonPhase({ illum, waxing, size = 96, south = false }: { illum: number; waxing: boolean; size?: number; south?: boolean }) {
  const r = 48;
  const rx = Math.abs(1 - 2 * illum) * r;
  const sweep = illum < 0.5 ? 0 : 1;
  const lit = `M 0 ${-r} A ${r} ${r} 0 0 1 0 ${r} A ${rx} ${r} 0 0 ${sweep} 0 ${-r} Z`;
  const flip = waxing !== !south ? 'scale(-1,1)' : undefined;
  return (
    <svg className="moon-phase" width={size} height={size} viewBox="-55 -55 110 110" aria-hidden="true">
      <defs>
        <radialGradient id="moon-lit" cx="40%" cy="35%" r="75%">
          <stop offset="0" stopColor="#fbf8ef" />
          <stop offset="0.7" stopColor="#e4dfd2" />
          <stop offset="1" stopColor="#b9b3a4" />
        </radialGradient>
        <radialGradient id="moon-glow" r="50%">
          <stop offset="0.8" stopColor="rgba(240,235,220,0.18)" />
          <stop offset="1" stopColor="rgba(240,235,220,0)" />
        </radialGradient>
      </defs>
      <circle r="55" fill="url(#moon-glow)" />
      <circle r={r} fill="#1d1f2c" />
      <g transform={flip}>
        <path d={lit} fill="url(#moon-lit)" />
      </g>
      <g fill="rgba(120,112,98,0.28)">
        <circle cx="-14" cy="-12" r="9" />
        <circle cx="12" cy="-20" r="6" />
        <circle cx="6" cy="10" r="11" />
        <circle cx="-20" cy="18" r="5" />
        <circle cx="24" cy="16" r="4" />
      </g>
      <circle r={r} fill="none" stroke="rgba(255,255,255,0.08)" />
    </svg>
  );
}
