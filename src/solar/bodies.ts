// Himmelskörper des 3D-Sonnensystems: Kennwerte, Ausrichtung der Rotationsachse und Steckbrief-Texte.
// Werte nach NASA-Faktenblättern bzw. IAU (Polrichtungen, gerundet).
import type { Lang } from '../state/settings';

export type SolarId =
  | 'sun'
  | 'mercury'
  | 'venus'
  | 'earth'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune'
  | 'pluto'
  | 'moon'
  | 'io'
  | 'europa'
  | 'ganymede'
  | 'callisto'
  | 'titan'
  | 'charon';

export type Texture =
  | { kind: 'image'; file: string }
  | { kind: 'procedural'; style: 'sun' | 'moon' | 'mercury' | 'uranus' | 'ganymede' | 'callisto' | 'charon' };

export interface BodyDef {
  id: SolarId;
  type: 'star' | 'planet' | 'dwarf' | 'moon';
  parent?: SolarId;
  radiusKm: number;
  color: string;
  texture: Texture;
  /** Siderische Rotationsdauer in Stunden (negativ = rückläufig) */
  rotationH: number;
  /** Nordpol der Rotationsachse (J2000, Grad) */
  poleRa: number;
  poleDec: number;
  /** Für Monde: große Halbachse in km und Umlaufzeit in Tagen */
  orbitKm?: number;
  periodD?: number;
  atmosphere?: string;
  clouds?: 'earth' | 'venus';
  rings?: boolean;
  /** Steckbrief */
  facts?: {
    distanceAu?: number;
    yearD?: number;
    dayLabel: { de: string; en: string };
    moons?: string;
    tempC: string;
    gravity: number;
  };
  text: Record<Lang, { tagline: string; about: string; fact: string }>;
}

const IMG = (file: string): Texture => ({ kind: 'image', file });
const GEN = (style: Extract<Texture, { kind: 'procedural' }>['style']): Texture => ({ kind: 'procedural', style });

