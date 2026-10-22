// Beobachtungslisten zum Abhaken: Himmelsschätze für das bloße Auge, Fernglas-Klassiker,
// Doppelsterne für kleine Teleskope und der vollständige Caldwell-Katalog (C1–C109).
//
// Koordinaten: J2000 in Grad, mit CDS Sesame (SIMBAD) aufgelöst und auf 3 Nachkommastellen gerundet.
// Ausgedehnte Gebiete (Milchstraßenzentrum, Kohlensack, Kembles Kaskade) haben sinnvolle Mittelpunkte,
// der Doppelsternhaufen den Mittelpunkt zwischen NGC 869 und NGC 884.
// Sternbilder mit astronomy-engine (IAU-Grenzen) geprüft. Helligkeiten und Größen: SIMBAD bzw.
// gängige Katalogwerte (u. a. Caldwell-Liste); Abstände der Doppelsterne nach WDS, gerundet.
// Bei Doppelsternen ist `mag` die Helligkeit des Hauptsterns; der Abstand von Alpha Centauri
// ändert sich merklich (Stand 2026).

export type ListObjectType =
  | 'galaxy'
  | 'open-cluster'
  | 'globular'
  | 'nebula'
  | 'planetary'
  | 'supernova-remnant'
  | 'double-star'
  | 'star'
  | 'asterism'
  | 'milky-way'
  | 'other';

export interface ListObject {
  /** Stabile ID, z. B. 'C14', 'M31', 'albireo' */
  id: string;
  /** J2000, Grad */
  ra: number;
  dec: number;
  mag: number | null;
  /** Ausdehnung, z. B. '30′' oder Abstand bei Doppelsternen '34″' */
  size?: string;
  type: ListObjectType;
  /** IAU-Kürzel des Sternbilds */
  con: string;
  /** Gebräuchlicher Name, sonst die Katalogbezeichnung */
  name: { de: string; en: string };
  /** Katalogbezeichnung, z. B. 'NGC 869' */
  desig?: string;
  /** Ein kurzer Beobachtungstipp */
  tip?: { de: string; en: string };
}

export interface ObservingList {
  id: 'naked-eye' | 'binocular' | 'double-stars' | 'caldwell';
  equipment: 'eye' | 'binoculars' | 'telescope';
  de: { title: string; text: string };
  en: { title: string; text: string };
  items: ListObject[];
}

// --- Mit bloßem Auge ---
const NAKED_EYE: ListObject[] = [
  {
    id: 'M31', ra: 10.685, dec: 41.269, mag: 3.4, size: '190′ × 60′', type: 'galaxy', con: 'And',
    name: { de: 'Andromedagalaxie', en: 'Andromeda Galaxy' }, desig: 'NGC 224',
    tip: {
      de: 'Von Mirach (β And) zwei Sterne nach Nordwesten hüpfen (μ und ν And) – knapp daneben liegt ein länglicher, milchiger Nebelfleck.',
      en: 'From Mirach (β And) hop two stars north-west via μ and ν And – right next to them lies an elongated, milky smudge.',
    },
  },
  {
    id: 'M45', ra: 56.601, dec: 24.114, mag: 1.6, size: '110′', type: 'open-cluster', con: 'Tau',
    name: { de: 'Plejaden (Siebengestirn)', en: 'Pleiades' }, desig: 'Mel 22',
    tip: {
      de: 'Verlängere die Linie von Orions Gürtel über den orangen Aldebaran hinaus – dort funkelt ein kleines Sternengrüppchen wie ein Mini-Wagen.',
      en: "Extend the line of Orion's Belt past orange Aldebaran – there a tight little group of stars sparkles like a tiny dipper.",
    },
  },
  {
    id: 'hyades', ra: 67.447, dec: 16.948, mag: 0.5, size: '330′', type: 'open-cluster', con: 'Tau',
    name: { de: 'Hyaden', en: 'Hyades' }, desig: 'Mel 25',
    tip: {
      de: 'Das große „V“ aus Sternen um den orangen Aldebaran – Aldebaran selbst steht nur zufällig davor und gehört nicht dazu.',
      en: 'The large "V" of stars around orange Aldebaran – Aldebaran just happens to lie in front and is not a member.',
    },
  },
  {
    id: 'M42', ra: 83.82, dec: -5.388, mag: 4.0, size: '85′ × 60′', type: 'nebula', con: 'Ori',
    name: { de: 'Orionnebel', en: 'Orion Nebula' }, desig: 'NGC 1976',
    tip: {
      de: 'Neben den drei Gürtelsternen hängt eine kurze Sternreihe, Orions „Schwert“ – ihr mittlerer, verschwommener „Stern“ ist der Nebel.',
      en: 'Next to the three Belt stars hangs a short row of stars, Orion\'s "Sword" – its middle, fuzzy "star" is the nebula.',
    },
  },
  {
    id: 'M44', ra: 130.054, dec: 19.621, mag: 3.7, size: '95′', type: 'open-cluster', con: 'Cnc',
    name: { de: 'Krippe (Praesepe)', en: 'Beehive Cluster' }, desig: 'NGC 2632',
    tip: {
      de: 'Etwa auf halbem Weg zwischen Regulus und den Zwillingssternen Kastor und Pollux – bei dunklem Himmel ein matter Nebelfleck.',
      en: 'Roughly halfway between Regulus and the Gemini twins Castor and Pollux – a faint misty patch under dark skies.',
    },
  },
  {
    id: 'coma-cluster', ra: 186.014, dec: 25.652, mag: 1.8, size: '275′', type: 'open-cluster', con: 'Com',
    name: { de: 'Coma-Sternhaufen', en: 'Coma Star Cluster' }, desig: 'Mel 111',
    tip: {
      de: 'Fast genau in der Mitte zwischen Denebola (Schwanz des Löwen) und Cor Caroli: ein weiter, lockerer Schwarm zarter Sterne – braucht dunklen Himmel.',
      en: "Almost exactly midway between Denebola (the Lion's tail) and Cor Caroli: a wide, loose swarm of faint stars – needs a dark sky.",
    },
  },
  {
    id: 'alpha-persei-cluster', ra: 51.617, dec: 48.975, mag: 1.2, size: '180′', type: 'open-cluster', con: 'Per',
    name: { de: 'Alpha-Persei-Haufen', en: 'Alpha Persei Cluster' }, desig: 'Mel 20',
    tip: {
      de: 'Rund um Mirfak, den hellsten Stern des Perseus, sammeln sich viele bläuliche Sterne – schon mit bloßem Auge, im Fernglas prächtig.',
      en: 'Many bluish stars gather around Mirfak, the brightest star of Perseus – visible to the eye, superb in binoculars.',
    },
  },
  {
    id: 'double-cluster', ra: 35.163, dec: 57.141, mag: 3.7, size: '30′ + 30′', type: 'open-cluster', con: 'Per',
    name: { de: 'Doppelsternhaufen h und χ Persei', en: 'Double Cluster' }, desig: 'NGC 869/884',
    tip: {
      de: 'Auf halbem Weg zwischen dem „W“ der Kassiopeia und Mirfak im Perseus – ein verdichteter, nebliger Fleck in der Milchstraße.',
      en: 'Halfway between the "W" of Cassiopeia and Mirfak in Perseus – a knotty, hazy patch in the Milky Way.',
    },
  },
  {
    id: 'mizar-alcor', ra: 200.981, dec: 54.925, mag: 2.2, size: '12′', type: 'double-star', con: 'UMa',
    name: { de: 'Mizar und Alkor', en: 'Mizar and Alcor' }, desig: 'ζ + 80 UMa',
    tip: {
      de: 'Der mittlere Deichselstern des Großen Wagens hat einen schwachen Begleiter dicht daneben – früher galt er als Augentest.',
      en: "The middle star of the Big Dipper's handle has a faint companion close by – once used as an eyesight test.",
    },
  },
  {
    id: 'M33', ra: 23.462, dec: 30.66, mag: 5.7, size: '70′ × 40′', type: 'galaxy', con: 'Tri',
    name: { de: 'Dreiecksgalaxie', en: 'Triangulum Galaxy' }, desig: 'NGC 598',
    tip: {
      de: 'Eine echte Herausforderung: Spiegle die Andromedagalaxie an Mirach – nur unter sehr dunklem Himmel zeigt sich ein hauchzarter Schimmer.',
      en: 'A real challenge: mirror the Andromeda Galaxy across Mirach – only under a very dark sky does a faint glow appear.',
    },
  },
  {
    id: 'milky-way-core', ra: 266.417, dec: -29.008, mag: null, type: 'milky-way', con: 'Sgr',
    name: { de: 'Zentrum der Milchstraße', en: 'Milky Way core' },
    tip: {
      de: 'Rund um die „Teekanne“ des Schützen ist die Milchstraße am hellsten und breitesten – das Zentrum unserer Galaxis liegt verborgen hinter Staub.',
      en: 'Around the "Teapot" of Sagittarius the Milky Way is at its brightest and widest – the centre of our galaxy lies hidden behind the dust.',
    },
  },
  {
    id: 'M24', ra: 274.2, dec: -18.55, mag: 4.6, size: '2° × 1°', type: 'milky-way', con: 'Sgr',
    name: { de: 'Sagittarius-Sternwolke', en: 'Sagittarius Star Cloud' }, desig: 'IC 4715',
    tip: {
      de: 'Ein auffällig heller, länglicher Fleck in der Milchstraße nördlich der „Teekanne“ – unzählige Sterne in einem Fenster zwischen Staubwolken.',
      en: 'A strikingly bright, elongated patch in the Milky Way north of the "Teapot" – countless stars seen through a window between dust clouds.',
    },
  },
  {
    id: 'M8', ra: 270.904, dec: -24.387, mag: 6.0, size: '90′ × 40′', type: 'nebula', con: 'Sgr',
    name: { de: 'Lagunennebel', en: 'Lagoon Nebula' }, desig: 'NGC 6523',
    tip: {
      de: 'Etwa sechs Grad nördlich der Tülle der „Teekanne“ – unter dunklem Himmel ein kleiner, heller Knoten in der Milchstraße.',
      en: 'About six degrees north of the spout of the "Teapot" – a small bright knot in the Milky Way under dark skies.',
    },
  },
  {
    id: 'M7', ra: 268.447, dec: -34.841, mag: 3.3, size: '80′', type: 'open-cluster', con: 'Sco',
    name: { de: 'Ptolemäus-Haufen', en: "Ptolemy's Cluster" }, desig: 'NGC 6475',
    tip: {
      de: 'Wenige Grad nordöstlich vom Stachel des Skorpions – ein heller Nebelfleck, der im Fernglas in Dutzende Sterne zerfällt.',
      en: "A few degrees north-east of the Scorpion's sting – a bright hazy patch that breaks into dozens of stars in binoculars.",
    },
  },
  {
    id: 'lmc', ra: 80.894, dec: -69.756, mag: 0.9, size: '11° × 9°', type: 'galaxy', con: 'Dor',
    name: { de: 'Große Magellansche Wolke', en: 'Large Magellanic Cloud' }, desig: 'LMC',
    tip: {
      de: 'Wirkt wie ein abgerissenes Stück Milchstraße hoch am Südhimmel – eine Begleitgalaxie unserer Milchstraße, nur von weiter südlich aus sichtbar.',
      en: 'Looks like a torn-off piece of the Milky Way high in the southern sky – a companion galaxy of ours, visible only from further south.',
    },
  },
  {
    id: 'smc', ra: 13.158, dec: -72.8, mag: 2.7, size: '5° × 3°', type: 'galaxy', con: 'Tuc',
    name: { de: 'Kleine Magellansche Wolke', en: 'Small Magellanic Cloud' }, desig: 'SMC',
    tip: {
      de: 'Ein kleinerer Nebelfleck gleich neben dem Kugelsternhaufen 47 Tucanae – wie eine Wolke, die nie weiterzieht.',
      en: 'A smaller misty patch right next to the globular cluster 47 Tucanae – like a cloud that never drifts away.',
    },
  },
  {
    id: '47-tucanae', ra: 6.022, dec: -72.081, mag: 4.0, size: '31′', type: 'globular', con: 'Tuc',
    name: { de: '47 Tucanae', en: '47 Tucanae' }, desig: 'NGC 104',
    tip: {
      de: 'Direkt neben der Kleinen Magellanschen Wolke: ein „unscharfer Stern“, der im Fernglas zu einem hellen Ball mit dichtem Kern wird.',
      en: 'Right next to the Small Magellanic Cloud: a "fuzzy star" that turns into a bright ball with a dense core in binoculars.',
    },
  },
  {
    id: 'omega-centauri', ra: 201.697, dec: -47.479, mag: 3.7, size: '36′', type: 'globular', con: 'Cen',
    name: { de: 'Omega Centauri', en: 'Omega Centauri' }, desig: 'NGC 5139',
    tip: {
      de: 'Etwa anderthalb Faustbreiten nördlich von Hadar (Beta Centauri) sitzt ein runder, nebliger „Stern“ – der größte Kugelsternhaufen der Milchstraße.',
      en: 'About one and a half fist-widths north of Hadar (Beta Centauri) sits a round, fuzzy "star" – the largest globular cluster of the Milky Way.',
    },
  },
  {
    id: 'carina-nebula', ra: 161.259, dec: -59.7, mag: 1.0, size: '120′', type: 'nebula', con: 'Car',
    name: { de: 'Carinanebel', en: 'Carina Nebula' }, desig: 'NGC 3372',
    tip: {
      de: 'Ein heller Knoten in der südlichen Milchstraße, westlich vom Kreuz des Südens – viel größer und heller als der Orionnebel.',
      en: 'A bright knot in the southern Milky Way, west of the Southern Cross – much larger and brighter than the Orion Nebula.',
    },
  },
  {
    id: 'ic2602', ra: 160.613, dec: -64.426, mag: 1.9, size: '50′', type: 'open-cluster', con: 'Car',
    name: { de: 'Südliche Plejaden', en: 'Southern Pleiades' }, desig: 'IC 2602',
    tip: {
      de: 'Rund um den hellen Stern Theta Carinae – ein Sternhäufchen, das an die Plejaden erinnert, nur etwas lockerer.',
      en: 'Around the bright star Theta Carinae – a little group of stars reminiscent of the Pleiades, just a bit looser.',
    },
  },
  {
    id: 'coalsack', ra: 192.5, dec: -62.5, mag: null, size: '7° × 5°', type: 'nebula', con: 'Cru',
    name: { de: 'Kohlensack', en: 'Coalsack' },
    tip: {
      de: 'Ein dunkles Loch in der Milchstraße direkt neben dem Kreuz des Südens – eine Staubwolke, die das Licht der Sterne dahinter verschluckt.',
      en: 'A dark hole in the Milky Way right beside the Southern Cross – a dust cloud that swallows the light of the stars behind it.',
    },
  },
];

