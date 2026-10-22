// Bildergalerie: berühmte Weltraumaufnahmen von Webb, Hubble, Spitzer, Chandra und Raumsonden (Deutsch und Englisch).
// Alle Bilder stammen aus der NASA Image and Video Library (images.nasa.gov) und werden zur Laufzeit geladen.
// Jede Adresse wurde über https://images-api.nasa.gov/asset/<nasaId> geprüft; gibt es kein „~medium.jpg“,
// steht in `medium` die vorhandene „~small.jpg“.
// Hinweis: Die Bibliothek enthält nur wenige Webb-Bilder. Fehlende Motive (z. B. Webbs Säulen der Schöpfung,
// Jupiter, Neptun oder Stephans Quintett) sind daher durch Aufnahmen anderer Teleskope ersetzt.

export type GalleryTelescope = 'hubble' | 'webb' | 'chandra' | 'spitzer' | 'probe' | 'other';

export interface GalleryImage {
  id: string;
  /** ID in der NASA Image and Video Library (images.nasa.gov) */
  nasaId: string;
  /** Vorschaubild und mittlere Größe, https-Adressen von images-assets.nasa.gov */
  thumb: string;
  medium: string;
  telescope: GalleryTelescope;
  year: number;
  /** Verknüpfung zur Sternkarte, z. B. 'dso:M16', 'body:jupiter' oder 'coord:<RA°>,<Dec°>,<Name>' */
  skyFocus?: string;
  /** Bildnachweis, z. B. 'NASA, ESA, CSA, STScI' */
  credit: string;
  category: 'nebula' | 'galaxy' | 'cluster' | 'planet' | 'deep-field' | 'star' | 'other';
  de: { title: string; text: string };
  en: { title: string; text: string };
}

