// Geführte Lernpfade: Schritt-für-Schritt-Abenteuer mit Aufgaben für draußen und in der App (Deutsch und Englisch).
// Jahreszeiten und Monatsangaben beziehen sich auf die Nordhalbkugel (Mitteleuropa).
// Aufgaben mit Vorsatz wie „Winter: …“ oder „Auf der Südhalbkugel: …“ sind Alternativen – eine davon genügt.

export interface PathTask {
  /** Stabile ID, eindeutig innerhalb des Pfads */
  id: string;
  de: string;
  en: string;
  /** Link in die App (siehe unten) */
  link?: string;
  /** true = draußen unter dem Himmel, false = in der App */
  outdoor: boolean;
}

export interface PathStep {
  id: string;
  de: { title: string; text: string };
  en: { title: string; text: string };
  tasks: PathTask[];
}

export interface LearningPath {
  id: string;
  icon: 'moon' | 'telescope' | 'binoculars' | 'globe' | 'sparkles';
  level: 1 | 2 | 3;
  de: { title: string; text: string };
  en: { title: string; text: string };
  steps: PathStep[];
}

// Hilfsfunktionen für Links in die App
const sky = (focus: string) => `#/sky?focus=${focus}`;
const body = (id: string) => sky(`body:${id}`);
const dso = (id: string) => sky(`dso:${id}`);
const con = (id: string) => sky(`con:${id}`);
/** Punkt auf der Sternkarte (Rektaszension und Deklination in Grad, J2000) */
const coord = (ra: number, dec: number, label: string) => sky(`coord:${ra},${dec},${encodeURIComponent(label)}`);
const lex = (id: string) => `#/wissen/lexikon/${id}`;
/** Neuer Tagebucheintrag, optional mit vorausgefülltem Objekt */
const diary = (obj?: string) => (obj ? `#/tagebuch/neu?obj=${encodeURIComponent(obj)}` : '#/tagebuch/neu');

const TONIGHT = '#/';
const SIZES = '#/wissen/groessen';
const GALLERY = '#/wissen/galerie';