// --- Fernglas ---
const BINOCULAR: ListObject[] = [
  {
    id: 'M45', ra: 56.601, dec: 24.114, mag: 1.6, size: '110′', type: 'open-cluster', con: 'Tau',
    name: { de: 'Plejaden (Siebengestirn)', en: 'Pleiades' }, desig: 'Mel 22',
    tip: {
      de: 'Im Fernglas ein Gewimmel aus Dutzenden blauweißen Sternen – passt perfekt ins Gesichtsfeld.',
      en: 'In binoculars a swarm of dozens of blue-white stars – it fits the field of view perfectly.',
    },
  },
  {
    id: 'double-cluster', ra: 35.163, dec: 57.141, mag: 3.7, size: '30′ + 30′', type: 'open-cluster', con: 'Per',
    name: { de: 'Doppelsternhaufen h und χ Persei', en: 'Double Cluster' }, desig: 'NGC 869/884',
    tip: {
      de: 'Zwei dichte Haufen nebeneinander im selben Gesichtsfeld – achte auf einzelne orangefarbene Sterne zwischen den weißen.',
      en: 'Two dense clusters side by side in the same field – look for a few orange stars among the white ones.',
    },
  },
  {
    id: 'M31', ra: 10.685, dec: 41.269, mag: 3.4, size: '190′ × 60′', type: 'galaxy', con: 'And',
    name: { de: 'Andromedagalaxie', en: 'Andromeda Galaxy' }, desig: 'NGC 224',
    tip: {
      de: 'Das Fernglas zeigt einen hellen Kern in einem langgezogenen Oval – mit Glück auch die kleine Begleitgalaxie M32.',
      en: 'Binoculars show a bright core inside a long oval – with luck the small companion galaxy M32 as well.',
    },
  },
  {
    id: 'M33', ra: 23.462, dec: 30.66, mag: 5.7, size: '70′ × 40′', type: 'galaxy', con: 'Tri',
    name: { de: 'Dreiecksgalaxie', en: 'Triangulum Galaxy' }, desig: 'NGC 598',
    tip: {
      de: 'Groß, aber blass – halte das Fernglas ruhig und schau leicht daneben, dann taucht ein runder Schimmer auf.',
      en: 'Large but faint – hold the binoculars steady and look slightly to one side, and a round glow appears.',
    },
  },
  {
    id: 'M42', ra: 83.82, dec: -5.388, mag: 4.0, size: '85′ × 60′', type: 'nebula', con: 'Ori',
    name: { de: 'Orionnebel', en: 'Orion Nebula' }, desig: 'NGC 1976',
    tip: {
      de: 'Im Fernglas ein fächerförmiger Nebel mit einem Grüppchen heller Sterne in der Mitte.',
      en: 'Binoculars show a fan-shaped glow with a little group of bright stars at its heart.',
    },
  },
  {
    id: 'M44', ra: 130.054, dec: 19.621, mag: 3.7, size: '95′', type: 'open-cluster', con: 'Cnc',
    name: { de: 'Krippe (Praesepe)', en: 'Beehive Cluster' }, desig: 'NGC 2632',
    tip: {
      de: 'Der matte Nebelfleck löst sich im Fernglas in einen Schwarm von gut 50 Sternen auf.',
      en: 'In binoculars the faint misty patch breaks up into a swarm of 50 or more stars.',
    },
  },
  {
    id: 'coathanger', ra: 291.35, dec: 20.183, mag: 3.6, size: '60′', type: 'asterism', con: 'Vul',
    name: { de: 'Kleiderbügel (Brocchis Haufen)', en: "Coathanger (Brocchi's Cluster)" }, desig: 'Cr 399',
    tip: {
      de: 'Etwa ein Drittel des Weges von Atair nach Wega: eine gerade Sternreihe mit einem kleinen Haken daran – wie ein Kleiderbügel.',
      en: 'About a third of the way from Altair to Vega: a straight row of stars with a little hook attached – just like a coat hanger.',
    },
  },
  {
    id: 'kembles-cascade', ra: 60, dec: 63, mag: null, size: '150′', type: 'asterism', con: 'Cam',
    name: { de: 'Kembles Kaskade', en: "Kemble's Cascade" }, desig: 'Kemble 1',
    tip: {
      de: 'Eine fast schnurgerade Kette aus über 20 Sternen in der Giraffe, die an einem Ende im kleinen Haufen NGC 1502 mündet.',
      en: 'An almost dead-straight chain of more than 20 stars in Camelopardalis that ends in the small cluster NGC 1502.',
    },
  },
  {
    id: 'alpha-persei-cluster', ra: 51.617, dec: 48.975, mag: 1.2, size: '180′', type: 'open-cluster', con: 'Per',
    name: { de: 'Alpha-Persei-Haufen', en: 'Alpha Persei Cluster' }, desig: 'Mel 20',
    tip: {
      de: 'Eine der schönsten Sterngruppen fürs Fernglas: Ketten bläulicher Sterne rund um den gelblichen Mirfak.',
      en: 'One of the finest binocular star groups: chains of bluish stars around yellowish Mirfak.',
    },
  },
  {
    id: 'M13', ra: 250.423, dec: 36.461, mag: 5.8, size: '20′', type: 'globular', con: 'Her',
    name: { de: 'Herkuleshaufen', en: 'Hercules Cluster' }, desig: 'NGC 6205',
    tip: {
      de: 'Auf der Linie zwischen den Trapezsternen Eta und Zeta Herculis, näher an Eta – im Fernglas ein runder, heller Wattebausch.',
      en: 'On the line between the Keystone stars Eta and Zeta Herculis, closer to Eta – a round, bright cotton ball in binoculars.',
    },
  },
  {
    id: 'M81', ra: 148.888, dec: 69.065, mag: 6.9, size: '27′ × 14′', type: 'galaxy', con: 'UMa',
    name: { de: 'Bodes Galaxie (mit M82)', en: "Bode's Galaxy (with M82)" }, desig: 'NGC 3031',
    tip: {
      de: 'Verlängere die Diagonale im Kasten des Großen Wagens von Phekda über Dubhe um etwa die gleiche Länge – dort liegt ein ovaler Schimmer, M82 als schmaler Strich daneben.',
      en: "Extend the diagonal of the Big Dipper's bowl from Phecda through Dubhe by about the same length – there lies an oval glow, with M82 as a thin streak nearby.",
    },
  },
  {
    id: 'M35', ra: 92.272, dec: 24.336, mag: 5.1, size: '28′', type: 'open-cluster', con: 'Gem',
    name: { de: 'M35', en: 'M35' }, desig: 'NGC 2168',
    tip: {
      de: 'An den Füßen der Zwillinge, nahe Eta Geminorum – ein großer, körniger Sternhaufen, so breit wie der Vollmond.',
      en: 'At the feet of the Twins, near Eta Geminorum – a large, grainy star cluster as wide as the full Moon.',
    },
  },
  {
    id: 'M37', ra: 88.074, dec: 32.545, mag: 5.6, size: '24′', type: 'open-cluster', con: 'Aur',
    name: { de: 'M37', en: 'M37' }, desig: 'NGC 2099',
    tip: {
      de: 'Der hellste von drei Haufen im Fuhrmann – schwenke weiter zu M36 und M38 und vergleiche: M37 wirkt am dichtesten.',
      en: 'The brightest of three clusters in Auriga – sweep on to M36 and M38 and compare: M37 looks the richest.',
    },
  },
  {
    id: 'M11', ra: 282.766, dec: -6.272, mag: 5.8, size: '14′', type: 'open-cluster', con: 'Sct',
    name: { de: 'Wildentenhaufen', en: 'Wild Duck Cluster' }, desig: 'NGC 6705',
    tip: {
      de: 'Im kleinen Sternbild Schild, wo die Milchstraße besonders hell ist – ein kompakter, keilförmiger Haufen.',
      en: 'In the little constellation Scutum, where the Milky Way is especially bright – a compact, wedge-shaped cluster.',
    },
  },
  {
    id: 'M27', ra: 299.902, dec: 22.721, mag: 7.5, size: '8′ × 6′', type: 'planetary', con: 'Vul',
    name: { de: 'Hantelnebel', en: 'Dumbbell Nebula' }, desig: 'NGC 6853',
    tip: {
      de: 'Gut drei Grad nördlich der Pfeilspitze (Gamma Sagittae) – ein kleines, rundliches Nebelfleckchen zwischen den Sternen.',
      en: "Just over three degrees north of the Arrow's tip (Gamma Sagittae) – a small, roundish glow among the stars.",
    },
  },
  {
    id: 'M8', ra: 270.904, dec: -24.387, mag: 6.0, size: '90′ × 40′', type: 'nebula', con: 'Sgr',
    name: { de: 'Lagunennebel', en: 'Lagoon Nebula' }, desig: 'NGC 6523',
    tip: {
      de: 'Im Fernglas ein länglicher Nebel mit einem Sternhaufen darin – der kleinere Trifidnebel M20 liegt knapp nördlich.',
      en: 'In binoculars an elongated glow with a star cluster inside – the smaller Trifid Nebula M20 lies just to the north.',
    },
  },
  {
    id: 'M22', ra: 279.1, dec: -23.905, mag: 5.1, size: '32′', type: 'globular', con: 'Sgr',
    name: { de: 'M22', en: 'M22' }, desig: 'NGC 6656',
    tip: {
      de: 'Gut zwei Grad nordöstlich von Kaus Borealis, dem Deckelstern der „Teekanne“ – einer der hellsten Kugelsternhaufen überhaupt.',
      en: 'About two degrees north-east of Kaus Borealis, the lid star of the "Teapot" – one of the brightest globular clusters of all.',
    },
  },
  {
    id: 'M24', ra: 274.2, dec: -18.55, mag: 4.6, size: '2° × 1°', type: 'milky-way', con: 'Sgr',
    name: { de: 'Sagittarius-Sternwolke', en: 'Sagittarius Star Cloud' }, desig: 'IC 4715',
    tip: {
      de: 'Schwenke langsam durch die Sternwolke – das Fernglas zeigt einen fast lückenlosen Teppich winziger Sterne.',
      en: 'Sweep slowly across the star cloud – binoculars show a nearly seamless carpet of tiny stars.',
    },
  },
  {
    id: 'M6', ra: 265.069, dec: -32.242, mag: 4.2, size: '25′', type: 'open-cluster', con: 'Sco',
    name: { de: 'Schmetterlingshaufen', en: 'Butterfly Cluster' }, desig: 'NGC 6405',
    tip: {
      de: 'Knapp vier Grad nordwestlich von M7 beim Stachel des Skorpions – mit etwas Fantasie ein Schmetterling mit ausgebreiteten Flügeln.',
      en: "Just under four degrees north-west of M7 near the Scorpion's sting – with a little imagination a butterfly with spread wings.",
    },
  },
  {
    id: 'M7', ra: 268.447, dec: -34.841, mag: 3.3, size: '80′', type: 'open-cluster', con: 'Sco',
    name: { de: 'Ptolemäus-Haufen', en: "Ptolemy's Cluster" }, desig: 'NGC 6475',
    tip: {
      de: 'Ein großer, heller Haufen, der das Gesichtsfeld füllt – am schönsten bei geringer Vergrößerung.',
      en: 'A large, bright cluster that fills the field of view – best at low magnification.',
    },
  },
  {
    id: 'M4', ra: 245.897, dec: -26.526, mag: 5.6, size: '36′', type: 'globular', con: 'Sco',
    name: { de: 'M4', en: 'M4' }, desig: 'NGC 6121',
    tip: {
      de: 'Nur gut ein Grad westlich vom roten Antares – ein großer, blasser runder Fleck.',
      en: 'Just over a degree west of red Antares – a large, pale round patch.',
    },
  },
  {
    id: 'M41', ra: 101.499, dec: -20.716, mag: 4.5, size: '38′', type: 'open-cluster', con: 'CMa',
    name: { de: 'M41', en: 'M41' }, desig: 'NGC 2287',
    tip: {
      de: 'Vier Grad südlich von Sirius – ein reicher Haufen mit einem orangefarbenen Stern nahe der Mitte.',
      en: 'Four degrees south of Sirius – a rich cluster with an orange star near its centre.',
    },
  },
  {
    id: 'ic2602', ra: 160.613, dec: -64.426, mag: 1.9, size: '50′', type: 'open-cluster', con: 'Car',
    name: { de: 'Südliche Plejaden', en: 'Southern Pleiades' }, desig: 'IC 2602',
    tip: {
      de: 'Im Fernglas glitzern rund um Theta Carinae etwa zwei Dutzend blauweiße Sterne.',
      en: 'In binoculars around two dozen blue-white stars sparkle around Theta Carinae.',
    },
  },
  {
    id: 'jewel-box', ra: 193.415, dec: -60.371, mag: 4.2, size: '10′', type: 'open-cluster', con: 'Cru',
    name: { de: 'Schmuckkästchen', en: 'Jewel Box' }, desig: 'NGC 4755',
    tip: {
      de: 'Dicht neben Mimosa (Beta Crucis) im Kreuz des Südens – ein kleines Häufchen, in dem ein roter Stern zwischen blauweißen leuchtet.',
      en: 'Close to Mimosa (Beta Crucis) in the Southern Cross – a small cluster where a red star glows among blue-white ones.',
    },
  },
  {
    id: 'omega-centauri', ra: 201.697, dec: -47.479, mag: 3.7, size: '36′', type: 'globular', con: 'Cen',
    name: { de: 'Omega Centauri', en: 'Omega Centauri' }, desig: 'NGC 5139',
    tip: {
      de: 'Im Fernglas eine große, helle Kugel, die zum Rand hin allmählich ausfranst.',
      en: 'In binoculars a large, bright ball that gradually frays towards its edge.',
    },
  },
  {
    id: '47-tucanae', ra: 6.022, dec: -72.081, mag: 4.0, size: '31′', type: 'globular', con: 'Tuc',
    name: { de: '47 Tucanae', en: '47 Tucanae' }, desig: 'NGC 104',
    tip: {
      de: 'Heller als jeder Kugelsternhaufen des Nordhimmels – achte auf den sehr hellen, fast sternförmigen Kern.',
      en: 'Brighter than any globular cluster of the northern sky – note the very bright, almost star-like core.',
    },
  },
  {
    id: 'carina-nebula', ra: 161.259, dec: -59.7, mag: 1.0, size: '120′', type: 'nebula', con: 'Car',
    name: { de: 'Carinanebel', en: 'Carina Nebula' }, desig: 'NGC 3372',
    tip: {
      de: 'Ein großes, verzweigtes Nebelfeld mit einem dunklen „V“ aus Staub – mittendrin leuchtet der orangefarbene Riesenstern Eta Carinae.',
      en: 'A large, branching field of nebulosity crossed by a dark "V" of dust – with the orange giant star Eta Carinae glowing inside.',
    },
  },
  {
    id: 'ngc2516', ra: 119.527, dec: -60.8, mag: 3.8, size: '30′', type: 'open-cluster', con: 'Car',
    name: { de: 'NGC 2516', en: 'NGC 2516' }, desig: 'NGC 2516',
    tip: {
      de: 'Gut drei Grad westlich von Avior (Epsilon Carinae) – ein heller, reicher Haufen, auch „Südliche Krippe“ genannt.',
      en: 'Some three degrees west of Avior (Epsilon Carinae) – a bright, rich cluster also called the "Southern Beehive".',
    },
  },
  {
    id: 'ngc3532', ra: 166.417, dec: -58.707, mag: 3.0, size: '55′', type: 'open-cluster', con: 'Car',
    name: { de: 'Wunschbrunnen-Haufen', en: 'Wishing Well Cluster' }, desig: 'NGC 3532',
    tip: {
      de: 'Wenige Grad östlich vom Carinanebel – ein länglicher, sternreicher Haufen, der schon mit bloßem Auge auffällt.',
      en: 'A few degrees east of the Carina Nebula – an elongated, star-rich cluster already noticeable to the naked eye.',
    },
  },
  {
    id: 'ngc6231', ra: 253.545, dec: -41.812, mag: 2.6, size: '15′', type: 'open-cluster', con: 'Sco',
    name: { de: 'NGC 6231', en: 'NGC 6231' }, desig: 'NGC 6231',
    tip: {
      de: 'Im Schwanz des Skorpions, knapp nördlich von Zeta Scorpii – ein kompaktes Häufchen heller, junger Sterne.',
      en: "In the Scorpion's tail, just north of Zeta Scorpii – a compact knot of bright, young stars.",
    },
  },
  {
    id: 'ngc253', ra: 11.888, dec: -25.289, mag: 7.1, size: '28′ × 7′', type: 'galaxy', con: 'Scl',
    name: { de: 'Sculptor-Galaxie', en: 'Sculptor Galaxy' }, desig: 'NGC 253',
    tip: {
      de: 'Etwa sieben Grad südlich von Diphda (Beta Ceti) – eine lange, schmale Spindel, die wir fast genau von der Kante sehen.',
      en: 'About seven degrees south of Diphda (Beta Ceti) – a long, narrow spindle seen almost exactly edge-on.',
    },
  },
  {
    id: 'tarantula', ra: 84.675, dec: -69.1, mag: 8.0, size: '40′ × 25′', type: 'nebula', con: 'Dor',
    name: { de: 'Tarantelnebel', en: 'Tarantula Nebula' }, desig: 'NGC 2070',
    tip: {
      de: 'Ein auffälliger Nebelknoten in der Großen Magellanschen Wolke – ein riesiges Sternentstehungsgebiet in einer anderen Galaxie.',
      en: 'A conspicuous knot of nebulosity in the Large Magellanic Cloud – a huge star-forming region in another galaxy.',
    },
  },
];

