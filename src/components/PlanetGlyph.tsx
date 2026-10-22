import type { CSSProperties } from 'react';
import type { BodyId } from '../lib/astro';

/** Kleine, mit CSS gemalte Planetenkugel; Saturn wird kleiner gemalt, damit die Ringe in die Box passen */
export function PlanetGlyph({ id, size = 40 }: { id: BodyId | 'earth' | 'pluto'; size?: number }) {
  const ringed = id === 'saturn';
  return (
    <span className="planet-box" style={{ width: size, height: size }} aria-hidden="true">
      <span className="planet-art" style={{ '--size': `${ringed ? size * 0.44 : size}px` } as CSSProperties}>
        {ringed && <span className="ring ring--back" />}
        <span className={`sphere p-${id}`} />
        {ringed && <span className="ring ring--front" />}
      </span>
    </span>
  );
}
