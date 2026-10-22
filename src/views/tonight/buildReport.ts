import {
  PLANET_IDS,
  addHours,
  bestFixedAltitude,
  computeNight,
  moonReport,
  observerOf,
  planetReport,
  type Place,
} from '../../lib/astro';
import { showerOutlook } from '../../lib/meteors';
import { SHOWPIECES } from '../../lib/showpieces';

/** Alles, was die Heute-Seite braucht, in einem Durchgang berechnet */
export function buildReport(place: Place, now: Date) {
  const obs = observerOf(place);
  const night = computeNight(place, now);
  const planets = PLANET_IDS.map((id) => planetReport(id, night, obs, now));
  const moon = moonReport(night, obs, now);

  // Lohnende Deep-Sky-Ziele: in der dunklen Zeit mindestens 30° hoch
  const darkFrom = night.darkFrom ?? night.nauticalDusk ?? night.sunset ?? night.from;
  const darkTo = night.darkTo ?? night.nauticalDawn ?? night.sunrise ?? night.to;
  const tips = SHOWPIECES.map((s) => ({ piece: s, best: bestFixedAltitude(s.ra, s.dec, darkFrom, darkTo, obs) }))
    .filter((x) => x.best.alt >= 30)
    .slice(0, 4);

  const showers = showerOutlook(now, 3).map((o) => {
    const from = night.darkFrom ?? night.from;
    const to = night.darkTo ?? night.to;
    return { ...o, radiant: bestFixedAltitude(o.shower.ra, o.shower.dec, from, to, obs) };
  });

  return { night, planets, moon, tips, showers, obs, computedAt: now, nextRefresh: addHours(now, 0.25) };
}

export type TonightReport = ReturnType<typeof buildReport>;
