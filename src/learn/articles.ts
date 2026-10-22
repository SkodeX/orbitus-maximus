// Lexikon-Artikel (Deutsch und Englisch)
import type { Article } from './types';

export const ARTICLES: Article[] = [
  {
    id: 'sun',
    category: 'solar',
    solarId: 'sun',
    skyFocus: 'body:sun',
    related: ['stars', 'aurora', 'eclipses'],
    de: {
      title: 'Die Sonne',
      summary: 'Ein ganz gewöhnlicher Stern – und doch die Quelle von Licht und Wärme, ohne die es auf der Erde kein Leben gäbe.',
      sections: [
        {
          heading: 'Ein Kraftwerk aus Gas',
          text: 'Die Sonne ist eine gewaltige Kugel aus Wasserstoff und Helium. Ihr Durchmesser von rund 1,39 Millionen Kilometern entspricht 109 Erden in einer Reihe. In ihrem Kern herrschen etwa 15 Millionen Grad. Dort verschmelzen Wasserstoffkerne zu Helium, und ein winziger Teil der Masse wird dabei zu Energie – genau nach Einsteins Formel E = mc². Diese Energie erreicht uns als Licht und Wärme, und das schon seit rund 4,6 Milliarden Jahren.',
        },
        {
          heading: 'Flecken und Ausbrüche',
          text: 'Die leuchtende Oberfläche, die wir sehen, heißt Photosphäre. Darauf zeigen sich oft dunkle Sonnenflecken: kühlere Stellen, an denen starke Magnetfelder den Wärmestrom aus dem Inneren bremsen. Ihre Zahl steigt und fällt in einem Rhythmus von etwa elf Jahren. In aktiven Phasen schleudert die Sonne bei Ausbrüchen Wolken aus geladenen Teilchen ins All. Treffen sie die Erde, entstehen Polarlichter – manchmal stören sie aber auch Satelliten, Funk und Stromnetze.',
        },
        {
          heading: 'Sicher beobachten',
          text: 'Schau niemals ungeschützt in die Sonne – und schon gar nicht durch ein Fernglas oder Teleskop. Wenige Sekunden können die Netzhaut für immer schädigen. Sicher bist du mit einer geprüften Sonnenfinsternisbrille nach ISO 12312-2 oder mit spezieller Sonnenfilterfolie, die fest vor der Öffnung des Geräts sitzt. Dann kannst du Sonnenflecken verfolgen, die mit der Drehung der Sonne in knapp zwei Wochen über die Scheibe wandern. Ganz ohne Gerät klappt es mit einer Lochkamera aus Karton.',
        },
        {
          heading: 'Wie es weitergeht',
          text: 'Die Sonne hat etwa die Hälfte ihres Lebens hinter sich. In rund fünf Milliarden Jahren geht ihr im Kern der Wasserstoff aus. Dann bläht sie sich zu einem Roten Riesen auf und verschluckt Merkur und Venus – ob auch die Erde, ist noch offen. Später stößt sie ihre äußeren Schichten ab, die eine Zeit lang als farbiger Nebel leuchten. Zurück bleibt ein Weißer Zwerg: ein glühender Rest, kaum größer als die Erde, der über unvorstellbar lange Zeit abkühlt.',
        },
      ],
    },
    en: {
      title: 'The Sun',
      summary: 'An ordinary star – yet the source of the light and warmth without which there would be no life on Earth.',
      sections: [
        {
          heading: 'A power plant made of gas',
          text: 'The Sun is a giant ball of hydrogen and helium. Its diameter of about 1.39 million kilometers equals 109 Earths lined up side by side. In its core, the temperature reaches around 15 million degrees. There, hydrogen nuclei fuse into helium, and a tiny fraction of their mass turns into energy – exactly as Einstein’s E = mc² describes. That energy reaches us as light and heat, and it has been doing so for about 4.6 billion years.',
        },
        {
          heading: 'Spots and eruptions',
          text: 'The glowing surface we see is called the photosphere. Dark sunspots often appear on it: cooler areas where strong magnetic fields hold back the flow of heat from below. Their number rises and falls in a cycle of about eleven years. During active phases, the Sun hurls clouds of charged particles into space. When they hit Earth, they spark auroras – and sometimes disrupt satellites, radio links and power grids.',
        },
        {
          heading: 'Observing safely',
          text: 'Never look at the Sun without protection – and never through binoculars or a telescope. A few seconds can damage your retina permanently. You are safe with certified eclipse glasses meeting ISO 12312-2, or with proper solar filter film fixed securely over the front of your instrument. Then you can follow sunspots as the Sun’s rotation carries them across the disk in just under two weeks. With no equipment at all, a simple pinhole projector made from cardboard works well.',
        },
        {
          heading: 'What comes next',
          text: 'The Sun is roughly halfway through its life. In about five billion years, its core will run out of hydrogen. It will then swell into a red giant and swallow Mercury and Venus – whether Earth survives is still an open question. Later it will shed its outer layers, which will glow for a while as a colorful nebula. Left behind will be a white dwarf: a glowing remnant barely larger than Earth that cools over an almost unimaginable span of time.',
        },
      ],
    },
  },
  {
    id: 'mercury',
    category: 'solar',
    solarId: 'mercury',
    skyFocus: 'body:mercury',
    related: ['venus', 'sun', 'observing'],
    de: {
      title: 'Merkur',
      summary: 'Der kleinste Planet rast in nur 88 Tagen um die Sonne und versteckt sich meist in ihrem grellen Licht.',
      sections: [
        {
          heading: 'Klein, schnell, eisenreich',
          text: 'Merkur ist der kleinste Planet des Sonnensystems und nur etwas größer als unser Mond. Für eine Runde um die Sonne braucht er bloß 88 Tage – kein anderer Planet ist schneller. Seine Oberfläche ist mit Kratern übersät und erinnert an den Mond. Innen sieht es ganz anders aus: Ein riesiger Eisenkern reicht bis etwa 85 Prozent seines Radius. Deshalb ist der kleine Merkur nach der Erde der Planet mit der zweithöchsten Dichte.',
        },
        {
          heading: 'Glut und Eis',
          text: 'Merkur hat praktisch keine Atmosphäre, die Wärme speichern könnte. Auf der Tagseite wird der Boden heißer als 400 Grad, nachts kühlt er auf fast −180 Grad ab. Und doch gibt es dort Eis: In tiefen Kratern an den Polen herrscht ewiger Schatten, weil Merkurs Achse kaum geneigt ist. Die Raumsonde MESSENGER hat dort gefrorenes Wasser nachgewiesen – ausgerechnet auf dem sonnennächsten Planeten.',
        },
        {
          heading: 'Besuch von Sonden',
          text: 'Weil Merkur so nah an der Sonne kreist, ist er schwer zu erreichen: Eine Sonde muss enorm abbremsen, statt Schwung zu holen. Mariner 10 flog 1974 und 1975 dreimal an ihm vorbei. MESSENGER umkreiste ihn von 2011 bis 2015 und kartierte erstmals die gesamte Oberfläche. Die europäisch-japanische Mission BepiColombo startete 2018 und nutzt mehrere Vorbeiflüge an Erde, Venus und Merkur, um langsam genug für eine Umlaufbahn zu werden.',
        },
        {
          heading: 'So findest du Merkur',
          text: 'Merkur entfernt sich am Himmel nie weit von der Sonne. Du siehst ihn deshalb nur in der Dämmerung, tief am Horizont: abends kurz nach Sonnenuntergang im Westen oder morgens vor Sonnenaufgang im Osten. Gute Gelegenheiten gibt es mehrmals im Jahr für jeweils ein bis zwei Wochen. Besonders günstig sind bei uns Abende im Frühling und Morgen im Herbst. Suche mit dem Fernglas erst, wenn die Sonne ganz untergegangen ist.',
        },
      ],
    },
    en: {
      title: 'Mercury',
      summary: 'The smallest planet races around the Sun in just 88 days and usually hides in its glare.',
      sections: [
        {
          heading: 'Small, fast, iron-rich',
          text: 'Mercury is the smallest planet in the solar system, only a little larger than our Moon. It needs just 88 days to circle the Sun – no other planet is faster. Its crater-covered surface looks a lot like the Moon. Inside, though, it is very different: a huge iron core extends to about 85 percent of its radius. That is why tiny Mercury is the second-densest planet after Earth.',
        },
        {
          heading: 'Fire and ice',
          text: 'Mercury has almost no atmosphere to hold on to heat. On the day side the ground gets hotter than 400 °C; at night it cools to almost −180 °C. And yet there is ice: deep craters near the poles lie in permanent shadow because Mercury’s axis is barely tilted. The MESSENGER spacecraft detected frozen water there – on the planet closest to the Sun, of all places.',
        },
        {
          heading: 'Visiting spacecraft',
          text: 'Because Mercury orbits so close to the Sun, it is hard to reach: a probe has to shed enormous speed instead of gaining it. Mariner 10 flew past three times in 1974 and 1975. MESSENGER orbited the planet from 2011 to 2015 and mapped its entire surface for the first time. The European-Japanese mission BepiColombo launched in 2018 and uses several flybys of Earth, Venus and Mercury to slow down enough to enter orbit.',
        },
        {
          heading: 'How to find Mercury',
          text: 'Mercury never strays far from the Sun in the sky. You can only see it in twilight, low on the horizon: in the evening just after sunset in the west, or in the morning before sunrise in the east. Good chances come several times a year, each lasting one to two weeks. From mid-northern latitudes, spring evenings and fall mornings are best. Only scan with binoculars once the Sun has fully set.',
        },
      ],
    },
  },
  {
    id: 'venus',
    category: 'solar',
    solarId: 'venus',
    skyFocus: 'body:venus',
    related: ['earth', 'mercury', 'magnitude'],
    de: {
      title: 'Venus',
      summary: 'Fast ein Zwilling der Erde – doch unter ihren Wolken herrschen Temperaturen, bei denen Blei schmilzt.',
      sections: [
        {
          heading: 'Die ungleiche Zwillingsschwester',
          text: 'Venus ist fast genauso groß und schwer wie die Erde und kommt uns näher als jeder andere Planet. Damit enden die Gemeinsamkeiten. Ihre Atmosphäre besteht zu rund 96 Prozent aus Kohlendioxid und ist so dicht, dass am Boden der 90-fache Luftdruck der Erde herrscht – so viel wie bei uns in 900 Metern Meerestiefe. Ein extremer Treibhauseffekt heizt die Oberfläche auf über 460 Grad auf, Tag und Nacht, am Äquator wie an den Polen.',
        },
        {
          heading: 'Ein Tag länger als ein Jahr',
          text: 'Venus dreht sich extrem langsam: Eine Umdrehung um sich selbst dauert 243 Erdtage. Für eine Runde um die Sonne braucht sie dagegen nur 225 Tage – ihr Tag ist also länger als ihr Jahr. Zudem rotiert sie anders herum als fast alle anderen Planeten. Warum, weiß niemand genau; die Ideen reichen von einem frühen Zusammenstoß bis zu Gezeitenkräften der Sonne auf die dichte Atmosphäre. Die oberen Wolken jagen dagegen in nur etwa vier Tagen einmal um den Planeten.',
        },
        {
          heading: 'Landungen in der Hölle',
          text: 'Mit Venera 7 gelang der Sowjetunion 1970 die erste weiche Landung auf einem anderen Planeten. Spätere Venera-Sonden schickten Farbbilder von der Oberfläche, bevor Hitze und Druck sie nach spätestens rund zwei Stunden zerstörten. Unter den Wolken liegen weite Lavaebenen und Tausende Vulkane. Weil man durch die Wolkendecke nicht hindurchsehen kann, kartierte die US-Sonde Magellan Anfang der 1990er-Jahre fast die gesamte Oberfläche per Radar.',
        },
        {
          heading: 'Abendstern und Morgenstern',
          text: 'Nach Sonne und Mond ist Venus das hellste Objekt am Himmel – heller als jeder Stern. Je nach Stellung leuchtet sie wochenlang abends im Westen oder morgens im Osten. Schon ein kleines Teleskop zeigt, dass sie wie der Mond Phasen hat: mal fast rund, mal eine schmale Sichel. Galileo Galilei sah das 1610 und fand darin einen starken Beleg, dass die Planeten um die Sonne kreisen. Wer genau weiß, wo sie steht, kann sie sogar am Taghimmel entdecken.',
        },
      ],
    },
    en: {
      title: 'Venus',
      summary: 'Almost Earth’s twin – yet beneath its clouds, temperatures are hot enough to melt lead.',
      sections: [
        {
          heading: 'The unequal twin',
          text: 'Venus is nearly the same size and mass as Earth, and it comes closer to us than any other planet. That is where the similarities end. Its atmosphere is about 96 percent carbon dioxide and so dense that the pressure at the surface is 90 times that on Earth – like being 900 meters deep in the ocean. A runaway greenhouse effect heats the ground to over 460 °C, day and night, at the equator and at the poles alike.',
        },
        {
          heading: 'A day longer than a year',
          text: 'Venus spins extremely slowly: one rotation takes 243 Earth days. A trip around the Sun takes only 225 days – so its day is longer than its year. It also turns in the opposite direction to almost all other planets. Nobody knows exactly why; ideas range from a giant collision early on to the Sun’s tidal pull on the thick atmosphere. Meanwhile, the upper clouds race around the whole planet in only about four days.',
        },
        {
          heading: 'Landing in an inferno',
          text: 'In 1970, the Soviet probe Venera 7 made the first soft landing on another planet. Later Venera landers sent back color pictures of the surface before heat and pressure destroyed them, after two hours at most. Beneath the clouds lie vast lava plains and thousands of volcanoes. Because no one can see through the cloud cover, NASA’s Magellan probe mapped almost the entire surface by radar in the early 1990s.',
        },
        {
          heading: 'Evening star and morning star',
          text: 'After the Sun and Moon, Venus is the brightest object in the sky – brighter than any star. Depending on its position, it shines for weeks in the evening in the west or in the morning in the east. Even a small telescope shows that it has phases like the Moon: sometimes nearly round, sometimes a thin crescent. Galileo saw this in 1610 and took it as strong evidence that the planets orbit the Sun. If you know exactly where to look, you can even spot it in daylight.',
        },
      ],
    },
  },
  {
    id: 'earth',
    category: 'solar',
    solarId: 'earth',
    related: ['moon', 'aurora', 'iss'],
    de: {
      title: 'Die Erde',
      summary: 'Der einzige Ort im Universum, von dem wir sicher wissen, dass es dort Leben gibt – und ein erstaunlich aktiver Planet.',
      sections: [
        {
          heading: 'Ein Planet mit Wasser',
          text: 'Die Erde ist der dritte Planet von der Sonne, im Mittel knapp 150 Millionen Kilometer von ihr entfernt. Dieser Abstand ist ein Glücksfall: Es ist warm genug für flüssiges Wasser, aber nicht so heiß, dass es verdampft. Wasser formt Wetter und Landschaften und ist die Grundlage allen bekannten Lebens. Die Erde ist etwa 4,5 Milliarden Jahre alt, und schon vor mindestens 3,5 Milliarden Jahren gab es hier einfache Lebewesen.',
        },
        {
          heading: 'Eine Welt in Bewegung',
          text: 'Die Erdkruste ist in große Platten zerbrochen, die sich jedes Jahr um einige Zentimeter verschieben – etwa so schnell, wie deine Fingernägel wachsen. Wo sie zusammenstoßen, türmen sich Gebirge auf und Erdbeben erschüttern das Land. Wo sie auseinanderdriften, quillt neues Gestein aus dem Inneren. Eine solche Plattentektonik kennen wir von keinem anderen Planeten. Sie erneuert über Jahrmillionen die Oberfläche und hilft, das Klima langfristig stabil zu halten.',
        },
        {
          heading: 'Der unsichtbare Schutzschild',
          text: 'Im flüssigen äußeren Erdkern strömt Eisen und erzeugt ein Magnetfeld. Es lenkt die meisten geladenen Teilchen des Sonnenwinds um die Erde herum. Nur in Polnähe dringen einige tiefer ein und bringen die Luft als Polarlicht zum Leuchten. Die Atmosphäre aus rund 78 Prozent Stickstoff und 21 Prozent Sauerstoff hält uns warm, und die Ozonschicht darin filtert einen großen Teil der schädlichen UV-Strahlung der Sonne heraus.',
        },
        {
          heading: 'Warum es Jahreszeiten gibt',
          text: 'Viele glauben, im Sommer sei die Erde der Sonne näher. Tatsächlich ist sie ihr Anfang Januar am nächsten! Der wahre Grund ist die um rund 23,4 Grad geneigte Erdachse. Im Juni neigt sich die Nordhalbkugel der Sonne zu: Sie steigt mittags hoch, scheint lange und wärmt kräftig. Im Dezember ist es umgekehrt, und auf der Südhalbkugel herrscht dann Sommer. Du kannst das selbst verfolgen – achte übers Jahr darauf, wo die Sonne auf- und untergeht.',
        },
      ],
    },
    en: {
      title: 'Earth',
      summary: 'The only place in the universe where we know for sure that life exists – and a surprisingly restless planet.',
      sections: [
        {
          heading: 'A planet with water',
          text: 'Earth is the third planet from the Sun, on average just under 150 million kilometers away. That distance is a stroke of luck: it is warm enough for liquid water, but not so hot that the water boils away. Water shapes the weather and the landscape, and it is the basis of all known life. Earth is about 4.5 billion years old, and simple life existed here at least 3.5 billion years ago.',
        },
        {
          heading: 'A world on the move',
          text: 'Earth’s crust is broken into large plates that shift a few centimeters each year – about as fast as your fingernails grow. Where they collide, mountains rise and earthquakes shake the land. Where they drift apart, new rock wells up from below. We know of no other planet with this kind of plate tectonics. Over millions of years it renews the surface and helps keep the climate stable in the long run.',
        },
        {
          heading: 'An invisible shield',
          text: 'In Earth’s liquid outer core, flowing iron generates a magnetic field. It steers most of the charged particles in the solar wind around our planet. Only near the poles do some of them get deeper and make the air glow as auroras. The atmosphere – about 78 percent nitrogen and 21 percent oxygen – keeps us warm, and its ozone layer filters out much of the Sun’s harmful ultraviolet radiation.',
        },
        {
          heading: 'Why we have seasons',
          text: 'Many people think Earth is closer to the Sun in summer. In fact, it is closest in early January! The real reason is Earth’s axis, tilted by about 23.4 degrees. In June, the Northern Hemisphere leans toward the Sun: it climbs high at noon, shines for long hours and heats strongly. In December the opposite is true, and it is summer in the Southern Hemisphere. You can follow this yourself by noting where the Sun rises and sets over the course of a year.',
        },
      ],
    },
  },
  {
    id: 'moon',
    category: 'solar',
    solarId: 'moon',
    skyFocus: 'body:moon',
    related: ['moon-phases', 'eclipses', 'earth'],
    de: {
      title: 'Der Mond',
      summary: 'Unser treuer Begleiter entstand vermutlich bei einem gewaltigen Zusammenstoß – und ist der einzige fremde Himmelskörper, den Menschen betreten haben.',
      sections: [
        {
          heading: 'Entstanden bei einem Zusammenstoß',
          text: 'Die meisten Forschenden gehen davon aus, dass vor rund 4,5 Milliarden Jahren ein etwa marsgroßer Körper die junge Erde rammte. Aus den Trümmern, die dabei ins All geschleudert wurden, ballte sich der Mond zusammen. Mit 3.474 Kilometern Durchmesser ist er gut ein Viertel so groß wie die Erde. Seine Schwerkraft zieht an den Ozeanen und hebt sie leicht an – so entstehen Ebbe und Flut.',
        },
        {
          heading: 'Meere ohne Wasser',
          text: 'Mit bloßem Auge siehst du helle und dunkle Flächen. Die dunklen heißen seit Jahrhunderten Maria, also Meere. Tatsächlich sind es erstarrte Lavaebenen, entstanden größtenteils vor über drei Milliarden Jahren, als flüssiges Gestein riesige Einschlagbecken füllte. Die hellen Hochländer sind noch älter und dicht mit Kratern bedeckt. Weil der Mond keine Luft und kein Wetter hat, verwittert dort fast nichts – die Fußspuren der Astronauten sind wahrscheinlich bis heute erhalten.',
        },
        {
          heading: 'Menschen auf dem Mond',
          text: 'Am 20. Juli 1969 landeten Neil Armstrong und Buzz Aldrin mit Apollo 11 als erste Menschen auf dem Mond. Bis 1972 folgten fünf weitere Landungen; insgesamt zwölf Astronauten liefen über die Mondoberfläche. Sie brachten 382 Kilogramm Gestein mit, das bis heute erforscht wird. Danach kamen nur noch Roboter – Sonden aus den USA, der Sowjetunion, China, Indien und Japan. Mit dem Artemis-Programm will die NASA wieder Menschen zum Mond bringen.',
        },
        {
          heading: 'Selbst beobachten',
          text: 'Der Vollmond ist zwar am hellsten, aber zum Beobachten am wenigsten spannend: Das Licht fällt frontal ein, es gibt kaum Schatten. Viel schöner ist der Blick einige Tage vor oder nach dem Halbmond. Entlang der Grenze zwischen Tag und Nacht werfen Kraterwälle und Berge lange Schatten und wirken fast plastisch. Schon ein ruhig gehaltenes Fernglas zeigt dir Dutzende Krater, ein kleines Teleskop sogar Gebirgszüge und Täler.',
        },
      ],
    },
    en: {
      title: 'The Moon',
      summary: 'Our faithful companion probably formed in a giant collision – and it is the only other world humans have set foot on.',
      sections: [
        {
          heading: 'Born in a collision',
          text: 'Most scientists think that about 4.5 billion years ago, a body roughly the size of Mars slammed into the young Earth. The Moon then gathered from the debris thrown into space. At 3,474 kilometers across, it is just over a quarter of Earth’s diameter. Its gravity tugs on the oceans and raises them slightly – that is what creates the tides.',
        },
        {
          heading: 'Seas without water',
          text: 'With the naked eye you can see bright and dark patches. For centuries the dark ones have been called maria, Latin for seas. In fact they are plains of solidified lava, formed mostly more than three billion years ago when molten rock flooded huge impact basins. The bright highlands are even older and densely cratered. With no air and no weather, almost nothing erodes on the Moon – the astronauts’ footprints are probably still there today.',
        },
        {
          heading: 'People on the Moon',
          text: 'On July 20, 1969, Neil Armstrong and Buzz Aldrin landed on the Moon with Apollo 11, the first humans ever to do so. Five more landings followed until 1972; in total, twelve astronauts walked on the lunar surface. They brought back 382 kilograms of rock that scientists are still studying. Since then only robots have gone – landers from the United States, the Soviet Union, China, India and Japan. With its Artemis program, NASA aims to send people back to the Moon.',
        },
        {
          heading: 'See it yourself',
          text: 'The full Moon is the brightest, but it is the least exciting to observe: sunlight hits it head-on, so there are hardly any shadows. The view is much better a few days before or after a half Moon. Along the line between day and night, crater walls and mountains cast long shadows and look almost three-dimensional. Steadily held binoculars show you dozens of craters; a small telescope even reveals mountain ranges and valleys.',
        },
      ],
    },
  },
  {
    id: 'mars',
    category: 'solar',
    solarId: 'mars',
    skyFocus: 'body:mars',
    related: ['earth', 'asteroids-comets', 'rockets'],
    de: {
      title: 'Mars',
      summary: 'Der Rote Planet war einst feucht und vielleicht lebensfreundlich – heute suchen Roboter in seinem Staub nach Spuren dieser Vergangenheit.',
      sections: [
        {
          heading: 'Warum Mars rot ist',
          text: 'Mars ist etwa halb so groß wie die Erde. Seine Farbe verdankt er feinem Staub voller Eisenoxid – im Grunde Rost. Die Atmosphäre besteht vor allem aus Kohlendioxid und ist hauchdünn: Der Luftdruck am Boden beträgt weniger als ein Prozent des irdischen. Zwei winzige, unregelmäßig geformte Monde begleiten ihn, Phobos und Deimos. Ihre Namen bedeuten Furcht und Schrecken – passend zum Kriegsgott Mars.',
        },
        {
          heading: 'Auf der Suche nach Wasser',
          text: 'Ausgetrocknete Flusstäler, Seebecken und Deltas zeigen: Vor über drei Milliarden Jahren floss auf Mars Wasser. Heute steckt es als Eis in den Polkappen und im Boden. Ob damals Leben entstand, ist eine der großen offenen Fragen. Der Rover Curiosity erkundet seit 2012 den Gale-Krater, Perseverance seit 2021 den Jezero-Krater, ein ehemaliges Seebecken. Perseverance sammelt dabei Gesteinsproben für eine mögliche spätere Rückholung zur Erde.',
        },
        {
          heading: 'Jahreszeiten und Staubstürme',
          text: 'Weil die Marsachse ähnlich geneigt ist wie die der Erde, gibt es Jahreszeiten – nur dauern sie etwa doppelt so lang, denn ein Marsjahr hat 687 Tage. Im Winter gefriert an den Polen ein Teil der Atmosphäre zu Trockeneis. Gelegentlich wachsen Staubstürme so stark an, dass sie den ganzen Planeten für Wochen einhüllen. Ein solcher Sturm verdunkelte 2018 die Sonne so sehr, dass der solarbetriebene Rover Opportunity für immer verstummte.',
        },
        {
          heading: 'So findest du Mars',
          text: 'Etwa alle 26 Monate überholt die Erde den Mars auf ihrer Innenbahn. Dann steht er der Sonne gegenüber, ist die ganze Nacht sichtbar und leuchtet besonders hell in kräftigem Orange. Rund um diese Opposition scheint er wochenlang rückwärts durch die Sternbilder zu wandern – eine Schleife, über die frühe Astronomen lange rätselten. Im Teleskop siehst du dann oft eine weiße Polkappe und dunkle Flecken auf der Oberfläche.',
        },
      ],
    },
    en: {
      title: 'Mars',
      summary: 'The Red Planet was once wet and perhaps habitable – today, robots search its dust for traces of that past.',
      sections: [
        {
          heading: 'Why Mars is red',
          text: 'Mars is about half the size of Earth. It owes its color to fine dust full of iron oxide – essentially rust. Its atmosphere is mostly carbon dioxide and extremely thin: surface pressure is less than one percent of Earth’s. Two tiny, irregularly shaped moons, Phobos and Deimos, accompany it. Their names mean fear and dread – fitting companions for the god of war.',
        },
        {
          heading: 'In search of water',
          text: 'Dry river valleys, lake basins and deltas reveal that water flowed on Mars more than three billion years ago. Today it is locked up as ice in the polar caps and underground. Whether life ever arose there is one of the big open questions. The Curiosity rover has been exploring Gale Crater since 2012, and Perseverance has been exploring Jezero Crater, a former lake, since 2021. Perseverance is collecting rock samples for a possible later return to Earth.',
        },
        {
          heading: 'Seasons and dust storms',
          text: 'Because the axis of Mars is tilted much like Earth’s, it has seasons – but they last about twice as long, since a Martian year has 687 days. In winter, part of the atmosphere freezes into dry ice at the poles. Now and then dust storms grow so large that they wrap the entire planet for weeks. One such storm in 2018 dimmed the Sun so much that the solar-powered rover Opportunity fell silent for good.',
        },
        {
          heading: 'How to find Mars',
          text: 'About every 26 months, Earth overtakes Mars on its inner track. Mars then stands opposite the Sun, is visible all night and shines especially bright in a strong orange. Around this opposition, it appears to move backward through the constellations for weeks – a loop that puzzled early astronomers for centuries. Through a telescope you can then often see a white polar cap and dark markings on the surface.',
        },
      ],
    },
  },
  {
    id: 'jupiter',
    category: 'solar',
    solarId: 'jupiter',
    skyFocus: 'body:jupiter',
    related: ['saturn', 'asteroids-comets', 'observing'],
    de: {
      title: 'Jupiter',
      summary: 'Der größte Planet ist eine Welt aus Gas und Stürmen – mit einer Mondfamilie, die fast ein eigenes kleines Sonnensystem bildet.',
      sections: [
        {
          heading: 'Ein Riese ohne Boden',
          text: 'Jupiter hat den elffachen Durchmesser der Erde; über 1.300 Erden würden in ihn hineinpassen. Er besteht vor allem aus Wasserstoff und Helium und hat keine feste Oberfläche, auf der man landen könnte. Tief im Inneren wird der Wasserstoff unter gewaltigem Druck zu einer Art flüssigem Metall. Ströme darin erzeugen das stärkste Magnetfeld aller Planeten. Und Jupiter dreht sich so schnell, dass er an den Polen sichtbar abgeplattet ist.',
        },
        {
          heading: 'Stürme und Streifen',
          text: 'Die hellen Zonen und dunklen Bänder sind Wolkengürtel, die in entgegengesetzte Richtungen um den Planeten strömen. Dazwischen wirbeln unzählige Stürme. Der berühmteste ist der Große Rote Fleck, ein Wirbelsturm, der seit mindestens 190 Jahren beobachtet wird. Er schrumpft allerdings seit Jahrzehnten. Die NASA-Sonde Juno erreichte Jupiter 2016 und zeigte, dass seine Stürme Hunderte Kilometer in die Tiefe reichen.',
        },
        {
          heading: 'Eine eigene Mondfamilie',
          text: 'Jupiter hat über 90 bekannte Monde, die meisten nur wenige Kilometer groß. Die vier großen sind eigene Welten: Io speit Lava aus Hunderten Vulkanen, Europa und Ganymed verbergen vermutlich Ozeane unter ihrem Eis, und Kallisto ist mit Kratern übersät. Ganymed ist sogar der größte Mond im Sonnensystem. Gleich zwei Sonden sind auf dem Weg dorthin: JUICE von der ESA und Europa Clipper von der NASA.',
        },
        {
          heading: 'So findest du Jupiter',
          text: 'Jupiter ist meist das hellste Objekt am Nachthimmel nach Mond und Venus. Du erkennst ihn an seinem ruhigen, cremeweißen Licht, das kaum funkelt. Halte ein Fernglas ganz still oder lehne dich an: Dann siehst du bis zu vier winzige Lichtpunkte in einer Linie neben ihm – die großen Monde. Sie stehen jede Nacht anders. Weil Jupiter rund zwölf Jahre für einen Umlauf braucht, wandert er pro Jahr etwa ein Tierkreissternbild weiter.',
        },
      ],
    },
    en: {
      title: 'Jupiter',
      summary: 'The largest planet is a world of gas and storms – with a family of moons that is almost a solar system of its own.',
      sections: [
        {
          heading: 'A giant without ground',
          text: 'Jupiter is eleven times as wide as Earth; more than 1,300 Earths would fit inside it. It consists mostly of hydrogen and helium and has no solid surface to land on. Deep inside, the hydrogen is squeezed under immense pressure into a kind of liquid metal. Currents in it generate the strongest magnetic field of any planet. And Jupiter spins so fast that it is visibly flattened at the poles.',
        },
        {
          heading: 'Storms and stripes',
          text: 'The light zones and dark belts are bands of clouds that stream around the planet in opposite directions. Countless storms swirl between them. The most famous is the Great Red Spot, a giant storm that has been observed for at least 190 years. It has been shrinking for decades, though. NASA’s Juno probe arrived at Jupiter in 2016 and showed that its storms reach hundreds of kilometers deep.',
        },
        {
          heading: 'A family of moons',
          text: 'Jupiter has more than 90 known moons, most of them only a few kilometers across. The four large ones are worlds in their own right: Io spews lava from hundreds of volcanoes, Europa and Ganymede probably hide oceans beneath their ice, and Callisto is covered in craters. Ganymede is even the largest moon in the solar system. Two spacecraft are on their way there: ESA’s JUICE and NASA’s Europa Clipper.',
        },
        {
          heading: 'How to find Jupiter',
          text: 'Jupiter is usually the brightest object in the night sky after the Moon and Venus. You can recognize it by its steady, creamy-white light that hardly twinkles. Hold binoculars very still or brace them against something: you will see up to four tiny points of light in a line beside it – the large moons. Their positions change from night to night. Because Jupiter takes about twelve years to orbit the Sun, it moves roughly one zodiac constellation farther each year.',
        },
      ],
    },
  },
  {
    id: 'saturn',
    category: 'solar',
    solarId: 'saturn',
    skyFocus: 'body:saturn',
    related: ['jupiter', 'uranus', 'observing'],
    de: {
      title: 'Saturn',
      summary: 'Seine Ringe machen Saturn zum schönsten Anblick im Teleskop – und seine Monde gehören zu den spannendsten Orten im Sonnensystem.',
      sections: [
        {
          heading: 'Ringe aus Eis',
          text: 'Saturns Hauptringe messen von Rand zu Rand rund 270.000 Kilometer – mehr als zwei Drittel der Strecke von der Erde zum Mond. Sie bestehen zum größten Teil aus Wassereis. Lücken und scharfe Kanten darin entstehen durch die Schwerkraft von Monden. Wie alt die Ringe sind, ist umstritten: Manche Messungen deuten darauf hin, dass sie viel jünger sind als Saturn selbst, vielleicht nur einige Hundert Millionen Jahre.',
        },
        {
          heading: 'Titan und Enceladus',
          text: 'Saturn hat über 270 bekannte Monde – mehr als jeder andere Planet. Der größte, Titan, ist größer als Merkur und hat eine dichte Stickstoffatmosphäre. Dort regnet es Methan, das sich in Seen sammelt. 2005 landete die europäische Sonde Huygens auf Titan – die bislang fernste Landung überhaupt. Der kleine Enceladus schießt aus Spalten am Südpol Fontänen aus Wasserdampf und Eis ins All, gespeist von einem verborgenen Ozean.',
        },
        {
          heading: 'Die Mission Cassini',
          text: 'Von 2004 bis 2017 umkreiste die Raumsonde Cassini den Saturn und lieferte Hunderttausende Bilder. Sie entdeckte die Fontänen von Enceladus, kartierte Titans Seen und beobachtete am Nordpol ein riesiges Sechseck aus strömenden Wolken – breiter als die Erde. Am Ende ihrer Mission stürzte Cassini gezielt in Saturns Atmosphäre. So konnte sie nie versehentlich auf einen Mond fallen, auf dem vielleicht Leben möglich ist.',
        },
        {
          heading: 'So findest du Saturn',
          text: 'Saturn leuchtet als ruhiger, gelblicher Lichtpunkt, heller als die meisten Sterne, aber schwächer als Jupiter. Für die Ringe brauchst du ein Teleskop – schon 30-fache Vergrößerung reicht, und der Anblick ist unvergesslich. Weil wir im Lauf seines 29-jährigen Umlaufs mal schräg von oben, mal von unten auf die Ringe schauen, ändert sich ihr Aussehen. Alle 14 bis 16 Jahre blicken wir genau auf ihre Kante; dann verschwinden sie fast – zuletzt 2025.',
        },
      ],
    },
    en: {
      title: 'Saturn',
      summary: 'Its rings make Saturn the most beautiful sight in a telescope – and its moons are among the most exciting places in the solar system.',
      sections: [
        {
          heading: 'Rings of ice',
          text: 'Saturn’s main rings span about 270,000 kilometers from edge to edge – more than two-thirds of the distance from Earth to the Moon. They are made mostly of water ice. Gaps and sharp edges in them are shaped by the gravity of moons. How old the rings are is debated: some measurements suggest they are much younger than Saturn itself, perhaps only a few hundred million years.',
        },
        {
          heading: 'Titan and Enceladus',
          text: 'Saturn has more than 270 known moons – more than any other planet. The largest, Titan, is bigger than Mercury and has a thick nitrogen atmosphere. It rains methane there, which collects in lakes. In 2005, the European Huygens probe landed on Titan – the most distant landing to date. Little Enceladus shoots fountains of water vapor and ice into space from cracks at its south pole, fed by a hidden ocean.',
        },
        {
          heading: 'The Cassini mission',
          text: 'From 2004 to 2017, the Cassini spacecraft orbited Saturn and sent back hundreds of thousands of images. It discovered the fountains of Enceladus, mapped Titan’s lakes and studied a giant hexagon of swirling clouds at the north pole – wider than Earth. At the end of its mission, Cassini was deliberately plunged into Saturn’s atmosphere. That way it could never accidentally crash onto a moon that might be able to support life.',
        },
        {
          heading: 'How to find Saturn',
          text: 'Saturn shines as a steady, yellowish point of light, brighter than most stars but fainter than Jupiter. To see the rings you need a telescope – a magnification of 30 times is enough, and the sight is unforgettable. Because we look at the rings from slightly above or below during its 29-year orbit, their appearance changes. Every 14 to 16 years we see them exactly edge-on, and they almost vanish – most recently in 2025.',
        },
      ],
    },
  },
  {
    id: 'uranus',
    category: 'solar',
    solarId: 'uranus',
    skyFocus: 'body:uranus',
    related: ['neptune', 'saturn', 'magnitude'],
    de: {
      title: 'Uranus',
      summary: 'Der erste mit einem Teleskop entdeckte Planet ist ein eisiger Sonderling – mit extrem gekippter Achse und Monden voller Dichternamen.',
      sections: [
        {
          heading: 'Zufällig entdeckt',
          text: 'Bis 1781 kannte man nur die sechs Planeten, die man mit bloßem Auge sieht. Dann bemerkte der Musiker und Astronom Wilhelm Herschel in England mit seinem selbst gebauten Teleskop ein Scheibchen, das sich langsam bewegte. Zunächst hielt er es für einen Kometen. Doch die Bahn verriet: Es war ein neuer Planet, doppelt so weit von der Sonne entfernt wie Saturn. Damit verdoppelte sich die bekannte Größe des Sonnensystems auf einen Schlag.',
        },
        {
          heading: 'Ein Eisriese',
          text: 'Uranus ist viermal so breit wie die Erde. Unter seiner Hülle aus Wasserstoff und Helium liegt vermutlich ein dichter Mantel aus Wasser, Ammoniak und Methan, die Fachleute „Eise“ nennen – obwohl sie dort heiß und flüssig sind. Seine Achse ist um rund 98 Grad gekippt, vielleicht durch einen gewaltigen Zusammenstoß in der Frühzeit. Außerdem besitzt Uranus dunkle, schmale Ringe, die erst 1977 entdeckt wurden.',
        },
        {
          heading: 'Monde mit Dichternamen',
          text: 'Die Monde des Uranus tragen Namen aus Werken von William Shakespeare und Alexander Pope: Titania, Oberon, Ariel, Umbriel, Miranda und viele mehr. Miranda sieht aus, als wäre sie aus Einzelteilen zusammengeflickt, und hat Steilwände von vielen Kilometern Höhe. Bislang hat nur eine einzige Sonde Uranus besucht: Voyager 2 flog 1986 an ihm vorbei. Fast alles, was wir aus der Nähe über ihn wissen, stammt von diesem kurzen Besuch.',
        },
        {
          heading: 'So findest du Uranus',
          text: 'Uranus ist gerade so hell, dass man ihn unter sehr dunklem Himmel mit bloßem Auge erahnen kann – wenn man genau weiß, wohin man schauen muss. Mit Fernglas und Sternkarte findest du ihn leichter: als Lichtpunkt, der sich von den Sternen nur durch seinen zarten Grünstich unterscheidet. Ein Teleskop zeigt ein winziges, blassgrünes Scheibchen. Da Uranus 84 Jahre für einen Umlauf braucht, bleibt er jahrelang im selben Sternbild.',
        },
      ],
    },
    en: {
      title: 'Uranus',
      summary: 'The first planet discovered with a telescope is an icy oddball – with an extremely tilted axis and moons named after literary characters.',
      sections: [
        {
          heading: 'Found by chance',
          text: 'Until 1781, people knew only the six planets visible to the naked eye. Then William Herschel, a musician and astronomer living in England, spotted a small disk moving slowly through his homemade telescope. At first he took it for a comet. But its orbit revealed the truth: it was a new planet, twice as far from the Sun as Saturn. At a stroke, the known size of the solar system doubled.',
        },
        {
          heading: 'An ice giant',
          text: 'Uranus is four times as wide as Earth. Beneath its envelope of hydrogen and helium lies, scientists think, a dense mantle of water, ammonia and methane, which they call “ices” – even though these materials are hot and fluid down there. Its axis is tilted by about 98 degrees, perhaps the result of a huge collision long ago. Uranus also has dark, narrow rings that were only discovered in 1977.',
        },
        {
          heading: 'Moons with literary names',
          text: 'The moons of Uranus are named after characters from the works of William Shakespeare and Alexander Pope: Titania, Oberon, Ariel, Umbriel, Miranda and many more. Miranda looks as if it had been patched together from spare parts, and it has cliffs many kilometers high. So far only one spacecraft has visited Uranus: Voyager 2 flew past in 1986. Almost everything we know about it up close comes from that brief encounter.',
        },
        {
          heading: 'How to find Uranus',
          text: 'Uranus is just bright enough to glimpse with the naked eye under a very dark sky – if you know exactly where to look. With binoculars and a star chart it is easier: it looks like a star, set apart only by a delicate green tint. A telescope shows a tiny, pale green disk. Since Uranus takes 84 years to orbit the Sun, it stays in the same constellation for years.',
        },
      ],
    },
  },
  {
    id: 'neptune',
    category: 'solar',
    solarId: 'neptune',
    skyFocus: 'body:neptune',
    related: ['uranus', 'pluto', 'light-year'],
    de: {
      title: 'Neptun',
      summary: 'Am Rand des Planetensystems kreist Neptun: ein kalter, stürmischer Riese, zu dem das Sonnenlicht gut vier Stunden unterwegs ist.',
      sections: [
        {
          heading: 'Gefunden mit Mathematik',
          text: 'Uranus wich immer wieder leicht von seiner berechneten Bahn ab. Der französische Mathematiker Urbain Le Verrier vermutete dahinter einen unbekannten Planeten und berechnete, wo er stehen müsste. Am 23. September 1846 richtete Johann Gottfried Galle an der Berliner Sternwarte sein Teleskop auf diese Stelle – und fand Neptun weniger als ein Grad von der vorhergesagten Position entfernt. Ein Triumph der Himmelsmechanik.',
        },
        {
          heading: 'Ein Sturmplanet',
          text: 'Neptun ist ein Eisriese, ähnlich aufgebaut wie Uranus und fast genauso groß. Methan in seiner Atmosphäre schluckt rotes Licht und lässt ihn bläulich erscheinen. Obwohl er so weit von der Sonne entfernt ist, toben dort heftige Winde. Voyager 2 sah 1989 einen riesigen dunklen Wirbelsturm, den „Großen Dunklen Fleck“. Wenige Jahre später zeigte das Hubble-Teleskop: Er war verschwunden – dafür tauchten anderswo neue Flecken auf.',
        },
        {
          heading: 'Triton, der Rückwärtsläufer',
          text: 'Neptuns größter Mond Triton umkreist ihn entgegen der Drehrichtung des Planeten. Das gibt es bei keinem anderen großen Mond. Mit rund 2.700 Kilometern Durchmesser ist Triton etwas kleiner als unser Mond. Vermutlich war er einst ein eigenständiger Körper aus dem Kuipergürtel, den Neptun eingefangen hat. Seine Oberfläche gehört zu den kältesten im Sonnensystem. Trotzdem beobachtete Voyager 2 dort dunkle Fontänen, die kilometerhoch aufstiegen.',
        },
        {
          heading: 'So findest du Neptun',
          text: 'Mit bloßem Auge siehst du Neptun nie. Mit einem guten Fernglas und einer genauen Sternkarte kannst du ihn aber als unscheinbaren Lichtpunkt aufspüren. Ob du ihn erwischt hast, erkennst du daran, dass er sich im Lauf von Wochen gegenüber den Sternen verschiebt. Im Teleskop wird daraus ein winziges bläuliches Scheibchen. Ein Neptunjahr dauert 165 Erdjahre: Erst 2011 hat er seine erste volle Runde seit der Entdeckung vollendet.',
        },
      ],
    },
    en: {
      title: 'Neptune',
      summary: 'At the edge of the planetary system circles Neptune: a cold, stormy giant that sunlight takes just over four hours to reach.',
      sections: [
        {
          heading: 'Found with mathematics',
          text: 'Uranus kept straying slightly from its calculated path. The French mathematician Urbain Le Verrier suspected an unknown planet was tugging on it and worked out where it ought to be. On September 23, 1846, Johann Gottfried Galle at the Berlin Observatory pointed his telescope at that spot – and found Neptune less than one degree from the predicted position. It was a triumph of celestial mechanics.',
        },
        {
          heading: 'A stormy world',
          text: 'Neptune is an ice giant built much like Uranus and almost the same size. Methane in its atmosphere absorbs red light and makes it look bluish. Despite its great distance from the Sun, fierce winds rage there. In 1989, Voyager 2 saw a huge dark storm, the “Great Dark Spot.” A few years later the Hubble Space Telescope showed that it had vanished – while new spots had appeared elsewhere.',
        },
        {
          heading: 'Triton, the backward moon',
          text: 'Neptune’s largest moon, Triton, orbits in the opposite direction to the planet’s rotation. No other large moon does that. At about 2,700 kilometers across, Triton is somewhat smaller than our Moon. It was probably once an independent body from the Kuiper Belt that Neptune captured. Its surface is one of the coldest in the solar system. Even so, Voyager 2 saw dark plumes rising kilometers high there.',
        },
        {
          heading: 'How to find Neptune',
          text: 'You will never see Neptune with the naked eye. With good binoculars and a detailed star chart, though, you can track it down as an inconspicuous point of light. You can tell you’ve got it because it shifts against the stars over the course of a few weeks. A telescope turns it into a tiny bluish disk. A Neptunian year lasts 165 Earth years: only in 2011 did it complete its first full orbit since its discovery.',
        },
      ],
    },
  },
  {
    id: 'pluto',
    category: 'solar',
    solarId: 'pluto',
    related: ['neptune', 'asteroids-comets'],
    de: {
      title: 'Pluto und die Zwergplaneten',
      summary: 'Pluto verlor 2006 seinen Planetentitel – dafür ist er heute der bekannteste einer ganzen Familie von Zwergplaneten.',
      sections: [
        {
          heading: 'Entdeckt 1930',
          text: 'Der junge Amerikaner Clyde Tombaugh verglich am Lowell-Observatorium monatelang Fotoplatten des Nachthimmels. Im Februar 1930 fand er einen schwachen Lichtpunkt, der sich zwischen zwei Aufnahmen verschoben hatte. Den Namen Pluto schlug die elfjährige Venetia Burney aus Oxford vor. Mit 2.377 Kilometern Durchmesser ist Pluto kleiner als unser Mond. Selbst sehen kannst du ihn nur mit einem großen Teleskop – er ist über tausendmal schwächer als die schwächsten Sterne, die das bloße Auge erkennt.',
        },
        {
          heading: 'Warum kein Planet mehr?',
          text: 'Ab den 1990er-Jahren fanden Astronomen immer mehr eisige Körper jenseits von Neptun, im sogenannten Kuipergürtel. 2005 kam Eris hinzu, fast so groß wie Pluto und sogar etwas schwerer. Sollte das der zehnte Planet sein? 2006 legte die Internationale Astronomische Union fest: Ein Planet muss um die Sonne kreisen, durch seine eigene Schwerkraft rund sein und seine Bahn von anderen Körpern freigeräumt haben. Am letzten Punkt scheitert Pluto.',
        },
        {
          heading: 'Die Familie der Zwergplaneten',
          text: 'Fünf Zwergplaneten erkennt die IAU offiziell an. Ceres ist der einzige im Asteroidengürtel zwischen Mars und Jupiter; die Sonde Dawn fand dort helle Salzablagerungen. Pluto, Eris, Haumea und Makemake kreisen weit draußen. Haumea dreht sich in knapp vier Stunden einmal um sich selbst und ist dadurch zu einem länglichen Ei verformt. Fachleute vermuten, dass im äußeren Sonnensystem noch viele weitere Zwergplaneten auf ihre Bestätigung warten.',
        },
        {
          heading: 'Eine lebendige Eiswelt',
          text: 'Als die Sonde New Horizons 2015 an Pluto vorbeiflog, erwarteten viele eine tote, verkraterte Kugel. Stattdessen zeigte sie Berge aus Wassereis, mehrere Kilometer hoch, und Gletscher aus gefrorenem Stickstoff, die langsam fließen. Eine dünne, bläulich schimmernde Dunsthülle umgibt den Zwergplaneten. Manche Regionen sind so jung, dass dort kaum Krater zu finden sind. Pluto hat fünf bekannte Monde; der größte, Charon, ist etwa halb so groß wie er selbst.',
        },
      ],
    },
    en: {
      title: 'Pluto and the Dwarf Planets',
      summary: 'Pluto lost its planet title in 2006 – but today it is the best known of a whole family of dwarf planets.',
      sections: [
        {
          heading: 'Discovered in 1930',
          text: 'At Lowell Observatory, the young American Clyde Tombaugh spent months comparing photographic plates of the night sky. In February 1930 he found a faint dot of light that had shifted between two exposures. The name Pluto was suggested by Venetia Burney, an eleven-year-old girl from Oxford. At 2,377 kilometers across, Pluto is smaller than our Moon. To see it yourself you need a large telescope – it is more than a thousand times fainter than the faintest stars visible to the naked eye.',
        },
        {
          heading: 'Why it’s no longer a planet',
          text: 'From the 1990s onward, astronomers found more and more icy bodies beyond Neptune, in the region called the Kuiper Belt. In 2005 they discovered Eris, almost as large as Pluto and even slightly more massive. Was this the tenth planet? In 2006 the International Astronomical Union decided: a planet must orbit the Sun, be rounded by its own gravity and have cleared its orbit of other bodies. Pluto fails the last test.',
        },
        {
          heading: 'The dwarf planet family',
          text: 'The IAU officially recognizes five dwarf planets. Ceres is the only one in the asteroid belt between Mars and Jupiter; the Dawn spacecraft found bright salt deposits there. Pluto, Eris, Haumea and Makemake orbit far out. Haumea spins once in less than four hours, which has stretched it into an elongated egg shape. Experts suspect that many more dwarf planets in the outer solar system are still waiting to be confirmed.',
        },
        {
          heading: 'A lively ice world',
          text: 'When the New Horizons probe flew past Pluto in 2015, many expected a dead, cratered ball. Instead it revealed mountains of water ice several kilometers high and glaciers of frozen nitrogen that slowly flow. A thin, bluish haze surrounds the dwarf planet. Some regions are so young that hardly any craters can be found there. Pluto has five known moons; the largest, Charon, is about half its size.',
        },
      ],
    },
  },
  {
    id: 'asteroids-comets',
    category: 'solar',
    related: ['meteors', 'pluto', 'jupiter'],
    de: {
      title: 'Asteroiden und Kometen',
      summary: 'Gesteinsbrocken und schmutzige Schneebälle – die Überbleibsel aus der Entstehung des Sonnensystems erzählen von seiner Frühzeit.',
      sections: [
        {
          heading: 'Bausteine von damals',
          text: 'Als vor 4,6 Milliarden Jahren die Planeten entstanden, blieb viel Material übrig. Asteroiden sind solche Reste aus Gestein und Metall. Die meisten kreisen im Hauptgürtel zwischen Mars und Jupiter. Anders als im Kino liegen sie dort sehr weit auseinander – Raumsonden fliegen problemlos hindurch. Alle zusammen haben nur wenige Prozent der Masse unseres Mondes. Der größte Brocken, Ceres, gilt heute als Zwergplanet.',
        },
        {
          heading: 'Schmutzige Schneebälle',
          text: 'Kometen bestehen aus Eis, Staub und Gestein und stammen aus den kalten Außenbezirken des Sonnensystems: aus dem Kuipergürtel oder der noch viel ferneren Oortschen Wolke. Ihr Kern ist meist nur wenige Kilometer groß. Kommt ein Komet der Sonne nahe, verdampft Eis und reißt Staub mit. So entstehen eine leuchtende Hülle und Schweife, die Millionen Kilometer lang sein können. Sie zeigen immer ungefähr von der Sonne weg.',
        },
        {
          heading: 'Gefahr aus dem All?',
          text: 'Vor 66 Millionen Jahren schlug im heutigen Mexiko ein etwa zehn Kilometer großer Brocken ein und trug zum Aussterben der Dinosaurier bei. Kleinere Treffer sind häufiger: 2013 explodierte über Tscheljabinsk in Russland ein rund 20 Meter großer Asteroid; die Druckwelle zerbrach unzählige Fensterscheiben. Heute suchen Teleskope gezielt nach erdnahen Objekten. Und 2022 hat die NASA-Sonde DART erstmals gezeigt, dass ein gezielter Aufprall die Bahn eines Asteroiden verändern kann.',
        },
        {
          heading: 'Selbst beobachten',
          text: 'Die hellsten Asteroiden wie Vesta oder Ceres siehst du schon im Fernglas – als Sternchen, das von Nacht zu Nacht seinen Platz wechselt. Kometen sind launischer. Mit bloßem Auge gut sichtbare Exemplare tauchen nur alle paar Jahre auf, und wie hell sie werden, lässt sich schwer vorhersagen. Unvergessen sind Hale-Bopp, der 1997 monatelang am Himmel stand, und NEOWISE im Sommer 2020. Der Halleysche Komet kehrt erst 2061 zurück.',
        },
      ],
      facts: [
        { label: 'Hauptgürtel', value: 'zwischen Mars und Jupiter' },
        { label: 'Größtes Objekt im Gürtel', value: 'Ceres, rund 940 km' },
        { label: 'Bekannte Asteroiden', value: 'über eine Million' },
        { label: 'Halleyscher Komet', value: 'alle rund 76 Jahre, wieder 2061' },
        { label: 'Erster Ablenkungstest', value: 'DART, 2022' },
      ],
    },
    en: {
      title: 'Asteroids and Comets',
      summary: 'Rocky chunks and dirty snowballs – leftovers from the birth of the solar system that tell the story of its earliest days.',
      sections: [
        {
          heading: 'Building blocks from long ago',
          text: 'When the planets formed 4.6 billion years ago, a lot of material was left over. Asteroids are such remnants, made of rock and metal. Most of them circle the Sun in the main belt between Mars and Jupiter. Unlike in the movies, they are very far apart there – spacecraft fly through with no trouble. All of them together add up to only a few percent of the Moon’s mass. The largest, Ceres, is now classed as a dwarf planet.',
        },
        {
          heading: 'Dirty snowballs',
          text: 'Comets are made of ice, dust and rock and come from the cold outskirts of the solar system: the Kuiper Belt or the far more distant Oort Cloud. Their nucleus is usually only a few kilometers across. When a comet comes close to the Sun, ice turns to gas and drags dust along with it. This creates a glowing cloud and tails that can stretch for millions of kilometers. They always point roughly away from the Sun.',
        },
        {
          heading: 'A threat from space?',
          text: 'Sixty-six million years ago, an object about ten kilometers wide struck what is now Mexico and helped wipe out the dinosaurs. Smaller hits are more common: in 2013, an asteroid about 20 meters across exploded over Chelyabinsk in Russia, and the shock wave shattered countless windows. Today, telescopes systematically search for near-Earth objects. And in 2022, NASA’s DART mission showed for the first time that a deliberate impact can change an asteroid’s orbit.',
        },
        {
          heading: 'See them yourself',
          text: 'The brightest asteroids, such as Vesta or Ceres, are visible in binoculars – as a little star that changes its position from night to night. Comets are more unpredictable. Ones that are easy to see with the naked eye appear only every few years, and how bright they will get is hard to forecast. Memorable examples include Hale-Bopp, which stayed in the sky for months in 1997, and NEOWISE in the summer of 2020. Halley’s Comet won’t return until 2061.',
        },
      ],
      facts: [
        { label: 'Main belt', value: 'between Mars and Jupiter' },
        { label: 'Largest in the belt', value: 'Ceres, about 940 km' },
        { label: 'Known asteroids', value: 'over one million' },
        { label: 'Halley’s Comet', value: 'every ~76 years, next in 2061' },
        { label: 'First deflection test', value: 'DART, 2022' },
      ],
    },
  },
  {
    id: 'stars',
    category: 'stars',
    related: ['sun', 'black-holes', 'nebulae', 'magnitude'],
    de: {
      title: 'Das Leben der Sterne',
      summary: 'Sterne werden geboren, leuchten Millionen bis Billionen Jahre und sterben – manche leise, andere in einer gewaltigen Explosion.',
      sections: [
        {
          heading: 'Geboren in Gaswolken',
          text: 'Sterne entstehen in kalten Wolken aus Gas und Staub. Wird eine solche Wolke an einer Stelle dichter, zieht die Schwerkraft immer mehr Materie zusammen. Der Klumpen wird heißer und heißer, bis in seinem Inneren bei rund zehn Millionen Grad die Kernfusion zündet: Ein Stern ist geboren. Meist entstehen in einer Wolke viele Sterne zugleich – ganze Sternhaufen. Auch die Sonne hatte einst solche Geschwister; sie haben sich längst in der Milchstraße verteilt.',
        },
        {
          heading: 'Farbe verrät Temperatur',
          text: 'Sterne sind nicht alle weiß. Ihre Farbe zeigt, wie heiß ihre Oberfläche ist: Rote Sterne sind mit rund 3.000 Grad vergleichsweise kühl, gelbe wie die Sonne gut 5.500 Grad heiß, blauweiße über 10.000 Grad. Die häufigsten Sterne sind kleine, kühle Rote Zwerge. Mit bloßem Auge ist kaum einer von ihnen zu sehen, obwohl sie die große Mehrheit in der Milchstraße bilden – auch unser nächster Nachbar Proxima Centauri gehört dazu.',
        },
        {
          heading: 'Wie Sterne sterben',
          text: 'Über das Schicksal eines Sterns entscheidet seine Masse. Leichte Sterne gehen sparsam mit ihrem Brennstoff um und können Billionen Jahre alt werden. Sterne wie die Sonne leuchten rund zehn Milliarden Jahre und enden als Weiße Zwerge. Sehr massereiche Sterne verbrennen alles in wenigen Millionen Jahren und explodieren dann als Supernova. Übrig bleibt ein Neutronenstern oder ein Schwarzes Loch. Solche Explosionen erzeugen und verteilen Elemente, aus denen später Planeten – und Menschen – bestehen.',
        },
        {
          heading: 'Selbst beobachten',
          text: 'Die Farben der Sterne kannst du mit eigenen Augen sehen. Im Winter steht im Orion der orangerote Überriese Beteigeuze schräg gegenüber dem blauweißen Rigel. Im Sommer leuchtet tief im Süden der rötliche Antares im Skorpion, hoch oben die bläulich-weiße Wega. Mit einem leicht unscharf gestellten Fernglas treten die Farben noch deutlicher hervor. Dass Sterne funkeln, liegt übrigens nicht an ihnen selbst, sondern an der unruhigen Luft unserer Atmosphäre.',
        },
      ],
      facts: [
        { label: 'Nächster Nachbarstern', value: 'Proxima Centauri, 4,2 Lichtjahre' },
        { label: 'Hellster Stern am Nachthimmel', value: 'Sirius, 8,6 Lichtjahre' },
        { label: 'Häufigster Sterntyp', value: 'Rote Zwerge' },
        { label: 'Sterne in der Milchstraße', value: 'rund 100 bis 400 Milliarden' },
        { label: 'Mit bloßem Auge', value: 'einige Tausend' },
      ],
    },
    en: {
      title: 'The Life of Stars',
      summary: 'Stars are born, shine for millions to trillions of years and die – some quietly, others in a tremendous explosion.',
      sections: [
        {
          heading: 'Born in clouds of gas',
          text: 'Stars form in cold clouds of gas and dust. When part of such a cloud becomes denser, gravity pulls more and more material together. The clump grows hotter and hotter until, at around ten million degrees in its core, nuclear fusion ignites: a star is born. Usually many stars form in one cloud at the same time – whole star clusters. The Sun once had such siblings too; they have long since scattered across the Milky Way.',
        },
        {
          heading: 'Color reveals temperature',
          text: 'Not all stars are white. Their color shows how hot their surface is: red stars are relatively cool at around 3,000 degrees, yellow ones like the Sun are about 5,500 degrees, and blue-white stars exceed 10,000 degrees. The most common stars are small, cool red dwarfs. Hardly any of them can be seen with the naked eye, even though they make up the vast majority in the Milky Way – our nearest neighbor, Proxima Centauri, is one of them.',
        },
        {
          heading: 'How stars die',
          text: 'A star’s fate is decided by its mass. Lightweight stars use their fuel sparingly and can live for trillions of years. Stars like the Sun shine for about ten billion years and end as white dwarfs. Very massive stars burn through everything in a few million years and then explode as a supernova, leaving behind a neutron star or a black hole. Such explosions create and scatter elements that later become part of planets – and people.',
        },
        {
          heading: 'See it yourself',
          text: 'You can see star colors with your own eyes. In winter, the orange-red supergiant Betelgeuse in Orion sits diagonally across from blue-white Rigel. In summer, reddish Antares glows low in the south in Scorpius, while bluish-white Vega shines high overhead. Slightly defocused binoculars make the colors stand out even more. By the way, stars twinkle not because of anything they do, but because of the turbulent air in Earth’s atmosphere.',
        },
      ],
      facts: [
        { label: 'Nearest neighbor star', value: 'Proxima Centauri, 4.2 light-years' },
        { label: 'Brightest star at night', value: 'Sirius, 8.6 light-years' },
        { label: 'Most common type', value: 'red dwarfs' },
        { label: 'Stars in our galaxy', value: 'roughly 100 to 400 billion' },
        { label: 'Naked-eye stars', value: 'a few thousand' },
      ],
    },
  },
  {
    id: 'constellations',
    category: 'stars',
    related: ['observing', 'stars', 'magnitude'],
    de: {
      title: 'Sternbilder',
      summary: 'Seit Jahrtausenden verbinden Menschen Sterne zu Figuren – heute teilen 88 Sternbilder den Himmel auf wie Länder eine Landkarte.',
      sections: [
        {
          heading: 'Bilder am Himmel',
          text: 'Schon in der Antike haben Menschen Sterne zu Figuren verbunden, um sich am Himmel zurechtzufinden und Geschichten zu erzählen. Viele unserer Sternbilder stammen aus der griechischen Sagenwelt: Orion, der Jäger, Kassiopeia, die eitle Königin, oder Perseus, der Held. Die Sterne eines Bildes gehören aber meist nicht zusammen. Sie stehen nur zufällig in derselben Richtung – einer kann zehnmal weiter entfernt sein als sein Nachbar im selben Bild.',
        },
        {
          heading: '88 offizielle Felder',
          text: 'Damit weltweit alle dieselbe Sprache sprechen, hat die Internationale Astronomische Union 1922 genau 88 Sternbilder festgelegt und 1930 ihre Grenzen verbindlich gezogen. Seitdem ist der Himmel lückenlos aufgeteilt, und jeder Stern gehört zu genau einem Sternbild. Bekannte Figuren wie der Große Wagen sind dagegen keine offiziellen Sternbilder, sondern nur Teile davon – sogenannte Asterismen. Der Wagen gehört zum Großen Bären.',
        },
        {
          heading: 'Der Himmel im Jahreslauf',
          text: 'Weil die Erde um die Sonne kreist, blicken wir nachts im Lauf des Jahres in verschiedene Richtungen ins All. Deshalb gibt es Wintersternbilder wie Orion und Sommersternbilder wie Schwan und Leier. Einige Sternfiguren rund um den Polarstern gehen bei uns nie unter, etwa der Große Wagen und Kassiopeia. Und die Sonne wandert im Lauf eines Jahres durch 13 Sternbilder – neben den zwölf Tierkreissternbildern auch durch den Schlangenträger.',
        },
        {
          heading: 'So findest du dich zurecht',
          text: 'Der beste Startpunkt ist der Große Wagen, den du das ganze Jahr über am Nordhimmel findest. Verlängere die Strecke zwischen den beiden hinteren Kastensternen über den oberen hinaus etwa fünfmal: So landest du beim Polarstern, der fast genau im Norden steht. Folgst du dagegen dem Bogen der Deichsel, triffst du im Frühling auf den hellen, orangen Arktur. Von solchen Ankersternen aus hangelst du dich Schritt für Schritt weiter.',
        },
      ],
      facts: [
        { label: 'Offizielle Sternbilder', value: '88' },
        { label: 'Festgelegt von', value: 'IAU, 1922 (Grenzen 1930)' },
        { label: 'Größtes Sternbild', value: 'Wasserschlange (Hydra)' },
        { label: 'Kleinstes Sternbild', value: 'Kreuz des Südens' },
        { label: 'Auf der Sonnenbahn', value: '13, inklusive Schlangenträger' },
      ],
    },
    en: {
      title: 'Constellations',
      summary: 'For thousands of years people have joined stars into figures – today, 88 constellations divide the sky like countries on a map.',
      sections: [
        {
          heading: 'Pictures in the sky',
          text: 'Even in ancient times, people linked stars into figures to find their way around the sky and to tell stories. Many of our constellations come from Greek mythology: Orion the hunter, Cassiopeia the vain queen, or Perseus the hero. But the stars in a constellation usually have nothing to do with each other. They just happen to lie in the same direction – one may be ten times farther away than its neighbor in the same figure.',
        },
        {
          heading: '88 official areas',
          text: 'So that everyone speaks the same language, the International Astronomical Union adopted exactly 88 constellations in 1922 and fixed their boundaries in 1930. Since then the sky has been divided up without gaps, and every star belongs to exactly one constellation. Familiar shapes like the Big Dipper, on the other hand, are not official constellations but parts of them – so-called asterisms. The Big Dipper belongs to Ursa Major, the Great Bear.',
        },
        {
          heading: 'The sky through the year',
          text: 'As Earth orbits the Sun, our night side faces different directions in space over the year. That is why there are winter constellations like Orion and summer constellations like Cygnus and Lyra. Some star patterns around the North Star never set for observers in mid-northern latitudes, such as the Big Dipper and Cassiopeia. And over a year the Sun passes through 13 constellations – the twelve of the zodiac plus Ophiuchus, the Serpent Bearer.',
        },
        {
          heading: 'Finding your way',
          text: 'The best starting point is the Big Dipper, which you can find in the northern sky all year round. Extend the line between the two stars at the end of its bowl about five times beyond the top one: you will reach Polaris, the North Star, which marks north almost exactly. If you instead follow the curve of the handle, in spring you will come to bright orange Arcturus. From such anchor stars you can work your way across the sky step by step.',
        },
      ],
      facts: [
        { label: 'Official constellations', value: '88' },
        { label: 'Defined by', value: 'IAU, 1922 (boundaries 1930)' },
        { label: 'Largest constellation', value: 'Hydra, the Water Snake' },
        { label: 'Smallest constellation', value: 'Crux, the Southern Cross' },
        { label: 'On the Sun’s path', value: '13, including Ophiuchus' },
      ],
    },
  },
  {
    id: 'milky-way',
    category: 'stars',
    related: ['galaxies', 'stars', 'black-holes', 'observing'],
    de: {
      title: 'Die Milchstraße',
      summary: 'Das schimmernde Band am Nachthimmel ist unsere Heimatgalaxie – von innen gesehen, mit Hunderten Milliarden Sternen.',
      sections: [
        {
          heading: 'Unsere Heimatgalaxie',
          text: 'Die Milchstraße ist eine Balkenspiralgalaxie: eine flache Scheibe mit Spiralarmen und einem länglichen Balken aus Sternen in der Mitte. Ihr Durchmesser beträgt rund 100.000 Lichtjahre. Die Sonne liegt etwa 26.000 Lichtjahre vom Zentrum entfernt in einem kleineren Arm, dem Orion-Arm. Mit rund 220 Kilometern pro Sekunde zieht sie ihre Bahn und braucht für eine Runde um das Zentrum etwa 230 Millionen Jahre.',
        },
        {
          heading: 'Ein Band aus Licht',
          text: 'Weil wir mitten in der Scheibe sitzen, sehen wir sie von innen – als schimmerndes Band, das sich einmal rund um den Himmel zieht. Es besteht aus unzähligen fernen Sternen, die für das Auge zu einem milchigen Schein verschwimmen. Das erkannte als Erster Galileo Galilei mit seinem Fernrohr. Dunkle Lücken im Band sind keine leeren Stellen, sondern Wolken aus Staub, die das Licht der Sterne dahinter verschlucken.',
        },
        {
          heading: 'Das Herz der Galaxis',
          text: 'Im Zentrum der Milchstraße sitzt ein Schwarzes Loch mit rund vier Millionen Sonnenmassen, genannt Sagittarius A*. Im sichtbaren Licht ist das Zentrum hinter dichtem Staub verborgen. Doch Forschende haben jahrzehntelang beobachtet, wie Sterne in seiner Nähe mit rasender Geschwindigkeit um etwas Unsichtbares kreisen. Dafür gab es 2020 den Physik-Nobelpreis. 2022 folgte das erste Bild seines Schattens, aufgenommen mit einem weltweiten Verbund von Radioteleskopen.',
        },
        {
          heading: 'So siehst du sie',
          text: 'Für die Milchstraße brauchst du einen wirklich dunklen Ort fern der Städte und eine mondlose Nacht. Gib deinen Augen mindestens 20 Minuten, um sich an die Dunkelheit zu gewöhnen. Am eindrucksvollsten ist sie bei uns an Sommer- und frühen Herbstabenden, wenn sie vom Schwan hoch über dir bis zum Schützen tief im Süden reicht. In Deutschland gibt es mehrere ausgewiesene Sternenparks, etwa im Westhavelland, in der Rhön und in der Eifel.',
        },
      ],
      facts: [
        { label: 'Typ', value: 'Balkenspiralgalaxie' },
        { label: 'Durchmesser', value: 'rund 100.000 Lichtjahre' },
        { label: 'Anzahl Sterne', value: 'rund 100 bis 400 Milliarden' },
        { label: 'Abstand Sonne–Zentrum', value: 'rund 26.000 Lichtjahre' },
        { label: 'Ein Umlauf der Sonne', value: 'rund 230 Millionen Jahre' },
        { label: 'Zentrales Schwarzes Loch', value: 'Sagittarius A*, 4 Mio. Sonnenmassen' },
      ],
    },
    en: {
      title: 'The Milky Way',
      summary: 'The shimmering band across the night sky is our home galaxy – seen from the inside, with hundreds of billions of stars.',
      sections: [
        {
          heading: 'Our home galaxy',
          text: 'The Milky Way is a barred spiral galaxy: a flat disk with spiral arms and an elongated bar of stars in the middle. It measures about 100,000 light-years across. The Sun lies about 26,000 light-years from the center in a smaller arm called the Orion Arm. Moving at roughly 220 kilometers per second, it takes about 230 million years to complete one lap around the center.',
        },
        {
          heading: 'A band of light',
          text: 'Because we sit inside the disk, we see it from within – as a shimmering band that stretches all the way around the sky. It is made of countless distant stars that blur into a milky glow for the eye. Galileo was the first to see this with his telescope. Dark gaps in the band are not empty regions but clouds of dust that block the light of the stars behind them.',
        },
        {
          heading: 'The heart of the galaxy',
          text: 'At the center of the Milky Way sits a black hole of about four million solar masses, called Sagittarius A*. In visible light, the center is hidden behind thick dust. But for decades, researchers have tracked stars near it racing around something invisible. That work won the 2020 Nobel Prize in Physics. In 2022 came the first image of its shadow, captured by a worldwide network of radio telescopes.',
        },
        {
          heading: 'How to see it',
          text: 'To see the Milky Way, you need a truly dark spot far from cities and a moonless night. Give your eyes at least 20 minutes to adjust to the dark. From mid-northern latitudes it is most impressive on summer and early fall evenings, when it stretches from Cygnus high overhead to Sagittarius low in the south. Many regions have official dark-sky parks where light pollution is kept low – ideal places for your first look.',
        },
      ],
      facts: [
        { label: 'Type', value: 'barred spiral galaxy' },
        { label: 'Diameter', value: 'about 100,000 light-years' },
        { label: 'Number of stars', value: 'roughly 100 to 400 billion' },
        { label: 'Sun’s distance from center', value: 'about 26,000 light-years' },
        { label: 'Sun’s orbit period', value: 'about 230 million years' },
        { label: 'Central black hole', value: 'Sagittarius A*, 4 million solar masses' },
      ],
    },
  },
  {
    id: 'galaxies',
    category: 'stars',
    skyFocus: 'dso:M31',
    related: ['milky-way', 'black-holes', 'light-year'],
    de: {
      title: 'Galaxien',
      summary: 'Unsere Milchstraße ist nur eine von Hunderten Milliarden Galaxien – riesigen Sterneninseln im fast leeren Raum.',
      sections: [
        {
          heading: 'Inseln aus Sternen',
          text: 'Eine Galaxie ist eine gewaltige Ansammlung von Sternen, Gas, Staub und Dunkler Materie, die von der Schwerkraft zusammengehalten wird. Vor gut hundert Jahren stritten Astronomen noch darüber, ob die verschwommenen „Spiralnebel“ Teil der Milchstraße seien. 1923 und 1924 bestimmte Edwin Hubble die Entfernung zum Andromedanebel – und zeigte, dass er weit außerhalb liegt. Plötzlich war das Universum unvorstellbar viel größer. Heute schätzt man, dass es Hunderte Milliarden Galaxien enthält.',
        },
        {
          heading: 'Spiralen, Ellipsen und Chaos',
          text: 'Galaxien gibt es in verschiedenen Formen. Spiralgalaxien wie die Milchstraße haben eine flache Scheibe mit leuchtenden Armen, in denen ständig neue Sterne entstehen. Elliptische Galaxien sind rundliche bis ovale Sternsysteme voller alter, rötlicher Sterne und mit wenig Gas. Irreguläre Galaxien haben gar keine klare Form. Galaxien wachsen, indem sie zusammenstoßen und miteinander verschmelzen – ein Vorgang, der Hunderte Millionen Jahre dauert.',
        },
        {
          heading: 'Andromeda, die große Nachbarin',
          text: 'Die nächste große Galaxie ist die Andromedagalaxie, auch M31 genannt. Sie ist rund 2,5 Millionen Lichtjahre entfernt und etwas größer als die Milchstraße. Das Licht, das heute in dein Auge fällt, machte sich auf den Weg, lange bevor es den modernen Menschen gab. Andromeda und die Milchstraße bewegen sich aufeinander zu. Gut möglich, dass beide in einigen Milliarden Jahren zusammenstoßen und zu einer einzigen großen Galaxie verschmelzen.',
        },
        {
          heading: 'So findest du Andromeda',
          text: 'An Herbstabenden steht Andromeda hoch am Himmel. Suche das große Viereck des Pegasus. Von einem seiner Ecksterne, Alpheratz, zieht sich eine Kette aus Sternen weg. Folge ihr zwei Sterne weit bis zu Mirach und biege dann im rechten Winkel Richtung Kassiopeia ab, vorbei an zwei schwächeren Sternen. Direkt dahinter siehst du unter dunklem Himmel einen länglichen Nebelfleck, im Fernglas deutlicher. Spiralarme wie auf Fotos zeigt er nicht – dafür ist sein Licht 2,5 Millionen Jahre alt.',
        },
      ],
      facts: [
        { label: 'Galaxien im beobachtbaren Universum', value: 'Hunderte Milliarden' },
        { label: 'Nächste große Galaxie', value: 'Andromeda (M31), 2,5 Mio. Lichtjahre' },
        { label: 'Unsere Galaxiengruppe', value: 'Lokale Gruppe, Dutzende Mitglieder' },
        { label: 'Hellste Begleiter', value: 'Große und Kleine Magellansche Wolke' },
        { label: 'Grundformen', value: 'Spiral, elliptisch, irregulär' },
      ],
    },
    en: {
      title: 'Galaxies',
      summary: 'Our Milky Way is just one of hundreds of billions of galaxies – vast islands of stars in nearly empty space.',
      sections: [
        {
          heading: 'Islands of stars',
          text: 'A galaxy is a huge collection of stars, gas, dust and dark matter held together by gravity. Only a century ago, astronomers were still arguing about whether the fuzzy “spiral nebulae” were part of the Milky Way. In 1923 and 1924, Edwin Hubble measured the distance to the Andromeda Nebula – and showed that it lies far beyond. Suddenly the universe had become unimaginably larger. Today, the observable universe is estimated to contain hundreds of billions of galaxies.',
        },
        {
          heading: 'Spirals, ellipses and chaos',
          text: 'Galaxies come in different shapes. Spiral galaxies like the Milky Way have a flat disk with bright arms where new stars are constantly forming. Elliptical galaxies are round or oval star systems full of old, reddish stars and with little gas. Irregular galaxies have no clear shape at all. Galaxies grow by colliding and merging with one another – a process that plays out over hundreds of millions of years.',
        },
        {
          heading: 'Andromeda, our big neighbor',
          text: 'The nearest large galaxy is the Andromeda Galaxy, also called M31. It is about 2.5 million light-years away and somewhat larger than the Milky Way. The light entering your eye today set out long before modern humans existed. Andromeda and the Milky Way are moving toward each other. It is quite possible that in a few billion years they will collide and merge into a single large galaxy.',
        },
        {
          heading: 'How to find Andromeda',
          text: 'On fall evenings, Andromeda is high in the sky. Look for the Great Square of Pegasus. From one of its corner stars, Alpheratz, a chain of stars leads away. Follow it two stars along to Mirach, then turn at a right angle toward Cassiopeia, past two fainter stars. Just beyond them, under a dark sky, you’ll see an elongated smudge of light, clearer in binoculars. It won’t show spiral arms like in photos – but its light is 2.5 million years old.',
        },
      ],
      facts: [
        { label: 'Galaxies in observable universe', value: 'hundreds of billions' },
        { label: 'Nearest large galaxy', value: 'Andromeda (M31), 2.5 million light-years' },
        { label: 'Our galaxy group', value: 'Local Group, dozens of members' },
        { label: 'Brightest companions', value: 'Large and Small Magellanic Clouds' },
        { label: 'Main types', value: 'spiral, elliptical, irregular' },
      ],
    },
  },
  {
    id: 'nebulae',
    category: 'stars',
    skyFocus: 'dso:M42',
    related: ['stars', 'galaxies', 'observing'],
    de: {
      title: 'Nebel und Sternhaufen',
      summary: 'Leuchtende Gaswolken und funkelnde Sternhaufen sind Kinderstuben und Überreste von Sternen – und schon im Fernglas wunderschön.',
      sections: [
        {
          heading: 'Wolken im All',
          text: 'Ein Nebel ist eine Wolke aus Gas und Staub zwischen den Sternen. Manche leuchten selbst: Heiße junge Sterne regen den Wasserstoff in ihrer Nähe zum Glühen an, meist in kräftigem Rot. Andere Nebel werfen nur das Licht benachbarter Sterne zurück und schimmern bläulich. Dunkelwolken wiederum verschlucken das Licht dahinter und zeichnen sich als schwarze Silhouetten ab – der berühmte Pferdekopfnebel im Orion ist so ein Fall.',
        },
        {
          heading: 'Kinderstuben und Überreste',
          text: 'In vielen Nebeln entstehen gerade neue Sterne, etwa im Orionnebel, rund 1.300 Lichtjahre entfernt. Andere Nebel markieren das Ende eines Sternlebens. Planetarische Nebel wie der Ringnebel in der Leier sind abgestoßene Hüllen sterbender sonnenähnlicher Sterne. Mit Planeten haben sie nichts zu tun – in alten Teleskopen sahen sie nur aus wie Planetenscheibchen. Der Krebsnebel im Stier ist der Rest einer Supernova, die chinesische Astronomen im Jahr 1054 beobachteten.',
        },
        {
          heading: 'Sternhaufen',
          text: 'Offene Sternhaufen sind lockere Gruppen aus einigen Dutzend bis einigen Tausend jungen Sternen, die gemeinsam entstanden sind. Mit der Zeit driften sie auseinander. Kugelsternhaufen sind dagegen uralt und dicht gepackt: Hunderttausende Sterne bilden eine leuchtende Kugel, die meist im Halo rund um die Scheibe der Milchstraße kreist. Viele dieser Objekte tragen eine Nummer aus dem Katalog von Charles Messier. Er listete im 18. Jahrhundert Nebelflecken auf, um sie nicht mit Kometen zu verwechseln.',
        },
        {
          heading: 'Selbst beobachten',
          text: 'Im Winter findest du unterhalb der drei Gürtelsterne des Orion eine kleine Sternreihe, das „Schwert“. Sein mittlerer, leicht verschwommener „Stern“ ist der Orionnebel – schon mit bloßem Auge sichtbar, im Fernglas ein zarter Schimmer. Die Plejaden, das Siebengestirn im Stier, erkennst du als kleine, funkelnde Gruppe; das Fernglas zeigt Dutzende Sterne. Wundere dich nicht über fehlende Farben: Das Auge sieht schwache Nebel grau, erst Fotos zeigen ihr Rot.',
        },
      ],
      facts: [
        { label: 'Orionnebel (M42)', value: 'rund 1.300 Lichtjahre' },
        { label: 'Plejaden (M45)', value: 'rund 440 Lichtjahre' },
        { label: 'Krebsnebel (M1)', value: 'Rest der Supernova von 1054' },
        { label: 'Messier-Katalog', value: '110 Objekte' },
        { label: 'Typischer Kugelsternhaufen', value: 'Hunderttausende Sterne' },
      ],
    },
    en: {
      title: 'Nebulae and Star Clusters',
      summary: 'Glowing gas clouds and sparkling star clusters are the nurseries and remnants of stars – and beautiful even in binoculars.',
      sections: [
        {
          heading: 'Clouds in space',
          text: 'A nebula is a cloud of gas and dust between the stars. Some glow on their own: hot young stars make the hydrogen around them shine, usually in a strong red. Other nebulae merely reflect the light of nearby stars and have a bluish sheen. Dark clouds, on the other hand, swallow the light behind them and stand out as black silhouettes – the famous Horsehead Nebula in Orion is one of them.',
        },
        {
          heading: 'Nurseries and remnants',
          text: 'In many nebulae, new stars are being born right now – for example in the Orion Nebula, about 1,300 light-years away. Other nebulae mark the end of a star’s life. Planetary nebulae like the Ring Nebula in Lyra are cast-off shells of dying Sun-like stars. They have nothing to do with planets – they just looked like planetary disks in old telescopes. The Crab Nebula in Taurus is the remnant of a supernova that Chinese astronomers saw in 1054.',
        },
        {
          heading: 'Star clusters',
          text: 'Open clusters are loose groups of a few dozen to a few thousand young stars that formed together. Over time they drift apart. Globular clusters, by contrast, are ancient and tightly packed: hundreds of thousands of stars form a glowing ball, usually orbiting in the halo around the Milky Way’s disk. Many of these objects carry a number from Charles Messier’s catalog. In the 18th century he listed fuzzy patches so that he would not mistake them for comets.',
        },
        {
          heading: 'See it yourself',
          text: 'In winter, look below the three belt stars of Orion for a short line of stars, the “sword.” Its middle, slightly fuzzy “star” is the Orion Nebula – visible to the naked eye and a soft glow in binoculars. The Pleiades in Taurus, also known as the Seven Sisters, appear as a small, sparkling group; binoculars reveal dozens of stars. Don’t be surprised by the lack of color: your eye sees faint nebulae as gray, and only photos show their red.',
        },
      ],
      facts: [
        { label: 'Orion Nebula (M42)', value: 'about 1,300 light-years' },
        { label: 'Pleiades (M45)', value: 'about 440 light-years' },
        { label: 'Crab Nebula (M1)', value: 'remnant of the 1054 supernova' },
        { label: 'Messier catalog', value: '110 objects' },
        { label: 'Typical globular cluster', value: 'hundreds of thousands of stars' },
      ],
    },
  },
  {
    id: 'black-holes',
    category: 'stars',
    related: ['stars', 'milky-way', 'galaxies'],
    de: {
      title: 'Schwarze Löcher',
      summary: 'Orte, an denen die Schwerkraft so stark ist, dass nicht einmal Licht entkommt – und doch kann man sie aufspüren.',
      sections: [
        {
          heading: 'Wo selbst Licht gefangen ist',
          text: 'Ein Schwarzes Loch entsteht, wenn sehr viel Masse auf extrem kleinem Raum zusammengepresst wird. Dann wird die Schwerkraft so stark, dass nichts mehr entkommen kann, nicht einmal Licht. Die Grenze, ab der es kein Zurück gibt, heißt Ereignishorizont. Einsteins Allgemeine Relativitätstheorie sagt solche Objekte voraus. Zur Veranschaulichung: Würde man die ganze Erde zu einem Schwarzen Loch zusammenpressen, wäre es etwa so groß wie eine Murmel.',
        },
        {
          heading: 'Wie sie entstehen',
          text: 'Stellare Schwarze Löcher bilden sich, wenn ein sehr massereicher Stern am Ende seines Lebens in sich zusammenstürzt – oft begleitet von einer Supernova. Sie haben einige bis einige Dutzend Sonnenmassen. Allein in der Milchstraße dürfte es Millionen davon geben. Daneben gibt es Riesen: Supermassereiche Schwarze Löcher mit Millionen bis Milliarden Sonnenmassen sitzen im Zentrum der meisten großen Galaxien. Wie sie so groß werden konnten, ist eine der spannenden offenen Fragen.',
        },
        {
          heading: 'Das Unsichtbare sichtbar machen',
          text: 'Schwarze Löcher selbst leuchten nicht, aber ihre Umgebung verrät sie. Gas, das um sie herumwirbelt, heizt sich auf Millionen Grad auf und strahlt Röntgenlicht ab. Sterne in ihrer Nähe rasen auf auffälligen Bahnen. 2015 fingen die LIGO-Detektoren erstmals Gravitationswellen auf – winzige Erschütterungen der Raumzeit, ausgelöst durch zwei verschmelzende Schwarze Löcher. Und 2019 zeigte das Event Horizon Telescope das erste Bild eines solchen Schattens, im Zentrum der Galaxie M87.',
        },
        {
          heading: 'Keine kosmischen Staubsauger',
          text: 'Anders als in vielen Filmen saugen Schwarze Löcher nicht alles in ihrer Umgebung auf. Aus sicherer Entfernung wirkt ihre Schwerkraft genauso wie die eines Sterns mit gleicher Masse. Würde man die Sonne durch ein gleich schweres Schwarzes Loch ersetzen, zöge die Erde unbeirrt ihre Bahn – es würde nur dunkel und kalt. Mit einem guten Fernglas kannst du im Schwan sogar den Begleitstern von Cygnus X-1 finden: einen Riesenstern, der ein unsichtbares Schwarzes Loch umkreist.',
        },
      ],
      facts: [
        { label: 'Nächstes bekanntes Schwarzes Loch', value: 'Gaia BH1, gut 1.500 Lichtjahre' },
        { label: 'Im Zentrum der Milchstraße', value: 'Sagittarius A*, 4 Mio. Sonnenmassen' },
        { label: 'Erste Gravitationswellen', value: '2015, LIGO' },
        { label: 'Erstes Bild', value: 'M87*, 2019' },
        { label: 'Erde als Schwarzes Loch', value: 'knapp 2 cm Durchmesser' },
      ],
    },
    en: {
      title: 'Black Holes',
      summary: 'Places where gravity is so strong that not even light can escape – and yet astronomers can track them down.',
      sections: [
        {
          heading: 'Where even light is trapped',
          text: 'A black hole forms when a huge amount of mass is squeezed into an extremely small space. Gravity then becomes so strong that nothing can escape, not even light. The boundary beyond which there is no return is called the event horizon. Einstein’s general theory of relativity predicts such objects. To get a sense of scale: if you squeezed the entire Earth into a black hole, it would be about the size of a marble.',
        },
        {
          heading: 'How they form',
          text: 'Stellar black holes form when a very massive star collapses at the end of its life – often accompanied by a supernova. They contain a few to a few dozen solar masses. The Milky Way alone probably holds millions of them. Then there are the giants: supermassive black holes with millions to billions of solar masses sit at the centers of most large galaxies. How they grew so big is one of the exciting open questions.',
        },
        {
          heading: 'Making the invisible visible',
          text: 'Black holes themselves do not shine, but their surroundings give them away. Gas swirling around them heats up to millions of degrees and emits X-rays. Nearby stars race along telltale orbits. In 2015, the LIGO detectors picked up gravitational waves for the first time – tiny ripples in spacetime set off by two merging black holes. And in 2019 the Event Horizon Telescope released the first image of a black hole’s shadow, at the center of the galaxy M87.',
        },
        {
          heading: 'Not cosmic vacuum cleaners',
          text: 'Contrary to many movies, black holes do not suck up everything around them. From a safe distance, their gravity acts just like that of a star with the same mass. If the Sun were replaced by a black hole of equal mass, Earth would stay in its orbit – it would just become dark and cold. With good binoculars, you can even find the companion of Cygnus X-1 in the constellation Cygnus: a giant star orbiting an invisible black hole.',
        },
      ],
      facts: [
        { label: 'Nearest known black hole', value: 'Gaia BH1, just over 1,500 light-years' },
        { label: 'Milky Way’s center', value: 'Sagittarius A*, 4 million solar masses' },
        { label: 'First gravitational waves', value: '2015, LIGO' },
        { label: 'First image', value: 'M87*, 2019' },
        { label: 'Earth as black hole', value: 'just under 2 cm across' },
      ],
    },
  },
  {
    id: 'exoplanets',
    category: 'stars',
    related: ['stars', 'light-year', 'milky-way'],
    de: {
      title: 'Exoplaneten',
      summary: 'Die meisten Sterne haben vermutlich Planeten – und manche dieser fernen Welten sind seltsamer als alles in unserem Sonnensystem.',
      sections: [
        {
          heading: 'Welten um fremde Sterne',
          text: 'Exoplaneten sind Planeten, die um andere Sterne als die Sonne kreisen. Lange wusste niemand, ob es sie überhaupt gibt. 1995 entdeckten Michel Mayor und Didier Queloz den ersten Planeten um einen sonnenähnlichen Stern: 51 Pegasi b, einen Gasriesen, der seinen Stern in nur gut vier Tagen umrundet. Dafür bekamen sie 2019 den Nobelpreis. Heute kennen wir über 5.000 bestätigte Exoplaneten, und die Liste wächst ständig.',
        },
        {
          heading: 'Wie man sie findet',
          text: 'Exoplaneten direkt zu sehen ist extrem schwer, denn ihr Stern überstrahlt sie oft milliardenfach. Meist verraten sie sich indirekt. Zieht ein Planet von uns aus gesehen vor seinem Stern vorbei, wird dieser für kurze Zeit ein klein wenig dunkler. Mit dieser Transitmethode fanden die Weltraumteleskope Kepler und TESS Tausende Planeten. Außerdem bringt ein Planet seinen Stern leicht ins Taumeln, was sich im Licht des Sterns messen lässt.',
        },
        {
          heading: 'Seltsame Welten',
          text: 'Viele Exoplaneten passen in keine Schublade unseres Sonnensystems. Es gibt „heiße Jupiter“: Gasriesen, die ihren Stern in wenigen Tagen umrasen. Am häufigsten scheinen Planeten zu sein, die größer als die Erde, aber kleiner als Neptun sind – so einen haben wir hier gar nicht. Das System TRAPPIST-1 in rund 40 Lichtjahren Entfernung hat sieben erdgroße Planeten. Das James-Webb-Weltraumteleskop untersucht inzwischen sogar die Atmosphären einiger fremder Welten.',
        },
        {
          heading: 'Für Beobachter',
          text: 'Exoplaneten selbst siehst du nicht, wohl aber ihre Sterne. 51 Pegasi im Sternbild Pegasus ist unter dunklem Himmel gerade noch mit bloßem Auge zu erkennen – ein unscheinbarer Stern, der Geschichte geschrieben hat. Erfahrene Amateure messen mit Teleskop und Kamera sogar selbst Transits: Zieht ein heißer Jupiter vor seinem Stern vorbei, sinkt dessen Helligkeit um rund ein Prozent. Solche Messungen helfen Profis, die Bahnen bekannter Planeten genauer zu bestimmen.',
        },
      ],
      facts: [
        { label: 'Bestätigte Exoplaneten', value: 'über 5.000' },
        { label: 'Erster um sonnenähnlichen Stern', value: '51 Pegasi b, 1995' },
        { label: 'Nächster bekannter Exoplanet', value: 'Proxima Centauri b, 4,2 Lichtjahre' },
        { label: 'Erfolgreichste Suchmethode', value: 'Transitmethode' },
        { label: 'Bekanntes Planetensystem', value: 'TRAPPIST-1, sieben Planeten' },
      ],
    },
    en: {
      title: 'Exoplanets',
      summary: 'Most stars probably have planets – and some of these distant worlds are stranger than anything in our solar system.',
      sections: [
        {
          heading: 'Worlds around other stars',
          text: 'Exoplanets are planets that orbit stars other than the Sun. For a long time nobody knew whether they even existed. In 1995, Michel Mayor and Didier Queloz discovered the first planet around a Sun-like star: 51 Pegasi b, a gas giant that circles its star in just over four days. The discovery earned them the 2019 Nobel Prize. Today we know of more than 5,000 confirmed exoplanets, and the list keeps growing.',
        },
        {
          heading: 'How to find them',
          text: 'Seeing exoplanets directly is extremely hard, because their star often outshines them a billion times over. Usually they give themselves away indirectly. When a planet passes in front of its star as seen from Earth, the star dims ever so slightly for a short time. With this transit method, the Kepler and TESS space telescopes found thousands of planets. A planet also makes its star wobble slightly, which can be measured in the star’s light.',
        },
        {
          heading: 'Strange worlds',
          text: 'Many exoplanets don’t fit into any category from our solar system. There are “hot Jupiters”: gas giants that whip around their star in a few days. The most common seem to be planets larger than Earth but smaller than Neptune – a type we don’t have here at all. The TRAPPIST-1 system, about 40 light-years away, has seven Earth-sized planets. The James Webb Space Telescope is now even studying the atmospheres of some of these alien worlds.',
        },
        {
          heading: 'For observers',
          text: 'You can’t see exoplanets themselves, but you can see their stars. Under a dark sky, 51 Pegasi in the constellation Pegasus is just barely visible to the naked eye – an unremarkable star that made history. Experienced amateurs even measure transits themselves with a telescope and camera: when a hot Jupiter passes in front of its star, the star’s brightness drops by about one percent. Such measurements help professionals pin down the orbits of known planets.',
        },
      ],
      facts: [
        { label: 'Confirmed exoplanets', value: 'more than 5,000' },
        { label: 'First around Sun-like star', value: '51 Pegasi b, 1995' },
        { label: 'Nearest known exoplanet', value: 'Proxima Centauri b, 4.2 light-years' },
        { label: 'Most productive method', value: 'transit method' },
        { label: 'Famous planetary system', value: 'TRAPPIST-1, seven planets' },
      ],
    },
  },
  {
    id: 'moon-phases',
    category: 'observing',
    skyFocus: 'body:moon',
    related: ['moon', 'eclipses', 'observing'],
    de: {
      title: 'Mondphasen',
      summary: 'Von der hauchdünnen Sichel bis zum Vollmond – warum der Mond sein Gesicht ändert und wann du welche Phase siehst.',
      sections: [
        {
          heading: 'Licht und Schatten',
          text: 'Der Mond leuchtet nicht selbst, er wird von der Sonne angestrahlt. Eine Hälfte ist immer beleuchtet. Während er die Erde umkreist, schauen wir mal mehr auf seine helle, mal mehr auf seine dunkle Seite. Steht er zwischen Erde und Sonne, sehen wir nur die Nachtseite: Neumond. Steht er der Sonne gegenüber, blicken wir voll auf die Tagseite: Vollmond. Mit dem Erdschatten haben die Phasen übrigens nichts zu tun.',
        },
        {
          heading: 'Ein Zyklus von 29,5 Tagen',
          text: 'Von Neumond zu Neumond vergehen im Schnitt 29,5 Tage. Nach dem Neumond taucht abends eine schmale Sichel auf, die Tag für Tag wächst: Der Mond nimmt zu. Nach einer Woche ist er halb beleuchtet, das erste Viertel. Eine weitere Woche später ist Vollmond, danach nimmt er wieder ab. Faustregel für die Nordhalbkugel: Ist die rechte Seite hell, nimmt er zu. Sieht er aus wie das runde „a“ der Schreibschrift, nimmt er ab.',
        },
        {
          heading: 'Wann der Mond am Himmel steht',
          text: 'Jeden Tag geht der Mond im Mittel etwa 50 Minuten später auf als am Vortag. Der Vollmond geht deshalb bei Sonnenuntergang auf und steht die ganze Nacht am Himmel. Der zunehmende Halbmond ist schon am Nachmittag zu sehen und geht gegen Mitternacht unter. Den abnehmenden Halbmond findest du dagegen in der zweiten Nachthälfte und morgens am Taghimmel. Dicht über dem Horizont wirkt der Mond übrigens größer – eine reine Täuschung unseres Gehirns.',
        },
        {
          heading: 'Beobachtungstipps',
          text: 'Die schönste Zeit für das Fernglas sind die Tage rund um das erste Viertel: An der Licht-Schatten-Grenze treten Krater und Gebirge plastisch hervor. Bei schmaler Sichel lohnt ein Blick auf den dunklen Teil: Er schimmert schwach, weil die Erde Sonnenlicht auf ihn wirft. Dieses aschgraue Mondlicht ist im Frühling abends besonders gut zu sehen. Willst du dagegen lichtschwache Galaxien und Nebel beobachten, plane deine Nächte um den Neumond herum.',
        },
      ],
      facts: [
        { label: 'Von Neumond zu Neumond', value: '29,5 Tage' },
        { label: 'Umlauf um die Erde', value: '27,3 Tage' },
        { label: 'Täglich späterer Aufgang', value: 'im Mittel rund 50 Minuten' },
        { label: 'Sichtbare Mondoberfläche', value: 'insgesamt rund 59 %' },
        { label: 'Helligkeit Vollmond', value: 'etwa −12,7 mag' },
      ],
    },
    en: {
      title: 'Phases of the Moon',
      summary: 'From a razor-thin crescent to the full Moon – why the Moon changes its face and when you can see each phase.',
      sections: [
        {
          heading: 'Light and shadow',
          text: 'The Moon doesn’t shine on its own; it is lit by the Sun. One half is always illuminated. As the Moon orbits Earth, we sometimes see more of its bright side and sometimes more of its dark side. When it is between Earth and the Sun, we see only the night side: new Moon. When it is opposite the Sun, we look straight at the day side: full Moon. By the way, the phases have nothing to do with Earth’s shadow.',
        },
        {
          heading: 'A 29.5-day cycle',
          text: 'From one new Moon to the next takes 29.5 days on average. After new Moon, a thin crescent appears in the evening and grows day by day: the Moon is waxing. After a week it is half lit – the first quarter. Another week later comes full Moon, and then it wanes again. A rule of thumb for the Northern Hemisphere: if the right side is lit, it is waxing. Remember “DOC”: waxing looks like a D, full like an O and waning like a C.',
        },
        {
          heading: 'When the Moon is up',
          text: 'Each day, the Moon rises about 50 minutes later than the day before, on average. That is why the full Moon rises at sunset and stays up all night. The first quarter Moon is already visible in the afternoon and sets around midnight. The last quarter, on the other hand, appears in the second half of the night and lingers in the morning daylight. By the way, the Moon looks bigger near the horizon – but that is purely a trick of the brain.',
        },
        {
          heading: 'Observing tips',
          text: 'The best time for binoculars is around first quarter: along the line between light and shadow, craters and mountains stand out in sharp relief. When the crescent is thin, look at the dark part too: it glows faintly because Earth reflects sunlight onto it. This earthshine is especially easy to see on spring evenings. If you want to observe faint galaxies and nebulae instead, plan your nights around new Moon.',
        },
      ],
      facts: [
        { label: 'Full cycle of phases', value: '29.5 days' },
        { label: 'One orbit around Earth', value: '27.3 days' },
        { label: 'Daily delay in moonrise', value: 'about 50 minutes on average' },
        { label: 'Visible lunar surface', value: 'about 59 % over time' },
        { label: 'Full Moon brightness', value: 'about −12.7 mag' },
      ],
    },
  },
  {
    id: 'eclipses',
    category: 'observing',
    related: ['sun', 'moon', 'moon-phases'],
    de: {
      title: 'Sonnen- und Mondfinsternisse',
      summary: 'Wenn Sonne, Erde und Mond genau in einer Linie stehen, verdunkelt sich der Himmel – eines der eindrucksvollsten Naturschauspiele überhaupt.',
      sections: [
        {
          heading: 'Wenn Schatten wandern',
          text: 'Bei einer Sonnenfinsternis schiebt sich der Mond vor die Sonne und wirft seinen Schatten auf die Erde – das geht nur bei Neumond. Bei einer Mondfinsternis wandert der Mond durch den Schatten der Erde – das geht nur bei Vollmond. Trotzdem gibt es nicht jeden Monat Finsternisse, denn die Mondbahn ist um gut fünf Grad gegen die Erdbahn geneigt. Meist zieht der Mond deshalb knapp über oder unter der Sonne beziehungsweise dem Erdschatten vorbei.',
        },
        {
          heading: 'Die totale Sonnenfinsternis',
          text: 'Ein schöner Zufall macht sie möglich: Die Sonne ist rund 400-mal so groß wie der Mond, aber auch etwa 400-mal so weit entfernt. Darum erscheinen beide fast gleich groß. Bei einer totalen Finsternis wird es mitten am Tag dämmrig, helle Sterne tauchen auf, und um die schwarze Mondscheibe leuchtet die zarte Korona – höchstens rund siebeneinhalb Minuten lang. Ist der Mond gerade etwas weiter entfernt, bleibt ein leuchtender Ring stehen: eine ringförmige Finsternis.',
        },
        {
          heading: 'Der rote Mond',
          text: 'Eine Mondfinsternis siehst du überall dort, wo der Mond gerade über dem Horizont steht. Der Mond verschwindet dabei nicht, sondern färbt sich kupferrot. Der Grund: Die Erdatmosphäre lenkt etwas Sonnenlicht in den Schatten hinein, und dabei bleibt vor allem rotes Licht übrig – so wie bei einem Sonnenuntergang. Stündest du in diesem Moment auf dem Mond, sähest du alle Sonnenauf- und -untergänge der Erde gleichzeitig als roten Ring um sie herum.',
        },
        {
          heading: 'Sicher beobachten',
          text: 'Für eine Sonnenfinsternis brauchst du eine geprüfte Finsternisbrille nach ISO 12312-2 – normale Sonnenbrillen schützen nicht. Nur während der kurzen totalen Phase darfst du ohne Filter hinschauen. Ein Trick ohne Ausrüstung: Durch die Lücken im Blätterdach eines Baumes erscheinen auf dem Boden viele kleine Sonnensicheln. Eine Mondfinsternis ist dagegen völlig ungefährlich und mit bloßem Auge oder Fernglas ein Genuss. In Deutschland war die letzte totale Sonnenfinsternis 1999, die nächste folgt erst 2081.',
        },
      ],
      facts: [
        { label: 'Finsternisse pro Jahr', value: '4 bis 7, davon mindestens 2 Sonnenfinsternisse' },
        { label: 'Maximale Totalität (Sonne)', value: 'rund 7,5 Minuten' },
        { label: 'Neigung der Mondbahn', value: 'gut 5 Grad' },
        { label: 'Letzte totale in Deutschland', value: '11. August 1999' },
        { label: 'Nächste totale in Deutschland', value: '3. September 2081' },
      ],
    },
    en: {
      title: 'Solar and Lunar Eclipses',
      summary: 'When the Sun, Earth and Moon line up exactly, the sky goes dark – one of the most spectacular sights in nature.',
      sections: [
        {
          heading: 'Wandering shadows',
          text: 'In a solar eclipse, the Moon moves in front of the Sun and casts its shadow on Earth – this can only happen at new Moon. In a lunar eclipse, the Moon passes through Earth’s shadow – this can only happen at full Moon. Yet there are not eclipses every month, because the Moon’s orbit is tilted by just over five degrees relative to Earth’s. Usually the Moon slips just above or below the Sun or Earth’s shadow.',
        },
        {
          heading: 'Total solar eclipse',
          text: 'A lucky coincidence makes it possible: the Sun is about 400 times as wide as the Moon, but also about 400 times as far away. So both look almost the same size in the sky. During a total eclipse, it gets dark in the middle of the day, bright stars appear, and the delicate corona glows around the black disk of the Moon – for seven and a half minutes at most. If the Moon is a little farther away, a bright ring remains: an annular eclipse.',
        },
        {
          heading: 'The red Moon',
          text: 'A lunar eclipse is visible from anywhere the Moon is above the horizon at the time. The Moon doesn’t disappear; it turns a coppery red. The reason: Earth’s atmosphere bends some sunlight into the shadow, and mostly red light is left over – just like at sunset. If you stood on the Moon at that moment, you would see all of Earth’s sunrises and sunsets at once, as a red ring around our planet.',
        },
        {
          heading: 'Observing safely',
          text: 'For a solar eclipse, you need certified eclipse glasses meeting ISO 12312-2 – ordinary sunglasses do not protect you. Only during the brief total phase is it safe to look without a filter. A trick that needs no gear: gaps in the leaves of a tree project many tiny crescent Suns onto the ground. A lunar eclipse is completely safe and a delight with the naked eye or binoculars. Germany saw its last total solar eclipse in 1999; the next one comes in 2081.',
        },
      ],
      facts: [
        { label: 'Eclipses per year', value: '4 to 7, at least 2 of them solar' },
        { label: 'Maximum totality (Sun)', value: 'about 7.5 minutes' },
        { label: 'Moon’s orbital tilt', value: 'just over 5 degrees' },
        { label: 'Last total in Germany', value: 'August 11, 1999' },
        { label: 'Next total in Germany', value: 'September 3, 2081' },
      ],
    },
  },
  {
    id: 'aurora',
    category: 'observing',
    related: ['sun', 'earth', 'observing'],
    de: {
      title: 'Polarlichter',
      summary: 'Grüne und rote Lichtvorhänge entstehen, wenn Teilchen von der Sonne auf unsere Atmosphäre prallen – manchmal sogar über Deutschland.',
      sections: [
        {
          heading: 'Wenn die Sonne die Erde trifft',
          text: 'Die Sonne bläst ständig geladene Teilchen ins All, den Sonnenwind. Bei großen Ausbrüchen kommen besonders viele und schnelle Teilchen auf einmal. Das Magnetfeld der Erde fängt einen Teil davon ein und lenkt ihn in Richtung der Pole. Dort prallen die Teilchen in rund 100 bis 300 Kilometern Höhe auf Sauerstoff- und Stickstoffatome. Die Atome geben die Energie als Licht wieder ab – ähnlich wie das Gas in einer Leuchtröhre.',
        },
        {
          heading: 'Grün, Rot und Violett',
          text: 'Die Farbe verrät, welches Gas leuchtet und in welcher Höhe. Am häufigsten ist ein helles Grün, das von Sauerstoff in etwa 100 bis 200 Kilometern Höhe stammt. Darüber leuchtet Sauerstoff rot – dieses Rot sieht man bei uns oft als Erstes, weil es so hoch liegt. Am unteren Rand zeigen sich manchmal violette und rosa Säume aus Stickstoff. Nord- und Südlichter erscheinen übrigens meist gleichzeitig.',
        },
        {
          heading: 'Auch in Deutschland?',
          text: 'Normalerweise leuchten Polarlichter in einem Ring rund um die magnetischen Pole – über Nordnorwegen, Island, Finnland, Kanada oder Alaska. Bei starken Sonnenstürmen dehnt sich dieser Ring weit nach Süden aus. Im Mai 2024 leuchteten Polarlichter über ganz Deutschland und waren sogar in Südeuropa zu sehen. Solche Ereignisse sind in den Jahren um das Maximum des elfjährigen Sonnenzyklus häufiger, kommen aber auch sonst gelegentlich vor.',
        },
        {
          heading: 'So erwischst du sie',
          text: 'Behalte Vorhersagen zum Weltraumwetter im Blick, etwa Warnungen vor geomagnetischen Stürmen und den sogenannten Kp-Index. Ab einem Wert von etwa 6 bis 7 haben Beobachter in Deutschland eine Chance, im Norden eher als im Süden. Suche einen dunklen Ort mit freier Sicht nach Norden. Schwache Polarlichter wirken für das Auge oft nur wie grauer Dunst. Die Handykamera im Nachtmodus zeigt die Farben dagegen erstaunlich deutlich.',
        },
      ],
      facts: [
        { label: 'Ursache', value: 'geladene Teilchen von der Sonne' },
        { label: 'Leuchthöhe', value: 'meist rund 100 bis 300 km' },
        { label: 'Häufigste Farbe', value: 'Grün (Sauerstoff)' },
        { label: 'Klassische Polarlichtgebiete', value: 'Skandinavien, Island, Kanada, Alaska' },
        { label: 'Großes Ereignis', value: 'Mai 2024, sichtbar bis Südeuropa' },
      ],
    },
    en: {
      title: 'Auroras',
      summary: 'Green and red curtains of light appear when particles from the Sun crash into our atmosphere – sometimes far from the poles.',
      sections: [
        {
          heading: 'When the Sun hits Earth',
          text: 'The Sun constantly blows charged particles into space – the solar wind. Big eruptions release especially large numbers of fast particles at once. Earth’s magnetic field captures some of them and channels them toward the poles. There, about 100 to 300 kilometers up, the particles collide with oxygen and nitrogen atoms. The atoms release the energy as light – much like the gas in a neon sign.',
        },
        {
          heading: 'Green, red and violet',
          text: 'The color reveals which gas is glowing and at what height. Most common is a bright green, produced by oxygen at roughly 100 to 200 kilometers. Higher up, oxygen glows red – from mid-latitudes, this red is often the first thing you see because it sits so high. Along the lower edge, violet and pink fringes from nitrogen sometimes appear. By the way, northern and southern lights usually occur at the same time.',
        },
        {
          heading: 'Far from the poles?',
          text: 'Normally, auroras glow in a ring around the magnetic poles – over northern Norway, Iceland, Finland, Canada or Alaska. During strong solar storms this ring expands far toward the equator. In May 2024, auroras lit up skies across Europe and North America and were seen as far south as southern Europe and Mexico. Such events are more common in the years around the peak of the eleven-year solar cycle, but they can occasionally happen at other times too.',
        },
        {
          heading: 'How to catch them',
          text: 'Keep an eye on space weather forecasts, such as geomagnetic storm alerts and the so-called Kp index. In Germany, for example, you usually need a value of about 6 to 7, and the farther north you are, the better your chances. Find a dark spot with a clear view to the north. To the eye, faint auroras often look like nothing more than gray haze. Your phone’s camera in night mode, however, can reveal the colors surprisingly clearly.',
        },
      ],
      facts: [
        { label: 'Cause', value: 'charged particles from the Sun' },
        { label: 'Height', value: 'mostly about 100 to 300 km' },
        { label: 'Most common color', value: 'green (oxygen)' },
        { label: 'Classic aurora regions', value: 'Scandinavia, Iceland, Canada, Alaska' },
        { label: 'Major event', value: 'May 2024, seen far from the poles' },
      ],
    },
  },
  {
    id: 'meteors',
    category: 'observing',
    related: ['asteroids-comets', 'observing', 'moon-phases'],
    de: {
      title: 'Sternschnuppen und Meteorströme',
      summary: 'Sternschnuppen sind winzige Staubkörner, die in unserer Atmosphäre verglühen – und in manchen Nächten blitzen Dutzende pro Stunde auf.',
      sections: [
        {
          heading: 'Kein Stern fällt',
          text: 'Eine Sternschnuppe hat mit Sternen nichts zu tun. Es ist ein Staubkorn aus dem All, oft nicht größer als ein Sandkorn, das mit bis zu 72 Kilometern pro Sekunde in die Atmosphäre rast. Dabei bringt es die Luft in rund 70 bis 120 Kilometern Höhe zum Leuchten und verdampft. Größere Brocken erzeugen eine helle Feuerkugel. Übersteht ein Stück den Flug und erreicht den Boden, nennt man es Meteorit.',
        },
        {
          heading: 'Spuren von Kometen',
          text: 'Kometen – und manchmal Asteroiden – hinterlassen auf ihrer Bahn eine Spur aus Staub. Kreuzt die Erde jedes Jahr zur gleichen Zeit eine solche Spur, gibt es einen Meteorstrom. Die Sternschnuppen scheinen dann alle aus einem Punkt am Himmel zu kommen, dem Radianten – ein Effekt der Perspektive, wie bei Schneeflocken im Scheinwerferlicht. Nach dem Sternbild, in dem dieser Punkt liegt, ist der Strom benannt: Die Perseiden kommen scheinbar aus dem Perseus.',
        },
        {
          heading: 'Die wichtigsten Ströme',
          text: 'Der bekannteste Strom sind die Perseiden mit ihrem Höhepunkt um den 12. August – ideal für warme Sommernächte. Am stärksten sind oft die Geminiden um den 13. Dezember; sie stammen ungewöhnlicherweise von einem Asteroiden. Die Quadrantiden Anfang Januar haben ein kurzes, kräftiges Maximum. Angaben von 100 oder mehr Sternschnuppen pro Stunde gelten allerdings für ideale Bedingungen. Unter normalem Himmel siehst du meist deutlich weniger.',
        },
        {
          heading: 'So siehst du die meisten',
          text: 'Suche dir einen dunklen Ort und wähle eine Nacht ohne hellen Mond. Leg dich auf eine Liege oder Decke und schau entspannt in einen großen Himmelsbereich, nicht unbedingt direkt zum Radianten. Nach Mitternacht siehst du meist mehr, denn dann blickst du in Flugrichtung der Erde – wie bei Regentropfen, die ein fahrendes Auto vor allem auf die Windschutzscheibe treffen. Ein Fernglas brauchst du nicht, nur Geduld und warme Kleidung.',
        },
      ],
      facts: [
        { label: 'Typische Größe', value: 'Staubkorn bis Sandkorn' },
        { label: 'Geschwindigkeit', value: '11 bis 72 km/s' },
        { label: 'Leuchthöhe', value: 'rund 70 bis 120 km' },
        { label: 'Perseiden-Maximum', value: 'um den 12. August' },
        { label: 'Geminiden-Maximum', value: 'um den 13. Dezember' },
      ],
    },
    en: {
      title: 'Shooting Stars and Meteor Showers',
      summary: 'Shooting stars are tiny grains of dust burning up in our atmosphere – and on some nights dozens of them flash by every hour.',
      sections: [
        {
          heading: 'No star is falling',
          text: 'A shooting star has nothing to do with stars. It is a speck of dust from space, often no bigger than a grain of sand, that slams into the atmosphere at up to 72 kilometers per second. It makes the air glow about 70 to 120 kilometers up and vaporizes. Larger pieces create a bright fireball. If a fragment survives the trip and reaches the ground, it is called a meteorite.',
        },
        {
          heading: 'Comet trails',
          text: 'Comets – and occasionally asteroids – leave a trail of dust along their orbits. When Earth crosses such a trail at the same time every year, we get a meteor shower. The meteors then all seem to come from one point in the sky, the radiant – an effect of perspective, like snowflakes in a car’s headlights. Each shower is named after the constellation where the radiant lies: the Perseids appear to come from Perseus.',
        },
        {
          heading: 'The main showers',
          text: 'The best-known shower is the Perseids, peaking around August 12 – perfect for warm summer nights. Often the strongest is the Geminids around December 13; unusually, they come from an asteroid. The Quadrantids in early January have a short, intense peak. Note that rates of 100 or more meteors per hour refer to ideal conditions. Under a normal sky, you will usually see far fewer.',
        },
        {
          heading: 'How to see the most',
          text: 'Find a dark spot and pick a night without a bright Moon. Lie back on a lounger or blanket and gaze at a large patch of sky – not necessarily straight at the radiant. You will usually see more after midnight, because then you are facing the direction of Earth’s motion – just as raindrops mostly hit the front windshield of a moving car. You don’t need binoculars, just patience and warm clothes.',
        },
      ],
      facts: [
        { label: 'Typical size', value: 'dust grain to sand grain' },
        { label: 'Speed', value: '11 to 72 km/s' },
        { label: 'Glowing altitude', value: 'about 70 to 120 km' },
        { label: 'Perseids peak', value: 'around August 12' },
        { label: 'Geminids peak', value: 'around December 13' },
      ],
    },
  },
  {
    id: 'light-year',
    category: 'observing',
    related: ['magnitude', 'stars', 'galaxies'],
    de: {
      title: 'Entfernungen im All: AE und Lichtjahr',
      summary: 'Im All stoßen Kilometer schnell an ihre Grenzen – darum rechnen Astronomen mit dem Abstand Erde–Sonne und mit Lichtjahren.',
      sections: [
        {
          heading: 'Die Astronomische Einheit',
          text: 'Schon im Sonnensystem werden Kilometerangaben unhandlich. Darum gibt es die Astronomische Einheit, kurz AE: den mittleren Abstand zwischen Erde und Sonne, rund 150 Millionen Kilometer. Seit 2012 ist sie exakt auf 149.597.870,7 Kilometer festgelegt. Damit wird alles übersichtlich: Mars kreist in rund 1,5 AE um die Sonne, Jupiter in 5,2 AE, Neptun in 30 AE. Die Raumsonde Voyager 1 ist inzwischen mehr als 160 AE von uns entfernt.',
        },
        {
          heading: 'Das Lichtjahr',
          text: 'Für die Sterne reicht selbst die AE nicht. Licht ist das Schnellste, was es gibt: knapp 300.000 Kilometer pro Sekunde. Ein Lichtjahr ist die Strecke, die es in einem Jahr zurücklegt – rund 9,46 Billionen Kilometer. Wichtig: Das Lichtjahr ist ein Entfernungsmaß, keine Zeitangabe! Proxima Centauri, der nächste Stern nach der Sonne, ist 4,2 Lichtjahre entfernt. Fachleute verwenden oft auch das Parsec; ein Parsec entspricht etwa 3,26 Lichtjahren.',
        },
        {
          heading: 'Ein Blick in die Vergangenheit',
          text: 'Weil Licht Zeit braucht, siehst du alles am Himmel so, wie es früher war. Den Mond siehst du gut eine Sekunde in der Vergangenheit, die Sonne etwa acht Minuten. Das Licht der Andromedagalaxie war 2,5 Millionen Jahre unterwegs. Die fernsten Galaxien, die das James-Webb-Weltraumteleskop aufspürt, zeigen sich so, wie sie wenige Hundert Millionen Jahre nach dem Urknall aussahen. Weil sich das Universum ausdehnt, sind sie heute sogar noch viel weiter entfernt.',
        },
        {
          heading: 'Ein Modell zum Staunen',
          text: 'Stell dir die Sonne als Ball von zehn Zentimetern Durchmesser vor. Die Erde wäre dann ein Sandkorn von knapp einem Millimeter in gut zehn Metern Abstand. Neptun zöge seine Bahn in rund 320 Metern Entfernung. Und der nächste Stern? Er läge fast 3.000 Kilometer weit weg – ungefähr so weit wie von Berlin nach Kairo. Dazwischen: fast nichts. Kein Wunder, dass selbst unsere schnellsten Raumsonden Zehntausende Jahre bis zu den Sternen bräuchten.',
        },
      ],
      facts: [
        { label: 'Astronomische Einheit', value: '149.597.870,7 km' },
        { label: 'Lichtgeschwindigkeit', value: '299.792,458 km/s' },
        { label: 'Ein Lichtjahr', value: 'rund 9,46 Billionen km' },
        { label: 'Ein Parsec', value: 'rund 3,26 Lichtjahre' },
        { label: 'Licht vom Mond', value: 'rund 1,3 Sekunden' },
        { label: 'Licht von der Sonne', value: 'rund 8 Minuten 20 Sekunden' },
      ],
    },
    en: {
      title: 'Distances in Space: AU and Light-Year',
      summary: 'In space, kilometers quickly reach their limits – so astronomers measure in Earth–Sun distances and in light-years.',
      sections: [
        {
          heading: 'The astronomical unit',
          text: 'Even within the solar system, distances in kilometers become unwieldy. That is why we have the astronomical unit, or AU: the average distance between Earth and the Sun, about 150 million kilometers. Since 2012 it has been fixed at exactly 149,597,870.7 kilometers. Suddenly everything is easier to grasp: Mars orbits at about 1.5 AU, Jupiter at 5.2 AU, Neptune at 30 AU. The Voyager 1 probe is now more than 160 AU away from us.',
        },
        {
          heading: 'The light-year',
          text: 'For the stars, even the AU is too small. Light is the fastest thing there is: nearly 300,000 kilometers per second. A light-year is the distance it travels in one year – about 9.46 trillion kilometers. Important: the light-year is a measure of distance, not time! Proxima Centauri, the nearest star after the Sun, is 4.2 light-years away. Professionals also often use the parsec; one parsec equals about 3.26 light-years.',
        },
        {
          heading: 'A look into the past',
          text: 'Because light takes time to travel, you see everything in the sky as it was in the past. You see the Moon as it was just over a second ago, the Sun about eight minutes ago. Light from the Andromeda Galaxy has been traveling for 2.5 million years. The most distant galaxies spotted by the James Webb Space Telescope appear as they were a few hundred million years after the Big Bang. Because the universe is expanding, they are now much farther away still.',
        },
        {
          heading: 'A model to marvel at',
          text: 'Imagine the Sun as a ball 10 centimeters across. Earth would then be a grain of sand just under a millimeter wide, a little more than 10 meters away. Neptune would orbit about 320 meters out. And the nearest star? It would be almost 3,000 kilometers away – roughly the distance from Berlin to Cairo. In between: almost nothing. No wonder even our fastest space probes would need tens of thousands of years to reach the stars.',
        },
      ],
      facts: [
        { label: 'Astronomical unit', value: '149,597,870.7 km' },
        { label: 'Speed of light', value: '299,792.458 km/s' },
        { label: 'One light-year', value: 'about 9.46 trillion km' },
        { label: 'One parsec', value: 'about 3.26 light-years' },
        { label: 'Light from the Moon', value: 'about 1.3 seconds' },
        { label: 'Light from the Sun', value: 'about 8 minutes 20 seconds' },
      ],
    },
  },
  {
    id: 'magnitude',
    category: 'observing',
    related: ['stars', 'light-year', 'observing', 'venus'],
    de: {
      title: 'Helligkeit am Himmel: Magnitude',
      summary: 'Je kleiner die Zahl, desto heller der Stern – die Skala wirkt verkehrt herum, hat aber eine über 2.000 Jahre alte Geschichte.',
      sections: [
        {
          heading: 'Eine Skala aus der Antike',
          text: 'Die Helligkeitsskala geht auf den griechischen Astronomen Hipparchos zurück, der die Sterne im 2. Jahrhundert vor Christus in sechs Klassen einteilte: Die hellsten waren „erster Größe“, die gerade noch sichtbaren „sechster Größe“. Daher stammt der deutsche Begriff Größenklasse, obwohl es um Helligkeit geht, nicht um Größe. Und daher läuft die Skala scheinbar verkehrt: Je kleiner die Zahl, desto heller das Objekt. Heute schreibt man meist kurz „mag“ für Magnitude.',
        },
        {
          heading: 'Ein bisschen Mathematik',
          text: 'Im 19. Jahrhundert wurde die Skala genau festgelegt: Fünf Größenklassen entsprechen exakt dem Faktor 100 in der Helligkeit. Ein einzelner Schritt bedeutet also rund 2,5-mal heller oder dunkler. Sehr helle Objekte bekommen negative Werte: Sirius, der hellste Stern am Nachthimmel, hat −1,5 mag, der Vollmond etwa −12,7 und die Sonne −26,7. Weltraumteleskope erfassen dagegen noch Objekte jenseits der 30. Größenklasse.',
        },
        {
          heading: 'Scheinbar und absolut',
          text: 'Wie hell ein Stern am Himmel erscheint, hängt von zwei Dingen ab: wie viel Licht er abstrahlt und wie weit er entfernt ist. Diese scheinbare Helligkeit verrät also wenig über den Stern selbst. Darum gibt es die absolute Helligkeit: So hell würde ein Stern aus einer einheitlichen Entfernung von 32,6 Lichtjahren wirken. Unsere Sonne käme dabei nur auf etwa 4,8 mag – ein unauffälliges Sternchen, das man in der Stadt kaum bemerken würde.',
        },
        {
          heading: 'Was du sehen kannst',
          text: 'Unter einem wirklich dunklen Himmel erkennt das bloße Auge Sterne bis etwa zur 6. Größenklasse. In der Stadt endet die Sicht oft schon bei 3 oder 4 mag, und Tausende Sterne verschwinden im Lichtschleier. Ein Fernglas reicht bis etwa 9 mag, ein kleines Teleskop noch deutlich weiter. Probier es aus: Zähle, wie viele Sterne des Kleinen Wagens du erkennst. Siehst du alle sieben, reicht dein Himmel bis etwa 5 mag – ziemlich gut.',
        },
      ],
      facts: [
        { label: 'Sonne', value: '−26,7 mag' },
        { label: 'Vollmond', value: 'etwa −12,7 mag' },
        { label: 'Venus, maximal', value: 'etwa −4,6 mag' },
        { label: 'Sirius', value: '−1,46 mag' },
        { label: 'Grenze des bloßen Auges', value: 'etwa 6 mag' },
        { label: 'Eine Größenklasse', value: 'Faktor 2,512' },
      ],
    },
    en: {
      title: 'Brightness in the Sky: Magnitude',
      summary: 'The smaller the number, the brighter the star – the scale seems backward, but it has a history of more than 2,000 years.',
      sections: [
        {
          heading: 'A scale from antiquity',
          text: 'The magnitude scale goes back to the Greek astronomer Hipparchus, who sorted the stars into six classes in the 2nd century BC. The brightest were of the “first magnitude,” the faintest visible ones of the “sixth magnitude.” The word magnitude means size, even though it is really about brightness. And that is why the scale seems to run backward: the smaller the number, the brighter the object. Today, magnitudes are usually written with the abbreviation “mag.”',
        },
        {
          heading: 'A little math',
          text: 'In the 19th century, the scale was pinned down precisely: five magnitudes correspond to exactly a factor of 100 in brightness. A single step therefore means about 2.5 times brighter or fainter. Very bright objects get negative values: Sirius, the brightest star in the night sky, is −1.5 mag, the full Moon about −12.7 and the Sun −26.7. Space telescopes, meanwhile, can detect objects fainter than 30th magnitude.',
        },
        {
          heading: 'Apparent and absolute',
          text: 'How bright a star looks in the sky depends on two things: how much light it gives off and how far away it is. So apparent magnitude says little about the star itself. That is why there is also absolute magnitude: how bright a star would look from a standard distance of 32.6 light-years. Our Sun would reach only about 4.8 mag – an unremarkable little star you would hardly notice from a city.',
        },
        {
          heading: 'What you can see',
          text: 'Under a truly dark sky, the naked eye can see stars down to about 6th magnitude. In a city, the view often ends at 3 or 4 mag, and thousands of stars vanish in the glow. Binoculars reach about 9 mag, and even a small telescope goes much farther. Try it: count how many stars of the Little Dipper you can see. If you can make out all seven, your sky reaches about 5 mag – pretty good.',
        },
      ],
      facts: [
        { label: 'Sun', value: '−26.7 mag' },
        { label: 'Full Moon', value: 'about −12.7 mag' },
        { label: 'Venus at its brightest', value: 'about −4.6 mag' },
        { label: 'Sirius', value: '−1.46 mag' },
        { label: 'Naked-eye limit', value: 'about 6 mag' },
        { label: 'One magnitude step', value: 'factor of 2.512' },
      ],
    },
  },
  {
    id: 'observing',
    category: 'observing',
    related: ['constellations', 'magnitude', 'moon-phases', 'meteors'],
    de: {
      title: 'Sterne beobachten für Einsteiger',
      summary: 'Für den Einstieg brauchst du kein teures Teleskop – nur dunklen Himmel, etwas Geduld und ein paar einfache Tricks.',
      sections: [
        {
          heading: 'Erst die Augen',
          text: 'Fang mit bloßem Auge an. Lerne ein paar auffällige Sternbilder kennen und verfolge, wie Mond und Planeten über den Himmel wandern. Deine Augen brauchen 20 bis 30 Minuten, um sich ganz an die Dunkelheit zu gewöhnen – ein einziger Blick auf einen hellen Bildschirm macht das zunichte. Nutze deshalb gedämpftes Rotlicht, etwa eine Taschenlampe mit roter Folie oder den Rotlicht-Nachtmodus dieser App.',
        },
        {
          heading: 'Das unterschätzte Fernglas',
          text: 'Ein Fernglas ist das ideale erste Instrument. Gut geeignet sind Modelle mit 7- bis 10-facher Vergrößerung und 50 Millimetern Öffnung, zum Beispiel 10×50. Damit siehst du Krater auf dem Mond, die großen Jupitermonde, die Plejaden, den Orionnebel und die Andromedagalaxie. Lehne dich an eine Wand oder setze das Fernglas auf ein Stativ, dann wird das Bild ruhiger. Und anders als ein Teleskop ist ein Fernglas sofort einsatzbereit.',
        },
        {
          heading: 'Das erste Teleskop',
          text: 'Beim Teleskop zählt vor allem die Öffnung, also der Durchmesser von Linse oder Spiegel – nicht die Vergrößerung. Misstraue Angeboten, die mit 500-facher Vergrößerung werben. Sinnvoll ist höchstens etwa das Doppelte der Öffnung in Millimetern. Ein bewährter Einstieg ist ein Dobson-Teleskop mit 15 bis 20 Zentimetern Spiegel: einfach zu bedienen und lichtstark. Vor dem Kauf lohnt ein Besuch in einer Volkssternwarte – dort darfst du oft selbst durch verschiedene Geräte schauen.',
        },
        {
          heading: 'Ort und Zeit',
          text: 'Mond und Planeten kannst du auch in der Stadt gut beobachten. Für schwache Nebel und Galaxien brauchst du dagegen einen dunklen Ort fern von Straßenlaternen – und eine Nacht um den Neumond. Plane mit einer Sternkarte, was du sehen willst, und prüfe vorher das Wetter. Zieh dich wärmer an, als du denkst: Wer stillsteht, kühlt schnell aus, auch im Sommer. Und stell dein Teleskop rechtzeitig nach draußen, damit es sich an die Außentemperatur anpasst.',
        },
      ],
      facts: [
        { label: 'Dunkeladaption der Augen', value: '20 bis 30 Minuten' },
        { label: 'Gutes Einsteiger-Fernglas', value: '7×50 oder 10×50' },
        { label: 'Sinnvolle Höchstvergrößerung', value: 'etwa 2 × Öffnung in mm' },
        { label: 'Licht beim Beobachten', value: 'gedimmtes Rotlicht' },
        { label: 'Beste Zeit für Schwaches', value: 'Nächte um den Neumond' },
      ],
    },
    en: {
      title: 'Stargazing for Beginners',
      summary: 'To get started you don’t need an expensive telescope – just a dark sky, a little patience and a few simple tricks.',
      sections: [
        {
          heading: 'Start with your eyes',
          text: 'Begin with the naked eye. Learn a few prominent constellations and follow the Moon and planets as they move across the sky. Your eyes need 20 to 30 minutes to fully adapt to the dark – a single glance at a bright screen undoes it. So use dim red light, such as a flashlight covered with red film, or this app’s red night mode.',
        },
        {
          heading: 'Underrated binoculars',
          text: 'Binoculars are the ideal first instrument. Models with 7 to 10 times magnification and 50-millimeter lenses, such as 10×50, work well. With them you can see craters on the Moon, Jupiter’s large moons, the Pleiades, the Orion Nebula and the Andromeda Galaxy. Lean against a wall or mount the binoculars on a tripod to steady the view. And unlike a telescope, binoculars are ready to use in seconds.',
        },
        {
          heading: 'Your first telescope',
          text: 'What matters most in a telescope is aperture – the diameter of its lens or mirror – not magnification. Be wary of ads that boast 500 times magnification. The useful maximum is about twice the aperture in millimeters. A proven starter is a Dobsonian telescope with a 15 to 20 centimeter mirror: easy to use and great at gathering light. Before you buy, visit a local astronomy club or public observatory – you can often look through different instruments yourself.',
        },
        {
          heading: 'Place and time',
          text: 'You can observe the Moon and planets just fine from a city. For faint nebulae and galaxies, though, you need a dark spot away from streetlights – and a night around new Moon. Plan what you want to see with a star chart and check the weather beforehand. Dress more warmly than you think: standing still, you cool down quickly, even in summer. And put your telescope outside early so it can adjust to the outdoor temperature.',
        },
      ],
      facts: [
        { label: 'Eye dark adaptation', value: '20 to 30 minutes' },
        { label: 'Good starter binoculars', value: '7×50 or 10×50' },
        { label: 'Useful maximum magnification', value: 'about 2 × aperture in mm' },
        { label: 'Light while observing', value: 'dim red light' },
        { label: 'Best for faint objects', value: 'nights around new Moon' },
      ],
    },
  },
  {
    id: 'iss',
    category: 'spaceflight',
    related: ['rockets', 'earth', 'observing'],
    de: {
      title: 'Die Internationale Raumstation',
      summary: 'Seit dem Jahr 2000 leben ständig Menschen auf der ISS – und du kannst sie mit bloßem Auge über den Himmel ziehen sehen.',
      sections: [
        {
          heading: 'Ein Haus im All',
          text: 'Die Internationale Raumstation kreist in rund 400 Kilometern Höhe um die Erde. Gebaut wurde sie ab 1998 Stück für Stück von den USA, Russland, Europa, Japan und Kanada. Seit November 2000 ist sie ununterbrochen bewohnt. Mit ihren Solarflächen ist sie etwa so groß wie ein Fußballfeld und wiegt über 400 Tonnen. Meist ist eine Besatzung von etwa sieben Personen an Bord, die dort lebt und arbeitet.',
        },
        {
          heading: 'Schwerelos durch freien Fall',
          text: 'In 400 Kilometern Höhe ist die Schwerkraft noch fast 90 Prozent so stark wie am Boden. Warum schweben die Astronauten dann? Weil die Station mit allem darin ständig fällt! Sie fliegt aber mit rund 28.000 Kilometern pro Stunde so schnell seitwärts, dass sich die Erdoberfläche unter ihr immer weiter wegkrümmt. So fällt sie ständig um die Erde herum statt auf sie. Eine Runde dauert gut 90 Minuten – an Bord geht die Sonne täglich etwa 16-mal auf.',
        },
        {
          heading: 'Forschung und Alltag',
          text: 'Auf der ISS wird erforscht, was nur in Schwerelosigkeit geht: wie Flammen brennen, wie Kristalle wachsen und wie sich der menschliche Körper verändert. Ohne Training bauen Muskeln und Knochen ab, deshalb treiben die Astronauten täglich etwa zwei Stunden Sport. Wasser wird aufbereitet, sogar aus Urin. Auch Deutsche haben dort gelebt, etwa Thomas Reiter, Alexander Gerst und Matthias Maurer. Nach heutiger Planung soll die ISS um 2030 außer Dienst gehen.',
        },
        {
          heading: 'So siehst du die ISS',
          text: 'Die ISS ist oft heller als jeder Stern und zieht als ruhiger, nicht blinkender Lichtpunkt in wenigen Minuten über den Himmel, meist von West nach Ost. Sichtbar ist sie nur, wenn es bei dir dunkel ist, die Station hoch oben aber noch von der Sonne beschienen wird – meist in den Stunden nach Sonnenuntergang oder vor Sonnenaufgang. Taucht sie in den Erdschatten ein, verblasst sie mitten am Himmel. Genaue Überflugzeiten für deinen Ort findest du bei Vorhersagediensten im Internet.',
        },
      ],
      facts: [
        { label: 'Flughöhe', value: 'rund 400 km' },
        { label: 'Geschwindigkeit', value: 'rund 28.000 km/h' },
        { label: 'Eine Erdumrundung', value: 'gut 90 Minuten' },
        { label: 'Ständig bewohnt seit', value: 'November 2000' },
        { label: 'Masse', value: 'über 400 Tonnen' },
        { label: 'Partner', value: 'USA, Russland, Europa, Japan, Kanada' },
      ],
    },
    en: {
      title: 'The International Space Station',
      summary: 'People have lived aboard the ISS continuously since 2000 – and you can watch it glide across the sky with the naked eye.',
      sections: [
        {
          heading: 'A home in space',
          text: 'The International Space Station circles Earth about 400 kilometers up. It was assembled piece by piece from 1998 onward by the United States, Russia, Europe, Japan and Canada. It has been continuously inhabited since November 2000. With its solar arrays, it is roughly the size of a football field and weighs more than 400 metric tons. Usually a crew of about seven people lives and works on board.',
        },
        {
          heading: 'Weightless by free fall',
          text: 'At an altitude of 400 kilometers, gravity is still almost 90 percent as strong as on the ground. So why do astronauts float? Because the station and everything in it are constantly falling! But it moves sideways so fast – about 28,000 kilometers per hour – that Earth’s surface keeps curving away beneath it. So it keeps falling around Earth instead of onto it. One lap takes just over 90 minutes – the crew sees about 16 sunrises a day.',
        },
        {
          heading: 'Research and daily life',
          text: 'On the ISS, scientists study things that only work in weightlessness: how flames burn, how crystals grow and how the human body changes. Without exercise, muscles and bones waste away, so astronauts work out for about two hours a day. Water is recycled – even from urine. Astronauts from many countries have lived on board, including the Germans Thomas Reiter, Alexander Gerst and Matthias Maurer. Under current plans, the ISS is to be retired around 2030.',
        },
        {
          heading: 'How to see the ISS',
          text: 'The ISS is often brighter than any star and glides across the sky as a steady, non-blinking point of light within a few minutes, usually from west to east. You can only see it when it is dark where you are but the station, high above, is still lit by the Sun – mostly in the hours after sunset or before sunrise. When it enters Earth’s shadow, it fades out in mid-sky. Online prediction services list exact pass times for your location.',
        },
      ],
      facts: [
        { label: 'Altitude', value: 'about 400 km' },
        { label: 'Speed', value: 'about 28,000 km/h' },
        { label: 'One orbit', value: 'just over 90 minutes' },
        { label: 'Continuously inhabited since', value: 'November 2000' },
        { label: 'Mass', value: 'over 400 metric tons' },
        { label: 'Partners', value: 'USA, Russia, Europe, Japan, Canada' },
      ],
    },
  },
  {
    id: 'rockets',
    category: 'spaceflight',
    related: ['iss', 'earth', 'mars'],
    de: {
      title: 'Raketen und Umlaufbahnen',
      summary: 'Eine Rakete stößt sich nicht an der Luft ab, und eine Umlaufbahn ist nichts anderes als ein endloser Fall um die Erde herum.',
      sections: [
        {
          heading: 'Das Rückstoßprinzip',
          text: 'Eine Rakete funktioniert wie ein losgelassener Luftballon: Sie stößt heißes Gas mit großer Wucht nach hinten aus und wird dadurch nach vorn gedrückt. Dafür braucht sie keine Luft, gegen die sie sich abstößt – im Vakuum arbeitet sie sogar besser. Weil der Treibstoff den größten Teil ihrer Masse ausmacht, ist sie in Stufen gebaut: Leere Tanks samt Triebwerken werden abgeworfen. Moderne Raketen wie die Falcon 9 landen ihre erste Stufe sogar und fliegen sie erneut.',
        },
        {
          heading: 'Fallen, ohne zu landen',
          text: 'Stell dir eine Kanone auf einem sehr hohen Berg vor. Je schneller die Kugel fliegt, desto weiter entfernt schlägt sie auf. Bei knapp acht Kilometern pro Sekunde passiert etwas Besonderes: Die Erdoberfläche krümmt sich genauso schnell weg, wie die Kugel fällt. Sie fällt endlos um die Erde herum – das ist eine Umlaufbahn. Dieses Gedankenexperiment stammt von Isaac Newton. Für den Weg in eine Umlaufbahn zählt deshalb vor allem Tempo zur Seite, nicht nur Höhe.',
        },
        {
          heading: 'Schwung von der Erde',
          text: 'Raketen starten meist in Richtung Osten, denn in diese Richtung dreht sich die Erde. Am Äquator schenkt ihnen das bis zu rund 1.670 Kilometer pro Stunde. Deshalb liegen viele Startplätze möglichst nah am Äquator, etwa Europas Weltraumbahnhof Kourou in Französisch-Guayana. Viele befinden sich außerdem an der Küste, damit ausgebrannte Stufen ins Meer fallen. Um sich ganz aus dem Schwerefeld der Erde zu lösen, braucht ein Raumschiff 11,2 Kilometer pro Sekunde – die Fluchtgeschwindigkeit.',
        },
        {
          heading: 'Wege durchs Sonnensystem',
          text: 'Zum Mars fliegt eine Sonde nicht geradeaus, sondern auf einer Ellipse um die Sonne, die Erd- und Marsbahn verbindet. Die Reise dauert etwa sieben Monate, und weil die Planeten dafür richtig stehen müssen, öffnet sich nur etwa alle 26 Monate ein Startfenster. Vorbeiflüge an Planeten geben Sonden zusätzlichen Schwung – so erreichten die Voyager-Sonden die äußeren Planeten. Satelliten kannst du übrigens selbst sehen: In den ersten Stunden nach der Abenddämmerung ziehen sie als stille, wandernde Lichtpunkte über den Himmel.',
        },
      ],
      facts: [
        { label: 'Erster Satellit', value: 'Sputnik 1, 4. Oktober 1957' },
        { label: 'Erster Mensch im All', value: 'Juri Gagarin, 12. April 1961' },
        { label: 'Bahngeschwindigkeit in 400 km', value: 'rund 7,7 km/s' },
        { label: 'Fluchtgeschwindigkeit der Erde', value: '11,2 km/s' },
        { label: 'Geostationäre Bahn', value: '35.786 km über dem Äquator' },
        { label: 'Schwung durch Erddrehung', value: 'bis rund 1.670 km/h' },
      ],
    },
    en: {
      title: 'Rockets and Orbits',
      summary: 'A rocket doesn’t push against the air, and an orbit is nothing more than an endless fall around Earth.',
      sections: [
        {
          heading: 'The principle of thrust',
          text: 'A rocket works like a balloon you let go of: it blasts hot gas backward with great force and is pushed forward in return. It doesn’t need air to push against – in fact, it works even better in a vacuum. Because propellant makes up most of its mass, it is built in stages: empty tanks and their engines are dropped along the way. Modern rockets like the Falcon 9 even land their first stage and fly it again.',
        },
        {
          heading: 'Falling without landing',
          text: 'Imagine a cannon on top of a very tall mountain. The faster the cannonball flies, the farther away it hits the ground. At nearly eight kilometers per second, something special happens: Earth’s surface curves away just as fast as the ball falls. It keeps falling around Earth forever – that is an orbit. This thought experiment comes from Isaac Newton. So getting into orbit is mostly about speed sideways, not just height.',
        },
        {
          heading: 'A boost from Earth',
          text: 'Rockets usually launch toward the east, because Earth rotates in that direction. At the equator, this gives them a free boost of up to about 1,670 kilometers per hour. That is why many launch sites lie as close to the equator as possible, such as Europe’s spaceport in Kourou, French Guiana. Many are also on a coast, so that spent stages fall into the sea. To break free of Earth’s gravity entirely, a spacecraft needs 11.2 kilometers per second – the escape velocity.',
        },
        {
          heading: 'Paths through the solar system',
          text: 'A probe doesn’t fly to Mars in a straight line, but along an ellipse around the Sun linking the orbits of Earth and Mars. The trip takes about seven months, and because the planets must be in the right positions, a launch window opens only about every 26 months. Planetary flybys give probes an extra boost – that is how the Voyager probes reached the outer planets. You can see satellites yourself: in the first hours after dusk, they drift across the sky as silent, moving points of light.',
        },
      ],
      facts: [
        { label: 'First satellite', value: 'Sputnik 1, October 4, 1957' },
        { label: 'First human in space', value: 'Yuri Gagarin, April 12, 1961' },
        { label: 'Speed at 400 km', value: 'about 7.7 km/s' },
        { label: 'Earth’s escape velocity', value: '11.2 km/s' },
        { label: 'Geostationary orbit', value: '35,786 km above the equator' },
        { label: 'Boost from Earth’s rotation', value: 'up to about 1,670 km/h' },
      ],
    },
  },
];