// --- Doppelsterne (mag = Hauptstern, size = Abstand) ---
const DOUBLE_STARS: ListObject[] = [
  {
    id: 'albireo', ra: 292.68, dec: 27.96, mag: 3.1, size: '34″', type: 'double-star', con: 'Cyg',
    name: { de: 'Albireo', en: 'Albireo' }, desig: 'β Cyg',
    tip: {
      de: 'Am Kopf des Schwans, dem Fuß des Kreuzes – schon bei geringer Vergrößerung ein goldgelber und ein blauer Stern nebeneinander.',
      en: "At the Swan's head, the foot of the Northern Cross – even at low power a golden and a blue star side by side.",
    },
  },
  {
    id: 'mizar', ra: 200.981, dec: 54.925, mag: 2.2, size: '14″', type: 'double-star', con: 'UMa',
    name: { de: 'Mizar', en: 'Mizar' }, desig: 'ζ UMa',
    tip: {
      de: 'Im Teleskop zerfällt der mittlere Deichselstern des Großen Wagens in zwei weiße Sterne – Alkor steht weit daneben.',
      en: "In a telescope the middle star of the Big Dipper's handle splits into two white stars – Alcor stands far off to the side.",
    },
  },
  {
    id: 'epsilon-lyrae', ra: 281.085, dec: 39.67, mag: 4.7, size: '209″', type: 'double-star', con: 'Lyr',
    name: { de: 'Doppeldoppelstern (ε Lyrae)', en: 'Double Double (ε Lyrae)' }, desig: 'ε Lyr',
    tip: {
      de: 'Knapp zwei Grad nordöstlich von Wega: Für scharfe Augen ein Paar – und bei 100-facher Vergrößerung zerfällt jeder der beiden noch einmal in zwei Sterne.',
      en: 'Just under two degrees north-east of Vega: a pair for keen eyes – and at 100× each of the two splits once more into two stars.',
    },
  },
  {
    id: 'castor', ra: 113.649, dec: 31.888, mag: 1.9, size: '5″', type: 'double-star', con: 'Gem',
    name: { de: 'Kastor', en: 'Castor' }, desig: 'α Gem',
    tip: {
      de: 'Der nördlichere der beiden Zwillingsköpfe: zwei weiße Sterne dicht beieinander, die sich in rund 450 Jahren umkreisen.',
      en: 'The more northerly of the two Twin heads: two white stars close together that orbit each other in roughly 450 years.',
    },
  },
  {
    id: 'almach', ra: 30.975, dec: 42.33, mag: 2.3, size: '10″', type: 'double-star', con: 'And',
    name: { de: 'Alamak', en: 'Almach' }, desig: 'γ And',
    tip: {
      de: 'Der östlichste helle Stern der Andromeda: ein orangefarbener Stern mit einem kleinen, tiefblauen Begleiter – wie Albireo, nur enger.',
      en: 'The easternmost bright star of Andromeda: an orange star with a small, deep-blue companion – like Albireo, only tighter.',
    },
  },
  {
    id: 'alpha-centauri', ra: 219.902, dec: -60.834, mag: 0.0, size: '10″', type: 'double-star', con: 'Cen',
    name: { de: 'Alpha Centauri', en: 'Alpha Centauri' }, desig: 'α Cen',
    tip: {
      de: 'Unser nächster Sternnachbar: zwei gelbliche Sonnen, die sich in 80 Jahren umrunden – ihr Abstand am Himmel ändert sich daher von Jahr zu Jahr.',
      en: 'Our nearest stellar neighbour: two yellowish suns that circle each other every 80 years – so their separation changes from year to year.',
    },
  },
  {
    id: 'acrux', ra: 186.65, dec: -63.099, mag: 1.3, size: '4″', type: 'double-star', con: 'Cru',
    name: { de: 'Acrux', en: 'Acrux' }, desig: 'α Cru',
    tip: {
      de: 'Der Fußstern des Kreuz des Südens: zwei fast gleich helle, bläulich-weiße Sterne dicht beieinander.',
      en: 'The foot of the Southern Cross: two nearly equal, bluish-white stars close together.',
    },
  },
  {
    id: 'rigel', ra: 78.634, dec: -8.202, mag: 0.1, size: '9″', type: 'double-star', con: 'Ori',
    name: { de: 'Rigel', en: 'Rigel' }, desig: 'β Ori',
    tip: {
      de: 'Der kleine Begleiter wird vom grellen Rigel fast überstrahlt – bei ruhiger Luft und 100-facher Vergrößerung aber gut sichtbar.',
      en: 'The small companion is almost drowned out by brilliant Rigel – but in steady air at 100× it shows up well.',
    },
  },
  {
    id: 'cor-caroli', ra: 194.007, dec: 38.318, mag: 2.9, size: '19″', type: 'double-star', con: 'CVn',
    name: { de: 'Cor Caroli', en: 'Cor Caroli' }, desig: 'α CVn',
    tip: {
      de: 'Südlich der Deichsel des Großen Wagens: ein weißer Hauptstern mit einem schwächeren Begleiter, schon bei geringer Vergrößerung leicht zu trennen.',
      en: "South of the Big Dipper's handle: a white main star with a fainter companion, easy to split even at low power.",
    },
  },
  {
    id: 'polaris', ra: 37.955, dec: 89.264, mag: 2.0, size: '18″', type: 'double-star', con: 'UMi',
    name: { de: 'Polarstern', en: 'Polaris' }, desig: 'α UMi',
    tip: {
      de: 'Der Polarstern hat einen schwachen Begleiter 9. Größe – ab etwa 60 mm Öffnung als winziges Pünktchen erkennbar.',
      en: 'Polaris has a faint 9th-magnitude companion – visible as a tiny dot from about 60 mm of aperture.',
    },
  },
  {
    id: 'izar', ra: 221.247, dec: 27.074, mag: 2.6, size: '3″', type: 'double-star', con: 'Boo',
    name: { de: 'Izar', en: 'Izar' }, desig: 'ε Boo',
    tip: {
      de: 'Rund zehn Grad nordöstlich von Arktur: ein oranger Stern mit einem dicht anliegenden, bläulichen Begleiter – braucht ruhige Luft und gut 100-fach.',
      en: 'About ten degrees north-east of Arcturus: an orange star with a close bluish companion – needs steady air and 100× or more.',
    },
  },
  {
    id: 'gamma-delphini', ra: 311.665, dec: 16.124, mag: 4.4, size: '9″', type: 'double-star', con: 'Del',
    name: { de: 'Gamma Delphini', en: 'Gamma Delphini' }, desig: 'γ Del',
    tip: {
      de: 'An der Ostecke der kleinen Raute im Delfin: ein goldgelber und ein grünlich-weißer Stern – ein schönes Farbpaar.',
      en: "At the eastern corner of the Dolphin's little diamond: a golden-yellow and a greenish-white star – a lovely colour pair.",
    },
  },
  {
    id: 'gamma-arietis', ra: 28.383, dec: 19.294, mag: 4.5, size: '7″', type: 'double-star', con: 'Ari',
    name: { de: 'Mesarthim', en: 'Mesarthim' }, desig: 'γ Ari',
    tip: {
      de: 'Der unscheinbare Stern im Kopf des Widders entpuppt sich als zwei gleiche weiße Sterne – wie ein Paar Augen.',
      en: "The modest star in the Ram's head turns out to be two identical white stars – like a pair of eyes.",
    },
  },
  {
    id: '61-cygni', ra: 316.725, dec: 38.749, mag: 5.2, size: '32″', type: 'double-star', con: 'Cyg',
    name: { de: '61 Cygni', en: '61 Cygni' }, desig: '61 Cyg',
    tip: {
      de: 'Südöstlich von Deneb: zwei orangefarbene Zwergsterne, nur gut elf Lichtjahre entfernt – einer der ersten Sterne, deren Entfernung je gemessen wurde.',
      en: 'South-east of Deneb: two orange dwarf stars only about 11 light-years away – one of the first stars whose distance was ever measured.',
    },
  },
  {
    id: 'struve-747', ra: 83.761, dec: -6.002, mag: 4.7, size: '35″', type: 'double-star', con: 'Ori',
    name: { de: 'Struve 747', en: 'Struve 747' }, desig: 'Σ 747',
    tip: {
      de: 'Im Schwert des Orion, knapp südlich des Orionnebels – ein weites, bläulich-weißes Paar, das du beim Nebelbesuch gleich mitnehmen kannst.',
      en: "In Orion's Sword just south of the Orion Nebula – a wide, bluish-white pair to catch while you visit the nebula.",
    },
  },
  {
    id: 'beta-monocerotis', ra: 97.204, dec: -7.033, mag: 4.6, size: '7″', type: 'double-star', con: 'Mon',
    name: { de: 'Beta Monocerotis', en: 'Beta Monocerotis' }, desig: 'β Mon',
    tip: {
      de: 'Ein Dreifachstern: Bei 100-facher Vergrößerung bilden drei fast gleich helle weiße Sterne eine kleine, gebogene Kette.',
      en: 'A triple star: at 100× three nearly equal white stars form a small, curved arc.',
    },
  },
  {
    id: 'iota-cancri', ra: 131.674, dec: 28.76, mag: 4.0, size: '31″', type: 'double-star', con: 'Cnc',
    name: { de: 'Iota Cancri', en: 'Iota Cancri' }, desig: 'ι Cnc',
    tip: {
      de: 'Rund neun Grad nördlich der Krippe im Krebs: ein gelber Stern mit einem bläulichen Begleiter – fast ein kleiner Albireo.',
      en: 'About nine degrees north of the Beehive in Cancer: a yellow star with a bluish companion – almost a little Albireo.',
    },
  },
  {
    id: 'algieba', ra: 154.993, dec: 19.841, mag: 2.4, size: '5″', type: 'double-star', con: 'Leo',
    name: { de: 'Algieba', en: 'Algieba' }, desig: 'γ Leo',
    tip: {
      de: 'In der Mähne des Löwen: zwei goldgelbe Sterne dicht nebeneinander – bei 100-fach ein strahlendes Paar.',
      en: "In the Lion's mane: two golden-yellow stars close together – a radiant pair at 100×.",
    },
  },
  {
    id: 'eta-cassiopeiae', ra: 12.276, dec: 57.815, mag: 3.5, size: '13″', type: 'double-star', con: 'Cas',
    name: { de: 'Eta Cassiopeiae', en: 'Eta Cassiopeiae' }, desig: 'η Cas',
    tip: {
      de: 'Zwischen Schedar und Gamma Cassiopeiae im „W“: ein gelblicher Stern mit einem rötlich-orangen Begleiter.',
      en: 'Between Schedar and Gamma Cassiopeiae in the "W": a yellowish star with a reddish-orange companion.',
    },
  },
  {
    id: 'nu-draconis', ra: 263.044, dec: 55.184, mag: 4.9, size: '62″', type: 'double-star', con: 'Dra',
    name: { de: 'Nu Draconis', en: 'Nu Draconis' }, desig: 'ν Dra',
    tip: {
      de: 'Im Kopf des Drachen: zwei gleich helle weiße Sterne, so weit getrennt, dass schon ein gutes Fernglas genügt.',
      en: "In the Dragon's head: two equally bright white stars, so far apart that good binoculars are enough.",
    },
  },
  {
    id: 'beta-scorpii', ra: 241.359, dec: -19.805, mag: 2.6, size: '14″', type: 'double-star', con: 'Sco',
    name: { de: 'Acrab', en: 'Acrab' }, desig: 'β Sco',
    tip: {
      de: 'Der nördlichste der drei Kopfsterne des Skorpions: ein heller weißer Stern mit einem deutlich schwächeren Begleiter.',
      en: "The northernmost of the three stars in the Scorpion's head: a bright white star with a clearly fainter companion.",
    },
  },
  {
    id: 'delta-cephei', ra: 337.293, dec: 58.415, mag: 3.9, size: '41″', type: 'double-star', con: 'Cep',
    name: { de: 'Delta Cephei', en: 'Delta Cephei' }, desig: 'δ Cep',
    tip: {
      de: 'Der berühmte veränderliche Stern hat einen weiten bläulichen Begleiter – der Hauptstern wird alle gut fünf Tage merklich heller und wieder schwächer.',
      en: 'The famous variable star has a wide bluish companion – the main star brightens and fades noticeably every five days or so.',
    },
  },
  {
    id: 'trapezium', ra: 83.819, dec: -5.39, mag: 5.1, size: '9″–21″', type: 'double-star', con: 'Ori',
    name: { de: 'Trapez', en: 'Trapezium' }, desig: 'θ¹ Ori',
    tip: {
      de: 'Mitten im Orionnebel: vier junge Sterne in einem winzigen Viereck – sie bringen den Nebel zum Leuchten.',
      en: 'Right in the heart of the Orion Nebula: four young stars in a tiny quadrilateral – they make the nebula glow.',
    },
  },
  {
    id: 'gamma-velorum', ra: 122.383, dec: -47.337, mag: 1.8, size: '41″', type: 'double-star', con: 'Vel',
    name: { de: 'Gamma Velorum', en: 'Gamma Velorum' }, desig: 'γ Vel',
    tip: {
      de: 'Der hellste Stern der Segel ist ein weites, bläulich-weißes Paar – schon im kleinen Fernrohr bei geringer Vergrößerung zu trennen.',
      en: 'The brightest star in Vela is a wide, bluish-white pair – easy to split in a small telescope at low power.',
    },
  },
  {
    id: 'acamar', ra: 44.565, dec: -40.305, mag: 3.2, size: '8″', type: 'double-star', con: 'Eri',
    name: { de: 'Acamar', en: 'Acamar' }, desig: 'θ Eri',
    tip: {
      de: 'Auf alten Sternkarten endete hier der Fluss Eridanus: zwei weiße Sterne, gut getrennt bei 50- bis 100-facher Vergrößerung.',
      en: 'On ancient star maps the river Eridanus ended here: two white stars, nicely split at 50× to 100×.',
    },
  },
  {
    id: 'beta-tucanae', ra: 7.886, dec: -62.958, mag: 4.3, size: '27″', type: 'double-star', con: 'Tuc',
    name: { de: 'Beta Tucanae', en: 'Beta Tucanae' }, desig: 'β Tuc',
    tip: {
      de: 'Rund zehn Grad nördlich der Kleinen Magellanschen Wolke: zwei fast gleich helle weiße Sterne, ein dritter steht etwas weiter entfernt.',
      en: 'About ten degrees north of the Small Magellanic Cloud: two nearly equal white stars, with a third one a little farther off.',
    },
  },
  {
    id: 'winter-albireo', ra: 109.153, dec: -23.316, mag: 4.8, size: '27″', type: 'double-star', con: 'CMa',
    name: { de: 'Winter-Albireo (145 CMa)', en: 'Winter Albireo (145 CMa)' }, desig: 'h 3945',
    tip: {
      de: 'Knapp vier Grad nördlich von Wezen (Delta Canis Majoris): ein orangefarbener und ein bläulicher Stern – das Gegenstück zu Albireo im Winter.',
      en: 'Just under four degrees north of Wezen (Delta Canis Majoris): an orange and a bluish star – the winter counterpart of Albireo.',
    },
  },
];