export const PATHS: LearningPath[] = [
  // ───────────────────────────── 1. In 7 Nächten den Himmel kennenlernen ─────────────────────────────
  {
    id: 'seven-nights',
    icon: 'sparkles',
    level: 1,
    de: {
      title: 'In 7 Nächten den Himmel kennenlernen',
      text: 'Sieben klare Abende, sieben kleine Abenteuer: Du lernst, dich am Himmel zurechtzufinden, und entdeckst Mond, Planeten, Sternbilder und sogar die ISS. Du brauchst nur deine Augen – ein Fernglas ist ein schöner Bonus.',
    },
    en: {
      title: 'Get to know the sky in 7 nights',
      text: 'Seven clear evenings, seven small adventures: you will learn to find your way around the sky and discover the Moon, planets, constellations and even the ISS. All you need are your eyes – binoculars are a nice bonus.',
    },
    steps: [
      {
        id: 'night-1',
        de: {
          title: 'Nacht 1: Ankommen im Dunkeln',
          text: 'Deine Augen brauchen etwa 20 Minuten, bis sie sich an die Dunkelheit gewöhnt haben – danach siehst du viel mehr Sterne. Schon ein kurzer Blick auf ein helles Display macht vieles davon wieder zunichte, deshalb gibt es in der App den Rotlichtmodus. Heute lernst du außerdem, Richtungen und Abstände am Himmel zu schätzen.',
        },
        en: {
          title: 'Night 1: Settling into the dark',
          text: 'Your eyes need about 20 minutes to adjust to the dark – after that you will see many more stars. Even a quick look at a bright screen undoes much of that, which is why the app has a red light mode. Tonight you will also learn to estimate directions and distances in the sky.',
        },
        tasks: [
          {
            id: 'red-mode',
            de: 'Schalte den Rotlichtmodus ein – mit dem Augen-Symbol oben in der App.',
            en: 'Turn on red light mode with the eye icon at the top of the app.',
            outdoor: false,
          },
          {
            id: 'dark-adapt',
            de: 'Such dir einen dunklen Platz ohne Laternen und warte 20 Minuten, ohne in helles Licht zu schauen.',
            en: 'Find a dark spot away from streetlights and wait 20 minutes without looking at any bright light.',
            outdoor: true,
          },
          {
            id: 'directions',
            de: 'Finde Norden und Süden und miss Abstände mit der Faust: Am ausgestreckten Arm deckt sie etwa 10° ab.',
            en: 'Find north and south, and measure distances with your fist: held at arm’s length, it covers about 10°.',
            link: lex('observing'),
            outdoor: true,
          },
          {
            id: 'log-night-1',
            de: 'Zähle die Sterne in einem Himmelsausschnitt und halte deine erste Nacht im Tagebuch fest.',
            en: 'Count the stars in one patch of sky and record your first night in the diary.',
            link: diary(),
            outdoor: true,
          },
        ],
      },
      {
        id: 'night-2',
        de: {
          title: 'Nacht 2: Großer Wagen und Polarstern',
          text: 'Der Große Wagen gehört zum Sternbild Großer Bär und geht von Deutschland aus nie unter. Verlängerst du die Linie durch seine beiden hinteren Kastensterne Merak und Dubhe etwa fünfmal, landest du beim Polarstern: Er markiert fast genau Norden, und seine Höhe über dem Horizont entspricht ungefähr deinem Breitengrad – in Deutschland rund 50°, also etwa fünf Fäuste. Auf der Südhalbkugel ist der Polarstern nicht zu sehen; dort helfen dir das Kreuz des Südens und seine beiden Zeigersterne.',
        },
        en: {
          title: 'Night 2: The Big Dipper and Polaris',
          text: 'The Big Dipper is part of the constellation Ursa Major, the Great Bear, and from Central Europe it never sets. Extend the line through Merak and Dubhe, the two stars at the end of its bowl, about five times and you reach Polaris: it marks almost exactly due north, and its height above the horizon roughly equals your latitude – around 50° in Central Europe, or about five fists. Polaris cannot be seen from the southern hemisphere; there, the Southern Cross and its two pointer stars guide you instead.',
        },
        tasks: [
          {
            id: 'big-dipper',
            de: 'Finde den Großen Wagen: sieben helle Sterne in Form eines Kastens mit Deichsel.',
            en: 'Find the Big Dipper: seven bright stars shaped like a bowl with a handle.',
            link: con('UMa'),
            outdoor: true,
          },
          {
            id: 'polaris',
            de: 'Folge den Zeigersternen Merak und Dubhe zum Polarstern und miss mit Fäusten, wie hoch er steht.',
            en: 'Follow the pointer stars Merak and Dubhe to Polaris and measure its height with your fists.',
            link: coord(37.95, 89.26, 'Polaris'),
            outdoor: true,
          },
          {
            id: 'southern-cross',
            de: 'Auf der Südhalbkugel: Finde das Kreuz des Südens und seine Zeigersterne Alpha und Beta Centauri.',
            en: 'In the southern hemisphere: find the Southern Cross and its pointers, Alpha and Beta Centauri.',
            link: con('Cru'),
            outdoor: true,
          },
          {
            id: 'log-night-2',
            de: 'Trag den Polarstern (oder das Kreuz des Südens) in dein Tagebuch ein.',
            en: 'Log Polaris (or the Southern Cross) in your diary.',
            link: diary('Polaris'),
            outdoor: true,
          },
        ],
      },
      {
        id: 'night-3',
        de: {
          title: 'Nacht 3: Der Mond',
          text: 'Der Mond zeigt uns immer dieselbe Seite, doch seine Phase ändert sich: In rund 29,5 Tagen wird er vom Neumond zum Vollmond und wieder zurück. Am spannendsten ist die Licht-Schatten-Grenze, der Terminator – dort werfen Krater und Berge lange Schatten. Ist gerade Neumond, tausch diese Nacht einfach mit einer späteren.',
        },
        en: {
          title: 'Night 3: The Moon',
          text: 'The Moon always shows us the same side, but its phase keeps changing: in about 29.5 days it goes from new moon to full moon and back again. The most exciting part is the terminator, the line between light and shadow – craters and mountains cast long shadows there. If it is new moon right now, simply swap this night with a later one.',
        },
        tasks: [
          {
            id: 'moon-phases',
            de: 'Lies nach, warum der Mond seine Gestalt ändert.',
            en: 'Read why the Moon changes its shape.',
            link: lex('moon-phases'),
            outdoor: false,
          },
          {
            id: 'moon-find',
            de: 'Finde den Mond und bestimme seine Phase: Auf der Nordhalbkugel nimmt er zu, wenn er rechts beleuchtet ist.',
            en: 'Find the Moon and work out its phase: in the northern hemisphere it is waxing when lit on the right.',
            link: body('moon'),
            outdoor: true,
          },
          {
            id: 'moon-terminator',
            de: 'Schau dir den Terminator an – mit einem Fernglas noch besser – und such einen Krater im Mondatlas.',
            en: 'Look at the terminator – binoculars make it even better – and find a crater in the Moon atlas.',
            link: '#/beobachten/mond',
            outdoor: true,
          },
          {
            id: 'log-night-3',
            de: 'Notiere die Mondphase und deinen Krater im Tagebuch.',
            en: 'Note the Moon phase and your crater in the diary.',
            link: diary('Mond'),
            outdoor: true,
          },
        ],
      },
      {
        id: 'night-4',
        de: {
          title: 'Nacht 4: Helle Planeten',
          text: 'Planeten wandern im Laufe von Wochen und Monaten vor den Sternen entlang – immer in der Nähe der Bahn, auf der auch Sonne und Mond über den Himmel ziehen. Du erkennst sie daran, dass sie meist ruhig leuchten, während Sterne funkeln. Welche Planeten heute zu sehen sind, verrät dir die Heute-Seite.',
        },
        en: {
          title: 'Night 4: Bright planets',
          text: 'Over weeks and months, planets wander in front of the stars – always close to the path the Sun and Moon take across the sky. You can spot them because they usually shine steadily while stars twinkle. The Tonight page tells you which planets are visible.',
        },
        tasks: [
          {
            id: 'planets-tonight',
            de: 'Schau auf der Heute-Seite nach, welche Planeten heute Nacht zu sehen sind.',
            en: 'Check the Tonight page to see which planets are up tonight.',
            link: TONIGHT,
            outdoor: false,
          },
          {
            id: 'planet-find',
            de: 'Finde einen Planeten am Himmel: einen hellen Punkt, der kaum funkelt.',
            en: 'Find a planet in the sky: a bright point that hardly twinkles.',
            outdoor: true,
          },
          {
            id: 'planet-color',
            de: 'Achte auf die Farbe: Venus strahlt weiß, Mars orange-rot, Jupiter cremeweiß und Saturn leicht gelblich.',
            en: 'Notice the color: Venus is white, Mars orange-red, Jupiter creamy white and Saturn slightly yellowish.',
            outdoor: true,
          },
          {
            id: 'log-night-4',
            de: 'Trag deinen Planeten mit Uhrzeit und Himmelsrichtung ins Tagebuch ein.',
            en: 'Log your planet in the diary with the time and direction.',
            link: diary(),
            outdoor: true,
          },
        ],
      },
      {
        id: 'night-5',
        de: {
          title: 'Nacht 5: Ein Sternbild der Jahreszeit',
          text: 'Weil die Erde um die Sonne läuft, sehen wir abends je nach Jahreszeit andere Sternbilder. Wähle das Sternbild, das gerade passt – eins genügt, die anderen warten auf ihre Saison. Die Monate gelten für die Nordhalbkugel; trag dein Sternbild danach ins Tagebuch ein.',
        },
        en: {
          title: 'Night 5: A constellation of the season',
          text: 'Because Earth travels around the Sun, we see different constellations in the evening depending on the season. Pick the one that fits right now – one is enough, the others will wait for their season. The months apply to the northern hemisphere; afterwards, log your constellation in the diary.',
        },
        tasks: [
          {
            id: 'winter-orion',
            de: 'Winter (Dezember–März): Finde Orion mit den drei Gürtelsternen, der rötlichen Beteigeuze und dem bläulichen Rigel.',
            en: 'Winter (December–March): find Orion with its three belt stars, reddish Betelgeuse and bluish Rigel.',
            link: con('Ori'),
            outdoor: true,
          },
          {
            id: 'spring-leo',
            de: 'Frühling (März–Mai): Finde den Löwen – sein Kopf sieht aus wie ein spiegelverkehrtes Fragezeichen mit Regulus als Punkt.',
            en: 'Spring (March–May): find Leo – his head looks like a backward question mark with Regulus as the dot.',
            link: con('Leo'),
            outdoor: true,
          },
          {
            id: 'summer-triangle',
            de: 'Sommer (Juni–September): Verbinde Wega, Deneb und Atair zum Sommerdreieck.',
            en: 'Summer (June–September): connect Vega, Deneb and Altair to form the Summer Triangle.',
            link: con('Lyr'),
            outdoor: true,
          },
          {
            id: 'autumn-pegasus',
            de: 'Herbst (September–Dezember): Finde das große Herbstviereck des Pegasus und die Sternenkette der Andromeda an seiner Ecke.',
            en: 'Autumn (September–December): find the Great Square of Pegasus and the chain of Andromeda stars at its corner.',
            link: con('Peg'),
            outdoor: true,
          },
        ],
      },
      {
        id: 'night-6',
        de: {
          title: 'Nacht 6: Milchstraße und Deep Sky',
          text: 'Fern der Stadtlichter und ohne Mond siehst du die Milchstraße als schwaches Lichtband – das Licht unzähliger Sterne unserer eigenen Galaxie. Heute suchst du außerdem dein erstes Deep-Sky-Objekt, also einen Sternhaufen, einen Nebel oder eine Galaxie. Wähle das Objekt, das zur Jahreszeit passt, und trag es danach ins Tagebuch ein.',
        },
        en: {
          title: 'Night 6: The Milky Way and deep sky',
          text: 'Away from city lights and with no Moon, you can see the Milky Way as a faint band of light – the glow of countless stars in our own galaxy. Tonight you will also hunt for your first deep-sky object: a star cluster, a nebula or a galaxy. Pick the one that fits the season and log it in the diary afterwards.',
        },
        tasks: [
          {
            id: 'milky-way',
            de: 'Such in einer mondlosen Nacht das Band der Milchstraße – im Sommer zieht es hoch über den Himmel.',
            en: 'On a moonless night, look for the band of the Milky Way – in summer it arches high across the sky.',
            link: lex('milky-way'),
            outdoor: true,
          },
          {
            id: 'dso-m31',
            de: 'September–Januar: Finde die Andromedagalaxie M31 als länglichen Nebelfleck – ihr Licht war 2,5 Millionen Jahre unterwegs.',
            en: 'September–January: find the Andromeda Galaxy M31, an oval smudge – its light traveled for 2.5 million years.',
            link: dso('M31'),
            outdoor: true,
          },
          {
            id: 'dso-m45',
            de: 'Oktober–März: Finde das Siebengestirn M45 und zähle, wie viele Sterne du erkennst.',
            en: 'October–March: find the Pleiades M45 and count how many stars you can make out.',
            link: dso('M45'),
            outdoor: true,
          },
          {
            id: 'dso-m42',
            de: 'Dezember–März: Finde den Orionnebel M42 im Schwert unter Orions Gürtel – dort entstehen gerade neue Sterne.',
            en: 'December–March: find the Orion Nebula M42 in the sword below Orion’s belt – new stars are being born there.',
            link: dso('M42'),
            outdoor: true,
          },
        ],
      },
      {
        id: 'night-7',
        de: {
          title: 'Nacht 7: ISS und Satelliten',
          text: 'Die Internationale Raumstation kreist in rund 400 Kilometern Höhe und umrundet die Erde etwa alle 90 Minuten. Du siehst sie, wenn sie noch von der Sonne angestrahlt wird, während es bei dir schon dunkel ist – also in der Abend- oder Morgendämmerung. Sie zieht als heller Punkt ohne Blinklichter in wenigen Minuten über den Himmel.',
        },
        en: {
          title: 'Night 7: The ISS and satellites',
          text: 'The International Space Station orbits about 400 kilometers up and circles Earth roughly every 90 minutes. You can see it when it is still lit by the Sun while it is already dark where you are – so after dusk or before dawn. It glides across the sky in a few minutes as a bright dot without blinking lights.',
        },
        tasks: [
          {
            id: 'iss-pass',
            de: 'Schau im Live-Bereich nach, wann die ISS das nächste Mal sichtbar über dich fliegt.',
            en: 'Check the Live section for the next visible ISS pass over your location.',
            link: '#/live',
            outdoor: false,
          },
          {
            id: 'iss-watch',
            de: 'Beobachte den Überflug und achte darauf, ob die ISS plötzlich verblasst – dann taucht sie in den Erdschatten ein.',
            en: 'Watch the pass and notice whether the ISS suddenly fades – that is when it slips into Earth’s shadow.',
            link: sky('iss'),
            outdoor: true,
          },
          {
            id: 'satellites',
            de: 'Bleib danach noch 15 Minuten draußen und zähle, wie viele andere Satelliten vorbeiziehen.',
            en: 'Stay outside for another 15 minutes and count how many other satellites drift past.',
            outdoor: true,
          },
          {
            id: 'log-night-7',
            de: 'Trag die ISS ins Tagebuch ein – Glückwunsch, du hast alle sieben Nächte geschafft!',
            en: 'Log the ISS in your diary – congratulations, you have completed all seven nights!',
            link: diary('ISS'),
            outdoor: true,
          },
        ],
      },
    ],
  },

  // ───────────────────────────── 2. Planetenjäger ─────────────────────────────
  {
    id: 'planet-hunter',
    icon: 'telescope',
    level: 2,
    de: {
      title: 'Planetenjäger',
      text: 'Spür alle Planeten auf, die du ohne Teleskop sehen kannst – und lüfte dann ihre Geheimnisse: die Phasen der Venus, die Monde des Jupiter und die Ringe des Saturn. Für manche Schritte brauchst du ein Fernglas oder ein kleines Teleskop und etwas Geduld, denn Planeten halten sich an ihren eigenen Zeitplan.',
    },
    en: {
      title: 'Planet hunter',
      text: 'Track down every planet you can see without a telescope – then uncover their secrets: the phases of Venus, the moons of Jupiter and the rings of Saturn. Some steps need binoculars or a small telescope plus a little patience, because planets keep to their own schedule.',
    },
    steps: [
      {
        id: 'naked-eye',
        de: {
          title: 'Alle fünf mit bloßem Auge',
          text: 'Merkur, Venus, Mars, Jupiter und Saturn kannten die Menschen schon im Altertum, denn sie sind ohne Hilfsmittel zu sehen. Nicht alle stehen gleichzeitig am Himmel – sammle sie nach und nach, das kann einige Monate dauern. Am kniffligsten ist Merkur, der sich nie weit von der Sonne entfernt.',
        },
        en: {
          title: 'All five with the naked eye',
          text: 'Mercury, Venus, Mars, Jupiter and Saturn were already known in ancient times because you can see them without any instruments. They are not all in the sky at the same time – collect them one by one, which can take a few months. Mercury is the trickiest because it never strays far from the Sun.',
        },
        tasks: [
          {
            id: 'naked-eye-tonight',
            de: 'Schau auf der Heute-Seite nach, welche Planeten in den nächsten Nächten zu sehen sind.',
            en: 'Check the Tonight page to see which planets are visible in the coming nights.',
            link: TONIGHT,
            outdoor: false,
          },
          {
            id: 'naked-eye-line',
            de: 'Finde die sichtbaren Planeten und beachte: Sie stehen alle ungefähr auf einer Linie am Himmel.',
            en: 'Find the visible planets and notice that they all lie roughly along one line across the sky.',
            outdoor: true,
          },
          {
            id: 'mercury',
            de: 'Erwische Merkur tief in der Dämmerung – nimm ein Fernglas nur, solange die Sonne ganz unter dem Horizont steht.',
            en: 'Catch Mercury low in the twilight – only use binoculars while the Sun is completely below the horizon.',
            link: body('mercury'),
            outdoor: true,
          },
          {
            id: 'log-naked-eye',
            de: 'Trag jeden neuen Planeten ins Tagebuch ein, bis du alle fünf hast.',
            en: 'Log each new planet in your diary until you have all five.',
            link: diary(),
            outdoor: true,
          },
        ],
      },
      {
        id: 'venus-phases',
        de: {
          title: 'Die Phasen der Venus',
          text: 'Venus ist nach Sonne und Mond das hellste Objekt am Himmel. Im Teleskop zeigt sie Phasen wie der Mond: Kommt sie der Erde näher, wird sie größer und schrumpft zu einer schmalen Sichel. Galileo Galilei entdeckte das 1610 – ein starker Hinweis darauf, dass Venus um die Sonne kreist und nicht um die Erde.',
        },
        en: {
          title: 'The phases of Venus',
          text: 'Venus is the brightest object in the sky after the Sun and the Moon. Through a telescope it shows phases like the Moon: as it comes closer to Earth, it looks bigger and thins into a narrow crescent. Galileo Galilei discovered this in 1610 – strong evidence that Venus orbits the Sun, not Earth.',
        },
        tasks: [
          {
            id: 'venus-read',
            de: 'Lies im Lexikon, warum Venus so hell strahlt.',
            en: 'Read in the lexicon why Venus shines so brightly.',
            link: lex('venus'),
            outdoor: false,
          },
          {
            id: 'venus-find',
            de: 'Finde Venus als Abend- oder Morgenstern.',
            en: 'Find Venus as the evening or morning star.',
            link: body('venus'),
            outdoor: true,
          },
          {
            id: 'venus-sketch',
            de: 'Beobachte sie im Teleskop schon in der Dämmerung, wenn sie weniger blendet, und zeichne ihre Form.',
            en: 'Observe it through a telescope while it is still twilight and less dazzling, and sketch its shape.',
            outdoor: true,
          },
          {
            id: 'log-venus',
            de: 'Schau zwei bis drei Wochen später wieder hin und vergleiche im Tagebuch: Wie haben sich Form und Größe verändert?',
            en: 'Look again two or three weeks later and compare in your diary: how have its shape and size changed?',
            link: diary('Venus'),
            outdoor: true,
          },
        ],
      },
      {
        id: 'jupiter-moons',
        de: {
          title: 'Die Monde des Jupiter',
          text: 'Schon in einem ruhig gehaltenen Fernglas siehst du bis zu vier winzige Lichtpunkte neben Jupiter: Io, Europa, Ganymed und Kallisto. Galilei entdeckte sie 1610. Weil sie Jupiter in knapp 2 bis 17 Tagen umrunden, stehen sie jeden Abend anders.',
        },
        en: {
          title: 'The moons of Jupiter',
          text: 'Even in steadily held binoculars you can see up to four tiny points of light next to Jupiter: Io, Europa, Ganymede and Callisto. Galileo discovered them in 1610. Because they circle Jupiter in roughly 2 to 17 days, they are in a different place every evening.',
        },
        tasks: [
          {
            id: 'jupiter-app',
            de: 'Schau in der Jupitermond-Ansicht nach, wie die Monde heute stehen.',
            en: 'Check the Jupiter moons view to see where the moons are tonight.',
            link: '#/beobachten/jupiter',
            outdoor: false,
          },
          {
            id: 'jupiter-find',
            de: 'Stütz dein Fernglas an einer Mauer oder einem Zaun ab und such die Lichtpunkte neben Jupiter.',
            en: 'Rest your binoculars on a wall or fence and look for the points of light next to Jupiter.',
            link: body('jupiter'),
            outdoor: true,
          },
          {
            id: 'jupiter-again',
            de: 'Schau am nächsten Abend noch einmal: Welche Monde haben ihren Platz gewechselt?',
            en: 'Look again the next evening: which moons have changed places?',
            outdoor: true,
          },
          {
            id: 'log-jupiter',
            de: 'Zeichne die Stellung der Monde in dein Tagebuch.',
            en: 'Sketch the positions of the moons in your diary.',
            link: diary('Jupiter'),
            outdoor: true,
          },
        ],
      },
      {
        id: 'saturn-rings',
        de: {
          title: 'Die Ringe des Saturn',
          text: 'Saturns Ringe bestehen aus unzähligen Brocken aus Eis und etwas Gestein. Ab etwa 25-facher Vergrößerung zeigt sie schon ein kleines Teleskop – ein Anblick, den man nie vergisst. Weil sich unser Blickwinkel langsam ändert, sehen wir etwa alle 15 Jahre genau auf die Kante der Ringe, zuletzt 2025; seitdem öffnen sie sich wieder.',
        },
        en: {
          title: 'The rings of Saturn',
          text: 'Saturn’s rings are made of countless chunks of ice and a little rock. From about 25× magnification, even a small telescope shows them – a sight you will never forget. Because our viewing angle slowly changes, we see the rings exactly edge-on about every 15 years, most recently in 2025; since then they have been opening up again.',
        },
        tasks: [
          {
            id: 'saturn-eyepiece',
            de: 'Berechne im Okularrechner, welche Vergrößerung dein Teleskop schafft.',
            en: 'Use the eyepiece calculator to work out your telescope’s magnification.',
            link: '#/beobachten/okular',
            outdoor: false,
          },
          {
            id: 'saturn-find',
            de: 'Stell Saturn im Teleskop scharf und such die Ringe.',
            en: 'Focus your telescope on Saturn and look for the rings.',
            link: body('saturn'),
            outdoor: true,
          },
          {
            id: 'saturn-titan',
            de: 'Halte Ausschau nach Titan, Saturns größtem Mond – ein Sternchen ganz in der Nähe.',
            en: 'Look for Titan, Saturn’s largest moon – a faint star-like dot close by.',
            outdoor: true,
          },
          {
            id: 'log-saturn',
            de: 'Zeichne Saturn mit seinen Ringen in dein Tagebuch.',
            en: 'Sketch Saturn and its rings in your diary.',
            link: diary('Saturn'),
            outdoor: true,
          },
        ],
      },
      {
        id: 'mars-opposition',
        de: {
          title: 'Mars in Opposition',
          text: 'Etwa alle 26 Monate überholt die Erde den Mars auf der Innenbahn. Dann steht er der Sonne genau gegenüber, ist die ganze Nacht zu sehen und leuchtet besonders hell – das nennt man Opposition. Rund um diese Zeit scheint Mars vor den Sternen eine Schleife rückwärts zu laufen; die nächsten Oppositionen sind im Februar 2027 und im März 2029.',
        },
        en: {
          title: 'Mars at opposition',
          text: 'About every 26 months, Earth overtakes Mars on the inside track. Mars then stands exactly opposite the Sun, is visible all night and shines especially brightly – this is called opposition. Around this time Mars seems to trace a backward loop against the stars; the next oppositions are in February 2027 and March 2029.',
        },
        tasks: [
          {
            id: 'mars-3d',
            de: 'Beobachte im 3D-Sonnensystem, wie die Erde den Mars auf der Innenbahn überholt.',
            en: 'Watch in the 3D solar system how Earth overtakes Mars on the inside track.',
            link: '#/system?focus=mars',
            outdoor: false,
          },
          {
            id: 'mars-find',
            de: 'Finde Mars an seiner orange-roten Farbe.',
            en: 'Find Mars by its orange-red color.',
            link: body('mars'),
            outdoor: true,
          },
          {
            id: 'mars-loop',
            de: 'Notiere alle paar Wochen, vor welchen Sternen Mars steht, und verfolge so seine Schleife.',
            en: 'Every few weeks, note which stars Mars is near and follow its loop.',
            outdoor: true,
          },
          {
            id: 'log-mars',
            de: 'Trag Mars ins Tagebuch ein – mit einem Teleskop vielleicht sogar mit seiner hellen Polkappe.',
            en: 'Log Mars in your diary – with a telescope, maybe even with its bright polar cap.',
            link: diary('Mars'),
            outdoor: true,
          },
        ],
      },
      {
        id: 'uranus',
        de: {
          title: 'Uranus im Fernglas',
          text: 'Uranus ist mit etwa 5,7 Größenklassen so schwach, dass du ihn mit bloßem Auge höchstens unter sehr dunklem Himmel erahnen kannst – im Fernglas klappt es aber gut. Er sieht aus wie ein Stern, schimmert aber leicht grünlich-blau. William Herschel entdeckte ihn 1781 als ersten Planeten mit einem Teleskop.',
        },
        en: {
          title: 'Uranus in binoculars',
          text: 'At about magnitude 5.7, Uranus is so faint that you can at best just glimpse it with the naked eye under a very dark sky – but in binoculars it is easy. It looks like a star but has a slight greenish-blue tint. William Herschel discovered it in 1781, the first planet ever found with a telescope.',
        },
        tasks: [
          {
            id: 'uranus-map',
            de: 'Schau in der Sternkarte, in welchem Sternbild Uranus gerade steht und welche hellen Sterne in der Nähe sind.',
            en: 'Check the sky map to see which constellation Uranus is in and which bright stars are nearby.',
            link: body('uranus'),
            outdoor: false,
          },
          {
            id: 'uranus-find',
            de: 'Hangel dich mit dem Fernglas von einem hellen Stern zu Uranus und vergleiche das Bild mit der Karte.',
            en: 'Hop with your binoculars from a bright star to Uranus and compare the view with the map.',
            outdoor: true,
          },
          {
            id: 'uranus-confirm',
            de: 'Schau eine Woche später wieder hin: Der „Stern“, der sich bewegt hat, ist Uranus.',
            en: 'Look again a week later: the “star” that has moved is Uranus.',
            outdoor: true,
          },
          {
            id: 'log-uranus',
            de: 'Trag Uranus ins Tagebuch ein – damit hast du sechs Planeten gesehen!',
            en: 'Log Uranus in your diary – that makes six planets!',
            link: diary('Uranus'),
            outdoor: true,
          },
        ],
      },
    ],
  },

  // ───────────────────────────── 3. Fernglas-Safari ─────────────────────────────
  {
    id: 'binocular-safari',
    icon: 'binoculars',
    level: 2,
    de: {
      title: 'Fernglas-Safari',
      text: 'Ein Fernglas sammelt viel mehr Licht als dein Auge und zeigt dir Sternhaufen, Nebel und sogar Galaxien. Auf dieser Safari reist du einmal durchs Jahr zu den schönsten Zielen. Die Jahreszeiten gelten für die Nordhalbkugel, und die Beobachtungslisten helfen dir beim Abhaken.',
    },
    en: {
      title: 'Binocular safari',
      text: 'Binoculars gather far more light than your eye and reveal star clusters, nebulae and even galaxies. On this safari you will travel through the year to the finest targets. The seasons apply to the northern hemisphere, and the observing checklists help you tick everything off.',
    },
    steps: [
      {
        id: 'safari-basics',
        de: {
          title: 'Ausrüstung und Technik',
          text: 'Ideal für den Himmel sind Ferngläser wie 7×50 oder 10×50: Die erste Zahl ist die Vergrößerung, die zweite der Durchmesser der vorderen Linsen in Millimetern. Je ruhiger du das Fernglas hältst, desto mehr siehst du. Zum Üben eignen sich der Mond oder ein heller Stern.',
        },
        en: {
          title: 'Gear and technique',
          text: 'Binoculars like 7×50 or 10×50 are ideal for the sky: the first number is the magnification, the second the diameter of the front lenses in millimeters. The steadier you hold them, the more you will see. The Moon or a bright star is perfect for practice.',
        },
        tasks: [
          {
            id: 'lists',
            de: 'Öffne die Beobachtungslisten und schau, welche Fernglas-Ziele auf dich warten.',
            en: 'Open the observing checklists and see which binocular targets are waiting for you.',
            link: '#/beobachten/listen',
            outdoor: false,
          },
          {
            id: 'focus',
            de: 'Stell das Fernglas an einem hellen Stern scharf, bis er ein winziger Punkt ist – erst links, dann rechts mit dem Dioptrienring.',
            en: 'Focus your binoculars on a bright star until it is a tiny point – first the left side, then the right with the diopter ring.',
            outdoor: true,
          },
          {
            id: 'steady',
            de: 'Stütz die Ellbogen ab oder lehn dich an eine Wand – und vergleiche, wie viel ruhiger das Bild wird.',
            en: 'Brace your elbows or lean against a wall – and see how much steadier the view becomes.',
            outdoor: true,
          },
        ],
      },
      {
        id: 'safari-winter',
        de: {
          title: 'Winter: Juwelen um Orion',
          text: 'Der Winterhimmel ist voller heller Sterne und funkelnder Sternhaufen. Die Plejaden sehen im Fernglas aus wie ein Schmuckkästchen, und im Orionnebel entstehen gerade neue Sterne. Im Sternbild Fuhrmann warten gleich drei Sternhaufen in einer Reihe.',
        },
        en: {
          title: 'Winter: Jewels around Orion',
          text: 'The winter sky is full of bright stars and sparkling star clusters. In binoculars the Pleiades look like a jewelry box, and new stars are being born in the Orion Nebula. In the constellation Auriga, three star clusters wait in a row.',
        },
        tasks: [
          {
            id: 'm45',
            de: 'Plejaden (M45): Zähle die Sterne – im Fernglas sind es Dutzende statt sechs oder sieben.',
            en: 'Pleiades (M45): count the stars – in binoculars you will see dozens instead of six or seven.',
            link: dso('M45'),
            outdoor: true,
          },
          {
            id: 'm42',
            de: 'Orionnebel (M42): Such den grauen Nebelschimmer im Schwert unter Orions Gürtel.',
            en: 'Orion Nebula (M42): look for the gray glow in the sword below Orion’s belt.',
            link: dso('M42'),
            outdoor: true,
          },
          {
            id: 'auriga',
            de: 'Fuhrmann: Finde die drei Sternhaufen M36, M37 und M38 nebeneinander.',
            en: 'Auriga: find the three star clusters M36, M37 and M38 side by side.',
            link: dso('M36'),
            outdoor: true,
          },
          {
            id: 'log-winter',
            de: 'Trag dein schönstes Winterziel ins Tagebuch ein.',
            en: 'Log your favorite winter target in the diary.',
            link: diary(),
            outdoor: true,
          },
        ],
      },
      {
        id: 'safari-spring',
        de: {
          title: 'Frühling: Sternhaufen und Sternenpaare',
          text: 'Im Frühling blicken wir abends aus der Scheibe der Milchstraße hinaus, deshalb gibt es weniger Nebel, aber einige schöne Sternhaufen. Die Krippe im Krebs ist mit rund 600 Lichtjahren einer der nahen Sternhaufen. Und im Großen Wagen wartet ein berühmtes Sternenpaar.',
        },
        en: {
          title: 'Spring: Star clusters and star pairs',
          text: 'In spring evenings we look out of the disk of the Milky Way, so there are fewer nebulae but some lovely star clusters. The Beehive Cluster in Cancer is one of the nearby star clusters, about 600 light-years away. And the Big Dipper holds a famous pair of stars.',
        },
        tasks: [
          {
            id: 'm44',
            de: 'Krippe (M44): Such den Sternhaufen zwischen Pollux und Regulus.',
            en: 'Beehive Cluster (M44): find the cluster between Pollux and Regulus.',
            link: dso('M44'),
            outdoor: true,
          },
          {
            id: 'melotte-111',
            de: 'Haar der Berenike (Melotte 111): Schwenk über den großen, lockeren Sternhaufen zwischen Löwe und Bärenhüter.',
            en: 'Coma Star Cluster (Melotte 111): sweep across this large, loose cluster between Leo and Boötes.',
            link: coord(186.0, 26.0, 'Melotte 111'),
            outdoor: true,
          },
          {
            id: 'mizar-alcor',
            de: 'Mizar und Alcor: Trenne den mittleren Deichselstern des Großen Wagens in zwei Sterne.',
            en: 'Mizar and Alcor: split the middle star of the Big Dipper’s handle into two stars.',
            link: coord(200.98, 54.93, 'Mizar & Alcor'),
            outdoor: true,
          },
          {
            id: 'log-spring',
            de: 'Trag dein schönstes Frühlingsziel ins Tagebuch ein.',
            en: 'Log your favorite spring target in the diary.',
            link: diary(),
            outdoor: true,
          },
        ],
      },
      {
        id: 'safari-summer',
        de: {
          title: 'Sommer: Schätze der Milchstraße',
          text: 'Im Sommer schauen wir abends in Richtung Zentrum der Milchstraße, und das Fernglas zeigt dort unzählige Sterne. Kugelsternhaufen wie M13 enthalten Hunderttausende uralte Sterne. Tief im Süden, über dem Sternbild Schütze, leuchten helle Nebel – such dir dafür einen Platz mit freier Sicht zum Horizont.',
        },
        en: {
          title: 'Summer: Treasures of the Milky Way',
          text: 'On summer evenings we look toward the center of the Milky Way, and binoculars reveal countless stars there. Globular clusters like M13 hold hundreds of thousands of ancient stars. Low in the south, above Sagittarius, bright nebulae glow – find a spot with a clear view down to the horizon.',
        },
        tasks: [
          {
            id: 'm13',
            de: 'Herkuleshaufen (M13): Such das kleine, runde Nebelbällchen zwischen Wega und Arktur.',
            en: 'Hercules Cluster (M13): look for the small, round fuzzy ball between Vega and Arcturus.',
            link: dso('M13'),
            outdoor: true,
          },
          {
            id: 'coathanger',
            de: 'Kleiderbügel (Collinder 399): Finde die Sternenkette mit Haken, etwa ein Drittel des Wegs von Atair zu Wega.',
            en: 'Coathanger (Collinder 399): find the chain of stars with a hook, about a third of the way from Altair to Vega.',
            link: coord(291.35, 20.18, 'Collinder 399'),
            outdoor: true,
          },
          {
            id: 'm8',
            de: 'Lagunennebel (M8): Such den hellen Nebelfleck tief im Süden über der „Teekanne“ des Schützen.',
            en: 'Lagoon Nebula (M8): look for the bright nebula low in the south above the “Teapot” of Sagittarius.',
            link: dso('M8'),
            outdoor: true,
          },
          {
            id: 'log-summer',
            de: 'Trag dein schönstes Sommerziel ins Tagebuch ein.',
            en: 'Log your favorite summer target in the diary.',
            link: diary(),
            outdoor: true,
          },
        ],
      },
      {
        id: 'safari-autumn',
        de: {
          title: 'Herbst: Andromeda und Doppelhaufen',
          text: 'Im Herbst steht die Andromedagalaxie hoch am Himmel – die große Nachbargalaxie unserer Milchstraße. Zwischen Perseus und Kassiopeia funkelt der Doppelhaufen, zwei Sternhaufen dicht nebeneinander. Wer einen wirklich dunklen Himmel hat, kann sich an der blassen Dreiecksgalaxie versuchen.',
        },
        en: {
          title: 'Autumn: Andromeda and the Double Cluster',
          text: 'In autumn the Andromeda Galaxy stands high in the sky – the large neighbor of our Milky Way. Between Perseus and Cassiopeia sparkles the Double Cluster, two star clusters side by side. If you have a truly dark sky, try for the faint Triangulum Galaxy.',
        },
        tasks: [
          {
            id: 'm31',
            de: 'Andromedagalaxie (M31): Folge vom Pegasus-Viereck der Sternenkette der Andromeda bis zum länglichen Nebelfleck.',
            en: 'Andromeda Galaxy (M31): follow the chain of Andromeda stars from the Great Square of Pegasus to the oval smudge.',
            link: dso('M31'),
            outdoor: true,
          },
          {
            id: 'double-cluster',
            de: 'Doppelhaufen (h und χ Persei): Finde die zwei Sternhaufen zwischen Perseus und Kassiopeia.',
            en: 'Double Cluster (h and χ Persei): find the two star clusters between Perseus and Cassiopeia.',
            link: coord(35.2, 57.13, 'NGC 869/884'),
            outdoor: true,
          },
          {
            id: 'm33',
            de: 'Dreiecksgalaxie (M33): Such in einer mondlosen Nacht den großen, sehr blassen Schimmer – eine echte Herausforderung.',
            en: 'Triangulum Galaxy (M33): on a moonless night, look for the large, very faint glow – a real challenge.',
            link: dso('M33'),
            outdoor: true,
          },
          {
            id: 'log-autumn',
            de: 'Trag dein schönstes Herbstziel ins Tagebuch ein.',
            en: 'Log your favorite autumn target in the diary.',
            link: diary(),
            outdoor: true,
          },
        ],
      },
      {
        id: 'safari-galaxies',
        de: {
          title: 'Profi-Runde: Galaxien im Großen Bären',
          text: 'Zum Abschluss jagst du Galaxien, deren Licht rund zwölf Millionen Jahre zu uns unterwegs war. M81 und M82 stehen im Großen Bären und sind von Deutschland aus das ganze Jahr zu finden, am besten im Frühling. Du brauchst eine mondlose Nacht, einen dunklen Ort und ein gut abgestütztes Fernglas.',
        },
        en: {
          title: 'Expert round: Galaxies in the Great Bear',
          text: 'To finish, you will hunt galaxies whose light traveled for about twelve million years to reach us. M81 and M82 lie in Ursa Major and can be found all year from Central Europe, best in spring. You need a moonless night, a dark site and well-supported binoculars.',
        },
        tasks: [
          {
            id: 'dark-night',
            de: 'Such dir auf der Heute-Seite eine klare, mondlose Nacht aus.',
            en: 'Use the Tonight page to pick a clear, moonless night.',
            link: TONIGHT,
            outdoor: false,
          },
          {
            id: 'm81-m82',
            de: 'M81 und M82: Verlängere die Linie von Phekda über Dubhe im Großen Wagen etwa um ihre eigene Länge und such zwei blasse Flecken.',
            en: 'M81 and M82: extend the line from Phecda through Dubhe in the Big Dipper by about its own length and look for two faint smudges.',
            link: dso('M81'),
            outdoor: true,
          },
          {
            id: 'm51',
            de: 'Strudelgalaxie (M51): Such den winzigen Nebelfleck etwa 3,5° neben Alkaid, dem Stern am Ende der Deichsel.',
            en: 'Whirlpool Galaxy (M51): look for the tiny smudge about 3.5° from Alkaid, the star at the end of the handle.',
            link: dso('M51'),
            outdoor: true,
          },
          {
            id: 'log-galaxies',
            de: 'Trag deine Galaxien ins Tagebuch ein – du hast die Safari geschafft!',
            en: 'Log your galaxies in the diary – you have completed the safari!',
            link: diary(),
            outdoor: true,
          },
        ],
      },
    ],
  },

  // ───────────────────────────── 4. Von der Erde ins Universum ─────────────────────────────
  {
    id: 'earth-to-universe',
    icon: 'globe',
    level: 1,
    de: {
      title: 'Von der Erde ins Universum',
      text: 'Eine Reise in acht Etappen, ganz bequem in der App: Du startest auf der Erde und fliegst immer weiter hinaus – zum Mond, zur Sonne, zu den Planeten, zu fernen Sternen und Galaxien bis an den Rand des sichtbaren Universums. Unterwegs staunst du über Größen und Entfernungen.',
    },
    en: {
      title: 'From Earth to the universe',
      text: 'A journey in eight stages, right inside the app: you start on Earth and travel ever farther out – to the Moon, the Sun, the planets, distant stars and galaxies, all the way to the edge of the observable universe. Along the way you will marvel at sizes and distances.',
    },
    steps: [
      {
        id: 'earth',
        de: {
          title: 'Start: Die Erde',
          text: 'Unsere Heimat ist eine Gesteinskugel von rund 12.700 Kilometern Durchmesser, die sich einmal am Tag um sich selbst dreht. Gleichzeitig rast sie mit etwa 30 Kilometern pro Sekunde um die Sonne und braucht für eine Runde ein Jahr. Weil ihre Achse schräg steht, gibt es Jahreszeiten.',
        },
        en: {
          title: 'Start: Earth',
          text: 'Our home is a ball of rock about 12,700 kilometers across that spins once a day. At the same time it races around the Sun at about 30 kilometers per second, taking a year for each lap. Because its axis is tilted, we have seasons.',
        },
        tasks: [
          {
            id: 'earth-read',
            de: 'Lies im Lexikon, was die Erde so besonders macht.',
            en: 'Read in the lexicon what makes Earth so special.',
            link: lex('earth'),
            outdoor: false,
          },
          {
            id: 'earth-3d',
            de: 'Such die Erde im 3D-Sonnensystem und schau ihr beim Kreisen um die Sonne zu.',
            en: 'Find Earth in the 3D solar system and watch it circle the Sun.',
            link: '#/system?focus=earth',
            outdoor: false,
          },
          {
            id: 'earth-sunset',
            de: 'Schau dir einen Sonnenuntergang an: Nicht die Sonne sinkt – die Erde dreht dich von ihr weg.',
            en: 'Watch a sunset: the Sun isn’t sinking – Earth is turning you away from it.',
            outdoor: true,
          },
        ],
      },
      {
        id: 'moon',
        de: {
          title: 'Etappe 2: Der Mond',
          text: 'Der Mond ist im Mittel rund 384.000 Kilometer entfernt – etwa 30 Erden würden nebeneinander in die Lücke passen. Sein Licht braucht gut eine Sekunde zu uns. 1969 betraten mit Apollo 11 zum ersten Mal Menschen seine Oberfläche.',
        },
        en: {
          title: 'Stage 2: The Moon',
          text: 'The Moon is on average about 384,000 kilometers away – roughly 30 Earths would fit side by side in the gap. Its light takes just over a second to reach us. In 1969, Apollo 11 brought the first people to its surface.',
        },
        tasks: [
          {
            id: 'moon-read',
            de: 'Lies im Lexikon, wie der Mond vermutlich entstanden ist.',
            en: 'Read in the lexicon how the Moon probably formed.',
            link: lex('moon'),
            outdoor: false,
          },
          {
            id: 'moon-sizes',
            de: 'Vergleiche im Größen-Werkzeug Erde und Mond.',
            en: 'Compare Earth and the Moon in the sizes tool.',
            link: SIZES,
            outdoor: false,
          },
          {
            id: 'moon-timeline',
            de: 'Finde im Zeitstrahl die erste Mondlandung.',
            en: 'Find the first Moon landing on the timeline.',
            link: '#/wissen/zeitstrahl',
            outdoor: false,
          },
          {
            id: 'moon-atlas',
            de: 'Such im Mondatlas das Meer der Ruhe, in dem Apollo 11 gelandet ist.',
            en: 'Find the Sea of Tranquility in the Moon atlas, where Apollo 11 landed.',
            link: '#/beobachten/mond',
            outdoor: false,
          },
        ],
      },
      {
        id: 'sun',
        de: {
          title: 'Etappe 3: Die Sonne',
          text: 'Die Sonne ist ein ganz normaler Stern – und doch so groß, dass 109 Erden nebeneinander quer über sie passen. Sie enthält über 99 Prozent der Masse des Sonnensystems, und ihr Licht braucht gut acht Minuten bis zu uns. Schau nie ohne Spezialfilter in die Sonne, schon gar nicht mit einem Fernglas!',
        },
        en: {
          title: 'Stage 3: The Sun',
          text: 'The Sun is an ordinary star – yet so large that 109 Earths would fit side by side across it. It holds over 99 percent of the mass of the solar system, and its light takes just over eight minutes to reach us. Never look at the Sun without a special filter, and certainly never through binoculars!',
        },
        tasks: [
          {
            id: 'sun-read',
            de: 'Lies im Lexikon, woher die Sonne ihre Energie bekommt.',
            en: 'Read in the lexicon where the Sun gets its energy.',
            link: lex('sun'),
            outdoor: false,
          },
          {
            id: 'sun-sizes',
            de: 'Stell im Größen-Werkzeug die Sonne neben die Erde.',
            en: 'Put the Sun next to Earth in the sizes tool.',
            link: SIZES,
            outdoor: false,
          },
          {
            id: 'sun-aurora',
            de: 'Finde heraus, wie die Sonne auf der Erde Polarlichter entstehen lässt.',
            en: 'Find out how the Sun creates auroras on Earth.',
            link: lex('aurora'),
            outdoor: false,
          },
          {
            id: 'sun-eclipse',
            de: 'Schau nach, wann die nächste Finsternis bei dir zu sehen ist.',
            en: 'Check when the next eclipse will be visible where you live.',
            link: '#/beobachten/finsternisse',
            outdoor: false,
          },
        ],
      },
      {
        id: 'planets',
        de: {
          title: 'Etappe 4: Die Planeten',
          text: 'Acht Planeten kreisen um die Sonne: vier kleine Gesteinsplaneten innen und vier riesige Gas- und Eisplaneten außen. Jupiter ist so gewaltig, dass er mehr als doppelt so viel Masse hat wie alle anderen Planeten zusammen. Bis zu Neptun, dem äußersten Planeten, ist das Sonnenlicht über vier Stunden unterwegs.',
        },
        en: {
          title: 'Stage 4: The planets',
          text: 'Eight planets orbit the Sun: four small rocky planets on the inside and four giant gas and ice planets farther out. Jupiter is so huge that it has more than twice the mass of all the other planets combined. Sunlight takes over four hours to reach Neptune, the outermost planet.',
        },
        tasks: [
          {
            id: 'planets-3d',
            de: 'Flieg im 3D-Sonnensystem zu Jupiter und Saturn.',
            en: 'Fly to Jupiter and Saturn in the 3D solar system.',
            link: '#/system?focus=jupiter',
            outdoor: false,
          },
          {
            id: 'planets-sizes',
            de: 'Vergleiche im Größen-Werkzeug den kleinsten und den größten Planeten.',
            en: 'Compare the smallest and the largest planet in the sizes tool.',
            link: SIZES,
            outdoor: false,
          },
          {
            id: 'planets-quiz',
            de: 'Teste dein Wissen im Quiz zum Sonnensystem.',
            en: 'Test your knowledge in the solar system quiz.',
            link: '#/wissen/quiz?cat=solar',
            outdoor: false,
          },
          {
            id: 'planets-sky',
            de: 'Bonus: Schau auf der Heute-Seite, welcher Planet zu sehen ist, und such ihn am echten Himmel.',
            en: 'Bonus: check the Tonight page for a planet that is up and find it in the real sky.',
            link: TONIGHT,
            outdoor: true,
          },
        ],
      },
      {
        id: 'stars',
        de: {
          title: 'Etappe 5: Die Sterne',
          text: 'Jeder Stern am Nachthimmel ist eine Sonne, viele davon größer und heller als unsere. Selbst der nächste, Proxima Centauri, ist 4,2 Lichtjahre entfernt – sein Licht ist also über vier Jahre zu uns unterwegs. An der Farbe eines Sterns erkennst du seine Temperatur: Rote Sterne sind kühler, blaue viel heißer.',
        },
        en: {
          title: 'Stage 5: The stars',
          text: 'Every star in the night sky is a sun, many of them bigger and brighter than ours. Even the nearest one, Proxima Centauri, is 4.2 light-years away – its light travels for more than four years to reach us. A star’s color reveals its temperature: red stars are cooler, blue ones much hotter.',
        },
        tasks: [
          {
            id: 'stars-read',
            de: 'Lies im Lexikon, warum Sterne leuchten und unterschiedliche Farben haben.',
            en: 'Read in the lexicon why stars shine and come in different colors.',
            link: lex('stars'),
            outdoor: false,
          },
          {
            id: 'stars-light-year',
            de: 'Finde heraus, wie weit ein Lichtjahr ist.',
            en: 'Find out how far a light-year is.',
            link: lex('light-year'),
            outdoor: false,
          },
          {
            id: 'stars-neighbors',
            de: 'Flieg in 3D zu unseren Nachbarsternen und such Proxima Centauri.',
            en: 'Fly to our neighboring stars in 3D and find Proxima Centauri.',
            link: '#/system/nachbarn',
            outdoor: false,
          },
          {
            id: 'stars-myths',
            de: 'Lies eine Sternbild-Sage – so haben sich Menschen früher den Himmel gemerkt.',
            en: 'Read a constellation myth – this is how people used to remember the sky.',
            link: '#/wissen/mythen',
            outdoor: false,
          },
        ],
      },
      {
        id: 'milky-way',
        de: {
          title: 'Etappe 6: Die Milchstraße',
          text: 'Die Sonne ist nur einer von 100 bis 400 Milliarden Sternen unserer Galaxie, der Milchstraße. Sie ist eine flache Scheibe mit Spiralarmen und rund 100.000 Lichtjahren Durchmesser; für eine Runde um das Zentrum braucht die Sonne etwa 230 Millionen Jahre. Im Zentrum sitzt ein riesiges Schwarzes Loch mit rund vier Millionen Sonnenmassen.',
        },
        en: {
          title: 'Stage 6: The Milky Way',
          text: 'The Sun is just one of 100 to 400 billion stars in our galaxy, the Milky Way. It is a flat disk with spiral arms about 100,000 light-years across, and the Sun takes about 230 million years to circle its center once. At the center sits a giant black hole with about four million times the mass of the Sun.',
        },
        tasks: [
          {
            id: 'milky-way-read',
            de: 'Lies im Lexikon, warum wir die Milchstraße als Band am Himmel sehen.',
            en: 'Read in the lexicon why we see the Milky Way as a band across the sky.',
            link: lex('milky-way'),
            outdoor: false,
          },
          {
            id: 'milky-way-center',
            de: 'Zeig dir in der Sternkarte das Sternbild Schütze – dahinter liegt das Zentrum der Milchstraße.',
            en: 'Show Sagittarius in the sky map – the center of the Milky Way lies behind it.',
            link: con('Sgr'),
            outdoor: false,
          },
          {
            id: 'milky-way-black-hole',
            de: 'Finde heraus, was ein Schwarzes Loch ist.',
            en: 'Find out what a black hole is.',
            link: lex('black-holes'),
            outdoor: false,
          },
          {
            id: 'milky-way-gallery',
            de: 'Such in der Galerie ein Bild von einem Nebel, in dem neue Sterne entstehen.',
            en: 'Find a picture of a nebula where new stars are forming in the gallery.',
            link: GALLERY,
            outdoor: false,
          },
        ],
      },
      {
        id: 'galaxies',
        de: {
          title: 'Etappe 7: Die Galaxien',
          text: 'Die Milchstraße ist nur eine von Hunderten Milliarden Galaxien. Unsere große Nachbarin, die Andromedagalaxie, ist 2,5 Millionen Lichtjahre entfernt und trotzdem in dunklen Nächten mit bloßem Auge zu sehen. Ihr Licht hat sich auf den Weg gemacht, als es noch keine Menschen wie uns gab.',
        },
        en: {
          title: 'Stage 7: Galaxies',
          text: 'The Milky Way is just one of hundreds of billions of galaxies. Our big neighbor, the Andromeda Galaxy, is 2.5 million light-years away, yet you can see it with the naked eye on dark nights. Its light set out before there were any humans like us.',
        },
        tasks: [
          {
            id: 'galaxies-read',
            de: 'Lies im Lexikon, welche Formen Galaxien haben können.',
            en: 'Read in the lexicon what shapes galaxies can have.',
            link: lex('galaxies'),
            outdoor: false,
          },
          {
            id: 'galaxies-m31',
            de: 'Zeig dir in der Sternkarte, wo die Andromedagalaxie steht.',
            en: 'Show the Andromeda Galaxy in the sky map.',
            link: dso('M31'),
            outdoor: false,
          },
          {
            id: 'galaxies-gallery',
            de: 'Such dir in der Galerie das schönste Galaxienbild von Hubble oder Webb aus.',
            en: 'Pick the most beautiful galaxy image from Hubble or Webb in the gallery.',
            link: GALLERY,
            outdoor: false,
          },
        ],
      },
      {
        id: 'universe',
        de: {
          title: 'Ziel: Das Universum',
          text: 'Das Universum ist vor rund 13,8 Milliarden Jahren mit dem Urknall entstanden und dehnt sich seitdem aus. Je weiter wir hinausschauen, desto tiefer blicken wir in die Vergangenheit: Das Webb-Teleskop sieht Galaxien, wie sie nur wenige hundert Millionen Jahre nach dem Urknall aussahen. Und um viele Sterne kreisen Planeten – vielleicht gibt es irgendwo eine zweite Erde.',
        },
        en: {
          title: 'Destination: The universe',
          text: 'The universe began about 13.8 billion years ago with the Big Bang and has been expanding ever since. The farther out we look, the further back in time we see: the Webb telescope spots galaxies as they were just a few hundred million years after the Big Bang. And many stars have planets – maybe there is a second Earth somewhere.',
        },
        tasks: [
          {
            id: 'universe-exoplanets',
            de: 'Stöbere im Exoplaneten-Katalog und such einen Planeten, der der Erde ähnelt.',
            en: 'Browse the exoplanet catalog and look for a planet that resembles Earth.',
            link: '#/wissen/exoplaneten',
            outdoor: false,
          },
          {
            id: 'universe-gallery',
            de: 'Schau dir in der Galerie die Bilder des Webb-Teleskops an.',
            en: 'Take a look at the Webb telescope’s images in the gallery.',
            link: GALLERY,
            outdoor: false,
          },
          {
            id: 'universe-quiz',
            de: 'Mach das Quiz zu Sternen und Weltall – du weißt jetzt eine Menge!',
            en: 'Take the stars and space quiz – you know a lot by now!',
            link: '#/wissen/quiz?cat=stars',
            outdoor: false,
          },
          {
            id: 'universe-look-up',
            de: 'Schau in einer klaren Nacht nach oben: Jeder Lichtpunkt ist eine Botschaft aus der Vergangenheit.',
            en: 'On a clear night, look up: every point of light is a message from the past.',
            outdoor: true,
          },
        ],
      },
    ],
  },
];
