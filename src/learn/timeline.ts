// Meilensteine der Raumfahrt und Astronomie (Deutsch und Englisch)
import type { TimelineEvent } from './types';

export const TIMELINE: TimelineEvent[] = [
  {
    id: 'sputnik-1',
    date: '1957-10-04',
    category: 'stations',
    agency: 'UdSSR',
    article: 'rockets',
    de: {
      title: 'Sputnik 1',
      text: 'Die nur 58 Zentimeter große Metallkugel war der erste künstliche Satellit. Ihr „Piep-piep“ konnte man weltweit per Funk empfangen – der Startschuss für das Raumfahrtzeitalter und den Wettlauf ins All.',
    },
    en: {
      title: 'Sputnik 1',
      text: 'This 58-centimeter metal ball was the first artificial satellite, and radio listeners around the world could hear its beeping signal. It launched the Space Age and the race into space.',
    },
  },
  {
    id: 'sputnik-2-laika',
    date: '1957-11-03',
    category: 'humans',
    agency: 'UdSSR',
    article: 'rockets',
    de: {
      title: 'Sputnik 2 mit Hündin Laika',
      text: 'Die Hündin Laika umkreiste als erstes Tier die Erde. Sie starb schon nach wenigen Stunden an Überhitzung, doch ihr Flug zeigte, dass Lebewesen den Start und die Schwerelosigkeit überstehen können.',
    },
    en: {
      title: 'Sputnik 2 carries Laika',
      text: 'Laika the dog became the first animal to orbit Earth. She died of overheating within hours, but her flight showed that living creatures could survive launch and weightlessness.',
    },
  },
  {
    id: 'explorer-1',
    date: '1958-01-31',
    category: 'stations',
    agency: 'USA',
    article: 'earth',
    de: {
      title: 'Explorer 1 entdeckt Strahlungsgürtel',
      text: 'Der erste Satellit der USA trug einen Strahlungsdetektor und stieß damit auf die Van-Allen-Gürtel: Zonen energiereicher Teilchen, die das Erdmagnetfeld einfängt. Es war die erste große wissenschaftliche Entdeckung im All.',
    },
    en: {
      title: 'Explorer 1 finds radiation belts',
      text: 'America’s first satellite carried a radiation detector that revealed the Van Allen belts, zones of energetic particles trapped by Earth’s magnetic field. It was the first major scientific discovery of the Space Age.',
    },
  },
  {
    id: 'luna-2',
    date: '1959-09-13',
    category: 'moon',
    agency: 'UdSSR',
    article: 'moon',
    de: {
      title: 'Luna 2 trifft den Mond',
      text: 'Luna 2 schlug als erstes von Menschen gebautes Objekt auf einem anderen Himmelskörper ein. Unterwegs bestätigte die Sonde, dass der Mond kein nennenswertes Magnetfeld besitzt.',
    },
    en: {
      title: 'Luna 2 hits the Moon',
      text: 'Luna 2 became the first human-made object to reach another world when it crashed into the Moon. On the way, it confirmed that the Moon has no significant magnetic field.',
    },
  },
  {
    id: 'luna-3',
    date: '1959-10-07',
    category: 'moon',
    agency: 'UdSSR',
    article: 'moon',
    de: {
      title: 'Erster Blick auf die Mondrückseite',
      text: 'Luna 3 fotografierte als erste Sonde die Rückseite des Mondes, die von der Erde aus nie zu sehen ist. Die körnigen Bilder zeigten überraschend wenige der dunklen Mare.',
    },
    en: {
      title: 'First look at the far side',
      text: 'Luna 3 took the first photos of the lunar far side, which always faces away from Earth. The grainy images revealed surprisingly few of the dark plains called maria.',
    },
  },
  {
    id: 'gagarin-vostok-1',
    date: '1961-04-12',
    category: 'humans',
    agency: 'UdSSR',
    article: 'rockets',
    de: {
      title: 'Juri Gagarin: erster Mensch im All',
      text: 'Mit Wostok 1 umrundete Juri Gagarin einmal die Erde – in nur 108 Minuten. Als erster Mensch im Weltraum wurde er über Nacht weltberühmt.',
    },
    en: {
      title: 'Yuri Gagarin: first human in space',
      text: 'Aboard Vostok 1, Yuri Gagarin circled Earth once in just 108 minutes. As the first human in space, he became a worldwide celebrity overnight.',
    },
  },
  {
    id: 'tereshkova-vostok-6',
    date: '1963-06-16',
    category: 'humans',
    agency: 'UdSSR',
    article: 'rockets',
    de: {
      title: 'Erste Frau im All',
      text: 'Walentina Tereschkowa umkreiste mit Wostok 6 in knapp drei Tagen 48-mal die Erde. Sie ist bis heute die einzige Frau, die allein ins All geflogen ist.',
    },
    en: {
      title: 'First woman in space',
      text: 'Valentina Tereshkova orbited Earth 48 times in nearly three days aboard Vostok 6. She is still the only woman ever to fly into space alone.',
    },
  },
  {
    id: 'leonov-first-spacewalk',
    date: '1965-03-18',
    category: 'humans',
    agency: 'UdSSR',
    article: 'rockets',
    de: {
      title: 'Erster Weltraumspaziergang',
      text: 'Alexei Leonow stieg aus Woschod 2 aus und schwebte rund zwölf Minuten frei im All. Sein Anzug blähte sich so stark auf, dass er kaum zurück in die Luftschleuse passte.',
    },
    en: {
      title: 'First spacewalk',
      text: 'Alexei Leonov floated outside Voskhod 2 for about 12 minutes. His spacesuit ballooned so much that he barely squeezed back into the airlock.',
    },
  },
  {
    id: 'luna-9',
    date: '1966-02-03',
    category: 'moon',
    agency: 'UdSSR',
    article: 'moon',
    de: {
      title: 'Erste weiche Mondlandung',
      text: 'Luna 9 landete als erste Sonde sanft auf dem Mond und funkte Panoramabilder von der Oberfläche. Sie bewies: Der Boden ist fest genug, um darauf zu landen.',
    },
    en: {
      title: 'First soft landing on the Moon',
      text: 'Luna 9 made the first soft landing on the Moon and sent back panoramic pictures from the surface. It proved that the ground was firm enough to land on.',
    },
  },
  {
    id: 'apollo-8',
    date: '1968-12-24',
    category: 'moon',
    agency: 'NASA',
    article: 'moon',
    de: {
      title: 'Apollo 8 umkreist den Mond',
      text: 'Frank Borman, Jim Lovell und Bill Anders flogen als erste Menschen zum Mond und umrundeten ihn zehnmal. Dabei entstand das berühmte Foto „Earthrise“: die Erde, die über dem Mondhorizont aufgeht.',
    },
    en: {
      title: 'Apollo 8 orbits the Moon',
      text: 'Frank Borman, Jim Lovell, and Bill Anders were the first humans to travel to the Moon, circling it 10 times. They captured “Earthrise,” the iconic photo of Earth rising above the lunar horizon.',
    },
  },
  {
    id: 'apollo-11',
    date: '1969-07-20',
    category: 'moon',
    agency: 'NASA',
    article: 'moon',
    de: {
      title: 'Apollo 11: Menschen auf dem Mond',
      text: 'Neil Armstrong und Buzz Aldrin landeten mit der Mondfähre „Eagle“ im Meer der Ruhe, während Michael Collins im Orbit wartete. Hunderte Millionen Menschen verfolgten Armstrongs ersten Schritt live.',
    },
    en: {
      title: 'Apollo 11: humans on the Moon',
      text: 'Neil Armstrong and Buzz Aldrin landed the lunar module Eagle in the Sea of Tranquility while Michael Collins waited in orbit. Hundreds of millions of people watched Armstrong’s first step live.',
    },
  },
  {
    id: 'venera-7',
    date: '1970-12-15',
    category: 'planets',
    agency: 'UdSSR',
    article: 'venus',
    de: {
      title: 'Venera 7 landet auf der Venus',
      text: 'Venera 7 sendete als erste Sonde Daten von der Oberfläche eines anderen Planeten. Bei rund 475 °C und enormem Druck funkte sie gut 20 Minuten lang.',
    },
    en: {
      title: 'Venera 7 lands on Venus',
      text: 'Venera 7 was the first spacecraft to send data from the surface of another planet. In heat of about 475 °C (890 °F) and crushing pressure, it kept transmitting for just over 20 minutes.',
    },
  },
  {
    id: 'salyut-1',
    date: '1971-04-19',
    category: 'stations',
    agency: 'UdSSR',
    article: 'iss',
    de: {
      title: 'Saljut 1: erste Raumstation',
      text: 'Die UdSSR brachte die erste Raumstation in die Erdumlaufbahn. Im Juni 1971 lebte die Crew von Sojus 11 gut drei Wochen an Bord – und kam bei der Rückkehr tragisch ums Leben.',
    },
    en: {
      title: 'Salyut 1: first space station',
      text: 'The Soviet Union launched the first space station into orbit. In June 1971, the Soyuz 11 crew lived aboard for over three weeks but tragically died during their return to Earth.',
    },
  },
  {
    id: 'apollo-17',
    date: '1972-12-11',
    category: 'moon',
    agency: 'NASA',
    article: 'moon',
    de: {
      title: 'Apollo 17: letzte Mondlandung',
      text: 'Eugene Cernan und Harrison Schmitt sind bisher die letzten Menschen, die den Mond betreten haben. Der Geologe Schmitt war der erste Wissenschaftler, der dort forschte.',
    },
    en: {
      title: 'Apollo 17: last Moon landing',
      text: 'Eugene Cernan and Harrison Schmitt are, so far, the last people to walk on the Moon. Schmitt, a geologist, was the first scientist to explore its surface.',
    },
  },
  {
    id: 'apollo-soyuz',
    date: '1975-07-17',
    category: 'humans',
    agency: 'NASA/UdSSR',
    article: 'rockets',
    de: {
      title: 'Apollo-Sojus: Handschlag im All',
      text: 'Mitten im Kalten Krieg koppelten ein amerikanisches und ein sowjetisches Raumschiff im Orbit aneinander. Der Händedruck von Thomas Stafford und Alexei Leonow wurde zum Symbol der Zusammenarbeit.',
    },
    en: {
      title: 'Apollo–Soyuz: handshake in space',
      text: 'In the middle of the Cold War, an American and a Soviet spacecraft docked in orbit. The handshake between Thomas Stafford and Alexei Leonov became a symbol of cooperation.',
    },
  },
  {
    id: 'viking-1',
    date: '1976-07-20',
    category: 'planets',
    agency: 'NASA',
    article: 'mars',
    de: {
      title: 'Viking 1 landet auf dem Mars',
      text: 'Viking 1 war die erste Sonde, die auf dem Mars landete und dort lange arbeitete. Über mehr als sechs Jahre lieferte sie die ersten Farbbilder der Oberfläche und suchte sogar nach Leben.',
    },
    en: {
      title: 'Viking 1 lands on Mars',
      text: 'Viking 1 was the first spacecraft to land on Mars and keep working there for a long time. Over more than six years, it sent the first color images from the surface and even searched for life.',
    },
  },
  {
    id: 'voyager-launches',
    date: '1977-08-20',
    category: 'planets',
    agency: 'NASA',
    article: 'jupiter',
    de: {
      title: 'Voyager 1 und 2 starten',
      text: 'Am 20. August startete Voyager 2, am 5. September Voyager 1. Die Zwillingssonden erkundeten Jupiter und Saturn, Voyager 2 als bisher einzige Sonde auch Uranus und Neptun.',
    },
    en: {
      title: 'Voyager 1 and 2 launch',
      text: 'Voyager 2 lifted off on August 20, followed by Voyager 1 on September 5. The twin probes explored Jupiter and Saturn, and Voyager 2 is still the only spacecraft to visit Uranus and Neptune.',
    },
  },
  {
    id: 'sts-1',
    date: '1981-04-12',
    category: 'humans',
    agency: 'NASA',
    article: 'rockets',
    de: {
      title: 'Erster Flug des Space Shuttle',
      text: 'John Young und Robert Crippen flogen mit der Columbia, dem ersten wiederverwendbaren Raumschiff, ins All – genau 20 Jahre nach Gagarin. Bis 2011 starteten Shuttles zu 135 Missionen.',
    },
    en: {
      title: 'First Space Shuttle flight',
      text: 'John Young and Robert Crippen flew Columbia, the first reusable spacecraft, into orbit exactly 20 years after Gagarin. Shuttles went on to fly 135 missions until 2011.',
    },
  },
  {
    id: 'mir',
    date: '1986-02-20',
    category: 'stations',
    agency: 'UdSSR',
    article: 'iss',
    de: {
      title: 'Raumstation Mir',
      text: 'Das Kernmodul der Mir startete ins All, danach wuchs die Station Modul für Modul. An Bord stellte Waleri Poljakow mit 437 Tagen den bis heute gültigen Rekord für den längsten Raumflug auf.',
    },
    en: {
      title: 'Mir space station',
      text: 'Mir’s core module reached orbit, and the station grew module by module over the years. Aboard Mir, Valeri Polyakov set the still-unbroken record for the longest single spaceflight: 437 days.',
    },
  },
  {
    id: 'hubble',
    date: '1990-04-24',
    category: 'telescopes',
    agency: 'NASA/ESA',
    article: 'galaxies',
    de: {
      title: 'Hubble-Weltraumteleskop startet',
      text: 'Die Raumfähre Discovery brachte Hubble ins All. Nachdem Astronauten 1993 die fehlerhafte Optik korrigiert hatten, lieferte es atemberaubende Bilder und half, das Alter des Universums genauer zu bestimmen.',
    },
    en: {
      title: 'Hubble Space Telescope launches',
      text: 'Space shuttle Discovery carried Hubble into orbit. After astronauts corrected its flawed optics in 1993, it delivered breathtaking images and helped pin down the age of the universe.',
    },
  },
  {
    id: '51-pegasi-b',
    date: '1995-10-06',
    category: 'telescopes',
    agency: 'Uni Genf',
    article: 'exoplanets',
    de: {
      title: 'Erster Planet um eine fremde Sonne',
      text: 'Michel Mayor und Didier Queloz entdeckten 51 Pegasi b, den ersten Exoplaneten bei einem sonnenähnlichen Stern. Der heiße Gasriese umläuft ihn in nur vier Tagen – 2019 gab es dafür den Physik-Nobelpreis.',
    },
    en: {
      title: 'First planet around a Sun-like star',
      text: 'Michel Mayor and Didier Queloz discovered 51 Pegasi b, the first exoplanet found orbiting a Sun-like star. The hot gas giant circles its star in just four days, a find that earned the 2019 Nobel Prize in Physics.',
    },
  },
  {
    id: 'mars-pathfinder',
    date: '1997-07-04',
    category: 'planets',
    agency: 'NASA',
    article: 'mars',
    de: {
      title: 'Pathfinder bringt Sojourner zum Mars',
      text: 'Mars Pathfinder landete mit Airbags auf dem Mars und setzte Sojourner ab, den ersten Rover auf einem anderen Planeten. Das kleine Fahrzeug war kaum größer als eine Mikrowelle.',
    },
    en: {
      title: 'Pathfinder delivers Sojourner to Mars',
      text: 'Mars Pathfinder bounced to a landing on airbags and released Sojourner, the first rover on another planet. The little vehicle was about the size of a microwave oven.',
    },
  },
  {
    id: 'iss-zarya',
    date: '1998-11-20',
    category: 'stations',
    agency: 'international',
    article: 'iss',
    de: {
      title: 'Baustart der ISS',
      text: 'Eine russische Proton-Rakete brachte Sarja ins All, das erste Modul der Internationalen Raumstation. Zwei Wochen später kam das US-Modul Unity dazu – der Aufbau des größten Bauwerks im All hatte begonnen.',
    },
    en: {
      title: 'ISS construction begins',
      text: 'A Russian Proton rocket launched Zarya, the first module of the International Space Station. Two weeks later the US module Unity joined it, and assembly of the largest structure in space was underway.',
    },
  },
  {
    id: 'iss-expedition-1',
    date: '2000-11-02',
    category: 'stations',
    agency: 'international',
    article: 'iss',
    de: {
      title: 'ISS dauerhaft bewohnt',
      text: 'William Shepherd, Juri Gidsenko und Sergei Krikaljow zogen als erste Langzeitcrew auf die ISS. Seitdem leben ohne Unterbrechung Menschen im All.',
    },
    en: {
      title: 'ISS permanently crewed',
      text: 'William Shepherd, Yuri Gidzenko, and Sergei Krikalev became the first long-term crew aboard the ISS. Ever since, people have lived in space without a break.',
    },
  },
  {
    id: 'spirit-opportunity',
    date: '2004-01-04',
    category: 'planets',
    agency: 'NASA',
    article: 'mars',
    de: {
      title: 'Spirit und Opportunity landen',
      text: 'Im Abstand von drei Wochen landeten die Zwillingsrover Spirit und Opportunity auf dem Mars. Sie fanden Belege für einstiges Wasser; geplant für 90 Tage, fuhr Opportunity mehr als 14 Jahre lang.',
    },
    en: {
      title: 'Spirit and Opportunity land on Mars',
      text: 'The twin rovers Spirit and Opportunity touched down on Mars three weeks apart. They found evidence of past water, and Opportunity, built for 90 days, kept going for more than 14 years.',
    },
  },
  {
    id: 'cassini-saturn',
    date: '2004-07-01',
    category: 'planets',
    agency: 'NASA/ESA',
    article: 'saturn',
    de: {
      title: 'Cassini erreicht Saturn',
      text: 'Die Sonde Cassini schwenkte in eine Umlaufbahn um Saturn ein und erforschte den Ringplaneten 13 Jahre lang. Unter anderem entdeckte sie Fontänen aus Wasserdampf und Eis auf dem Mond Enceladus.',
    },
    en: {
      title: 'Cassini arrives at Saturn',
      text: 'Cassini entered orbit around Saturn and studied the ringed planet for 13 years. Among its discoveries were jets of water vapor and ice shooting from the moon Enceladus.',
    },
  },
  {
    id: 'huygens-titan',
    date: '2005-01-14',
    category: 'planets',
    agency: 'ESA',
    article: 'saturn',
    de: {
      title: 'Huygens landet auf Titan',
      text: 'Die europäische Sonde Huygens schwebte am Fallschirm auf den Saturnmond Titan hinab. Es ist bis heute die am weitesten entfernte Landung – mit Bildern von Flussrinnen und Kieseln aus Eis.',
    },
    en: {
      title: 'Huygens lands on Titan',
      text: 'Europe’s Huygens probe parachuted down to Saturn’s moon Titan. It remains the most distant landing ever, and its images showed river channels and rounded pebbles of ice.',
    },
  },
  {
    id: 'kepler',
    date: '2009-03-07',
    category: 'telescopes',
    agency: 'NASA',
    article: 'exoplanets',
    de: {
      title: 'Kepler sucht neue Welten',
      text: 'Das Weltraumteleskop Kepler beobachtete rund 150.000 Sterne und achtete auf winzige Helligkeitseinbrüche, wenn ein Planet vorbeizieht. So fand es mehr als 2.600 bestätigte Exoplaneten.',
    },
    en: {
      title: 'Kepler hunts for new worlds',
      text: 'The Kepler space telescope watched about 150,000 stars for tiny dips in brightness caused by passing planets. This way, it found more than 2,600 confirmed exoplanets.',
    },
  },
  {
    id: 'curiosity',
    date: '2012-08-06',
    category: 'planets',
    agency: 'NASA',
    article: 'mars',
    de: {
      title: 'Curiosity landet im Gale-Krater',
      text: 'Ein „Himmelskran“ setzte den autogroßen Rover Curiosity sanft auf dem Mars ab. Curiosity zeigte, dass der Gale-Krater einst für Mikroben lebensfreundlich war – und ist bis heute unterwegs.',
    },
    en: {
      title: 'Curiosity lands in Gale Crater',
      text: 'A “sky crane” gently lowered the car-sized Curiosity rover onto Mars. Curiosity showed that Gale Crater could once have supported microbial life, and it is still exploring today.',
    },
  },
  {
    id: 'voyager-1-interstellar',
    date: '2012-08-25',
    category: 'planets',
    agency: 'NASA',
    article: 'sun',
    de: {
      title: 'Voyager 1 im interstellaren Raum',
      text: 'Voyager 1 verließ als erstes Objekt von Menschenhand die Heliosphäre, die Blase aus Sonnenwind rund um unser Sonnensystem. Seither fliegt die Sonde durch den Raum zwischen den Sternen.',
    },
    en: {
      title: 'Voyager 1 reaches interstellar space',
      text: 'Voyager 1 became the first human-made object to leave the heliosphere, the bubble the solar wind blows around our solar system. Since then, it has been traveling through the space between the stars.',
    },
  },
  {
    id: 'rosetta-philae',
    date: '2014-11-12',
    category: 'planets',
    agency: 'ESA',
    article: 'asteroids-comets',
    de: {
      title: 'Philae landet auf einem Kometen',
      text: 'Philae, der Lander der Rosetta-Mission, setzte als erste Sonde auf einem Kometen auf: 67P/Tschurjumow-Gerassimenko. Er prallte zweimal ab und blieb im Schatten liegen, lieferte aber trotzdem wertvolle Messdaten.',
    },
    en: {
      title: 'Philae lands on a comet',
      text: 'Rosetta’s lander Philae made the first-ever landing on a comet, 67P/Churyumov–Gerasimenko. It bounced twice and came to rest in shadow, but still sent back valuable data.',
    },
  },
  {
    id: 'new-horizons-pluto',
    date: '2015-07-14',
    category: 'planets',
    agency: 'NASA',
    article: 'pluto',
    de: {
      title: 'New Horizons besucht Pluto',
      text: 'Nach über neun Jahren Flug zeigte New Horizons den Zwergplaneten Pluto erstmals aus der Nähe. Zu sehen waren Berge aus Wassereis und eine riesige herzförmige Ebene.',
    },
    en: {
      title: 'New Horizons flies past Pluto',
      text: 'After a journey of more than nine years, New Horizons gave us our first close-up look at the dwarf planet Pluto. It revealed mountains of water ice and a huge heart-shaped plain.',
    },
  },
  {
    id: 'gravitational-waves',
    date: '2015-09-14',
    category: 'telescopes',
    agency: 'LIGO',
    article: 'black-holes',
    de: {
      title: 'Erste Gravitationswellen gemessen',
      text: 'Die LIGO-Detektoren fingen winzige Kräuselungen der Raumzeit auf, ausgelöst von zwei Schwarzen Löchern, die rund 1,3 Milliarden Lichtjahre entfernt verschmolzen. Einstein hatte diese Wellen vorhergesagt; 2017 gab es dafür den Nobelpreis.',
    },
    en: {
      title: 'First gravitational waves detected',
      text: 'LIGO’s detectors picked up tiny ripples in spacetime from two black holes merging about 1.3 billion light-years away. Einstein had predicted such waves, and the discovery won the 2017 Nobel Prize in Physics.',
    },
  },
  {
    id: 'change-4',
    date: '2019-01-03',
    category: 'moon',
    agency: 'CNSA',
    article: 'moon',
    de: {
      title: 'Chang’e 4 auf der Mondrückseite',
      text: 'China gelang die erste Landung auf der Rückseite des Mondes, im Von-Kármán-Krater. Weil von dort kein direkter Funkkontakt zur Erde möglich ist, lief die Verbindung über den Relaissatelliten Queqiao.',
    },
    en: {
      title: 'Chang’e 4 on the far side',
      text: 'China made the first landing on the Moon’s far side, in Von Kármán crater. Because the far side never faces Earth, the mission relayed its signals through the Queqiao satellite.',
    },
  },
  {
    id: 'm87-black-hole-image',
    date: '2019-04-10',
    category: 'telescopes',
    agency: 'EHT',
    article: 'black-holes',
    de: {
      title: 'Erstes Bild eines Schwarzen Lochs',
      text: 'Das Event Horizon Telescope verband Radioteleskope rund um den Globus zu einem erdgroßen Teleskop. Es zeigte den Schatten von M87*, einem Schwarzen Loch mit 6,5 Milliarden Sonnenmassen in 55 Millionen Lichtjahren Entfernung.',
    },
    en: {
      title: 'First image of a black hole',
      text: 'The Event Horizon Telescope linked radio dishes around the world into one Earth-sized telescope. It revealed the shadow of M87*, a black hole 6.5 billion times the mass of the Sun, 55 million light-years away.',
    },
  },
  {
    id: 'crew-dragon-demo-2',
    date: '2020-05-30',
    category: 'humans',
    agency: 'SpaceX/NASA',
    article: 'iss',
    de: {
      title: 'Erster Crewflug von SpaceX',
      text: 'Doug Hurley und Bob Behnken flogen mit der Crew Dragon zur ISS – erstmals brachte ein kommerzielles Raumschiff Astronauten in die Umlaufbahn. Zugleich starteten erstmals seit 2011 wieder Astronauten von den USA aus.',
    },
    en: {
      title: 'SpaceX’s first crewed flight',
      text: 'Doug Hurley and Bob Behnken flew to the ISS aboard Crew Dragon, the first commercial spacecraft to carry astronauts into orbit. It was also the first crewed launch from US soil since 2011.',
    },
  },
  {
    id: 'perseverance',
    date: '2021-02-18',
    category: 'planets',
    agency: 'NASA',
    article: 'mars',
    de: {
      title: 'Perseverance landet im Jezero-Krater',
      text: 'Der Rover Perseverance landete in einem ehemaligen Kratersee auf dem Mars. Er sucht nach Spuren früheren Lebens und sammelt Gesteinsproben, die eines Tages zur Erde gebracht werden könnten.',
    },
    en: {
      title: 'Perseverance lands in Jezero Crater',
      text: 'The Perseverance rover touched down in an ancient Martian crater lake. It searches for signs of past life and collects rock samples that could one day be brought back to Earth.',
    },
  },
  {
    id: 'ingenuity-first-flight',
    date: '2021-04-19',
    category: 'planets',
    agency: 'NASA',
    article: 'mars',
    de: {
      title: 'Ingenuity fliegt auf dem Mars',
      text: 'Der kleine Hubschrauber Ingenuity schaffte den ersten kontrollierten Motorflug auf einem anderen Planeten. Geplant waren fünf Testflüge – am Ende wurden es 72.',
    },
    en: {
      title: 'Ingenuity flies on Mars',
      text: 'The small helicopter Ingenuity made the first powered, controlled flight on another planet. Five test flights were planned; it ended up making 72.',
    },
  },
  {
    id: 'jwst-launch',
    date: '2021-12-25',
    category: 'telescopes',
    agency: 'NASA/ESA/CSA',
    article: 'galaxies',
    de: {
      title: 'James-Webb-Teleskop startet',
      text: 'Eine Ariane-5-Rakete schickte das James-Webb-Weltraumteleskop zu seinem Beobachtungsposten, 1,5 Millionen Kilometer von der Erde entfernt. Mit seinem 6,5-Meter-Spiegel blickt es im Infrarotlicht bis zu einigen der ersten Galaxien.',
    },
    en: {
      title: 'James Webb Space Telescope launches',
      text: 'An Ariane 5 rocket sent the James Webb Space Telescope toward its observing post, about 1 million miles from Earth. With its 6.5-meter mirror, it peers in infrared light at some of the first galaxies.',
    },
  },
  {
    id: 'dart-impact',
    date: '2022-09-26',
    category: 'planets',
    agency: 'NASA',
    article: 'asteroids-comets',
    de: {
      title: 'DART schubst einen Asteroiden',
      text: 'Die Sonde DART prallte absichtlich auf den kleinen Asteroidenmond Dimorphos und verkürzte seine Umlaufzeit um 32 Minuten. Es war der erste Test, die Bahn eines Himmelskörpers gezielt zu verändern.',
    },
    en: {
      title: 'DART nudges an asteroid',
      text: 'NASA’s DART spacecraft deliberately crashed into the small asteroid moon Dimorphos, shortening its orbit by 32 minutes. It was the first test of changing a celestial body’s path on purpose.',
    },
  },
  {
    id: 'artemis-1',
    date: '2022-11-16',
    category: 'moon',
    agency: 'NASA',
    article: 'moon',
    de: {
      title: 'Artemis I fliegt zum Mond',
      text: 'Die neue Großrakete SLS schickte das Raumschiff Orion ohne Besatzung auf eine gut 25-tägige Reise um den Mond – angetrieben von einem Servicemodul aus Europa. Der Test ebnet Astronauten den Weg zurück zum Mond.',
    },
    en: {
      title: 'Artemis I flies to the Moon',
      text: 'NASA’s new SLS rocket launched an uncrewed Orion spacecraft, powered by a European service module, on a 25-day trip around the Moon. The test paved the way for astronauts to return.',
    },
  },
  {
    id: 'chandrayaan-3',
    date: '2023-08-23',
    category: 'moon',
    agency: 'ISRO',
    article: 'moon',
    de: {
      title: 'Chandrayaan-3 nahe dem Südpol',
      text: 'Indien landete als viertes Land weich auf dem Mond – und als erstes in der Nähe des lunaren Südpols. Anschließend untersuchte der Rover Pragyan dort den Boden.',
    },
    en: {
      title: 'Chandrayaan-3 lands near the south pole',
      text: 'India became the fourth country to soft-land on the Moon and the first to do so near the lunar south pole. Its rover, Pragyan, then studied the soil there.',
    },
  },
  {
    id: 'europa-clipper',
    date: '2024-10-14',
    category: 'planets',
    agency: 'NASA',
    article: 'jupiter',
    de: {
      title: 'Europa Clipper startet',
      text: 'Die größte Planetensonde der NASA ist unterwegs zum Jupitermond Europa. Ab 2030 soll sie bei Dutzenden Vorbeiflügen prüfen, ob der Ozean unter dem Eispanzer Leben ermöglichen könnte.',
    },
    en: {
      title: 'Europa Clipper launches',
      text: 'NASA’s largest planetary spacecraft ever is on its way to Jupiter’s moon Europa. Starting in 2030, it will make dozens of flybys to find out whether the ocean beneath the ice could support life.',
    },
  },
  {
    id: 'blue-ghost',
    date: '2025-03-02',
    category: 'moon',
    agency: 'Firefly',
    article: 'moon',
    de: {
      title: 'Blue Ghost landet auf dem Mond',
      text: 'Der Lander Blue Ghost der US-Firma Firefly Aerospace setzte im Mare Crisium auf. Es war die erste vollständig erfolgreiche Mondlandung eines privaten Unternehmens – mit Experimenten der NASA an Bord.',
    },
    en: {
      title: 'Blue Ghost lands on the Moon',
      text: 'Firefly Aerospace’s Blue Ghost lander touched down in Mare Crisium. It was the first fully successful Moon landing by a private company, and it carried NASA experiments.',
    },
  },
];