// --- Caldwell-Katalog, nach Nummer sortiert ---
const CALDWELL: ListObject[] = [
  {
    id: 'C1', ra: 11.798, dec: 85.244, mag: 8.1, size: '14′', type: 'open-cluster', con: 'Cep',
    name: { de: 'NGC 188', en: 'NGC 188' }, desig: 'NGC 188',
    tip: {
      de: 'Einer der ältesten bekannten offenen Sternhaufen, keine fünf Grad vom Himmelspol entfernt – ein schwacher, gleichmäßiger Sternenstaub.',
      en: 'One of the oldest known open clusters, less than five degrees from the celestial pole – a faint, even dusting of stars.',
    },
  },
  {
    id: 'C2', ra: 3.254, dec: 72.522, mag: 11.4, size: '38″', type: 'planetary', con: 'Cep',
    name: { de: 'Fliegennebel', en: 'Bow-Tie Nebula' }, desig: 'NGC 40',
    tip: {
      de: 'Ein kleiner planetarischer Nebel mit gut sichtbarem Zentralstern – bei mittlerer Vergrößerung wirkt er wie eine längliche Schleife.',
      en: 'A small planetary nebula with an easily seen central star – at medium power it looks like an elongated bow.',
    },
  },
  {
    id: 'C3', ra: 184.175, dec: 69.463, mag: 9.7, size: '22′ × 7′', type: 'galaxy', con: 'Dra',
    name: { de: 'NGC 4236', en: 'NGC 4236' }, desig: 'NGC 4236',
    tip: {
      de: 'Eine lange, sehr flächige Spiralgalaxie im Drachen – nur unter dunklem Himmel als blasser Streifen zu erkennen.',
      en: 'A long, very diffuse spiral galaxy in Draco – only visible as a pale streak under dark skies.',
    },
  },
  {
    id: 'C4', ra: 315.404, dec: 68.163, mag: 6.8, size: '18′', type: 'nebula', con: 'Cep',
    name: { de: 'Irisnebel', en: 'Iris Nebula' }, desig: 'NGC 7023',
    tip: {
      de: 'Ein Reflexionsnebel um einen Stern 7. Größe – im Teleskop ein zarter Schimmer, auf Fotos leuchtend blau.',
      en: 'A reflection nebula around a 7th-magnitude star – a delicate glow in the telescope, brilliant blue in photos.',
    },
  },
  {
    id: 'C5', ra: 56.702, dec: 68.096, mag: 9.2, size: '21′', type: 'galaxy', con: 'Cam',
    name: { de: 'Verborgene Galaxie', en: 'Hidden Galaxy' }, desig: 'IC 342',
    tip: {
      de: 'Eine große Spiralgalaxie, die wir durch den Staub der Milchstraße hindurch sehen – sehr blass, braucht dunklen Himmel.',
      en: 'A large spiral galaxy seen through the dust of the Milky Way – very faint, needs a dark sky.',
    },
  },
  {
    id: 'C6', ra: 269.639, dec: 66.633, mag: 8.1, size: '20″', type: 'planetary', con: 'Dra',
    name: { de: 'Katzenaugennebel', en: "Cat's Eye Nebula" }, desig: 'NGC 6543',
    tip: {
      de: 'Liegt fast genau am nördlichen Ekliptikpol im Drachen – ein heller, blaugrüner Punkt, der bei hoher Vergrößerung zum Scheibchen wird.',
      en: 'Lies almost exactly at the north ecliptic pole in Draco – a bright blue-green dot that becomes a tiny disc at high power.',
    },
  },
  {
    id: 'C7', ra: 114.214, dec: 65.603, mag: 8.4, size: '22′ × 12′', type: 'galaxy', con: 'Cam',
    name: { de: 'NGC 2403', en: 'NGC 2403' }, desig: 'NGC 2403',
    tip: {
      de: 'Eine der hellsten Galaxien, die nicht im Messier-Katalog stehen – ein ovaler Schimmer mit hellerem Kern.',
      en: "One of the brightest galaxies missing from Messier's list – an oval glow with a brighter core.",
    },
  },
  {
    id: 'C8', ra: 22.387, dec: 63.301, mag: 9.5, size: '4′', type: 'open-cluster', con: 'Cas',
    name: { de: 'NGC 559', en: 'NGC 559' }, desig: 'NGC 559',
    tip: {
      de: 'Gut drei Grad nördlich von Ruchbah (Delta Cassiopeiae) – ein kleiner, dichter Haufen schwacher Sterne.',
      en: 'Just over three degrees north of Ruchbah (Delta Cassiopeiae) – a small, compact cluster of faint stars.',
    },
  },
  {
    id: 'C9', ra: 344.275, dec: 62.636, mag: 7.7, size: '50′ × 30′', type: 'nebula', con: 'Cep',
    name: { de: 'Höhlennebel', en: 'Cave Nebula' }, desig: 'Sh2-155',
    tip: {
      de: 'Ein schwieriger, blasser Nebel im Kepheus – ein Nebelfilter und ein dunkler Himmel helfen sehr.',
      en: 'A difficult, faint nebula in Cepheus – a nebula filter and a dark sky help a lot.',
    },
  },
  {
    id: 'C10', ra: 26.588, dec: 61.212, mag: 7.1, size: '16′', type: 'open-cluster', con: 'Cas',
    name: { de: 'NGC 663', en: 'NGC 663' }, desig: 'NGC 663',
    tip: {
      de: 'Der schönste von mehreren Haufen zwischen Delta und Epsilon Cassiopeiae – im Fernglas schon als Fleck sichtbar.',
      en: 'The finest of several clusters between Delta and Epsilon Cassiopeiae – already visible as a smudge in binoculars.',
    },
  },
  {
    id: 'C11', ra: 350.201, dec: 61.202, mag: 10.0, size: '15′ × 8′', type: 'nebula', con: 'Cas',
    name: { de: 'Blasennebel', en: 'Bubble Nebula' }, desig: 'NGC 7635',
    tip: {
      de: 'Eine zarte Gasblase, die ein heißer Stern aufbläst – gleich neben dem Haufen M52, braucht dunklen Himmel und Nebelfilter.',
      en: 'A delicate bubble of gas blown by a hot star – right next to the cluster M52, needs dark skies and a nebula filter.',
    },
  },
  {
    id: 'C12', ra: 308.718, dec: 60.154, mag: 8.9, size: '11′ × 10′', type: 'galaxy', con: 'Cyg',
    name: { de: 'Feuerwerksgalaxie', en: 'Fireworks Galaxy' }, desig: 'NGC 6946',
    tip: {
      de: 'Direkt an der Grenze von Schwan und Kepheus – eine blasse, runde Spiralgalaxie, in der auffällig viele Supernovae aufleuchteten.',
      en: 'Right on the border of Cygnus and Cepheus – a faint, round spiral galaxy where an unusual number of supernovae have flared up.',
    },
  },
  {
    id: 'C13', ra: 19.887, dec: 58.278, mag: 6.4, size: '13′', type: 'open-cluster', con: 'Cas',
    name: { de: 'Eulenhaufen', en: 'Owl Cluster' }, desig: 'NGC 457',
    tip: {
      de: 'Zwei helle Sterne bilden die „Augen“, Sternketten die ausgebreiteten Flügel – ein Haufen mit Gesicht, gut zwei Grad südlich von Ruchbah.',
      en: 'Two bright stars form the "eyes", chains of stars the outspread wings – a cluster with a face, about two degrees south of Ruchbah.',
    },
  },
  {
    id: 'C14', ra: 35.163, dec: 57.141, mag: 3.7, size: '30′ + 30′', type: 'open-cluster', con: 'Per',
    name: { de: 'Doppelsternhaufen h und χ Persei', en: 'Double Cluster' }, desig: 'NGC 869 / NGC 884',
    tip: {
      de: 'Bei geringer Vergrößerung passen beide Haufen ins Bild – zusammen Hunderte Sterne vor dem Band der Milchstraße.',
      en: 'At low power both clusters fit into the view – hundreds of stars together against the band of the Milky Way.',
    },
  },
  {
    id: 'C15', ra: 296.201, dec: 50.525, mag: 8.8, size: '27″', type: 'planetary', con: 'Cyg',
    name: { de: 'Blinkender Planetarischer Nebel', en: 'Blinking Planetary' }, desig: 'NGC 6826',
    tip: {
      de: 'Schau abwechselnd direkt auf den hellen Zentralstern und knapp daneben – der Nebel scheint zu verschwinden und wieder aufzutauchen.',
      en: 'Alternate between looking straight at the bright central star and just beside it – the nebula seems to vanish and reappear.',
    },
  },
  {
    id: 'C16', ra: 333.788, dec: 49.83, mag: 6.4, size: '21′', type: 'open-cluster', con: 'Lac',
    name: { de: 'NGC 7243', en: 'NGC 7243' }, desig: 'NGC 7243',
    tip: {
      de: 'Ein lockerer, unregelmäßiger Haufen in der Eidechse – am schönsten bei geringer Vergrößerung.',
      en: 'A loose, irregular cluster in Lacerta – best at low power.',
    },
  },
  {
    id: 'C17', ra: 8.301, dec: 48.509, mag: 9.3, size: '13′ × 8′', type: 'galaxy', con: 'Cas',
    name: { de: 'NGC 147', en: 'NGC 147' }, desig: 'NGC 147',
    tip: {
      de: 'Eine blasse Begleitgalaxie der Andromedagalaxie – ein sehr schwacher, gleichmäßiger Fleck, der dunklen Himmel verlangt.',
      en: 'A faint companion of the Andromeda Galaxy – a very dim, even patch that demands dark skies.',
    },
  },
  {
    id: 'C18', ra: 9.741, dec: 48.338, mag: 9.2, size: '12′ × 10′', type: 'galaxy', con: 'Cas',
    name: { de: 'NGC 185', en: 'NGC 185' }, desig: 'NGC 185',
    tip: {
      de: 'Etwas heller als ihre Nachbarin NGC 147, rund ein Grad östlich davon – ein runder, diffuser Schimmer.',
      en: 'A little brighter than its neighbour NGC 147, about a degree to the east – a round, diffuse glow.',
    },
  },
  {
    id: 'C19', ra: 328.372, dec: 47.246, mag: 7.2, size: '12′', type: 'nebula', con: 'Cyg',
    name: { de: 'Kokonnebel', en: 'Cocoon Nebula' }, desig: 'IC 5146',
    tip: {
      de: 'Ein schwacher Nebel am Ende eines langen dunklen Staubbandes – erst das dunkle Band suchen, dann den Kokon an seiner Spitze.',
      en: 'A faint nebula at the end of a long dark dust lane – find the dark lane first, then the cocoon at its tip.',
    },
  },
  {
    id: 'C20', ra: 314.696, dec: 44.33, mag: 4.0, size: '120′ × 100′', type: 'nebula', con: 'Cyg',
    name: { de: 'Nordamerikanebel', en: 'North America Nebula' }, desig: 'NGC 7000',
    tip: {
      de: 'Gleich östlich von Deneb – unter dunklem Himmel zeigt schon das Fernglas den Umriss eines Kontinents.',
      en: 'Just east of Deneb – under dark skies even binoculars show the outline of a continent.',
    },
  },
  {
    id: 'C21', ra: 187.046, dec: 44.094, mag: 9.4, size: '6′ × 4′', type: 'galaxy', con: 'CVn',
    name: { de: 'NGC 4449', en: 'NGC 4449' }, desig: 'NGC 4449',
    tip: {
      de: 'Eine helle, kastenförmige irreguläre Galaxie voller Sternentstehungsgebiete.',
      en: 'A bright, box-shaped irregular galaxy full of star-forming regions.',
    },
  },
  {
    id: 'C22', ra: 351.474, dec: 42.535, mag: 8.6, size: '32″', type: 'planetary', con: 'And',
    name: { de: 'Blauer Schneeball', en: 'Blue Snowball' }, desig: 'NGC 7662',
    tip: {
      de: 'Ein kräftig blaugrünes Scheibchen – bei geringer Vergrößerung wie ein unscharfer Stern, bei hoher wie ein kleiner Ball.',
      en: 'A strongly blue-green disc – a fuzzy star at low power, a little ball at high power.',
    },
  },
  {
    id: 'C23', ra: 35.637, dec: 42.348, mag: 10.0, size: '13′ × 3′', type: 'galaxy', con: 'And',
    name: { de: 'NGC 891', en: 'NGC 891' }, desig: 'NGC 891',
    tip: {
      de: 'Eine Spiralgalaxie genau von der Kante gesehen, mit einem dunklen Staubband entlang der Mitte – blass, aber eindrucksvoll.',
      en: 'A spiral galaxy seen exactly edge-on, with a dark dust lane along its middle – faint but impressive.',
    },
  },
  {
    id: 'C24', ra: 49.951, dec: 41.512, mag: 11.6, size: '2′', type: 'galaxy', con: 'Per',
    name: { de: 'Perseus A', en: 'Perseus A' }, desig: 'NGC 1275',
    tip: {
      de: 'Die hellste Galaxie im Perseus-Galaxienhaufen – ein kleiner Fleck, umgeben von weiteren schwachen Galaxien.',
      en: 'The brightest galaxy in the Perseus galaxy cluster – a small smudge surrounded by other faint galaxies.',
    },
  },
  {
    id: 'C25', ra: 114.535, dec: 38.882, mag: 10.4, size: '4′', type: 'globular', con: 'Lyn',
    name: { de: 'NGC 2419', en: 'NGC 2419' }, desig: 'NGC 2419',
    tip: {
      de: 'Der „intergalaktische Wanderer“: ein sehr weit entfernter Kugelsternhaufen, der nur als kleiner Nebelfleck erscheint.',
      en: 'The "Intergalactic Wanderer": a very distant globular cluster that shows up only as a small misty spot.',
    },
  },
  {
    id: 'C26', ra: 184.374, dec: 37.807, mag: 10.2, size: '16′ × 2′', type: 'galaxy', con: 'CVn',
    name: { de: 'NGC 4244', en: 'NGC 4244' }, desig: 'NGC 4244',
    tip: {
      de: 'Eine lange, dünne Galaxie von der Kante – wie ein schwacher Silberfaden im Teleskop.',
      en: 'A long, thin edge-on galaxy – like a faint silver thread in the telescope.',
    },
  },
  {
    id: 'C27', ra: 303.027, dec: 38.355, mag: 7.4, size: '18′ × 13′', type: 'nebula', con: 'Cyg',
    name: { de: 'Sichelnebel', en: 'Crescent Nebula' }, desig: 'NGC 6888',
    tip: {
      de: 'Eine Gashülle, die ein extrem heißer Stern abgestoßen hat – mit einem OIII-Filter zeigt sich der sichelförmige Bogen.',
      en: 'A shell of gas thrown off by an extremely hot star – an OIII filter reveals the crescent-shaped arc.',
    },
  },
  {
    id: 'C28', ra: 29.223, dec: 37.794, mag: 5.7, size: '50′', type: 'open-cluster', con: 'And',
    name: { de: 'NGC 752', en: 'NGC 752' }, desig: 'NGC 752',
    tip: {
      de: 'Ein großer, lockerer Haufen südlich von Alamak (Gamma Andromedae) – im Fernglas oder bei kleinster Vergrößerung am schönsten.',
      en: 'A large, loose cluster south of Almach (Gamma Andromedae) – best in binoculars or at the lowest power.',
    },
  },
  {
    id: 'C29', ra: 197.735, dec: 37.059, mag: 9.8, size: '6′ × 3′', type: 'galaxy', con: 'CVn',
    name: { de: 'NGC 5005', en: 'NGC 5005' }, desig: 'NGC 5005',
    tip: {
      de: 'Etwa drei Grad östlich von Cor Caroli – eine ovale Galaxie mit hellem, kompaktem Kern.',
      en: 'About three degrees east of Cor Caroli – an oval galaxy with a bright, compact core.',
    },
  },
  {
    id: 'C30', ra: 339.267, dec: 34.416, mag: 9.5, size: '10′ × 4′', type: 'galaxy', con: 'Peg',
    name: { de: 'NGC 7331', en: 'NGC 7331' }, desig: 'NGC 7331',
    tip: {
      de: 'Oft „kleine Schwester der Andromedagalaxie“ genannt – ein länglicher Schimmer gut vier Grad nördlich von Matar (Eta Pegasi).',
      en: 'Often called a "little sister of the Andromeda Galaxy" – an elongated glow about four degrees north of Matar (Eta Pegasi).',
    },
  },
  {
    id: 'C31', ra: 79.35, dec: 34.383, mag: null, size: '30′ × 19′', type: 'nebula', con: 'Aur',
    name: { de: 'Flammensternnebel', en: 'Flaming Star Nebula' }, desig: 'IC 405',
    tip: {
      de: 'Ein schwacher Nebel um den heißen Stern AE Aurigae – braucht dunklen Himmel, auf Fotos rot und blau.',
      en: 'A faint nebula around the hot star AE Aurigae – needs dark skies; red and blue in photos.',
    },
  },
  {
    id: 'C32', ra: 190.533, dec: 32.542, mag: 9.3, size: '15′ × 3′', type: 'galaxy', con: 'CVn',
    name: { de: 'Walgalaxie', en: 'Whale Galaxy' }, desig: 'NGC 4631',
    tip: {
      de: 'Eine große Galaxie von der Kante mit verdicktem „Kopf“ – die kleine Begleitgalaxie NGC 4627 liegt gleich daneben.',
      en: 'A large edge-on galaxy with a thicker "head" – the small companion galaxy NGC 4627 lies right beside it.',
    },
  },
  {
    id: 'C33', ra: 314.079, dec: 31.743, mag: 7.0, size: '60′ × 8′', type: 'supernova-remnant', con: 'Cyg',
    name: { de: 'Östlicher Schleiernebel', en: 'Eastern Veil Nebula' }, desig: 'NGC 6992',
    tip: {
      de: 'Ein langer, gebogener Gasfaden, Überrest einer Sternexplosion – mit OIII-Filter atemberaubend.',
      en: 'A long, curving filament of gas left over from an exploded star – breathtaking with an OIII filter.',
    },
  },
  {
    id: 'C34', ra: 311.408, dec: 30.708, mag: 7.0, size: '70′ × 6′', type: 'supernova-remnant', con: 'Cyg',
    name: { de: 'Westlicher Schleiernebel', en: 'Western Veil Nebula' }, desig: 'NGC 6960',
    tip: {
      de: 'Läuft direkt durch den Stern 52 Cygni – mit OIII-Filter ein feiner Faden, der sich zu einem „Hexenbesen“ auffächert.',
      en: 'Runs right through the star 52 Cygni – with an OIII filter a fine filament that fans out into a "Witch\'s Broom".',
    },
  },
  {
    id: 'C35', ra: 195.034, dec: 27.977, mag: 11.4, size: '3′', type: 'galaxy', con: 'Com',
    name: { de: 'NGC 4889', en: 'NGC 4889' }, desig: 'NGC 4889',
    tip: {
      de: 'Die hellste Galaxie im fernen Coma-Galaxienhaufen – ein kleiner ovaler Fleck in einem Feld voller schwacher Galaxien.',
      en: 'The brightest galaxy in the distant Coma galaxy cluster – a small oval smudge in a field full of faint galaxies.',
    },
  },
  {
    id: 'C36', ra: 188.99, dec: 27.96, mag: 9.9, size: '11′ × 5′', type: 'galaxy', con: 'Com',
    name: { de: 'NGC 4559', en: 'NGC 4559' }, desig: 'NGC 4559',
    tip: {
      de: 'Eine längliche Spiralgalaxie, die in größeren Teleskopen fleckig aussieht.',
      en: 'An elongated spiral galaxy that looks mottled in larger telescopes.',
    },
  },
  {
    id: 'C37', ra: 303.004, dec: 26.478, mag: 5.7, size: '7′', type: 'open-cluster', con: 'Vul',
    name: { de: 'NGC 6885', en: 'NGC 6885' }, desig: 'NGC 6885',
    tip: {
      de: 'Ein lockerer Haufen um den Stern 20 Vulpeculae, nicht weit vom Hantelnebel M27.',
      en: 'A loose cluster around the star 20 Vulpeculae, not far from the Dumbbell Nebula M27.',
    },
  },
  {
    id: 'C38', ra: 189.087, dec: 25.987, mag: 9.6, size: '16′ × 2′', type: 'galaxy', con: 'Com',
    name: { de: 'Nadelgalaxie', en: 'Needle Galaxy' }, desig: 'NGC 4565',
    tip: {
      de: 'Die vielleicht schönste Galaxie von der Kante: ein langer, dünner Lichtstrich mit kleiner Verdickung in der Mitte.',
      en: 'Perhaps the finest edge-on galaxy: a long, thin streak of light with a small bulge in the middle.',
    },
  },
  {
    id: 'C39', ra: 112.295, dec: 20.912, mag: 9.9, size: '48″', type: 'planetary', con: 'Gem',
    name: { de: 'Eskimonebel', en: 'Eskimo Nebula' }, desig: 'NGC 2392',
    tip: {
      de: 'Etwa zweieinhalb Grad südöstlich von Wasat (Delta Geminorum) – ein bläuliches Scheibchen mit hellem Zentralstern.',
      en: 'About two and a half degrees south-east of Wasat (Delta Geminorum) – a bluish disc with a bright central star.',
    },
  },
  {
    id: 'C40', ra: 170.016, dec: 18.357, mag: 10.9, size: '3′ × 2′', type: 'galaxy', con: 'Leo',
    name: { de: 'NGC 3626', en: 'NGC 3626' }, desig: 'NGC 3626',
    tip: {
      de: 'Eine kleine, kompakte Galaxie im Löwen – ein schwaches Ziel für mittelgroße Teleskope.',
      en: 'A small, compact galaxy in Leo – a faint target for medium-sized telescopes.',
    },
  },
  {
    id: 'C41', ra: 67.447, dec: 16.948, mag: 0.5, size: '330′', type: 'open-cluster', con: 'Tau',
    name: { de: 'Hyaden', en: 'Hyades' }, desig: 'Mel 25',
    tip: {
      de: 'Zu groß fürs Teleskop: Nimm ein Fernglas und genieße die vielen Doppel- und Farbsterne im „V“.',
      en: 'Too big for a telescope: use binoculars and enjoy the many doubles and coloured stars in the "V".',
    },
  },
  {
    id: 'C42', ra: 315.373, dec: 16.188, mag: 10.6, size: '3′', type: 'globular', con: 'Del',
    name: { de: 'NGC 7006', en: 'NGC 7006' }, desig: 'NGC 7006',
    tip: {
      de: 'Ein sehr weit entfernter Kugelsternhaufen im Delfin – ein kleiner, runder Nebelfleck, der sich kaum in Sterne auflösen lässt.',
      en: 'A very distant globular cluster in Delphinus – a small, round glow that hardly resolves into stars.',
    },
  },
  {
    id: 'C43', ra: 0.812, dec: 16.145, mag: 10.5, size: '6′ × 2′', type: 'galaxy', con: 'Peg',
    name: { de: 'NGC 7814', en: 'NGC 7814' }, desig: 'NGC 7814',
    tip: {
      de: 'Eine kleine Galaxie von der Kante mit hellem Kern – manchmal „kleiner Sombrero“ genannt.',
      en: 'A small edge-on galaxy with a bright core – sometimes called the "Little Sombrero".',
    },
  },
  {
    id: 'C44', ra: 346.236, dec: 12.323, mag: 11.0, size: '4′ × 3′', type: 'galaxy', con: 'Peg',
    name: { de: 'NGC 7479', en: 'NGC 7479' }, desig: 'NGC 7479',
    tip: {
      de: 'Knapp drei Grad südlich von Markab – eine Balkenspiralgalaxie, deren heller Balken sich in mittleren Teleskopen erahnen lässt.',
      en: 'Just under three degrees south of Markab – a barred spiral whose bright bar can be glimpsed in medium telescopes.',
    },
  },
  {
    id: 'C45', ra: 204.383, dec: 8.885, mag: 10.2, size: '6′ × 4′', type: 'galaxy', con: 'Boo',
    name: { de: 'NGC 5248', en: 'NGC 5248' }, desig: 'NGC 5248',
    tip: {
      de: 'Eine ovale Spiralgalaxie im Bärenhüter mit hellem Kern und zartem Halo.',
      en: 'An oval spiral galaxy in Boötes with a bright core and a delicate halo.',
    },
  },
  {
    id: 'C46', ra: 99.791, dec: 8.736, mag: 9.0, size: '2′', type: 'nebula', con: 'Mon',
    name: { de: 'Hubbles Veränderlicher Nebel', en: "Hubble's Variable Nebula" }, desig: 'NGC 2261',
    tip: {
      de: 'Ein kleiner, kometenförmiger Nebel, dessen Form und Helligkeit sich innerhalb weniger Wochen ändern.',
      en: 'A small, comet-shaped nebula whose shape and brightness change within a few weeks.',
    },
  },
  {
    id: 'C47', ra: 308.547, dec: 7.404, mag: 8.9, size: '6′', type: 'globular', con: 'Del',
    name: { de: 'NGC 6934', en: 'NGC 6934' }, desig: 'NGC 6934',
    tip: {
      de: 'Ein kompakter Kugelsternhaufen im Delfin – bei hoher Vergrößerung wirkt er körnig, einzelne Sterne zeigen erst größere Teleskope.',
      en: 'A compact globular cluster in Delphinus – grainy at high power, while single stars need a larger telescope.',
    },
  },
  {
    id: 'C48', ra: 137.584, dec: 7.038, mag: 10.3, size: '4′ × 3′', type: 'galaxy', con: 'Cnc',
    name: { de: 'NGC 2775', en: 'NGC 2775' }, desig: 'NGC 2775',
    tip: {
      de: 'Eine runde Spiralgalaxie im Krebs mit großem, glattem Kern.',
      en: 'A round spiral galaxy in Cancer with a large, smooth core.',
    },
  },
  {
    id: 'C49', ra: 97.65, dec: 4.981, mag: 9.0, size: '80′ × 60′', type: 'nebula', con: 'Mon',
    name: { de: 'Rosettennebel', en: 'Rosette Nebula' }, desig: 'NGC 2237',
    tip: {
      de: 'Ein großer Nebelring um den Haufen NGC 2244 – am besten mit kleiner Vergrößerung, weitem Feld und Nebelfilter.',
      en: 'A large ring of nebulosity around the cluster NGC 2244 – best with low power, a wide field and a nebula filter.',
    },
  },
  {
    id: 'C50', ra: 98.045, dec: 4.914, mag: 4.8, size: '24′', type: 'open-cluster', con: 'Mon',
    name: { de: 'NGC 2244', en: 'NGC 2244' }, desig: 'NGC 2244',
    tip: {
      de: 'Der junge Haufen im Herzen des Rosettennebels – ein Rechteck heller Sterne, schon im Fernglas zu sehen.',
      en: 'The young cluster at the heart of the Rosette Nebula – a rectangle of bright stars, visible even in binoculars.',
    },
  },
  {
    id: 'C51', ra: 16.202, dec: 2.119, mag: 9.3, size: '16′ × 15′', type: 'galaxy', con: 'Cet',
    name: { de: 'IC 1613', en: 'IC 1613' }, desig: 'IC 1613',
    tip: {
      de: 'Eine nahe Zwerggalaxie unserer Lokalen Gruppe – sehr groß und blass, nur bei wirklich dunklem Himmel.',
      en: 'A nearby dwarf galaxy in our Local Group – very large and faint, only under truly dark skies.',
    },
  },
  {
    id: 'C52', ra: 192.15, dec: -5.801, mag: 9.3, size: '7′ × 5′', type: 'galaxy', con: 'Vir',
    name: { de: 'NGC 4697', en: 'NGC 4697' }, desig: 'NGC 4697',
    tip: {
      de: 'Eine helle elliptische Galaxie in der Jungfrau – ein ovaler Schimmer mit hellem Kern.',
      en: 'A bright elliptical galaxy in Virgo – an oval glow with a bright core.',
    },
  },
  {
    id: 'C53', ra: 151.308, dec: -7.719, mag: 9.2, size: '7′ × 3′', type: 'galaxy', con: 'Sex',
    name: { de: 'Spindelgalaxie', en: 'Spindle Galaxy' }, desig: 'NGC 3115',
    tip: {
      de: 'Eine scharf begrenzte, spindelförmige Galaxie im unscheinbaren Sextanten – heller als viele Messier-Galaxien.',
      en: 'A sharply defined, spindle-shaped galaxy in faint Sextans – brighter than many Messier galaxies.',
    },
  },
  {
    id: 'C54', ra: 120.01, dec: -10.773, mag: 7.6, size: '7′', type: 'open-cluster', con: 'Mon',
    name: { de: 'NGC 2506', en: 'NGC 2506' }, desig: 'NGC 2506',
    tip: {
      de: 'Ein reicher, gleichmäßiger Haufen aus vielen schwachen Sternen im Einhorn.',
      en: 'A rich, even cluster of many faint stars in Monoceros.',
    },
  },
  {
    id: 'C55', ra: 316.045, dec: -11.363, mag: 8.0, size: '41″ × 35″', type: 'planetary', con: 'Aqr',
    name: { de: 'Saturnnebel', en: 'Saturn Nebula' }, desig: 'NGC 7009',
    tip: {
      de: 'Ein helles, grünliches Scheibchen – große Teleskope zeigen feine Fortsätze wie die Ringe des Saturn.',
      en: 'A bright greenish disc – large telescopes show thin extensions like the rings of Saturn.',
    },
  },
  {
    id: 'C56', ra: 11.764, dec: -11.872, mag: 8.0, size: '4′', type: 'planetary', con: 'Cet',
    name: { de: 'Schädelnebel', en: 'Skull Nebula' }, desig: 'NGC 246',
    tip: {
      de: 'Ein großer, blasser Nebelring mit mehreren Sternen darin – ein Nebelfilter hilft.',
      en: 'A large, faint ring of nebulosity with several stars inside – a nebula filter helps.',
    },
  },
  {
    id: 'C57', ra: 296.234, dec: -14.798, mag: 9.3, size: '15′ × 14′', type: 'galaxy', con: 'Sgr',
    name: { de: 'Barnards Galaxie', en: "Barnard's Galaxy" }, desig: 'NGC 6822',
    tip: {
      de: 'Eine unregelmäßige Zwerggalaxie unserer Lokalen Gruppe – groß und flächig, am besten bei kleiner Vergrößerung.',
      en: 'An irregular dwarf galaxy in our Local Group – large and diffuse, best at low power.',
    },
  },
  {
    id: 'C58', ra: 109.443, dec: -15.631, mag: 7.2, size: '13′', type: 'open-cluster', con: 'CMa',
    name: { de: 'Carolines Haufen', en: "Caroline's Cluster" }, desig: 'NGC 2360',
    tip: {
      de: 'Gut drei Grad östlich von Gamma Canis Majoris – ein dichter Haufen, entdeckt von Caroline Herschel.',
      en: 'Just over three degrees east of Gamma Canis Majoris – a rich cluster discovered by Caroline Herschel.',
    },
  },
  {
    id: 'C59', ra: 156.192, dec: -18.642, mag: 8.6, size: '40″', type: 'planetary', con: 'Hya',
    name: { de: 'Jupiters Geist', en: 'Ghost of Jupiter' }, desig: 'NGC 3242',
    tip: {
      de: 'Ein helles, bläuliches Scheibchen, im Teleskop etwa so groß wie Jupiter – verträgt hohe Vergrößerung.',
      en: 'A bright bluish disc, about the size of Jupiter in a telescope – takes high magnification well.',
    },
  },
  {
    id: 'C60', ra: 180.471, dec: -18.868, mag: 10.7, size: '5′ × 3′', type: 'galaxy', con: 'Crv',
    name: { de: 'Antennengalaxien (NGC 4038)', en: 'Antennae Galaxies (NGC 4038)' }, desig: 'NGC 4038',
    tip: {
      de: 'Zwei Galaxien mitten im Verschmelzen – im Teleskop ein kleiner, herzförmiger Fleck.',
      en: 'Two galaxies in the middle of merging – a small, heart-shaped smudge in a telescope.',
    },
  },
  {
    id: 'C61', ra: 180.473, dec: -18.886, mag: 10.7, size: '3′ × 2′', type: 'galaxy', con: 'Crv',
    name: { de: 'Antennengalaxien (NGC 4039)', en: 'Antennae Galaxies (NGC 4039)' }, desig: 'NGC 4039',
    tip: {
      de: 'Der schwächere Partner der Antennengalaxien, verschmolzen mit NGC 4038 – beide passen ins selbe Gesichtsfeld.',
      en: 'The fainter partner of the Antennae, merging with NGC 4038 – both fit into the same field of view.',
    },
  },
  {
    id: 'C62', ra: 11.786, dec: -20.76, mag: 9.1, size: '21′ × 7′', type: 'galaxy', con: 'Cet',
    name: { de: 'NGC 247', en: 'NGC 247' }, desig: 'NGC 247',
    tip: {
      de: 'Knapp drei Grad südlich von Diphda (Beta Ceti) – eine große, blasse Spiralgalaxie, die dunklen, klaren Himmel braucht.',
      en: 'Just under three degrees south of Diphda (Beta Ceti) – a large, faint spiral that needs dark, clear skies.',
    },
  },
  {
    id: 'C63', ra: 337.411, dec: -20.837, mag: 7.3, size: '16′', type: 'planetary', con: 'Aqr',
    name: { de: 'Helixnebel', en: 'Helix Nebula' }, desig: 'NGC 7293',
    tip: {
      de: 'Einer der nächsten planetarischen Nebel, gut halb so groß wie der Vollmond – mit kleiner Vergrößerung und OIII-Filter ein blasser Ring.',
      en: 'One of the nearest planetary nebulae, about half the size of the full Moon – a pale ring at low power with an OIII filter.',
    },
  },
  {
    id: 'C64', ra: 109.671, dec: -24.954, mag: 4.1, size: '8′', type: 'open-cluster', con: 'CMa',
    name: { de: 'Tau-Canis-Majoris-Haufen', en: 'Tau Canis Majoris Cluster' }, desig: 'NGC 2362',
    tip: {
      de: 'Ein kompaktes Sternhäufchen rund um den hellen Stern Tau Canis Majoris – wie Funken um eine Flamme.',
      en: 'A compact little cluster around the bright star Tau Canis Majoris – like sparks around a flame.',
    },
  },
  {
    id: 'C65', ra: 11.888, dec: -25.289, mag: 7.1, size: '28′ × 7′', type: 'galaxy', con: 'Scl',
    name: { de: 'Sculptor-Galaxie', en: 'Sculptor Galaxy' }, desig: 'NGC 253',
    tip: {
      de: 'Eine der hellsten Galaxien überhaupt: lang und gefleckt, mit Staubstrukturen schon in mittleren Teleskopen.',
      en: 'One of the brightest galaxies of all: long and mottled, with dusty structure already visible in medium telescopes.',
    },
  },
  {
    id: 'C66', ra: 219.902, dec: -26.538, mag: 10.2, size: '4′', type: 'globular', con: 'Hya',
    name: { de: 'NGC 5694', en: 'NGC 5694' }, desig: 'NGC 5694',
    tip: {
      de: 'Ein kleiner, ferner Kugelsternhaufen in der Wasserschlange – wirkt wie ein unscharfer Stern.',
      en: 'A small, distant globular cluster in Hydra – looks like an out-of-focus star.',
    },
  },
  {
    id: 'C67', ra: 41.579, dec: -30.275, mag: 9.3, size: '9′ × 6′', type: 'galaxy', con: 'For',
    name: { de: 'NGC 1097', en: 'NGC 1097' }, desig: 'NGC 1097',
    tip: {
      de: 'Eine Balkenspiralgalaxie im Chemischen Ofen mit hellem Kern und länglichem Balken.',
      en: 'A barred spiral galaxy in Fornax with a bright core and an elongated bar.',
    },
  },
  {
    id: 'C68', ra: 285.443, dec: -36.961, mag: null, size: '2′', type: 'nebula', con: 'CrA',
    name: { de: 'R-Coronae-Australis-Nebel', en: 'R Coronae Australis Nebula' }, desig: 'NGC 6729',
    tip: {
      de: 'Ein kleiner, fächerförmiger Nebel, den der veränderliche Stern R CrA beleuchtet – deshalb schwankt auch seine Helligkeit.',
      en: 'A small, fan-shaped nebula lit by the variable star R CrA – which is why its brightness changes too.',
    },
  },
  {
    id: 'C69', ra: 258.435, dec: -37.103, mag: 9.6, size: '50″', type: 'planetary', con: 'Sco',
    name: { de: 'Käfernebel', en: 'Bug Nebula' }, desig: 'NGC 6302',
    tip: {
      de: 'Ein heller, länglicher Kern mit flügelartigen Ausläufern im Skorpion – verträgt hohe Vergrößerung.',
      en: 'A bright, elongated core with wing-like extensions in Scorpius – takes high magnification well.',
    },
  },
  {
    id: 'C70', ra: 13.723, dec: -37.684, mag: 8.1, size: '22′ × 16′', type: 'galaxy', con: 'Scl',
    name: { de: 'NGC 300', en: 'NGC 300' }, desig: 'NGC 300',
    tip: {
      de: 'Eine große, flächige Spiralgalaxie im Bildhauer – sehr blass, braucht einen dunklen Standort.',
      en: 'A large, diffuse spiral galaxy in Sculptor – very faint, needs a dark site.',
    },
  },
  {
    id: 'C71', ra: 118.046, dec: -38.537, mag: 5.8, size: '27′', type: 'open-cluster', con: 'Pup',
    name: { de: 'NGC 2477', en: 'NGC 2477' }, desig: 'NGC 2477',
    tip: {
      de: 'Ein sehr reicher Haufen aus Hunderten schwacher Sterne im Achterdeck – wie verstreuter Puderzucker.',
      en: 'A very rich cluster of hundreds of faint stars in Puppis – like a sprinkling of powdered sugar.',
    },
  },
  {
    id: 'C72', ra: 3.723, dec: -39.197, mag: 7.9, size: '32′ × 6′', type: 'galaxy', con: 'Scl',
    name: { de: 'NGC 55', en: 'NGC 55' }, desig: 'NGC 55',
    tip: {
      de: 'Eine lange, helle Galaxie, fast von der Kante gesehen – ein Ende wirkt heller und dicker als das andere.',
      en: 'A long, bright galaxy seen almost edge-on – one end looks brighter and thicker than the other.',
    },
  },
  {
    id: 'C73', ra: 78.528, dec: -40.047, mag: 7.3, size: '11′', type: 'globular', con: 'Col',
    name: { de: 'NGC 1851', en: 'NGC 1851' }, desig: 'NGC 1851',
    tip: {
      de: 'Ein heller, kompakter Kugelsternhaufen in der Taube mit sehr dichtem Kern.',
      en: 'A bright, compact globular cluster in Columba with a very dense core.',
    },
  },
  {
    id: 'C74', ra: 151.757, dec: -40.436, mag: 8.2, size: '84″ × 54″', type: 'planetary', con: 'Vel',
    name: { de: 'Südlicher Ringnebel', en: 'Southern Ring Nebula' }, desig: 'NGC 3132',
    tip: {
      de: 'Ein heller, ovaler Nebel mit gut sichtbarem Zentralstern – berühmt durch Bilder des James-Webb-Teleskops.',
      en: 'A bright oval nebula with an easily seen central star – famous from James Webb Space Telescope images.',
    },
  },
  {
    id: 'C75', ra: 246.332, dec: -40.661, mag: 5.8, size: '29′', type: 'open-cluster', con: 'Sco',
    name: { de: 'NGC 6124', en: 'NGC 6124' }, desig: 'NGC 6124',
    tip: {
      de: 'Ein großer, heller Haufen im Skorpion – schon im Fernglas ein körniger Fleck.',
      en: 'A large, bright cluster in Scorpius – already a grainy patch in binoculars.',
    },
  },
  {
    id: 'C76', ra: 253.545, dec: -41.812, mag: 2.6, size: '15′', type: 'open-cluster', con: 'Sco',
    name: { de: 'NGC 6231', en: 'NGC 6231' }, desig: 'NGC 6231',
    tip: {
      de: 'Ein kompakter Haufen heller, junger Sterne nahe Zeta Scorpii – mit bloßem Auge als „Nebelstern“ sichtbar.',
      en: 'A compact cluster of bright young stars near Zeta Scorpii – visible to the naked eye as a "fuzzy star".',
    },
  },
  {
    id: 'C77', ra: 201.365, dec: -43.019, mag: 7.0, size: '26′ × 20′', type: 'galaxy', con: 'Cen',
    name: { de: 'Centaurus A', en: 'Centaurus A' }, desig: 'NGC 5128',
    tip: {
      de: 'Eine helle Galaxie mit einem breiten, dunklen Staubband quer durch die Mitte – schon in kleinen Teleskopen sichtbar.',
      en: 'A bright galaxy cut across the middle by a broad dark dust lane – visible even in small telescopes.',
    },
  },
  {
    id: 'C78', ra: 272.01, dec: -43.715, mag: 6.6, size: '13′', type: 'globular', con: 'CrA',
    name: { de: 'NGC 6541', en: 'NGC 6541' }, desig: 'NGC 6541',
    tip: {
      de: 'Ein heller Kugelsternhaufen in der Südlichen Krone mit dichtem Kern – schon im Fernglas sichtbar.',
      en: 'A bright globular cluster in Corona Australis with a dense core – visible even in binoculars.',
    },
  },
  {
    id: 'C79', ra: 154.403, dec: -46.412, mag: 6.8, size: '18′', type: 'globular', con: 'Vel',
    name: { de: 'NGC 3201', en: 'NGC 3201' }, desig: 'NGC 3201',
    tip: {
      de: 'Ein großer, lockerer Kugelsternhaufen in den Segeln – lässt sich schon in kleinen Teleskopen gut in Sterne auflösen.',
      en: 'A large, loose globular cluster in Vela – resolves nicely into stars even in small telescopes.',
    },
  },
  {
    id: 'C80', ra: 201.697, dec: -47.479, mag: 3.7, size: '36′', type: 'globular', con: 'Cen',
    name: { de: 'Omega Centauri', en: 'Omega Centauri' }, desig: 'NGC 5139',
    tip: {
      de: 'Selbst ein kleines Teleskop löst Tausende Sterne auf – ein Anblick, der jeden Kugelsternhaufen des Nordhimmels übertrifft.',
      en: 'Even a small telescope resolves thousands of stars – a sight that outshines every globular cluster of the northern sky.',
    },
  },
  {
    id: 'C81', ra: 261.371, dec: -48.422, mag: 8.1, size: '7′', type: 'globular', con: 'Ara',
    name: { de: 'NGC 6352', en: 'NGC 6352' }, desig: 'NGC 6352',
    tip: {
      de: 'Ein lockerer, recht blasser Kugelsternhaufen im Altar.',
      en: 'A loose, rather faint globular cluster in Ara.',
    },
  },
  {
    id: 'C82', ra: 250.319, dec: -48.777, mag: 5.2, size: '15′', type: 'open-cluster', con: 'Ara',
    name: { de: 'NGC 6193', en: 'NGC 6193' }, desig: 'NGC 6193',
    tip: {
      de: 'Ein heller Haufen im Altar, eingebettet in den schwachen Nebel NGC 6188.',
      en: 'A bright cluster in Ara, embedded in the faint nebula NGC 6188.',
    },
  },
  {
    id: 'C83', ra: 196.364, dec: -49.468, mag: 8.7, size: '20′ × 4′', type: 'galaxy', con: 'Cen',
    name: { de: 'NGC 4945', en: 'NGC 4945' }, desig: 'NGC 4945',
    tip: {
      de: 'Eine große, fast von der Kante gesehene Spiralgalaxie im Zentaur – lang, schmal und fleckig.',
      en: 'A large, nearly edge-on spiral galaxy in Centaurus – long, narrow and mottled.',
    },
  },
  {
    id: 'C84', ra: 206.612, dec: -51.374, mag: 7.6, size: '9′', type: 'globular', con: 'Cen',
    name: { de: 'NGC 5286', en: 'NGC 5286' }, desig: 'NGC 5286',
    tip: {
      de: 'Ein kompakter Kugelsternhaufen dicht neben einem Stern 5. Größe im Zentaur.',
      en: 'A compact globular cluster right next to a 5th-magnitude star in Centaurus.',
    },
  },
  {
    id: 'C85', ra: 130.292, dec: -52.991, mag: 2.5, size: '50′', type: 'open-cluster', con: 'Vel',
    name: { de: 'Omikron-Velorum-Haufen', en: 'Omicron Velorum Cluster' }, desig: 'IC 2391',
    tip: {
      de: 'Eine große Gruppe heller Sterne um Omikron Velorum – mit bloßem Auge sichtbar, im Fernglas am schönsten.',
      en: 'A large group of bright stars around Omicron Velorum – visible to the naked eye, best in binoculars.',
    },
  },
  {
    id: 'C86', ra: 265.175, dec: -53.674, mag: 5.7, size: '26′', type: 'globular', con: 'Ara',
    name: { de: 'NGC 6397', en: 'NGC 6397' }, desig: 'NGC 6397',
    tip: {
      de: 'Einer der nächsten Kugelsternhaufen – groß, hell und leicht in Sterne aufzulösen.',
      en: 'One of the nearest globular clusters – large, bright and easy to resolve into stars.',
    },
  },
  {
    id: 'C87', ra: 48.068, dec: -55.216, mag: 8.4, size: '7′', type: 'globular', con: 'Hor',
    name: { de: 'NGC 1261', en: 'NGC 1261' }, desig: 'NGC 1261',
    tip: {
      de: 'Ein kleiner, runder Kugelsternhaufen in der Pendeluhr, fernab der Milchstraße.',
      en: 'A small, round globular cluster in Horologium, far from the Milky Way.',
    },
  },
  {
    id: 'C88', ra: 226.365, dec: -55.608, mag: 7.9, size: '10′', type: 'open-cluster', con: 'Cir',
    name: { de: 'NGC 5823', en: 'NGC 5823' }, desig: 'NGC 5823',
    tip: {
      de: 'Ein lockerer Haufen schwacher Sterne an der Grenze von Zirkel und Wolf.',
      en: 'A loose cluster of faint stars on the border of Circinus and Lupus.',
    },
  },
  {
    id: 'C89', ra: 244.721, dec: -57.916, mag: 5.4, size: '12′', type: 'open-cluster', con: 'Nor',
    name: { de: 'S-Normae-Haufen', en: 'S Normae Cluster' }, desig: 'NGC 6087',
    tip: {
      de: 'Ein heller Haufen mit dem veränderlichen Stern S Normae in der Mitte, der in knapp zehn Tagen pulsiert.',
      en: 'A bright cluster with the variable star S Normae at its centre, which pulsates in just under ten days.',
    },
  },
  {
    id: 'C90', ra: 140.356, dec: -58.311, mag: 9.7, size: '12″', type: 'planetary', con: 'Car',
    name: { de: 'NGC 2867', en: 'NGC 2867' }, desig: 'NGC 2867',
    tip: {
      de: 'Ein kleiner, heller planetarischer Nebel im Kiel – bläulich und gut für hohe Vergrößerung.',
      en: 'A small, bright planetary nebula in Carina – bluish and good for high magnification.',
    },
  },
  {
    id: 'C91', ra: 166.417, dec: -58.707, mag: 3.0, size: '55′', type: 'open-cluster', con: 'Car',
    name: { de: 'Wunschbrunnen-Haufen', en: 'Wishing Well Cluster' }, desig: 'NGC 3532',
    tip: {
      de: 'Ein langgestreckter, sternreicher Haufen mit vielen orangefarbenen Riesen – bei kleinster Vergrößerung ein Prachtstück.',
      en: 'An elongated, star-rich cluster with many orange giants – a showpiece at the lowest power.',
    },
  },
  {
    id: 'C92', ra: 161.259, dec: -59.7, mag: 1.0, size: '120′', type: 'nebula', con: 'Car',
    name: { de: 'Carinanebel', en: 'Carina Nebula' }, desig: 'NGC 3372',
    tip: {
      de: 'Mit Nebelfilter zeigt sich ein Gewirr aus hellen Gasflächen und dunklen Staubbuchten rund um Eta Carinae.',
      en: 'With a nebula filter a tangle of bright gas and dark dust bays appears around Eta Carinae.',
    },
  },
  {
    id: 'C93', ra: 287.717, dec: -59.985, mag: 5.4, size: '20′', type: 'globular', con: 'Pav',
    name: { de: 'NGC 6752', en: 'NGC 6752' }, desig: 'NGC 6752',
    tip: {
      de: 'Einer der hellsten Kugelsternhaufen am Himmel, im Pfau – mit Sternketten, die vom Kern ausgehen.',
      en: 'One of the brightest globular clusters in the sky, in Pavo – with chains of stars leading out from the core.',
    },
  },
  {
    id: 'C94', ra: 193.415, dec: -60.371, mag: 4.2, size: '10′', type: 'open-cluster', con: 'Cru',
    name: { de: 'Schmuckkästchen', en: 'Jewel Box' }, desig: 'NGC 4755',
    tip: {
      de: 'Im Teleskop leuchten blauweiße Sterne und ein auffällig roter Riese wie Edelsteine auf Samt.',
      en: 'In a telescope blue-white stars and a striking red giant shine like gems on velvet.',
    },
  },
  {
    id: 'C95', ra: 240.779, dec: -60.43, mag: 5.1, size: '12′', type: 'open-cluster', con: 'TrA',
    name: { de: 'NGC 6025', en: 'NGC 6025' }, desig: 'NGC 6025',
    tip: {
      de: 'Ein heller, lockerer Haufen im Südlichen Dreieck – schön im Fernglas.',
      en: 'A bright, loose cluster in Triangulum Australe – lovely in binoculars.',
    },
  },
  {
    id: 'C96', ra: 119.527, dec: -60.8, mag: 3.8, size: '30′', type: 'open-cluster', con: 'Car',
    name: { de: 'NGC 2516', en: 'NGC 2516' }, desig: 'NGC 2516',
    tip: {
      de: 'Ein heller, reicher Haufen – mit bloßem Auge sichtbar, im Fernglas mit einigen roten Sternen.',
      en: 'A bright, rich cluster – visible to the naked eye, showing a few red stars in binoculars.',
    },
  },
  {
    id: 'C97', ra: 174.061, dec: -61.616, mag: 5.3, size: '12′', type: 'open-cluster', con: 'Cen',
    name: { de: 'Perlenhaufen', en: 'Pearl Cluster' }, desig: 'NGC 3766',
    tip: {
      de: 'Ein kompakter, heller Haufen im Zentaur mit einigen auffällig roten Sternen.',
      en: 'A compact, bright cluster in Centaurus with a few strikingly red stars.',
    },
  },
  {
    id: 'C98', ra: 190.582, dec: -62.995, mag: 6.9, size: '5′', type: 'open-cluster', con: 'Cru',
    name: { de: 'NGC 4609', en: 'NGC 4609' }, desig: 'NGC 4609',
    tip: {
      de: 'Ein kleiner Haufen am Rand des Kohlensacks – hübsch vor dem dunklen Hintergrund.',
      en: 'A small cluster at the edge of the Coalsack – pretty against the dark background.',
    },
  },
  {
    id: 'C99', ra: 192.5, dec: -62.5, mag: null, size: '7° × 5°', type: 'nebula', con: 'Cru',
    name: { de: 'Kohlensack', en: 'Coalsack' },
    tip: {
      de: 'Eine dunkle Staubwolke neben dem Kreuz des Südens – am besten mit bloßem Auge oder im Fernglas.',
      en: 'A dark dust cloud beside the Southern Cross – best with the naked eye or binoculars.',
    },
  },
  {
    id: 'C100', ra: 174.583, dec: -63.373, mag: 4.5, size: '15′', type: 'open-cluster', con: 'Cen',
    name: { de: 'Lambda-Centauri-Haufen', en: 'Lambda Centauri Cluster' }, desig: 'IC 2944',
    tip: {
      de: 'Ein lockerer Haufen um Lambda Centauri, eingehüllt in einen schwachen Nebel mit dem Spitznamen „Rennendes Huhn“.',
      en: 'A loose cluster around Lambda Centauri, wrapped in a faint nebula nicknamed the "Running Chicken".',
    },
  },
  {
    id: 'C101', ra: 287.442, dec: -63.857, mag: 8.3, size: '20′ × 13′', type: 'galaxy', con: 'Pav',
    name: { de: 'NGC 6744', en: 'NGC 6744' }, desig: 'NGC 6744',
    tip: {
      de: 'Eine große, blasse Spiralgalaxie im Pfau, die unserer Milchstraße ähneln soll.',
      en: 'A large, faint spiral galaxy in Pavo, thought to resemble our own Milky Way.',
    },
  },
  {
    id: 'C102', ra: 160.613, dec: -64.426, mag: 1.9, size: '50′', type: 'open-cluster', con: 'Car',
    name: { de: 'Südliche Plejaden', en: 'Southern Pleiades' }, desig: 'IC 2602',
    tip: {
      de: 'Eine Handvoll heller Sterne rund um Theta Carinae – am schönsten im Fernglas.',
      en: 'A handful of bright stars around Theta Carinae – best in binoculars.',
    },
  },
  {
    id: 'C103', ra: 84.675, dec: -69.1, mag: 8.0, size: '40′ × 25′', type: 'nebula', con: 'Dor',
    name: { de: 'Tarantelnebel', en: 'Tarantula Nebula' }, desig: 'NGC 2070',
    tip: {
      de: 'Das hellste Sternentstehungsgebiet unserer kosmischen Nachbarschaft – im Teleskop zeigen sich verschlungene „Spinnenbeine“ aus Gas.',
      en: 'The brightest star-forming region in our cosmic neighbourhood – a telescope reveals tangled "spider legs" of gas.',
    },
  },
  {
    id: 'C104', ra: 15.809, dec: -70.849, mag: 6.6, size: '13′', type: 'globular', con: 'Tuc',
    name: { de: 'NGC 362', en: 'NGC 362' }, desig: 'NGC 362',
    tip: {
      de: 'Ein heller Kugelsternhaufen am Rand der Kleinen Magellanschen Wolke – steht aber viel näher bei uns.',
      en: 'A bright globular cluster at the edge of the Small Magellanic Cloud – though much closer to us.',
    },
  },
  {
    id: 'C105', ra: 194.891, dec: -70.876, mag: 7.4, size: '14′', type: 'globular', con: 'Mus',
    name: { de: 'NGC 4833', en: 'NGC 4833' }, desig: 'NGC 4833',
    tip: {
      de: 'Ein lockerer Kugelsternhaufen in der Fliege, nahe Delta Muscae.',
      en: 'A loose globular cluster in Musca, near Delta Muscae.',
    },
  },
  {
    id: 'C106', ra: 6.022, dec: -72.081, mag: 4.0, size: '31′', type: 'globular', con: 'Tuc',
    name: { de: '47 Tucanae', en: '47 Tucanae' }, desig: 'NGC 104',
    tip: {
      de: 'Im Teleskop zerfällt der helle Kern in ein Meer aus Sternen – einer der schönsten Kugelsternhaufen überhaupt.',
      en: 'In a telescope the bright core bursts into a sea of stars – one of the finest globular clusters of all.',
    },
  },
  {
    id: 'C107', ra: 246.451, dec: -72.202, mag: 9.3, size: '11′', type: 'globular', con: 'Aps',
    name: { de: 'NGC 6101', en: 'NGC 6101' }, desig: 'NGC 6101',
    tip: {
      de: 'Ein blasser, lockerer Kugelsternhaufen im Paradiesvogel.',
      en: 'A faint, loose globular cluster in Apus.',
    },
  },
  {
    id: 'C108', ra: 186.439, dec: -72.659, mag: 7.8, size: '19′', type: 'globular', con: 'Mus',
    name: { de: 'NGC 4372', en: 'NGC 4372' }, desig: 'NGC 4372',
    tip: {
      de: 'Ein großer, blasser Kugelsternhaufen in der Fliege, nahe Gamma Muscae.',
      en: 'A large, faint globular cluster in Musca, near Gamma Muscae.',
    },
  },
  {
    id: 'C109', ra: 152.337, dec: -80.859, mag: 11.6, size: '40″', type: 'planetary', con: 'Cha',
    name: { de: 'NGC 3195', en: 'NGC 3195' }, desig: 'NGC 3195',
    tip: {
      de: 'Ein kleiner, blasser planetarischer Nebel im Chamäleon – der südlichste Eintrag im Katalog.',
      en: 'A small, faint planetary nebula in Chamaeleon – the southernmost entry in the catalogue.',
    },
  },
];