export const GALLERY: GalleryImage[] = [
  // ---------- James Webb ----------
  {
    id: 'webb-cosmic-cliffs',
    nasaId: 'carina_nebula',
    thumb: 'https://images-assets.nasa.gov/image/carina_nebula/carina_nebula~thumb.jpg',
    medium: 'https://images-assets.nasa.gov/image/carina_nebula/carina_nebula~medium.jpg',
    telescope: 'webb',
    year: 2022,
    skyFocus: 'coord:159.341,-58.615,NGC 3324',
    credit: 'NASA, ESA, CSA, STScI',
    category: 'nebula',
    de: {
      title: 'Kosmische Klippen im Carinanebel',
      text: 'Diese „Berglandschaft“ ist in Wahrheit der Rand einer riesigen Höhle aus Gas und Staub im Sternentstehungsgebiet NGC 3324, rund 7.600 Lichtjahre entfernt. Heiße, junge Sterne oberhalb des Bildes tragen die Wolke mit ihrer Strahlung langsam ab. Mit seinem Infrarotblick schaut Webb durch den Staub und entdeckt Hunderte neugeborene Sterne, die bisher verborgen waren.',
    },
    en: {
      title: 'Cosmic Cliffs in the Carina Nebula',
      text: 'This “mountain range” is really the edge of a huge cavity of gas and dust in the star-forming region NGC 3324, about 7,600 light-years away. Hot young stars above the frame slowly wear the cloud away with their radiation. Webb’s infrared vision cuts through the dust and reveals hundreds of newborn stars that had been hidden until now.',
    },
  },
  {
    id: 'webb-southern-ring',
    nasaId: 'southern_ring_nebula',
    thumb: 'https://images-assets.nasa.gov/image/southern_ring_nebula/southern_ring_nebula~thumb.jpg',
    medium: 'https://images-assets.nasa.gov/image/southern_ring_nebula/southern_ring_nebula~medium.jpg',
    telescope: 'webb',
    year: 2022,
    skyFocus: 'coord:151.757,-40.436,NGC 3132',
    credit: 'NASA, ESA, CSA, STScI',
    category: 'nebula',
    de: {
      title: 'Südlicher Ringnebel',
      text: 'Ein sterbender Stern hat hier seine äußeren Schichten abgestoßen, die nun als leuchtende Hüllen ins All treiben – rund 2.500 Lichtjahre von uns entfernt. Links siehst du Webbs Bild im nahen, rechts im mittleren Infrarot. Erst rechts zeigt sich deutlich der eigentliche Verursacher: ein in Staub gehüllter Sternrest neben einem helleren Begleitstern.',
    },
    en: {
      title: 'Southern Ring Nebula',
      text: 'A dying star has thrown off its outer layers, which now drift into space as glowing shells – about 2,500 light-years from us. On the left is Webb’s near-infrared view, on the right the mid-infrared one. Only on the right does the true culprit stand out clearly: a dust-wrapped stellar remnant sitting next to a brighter companion star.',
    },
  },
  {
    id: 'webb-first-deep-field',
    nasaId: 'webb_first_deep_field',
    thumb: 'https://images-assets.nasa.gov/image/webb_first_deep_field/webb_first_deep_field~thumb.jpg',
    medium: 'https://images-assets.nasa.gov/image/webb_first_deep_field/webb_first_deep_field~medium.jpg',
    telescope: 'webb',
    year: 2022,
    skyFocus: 'coord:110.805,-73.457,SMACS 0723',
    credit: 'NASA, ESA, CSA, STScI',
    category: 'deep-field',
    de: {
      title: 'Webbs erstes Deep Field',
      text: 'Fast jeder Lichtfleck auf diesem Bild ist eine ganze Galaxie. Der Galaxienhaufen SMACS 0723 in der Mitte wirkt mit seiner Schwerkraft wie eine riesige Lupe und verzieht das Licht noch viel fernerer Galaxien zu Bögen. Manche dieser Lichtstrahlen waren über 13 Milliarden Jahre unterwegs – wir sehen also tief in die Vergangenheit.',
    },
    en: {
      title: 'Webb’s First Deep Field',
      text: 'Almost every speck of light in this picture is an entire galaxy. The galaxy cluster SMACS 0723 in the middle acts like a giant magnifying glass with its gravity, stretching the light of far more distant galaxies into arcs. Some of this light travelled for more than 13 billion years, so we are looking deep into the past.',
    },
  },
  {
    id: 'webb-wr140',
    nasaId: 'PIA25432',
    thumb: 'https://images-assets.nasa.gov/image/PIA25432/PIA25432~thumb.jpg',
    medium: 'https://images-assets.nasa.gov/image/PIA25432/PIA25432~medium.jpg',
    telescope: 'webb',
    year: 2022,
    skyFocus: 'coord:305.117,43.855,WR 140',
    credit: 'NASA, ESA, CSA, STScI, JPL-Caltech',
    category: 'star',
    de: {
      title: 'Staubringe um WR 140',
      text: 'Zwei schwere Sterne umkreisen einander etwa alle acht Jahre, rund 5.000 Lichtjahre entfernt im Schwan. Kommen sie sich besonders nahe, prallen ihre Sternwinde aufeinander und es entsteht frischer Staub – jedes Mal ein neuer Ring. Webb hat mindestens 17 dieser Ringe gefunden, fast wie die Jahresringe eines Baumes.',
    },
    en: {
      title: 'Dust rings around WR 140',
      text: 'Two massive stars circle each other about every eight years, some 5,000 light-years away in Cygnus. Whenever they swing close together, their stellar winds collide and fresh dust forms – a new ring each time. Webb found at least 17 of these rings, a bit like the growth rings of a tree.',
    },
  },

  // ---------- Hubble: Nebel ----------
  {
    id: 'hubble-pillars',
    nasaId: 'GSFC_20171208_Archive_e000842',
    thumb: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000842/GSFC_20171208_Archive_e000842~thumb.jpg',
    medium: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000842/GSFC_20171208_Archive_e000842~medium.jpg',
    telescope: 'hubble',
    year: 2015,
    skyFocus: 'dso:M16',
    credit: 'NASA, ESA, Hubble Heritage Team (STScI/AURA)',
    category: 'nebula',
    de: {
      title: 'Säulen der Schöpfung im Infrarot',
      text: 'Die berühmten Gassäulen im Adlernebel sind mehrere Lichtjahre hoch und rund 7.000 Lichtjahre entfernt. Zwanzig Jahre nach dem Originalbild hat Hubble sie erneut aufgenommen, hier im nahen Infrarot: Die Säulen erscheinen als dunkle Schatten, durch die zahllose Sterne schimmern. In ihren Spitzen entstehen neue Sterne, während das Licht heißer Nachbarn die Säulen nach und nach auflöst.',
    },
    en: {
      title: 'Pillars of Creation in infrared',
      text: 'The famous gas pillars in the Eagle Nebula are several light-years tall and about 7,000 light-years away. Twenty years after the original picture, Hubble photographed them again – shown here in near-infrared light, where the pillars turn into dark shadows with countless stars shining through. New stars are forming in their tips while the light of hot neighbours slowly erodes the pillars.',
    },
  },
  {
    id: 'crab-nebula',
    nasaId: 'PIA03606',
    thumb: 'https://images-assets.nasa.gov/image/PIA03606/PIA03606~thumb.jpg',
    medium: 'https://images-assets.nasa.gov/image/PIA03606/PIA03606~medium.jpg',
    telescope: 'hubble',
    year: 2005,
    skyFocus: 'dso:M1',
    credit: 'NASA/ESA/JPL/Arizona State Univ.',
    category: 'nebula',
    de: {
      title: 'Krebsnebel',
      text: 'Im Jahr 1054 bemerkten Himmelsbeobachter in China einen neuen Stern, der sogar tagsüber zu sehen war – eine Supernova. Der Krebsnebel ist die Trümmerwolke dieser Explosion und dehnt sich bis heute aus. Hubble hat ihn aus 24 Einzelaufnahmen zusammengesetzt; in seiner Mitte dreht sich ein Neutronenstern rund 30-mal pro Sekunde.',
    },
    en: {
      title: 'Crab Nebula',
      text: 'In 1054, sky watchers in China noticed a new star that was bright enough to see in daylight – a supernova. The Crab Nebula is the debris cloud of that explosion and is still expanding today. Hubble stitched it together from 24 exposures; at its centre a neutron star spins about 30 times every second.',
    },
  },
  {
    id: 'horsehead-nebula',
    nasaId: 'GSFC_20171208_Archive_e001518',
    thumb: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001518/GSFC_20171208_Archive_e001518~thumb.jpg',
    medium: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001518/GSFC_20171208_Archive_e001518~medium.jpg',
    telescope: 'hubble',
    year: 2013,
    skyFocus: 'coord:85.246,-2.458,Barnard 33',
    credit: 'NASA, ESA, Hubble Heritage Team (STScI/AURA)',
    category: 'nebula',
    de: {
      title: 'Pferdekopfnebel',
      text: 'Im sichtbaren Licht ist der Pferdekopfnebel im Orion nur eine dunkle Silhouette vor rotem Gas. Hubbles Infrarotkamera schaut in die kalte Staubwolke hinein und lässt sie fast durchsichtig wirken. Dahinter tauchen Sterne der Milchstraße und sogar ferne Galaxien auf.',
    },
    en: {
      title: 'Horsehead Nebula',
      text: 'In visible light, the Horsehead Nebula in Orion is just a dark silhouette against glowing red gas. Hubble’s infrared camera peers into the cold dust cloud and makes it look almost see-through. Behind it, stars of the Milky Way and even distant galaxies appear.',
    },
  },
  {
    id: 'ring-nebula',
    nasaId: 'GSFC_20171208_Archive_e001464',
    thumb: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001464/GSFC_20171208_Archive_e001464~thumb.jpg',
    medium: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001464/GSFC_20171208_Archive_e001464~small.jpg',
    telescope: 'hubble',
    year: 2013,
    skyFocus: 'dso:M57',
    credit: 'NASA, ESA, C.R. O’Dell (Vanderbilt University), G.J. Ferland (University of Kentucky), W.J. Henney and M. Peimbert (UNAM); LBT data: D. Thompson (University of Arizona)',
    category: 'nebula',
    de: {
      title: 'Ringnebel M57',
      text: 'Der Ringnebel in der Leier ist die abgestoßene Hülle eines sonnenähnlichen Sterns, gut 2.000 Lichtjahre entfernt. Hubble zeigte, dass er kein flacher Ring ist: Ein dichter Gasring umschließt eine längliche, blaue Gasblase, auf die wir fast genau von vorn schauen. Im Zentrum glimmt der Rest des Sterns, ein Weißer Zwerg.',
    },
    en: {
      title: 'Ring Nebula M57',
      text: 'The Ring Nebula in Lyra is the cast-off shell of a Sun-like star, a little over 2,000 light-years away. Hubble showed that it is not a flat ring: a dense ring of gas wraps around an elongated blue bubble that we see almost end-on. At the centre glows what is left of the star, a white dwarf.',
    },
  },
  {
    id: 'cats-eye-nebula',
    nasaId: 'GSFC_20171208_Archive_e002155',
    thumb: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e002155/GSFC_20171208_Archive_e002155~thumb.jpg',
    medium: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e002155/GSFC_20171208_Archive_e002155~medium.jpg',
    telescope: 'hubble',
    year: 2004,
    skyFocus: 'coord:269.639,66.633,NGC 6543',
    credit: 'NASA, ESA, HEIC, Hubble Heritage Team (STScI/AURA)',
    category: 'nebula',
    de: {
      title: 'Katzenaugennebel',
      text: 'Der Katzenaugennebel im Drachen war einer der ersten bekannten Planetarischen Nebel – Gashüllen, die ein alternder Stern abwirft. Hubble entdeckte um ihn herum mindestens elf zarte Ringe wie die Schalen einer Zwiebel. Der Stern hat sie offenbar in regelmäßigen Abständen von etwa 1.500 Jahren ausgestoßen.',
    },
    en: {
      title: 'Cat’s Eye Nebula',
      text: 'The Cat’s Eye Nebula in Draco was one of the first known planetary nebulae – shells of gas thrown off by an ageing star. Hubble found at least eleven faint rings around it, like the layers of an onion. The star seems to have puffed them out at regular intervals of about 1,500 years.',
    },
  },
  {
    id: 'lagoon-nebula',
    nasaId: 'GSFC_20171208_Archive_e001955',
    thumb: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001955/GSFC_20171208_Archive_e001955~thumb.jpg',
    medium: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001955/GSFC_20171208_Archive_e001955~medium.jpg',
    telescope: 'hubble',
    year: 2010,
    skyFocus: 'dso:M8',
    credit: 'NASA, ESA',
    category: 'nebula',
    de: {
      title: 'Im Herzen des Lagunennebels',
      text: 'Der Lagunennebel im Schützen ist schon im Fernglas als heller Fleck zu sehen. Hubble blickt hier in sein Zentrum, wo junge, heiße Sterne das Gas aufheizen und zu wirbelnden Schläuchen und Wolken formen. Ein friedlicher Name für eine ziemlich stürmische Sternenkinderstube.',
    },
    en: {
      title: 'The heart of the Lagoon Nebula',
      text: 'The Lagoon Nebula in Sagittarius is easy to spot as a bright smudge in binoculars. Here Hubble looks into its core, where hot young stars heat the gas and shape it into swirling funnels and clouds. A peaceful name for a rather stormy stellar nursery.',
    },
  },
  {
    id: 'tarantula-nebula',
    nasaId: 'GSFC_20171208_Archive_e001677',
    thumb: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001677/GSFC_20171208_Archive_e001677~thumb.jpg',
    medium: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001677/GSFC_20171208_Archive_e001677~medium.jpg',
    telescope: 'hubble',
    year: 2012,
    skyFocus: 'coord:84.675,-69.100,30 Doradus',
    credit: 'NASA, ESA, E. Sabbi (ESA/STScI)',
    category: 'nebula',
    de: {
      title: 'Tarantelnebel (30 Doradus)',
      text: 'Der Tarantelnebel liegt in der Großen Magellanschen Wolke, einer Nachbargalaxie rund 170.000 Lichtjahre entfernt. Er ist die größte Sternentstehungsregion in unserer kosmischen Umgebung und beherbergt einige der schwersten bekannten Sterne. Hubble fand heraus, dass der helle Haufen in der Mitte eigentlich aus zwei Sternhaufen besteht, die womöglich gerade beginnen, miteinander zu verschmelzen.',
    },
    en: {
      title: 'Tarantula Nebula (30 Doradus)',
      text: 'The Tarantula Nebula lies in the Large Magellanic Cloud, a neighbouring galaxy about 170,000 light-years away. It is the biggest star-forming region in our cosmic neighbourhood and home to some of the most massive stars known. Hubble found that the bright cluster in the middle is really two star clusters that may be starting to merge.',
    },
  },
  {
    id: 'butterfly-nebula',
    nasaId: 'GSFC_20171208_Archive_e002086',
    thumb: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e002086/GSFC_20171208_Archive_e002086~thumb.jpg',
    medium: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e002086/GSFC_20171208_Archive_e002086~small.jpg',
    telescope: 'hubble',
    year: 2004,
    skyFocus: 'coord:258.435,-37.103,NGC 6302',
    credit: 'NASA, ESA, A. Zijlstra (UMIST, Manchester)',
    category: 'nebula',
    de: {
      title: 'Schmetterlingsnebel NGC 6302',
      text: 'Dieser Planetarische Nebel im Skorpion gehört zu den hellsten und heißesten seiner Art. Sein Zentralstern ist weit über 100.000 Grad heiß, steckt aber hinter einem dunklen Gürtel aus eisigen Staubkörnern. Zu beiden Seiten dieses Gürtels strömt Gas heraus und formt die leuchtenden „Flügel“.',
    },
    en: {
      title: 'Butterfly Nebula NGC 6302',
      text: 'This planetary nebula in Scorpius is one of the brightest and hottest of its kind. Its central star is well over 100,000 degrees hot but hides behind a dark belt of icy dust grains. Gas streams out on both sides of this belt, forming the glowing “wings”.',
    },
  },
  {
    id: 'helix-nebula',
    nasaId: 'PIA18164',
    thumb: 'https://images-assets.nasa.gov/image/PIA18164/PIA18164~thumb.jpg',
    medium: 'https://images-assets.nasa.gov/image/PIA18164/PIA18164~medium.jpg',
    telescope: 'hubble',
    year: 2003,
    skyFocus: 'coord:337.411,-20.837,NGC 7293',
    credit: 'NASA/STScI',
    category: 'nebula',
    de: {
      title: 'Helixnebel',
      text: 'Mit rund 650 Lichtjahren Entfernung ist der Helixnebel im Wassermann einer der nächsten Planetarischen Nebel und wirkt am Himmel deshalb ungewöhnlich groß. Das Bild verbindet scharfe Hubble-Aufnahmen mit einer Weitwinkelaufnahme von der Erde. Wegen seiner Form trägt er den Spitznamen „Auge Gottes“.',
    },
    en: {
      title: 'Helix Nebula',
      text: 'At about 650 light-years away, the Helix Nebula in Aquarius is one of the closest planetary nebulae, which is why it looks unusually large in the sky. This picture blends sharp Hubble images with a wide-angle view taken from the ground. Its shape has earned it the nickname “Eye of God”.',
    },
  },
  {
    id: 'hourglass-nebula',
    nasaId: 'PIA14442',
    thumb: 'https://images-assets.nasa.gov/image/PIA14442/PIA14442~thumb.jpg',
    medium: 'https://images-assets.nasa.gov/image/PIA14442/PIA14442~medium.jpg',
    telescope: 'hubble',
    year: 1996,
    skyFocus: 'coord:204.896,-67.381,MyCn 18',
    credit: 'NASA/JPL-Caltech/ESA, Hubble Heritage Team (STScI/AURA)',
    category: 'nebula',
    de: {
      title: 'Sanduhrnebel MyCn 18',
      text: 'Ein junger Planetarischer Nebel, rund 8.000 Lichtjahre entfernt im Südsternbild Fliege. Ein dichter Gasgürtel um den Äquator des sterbenden Sterns schnürt die Hülle in der Mitte ein – so entsteht die Form einer Sanduhr. Dass der Stern etwas neben der Mitte sitzt, gibt Forschenden bis heute Rätsel auf.',
    },
    en: {
      title: 'Hourglass Nebula MyCn 18',
      text: 'A young planetary nebula about 8,000 light-years away in the southern constellation Musca. A dense belt of gas around the dying star’s equator pinches the shell in the middle, giving it the shape of an hourglass. The fact that the star sits slightly off-centre still puzzles researchers.',
    },
  },
  {
    id: 'mystic-mountain',
    nasaId: 'PIA15985',
    thumb: 'https://images-assets.nasa.gov/image/PIA15985/PIA15985~thumb.jpg',
    medium: 'https://images-assets.nasa.gov/image/PIA15985/PIA15985~medium.jpg',
    telescope: 'hubble',
    year: 2010,
    skyFocus: 'coord:161.015,-59.517,HH 901',
    credit: 'NASA/ESA/STScI',
    category: 'nebula',
    de: {
      title: 'Mystic Mountain',
      text: 'Dieser „Berg“ im Carinanebel ist eine drei Lichtjahre hohe Säule aus Gas und Staub. Aus ihren Spitzen schießen dünne Gasstrahlen – Spuren junger Sterne, die tief im Inneren verborgen sind. Hubble feierte mit diesem Bild seinen 20. Geburtstag im All.',
    },
    en: {
      title: 'Mystic Mountain',
      text: 'This “mountain” in the Carina Nebula is a pillar of gas and dust three light-years tall. Thin jets of gas shoot out of its peaks – signs of young stars hidden deep inside. Hubble celebrated its 20th birthday in space with this picture.',
    },
  },
  {
    id: 'bubble-nebula',
    nasaId: 'GSFC_20171208_Archive_e000383',
    thumb: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000383/GSFC_20171208_Archive_e000383~thumb.jpg',
    medium: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000383/GSFC_20171208_Archive_e000383~medium.jpg',
    telescope: 'hubble',
    year: 2016,
    skyFocus: 'coord:350.201,61.202,NGC 7635',
    credit: 'NASA, ESA, Hubble Heritage Team (STScI/AURA)',
    category: 'nebula',
    de: {
      title: 'Blasennebel',
      text: 'Ein riesiger, heißer Stern bläst mit seinem starken Sternwind eine Gasblase auf, die etwa sieben Lichtjahre groß ist. Der Stern sitzt nicht in der Mitte, weil die Blase sich in dünnem Gas leichter ausdehnt als in dichtem. Hubble feierte mit diesem Bild aus der Kassiopeia seinen 26. Geburtstag.',
    },
    en: {
      title: 'Bubble Nebula',
      text: 'A huge, hot star is inflating a bubble of gas about seven light-years across with its powerful stellar wind. The star is not in the middle because the bubble expands more easily into thin gas than into dense gas. Hubble marked its 26th birthday with this image from Cassiopeia.',
    },
  },
  {
    id: 'twin-jet-nebula',
    nasaId: 'GSFC_20171208_Archive_e000637',
    thumb: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000637/GSFC_20171208_Archive_e000637~thumb.jpg',
    medium: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000637/GSFC_20171208_Archive_e000637~small.jpg',
    telescope: 'hubble',
    year: 2015,
    skyFocus: 'coord:256.407,-10.142,Minkowski 2-9',
    credit: 'ESA/Hubble & NASA, Acknowledgement: Judy Schmidt',
    category: 'nebula',
    de: {
      title: 'Zwillingsstrahl-Nebel',
      text: 'Im Zentrum dieses Nebels umkreisen sich zwei Sterne. Ihr Tanz lenkt das ausströmende Gas in zwei schillernde Flügel, die an einen Schmetterling erinnern. Darin rasen Gasstrahlen mit mehr als einer Million Kilometern pro Stunde ins All.',
    },
    en: {
      title: 'Twin Jet Nebula',
      text: 'At the centre of this nebula, two stars orbit each other. Their dance steers the outflowing gas into two shimmering wings that look like a butterfly. Inside them, jets of gas race into space at more than a million kilometres per hour.',
    },
  },

  // ---------- Hubble: Sterne und Sternhaufen ----------
  {
    id: 'v838-monocerotis',
    nasaId: 'GSFC_20171208_Archive_e002156',
    thumb: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e002156/GSFC_20171208_Archive_e002156~thumb.jpg',
    medium: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e002156/GSFC_20171208_Archive_e002156~medium.jpg',
    telescope: 'hubble',
    year: 2004,
    skyFocus: 'coord:106.020,-3.847,V838 Monocerotis',
    credit: 'NASA, Hubble Heritage Team (AURA/STScI)',
    category: 'star',
    de: {
      title: 'Lichtecho um V838 Monocerotis',
      text: 'Anfang 2002 wurde der Stern V838 Monocerotis plötzlich für einige Wochen zu einem der hellsten Sterne der Milchstraße. Sein Lichtblitz erreicht nach und nach Staubwolken, die den Stern schon lange umgeben, und lässt sie aufleuchten. Es sieht aus, als würde sich eine Wolke ausdehnen – tatsächlich wandert aber nur das Licht durch den Staub.',
    },
    en: {
      title: 'Light echo around V838 Monocerotis',
      text: 'In early 2002, the star V838 Monocerotis suddenly became one of the brightest stars in the Milky Way for a few weeks. The flash of light gradually reaches dust clouds that have surrounded the star for a long time and makes them glow. It looks like a cloud is expanding, but really it is just the light travelling through the dust.',
    },
  },
  {
    id: 'westerlund-2',
    nasaId: 'GSFC_20171208_Archive_e000743',
    thumb: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000743/GSFC_20171208_Archive_e000743~thumb.jpg',
    medium: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000743/GSFC_20171208_Archive_e000743~small.jpg',
    telescope: 'hubble',
    year: 2015,
    skyFocus: 'coord:155.992,-57.764,Westerlund 2',
    credit: 'NASA, ESA, Hubble Heritage Team (STScI/AURA), A. Nota (ESA/STScI), Westerlund 2 Science Team',
    category: 'cluster',
    de: {
      title: 'Westerlund 2: Hubbles Feuerwerk',
      text: 'Zum 25. Geburtstag von Hubble zeigte die NASA diesen jungen Sternhaufen mit rund 3.000 Sternen, etwa 20.000 Lichtjahre entfernt im Kiel des Schiffs. Die Sterne sind erst etwa zwei Millionen Jahre alt. Ihre Strahlung und ihre Winde schnitzen eine Höhle in die umgebende Gaswolke.',
    },
    en: {
      title: 'Westerlund 2: Hubble’s fireworks',
      text: 'For Hubble’s 25th birthday, NASA presented this young star cluster of about 3,000 stars, some 20,000 light-years away in Carina. The stars are only about two million years old. Their radiation and winds are carving a cavity into the surrounding cloud of gas.',
    },
  },

  // ---------- Hubble: Galaxien ----------
  {
    id: 'sombrero-galaxy',
    nasaId: 'PIA15226',
    thumb: 'https://images-assets.nasa.gov/image/PIA15226/PIA15226~thumb.jpg',
    medium: 'https://images-assets.nasa.gov/image/PIA15226/PIA15226~medium.jpg',
    telescope: 'hubble',
    year: 2003,
    skyFocus: 'dso:M104',
    credit: 'NASA/STScI/AURA',
    category: 'galaxy',
    de: {
      title: 'Sombrerogalaxie',
      text: 'Wir sehen diese Galaxie im Sternbild Jungfrau fast genau von der Seite, rund 30 Millionen Lichtjahre entfernt. Ein dunkles Staubband umgibt den hell leuchtenden Kern – zusammen sieht das aus wie ein mexikanischer Hut. Die Sombrerogalaxie ist ungefähr halb so groß wie unsere Milchstraße.',
    },
    en: {
      title: 'Sombrero Galaxy',
      text: 'We see this galaxy in Virgo almost exactly edge-on, about 30 million light-years away. A dark lane of dust wraps around its brightly glowing core – together they look like a Mexican hat. The Sombrero Galaxy is roughly half the size of our Milky Way.',
    },
  },
  {
    id: 'whirlpool-galaxy',
    nasaId: 'GSFC_20171208_Archive_e001925',
    thumb: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001925/GSFC_20171208_Archive_e001925~thumb.jpg',
    medium: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001925/GSFC_20171208_Archive_e001925~medium.jpg',
    telescope: 'hubble',
    year: 2011,
    skyFocus: 'dso:M51',
    credit: 'NASA, ESA, S. Beckwith (STScI), Hubble Heritage Team (STScI/AURA)',
    category: 'galaxy',
    de: {
      title: 'Whirlpool-Galaxie',
      text: 'Die Whirlpool-Galaxie in den Jagdhunden war 1845 die erste Galaxie, an der man Spiralarme erkannte. Hubble blickt hier genau von oben auf ihre Mitte: Rosa leuchten Gebiete, in denen Sterne entstehen, blau junge Sternhaufen, dunkel die Staubbahnen. Eine kleine Nachbargalaxie zerrt mit ihrer Schwerkraft an ihr und lässt die Arme so deutlich hervortreten.',
    },
    en: {
      title: 'Whirlpool Galaxy',
      text: 'In 1845, the Whirlpool Galaxy in Canes Venatici became the first galaxy in which spiral arms were spotted. Here Hubble looks straight down onto its centre: star-forming regions glow pink, young star clusters blue, and dust lanes appear dark. A small neighbouring galaxy tugs on it with its gravity, which makes the arms stand out so clearly.',
    },
  },
  {
    id: 'antennae-galaxies',
    nasaId: 'GSFC_20171208_Archive_e001327',
    thumb: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001327/GSFC_20171208_Archive_e001327~thumb.jpg',
    medium: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001327/GSFC_20171208_Archive_e001327~small.jpg',
    telescope: 'hubble',
    year: 2013,
    skyFocus: 'coord:180.471,-18.868,NGC 4038',
    credit: 'NASA/ESA',
    category: 'galaxy',
    de: {
      title: 'Antennengalaxien',
      text: 'Hier stoßen zwei Galaxien im Sternbild Rabe zusammen, ihren Namen haben sie von zwei langen Sternschweifen, die nur auf Weitwinkelbildern zu sehen sind. Bei dem Zusammenprall wird Gas zusammengepresst, und überall entstehen neue Sterne – die rosa leuchtenden Flecken. Ähnliches steht in ferner Zukunft auch unserer Milchstraße und der Andromedagalaxie bevor.',
    },
    en: {
      title: 'Antennae Galaxies',
      text: 'Two galaxies in Corvus are colliding here; they are named after two long tails of stars that only show up in wide-field pictures. The crash squeezes gas together and new stars form everywhere – the glowing pink patches. Something similar may one day happen to our Milky Way and the Andromeda Galaxy.',
    },
  },
  {
    id: 'arp-273',
    nasaId: 'GSFC_20171208_Archive_e001885',
    thumb: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001885/GSFC_20171208_Archive_e001885~thumb.jpg',
    medium: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001885/GSFC_20171208_Archive_e001885~medium.jpg',
    telescope: 'hubble',
    year: 2011,
    skyFocus: 'coord:35.370,39.376,Arp 273',
    credit: 'NASA, ESA, Hubble Heritage Team (STScI/AURA)',
    category: 'galaxy',
    de: {
      title: 'Eine „Rose“ aus Galaxien',
      text: 'Die beiden Galaxien von Arp 273 im Sternbild Andromeda sind etwa 300 Millionen Lichtjahre entfernt. Die kleinere ist vermutlich durch die größere hindurchgeflogen und hat deren Spiralarme zu einer Art Rosenblüte verbogen. Hubble zeigte dieses Bild zu seinem 21. Geburtstag.',
    },
    en: {
      title: 'A “rose” made of galaxies',
      text: 'The two galaxies of Arp 273 in the constellation Andromeda are about 300 million light-years away. The smaller one probably passed right through the larger one and bent its spiral arms into something like a rose. Hubble released this image for its 21st birthday.',
    },
  },

  // ---------- Hubble: Tiefe Blicke und Gravitationslinsen ----------
  {
    id: 'hubble-ultra-deep-field',
    nasaId: 'GSFC_20171208_Archive_e001061',
    thumb: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001061/GSFC_20171208_Archive_e001061~thumb.jpg',
    medium: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001061/GSFC_20171208_Archive_e001061~medium.jpg',
    telescope: 'hubble',
    year: 2014,
    skyFocus: 'coord:53.163,-27.791,Hubble Ultra Deep Field',
    credit: 'NASA/ESA',
    category: 'deep-field',
    de: {
      title: 'Hubble Ultra Deep Field',
      text: 'Hubble hat sehr lange auf ein winziges, scheinbar leeres Stück Himmel im Sternbild Chemischer Ofen gestarrt. Zum Vorschein kamen rund 10.000 Galaxien, manche so weit entfernt, dass wir sie so sehen, wie sie kurz nach dem Urknall aussahen. Diese Fassung von 2014 nutzt zusätzlich ultraviolettes Licht und zeigt so besonders gut, wo gerade Sterne entstehen.',
    },
    en: {
      title: 'Hubble Ultra Deep Field',
      text: 'Hubble stared for a very long time at a tiny, seemingly empty patch of sky in the constellation Fornax. It revealed about 10,000 galaxies, some so far away that we see them as they looked shortly after the Big Bang. This 2014 version also uses ultraviolet light, which shows especially well where stars are being born.',
    },
  },
  {
    id: 'hubble-deep-field',
    nasaId: 'PIA12110',
    thumb: 'https://images-assets.nasa.gov/image/PIA12110/PIA12110~thumb.jpg',
    medium: 'https://images-assets.nasa.gov/image/PIA12110/PIA12110~medium.jpg',
    telescope: 'hubble',
    year: 1996,
    skyFocus: 'coord:189.206,62.216,Hubble Deep Field',
    credit: 'NASA/JPL/STScI Hubble Deep Field Team',
    category: 'deep-field',
    de: {
      title: 'Hubble Deep Field',
      text: 'Ende 1995 schaute Hubble zehn Tage lang auf einen unscheinbaren Fleck nahe dem Großen Wagen, in dem man kaum etwas vermutete. Das Ergebnis zeigte fast 3.000 Galaxien in allen Formen und Farben. Damit wurde klar, wie unvorstellbar viele Galaxien es im Universum gibt.',
    },
    en: {
      title: 'Hubble Deep Field',
      text: 'In late 1995, Hubble spent ten days looking at an unremarkable spot near the Big Dipper where hardly anything was expected. The result showed almost 3,000 galaxies of every shape and colour. It made clear just how unimaginably many galaxies the universe holds.',
    },
  },
  {
    id: 'smiling-lens',
    nasaId: 'GSFC_20171208_Archive_e000791',
    thumb: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000791/GSFC_20171208_Archive_e000791~thumb.jpg',
    medium: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000791/GSFC_20171208_Archive_e000791~small.jpg',
    telescope: 'hubble',
    year: 2015,
    skyFocus: 'coord:159.682,48.822,SDSS J1038',
    credit: 'NASA/ESA',
    category: 'cluster',
    de: {
      title: 'Die lächelnde Linse',
      text: 'Dieser Galaxienhaufen scheint uns anzulächeln: Zwei helle Galaxien bilden die Augen. Der „Mund“ und der Kreis um das Gesicht sind das verbogene Licht von Galaxien weit dahinter. Die enorme Masse des Haufens lenkt ihr Licht ab – ein sogenannter Einsteinring, genau wie es Einsteins Relativitätstheorie vorhersagt.',
    },
    en: {
      title: 'The smiling lens',
      text: 'This galaxy cluster seems to be smiling at us: two bright galaxies form the eyes. The “mouth” and the circle around the face are the bent light of galaxies far behind it. The cluster’s enormous mass deflects that light – a so-called Einstein ring, just as Einstein’s theory of relativity predicts.',
    },
  },

  // ---------- Hubble: Planeten ----------
  {
    id: 'jupiter-hubble',
    nasaId: 'GSFC_20171208_Archive_e000103',
    thumb: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000103/GSFC_20171208_Archive_e000103~thumb.jpg',
    medium: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000103/GSFC_20171208_Archive_e000103~medium.jpg',
    telescope: 'hubble',
    year: 2017,
    skyFocus: 'body:jupiter',
    credit: 'NASA, ESA, A. Simon (NASA Goddard)',
    category: 'planet',
    de: {
      title: 'Jupiter',
      text: 'Hubble fotografierte Jupiter im April 2017, als er der Erde besonders nahe war – immer noch rund 670 Millionen Kilometer entfernt. Helle und dunkle Wolkenbänder entstehen, weil die Luft in verschiedenen Breiten auf- oder absteigt und unterschiedlich schnell strömt. Der Große Rote Fleck ist ein Wirbelsturm, in den die ganze Erde hineinpassen würde.',
    },
    en: {
      title: 'Jupiter',
      text: 'Hubble photographed Jupiter in April 2017, when it was especially close to Earth – still about 670 million kilometres away. The light and dark cloud bands form because air rises or sinks at different latitudes and flows at different speeds. The Great Red Spot is a giant storm that the whole Earth could fit inside.',
    },
  },
  {
    id: 'saturn-hubble',
    nasaId: 'PIA05982',
    thumb: 'https://images-assets.nasa.gov/image/PIA05982/PIA05982~thumb.jpg',
    medium: 'https://images-assets.nasa.gov/image/PIA05982/PIA05982~medium.jpg',
    telescope: 'hubble',
    year: 2004,
    skyFocus: 'body:saturn',
    credit: 'NASA, ESA, E. Karkoschka (University of Arizona)',
    category: 'planet',
    de: {
      title: 'Saturn',
      text: 'Kurz bevor die Raumsonde Cassini 2004 bei Saturn ankam, nahm Hubble dieses gestochen scharfe Porträt auf. Die Ringe bestehen aus unzähligen Brocken aus Wassereis, von Staubkorn- bis Hausgröße. Obwohl sie Hunderttausende Kilometer weit reichen, sind die Hauptringe meist nur etwa zehn Meter dick.',
    },
    en: {
      title: 'Saturn',
      text: 'Shortly before the Cassini spacecraft arrived at Saturn in 2004, Hubble took this crisp portrait. The rings are made of countless chunks of water ice, from dust grains to the size of houses. Although they stretch across hundreds of thousands of kilometres, the main rings are mostly only about ten metres thick.',
    },
  },
  {
    id: 'uranus-aurora',
    nasaId: 'GSFC_20171208_Archive_e000100',
    thumb: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000100/GSFC_20171208_Archive_e000100~thumb.jpg',
    medium: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000100/GSFC_20171208_Archive_e000100~small.jpg',
    telescope: 'hubble',
    year: 2017,
    skyFocus: 'body:uranus',
    credit: 'ESA/Hubble & NASA, L. Lamy (Observatoire de Paris)',
    category: 'planet',
    de: {
      title: 'Polarlichter auf Uranus',
      text: 'Die hellen Flecken auf Uranus sind Polarlichter, die Hubble beobachtet hat. Für dieses Bild wurde eine Aufnahme der Raumsonde Voyager 2 mit Hubble-Bildern der Ringe und Polarlichter kombiniert. Uranus liegt praktisch auf der Seite, deshalb tauchen seine Polarlichter an ungewohnten Stellen auf.',
    },
    en: {
      title: 'Auroras on Uranus',
      text: 'The bright spots on Uranus are auroras seen by Hubble. For this picture, an image from the Voyager 2 spacecraft was combined with Hubble images of the rings and the auroras. Uranus is tipped almost onto its side, so its auroras show up in unusual places.',
    },
  },
  {
    id: 'mars-hubble',
    nasaId: 'GSFC_20171208_Archive_e000332',
    thumb: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000332/GSFC_20171208_Archive_e000332~thumb.jpg',
    medium: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000332/GSFC_20171208_Archive_e000332~medium.jpg',
    telescope: 'hubble',
    year: 2016,
    skyFocus: 'body:mars',
    credit: 'NASA, ESA, Hubble Heritage Team (STScI/AURA), J. Bell (ASU), M. Wolff (Space Science Institute)',
    category: 'planet',
    de: {
      title: 'Mars',
      text: 'Im Mai 2016 stand Mars der Erde besonders nahe – das passiert etwa alle 26 Monate. Hubble sah dabei die weißen Polkappen, dunkle Gebiete aus Vulkangestein und helle, staubige Ebenen. Auch dünne Wolken über dem Roten Planeten sind zu erkennen.',
    },
    en: {
      title: 'Mars',
      text: 'In May 2016, Mars came especially close to Earth – something that happens about every 26 months. Hubble caught the white polar caps, dark regions of volcanic rock and bright, dusty plains. Thin clouds above the Red Planet can be seen as well.',
    },
  },

  // ---------- Spitzer ----------
  {
    id: 'andromeda-infrared',
    nasaId: 'PIA26276',
    thumb: 'https://images-assets.nasa.gov/image/PIA26276/PIA26276~thumb.jpg',
    medium: 'https://images-assets.nasa.gov/image/PIA26276/PIA26276~medium.jpg',
    telescope: 'spitzer',
    year: 2024,
    skyFocus: 'dso:M31',
    credit: 'NASA/JPL-Caltech',
    category: 'galaxy',
    de: {
      title: 'Andromedagalaxie im Infrarot',
      text: 'Die Andromedagalaxie ist rund 2,5 Millionen Lichtjahre entfernt und bei dunklem Himmel sogar mit bloßem Auge zu sehen. Im Infrarotbild des Weltraumteleskops Spitzer leuchten Sterne bläulich und Staub rot. Die staubigen Ringe zeigen, wo in unserer großen Nachbargalaxie neue Sterne entstehen.',
    },
    en: {
      title: 'Andromeda Galaxy in infrared',
      text: 'The Andromeda Galaxy is about 2.5 million light-years away and can even be seen with the naked eye under dark skies. In this infrared image from the Spitzer Space Telescope, stars glow bluish and dust glows red. The dusty rings show where new stars are forming in our big neighbouring galaxy.',
    },
  },
  {
    id: 'orion-nebula',
    nasaId: 'PIA01322',
    thumb: 'https://images-assets.nasa.gov/image/PIA01322/PIA01322~thumb.jpg',
    medium: 'https://images-assets.nasa.gov/image/PIA01322/PIA01322~medium.jpg',
    telescope: 'spitzer',
    year: 2006,
    skyFocus: 'dso:M42',
    credit: 'NASA/JPL-Caltech/STScI',
    category: 'nebula',
    de: {
      title: 'Orionnebel',
      text: 'Der Orionnebel ist die nächste große Sternentstehungsregion, rund 1.500 Lichtjahre entfernt – mit bloßem Auge siehst du ihn als hellen Fleck im Schwert des Orion. Für dieses Bild haben Spitzer und Hubble zusammengearbeitet: Hubble zeigt das leuchtende Gas, Spitzer den warmen Staub. In der Mitte heizen einige sehr heiße junge Sterne die ganze Wolke auf.',
    },
    en: {
      title: 'Orion Nebula',
      text: 'The Orion Nebula is the closest large star-forming region, about 1,500 light-years away – with the naked eye you can see it as a bright smudge in Orion’s sword. Spitzer and Hubble teamed up for this image: Hubble shows the glowing gas, Spitzer the warm dust. In the middle, a few very hot young stars heat up the whole cloud.',
    },
  },
  {
    id: 'm87-spitzer',
    nasaId: 'PIA23122',
    thumb: 'https://images-assets.nasa.gov/image/PIA23122/PIA23122~thumb.jpg',
    medium: 'https://images-assets.nasa.gov/image/PIA23122/PIA23122~medium.jpg',
    telescope: 'spitzer',
    year: 2019,
    skyFocus: 'dso:M87',
    credit: 'NASA/JPL-Caltech/IPAC/Event Horizon Telescope Collaboration',
    category: 'galaxy',
    de: {
      title: 'M87 und sein Jet',
      text: 'Die Riesengalaxie M87 in der Jungfrau beherbergt ein Schwarzes Loch mit rund sechs Milliarden Sonnenmassen – 2019 wurde es als erstes Schwarzes Loch überhaupt abgebildet. Spitzers Infrarotbild zeigt einen Materiestrahl, den die Umgebung des Schwarzen Lochs tausende Lichtjahre weit ins All schleudert. Der Ausschnitt rechts vergrößert diesen Jet.',
    },
    en: {
      title: 'M87 and its jet',
      text: 'The giant galaxy M87 in Virgo hosts a black hole of about six billion solar masses – in 2019 it became the first black hole ever to be imaged. Spitzer’s infrared view shows a jet of matter that the surroundings of the black hole fling thousands of light-years into space. The inset on the right zooms in on this jet.',
    },
  },
  {
    id: 'rho-ophiuchi',
    nasaId: 'PIA10181',
    thumb: 'https://images-assets.nasa.gov/image/PIA10181/PIA10181~thumb.jpg',
    medium: 'https://images-assets.nasa.gov/image/PIA10181/PIA10181~medium.jpg',
    telescope: 'spitzer',
    year: 2008,
    skyFocus: 'coord:247.025,-24.542,Rho Ophiuchi',
    credit: 'NASA/JPL-Caltech/Harvard-Smithsonian CfA',
    category: 'nebula',
    de: {
      title: 'Sternenkinderstube Rho Ophiuchi',
      text: 'Die Dunkelwolke Rho Ophiuchi ist mit gut 400 Lichtjahren eines der nächsten Gebiete, in denen gerade Sterne entstehen. Im sichtbaren Licht verdeckt der Staub fast alles. Spitzer sieht im Infraroten hindurch und zeigt Hunderte junge Sterne, die noch in ihre Staubdecke gehüllt sind.',
    },
    en: {
      title: 'Rho Ophiuchi star nursery',
      text: 'At a little over 400 light-years, the Rho Ophiuchi dark cloud is one of the closest places where stars are forming right now. In visible light, the dust hides almost everything. Spitzer sees through it in infrared and reveals hundreds of young stars still wrapped in their dusty blankets.',
    },
  },
  {
    id: 'stephans-quintet',
    nasaId: 'PIA02587',
    thumb: 'https://images-assets.nasa.gov/image/PIA02587/PIA02587~thumb.jpg',
    medium: 'https://images-assets.nasa.gov/image/PIA02587/PIA02587~small.jpg',
    telescope: 'spitzer',
    year: 2006,
    skyFocus: 'coord:338.990,33.960,Stephan’s Quintet',
    credit: 'NASA/JPL-Caltech/Max Planck Institute',
    category: 'galaxy',
    de: {
      title: 'Stephans Quintett',
      text: 'Vier dieser Galaxien im Pegasus liegen rund 300 Millionen Lichtjahre entfernt und beeinflussen sich gegenseitig, die fünfte steht viel näher nur zufällig davor. Eine der Galaxien rast gerade durch die Gruppe. Spitzer entdeckte dabei eine riesige Stoßwelle – den grünen Bogen in der Mitte –, größer als unsere ganze Milchstraße.',
    },
    en: {
      title: 'Stephan’s Quintet',
      text: 'Four of these galaxies in Pegasus are about 300 million light-years away and tug on each other, while the fifth is much closer and only happens to lie in front. One of the galaxies is currently racing through the group. Spitzer discovered a huge shock wave from this crash – the green arc in the middle – bigger than our entire Milky Way.',
    },
  },

  // ---------- Chandra ----------
  {
    id: 'cassiopeia-a-chandra',
    nasaId: '0401563',
    thumb: 'https://images-assets.nasa.gov/image/0401563/0401563~thumb.jpg',
    medium: 'https://images-assets.nasa.gov/image/0401563/0401563~medium.jpg',
    telescope: 'chandra',
    year: 2004,
    skyFocus: 'coord:350.858,58.811,Cassiopeia A',
    credit: 'NASA/CXC',
    category: 'nebula',
    de: {
      title: 'Cassiopeia A im Röntgenlicht',
      text: 'Cassiopeia A ist der Überrest eines Sterns, der vor rund 350 Jahren explodierte, etwa 11.000 Lichtjahre entfernt. Chandra sieht die Millionen Grad heißen Trümmer im Röntgenlicht; der äußere Ring ist die Stoßwelle der Explosion. Für dieses Bild hat das Teleskop insgesamt eine Million Sekunden belichtet, also fast zwölf Tage.',
    },
    en: {
      title: 'Cassiopeia A in X-rays',
      text: 'Cassiopeia A is the remnant of a star that exploded about 350 years ago, roughly 11,000 light-years away. Chandra sees the debris, heated to millions of degrees, in X-ray light; the outer ring is the explosion’s shock wave. For this image the telescope collected light for a total of one million seconds – almost twelve days.',
    },
  },
  {
    id: 'crab-chandra',
    nasaId: '9905980',
    thumb: 'https://images-assets.nasa.gov/image/9905980/9905980~thumb.jpg',
    medium: 'https://images-assets.nasa.gov/image/9905980/9905980~medium.jpg',
    telescope: 'chandra',
    year: 1999,
    skyFocus: 'dso:M1',
    credit: 'NASA/CXC',
    category: 'nebula',
    de: {
      title: 'Das Herz des Krebsnebels',
      text: 'Nur zwei Monate nach dem Start blickte das Röntgenteleskop Chandra 1999 ins Zentrum des Krebsnebels. Es entdeckte einen leuchtenden Ring aus energiereichen Teilchen rund um den Pulsar und Jets, die senkrecht dazu herausschießen. Der winzige Neutronenstern treibt so den ganzen Nebel an.',
    },
    en: {
      title: 'The heart of the Crab Nebula',
      text: 'Just two months after its launch in 1999, the X-ray telescope Chandra looked into the centre of the Crab Nebula. It discovered a glowing ring of high-energy particles around the pulsar and jets shooting out at right angles to it. In this way, the tiny neutron star powers the whole nebula.',
    },
  },

  // ---------- Mehrere Teleskope ----------
  {
    id: 'galactic-center',
    nasaId: 'PIA12348',
    thumb: 'https://images-assets.nasa.gov/image/PIA12348/PIA12348~thumb.jpg',
    medium: 'https://images-assets.nasa.gov/image/PIA12348/PIA12348~medium.jpg',
    telescope: 'other',
    year: 2009,
    skyFocus: 'coord:266.417,-29.008,Sgr A*',
    credit: 'NASA/JPL-Caltech/ESA/CXC/STScI',
    category: 'other',
    de: {
      title: 'Das Zentrum der Milchstraße',
      text: 'Im sichtbaren Licht versperren dichte Staubwolken den Blick ins Zentrum unserer Galaxie, rund 26.000 Lichtjahre entfernt im Schützen. Hubble, Spitzer und Chandra haben es gemeinsam im Infrarot- und Röntgenlicht aufgenommen. Dort verbirgt sich ein Schwarzes Loch mit etwa vier Millionen Sonnenmassen.',
    },
    en: {
      title: 'The centre of the Milky Way',
      text: 'In visible light, thick dust clouds block our view of the centre of our galaxy, about 26,000 light-years away in Sagittarius. Hubble, Spitzer and Chandra captured it together in infrared and X-ray light. Hidden there is a black hole of about four million solar masses.',
    },
  },
  {
    id: 'cartwheel-galaxy',
    nasaId: 'PIA03296',
    thumb: 'https://images-assets.nasa.gov/image/PIA03296/PIA03296~thumb.jpg',
    medium: 'https://images-assets.nasa.gov/image/PIA03296/PIA03296~medium.jpg',
    telescope: 'other',
    year: 2006,
    skyFocus: 'coord:9.421,-33.716,Cartwheel Galaxy',
    credit: 'NASA/JPL-Caltech',
    category: 'galaxy',
    de: {
      title: 'Wagenradgalaxie',
      text: 'Vor einigen hundert Millionen Jahren raste eine kleinere Galaxie mitten durch diese Galaxie im Bildhauer. Wie ein Stein, der ins Wasser fällt, schickte der Aufprall eine ringförmige Welle nach außen. Wo die Welle das Gas zusammendrückt, entstehen neue Sterne – im Ultraviolett des Satelliten GALEX leuchtet der Ring deshalb blau.',
    },
    en: {
      title: 'Cartwheel Galaxy',
      text: 'A few hundred million years ago, a smaller galaxy plunged right through the middle of this galaxy in Sculptor. Like a stone dropped into water, the impact sent a ring-shaped wave rippling outward. Where the wave squeezes the gas, new stars are born – which is why the ring glows blue in ultraviolet light from the GALEX satellite.',
    },
  },

  // ---------- Raumsonden ----------
  {
    id: 'neptune-voyager',
    nasaId: 'PIA01492',
    thumb: 'https://images-assets.nasa.gov/image/PIA01492/PIA01492~thumb.jpg',
    medium: 'https://images-assets.nasa.gov/image/PIA01492/PIA01492~medium.jpg',
    telescope: 'probe',
    year: 1989,
    skyFocus: 'body:neptune',
    credit: 'NASA/JPL',
    category: 'planet',
    de: {
      title: 'Neptun von Voyager 2',
      text: 'Voyager 2 ist bis heute die einzige Raumsonde, die Neptun besucht hat; dieses Bild entstand 1989 wenige Tage vor dem Vorbeiflug. Der dunkle Fleck ist ein Sturm, ungefähr so groß wie die Erde. Auf Neptun wehen die schnellsten Winde im Sonnensystem, mit bis zu 2.000 Kilometern pro Stunde.',
    },
    en: {
      title: 'Neptune from Voyager 2',
      text: 'Voyager 2 is still the only spacecraft to have visited Neptune; this image was taken in 1989, a few days before the flyby. The dark spot is a storm roughly the size of Earth. Neptune has the fastest winds in the solar system, reaching up to 2,000 kilometres per hour.',
    },
  },
  {
    id: 'saturn-cassini',
    nasaId: 'PIA17172',
    thumb: 'https://images-assets.nasa.gov/image/PIA17172/PIA17172~thumb.jpg',
    medium: 'https://images-assets.nasa.gov/image/PIA17172/PIA17172~medium.jpg',
    telescope: 'probe',
    year: 2013,
    skyFocus: 'body:saturn',
    credit: 'NASA/JPL-Caltech/SSI',
    category: 'planet',
    de: {
      title: 'Der Tag, an dem die Erde lächelte',
      text: 'Am 19. Juli 2013 flog die Raumsonde Cassini in den Schatten des Saturn, sodass die Sonne hinter dem Planeten verschwand. Im Gegenlicht leuchten die Ringe besonders schön, und weit dahinter ist die Erde als winziger Punkt zu sehen. Viele Menschen winkten an diesem Tag bewusst in Richtung Saturn.',
    },
    en: {
      title: 'The Day the Earth Smiled',
      text: 'On 19 July 2013, the Cassini spacecraft slipped into Saturn’s shadow so that the Sun was hidden behind the planet. Backlit like this, the rings glow beautifully, and far beyond them Earth shows up as a tiny dot. Many people deliberately waved towards Saturn that day.',
    },
  },
  {
    id: 'pluto-new-horizons',
    nasaId: 'PIA19952',
    thumb: 'https://images-assets.nasa.gov/image/PIA19952/PIA19952~thumb.jpg',
    medium: 'https://images-assets.nasa.gov/image/PIA19952/PIA19952~medium.jpg',
    telescope: 'probe',
    year: 2015,
    credit: 'NASA/JHUAPL/SwRI',
    category: 'planet',
    de: {
      title: 'Pluto von New Horizons',
      text: 'Am 14. Juli 2015 flog die Raumsonde New Horizons an Pluto vorbei und zeigte erstmals, wie der Zwergplanet wirklich aussieht. Die Farben sind hier verstärkt, damit man die unterschiedlichen Gebiete besser auseinanderhalten kann. Die linke Hälfte des hellen „Herzens“ ist eine riesige Ebene aus gefrorenem Stickstoff.',
    },
    en: {
      title: 'Pluto from New Horizons',
      text: 'On 14 July 2015, the New Horizons spacecraft flew past Pluto and showed for the first time what the dwarf planet really looks like. The colours are enhanced here to make the different regions easier to tell apart. The left half of the bright “heart” is a vast plain of frozen nitrogen.',
    },
  },
  {
    id: 'pale-blue-dot',
    nasaId: 'PIA23645',
    thumb: 'https://images-assets.nasa.gov/image/PIA23645/PIA23645~thumb.jpg',
    medium: 'https://images-assets.nasa.gov/image/PIA23645/PIA23645~medium.jpg',
    telescope: 'probe',
    year: 2020,
    credit: 'NASA/JPL-Caltech',
    category: 'planet',
    de: {
      title: 'Der blasse blaue Punkt',
      text: 'Am 14. Februar 1990 drehte sich Voyager 1 aus rund sechs Milliarden Kilometern Entfernung noch einmal um. Das winzige blaue Pünktchen im Lichtstrahl rechts der Mitte ist die Erde – kleiner als ein Bildpunkt. Diese Fassung wurde 2020 mit moderner Technik neu bearbeitet und erinnert daran, wie klein und kostbar unsere Heimat ist.',
    },
    en: {
      title: 'Pale Blue Dot',
      text: 'On 14 February 1990, Voyager 1 turned around one last time from about six billion kilometres away. The tiny blue speck in the beam of light just right of centre is Earth – smaller than a single pixel. This version was reprocessed with modern software in 2020 and reminds us how small and precious our home is.',
    },
  },
];