export const BODIES: BodyDef[] = [
  {
    id: 'sun',
    type: 'star',
    radiusKm: 695_700,
    color: '#ffb347',
    texture: GEN('sun'),
    rotationH: 609.12,
    poleRa: 286.13,
    poleDec: 63.87,
    facts: { dayLabel: { de: '25,4 Tage (am Äquator)', en: '25.4 days (at the equator)' }, tempC: '5.500 °C', gravity: 274 },
    text: {
      de: {
        tagline: 'Unser Stern',
        about: 'Eine Kugel aus heißem Gas, die 99,8 % der Masse des Sonnensystems enthält. In ihrem Kern verschmelzen jede Sekunde rund 600 Millionen Tonnen Wasserstoff zu Helium.',
        fact: 'Licht von der Oberfläche der Sonne braucht gut 8 Minuten bis zur Erde – aber im Inneren kann ein Lichtteilchen Zehntausende Jahre brauchen, bis es die Oberfläche erreicht.',
      },
      en: {
        tagline: 'Our star',
        about: 'A ball of hot gas holding 99.8 % of the solar system’s mass. In its core, about 600 million tonnes of hydrogen fuse into helium every second.',
        fact: 'Sunlight reaches Earth in just over 8 minutes – yet deep inside, energy can take tens of thousands of years to make its way to the surface.',
      },
    },
  },
  {
    id: 'mercury',
    type: 'planet',
    radiusKm: 2_439.7,
    color: '#b5aea6',
    texture: GEN('mercury'),
    rotationH: 1_407.6,
    poleRa: 281.01,
    poleDec: 61.42,
    facts: { distanceAu: 0.387, yearD: 88, dayLabel: { de: '176 Erdtage', en: '176 Earth days' }, moons: '0', tempC: '−180 bis 430 °C', gravity: 3.7 },
    text: {
      de: {
        tagline: 'Der flinke Bote',
        about: 'Der kleinste Planet und der sonnennächste. Ohne nennenswerte Atmosphäre wechseln sich glühend heiße Tage und eiskalte Nächte ab.',
        fact: 'Von einem Sonnenaufgang zum nächsten vergehen auf Merkur 176 Erdtage – doppelt so lang wie sein Jahr.',
      },
      en: {
        tagline: 'The swift messenger',
        about: 'The smallest planet and the closest to the Sun. With almost no atmosphere, scorching days alternate with freezing nights.',
        fact: 'From one sunrise to the next takes 176 Earth days on Mercury – twice as long as its year.',
      },
    },
  },
  {
    id: 'venus',
    type: 'planet',
    radiusKm: 6_051.8,
    color: '#e8c38a',
    texture: IMG('venus.jpg'),
    rotationH: -5_832.5,
    poleRa: 272.76,
    poleDec: 67.16,
    atmosphere: '#ffd9a0',
    clouds: 'venus',
    facts: { distanceAu: 0.723, yearD: 224.7, dayLabel: { de: '117 Erdtage', en: '117 Earth days' }, moons: '0', tempC: '464 °C', gravity: 8.9 },
    text: {
      de: {
        tagline: 'Die verhüllte Schwester',
        about: 'Fast so groß wie die Erde, aber unter dichten Wolken aus Schwefelsäure verborgen. Der Treibhauseffekt macht sie zum heißesten Planeten. Die Oberfläche zeigt eine Radarkarte der Sonde Magellan.',
        fact: 'Venus dreht sich rückwärts: Dort geht die Sonne im Westen auf und im Osten unter.',
      },
      en: {
        tagline: 'The veiled sister',
        about: 'Almost as big as Earth but hidden beneath thick clouds of sulphuric acid. Its runaway greenhouse effect makes it the hottest planet. The surface shows a radar map from the Magellan probe.',
        fact: 'Venus spins backwards: there the Sun rises in the west and sets in the east.',
      },
    },
  },
  {
    id: 'earth',
    type: 'planet',
    radiusKm: 6_371,
    color: '#5b9bff',
    texture: IMG('earth.jpg'),
    rotationH: 23.934,
    poleRa: 0,
    poleDec: 90,
    atmosphere: '#7fb4ff',
    clouds: 'earth',
    facts: { distanceAu: 1, yearD: 365.25, dayLabel: { de: '24 Stunden', en: '24 hours' }, moons: '1', tempC: '15 °C', gravity: 9.8 },
    text: {
      de: {
        tagline: 'Unser Zuhause',
        about: 'Der einzige bekannte Ort mit Leben. Flüssiges Wasser bedeckt rund 71 % der Oberfläche, eine dünne Atmosphäre schützt vor Strahlung.',
        fact: 'Die Erde ist der dichteste Planet im Sonnensystem – und der einzige, der nicht nach einer Gottheit benannt ist.',
      },
      en: {
        tagline: 'Our home',
        about: 'The only place known to host life. Liquid water covers about 71 % of the surface, and a thin atmosphere shields it from radiation.',
        fact: 'Earth is the densest planet in the solar system – and the only one not named after a deity.',
      },
    },
  },
  {
    id: 'mars',
    type: 'planet',
    radiusKm: 3_389.5,
    color: '#e0703c',
    texture: IMG('mars.jpg'),
    rotationH: 24.623,
    poleRa: 317.68,
    poleDec: 52.89,
    atmosphere: '#ffb08a',
    facts: { distanceAu: 1.524, yearD: 687, dayLabel: { de: '24 Std 40 Min', en: '24 h 40 min' }, moons: '2', tempC: '−65 °C', gravity: 3.7 },
    text: {
      de: {
        tagline: 'Der Rote Planet',
        about: 'Eine kalte Staubwüste mit dem größten Vulkan und einem der tiefsten Canyons im Sonnensystem. Ausgetrocknete Flussbetten zeigen: Hier floss einmal Wasser.',
        fact: 'Der Vulkan Olympus Mons ist etwa zweieinhalbmal so hoch wie der Mount Everest.',
      },
      en: {
        tagline: 'The Red Planet',
        about: 'A cold, dusty desert with the largest volcano and one of the deepest canyons in the solar system. Dry riverbeds show that water once flowed here.',
        fact: 'The volcano Olympus Mons stands about two and a half times as tall as Mount Everest.',
      },
    },
  },
  {
    id: 'jupiter',
    type: 'planet',
    radiusKm: 69_911,
    color: '#e3c49b',
    texture: IMG('jupiter.jpg'),
    rotationH: 9.925,
    poleRa: 268.06,
    poleDec: 64.5,
    facts: { distanceAu: 5.203, yearD: 4_331, dayLabel: { de: '9 Std 56 Min', en: '9 h 56 min' }, moons: '95+', tempC: '−110 °C', gravity: 24.8 },
    text: {
      de: {
        tagline: 'Der Riese',
        about: 'Mehr als doppelt so schwer wie alle anderen Planeten zusammen. Die Streifen sind Wolkenbänder, der Große Rote Fleck ist ein Sturm, größer als die Erde.',
        fact: 'Seine vier großen Monde Io, Europa, Ganymed und Kallisto entdeckte Galileo Galilei 1610 – schon ein Fernglas zeigt sie dir.',
      },
      en: {
        tagline: 'The giant',
        about: 'More than twice as massive as all the other planets combined. Its stripes are cloud bands, and the Great Red Spot is a storm wider than Earth.',
        fact: 'Galileo discovered its four big moons Io, Europa, Ganymede and Callisto in 1610 – even binoculars show them.',
      },
    },
  },
  {
    id: 'saturn',
    type: 'planet',
    radiusKm: 58_232,
    color: '#e8d29a',
    texture: IMG('saturn.jpg'),
    rotationH: 10.656,
    poleRa: 40.59,
    poleDec: 83.54,
    rings: true,
    facts: { distanceAu: 9.537, yearD: 10_759, dayLabel: { de: '10 Std 39 Min', en: '10 h 39 min' }, moons: '274+', tempC: '−140 °C', gravity: 10.4 },
    text: {
      de: {
        tagline: 'Der Herr der Ringe',
        about: 'Ein Gasriese mit prächtigen Ringen aus Milliarden Eis- und Gesteinsbrocken – von Staubkorn- bis Hausgröße. Die Ringe sind riesig, aber oft nur zehn Meter dick.',
        fact: 'Saturn hat eine geringere Dichte als Wasser – in einer riesigen Badewanne würde er schwimmen.',
      },
      en: {
        tagline: 'Lord of the rings',
        about: 'A gas giant with magnificent rings made of billions of chunks of ice and rock, from dust grains to the size of houses. The rings are vast but often only ten metres thick.',
        fact: 'Saturn is less dense than water – in a big enough bathtub, it would float.',
      },
    },
  },
  {
    id: 'uranus',
    type: 'planet',
    radiusKm: 25_362,
    color: '#9fe3e8',
    texture: GEN('uranus'),
    rotationH: -17.24,
    poleRa: 257.31,
    poleDec: -15.18,
    atmosphere: '#bff3f5',
    facts: { distanceAu: 19.19, yearD: 30_687, dayLabel: { de: '17 Std 14 Min', en: '17 h 14 min' }, moons: '28+', tempC: '−195 °C', gravity: 8.7 },
    text: {
      de: {
        tagline: 'Der gekippte Eisriese',
        about: 'Uranus rollt auf der Seite liegend um die Sonne. Methan in seiner Atmosphäre schluckt rotes Licht und färbt ihn blaugrün.',
        fact: 'Jeder Pol bekommt rund 42 Jahre lang durchgehend Sonnenlicht – und danach 42 Jahre Dunkelheit.',
      },
      en: {
        tagline: 'The tilted ice giant',
        about: 'Uranus rolls around the Sun on its side. Methane in its atmosphere absorbs red light and turns it blue-green.',
        fact: 'Each pole gets about 42 years of continuous sunlight – followed by 42 years of darkness.',
      },
    },
  },
  {
    id: 'neptune',
    type: 'planet',
    radiusKm: 24_622,
    color: '#5f86ff',
    texture: IMG('neptune.jpg'),
    rotationH: 16.11,
    poleRa: 299.36,
    poleDec: 43.46,
    atmosphere: '#8eaaff',
    facts: { distanceAu: 30.07, yearD: 60_190, dayLabel: { de: '16 Std 7 Min', en: '16 h 7 min' }, moons: '16', tempC: '−200 °C', gravity: 11.2 },
    text: {
      de: {
        tagline: 'Der stürmische Außenposten',
        about: 'Der äußerste Planet: dunkel, kalt und von Überschallwinden gepeitscht. Er wurde 1846 zuerst berechnet und erst dann im Teleskop gefunden.',
        fact: 'Auf Neptun wehen die schnellsten Winde im Sonnensystem – über 2.000 km/h.',
      },
      en: {
        tagline: 'The stormy outpost',
        about: 'The outermost planet: dark, cold and whipped by supersonic winds. In 1846 it was first predicted by calculation and only then found in a telescope.',
        fact: 'Neptune has the fastest winds in the solar system – over 2,000 km/h.',
      },
    },
  },
  {
    id: 'pluto',
    type: 'dwarf',
    radiusKm: 1_188.3,
    color: '#d9c3a6',
    texture: IMG('pluto.jpg'),
    rotationH: -153.29,
    poleRa: 132.99,
    poleDec: -6.16,
    facts: { distanceAu: 39.48, yearD: 90_560, dayLabel: { de: '6,4 Erdtage', en: '6.4 Earth days' }, moons: '5', tempC: '−230 °C', gravity: 0.62 },
    text: {
      de: {
        tagline: 'Der Zwergplanet',
        about: 'Bis 2006 der neunte Planet, heute ein Zwergplanet im Kuipergürtel. Die Sonde New Horizons zeigte 2015 eine herzförmige Ebene aus Stickstoffeis.',
        fact: 'Pluto braucht 248 Jahre für eine Runde um die Sonne – seit seiner Entdeckung 1930 hat er noch keine einzige vollendet.',
      },
      en: {
        tagline: 'The dwarf planet',
        about: 'The ninth planet until 2006, now a dwarf planet in the Kuiper Belt. In 2015 the New Horizons probe revealed a heart-shaped plain of nitrogen ice.',
        fact: 'Pluto takes 248 years to orbit the Sun – it hasn’t completed a single lap since its discovery in 1930.',
      },
    },
  },
  {
    id: 'moon',
    type: 'moon',
    parent: 'earth',
    radiusKm: 1_737.4,
    color: '#cfcac0',
    texture: GEN('moon'),
    rotationH: 655.7,
    poleRa: 270,
    poleDec: 66.54,
    orbitKm: 384_400,
    periodD: 27.32,
    text: {
      de: { tagline: 'Unser Mond', about: 'Er zeigt uns immer dieselbe Seite und entfernt sich jedes Jahr um knapp 4 cm von der Erde.', fact: '' },
      en: { tagline: 'Our Moon', about: 'It always shows us the same face and drifts almost 4 cm farther from Earth every year.', fact: '' },
    },
  },
  {
    id: 'io',
    type: 'moon',
    parent: 'jupiter',
    radiusKm: 1_821.6,
    color: '#e6d27a',
    texture: IMG('io.jpg'),
    rotationH: 42.46,
    poleRa: 268.05,
    poleDec: 64.5,
    orbitKm: 421_700,
    periodD: 1.769,
    text: {
      de: { tagline: 'Jupitermond', about: 'Der vulkanisch aktivste Ort im Sonnensystem – über 400 aktive Vulkane.', fact: '' },
      en: { tagline: 'Moon of Jupiter', about: 'The most volcanically active place in the solar system – over 400 active volcanoes.', fact: '' },
    },
  },
  {
    id: 'europa',
    type: 'moon',
    parent: 'jupiter',
    radiusKm: 1_560.8,
    color: '#d8cfc0',
    texture: IMG('europa.jpg'),
    rotationH: 85.23,
    poleRa: 268.08,
    poleDec: 64.51,
    orbitKm: 671_100,
    periodD: 3.551,
    text: {
      de: { tagline: 'Jupitermond', about: 'Unter seiner Eiskruste liegt ein Ozean mit mehr Wasser als alle Meere der Erde zusammen.', fact: '' },
      en: { tagline: 'Moon of Jupiter', about: 'Beneath its icy crust lies an ocean holding more water than all of Earth’s seas combined.', fact: '' },
    },
  },
  {
    id: 'ganymede',
    type: 'moon',
    parent: 'jupiter',
    radiusKm: 2_634.1,
    color: '#a99c8c',
    texture: GEN('ganymede'),
    rotationH: 171.7,
    poleRa: 268.2,
    poleDec: 64.57,
    orbitKm: 1_070_400,
    periodD: 7.155,
    text: {
      de: { tagline: 'Jupitermond', about: 'Der größte Mond im Sonnensystem – größer als der Planet Merkur.', fact: '' },
      en: { tagline: 'Moon of Jupiter', about: 'The largest moon in the solar system – bigger than the planet Mercury.', fact: '' },
    },
  },
  {
    id: 'callisto',
    type: 'moon',
    parent: 'jupiter',
    radiusKm: 2_410.3,
    color: '#7d7468',
    texture: GEN('callisto'),
    rotationH: 400.5,
    poleRa: 268.72,
    poleDec: 64.83,
    orbitKm: 1_882_700,
    periodD: 16.689,
    text: {
      de: { tagline: 'Jupitermond', about: 'Die am dichtesten verkraterte Oberfläche im ganzen Sonnensystem.', fact: '' },
      en: { tagline: 'Moon of Jupiter', about: 'The most heavily cratered surface in the whole solar system.', fact: '' },
    },
  },
  {
    id: 'titan',
    type: 'moon',
    parent: 'saturn',
    radiusKm: 2_574.7,
    color: '#e0a24a',
    texture: IMG('titan.jpg'),
    rotationH: 382.7,
    poleRa: 39.48,
    poleDec: 83.43,
    orbitKm: 1_221_870,
    periodD: 15.945,
    atmosphere: '#ffb45a',
    text: {
      de: { tagline: 'Saturnmond', about: 'Der einzige Mond mit dichter Atmosphäre – mit Seen aus flüssigem Methan.', fact: '' },
      en: { tagline: 'Moon of Saturn', about: 'The only moon with a thick atmosphere – and lakes of liquid methane.', fact: '' },
    },
  },
  {
    id: 'charon',
    type: 'moon',
    parent: 'pluto',
    radiusKm: 606,
    color: '#a9a39b',
    texture: GEN('charon'),
    rotationH: -153.29,
    poleRa: 132.99,
    poleDec: -6.16,
    orbitKm: 19_591,
    periodD: 6.387,
    text: {
      de: { tagline: 'Plutomond', about: 'So groß im Vergleich zu Pluto, dass beide um einen gemeinsamen Punkt zwischen sich kreisen.', fact: '' },
      en: { tagline: 'Moon of Pluto', about: 'So large compared to Pluto that the two circle a shared point between them.', fact: '' },
    },
  },
];

export const BODY = Object.fromEntries(BODIES.map((b) => [b.id, b])) as Record<SolarId, BodyDef>;
export const PLANET_ORDER: SolarId[] = ['sun', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
export const EARTH_RADIUS_KM = 6_371;