export const LISTS: ObservingList[] = [
  {
    id: 'naked-eye',
    equipment: 'eye',
    de: {
      title: 'Mit bloßem Auge',
      text: 'Himmelsschätze, die du ganz ohne Hilfsmittel sehen kannst – am besten fern von Stadtlichtern, wenn sich deine Augen an die Dunkelheit gewöhnt haben. Mit Zielen für Nord- und Südhalbkugel.',
    },
    en: {
      title: 'With the naked eye',
      text: 'Sky treasures you can see without any optical aid – best away from city lights, once your eyes have adjusted to the dark. With targets for both hemispheres.',
    },
    items: NAKED_EYE,
  },
  {
    id: 'binocular',
    equipment: 'binoculars',
    de: {
      title: 'Fernglas-Klassiker',
      text: 'Die schönsten Ziele für ein ganz normales Fernglas (etwa 7×50 oder 10×50): Sternhaufen, Nebel und Galaxien von beiden Erdhalbkugeln.',
    },
    en: {
      title: 'Binocular classics',
      text: 'The finest targets for ordinary binoculars (around 7×50 or 10×50): star clusters, nebulae and galaxies from both hemispheres.',
    },
    items: BINOCULAR,
  },
  {
    id: 'double-stars',
    equipment: 'telescope',
    de: {
      title: 'Klassische Doppelsterne',
      text: 'Farbige Sternpaare, die sich schon in einem kleinen Teleskop bei 50- bis 100-facher Vergrößerung trennen lassen – auch bei Mondlicht und in der Stadt ein Genuss.',
    },
    en: {
      title: 'Classic double stars',
      text: 'Colourful star pairs that split in a small telescope at 50× to 100× – a treat even under moonlight or city skies.',
    },
    items: DOUBLE_STARS,
  },
  {
    id: 'caldwell',
    equipment: 'telescope',
    de: {
      title: 'Caldwell-Katalog',
      text: '109 lohnende Objekte, die der Astronom Patrick Moore als Ergänzung zum Messier-Katalog zusammengestellt hat – darunter viele Schätze des Südhimmels. Für die meisten brauchst du ein Teleskop.',
    },
    en: {
      title: 'Caldwell catalogue',
      text: '109 rewarding objects compiled by astronomer Patrick Moore as a companion to the Messier catalogue – including many treasures of the southern sky. Most of them need a telescope.',
    },
    items: CALDWELL,
  },
];
