// Sternbild-Sagen und Herkunftsgeschichten (Deutsch und Englisch).
// Jedes der 88 IAU-Sternbilder hat mindestens einen Eintrag: die klassische griechisch-römische Sage
// für die 48 Sternbilder des Ptolemäus (die Argo ist auf Kiel, Achterdeck und Segel verteilt),
// einen Herkunfts-Eintrag ('origin') für die neuzeitlichen Sternbilder sowie Geschichten aus anderen Kulturen.
// Sortierung: nach Sternbild-Kürzel (Reihenfolge wie in constellation-names.json), klassische bzw. Herkunfts-Einträge zuerst.

export type MythCulture =
  | 'greek'
  | 'roman'
  | 'arabic'
  | 'chinese'
  | 'aboriginal'
  | 'norse'
  | 'egyptian'
  | 'polynesian'
  | 'indigenous-american'
  | 'babylonian'
  | 'indian'
  | 'african'
  | 'origin';

export interface Myth {
  /** IAU-Kürzel wie in src/data/constellation-names.json, z. B. 'Ori' */
  con: string;
  culture: MythCulture;
  de: { title: string; text: string };
  en: { title: string; text: string };
}

export const MYTHS: Myth[] = [
  // ── Andromeda ──
  {
    con: 'And',
    culture: 'greek',
    de: {
      title: 'Die Prinzessin am Felsen',
      text: 'Königin Kassiopeia prahlte, ihre Tochter Andromeda sei schöner als die Meeresnymphen. Zur Strafe wurde die Prinzessin an einen Felsen gekettet – als Futter für ein Seeungeheuer. Im letzten Moment rettete sie der Held Perseus. Ihr hellster Stern Alpheratz bildet eine Ecke des Pegasus-Quadrats, und nicht weit davon schimmert die Andromedagalaxie.',
    },
    en: {
      title: 'The Princess on the Rock',
      text: 'Queen Cassiopeia boasted that her daughter Andromeda was lovelier than the sea nymphs. As punishment, the princess was chained to a rock as a meal for a sea monster – until the hero Perseus saved her at the last moment. Her brightest star, Alpheratz, is a corner of the Great Square of Pegasus, and the Andromeda Galaxy glows nearby.',
    },
  },
  // ── Luftpumpe ──
  {
    con: 'Ant',
    culture: 'origin',
    de: {
      title: 'Eine Luftpumpe für den Südhimmel',
      text: 'Der Franzose Nicolas-Louis de Lacaille vermaß 1751–52 am Kap der Guten Hoffnung tausende Südsterne. 1756 führte er 14 neue Sternbilder ein, fast alle nach Geräten aus Wissenschaft und Kunst benannt. Die Luftpumpe erinnert an die Vakuum-Experimente von Forschern wie Robert Boyle und Denis Papin. Ihre Sterne sind sehr lichtschwach.',
    },
    en: {
      title: 'An Air Pump for the Southern Sky',
      text: 'From the Cape of Good Hope, the French astronomer Nicolas-Louis de Lacaille mapped thousands of southern stars in 1751–52. In 1756 he introduced 14 new constellations, nearly all named after tools of science and art. The air pump honors the vacuum experiments of researchers like Robert Boyle and Denis Papin. Its stars are very faint.',
    },
  },
  // ── Paradiesvogel ──
  {
    con: 'Aps',
    culture: 'origin',
    de: {
      title: 'Der Vogel ohne Füße',
      text: 'Den Paradiesvogel verzeichneten die niederländischen Seefahrer Pieter Dirkszoon Keyser und Frederick de Houtman, die 1595–97 nach Ostindien segelten. Petrus Plancius brachte ihre zwölf neuen Südsternbilder 1598 auf einen Himmelsglobus. Apus heißt „ohne Füße“: Die ersten Vogelbälge kamen ohne Füße nach Europa – man glaubte, diese Vögel landeten nie.',
    },
    en: {
      title: 'The Bird Without Feet',
      text: 'The bird-of-paradise was recorded by the Dutch navigators Pieter Dirkszoon Keyser and Frederick de Houtman on their 1595–97 voyage to the East Indies. Petrus Plancius put their twelve new southern constellations on a celestial globe in 1598. Apus means “without feet”: the first bird skins reached Europe without feet, so people believed these birds never landed.',
    },
  },
  // ── Wassermann ──
  {
    con: 'Aqr',
    culture: 'greek',
    de: {
      title: 'Ganymed, der Mundschenk der Götter',
      text: 'Im Wassermann sahen die Griechen meist Ganymed, einen besonders schönen Hirtenjungen. Zeus holte ihn auf den Olymp, wo er den Göttern Nektar einschenkte. Aus seinem Krug fließt ein Strom aus Sternen bis zum Maul des Südlichen Fischs. Schon in Babylon sah man hier einen Gott mit überfließenden Wassergefäßen.',
    },
    en: {
      title: 'Ganymede, Cupbearer of the Gods',
      text: 'The Greeks usually saw Aquarius as Ganymede, an especially handsome shepherd boy. Zeus carried him off to Mount Olympus, where he poured nectar for the gods. From his jar, a stream of stars flows down to the mouth of the Southern Fish. Even in ancient Babylon, people saw a god with overflowing water jars here.',
    },
  },
  // ── Adler ──
  {
    con: 'Aql',
    culture: 'greek',
    de: {
      title: 'Der Adler des Zeus',
      text: 'Der Adler war der Vogel des Göttervaters Zeus und trug seine Blitze. In einer Sage packte er den Hirtenjungen Ganymed und brachte ihn zum Olymp. Sein hellster Stern Atair ist nur rund 17 Lichtjahre entfernt. Zusammen mit Wega in der Leier und Deneb im Schwan bildet er das Sommerdreieck.',
    },
    en: {
      title: 'The Eagle of Zeus',
      text: 'The eagle was the bird of Zeus, king of the gods, and carried his thunderbolts. In one tale it seized the shepherd boy Ganymede and flew him to Mount Olympus. Its brightest star, Altair, is only about 17 light-years away. Together with Vega in Lyra and Deneb in Cygnus, it forms the Summer Triangle.',
    },
  },
  {
    con: 'Aql',
    culture: 'chinese',
    de: {
      title: 'Der Kuhhirte mit seinen Kindern',
      text: 'In China ist Atair der Kuhhirte Niulang, der die Himmelsweberin Zhinü (Wega) liebt. Die Milchstraße trennt das Paar. In vielen Erzählungen sind die beiden Sterne links und rechts von Atair ihre Kinder, die der Vater in zwei Körben an einer Tragestange trägt, während er zum Himmelsfluss eilt.',
    },
    en: {
      title: 'The Cowherd and His Children',
      text: 'In China, Altair is the cowherd Niulang, who loves the heavenly weaver girl Zhinü (Vega). The Milky Way keeps the couple apart. In many tellings, the two stars on either side of Altair are their children, whom the father carries in two baskets hanging from a shoulder pole as he hurries to the river of heaven.',
    },
  },
  {
    con: 'Aql',
    culture: 'arabic',
    de: {
      title: 'Der fliegende Adler',
      text: 'Der Name Atair stammt aus dem Arabischen: an-nasr at-tair, „der fliegende Adler“. Auch die Wega in der Leier war ein Adler: an-nasr al-waqi, „der herabstoßende Adler“ mit angelegten Flügeln. Viele unserer Sternnamen kamen über arabische Astronomen des Mittelalters nach Europa.',
    },
    en: {
      title: 'The Flying Eagle',
      text: 'The name Altair comes from Arabic: al-nasr al-tair, “the flying eagle”. Vega in Lyra was an eagle too: al-nasr al-waqi, “the swooping eagle” with its wings folded. Many of our star names reached Europe through Arabic astronomers of the Middle Ages.',
    },
  },
  // ── Altar ──
  {
    con: 'Ara',
    culture: 'greek',
    de: {
      title: 'Der Altar der Götter',
      text: 'Bevor die olympischen Götter gegen die Titanen kämpften, schworen sie sich auf diesem Altar Treue. Gebaut haben sollen ihn die Zyklopen. Nach dem Sieg setzte Zeus ihn an den Himmel, und die Milchstraße darüber sah man als Rauch des Opferfeuers. Von Deutschland aus ist der Altar kaum zu sehen, weil er zu weit im Süden steht.',
    },
    en: {
      title: 'The Altar of the Gods',
      text: 'Before the Olympian gods fought the Titans, they swore loyalty to one another on this altar, said to have been built by the Cyclopes. After their victory, Zeus placed it in the sky, and the Milky Way above it was seen as smoke from the sacred fire. From Central Europe the altar is hard to see because it lies so far south.',
    },
  },
  // ── Widder ──
  {
    con: 'Ari',
    culture: 'greek',
    de: {
      title: 'Der Widder mit dem Goldenen Vlies',
      text: 'Ein fliegender Widder mit goldenem Fell rettete die Geschwister Phrixos und Helle vor dem tödlichen Plan ihrer Stiefmutter. Helle stürzte unterwegs ins Meer – die Meerenge heißt seitdem Hellespont. Das Fell wurde später als Goldenes Vlies berühmt, das Jason mit den Argonauten suchte. Hamal ist der hellste Stern des Widders.',
    },
    en: {
      title: 'The Ram with the Golden Fleece',
      text: 'A flying ram with golden wool rescued the siblings Phrixus and Helle from their stepmother’s deadly plot. Helle fell into the sea on the way, and the strait was named the Hellespont after her. The ram’s fleece later became the famous Golden Fleece that Jason and the Argonauts set out to find. Hamal is the brightest star of Aries.',
    },
  },
  {
    con: 'Ari',
    culture: 'babylonian',
    de: {
      title: 'Vom Tagelöhner zum Widder',
      text: 'In Babylon hießen diese Sterne vor rund 3000 Jahren „der Tagelöhner“ – ein Landarbeiter. Später brachte man das Sternbild mit dem Hirtengott Dumuzi in Verbindung, und aus dem Arbeiter wurde nach und nach ein Widder. Wie genau dieser Wandel ablief, ist bis heute nicht ganz geklärt.',
    },
    en: {
      title: 'From Hired Man to Ram',
      text: 'In Babylon some 3,000 years ago, these stars were called “the Hired Man” – a farm worker. Later the figure became linked with Dumuzi, the shepherd god, and the worker slowly turned into a ram. Exactly how this change happened is still not fully understood.',
    },
  },
  // ── Fuhrmann ──
  {
    con: 'Aur',
    culture: 'greek',
    de: {
      title: 'Der Wagenlenker mit der Ziege',
      text: 'Der Fuhrmann gilt oft als Erichthonios, ein König von Athen, der als Erster vier Pferde vor einen Wagen spannte. Zum Dank setzte Zeus ihn an den Himmel. Auf der Schulter trägt er eine Ziege: Capella, der sechsthellste Stern am Nachthimmel. Sie erinnert an die Ziege Amaltheia, die den kleinen Zeus mit ihrer Milch nährte.',
    },
    en: {
      title: 'The Charioteer and the Goat',
      text: 'Auriga is often said to be Erichthonius, a king of Athens who was the first to harness four horses to a chariot, and Zeus honored him with a place in the sky. On his shoulder he carries a goat: Capella, the sixth-brightest star in the night sky. It recalls Amalthea, the goat whose milk fed the infant Zeus.',
    },
  },
  // ── Bärenhüter ──
  {
    con: 'Boo',
    culture: 'greek',
    de: {
      title: 'Der Hüter der Bärin',
      text: 'Der Bärenhüter scheint den Großen Bären um den Himmelspol zu treiben. Oft gilt er als Arkas, der Sohn der Kallisto, die in eine Bärin verwandelt wurde. Sein Hauptstern Arktur heißt „Bärenwächter“ und ist der hellste Stern am Nordhimmel. Man findet ihn, wenn man den Bogen der Deichsel des Großen Wagens verlängert.',
    },
    en: {
      title: 'The Keeper of the Bear',
      text: 'Boötes seems to drive the Great Bear around the celestial pole. He is often said to be Arcas, son of Callisto, who had been turned into a bear. His main star, Arcturus, means “guardian of the bear” and is the brightest star in the northern half of the sky. To find it, follow the curve of the Big Dipper’s handle: “arc to Arcturus”.',
    },
  },
  {
    con: 'Boo',
    culture: 'polynesian',
    de: {
      title: 'Hōkūleʻa, der Stern der Freude',
      text: 'Auf Hawaiʻi heißt Arktur Hōkūleʻa, „Stern der Freude“. Er zieht genau über die Inseln hinweg. Polynesische Seefahrer wussten: Steht dieser Stern im Zenit, hat man die Breite Hawaiʻis erreicht. Nach ihm ist das Doppelrumpf-Kanu benannt, das 1976 ohne Kompass und Instrumente von Hawaiʻi nach Tahiti segelte.',
    },
    en: {
      title: 'Hōkūleʻa, the Star of Gladness',
      text: 'In Hawaiʻi, Arcturus is called Hōkūleʻa, “star of gladness”. It passes straight over the islands. Polynesian navigators knew that when this star stood directly overhead, they had reached the latitude of Hawaiʻi. The double-hulled canoe that sailed from Hawaiʻi to Tahiti in 1976 without compass or instruments was named after it.',
    },
  },
  // ── Grabstichel ──
  {
    con: 'Cae',
    culture: 'origin',
    de: {
      title: 'Das Werkzeug des Kupferstechers',
      text: 'Lacaille führte den Grabstichel 1756 ein. Gemeint ist ein spitzes Stahlwerkzeug, mit dem Kupferstecher feine Linien in Metallplatten ritzen – so wurden damals auch Sternkarten gedruckt. Das kleine Sternbild liegt zwischen Eridanus und der Taube und hat nur sehr schwache Sterne.',
    },
    en: {
      title: 'The Engraver’s Tool',
      text: 'Lacaille introduced Caelum in 1756. It shows an engraver’s chisel, a pointed steel tool for cutting fine lines into metal plates – which is how star charts were printed at the time. This small constellation lies between Eridanus and Columba and contains only very faint stars.',
    },
  },
  // ── Giraffe ──
  {
    con: 'Cam',
    culture: 'origin',
    de: {
      title: 'Eine Giraffe am Nordhimmel',
      text: 'Die Giraffe stammt vom niederländischen Theologen und Kartografen Petrus Plancius, der sie um 1613 einführte. Der lateinische Name bedeutet „Kamel-Leopard“ – so nannte man die Giraffe früher, weil sie wie ein Kamel mit Leopardenflecken aussah. Das große, aber blasse Sternbild füllt die Lücke zwischen Perseus und dem Großen Bären.',
    },
    en: {
      title: 'A Giraffe in the Northern Sky',
      text: 'The giraffe was introduced around 1613 by Petrus Plancius, a Dutch theologian and mapmaker. Its Latin name means “camel-leopard”, an old word for the giraffe, which looked like a camel with leopard spots. This large but faint constellation fills the gap between Perseus and the Great Bear.',
    },
  },
  // ── Krebs ──
  {
    con: 'Cnc',
    culture: 'greek',
    de: {
      title: 'Der Krebs, der Herakles zwickte',
      text: 'Als Herakles gegen die vielköpfige Hydra kämpfte, schickte ihm die Göttin Hera einen Krebs, der ihn in den Fuß zwicken sollte. Herakles zertrat ihn einfach. Zum Dank setzte Hera den Krebs an den Himmel. In seiner Mitte liegt der Sternhaufen Praesepe, die „Krippe“, mit zwei Sternen daneben – den „Eseln“, die aus ihr fressen.',
    },
    en: {
      title: 'The Crab That Pinched Heracles',
      text: 'While Heracles fought the many-headed Hydra, the goddess Hera sent a crab to pinch his foot. Heracles simply crushed it, and Hera rewarded the crab with a place among the stars. At its center lies the star cluster Praesepe, the “Manger” or Beehive, flanked by two stars known as the donkeys feeding from it.',
    },
  },
  // ── Jagdhunde ──
  {
    con: 'CVn',
    culture: 'origin',
    de: {
      title: 'Die Hunde des Bärenhüters',
      text: 'Johannes Hevelius, ein Astronom aus Danzig, formte aus schwachen Sternen neue Bilder; sein Atlas erschien 1690. Die Jagdhunde laufen vor dem Bärenhüter her und hetzen den Großen Bären. Ihr hellster Stern heißt Cor Caroli, „Herz Karls“, zu Ehren eines englischen Königs. Hier liegt auch die berühmte Whirlpool-Galaxie.',
    },
    en: {
      title: 'The Herdsman’s Hounds',
      text: 'Johannes Hevelius, an astronomer in Danzig (Gdańsk), shaped new figures from faint stars; his atlas appeared in 1690. The hunting dogs run ahead of Boötes, chasing the Great Bear. Their brightest star is Cor Caroli, “Charles’s heart”, named in honor of an English king. The famous Whirlpool Galaxy lies here too.',
    },
  },
  // ── Großer Hund ──
  {
    con: 'CMa',
    culture: 'greek',
    de: {
      title: 'Der Hund des Orion',
      text: 'Der Große Hund folgt seinem Herrn Orion über den Himmel. Sein Hauptstern Sirius ist der hellste Stern am Nachthimmel; der griechische Name bedeutet etwa „glühend“. Weil Sirius im Hochsommer kurz vor der Sonne aufging, nannten die Römer die heißesten Wochen „Hundstage“ – ein Wort, das wir bis heute benutzen.',
    },
    en: {
      title: 'Orion’s Hound',
      text: 'Canis Major follows its master Orion across the sky. Its main star, Sirius, is the brightest star in the night sky; its Greek name means roughly “scorching”. Because Sirius rose just before the Sun in high summer, the Romans called the hottest weeks the “dog days” – a phrase we still use today.',
    },
  },
  {
    con: 'CMa',
    culture: 'egyptian',
    de: {
      title: 'Sopdet kündigt die Nilflut an',
      text: 'Im alten Ägypten war Sirius die Göttin Sopdet, eng verbunden mit Isis. Tauchte der Stern im Sommer nach Wochen der Unsichtbarkeit erstmals wieder kurz vor Sonnenaufgang auf, stand die Nilflut bevor. Sie brachte fruchtbaren Schlamm auf die Felder – deshalb begann mit Sopdets Rückkehr das neue Jahr.',
    },
    en: {
      title: 'Sopdet Heralds the Nile Flood',
      text: 'In ancient Egypt, Sirius was the goddess Sopdet, closely linked with Isis. When the star reappeared in summer just before sunrise after weeks of being hidden, the Nile flood was near. The flood brought fertile mud to the fields, so Sopdet’s return marked the start of the new year.',
    },
  },
  // ── Kleiner Hund ──
  {
    con: 'CMi',
    culture: 'greek',
    de: {
      title: 'Der kleine Jagdhund',
      text: 'Der Kleine Hund gilt als zweiter Jagdhund des Orion. Er besteht fast nur aus zwei Sternen: Prokyon und Gomeisa. Prokyon heißt „vor dem Hund“, weil er bei uns kurz vor Sirius, dem Hauptstern des Großen Hundes, aufgeht. Zusammen mit Sirius und Beteigeuze bildet Prokyon das Winterdreieck.',
    },
    en: {
      title: 'The Little Hunting Dog',
      text: 'Canis Minor is said to be Orion’s second hunting dog. It consists of little more than two stars: Procyon and Gomeisa. Procyon means “before the dog”, because from northern lands it rises shortly before Sirius, the main star of Canis Major. Together with Sirius and Betelgeuse, Procyon forms the Winter Triangle.',
    },
  },
  // ── Steinbock ──
  {
    con: 'Cap',
    culture: 'greek',
    de: {
      title: 'Pan auf der Flucht',
      text: 'Als das Ungeheuer Typhon die Götter angriff, flohen sie in Tiergestalt. Der Hirtengott Pan sprang in einen Fluss und verwandelte sich nur halb: Oben wurde er zur Ziege, unten zum Fisch. Zeus fand den Anblick so komisch, dass er ihn an den Himmel setzte. Der Steinbock ist eines der lichtschwächsten Tierkreisbilder.',
    },
    en: {
      title: 'Pan on the Run',
      text: 'When the monster Typhon attacked the gods, they fled in animal form. The shepherd god Pan leapt into a river and only half transformed: goat above, fish below. Zeus found the sight so funny that he placed it in the sky. Capricornus is one of the faintest constellations of the zodiac.',
    },
  },
  {
    con: 'Cap',
    culture: 'babylonian',
    de: {
      title: 'Der Ziegenfisch aus Babylon',
      text: 'Die Figur mit Ziegenkopf und Fischschwanz ist viel älter als die Griechen. In Mesopotamien hieß sie Suhurmaschu, „Ziegenfisch“, und gehörte zu Ea (Enki), dem Gott des Süßwassers und der Weisheit. Babylonische Grenzsteine zeigen dieses Mischwesen schon vor über 3000 Jahren.',
    },
    en: {
      title: 'The Goat-Fish of Babylon',
      text: 'The creature with a goat’s head and a fish’s tail is much older than the Greeks. In Mesopotamia it was called Suhurmashu, the “goat-fish”, and belonged to Ea (Enki), god of fresh water and wisdom. Babylonian boundary stones showed this hybrid more than 3,000 years ago.',
    },
  },
  // ── Kiel des Schiffs ──
  {
    con: 'Car',
    culture: 'greek',
    de: {
      title: 'Der Kiel der Argo',
      text: 'Kiel, Achterdeck und Segel waren einst ein einziges Riesensternbild: die Argo, das Schiff von Jason und den Argonauten auf der Suche nach dem Goldenen Vlies. Lacaille teilte es in den 1750er Jahren auf. Im Kiel leuchtet Canopus, der zweithellste Stern des Nachthimmels – benannt nach einem sagenhaften Steuermann.',
    },
    en: {
      title: 'The Keel of the Argo',
      text: 'Carina, Puppis and Vela were once a single giant constellation: the Argo, the ship of Jason and the Argonauts in search of the Golden Fleece. Lacaille split it up in the 1750s. In the keel shines Canopus, the second-brightest star in the night sky – named after a legendary helmsman.',
    },
  },
  // ── Kassiopeia ──
  {
    con: 'Cas',
    culture: 'greek',
    de: {
      title: 'Die eitle Königin',
      text: 'Kassiopeia, Königin von Äthiopien, prahlte mit der Schönheit ihrer Tochter Andromeda und erzürnte damit den Meeresgott Poseidon. Zur Strafe muss sie auf ihrem Thron um den Himmelspol kreisen und hängt dabei zeitweise kopfüber. Ihre fünf hellsten Sterne bilden ein auffälliges „W“, das man bei uns das ganze Jahr sieht.',
    },
    en: {
      title: 'The Vain Queen',
      text: 'Cassiopeia, queen of Ethiopia, bragged about her daughter Andromeda’s beauty and angered the sea god Poseidon. As punishment she must circle the celestial pole on her throne, sometimes hanging upside down. Her five brightest stars form a striking “W” that is visible all year from Europe and North America.',
    },
  },
  {
    con: 'Cas',
    culture: 'arabic',
    de: {
      title: 'Die Hand mit Henna',
      text: 'Arabische Himmelsbeobachter sahen in den Sternen des W eine ausgestreckte Hand, deren Fingerspitzen mit Henna gefärbt sind. Daran erinnert noch der Name des Sterns Caph: Er kommt vom arabischen Wort für „Handfläche“.',
    },
    en: {
      title: 'The Henna-Dyed Hand',
      text: 'Arab skywatchers saw the stars of the W as an outstretched hand with fingertips dyed with henna. The star name Caph still recalls this: it comes from the Arabic word for “palm of the hand”.',
    },
  },
  {
    con: 'Cas',
    culture: 'indigenous-american',
    de: {
      title: 'Die kreisende Frau der Navajo',
      text: 'Bei den Diné (Navajo) ist Kassiopeia die „Kreisende Frau“ und der Große Wagen der „Kreisende Mann“. Die beiden drehen sich um den Polarstern, das „Zentrale Feuer“ – wie eine Familie um die Feuerstelle in einem Hogan, dem traditionellen Haus. Die Sterne erinnern daran, wie man in einem Zuhause friedlich zusammenlebt.',
    },
    en: {
      title: 'The Navajo Revolving Woman',
      text: 'For the Diné (Navajo), Cassiopeia is the “Revolving Woman” and the Big Dipper the “Revolving Man”. The two circle the North Star, the “Central Fire”, like a family around the hearth of a hogan, the traditional home. The stars are a reminder of how to live together peacefully in a household.',
    },
  },
  // ── Zentaur ──
  {
    con: 'Cen',
    culture: 'greek',
    de: {
      title: 'Chiron, der weise Zentaur',
      text: 'Die meisten Zentauren galten als wild, doch Chiron war weise und freundlich. Er unterrichtete Helden wie Achilles und Jason und den Heiler Asklepios. Als ihn versehentlich ein Giftpfeil des Herakles traf, gab er seine Unsterblichkeit auf, um vom Schmerz erlöst zu werden. Am Vorderhuf leuchtet Alpha Centauri, unser nächstes Sternsystem.',
    },
    en: {
      title: 'Chiron, the Wise Centaur',
      text: 'Most centaurs were wild, but Chiron was wise and kind. He taught heroes such as Achilles and Jason, as well as the healer Asclepius. When one of Heracles’ poisoned arrows struck him by accident, he gave up his immortality to escape the pain. At his front hoof shines Alpha Centauri, our nearest neighboring star system.',
    },
  },
  // ── Kepheus ──
  {
    con: 'Cep',
    culture: 'greek',
    de: {
      title: 'König Kepheus',
      text: 'Kepheus war König von Äthiopien, Ehemann der Kassiopeia und Vater der Andromeda. Am Himmel steht er neben seiner Familie und sieht aus wie ein Haus mit spitzem Dach. Berühmt ist sein Stern Delta Cephei, der regelmäßig heller und dunkler wird. Solche Sterne, Cepheiden genannt, dienen heute als Maßband für Entfernungen zu Galaxien.',
    },
    en: {
      title: 'King Cepheus',
      text: 'Cepheus was king of Ethiopia, husband of Cassiopeia and father of Andromeda. In the sky he stands beside his family, shaped like a house with a pointed roof. His star Delta Cephei is famous for brightening and dimming regularly. Such stars, called Cepheids, now serve as cosmic yardsticks for measuring the distances to galaxies.',
    },
  },
  // ── Walfisch ──
  {
    con: 'Cet',
    culture: 'greek',
    de: {
      title: 'Das Seeungeheuer',
      text: 'Poseidon schickte ein Meeresungeheuer, das die Küste Äthiopiens verwüsten sollte – nur das Opfer der Prinzessin Andromeda konnte es besänftigen. Perseus besiegte das Ungeheuer. In seinem Hals liegt Mira, „die Wunderbare“: ein Riesenstern, der so stark schwankt, dass er monatelang mit bloßem Auge unsichtbar wird.',
    },
    en: {
      title: 'The Sea Monster',
      text: 'Poseidon sent a sea monster to ravage the coast of Ethiopia, and only the sacrifice of Princess Andromeda could calm it. Perseus defeated the beast. In its neck lies Mira, “the wonderful”: a giant star whose brightness changes so much that it disappears from naked-eye view for months at a time.',
    },
  },
  // ── Chamäleon ──
  {
    con: 'Cha',
    culture: 'origin',
    de: {
      title: 'Ein Chamäleon am Südpol',
      text: 'Das Chamäleon gehört zu den zwölf Sternbildern, die Keyser und de Houtman auf ihrer Fahrt nach Ostindien um 1596 am Südhimmel notierten und die Plancius 1598 veröffentlichte. Die Seefahrer benannten viele Bilder nach exotischen Tieren, die sie unterwegs kennenlernten. Das kleine, blasse Chamäleon liegt nahe dem südlichen Himmelspol.',
    },
    en: {
      title: 'A Chameleon Near the Pole',
      text: 'Chamaeleon is one of the twelve constellations that Keyser and de Houtman recorded in the southern sky on their voyage to the East Indies around 1596, and that Plancius published in 1598. The sailors named many figures after exotic animals they encountered on the way. This small, faint chameleon lies near the south celestial pole.',
    },
  },
  // ── Zirkel ──
  {
    con: 'Cir',
    culture: 'origin',
    de: {
      title: 'Der Zirkel',
      text: 'Lacaille führte den Zirkel 1756 ein – ein Werkzeug, mit dem Landvermesser und Kartenzeichner Abstände abgreifen und Kreise ziehen. Gleich daneben platzierte er Winkelmaß und Lineal: ein ganzer Zeichentisch am Himmel. Das kleine Sternbild liegt direkt neben dem hellen Alpha Centauri.',
    },
    en: {
      title: 'The Drawing Compass',
      text: 'Lacaille introduced Circinus in 1756 – a tool that surveyors and mapmakers use to measure distances and draw circles. Right next to it he placed a set square and ruler: a whole drawing desk in the sky. This small constellation lies right beside the bright star Alpha Centauri.',
    },
  },
  // ── Taube ──
  {
    con: 'Col',
    culture: 'origin',
    de: {
      title: 'Noahs Taube',
      text: 'Die Taube stammt von Petrus Plancius, der sie 1592 aus Sternen südlich des Hasen formte. Sie stellt die Taube aus der biblischen Sintflut-Geschichte dar, die mit einem Ölzweig zu Noahs Arche zurückkehrte – das Zeichen, dass das Wasser zurückging. Ihr hellster Stern heißt Phact.',
    },
    en: {
      title: 'Noah’s Dove',
      text: 'Columba was created by Petrus Plancius in 1592 from stars south of Lepus, the hare. It shows the dove from the biblical flood story that returned to Noah’s ark with an olive branch – the sign that the waters were going down. Its brightest star is called Phact.',
    },
  },
  // ── Haar der Berenike ──
  {
    con: 'Com',
    culture: 'greek',
    de: {
      title: 'Das geopferte Haar der Königin',
      text: 'Königin Berenike II. von Ägypten gelobte, ihr prächtiges Haar zu opfern, wenn ihr Mann Ptolemaios III. heil aus dem Krieg zurückkehrte. Er kam zurück, sie schnitt das Haar ab – doch am nächsten Tag war es aus dem Tempel verschwunden. Der Hofastronom Konon erklärte, die Götter hätten es als Sterne an den Himmel gesetzt.',
    },
    en: {
      title: 'The Queen’s Sacrificed Hair',
      text: 'Queen Berenice II of Egypt vowed to sacrifice her splendid hair if her husband, Ptolemy III, came home safely from war. He returned and she cut it off – but the next day it had vanished from the temple. The court astronomer Conon declared that the gods had placed it in the sky as stars.',
    },
  },
  {
    con: 'Com',
    culture: 'origin',
    de: {
      title: 'Vom Löwenschwanz zum eigenen Bild',
      text: 'Ptolemäus zählte diese Sterne noch zum Löwen, als Quaste an dessen Schwanz. Als eigenes Sternbild erschien das Haar der Berenike 1536 auf einem Himmelsglobus von Caspar Vopel; um 1600 nahm Tycho Brahe es in seinen Sternkatalog auf. Mit bloßem Auge sieht man einen lockeren Sternhaufen, im Teleskop tausende ferne Galaxien.',
    },
    en: {
      title: 'From Lion’s Tail to Constellation',
      text: 'Ptolemy still counted these stars as part of Leo, the tuft at the end of its tail. Coma Berenices first appeared as a constellation of its own on a celestial globe by Caspar Vopel in 1536, and around 1600 Tycho Brahe included it in his star catalog. The naked eye sees a loose star cluster; telescopes reveal thousands of distant galaxies.',
    },
  },
  // ── Südliche Krone ──
  {
    con: 'CrA',
    culture: 'greek',
    de: {
      title: 'Der Kranz im Süden',
      text: 'Die Südliche Krone ist ein hübscher Bogen aus schwachen Sternen. Die Griechen sahen darin keinen Königsreif, sondern einen Kranz aus Blättern, wie ihn Sieger trugen. Manche Erzählungen verbinden ihn mit dem Weingott Dionysos. Auf alten Karten liegt er dem Schützen zu Füßen – als wäre er ihm vom Kopf gefallen.',
    },
    en: {
      title: 'The Southern Wreath',
      text: 'Corona Australis is a pretty arc of faint stars. The Greeks saw it not as a royal crown but as a wreath of leaves, like those worn by victors. Some tales link it to Dionysus, the god of wine. On old star maps it lies at the feet of Sagittarius – as if it had fallen from the archer’s head.',
    },
  },
  // ── Nördliche Krone ──
  {
    con: 'CrB',
    culture: 'greek',
    de: {
      title: 'Ariadnes Hochzeitskrone',
      text: 'Prinzessin Ariadne half Theseus mit einem Faden aus dem Labyrinth des Minotaurus – doch er ließ sie auf der Insel Naxos zurück. Dort fand sie der Gott Dionysos und heiratete sie. Ihre Hochzeitskrone warf er an den Himmel. Der hellste Stern des Halbkreises heißt Gemma, „Edelstein“, oder Alphecca.',
    },
    en: {
      title: 'Ariadne’s Wedding Crown',
      text: 'Princess Ariadne helped Theseus escape the Minotaur’s labyrinth with a thread – but he abandoned her on the island of Naxos. There the god Dionysus found her and married her, and he tossed her wedding crown into the sky. The brightest star of the semicircle is called Gemma, “jewel”, or Alphecca.',
    },
  },
  // ── Rabe ──
  {
    con: 'Crv',
    culture: 'greek',
    de: {
      title: 'Der Rabe, der log',
      text: 'Apollon schickte seinen Raben mit einem Becher los, um Wasser zu holen. Unterwegs wartete der Vogel lieber, bis Feigen reif wurden, und naschte. Zurück kam er mit einer Wasserschlange und log, sie habe die Quelle blockiert. Apollon durchschaute ihn und setzte alle drei an den Himmel – der Rabe bleibt für immer durstig.',
    },
    en: {
      title: 'The Raven Who Lied',
      text: 'Apollo sent his raven with a cup to fetch water. On the way the bird stopped to wait for some figs to ripen and ate them. It returned with a water snake, lying that the snake had blocked the spring. Apollo saw through the lie and placed all three in the sky – where the raven stays thirsty forever.',
    },
  },
  // ── Becher ──
  {
    con: 'Crt',
    culture: 'greek',
    de: {
      title: 'Der unerreichbare Becher',
      text: 'Der Becher gehört zur Geschichte vom lügenden Raben des Apollon. Am Himmel steht er dicht neben dem Raben auf dem Rücken der Wasserschlange – nah, aber unerreichbar. So muss der Vogel zur Strafe durstig bleiben. Mit etwas Fantasie erkennt man einen Kelch mit Fuß, doch seine Sterne sind recht lichtschwach.',
    },
    en: {
      title: 'The Cup Out of Reach',
      text: 'The cup belongs to the story of Apollo’s lying raven. In the sky it sits close to the raven on the back of the water snake – near, but out of reach, so the bird must stay thirsty as punishment. With a little imagination you can see a goblet with a stem, but its stars are fairly faint.',
    },
  },
  // ── Kreuz des Südens ──
  {
    con: 'Cru',
    culture: 'origin',
    de: {
      title: 'Ein Kreuz aus dem Zentauren',
      text: 'Die alten Griechen konnten diese Sterne noch sehen und zählten sie zum Zentauren. Weil die Erdachse langsam taumelt, verschwanden sie später vom europäischen Himmel. Seefahrer der Entdeckerzeit beschrieben das Kreuz neu, und Petrus Plancius zeichnete es Ende des 16. Jahrhunderts als eigenes Sternbild. Es ist das kleinste der 88.',
    },
    en: {
      title: 'A Cross Taken from the Centaur',
      text: 'The ancient Greeks could still see these stars and counted them as part of Centaurus. Because Earth’s axis slowly wobbles, they later sank out of view from Europe. Sailors of the age of exploration described the cross anew, and Petrus Plancius drew it as a separate constellation in the late 1500s. It is the smallest of all 88.',
    },
  },
  {
    con: 'Cru',
    culture: 'aboriginal',
    de: {
      title: 'Der Emu in der Milchstraße',
      text: 'Viele Aborigines-Gruppen sehen ein Sternbild aus Dunkelheit: den Emu am Himmel. Sein Kopf ist der Kohlensack, eine dunkle Wolke neben dem Kreuz des Südens; Hals und Körper bilden Staubbänder der Milchstraße bis zum Skorpion. Wie der Emu im Jahreslauf am Abendhimmel steht, zeigt an, wann Emus brüten und man Eier sammeln kann.',
    },
    en: {
      title: 'The Emu in the Milky Way',
      text: 'Many Aboriginal groups see a constellation made of darkness: the Emu in the Sky. Its head is the Coalsack, a dark cloud beside the Southern Cross, and its neck and body are dusty lanes of the Milky Way stretching toward Scorpius. The emu’s position in the evening sky through the year shows when emus nest and their eggs can be gathered.',
    },
  },
  {
    con: 'Cru',
    culture: 'african',
    de: {
      title: 'Zwei Giraffen',
      text: 'Für die Tswana im südlichen Afrika bilden die vier hellen Sterne des Kreuzes zwei Giraffen, Dithutlwa genannt: Alpha und Beta Crucis sind das Männchen, Gamma und Delta Crucis das Weibchen. Die hohen Tiere ziehen gemeinsam über den Südhimmel.',
    },
    en: {
      title: 'Two Giraffes',
      text: 'For the Tswana people of southern Africa, the four bright stars of the cross are two giraffes, called Dithutlwa: Alpha and Beta Crucis are the male, Gamma and Delta Crucis the female. The tall animals travel together across the southern sky.',
    },
  },
  // ── Schwan ──
  {
    con: 'Cyg',
    culture: 'greek',
    de: {
      title: 'Zeus als Schwan',
      text: 'Um die Königin Leda von Sparta zu umwerben, verwandelte sich Zeus in einen prächtigen Schwan. Seitdem fliegt der Schwan mit ausgebreiteten Flügeln die Milchstraße entlang. Deneb, „der Schwanz“, ist ein gewaltiger, weit entfernter Riesenstern. Am Schnabel sitzt Albireo, ein Doppelstern in Gold und Blau. Die Hauptsterne bilden das „Kreuz des Nordens“.',
    },
    en: {
      title: 'Zeus as a Swan',
      text: 'To win the heart of Queen Leda of Sparta, Zeus turned himself into a magnificent swan. Ever since, the swan has flown with outstretched wings along the Milky Way. Deneb, “the tail”, is a huge and very distant giant star. At the beak sits Albireo, a gold-and-blue double star. The main stars also form the “Northern Cross”.',
    },
  },
  // ── Delphin ──
  {
    con: 'Del',
    culture: 'greek',
    de: {
      title: 'Der Delfin als Brautwerber',
      text: 'Poseidon wollte die Meeresnymphe Amphitrite heiraten, doch sie versteckte sich. Ein Delfin spürte sie auf und überzeugte sie, Poseidons Frau zu werden. Zum Dank kam er an den Himmel. Zwei seiner Sterne heißen Sualocin und Rotanev – rückwärts gelesen „Nicolaus Venator“, der latinisierte Name eines Astronomen aus Palermo.',
    },
    en: {
      title: 'The Dolphin Matchmaker',
      text: 'Poseidon wanted to marry the sea nymph Amphitrite, but she hid from him. A dolphin found her and persuaded her to become Poseidon’s wife, and as thanks it was placed in the sky. Two of its stars are called Sualocin and Rotanev – read them backwards to get “Nicolaus Venator”, the Latin name of an astronomer from Palermo.',
    },
  },
  // ── Goldfisch ──
  {
    con: 'Dor',
    culture: 'origin',
    de: {
      title: 'Ein Fisch mit einer Galaxie',
      text: 'Keyser und de Houtman führten das Sternbild um 1596 ein, Plancius veröffentlichte es 1598. Gemeint ist kein Goldfisch, sondern die Goldmakrele (Dorado), ein schneller Raubfisch tropischer Meere. In ihr liegt der größte Teil der Großen Magellanschen Wolke, einer Nachbargalaxie, samt Tarantelnebel. 1987 explodierte dort eine Supernova.',
    },
    en: {
      title: 'A Fish with a Galaxy',
      text: 'Keyser and de Houtman introduced this constellation around 1596, and Plancius published it in 1598. It shows the dorado, or mahi-mahi, a fast hunting fish of tropical seas. It contains most of the Large Magellanic Cloud, a neighboring galaxy, including the Tarantula Nebula. In 1987 a supernova exploded there.',
    },
  },
  // ── Drache ──
  {
    con: 'Dra',
    culture: 'greek',
    de: {
      title: 'Ladon, der Wächter der goldenen Äpfel',
      text: 'Der Drache gilt als Ladon, der im Garten der Hesperiden die goldenen Äpfel der Göttin Hera bewachte. Herakles musste die Äpfel als eine seiner zwölf Aufgaben holen und besiegte dabei den Drachen. Sein Stern Thuban war vor knapp 5000 Jahren der Polarstern – ungefähr zu der Zeit, als in Ägypten die ersten Pyramiden entstanden.',
    },
    en: {
      title: 'Ladon, Guardian of the Golden Apples',
      text: 'Draco is said to be Ladon, the dragon that guarded Hera’s golden apples in the garden of the Hesperides. Heracles had to fetch the apples as one of his twelve labors and overcame the dragon. Its star Thuban was the pole star almost 5,000 years ago – roughly when the first pyramids were built in Egypt.',
    },
  },
  // ── Füllen ──
  {
    con: 'Equ',
    culture: 'greek',
    de: {
      title: 'Das kleine Pferd',
      text: 'Das Füllen ist nach dem Kreuz des Südens das kleinste Sternbild. Schon Ptolemäus führte es auf, doch eine feste Sage gibt es kaum. Manche sahen darin Keleris, den Bruder oder Sohn des Pegasus, den der Götterbote Hermes dem Helden Kastor schenkte. Am Himmel schaut nur sein Kopf neben dem Pegasus hervor.',
    },
    en: {
      title: 'The Little Horse',
      text: 'Equuleus is the second-smallest constellation, after Crux. Ptolemy already listed it, but there is hardly a fixed legend about it. Some saw it as Celeris, the brother or offspring of Pegasus, whom the messenger god Hermes gave to the hero Castor. In the sky, only its head peeks out beside Pegasus.',
    },
  },
  // ── Eridanus ──
  {
    con: 'Eri',
    culture: 'greek',
    de: {
      title: 'Der Fluss des Phaethon',
      text: 'Phaethon, Sohn des Sonnengottes Helios, durfte einen Tag lang den Sonnenwagen lenken. Doch die Pferde gingen durch, und die Erde drohte zu verbrennen. Zeus stoppte ihn mit einem Blitz, und Phaethon stürzte in den Fluss Eridanus. Der lange Sternenfluss windet sich weit in den Süden bis zu Achernar, dem „Ende des Flusses“.',
    },
    en: {
      title: 'Phaethon’s River',
      text: 'Phaethon, son of the sun god Helios, was allowed to drive the chariot of the Sun for a day. But the horses bolted and the Earth threatened to burn. Zeus stopped him with a thunderbolt, and Phaethon fell into the river Eridanus. The long river of stars winds far south to Achernar, “the end of the river”.',
    },
  },
  // ── Chemischer Ofen ──
  {
    con: 'For',
    culture: 'origin',
    de: {
      title: 'Ein Ofen für Chemiker',
      text: 'Lacaille nannte dieses Sternbild 1756 „chemischer Ofen“ – ein Gerät, mit dem man im Labor Stoffe erhitzte und destillierte. Die Sterne sind unscheinbar, doch der Himmelsausschnitt ist berühmt: Hier blickte das Hubble-Weltraumteleskop für sein „Ultra Deep Field“ tief ins All und fand auf winzigem Raum rund 10.000 Galaxien.',
    },
    en: {
      title: 'A Furnace for Chemists',
      text: 'Lacaille named this constellation the “chemical furnace” in 1756 – a lab device for heating and distilling substances. Its stars are dull, but this patch of sky is famous: here the Hubble Space Telescope peered deep into space for its “Ultra Deep Field” and found about 10,000 galaxies in a tiny area.',
    },
  },
  // ── Zwillinge ──
  {
    con: 'Gem',
    culture: 'greek',
    de: {
      title: 'Kastor und Pollux',
      text: 'Die Zwillinge Kastor und Pollux waren unzertrennlich. Pollux war ein Sohn des Zeus und unsterblich, Kastor dagegen sterblich. Als Kastor im Kampf fiel, bat Pollux darum, seine Unsterblichkeit mit dem Bruder zu teilen. Seitdem verbringen die beiden ihre Tage abwechselnd im Olymp und in der Unterwelt. Seeleute verehrten sie als Beschützer.',
    },
    en: {
      title: 'Castor and Pollux',
      text: 'The twins Castor and Pollux were inseparable. Pollux was a son of Zeus and immortal, while Castor was mortal. When Castor fell in battle, Pollux asked to share his immortality with his brother. Since then the two spend their days taking turns on Mount Olympus and in the underworld. Sailors honored them as protectors.',
    },
  },
  {
    con: 'Gem',
    culture: 'babylonian',
    de: {
      title: 'Die Großen Zwillinge',
      text: 'Schon die Babylonier sahen hier „die Großen Zwillinge“, ein göttliches Brüderpaar, das mit der Unterwelt verbunden war. Ihre Sternlisten auf Tontafeln, die man nach ihren ersten Worten MUL.APIN nennt, beschreiben viele Sternbilder auf der Bahn des Mondes. Die Griechen übernahmen einige davon und erzählten neue Geschichten dazu.',
    },
    en: {
      title: 'The Great Twins',
      text: 'The Babylonians already saw “the Great Twins” here, a pair of divine brothers linked to the underworld. Their star lists on clay tablets, called MUL.APIN after their opening words, describe many constellations along the path of the Moon. The Greeks adopted several of them and told new stories about them.',
    },
  },
  {
    con: 'Gem',
    culture: 'norse',
    de: {
      title: 'Die Augen des Riesen Thiazi',
      text: 'Eine nordische Sage erzählt vom Riesen Thiazi, den die Götter töteten. Als Wiedergutmachung für seine Tochter Skadi warf Odin die Augen des Riesen an den Himmel, wo sie als Sterne leuchten. Welche Sterne gemeint sind, verrät die Überlieferung nicht. Manche Forscher vermuten Kastor und Pollux – zwei helle Sterne dicht nebeneinander.',
    },
    en: {
      title: 'The Eyes of the Giant Thiazi',
      text: 'A Norse legend tells of the giant Thiazi, who was killed by the gods. To make amends to his daughter Skadi, Odin threw the giant’s eyes into the sky, where they shine as stars. The old texts do not say which stars they are. Some scholars suspect Castor and Pollux – two bright stars sitting close together.',
    },
  },
  // ── Kranich ──
  {
    con: 'Gru',
    culture: 'origin',
    de: {
      title: 'Der Kranich',
      text: 'Den Kranich formten Keyser und de Houtman um 1596 aus Sternen, die arabische Astronomen noch zum Südlichen Fisch gezählt hatten; Plancius veröffentlichte ihn 1598. Sein hellster Stern Alnair heißt „der Helle“. Langer Hals und ausgebreitete Flügel sind gut zu erkennen – allerdings nur von weit im Süden aus.',
    },
    en: {
      title: 'The Crane',
      text: 'Keyser and de Houtman formed the crane around 1596 from stars that Arab astronomers had counted as part of the Southern Fish; Plancius published it in 1598. Its brightest star, Alnair, means “the bright one”. The long neck and spread wings are easy to make out – but only from far enough south.',
    },
  },
  // ── Herkules ──
  {
    con: 'Her',
    culture: 'greek',
    de: {
      title: 'Der kniende Held',
      text: 'Herakles, Sohn des Zeus, war der stärkste aller Helden und bestand zwölf schwere Aufgaben. Am Himmel kniet er kopfüber und setzt einen Fuß auf den Kopf des Drachen. Die Griechen nannten die Figur zunächst nur „den Knienden“. In ihr liegt M13, ein Kugelsternhaufen aus Hunderttausenden Sternen, im Fernglas ein Nebelfleck.',
    },
    en: {
      title: 'The Kneeling Hero',
      text: 'Heracles, son of Zeus, was the strongest of all heroes and completed twelve difficult labors. In the sky he kneels upside down with one foot on the dragon’s head. The early Greeks simply called the figure “the Kneeler”. It contains M13, a globular cluster of hundreds of thousands of stars that looks like a fuzzy patch in binoculars.',
    },
  },
  // ── Pendeluhr ──
  {
    con: 'Hor',
    culture: 'origin',
    de: {
      title: 'Die Pendeluhr',
      text: 'Lacaille ehrte mit diesem Sternbild 1756 die Pendeluhr, die Christiaan Huygens rund hundert Jahre zuvor erfunden hatte. Genaue Uhren waren für Astronomen unverzichtbar: Mit ihnen bestimmte man, wann ein Stern den Meridian überquerte, und konnte so seine Position messen. Das Sternbild ist lang, schmal und lichtschwach.',
    },
    en: {
      title: 'The Pendulum Clock',
      text: 'With this constellation, Lacaille honored the pendulum clock in 1756, invented by Christiaan Huygens about a hundred years earlier. Accurate clocks were essential to astronomers: they timed exactly when a star crossed the meridian and so measured its position. The constellation is long, narrow and faint.',
    },
  },
  // ── Wasserschlange ──
  {
    con: 'Hya',
    culture: 'greek',
    de: {
      title: 'Die Wasserschlange',
      text: 'Die Wasserschlange ist das größte aller 88 Sternbilder – so lang, dass es mehrere Stunden dauert, bis sie ganz aufgegangen ist. Oft sieht man in ihr die vielköpfige Hydra, die Herakles bezwang: Für jeden abgeschlagenen Kopf wuchsen zwei nach. Ihr hellster Stern Alphard heißt „der Einsame“, weil er in einer sternarmen Gegend steht.',
    },
    en: {
      title: 'The Water Snake',
      text: 'Hydra is the largest of all 88 constellations – so long that it takes several hours to rise completely. It is often seen as the many-headed Hydra that Heracles defeated: for every head he cut off, two grew back. Its brightest star, Alphard, means “the solitary one” because it stands in a region with few bright stars.',
    },
  },
  // ── Kleine Wasserschlange ──
  {
    con: 'Hyi',
    culture: 'origin',
    de: {
      title: 'Die kleine Wasserschlange',
      text: 'Die Kleine Wasserschlange stammt von Keyser und de Houtman und erschien 1598 auf dem Himmelsglobus von Plancius. Sie ist das südliche Gegenstück zur großen Hydra. Sie schlängelt sich zwischen den beiden Magellanschen Wolken hindurch, und ihr Kopf zeigt fast zum südlichen Himmelspol.',
    },
    en: {
      title: 'The Lesser Water Snake',
      text: 'Hydrus comes from Keyser and de Houtman and appeared on Plancius’s celestial globe in 1598. It is the southern counterpart of the great Hydra. It winds between the two Magellanic Clouds, and its head points almost to the south celestial pole.',
    },
  },
  // ── Inder ──
  {
    con: 'Ind',
    culture: 'origin',
    de: {
      title: 'Der Inder',
      text: 'Keyser und de Houtman nannten dieses Bild um 1596 einfach „den Inder“; Plancius veröffentlichte es 1598. Gezeigt wird ein Ureinwohner mit Pfeilen und Speer, wie ihn die Seefahrer auf ihren Reisen trafen – ob aus Ostindien oder Amerika, bleibt offen. Epsilon Indi ist einer unserer nächsten Nachbarsterne, nur 12 Lichtjahre entfernt.',
    },
    en: {
      title: 'The Indian',
      text: 'Keyser and de Houtman simply called this figure “the Indian” around 1596; Plancius published it in 1598. It shows a native person with arrows and a spear, as the sailors met on their travels – whether from the East Indies or the Americas is unclear. Epsilon Indi is one of our closest neighboring stars, only 12 light-years away.',
    },
  },
  // ── Eidechse ──
  {
    con: 'Lac',
    culture: 'origin',
    de: {
      title: 'Die Eidechse',
      text: 'Johannes Hevelius füllte mit der Eidechse eine Lücke zwischen Schwan und Andromeda; sein Atlas erschien 1690. Die Sterne bilden eine kleine Zickzacklinie. Der vermeintliche Stern BL Lacertae entpuppte sich später als etwas ganz anderes: das helle Zentrum einer fernen Galaxie mit einem gewaltigen Schwarzen Loch.',
    },
    en: {
      title: 'The Lizard',
      text: 'Johannes Hevelius filled a gap between Cygnus and Andromeda with the lizard; his atlas appeared in 1690. Its stars form a small zigzag line. The supposed star BL Lacertae later turned out to be something else entirely: the bright core of a distant galaxy powered by a giant black hole.',
    },
  },
  // ── Löwe ──
  {
    con: 'Leo',
    culture: 'greek',
    de: {
      title: 'Der Nemeische Löwe',
      text: 'Der Löwe von Nemea hatte ein Fell, das keine Waffe durchdringen konnte. Als erste seiner zwölf Aufgaben erwürgte Herakles ihn mit bloßen Händen und trug das Fell fortan als Rüstung. Den Kopf des Löwen bildet eine „Sichel“ aus Sternen, die wie ein gespiegeltes Fragezeichen aussieht; an ihrem Fuß leuchtet Regulus, „der kleine König“.',
    },
    en: {
      title: 'The Nemean Lion',
      text: 'The lion of Nemea had a hide that no weapon could pierce. As the first of his twelve labors, Heracles strangled it with his bare hands and wore its skin as armor from then on. The lion’s head is a “sickle” of stars shaped like a backwards question mark, and at its base shines Regulus, “the little king”.',
    },
  },
  {
    con: 'Leo',
    culture: 'babylonian',
    de: {
      title: 'Der Tierkreis kommt aus Babylon',
      text: 'Den „Großen Löwen“ kannten schon die Babylonier. Ihre Astronomen beobachteten genau, durch welche Sternbilder Sonne, Mond und Planeten wandern. Um das 5. Jahrhundert v. Chr. teilten sie diese Bahn in zwölf gleich große Abschnitte von je 30 Grad ein – der Ursprung unseres Tierkreises mit seinen zwölf Zeichen.',
    },
    en: {
      title: 'The Zodiac Comes from Babylon',
      text: 'The Babylonians already knew “the Great Lion”. Their astronomers carefully tracked which constellations the Sun, Moon and planets passed through. Around the 5th century BC they divided this path into twelve equal sections of 30 degrees each – the origin of our zodiac with its twelve signs.',
    },
  },
  // ── Kleiner Löwe ──
  {
    con: 'LMi',
    culture: 'origin',
    de: {
      title: 'Der Kleine Löwe',
      text: 'Hevelius setzte den Kleinen Löwen zwischen den Großen Bären und den Löwen; sein Atlas erschien 1690. Das Sternbild besteht aus wenigen, schwachen Sternen. Kurios: Es hat keinen Stern mit der Bezeichnung Alpha – sein hellster Stern trägt den Namen Praecipua.',
    },
    en: {
      title: 'The Lesser Lion',
      text: 'Hevelius placed Leo Minor between Ursa Major and Leo; his atlas appeared in 1690. The constellation has only a few faint stars. Oddly, none of them is labeled Alpha – its brightest star is named Praecipua.',
    },
  },
  // ── Hase ──
  {
    con: 'Lep',
    culture: 'greek',
    de: {
      title: 'Der Hase zu Füßen des Jägers',
      text: 'Der Hase hockt zu Füßen des Orion, und der Große Hund ist ihm dicht auf den Fersen. Eine Sage erzählt, jemand habe ein trächtiges Häschen auf die Insel Leros gebracht. Bald gab es so viele Hasen, dass sie alle Felder kahlfraßen. Der Hase am Himmel soll an diese Lehre erinnern: Zu viel des Guten kann schaden.',
    },
    en: {
      title: 'The Hare at the Hunter’s Feet',
      text: 'The hare crouches at Orion’s feet, with the Great Dog close on its heels. One tale says someone brought a pregnant hare to the island of Leros. Soon there were so many hares that they ate all the crops. The hare in the sky is meant as a reminder: you can have too much of a good thing.',
    },
  },
  // ── Waage ──
  {
    con: 'Lib',
    culture: 'roman',
    de: {
      title: 'Die Waage der Gerechtigkeit',
      text: 'Die Griechen sahen in diesen Sternen die Scheren des Skorpions. Erst die Römer machten daraus eine eigene Waage – passend zur benachbarten Jungfrau, die oft als Göttin der Gerechtigkeit gilt. Die alten Namen leben weiter: Zuben Elgenubi und Zuben Eschamali bedeuten auf Arabisch „südliche“ und „nördliche Schere“.',
    },
    en: {
      title: 'The Scales of Justice',
      text: 'The Greeks saw these stars as the claws of the scorpion. Only the Romans turned them into a separate set of scales – fitting next to Virgo, who is often seen as the goddess of justice. The old names live on: Zubenelgenubi and Zubeneschamali are Arabic for “southern claw” and “northern claw”.',
    },
  },
  // ── Wolf ──
  {
    con: 'Lup',
    culture: 'greek',
    de: {
      title: 'Das wilde Tier',
      text: 'Für die Griechen war es einfach „das Tier“: ein wildes Geschöpf, das der Zentaur auf einem Speer zum Altar trägt – vielleicht als Opfergabe. Erst später wurde daraus ein Wolf. Im Jahr 1006 leuchtete in diesem Sternbild die hellste Supernova auf, die je beobachtet wurde; sie soll sogar am Tag zu sehen gewesen sein.',
    },
    en: {
      title: 'The Wild Beast',
      text: 'To the Greeks it was simply “the beast”: a wild creature that the centaur carries on a spear toward the altar – perhaps as an offering. Only later did it become a wolf. In the year 1006, the brightest supernova ever recorded flared up in this constellation; it is said to have been visible even in daylight.',
    },
  },
  // ── Luchs ──
  {
    con: 'Lyn',
    culture: 'origin',
    de: {
      title: 'Nur für Luchsaugen',
      text: 'Hevelius füllte die Lücke zwischen Großem Bären und Fuhrmann mit einem Luchs; sein Atlas erschien 1690. Den Namen wählte er mit einem Augenzwinkern: Wer diese schwachen Sterne erkennen will, braucht Augen so scharf wie ein Luchs.',
    },
    en: {
      title: 'Only for Lynx Eyes',
      text: 'Hevelius filled the gap between Ursa Major and Auriga with a lynx; his atlas appeared in 1690. He chose the name with a wink: anyone who wants to spot these faint stars needs eyes as sharp as a lynx.',
    },
  },
  // ── Leier ──
  {
    con: 'Lyr',
    culture: 'greek',
    de: {
      title: 'Die Leier des Orpheus',
      text: 'Hermes baute die erste Leier aus einem Schildkrötenpanzer. Später gehörte sie Orpheus, dessen Musik sogar Steine und den Herrscher der Unterwelt rührte. Nach seinem Tod setzten die Musen die Leier an den Himmel. Ihr Hauptstern Wega zählt zu den hellsten Sternen; in rund 12.000 Jahren wird sie unser Polarstern sein.',
    },
    en: {
      title: 'The Lyre of Orpheus',
      text: 'Hermes built the first lyre from a tortoise shell. Later it belonged to Orpheus, whose music moved even stones and the ruler of the underworld. After his death the Muses placed the lyre in the sky. Its main star, Vega, is one of the brightest stars; in about 12,000 years it will be our pole star.',
    },
  },
  {
    con: 'Lyr',
    culture: 'chinese',
    de: {
      title: 'Die Weberin und der Kuhhirte',
      text: 'Die Himmelsweberin Zhinü (Wega) verliebte sich in den Kuhhirten Niulang (Atair) – doch eine Göttin trennte die beiden durch den Silberfluss, die Milchstraße. Nur einmal im Jahr, am 7. Tag des 7. Mondmonats, bilden Elstern eine Brücke, über die sich das Paar treffen kann. Dieser Tag wird in China als Qixi-Fest gefeiert.',
    },
    en: {
      title: 'The Weaver Girl and the Cowherd',
      text: 'The heavenly weaver girl Zhinü (Vega) fell in love with the cowherd Niulang (Altair) – but a goddess separated them with the Silver River, the Milky Way. Only once a year, on the 7th day of the 7th lunar month, magpies form a bridge so the couple can meet. China celebrates this day as the Qixi Festival.',
    },
  },
  // ── Tafelberg ──
  {
    con: 'Men',
    culture: 'origin',
    de: {
      title: 'Der Tafelberg',
      text: 'Lacaille benannte dieses Sternbild 1756 nach dem Tafelberg bei Kapstadt, an dessen Fuß er den Südhimmel vermaß – das einzige Sternbild, das nach einem Ort auf der Erde benannt ist. Ein Teil der Großen Magellanschen Wolke ragt hinein, so wie die Wolkendecke, die oft wie ein „Tischtuch“ auf dem echten Tafelberg liegt.',
    },
    en: {
      title: 'Table Mountain',
      text: 'Lacaille named this constellation in 1756 after Table Mountain above Cape Town, where he mapped the southern sky – the only constellation named after a place on Earth. Part of the Large Magellanic Cloud reaches into it, just like the layer of cloud that often lies like a “tablecloth” on the real Table Mountain.',
    },
  },
  // ── Mikroskop ──
  {
    con: 'Mic',
    culture: 'origin',
    de: {
      title: 'Das Mikroskop',
      text: 'Mit dem Mikroskop ehrte Lacaille 1756 ein Instrument, das eine winzige, bis dahin unsichtbare Welt sichtbar gemacht hatte. Am Himmel steht es zwischen Schütze und Südlichem Fisch. Seine Sterne sind so schwach, dass man sie nur unter sehr dunklem Himmel erkennt – passend für ein Gerät, mit dem man Kleines groß macht.',
    },
    en: {
      title: 'The Microscope',
      text: 'With the microscope, Lacaille honored in 1756 an instrument that had revealed a tiny, previously invisible world. In the sky it sits between Sagittarius and the Southern Fish. Its stars are so faint that you can only see them under a very dark sky – fitting for a device that makes small things look big.',
    },
  },
  // ── Einhorn ──
  {
    con: 'Mon',
    culture: 'origin',
    de: {
      title: 'Das Einhorn',
      text: 'Petrus Plancius setzte um 1613 ein Einhorn zwischen Orion und den Kleinen Hund. Seine Sterne sind schwach, doch die Milchstraße zieht hindurch, und so hat es einiges zu bieten: etwa den Rosettennebel, eine leuchtende Gaswolke in Form einer Rose, und den Weihnachtsbaum-Sternhaufen.',
    },
    en: {
      title: 'The Unicorn',
      text: 'Petrus Plancius placed a unicorn between Orion and Canis Minor around 1613. Its stars are faint, but the Milky Way runs through it, so it has plenty to offer: for example the Rosette Nebula, a glowing gas cloud shaped like a rose, and the Christmas Tree Cluster.',
    },
  },
  // ── Fliege ──
  {
    con: 'Mus',
    culture: 'origin',
    de: {
      title: 'Die Fliege',
      text: 'Die Fliege stammt von Keyser und de Houtman und erschien 1598 auf dem Himmelsglobus von Plancius. Johann Bayer nannte sie in seinem Sternatlas von 1603 „Biene“; erst später setzte sich der Name Fliege durch. Sie sitzt direkt südlich des Kreuzes des Südens.',
    },
    en: {
      title: 'The Fly',
      text: 'Musca comes from Keyser and de Houtman and appeared on Plancius’s celestial globe in 1598. Johann Bayer called it “the bee” in his 1603 star atlas; only later did the name “fly” catch on. It sits just south of the Southern Cross.',
    },
  },
  // ── Winkelmaß ──
  {
    con: 'Nor',
    culture: 'origin',
    de: {
      title: 'Winkelmaß und Lineal',
      text: 'Lacaille nannte dieses Sternbild 1756 „Winkelmaß und Lineal“ – Werkzeuge von Zimmerleuten und Kartenzeichnern. Heute heißt es kurz Norma, das Winkelmaß. Es liegt in einem sternreichen Teil der Milchstraße zwischen Skorpion und Wolf, besitzt selbst aber nur schwache Sterne.',
    },
    en: {
      title: 'Set Square and Ruler',
      text: 'Lacaille named this constellation the “set square and ruler” in 1756 – tools of carpenters and mapmakers. Today it is simply called Norma, the set square. It lies in a star-rich part of the Milky Way between Scorpius and Lupus, but has only faint stars of its own.',
    },
  },
  // ── Oktant ──
  {
    con: 'Oct',
    culture: 'origin',
    de: {
      title: 'Der Oktant am Südpol',
      text: 'Lacaille benannte dieses Sternbild 1756 nach dem Oktanten, einem damals neuen Messgerät, mit dem Seeleute die Höhe von Sternen bestimmten. Im Oktanten liegt der südliche Himmelspol. Anders als im Norden gibt es dort keinen hellen Polarstern: Sigma Octantis ist so schwach, dass man ihn mit bloßem Auge kaum sieht.',
    },
    en: {
      title: 'The Octant at the South Pole',
      text: 'Lacaille named this constellation in 1756 after the octant, a then-new instrument that sailors used to measure the height of stars. The south celestial pole lies in Octans. Unlike in the north, there is no bright pole star here: Sigma Octantis is so faint that it is barely visible to the naked eye.',
    },
  },
  // ── Schlangenträger ──
  {
    con: 'Oph',
    culture: 'greek',
    de: {
      title: 'Der Heiler mit der Schlange',
      text: 'Der Schlangenträger ist Asklepios, der Gott der Heilkunst. Er war so geschickt, dass er sogar Tote wieder lebendig machte. Das ärgerte den Herrscher der Unterwelt, und Zeus tötete Asklepios mit einem Blitz – setzte ihn aber an den Himmel. Sein Stab mit Schlange ist bis heute das Zeichen der Medizin.',
    },
    en: {
      title: 'The Healer with the Serpent',
      text: 'Ophiuchus is Asclepius, the god of medicine. He was so skilled that he could even bring the dead back to life. This angered the ruler of the underworld, so Zeus struck Asclepius down with a thunderbolt – but placed him in the sky. His staff with a serpent is still the symbol of medicine today.',
    },
  },
  // ── Orion ──
  {
    con: 'Ori',
    culture: 'greek',
    de: {
      title: 'Der Jäger und der Skorpion',
      text: 'Orion war ein riesiger Jäger, der prahlte, er könne jedes Tier der Erde erlegen. Da schickte die Erdgöttin Gaia einen Skorpion, der ihn tödlich stach. Beide kamen an den Himmel, aber auf entgegengesetzte Seiten: Geht der Skorpion auf, versinkt Orion. Seine Schulter bildet der rote Beteigeuze, sein Fuß der blauweiße Rigel.',
    },
    en: {
      title: 'The Hunter and the Scorpion',
      text: 'Orion was a giant hunter who boasted that he could kill every animal on Earth. So Gaia, the Earth goddess, sent a scorpion that stung him to death. Both were placed in the sky, but on opposite sides: when the scorpion rises, Orion sets. His shoulder is the red star Betelgeuse, his foot the blue-white Rigel.',
    },
  },
  {
    con: 'Ori',
    culture: 'egyptian',
    de: {
      title: 'Sah, der Stern des Osiris',
      text: 'Im alten Ägypten hieß das Sternbild Sah und galt als Erscheinung des Osiris, des Gottes von Tod und Wiedergeburt. Sirius, der ihm über den Himmel folgt, war seine Gefährtin Isis. In den Pyramidentexten heißt es, der verstorbene König steige zum Himmel auf und schließe sich Sah an.',
    },
    en: {
      title: 'Sah, the Star of Osiris',
      text: 'In ancient Egypt this constellation was called Sah and was seen as a form of Osiris, god of death and rebirth. Sirius, which follows it across the sky, was his companion Isis. The Pyramid Texts say that the dead king rises to the sky and joins Sah.',
    },
  },
  {
    con: 'Ori',
    culture: 'aboriginal',
    de: {
      title: 'Drei Brüder im Kanu',
      text: 'Die Yolŋu in Nordaustralien nennen das Sternbild Djulpan, „das Kanu“. Drei Brüder gingen fischen, und einer aß einen Fisch, der nach ihrem Gesetz verboten war. Die Sonnenfrau Walu schickte eine Wasserhose, die Kanu und Brüder in den Himmel hob. Die Gürtelsterne sind die Brüder, der Orionnebel der Fisch, Beteigeuze und Rigel Bug und Heck.',
    },
    en: {
      title: 'Three Brothers in a Canoe',
      text: 'The Yolŋu people of northern Australia call this constellation Djulpan, “the canoe”. Three brothers went fishing, and one ate a fish forbidden by their law. The Sun-woman Walu sent a waterspout that lifted the canoe and brothers into the sky. The belt stars are the brothers, the Orion Nebula is the fish, and Betelgeuse and Rigel are bow and stern.',
    },
  },
  {
    con: 'Ori',
    culture: 'norse',
    de: {
      title: 'Friggs Spinnrocken',
      text: 'Im alten Skandinavien sah man in den drei Gürtelsternen den Spinnrocken der Göttin Frigg, Odins Frau – manchmal auch den der Göttin Freyja. An einem Spinnrocken befestigt man die Wolle, aus der man Fäden spinnt. Frigg galt als weise Göttin, die das Schicksal aller kennt.',
    },
    en: {
      title: 'Frigg’s Distaff',
      text: 'In old Scandinavia, people saw the three belt stars as the distaff of the goddess Frigg, Odin’s wife – sometimes also of the goddess Freyja. A distaff holds the wool from which thread is spun. Frigg was seen as a wise goddess who knows the fate of everyone.',
    },
  },
  {
    con: 'Ori',
    culture: 'chinese',
    de: {
      title: 'Zwei Brüder, die sich nie begegnen',
      text: 'In China bilden die Hauptsterne des Orion das Sternbild Shen. Eine alte Geschichte erzählt von zwei Brüdern, die ständig stritten. Darum schickte man sie weit auseinander: Einer sollte Shen beobachten, der andere den roten Stern Shang, unseren Antares. Weil Orion untergeht, wenn Antares aufgeht, stehen die beiden für Menschen, die sich nie wiedersehen.',
    },
    en: {
      title: 'Two Brothers Who Never Meet',
      text: 'In China, Orion’s main stars form the constellation Shen. An old story tells of two brothers who quarreled constantly, so they were sent far apart: one to watch Shen, the other to watch the red star Shang, our Antares. Because Orion sets as Antares rises, the pair stands for people who never see each other again.',
    },
  },
  {
    con: 'Ori',
    culture: 'african',
    de: {
      title: 'Drei Zebras und ein Jäger',
      text: 'Bei den Khoikhoi im südlichen Afrika sind die Gürtelsterne drei Zebras. Ein Jäger – der Stern Aldebaran – schoss einen Pfeil nach ihnen, doch er fiel zu kurz: das Schwert des Orion. Den Pfeil holen traut er sich nicht, denn ein Löwe (Beteigeuze) wacht über die Zebras. Und ohne Beute lassen ihn seine Frauen, die Plejaden, nicht nach Hause.',
    },
    en: {
      title: 'Three Zebras and a Hunter',
      text: 'For the Khoikhoi of southern Africa, the belt stars are three zebras. A hunter – the star Aldebaran – shot an arrow at them, but it fell short: Orion’s sword. He dares not fetch it, because a lion (Betelgeuse) is watching the zebras. And his wives, the Pleiades, won’t let him come home without any game.',
    },
  },
  // ── Pfau ──
  {
    con: 'Pav',
    culture: 'origin',
    de: {
      title: 'Der Pfau',
      text: 'Den Pfau führten Keyser und de Houtman um 1596 ein, Plancius veröffentlichte ihn 1598. In der griechischen Sage war der Pfau Heras Vogel: Sie setzte die hundert Augen des Riesen Argos in seine Schwanzfedern. Der hellste Stern heißt schlicht „Peacock“ – den Namen bekam er erst in den 1930er Jahren für ein Navigationshandbuch der britischen Luftwaffe.',
    },
    en: {
      title: 'The Peacock',
      text: 'Keyser and de Houtman introduced the peacock around 1596, and Plancius published it in 1598. In Greek myth the peacock was Hera’s bird: she set the hundred eyes of the giant Argus into its tail feathers. Its brightest star is simply called “Peacock” – a name it only received in the 1930s for a Royal Air Force navigation almanac.',
    },
  },
  // ── Pegasus ──
  {
    con: 'Peg',
    culture: 'greek',
    de: {
      title: 'Das geflügelte Pferd',
      text: 'Pegasus entsprang dem Blut der Medusa, als Perseus ihr den Kopf abschlug. Der Held Bellerophon ritt auf ihm gegen das Feuer speiende Ungeheuer Chimära. Als er übermütig zum Olymp fliegen wollte, warf Pegasus ihn ab und flog allein zu den Göttern. Vier helle Sterne bilden das große Herbstviereck – den Rumpf des Pferdes.',
    },
    en: {
      title: 'The Winged Horse',
      text: 'Pegasus sprang from the blood of Medusa when Perseus cut off her head. The hero Bellerophon rode him into battle against the fire-breathing monster Chimera. When Bellerophon arrogantly tried to fly up to Olympus, Pegasus threw him off and flew on alone to the gods. Four bright stars form the Great Square – the horse’s body.',
    },
  },
  // ── Perseus ──
  {
    con: 'Per',
    culture: 'greek',
    de: {
      title: 'Perseus und das Medusenhaupt',
      text: 'Perseus schlug der Medusa, deren Blick zu Stein erstarren ließ, den Kopf ab und rettete auf dem Heimweg Andromeda. Am Himmel hält er das Haupt der Medusa. Dort blinzelt Algol, der „Dämonenstern“: Alle 2,9 Tage wird er dunkler, weil ihn ein Begleitstern teilweise verdeckt. Im August kommen aus dieser Richtung die Perseiden-Sternschnuppen.',
    },
    en: {
      title: 'Perseus and Medusa’s Head',
      text: 'Perseus cut off the head of Medusa, whose gaze turned people to stone, and rescued Andromeda on his way home. In the sky he holds Medusa’s head. There winks Algol, the “demon star”: every 2.9 days it dims because a companion star partly blocks it. In August, the Perseid meteors seem to come from this direction.',
    },
  },
  // ── Phoenix ──
  {
    con: 'Phe',
    culture: 'origin',
    de: {
      title: 'Der Vogel aus der Asche',
      text: 'Den Phönix führten Keyser und de Houtman um 1596 ein; Plancius veröffentlichte ihn 1598. Er stellt den sagenhaften Vogel dar, der verbrennt und aus seiner eigenen Asche neu geboren wird – ein uraltes Bild für Wiedergeburt. Sein hellster Stern Ankaa trägt den arabischen Namen eines Sagenvogels.',
    },
    en: {
      title: 'The Bird from the Ashes',
      text: 'Keyser and de Houtman introduced the phoenix around 1596; Plancius published it in 1598. It shows the legendary bird that burns up and is reborn from its own ashes – an ancient symbol of rebirth. Its brightest star, Ankaa, bears the Arabic name of a mythical bird.',
    },
  },
  // ── Maler ──
  {
    con: 'Pic',
    culture: 'origin',
    de: {
      title: 'Die Staffelei des Malers',
      text: 'Lacaille nannte dieses Sternbild 1756 „Staffelei und Palette“, heute heißt es einfach „der Maler“. Es liegt neben dem hellen Canopus. Berühmt ist Beta Pictoris: Um diesen jungen Stern kreist eine Scheibe aus Staub und Gestein, in der Planeten entstanden sind – fast wie ein Blick in die Kindheit unseres Sonnensystems.',
    },
    en: {
      title: 'The Painter’s Easel',
      text: 'Lacaille named this constellation the “easel and palette” in 1756; today it is simply “the painter”. It lies next to bright Canopus. Beta Pictoris is famous: this young star is circled by a disk of dust and rock in which planets have formed – almost like a glimpse into the childhood of our own solar system.',
    },
  },
  // ── Fische ──
  {
    con: 'Psc',
    culture: 'greek',
    de: {
      title: 'Zwei Fische an einem Band',
      text: 'Als das Ungeheuer Typhon angriff, flohen die Liebesgöttin Aphrodite und ihr Sohn Eros in einen Fluss und verwandelten sich in Fische. Damit sie sich nicht verloren, banden sie sich mit einem Band aneinander. Am Himmel sind beide durch eine Sternenschnur verbunden. Heute steht die Sonne zu Frühlingsbeginn in den Fischen.',
    },
    en: {
      title: 'Two Fish Tied Together',
      text: 'When the monster Typhon attacked, Aphrodite, goddess of love, and her son Eros fled into a river and turned into fish. So they would not lose each other, they tied themselves together with a cord. In the sky the two fish are joined by a string of stars. Today the Sun stands in Pisces at the start of spring.',
    },
  },
  // ── Südlicher Fisch ──
  {
    con: 'PsA',
    culture: 'greek',
    de: {
      title: 'Der Fisch, der das Wasser trinkt',
      text: 'Der Südliche Fisch trinkt das Wasser, das der Wassermann aus seinem Krug gießt. Die Griechen hielten ihn für den Vater der beiden Fische im Tierkreis. Sein Hauptstern Fomalhaut, „Maul des Fisches“, ist ein heller, einsamer Stern am Herbsthimmel, der bei uns nur knapp über den Horizont steigt.',
    },
    en: {
      title: 'The Fish That Drinks the Water',
      text: 'The Southern Fish drinks the water that Aquarius pours from his jar. The Greeks considered it the parent of the two fish of the zodiac. Its main star, Fomalhaut, “mouth of the fish”, is a bright, lonely star of the autumn sky that rises only a little above the horizon as seen from Central Europe.',
    },
  },
  // ── Achterdeck ──
  {
    con: 'Pup',
    culture: 'greek',
    de: {
      title: 'Das Heck der Argo',
      text: 'Die Argo war das berühmteste Schiff der griechischen Sagen, gebaut mit Hilfe der Göttin Athene. In ihren Bug war Holz einer heiligen Eiche eingesetzt, das sprechen konnte und die Argonauten beriet. Das Achterdeck ist ein Teil des einstigen Riesensternbilds. Sein Stern Naos – griechisch für „Schiff“ – gehört zu den heißesten Sternen, die man mit bloßem Auge sieht.',
    },
    en: {
      title: 'The Stern of the Argo',
      text: 'The Argo was the most famous ship in Greek legend, built with the help of the goddess Athena. Its prow held a piece of a sacred oak that could speak and advised the Argonauts. Puppis is one part of the former giant constellation. Its star Naos – Greek for “ship” – is one of the hottest stars visible to the naked eye.',
    },
  },
  // ── Schiffskompass ──
  {
    con: 'Pyx',
    culture: 'origin',
    de: {
      title: 'Der Schiffskompass',
      text: 'Lacaille setzte 1756 einen Schiffskompass neben die Sterne des alten Schiffs Argo – ein modernes Gerät für ein antikes Schiff. Zur Argo gehört er allerdings nicht: Die alten Griechen kannten den Magnetkompass noch gar nicht. Das kleine Sternbild besteht nur aus einer kurzen Reihe schwacher Sterne.',
    },
    en: {
      title: 'The Ship’s Compass',
      text: 'In 1756, Lacaille placed a mariner’s compass next to the stars of the ancient ship Argo – a modern instrument for an ancient vessel. It was never part of the Argo itself, though: the ancient Greeks did not yet know the magnetic compass. This small constellation is just a short line of faint stars.',
    },
  },
  // ── Netz ──
  {
    con: 'Ret',
    culture: 'origin',
    de: {
      title: 'Das Fadenkreuz',
      text: 'Mit dem Netz ehrte Lacaille 1756 sein eigenes Werkzeug: ein feines Fadengitter im Okular seines Fernrohrs. Damit maß er am Kap der Guten Hoffnung die Positionen von fast 10.000 Sternen. Das kleine Sternbild bildet eine Raute aus schwachen Sternen.',
    },
    en: {
      title: 'The Crosshairs',
      text: 'With the reticle, Lacaille honored his own tool in 1756: a fine grid of threads in the eyepiece of his telescope. With it, he measured the positions of almost 10,000 stars at the Cape of Good Hope. The small constellation forms a diamond of faint stars.',
    },
  },
  // ── Pfeil ──
  {
    con: 'Sge',
    culture: 'greek',
    de: {
      title: 'Der Pfeil des Herakles',
      text: 'Weil er den Menschen das Feuer gebracht hatte, wurde Prometheus an einen Felsen gekettet, und ein Adler fraß jeden Tag von seiner Leber. Herakles befreite ihn und erschoss den Adler mit einem Pfeil. Am Himmel fliegt der Pfeil gleich neben dem Adler. Er ist das drittkleinste der 88 Sternbilder.',
    },
    en: {
      title: 'The Arrow of Heracles',
      text: 'Because he had given fire to humans, Prometheus was chained to a rock, and every day an eagle fed on his liver. Heracles freed him and shot the eagle with an arrow. In the sky the arrow flies right next to Aquila, the eagle. It is the third-smallest of the 88 constellations.',
    },
  },
  // ── Schütze ──
  {
    con: 'Sgr',
    culture: 'greek',
    de: {
      title: 'Der Bogenschütze',
      text: 'Der Schütze ist ein Zentaur mit gespanntem Bogen, der auf Antares zielt, das Herz des Skorpions. Eine griechische Sage nennt ihn Krotos, Sohn des Hirtengottes Pan, der das Bogenschießen erfunden haben soll. Seine hellsten Sterne bilden eine „Teekanne“. In dieser Richtung liegt das Zentrum unserer Milchstraße mit einem riesigen Schwarzen Loch.',
    },
    en: {
      title: 'The Archer',
      text: 'Sagittarius is a centaur with a drawn bow, aiming at Antares, the heart of the scorpion. One Greek tale calls him Crotus, son of the shepherd god Pan, who is said to have invented archery. Its brightest stars form a “Teapot”. In this direction lies the center of our Milky Way, home to a giant black hole.',
    },
  },
  // ── Skorpion ──
  {
    con: 'Sco',
    culture: 'greek',
    de: {
      title: 'Der Skorpion, der Orion besiegte',
      text: 'Der Skorpion stach den prahlerischen Jäger Orion tödlich. Darum stehen beide auf entgegengesetzten Seiten des Himmels: Steigt der Skorpion im Osten auf, flieht Orion im Westen unter den Horizont. Das rote Herz des Skorpions ist Antares, „Gegenspieler des Ares“ – denn er ähnelt in Farbe und Helligkeit dem roten Planeten Mars.',
    },
    en: {
      title: 'The Scorpion That Defeated Orion',
      text: 'The scorpion stung the boastful hunter Orion to death. That is why the two stand on opposite sides of the sky: as the scorpion climbs in the east, Orion flees below the western horizon. The scorpion’s red heart is Antares, “rival of Ares”, because it resembles the red planet Mars in color and brightness.',
    },
  },
  {
    con: 'Sco',
    culture: 'polynesian',
    de: {
      title: 'Der Angelhaken des Maui',
      text: 'In Polynesien ist der geschwungene Skorpion der magische Angelhaken des Halbgottes Maui. Mit ihm zog Maui ganze Inseln aus dem Meer – in Neuseeland die Nordinsel, auf Hawaiʻi die Hawaii-Inseln. Danach landete der Haken am Himmel. Die Māori nennen das Sternbild Te Matau a Māui, „der Angelhaken des Maui“.',
    },
    en: {
      title: 'Maui’s Fishhook',
      text: 'In Polynesia, the curved scorpion is the magic fishhook of the demigod Maui. With it Maui pulled whole islands out of the sea – New Zealand’s North Island, or the Hawaiian Islands in Hawaiian tradition. Afterwards the hook ended up in the sky. The Māori call the constellation Te Matau a Māui, “Maui’s fishhook”.',
    },
  },
  {
    con: 'Sco',
    culture: 'chinese',
    de: {
      title: 'Das Herz des Azurblauen Drachen',
      text: 'In China gehört der Skorpion zum Azurblauen Drachen, der den Osthimmel und den Frühling verkörpert. Antares ist das „Herz“ des Drachen und hieß auch „Großes Feuer“. Wann der rote Stern in der Abenddämmerung erschien, half schon im alten China, die Jahreszeiten für Aussaat und Ernte zu bestimmen.',
    },
    en: {
      title: 'The Heart of the Azure Dragon',
      text: 'In China, Scorpius belongs to the Azure Dragon, which stands for the eastern sky and for spring. Antares is the dragon’s “Heart” and was also called the “Great Fire”. When the red star appeared at dusk helped people in ancient China time the seasons for sowing and harvest.',
    },
  },
  // ── Bildhauer ──
  {
    con: 'Scl',
    culture: 'origin',
    de: {
      title: 'Die Werkstatt des Bildhauers',
      text: 'Lacaille nannte dieses Sternbild 1756 „Werkstatt des Bildhauers“. Seine Sterne sind schwach, doch hier liegt der Südpol unserer Milchstraße: Man blickt aus der Scheibe unserer Galaxie heraus, kaum gestört von Staub, weit ins All. Darum sieht man hier viele andere Galaxien, etwa die helle Sculptor-Galaxie.',
    },
    en: {
      title: 'The Sculptor’s Workshop',
      text: 'Lacaille named this constellation the “sculptor’s workshop” in 1756. Its stars are faint, but the south pole of our Milky Way lies here: you look straight out of our galaxy’s disk, barely blocked by dust, deep into space. That is why many other galaxies can be seen here, such as the bright Sculptor Galaxy.',
    },
  },
  // ── Schild ──
  {
    con: 'Sct',
    culture: 'origin',
    de: {
      title: 'Der Schild des Königs',
      text: 'Hevelius schuf dieses Sternbild 1684 als „Schild des Sobieski“ – zu Ehren des polnischen Königs Johann III. Sobieski, der 1683 die Schlacht am Kahlenberg bei Wien gewonnen hatte. Im Schild leuchtet der Wildenten-Sternhaufen, dessen Sterne im Fernrohr wie ein fliegender Vogelschwarm wirken.',
    },
    en: {
      title: 'The King’s Shield',
      text: 'Hevelius created this constellation in 1684 as “Sobieski’s Shield”, in honor of the Polish king John III Sobieski, who had won the Battle of Vienna in 1683. The shield contains the Wild Duck Cluster, whose stars look like a flock of birds in flight through a telescope.',
    },
  },
  // ── Schlange ──
  {
    con: 'Ser',
    culture: 'greek',
    de: {
      title: 'Die zweigeteilte Schlange',
      text: 'Die Schlange gehört zum Heiler Asklepios, dem Schlangenträger, der sie mit beiden Händen hält. Darum ist sie das einzige Sternbild aus zwei getrennten Teilen: Kopf und Schwanz. Einer Sage nach sah Asklepios, wie eine Schlange eine andere mit einem Kraut wiederbelebte. Im Schwanzteil liegt der Adlernebel mit den „Säulen der Schöpfung“.',
    },
    en: {
      title: 'The Divided Serpent',
      text: 'The serpent belongs to the healer Asclepius, Ophiuchus, who holds it in both hands. That is why it is the only constellation made of two separate parts: head and tail. One tale says Asclepius saw a snake bring another back to life with a herb. The tail part holds the Eagle Nebula with its famous “Pillars of Creation”.',
    },
  },
  // ── Sextant ──
  {
    con: 'Sex',
    culture: 'origin',
    de: {
      title: 'Der Sextant des Hevelius',
      text: 'Hevelius vermaß die Sterne mit großen Instrumenten wie dem Sextanten – ohne Fernrohr, aber erstaunlich genau. 1679 zerstörte ein Brand seine Sternwarte in Danzig. Zur Erinnerung an seine Instrumente setzte er den Sextanten an den Himmel; sein Atlas erschien 1690. Das Sternbild liegt südlich vom Löwen und ist sehr lichtschwach.',
    },
    en: {
      title: 'Hevelius’s Sextant',
      text: 'Hevelius measured the stars with large instruments such as the sextant – without a telescope, yet astonishingly precisely. In 1679 a fire destroyed his observatory in Danzig. In memory of his instruments he placed the sextant in the sky; his atlas appeared in 1690. The constellation lies south of Leo and is very faint.',
    },
  },
  // ── Stier ──
  {
    con: 'Tau',
    culture: 'greek',
    de: {
      title: 'Zeus als Stier',
      text: 'Zeus verliebte sich in die Prinzessin Europa und verwandelte sich in einen schneeweißen Stier. Als sie auf seinen Rücken stieg, schwamm er mit ihr übers Meer nach Kreta. Unser Kontinent trägt ihren Namen. Das rote Auge des Stiers ist Aldebaran vor dem V-förmigen Sternhaufen der Hyaden; auf seiner Schulter sitzen die Plejaden.',
    },
    en: {
      title: 'Zeus as a Bull',
      text: 'Zeus fell in love with Princess Europa and turned himself into a snow-white bull. When she climbed onto his back, he swam with her across the sea to Crete – and our continent bears her name. The bull’s red eye is Aldebaran, in front of the V-shaped Hyades cluster, and the Pleiades sit on its shoulder.',
    },
  },
  {
    con: 'Tau',
    culture: 'greek',
    de: {
      title: 'Die sieben Schwestern',
      text: 'Die Plejaden waren sieben Töchter des Titanen Atlas. Als der Jäger Orion ihnen unablässig nachstellte, verwandelte Zeus sie in Tauben und schließlich in Sterne. Am Himmel folgt Orion ihnen bis heute. Mit bloßem Auge sieht man meist nur sechs Sterne – deshalb erzählte man, eine der Schwestern halte sich versteckt.',
    },
    en: {
      title: 'The Seven Sisters',
      text: 'The Pleiades were the seven daughters of the Titan Atlas. When the hunter Orion kept pursuing them, Zeus turned them into doves and finally into stars. In the sky, Orion still follows them today. With the naked eye you usually see only six stars – so people said one of the sisters was hiding.',
    },
  },
  {
    con: 'Tau',
    culture: 'babylonian',
    de: {
      title: 'Der Himmelsstier aus dem Gilgamesch-Epos',
      text: 'Schon in Mesopotamien war dieses Sternbild ein Stier: der „Himmelsstier“. Im Gilgamesch-Epos schickt die Göttin Ischtar ihn auf die Erde, um sich an Gilgamesch zu rächen. Doch der Held und sein Freund Enkidu töten das Tier. Vor rund 5000 Jahren stand die Sonne zu Frühlingsbeginn im Stier – das machte ihn besonders wichtig.',
    },
    en: {
      title: 'The Bull of Heaven from Gilgamesh',
      text: 'In ancient Mesopotamia this constellation was already a bull: the “Bull of Heaven”. In the Epic of Gilgamesh, the goddess Ishtar sends it down to Earth to take revenge on Gilgamesh, but the hero and his friend Enkidu slay it. About 5,000 years ago, the Sun stood in Taurus at the start of spring, which made it especially important.',
    },
  },
  {
    con: 'Tau',
    culture: 'aboriginal',
    de: {
      title: 'Die Sieben Schwestern auf der Flucht',
      text: 'In vielen Aborigines-Traditionen sind die Plejaden sieben Schwestern, die vor einem Mann fliehen. In der Wüste Zentralaustraliens heißt er Nyiru und ist im Orion zu sehen. Die Verfolgungsjagd führt quer über den Kontinent; Lieder und Malereien erzählen von den Orten, an denen die Schwestern rasteten – bis sie sich in den Himmel retteten.',
    },
    en: {
      title: 'The Seven Sisters on the Run',
      text: 'In many Aboriginal traditions, the Pleiades are seven sisters fleeing from a man. In the deserts of central Australia he is called Nyiru and can be seen in Orion. The chase crosses the whole continent; songs and paintings tell of the places where the sisters rested – until they escaped into the sky.',
    },
  },
  {
    con: 'Tau',
    culture: 'polynesian',
    de: {
      title: 'Matariki – Neujahr der Māori',
      text: 'In Neuseeland heißen die Plejaden Matariki. Wenn sie im Winter der Südhalbkugel, im Juni oder Juli, erstmals wieder in der Morgendämmerung auftauchen, beginnt für die Māori das neue Jahr. Man gedenkt der Verstorbenen und blickt auf das kommende Jahr. Seit 2022 ist Matariki in Neuseeland ein gesetzlicher Feiertag.',
    },
    en: {
      title: 'Matariki – the Māori New Year',
      text: 'In New Zealand, the Pleiades are called Matariki. When they first reappear in the dawn sky during the southern winter, in June or July, the Māori New Year begins. It is a time to remember those who have died and to look ahead to the coming year. Since 2022, Matariki has been a public holiday in New Zealand.',
    },
  },
  {
    con: 'Tau',
    culture: 'indigenous-american',
    de: {
      title: 'Sieben Mädchen auf dem Felsen',
      text: 'Die Kiowa erzählen von sieben Mädchen, die vor Bären flohen und auf einen niedrigen Felsen sprangen. Der Felsen wuchs in die Höhe, während die Bären mit ihren Krallen tiefe Rillen in seine Wände kratzten – so entstand der Devils Tower in Wyoming. Die Mädchen wurden immer höher getragen, bis sie als Plejaden am Himmel standen.',
    },
    en: {
      title: 'Seven Girls on the Rock',
      text: 'The Kiowa tell of seven girls who fled from bears and jumped onto a low rock. The rock grew upward while the bears scratched deep grooves into its sides with their claws – and so Devils Tower in Wyoming was formed. The girls were carried higher and higher until they became the Pleiades in the sky.',
    },
  },
  {
    con: 'Tau',
    culture: 'indian',
    de: {
      title: 'Die Ammen des Kriegsgottes',
      text: 'In Indien heißen die Plejaden Krittika. Die sechs Krittikas zogen den jungen Gott Kartikeya auf – deshalb trägt er ihren Namen. Damit er von allen sechs Ammen trinken konnte, wuchsen ihm sechs Köpfe. Krittika ist auch eines der 27 Mondhäuser, mit denen die indische Astronomie den Weg des Mondes einteilt.',
    },
    en: {
      title: 'The Nurses of the War God',
      text: 'In India, the Pleiades are called Krittika. The six Krittikas raised the young god Kartikeya, which is why he bears their name. So that he could drink from all six nurses, he grew six heads. Krittika is also one of the 27 lunar mansions that Indian astronomy uses to divide the Moon’s path.',
    },
  },
  {
    con: 'Tau',
    culture: 'arabic',
    de: {
      title: 'Der Folgende',
      text: 'Der Name Aldebaran kommt aus dem Arabischen: ad-dabaran, „der Folgende“. Der rote Stern scheint den Plejaden über den Himmel nachzulaufen. Die Plejaden selbst hießen at-Thurayya; ihr Auf- und Untergang half in Arabien, die Jahreszeiten und die Regenzeit vorherzusagen.',
    },
    en: {
      title: 'The Follower',
      text: 'The name Aldebaran comes from Arabic: al-dabaran, “the follower”. The red star seems to chase the Pleiades across the sky. The Pleiades themselves were called al-Thurayya, and their rising and setting helped people in Arabia predict the seasons and the rains.',
    },
  },
  // ── Teleskop ──
  {
    con: 'Tel',
    culture: 'origin',
    de: {
      title: 'Das Fernrohr',
      text: 'Lacaille ehrte 1756 das Teleskop – das Werkzeug, das die Astronomie seit Galileis ersten Beobachtungen 1609 völlig verändert hatte. Auf seiner Karte ist es ein langes Fernrohr, das an einem Mast hängt. Ausgerechnet dieses Sternbild ist recht unscheinbar und von Mitteleuropa aus kaum zu sehen.',
    },
    en: {
      title: 'The Telescope',
      text: 'In 1756, Lacaille honored the telescope – the tool that had transformed astronomy since Galileo’s first observations in 1609. On his chart it is a long tube hanging from a mast. Ironically, this constellation is quite dull and hardly visible from Central Europe.',
    },
  },
  // ── Dreieck ──
  {
    con: 'Tri',
    culture: 'greek',
    de: {
      title: 'Das Delta am Himmel',
      text: 'Drei Sterne bilden ein schmales Dreieck, das die Griechen an ihren Buchstaben Delta (Δ) erinnerte. Manche verbanden es mit dem Nildelta, andere mit der dreieckigen Insel Sizilien. Im Dreieck liegt die Dreiecksgalaxie M33, eine unserer Nachbargalaxien – unter sehr dunklem Himmel sogar mit bloßem Auge zu erahnen.',
    },
    en: {
      title: 'The Delta in the Sky',
      text: 'Three stars form a narrow triangle that reminded the Greeks of their letter delta (Δ). Some linked it to the Nile Delta, others to the triangular island of Sicily. It contains the Triangulum Galaxy, M33, one of our neighboring galaxies – under a very dark sky, you can even glimpse it with the naked eye.',
    },
  },
  // ── Südliches Dreieck ──
  {
    con: 'TrA',
    culture: 'origin',
    de: {
      title: 'Das Südliche Dreieck',
      text: 'Das Südliche Dreieck stammt von Keyser und de Houtman und erschien 1598 auf dem Himmelsglobus von Plancius. Seine drei Hauptsterne sind deutlich heller als die des nördlichen Dreiecks. Der hellste, der orangefarbene Riese Atria, verdankt seinen Namen einer Abkürzung von „Alpha Trianguli Australis“.',
    },
    en: {
      title: 'The Southern Triangle',
      text: 'Triangulum Australe comes from Keyser and de Houtman and appeared on Plancius’s celestial globe in 1598. Its three main stars are clearly brighter than those of the northern triangle. The brightest, the orange giant Atria, owes its name to a contraction of “Alpha Trianguli Australis”.',
    },
  },
  // ── Tukan ──
  {
    con: 'Tuc',
    culture: 'origin',
    de: {
      title: 'Der Tukan',
      text: 'Den Tukan, einen südamerikanischen Vogel mit riesigem Schnabel, führten Keyser und de Houtman um 1596 ein; Plancius veröffentlichte ihn 1598. Im Tukan liegt die Kleine Magellansche Wolke, eine Nachbargalaxie, und daneben 47 Tucanae – einer der prächtigsten Kugelsternhaufen am ganzen Himmel.',
    },
    en: {
      title: 'The Toucan',
      text: 'Keyser and de Houtman introduced the toucan, a South American bird with a huge beak, around 1596; Plancius published it in 1598. Tucana holds the Small Magellanic Cloud, a neighboring galaxy, and next to it 47 Tucanae – one of the most magnificent globular star clusters in the entire sky.',
    },
  },
  // ── Großer Bär ──
  {
    con: 'UMa',
    culture: 'greek',
    de: {
      title: 'Kallisto, die Bärin',
      text: 'Die Nymphe Kallisto wurde von Zeus geliebt und zur Strafe in eine Bärin verwandelt. Jahre später hätte ihr eigener Sohn Arkas sie beinahe auf der Jagd erlegt. Zeus setzte beide an den Himmel. Die eifersüchtige Hera sorgte dafür, dass die Bärin nie im Meer baden darf – darum geht sie bei uns nie unter. Sieben Sterne bilden den Großen Wagen.',
    },
    en: {
      title: 'Callisto, the She-Bear',
      text: 'The nymph Callisto was loved by Zeus and turned into a bear as punishment. Years later her own son Arcas nearly killed her while hunting, so Zeus placed them both in the sky. Jealous Hera made sure the bear may never bathe in the sea – which is why it never sets as seen from Europe. Seven of its stars form the Big Dipper.',
    },
  },
  {
    con: 'UMa',
    culture: 'chinese',
    de: {
      title: 'Der Nördliche Scheffel',
      text: 'In China heißt der Große Wagen Beidou, „Nördlicher Scheffel“ – eine Schöpfkelle zum Abmessen von Getreide. Man sah darin auch den Wagen des Himmelskaisers, der um den Pol kreist. Der Griff zeigte die Jahreszeit an: Weist er am Abend nach Osten, ist Frühling, nach Süden Sommer, nach Westen Herbst und nach Norden Winter.',
    },
    en: {
      title: 'The Northern Dipper',
      text: 'In China, the Big Dipper is called Beidou, the “Northern Dipper” – a ladle for measuring grain. It was also seen as the chariot of the celestial emperor, circling the pole. The handle told the season: if it points east in the evening it is spring, south means summer, west autumn and north winter.',
    },
  },
  {
    con: 'UMa',
    culture: 'indigenous-american',
    de: {
      title: 'Die große Bärenjagd',
      text: 'Bei den Mi’kmaq in Nordamerika sind die vier Kastensterne ein Bär und die Deichselsterne Jäger: Wanderdrossel, Meise und Häher. Die Meise trägt einen Kochtopf – das Sternchen Alkor. Im Herbst trifft die Drossel den Bären mit einem Pfeil. Sein Blut färbt ihre Brust rot und tropft auf die Wälder, deren Blätter sich dann rot färben.',
    },
    en: {
      title: 'The Great Bear Hunt',
      text: 'For the Mi’kmaq of North America, the four bowl stars are a bear and the handle stars are hunters: Robin, Chickadee and Moose Bird. Chickadee carries a cooking pot – the little star Alcor. In autumn, Robin hits the bear with an arrow. Its blood turns his breast red and drips onto the forests, turning the leaves red.',
    },
  },
  {
    con: 'UMa',
    culture: 'arabic',
    de: {
      title: 'Die Töchter der Bahre',
      text: 'Arabische Beobachter sahen in den vier Kastensternen eine Totenbahre und in den drei Deichselsternen trauernde Töchter, die ihr folgen: Banat Nasch, „die Töchter der Bahre“. Der Name des letzten Deichselsterns, Alkaid, bedeutet „der Anführer“ – er führt den Trauerzug an.',
    },
    en: {
      title: 'The Daughters of the Bier',
      text: 'Arab skywatchers saw the four bowl stars as a funeral bier and the three handle stars as mourning daughters following it: Banat Nash, “the daughters of the bier”. The name of the last handle star, Alkaid, means “the leader” – it leads the procession.',
    },
  },
  {
    con: 'UMa',
    culture: 'indian',
    de: {
      title: 'Die sieben Weisen',
      text: 'In Indien heißt der Große Wagen Saptarishi, „die sieben Weisen“: Jeder Stern ist ein heiliger Seher der Vorzeit. Neben dem Weisen Vasishtha (Mizar) steht seine treue Frau Arundhati – das Sternchen Alkor. Bei manchen Hochzeiten zeigt man dem Brautpaar die beiden als Vorbild für eine lange, enge Ehe.',
    },
    en: {
      title: 'The Seven Sages',
      text: 'In India, the Big Dipper is called Saptarishi, “the seven sages”: each star is a holy seer from ancient times. Beside the sage Vasishtha (Mizar) stands his faithful wife Arundhati – the little star Alcor. At some weddings, the couple is shown the two stars as a model for a long and close marriage.',
    },
  },
  {
    con: 'UMa',
    culture: 'egyptian',
    de: {
      title: 'Der Stierschenkel',
      text: 'Die alten Ägypter sahen im Großen Wagen den Vorderschenkel eines Stiers, Meschetiu genannt. Er gehörte zu den „Unvergänglichen“ – Sternen, die nie untergehen. Zu ihnen, so hofften die Ägypter, sollten die Seelen der Könige aufsteigen. Bilder des Stierschenkels finden sich auf Sargdeckeln und an Grabdecken.',
    },
    en: {
      title: 'The Bull’s Foreleg',
      text: 'The ancient Egyptians saw the Big Dipper as the foreleg of a bull, called Meskhetyu. It belonged to the “Imperishable Ones” – stars that never set. The Egyptians hoped the souls of their kings would rise up to join them. Pictures of the foreleg appear on coffin lids and tomb ceilings.',
    },
  },
  // ── Kleiner Bär ──
  {
    con: 'UMi',
    culture: 'greek',
    de: {
      title: 'Die Amme des Zeus',
      text: 'Eine griechische Sage erzählt, der Kleine Bär sei eine der Nymphen gewesen, die den kleinen Zeus auf Kreta versteckten und versorgten. Am Ende seines Schwanzes sitzt der Polarstern, um den sich der ganze Nordhimmel dreht. Schon die Phönizier steuerten ihre Schiffe nach dem Kleinen Bären, die Griechen dagegen nach dem Großen.',
    },
    en: {
      title: 'The Nurse of Zeus',
      text: 'One Greek legend says the Little Bear was one of the nymphs who hid and cared for the infant Zeus on Crete. At the tip of its tail sits the North Star, around which the whole northern sky turns. The Phoenicians already steered their ships by the Little Bear, while the Greeks used the Great Bear.',
    },
  },
  // ── Segel ──
  {
    con: 'Vel',
    culture: 'greek',
    de: {
      title: 'Die Segel der Argo',
      text: 'Mit der Argo segelten Helden wie Herakles, Orpheus und die Zwillinge Kastor und Pollux bis ans Schwarze Meer. Das Segel ist der dritte Teil des alten Schiffs. Zwei seiner Sterne bilden mit zwei Sternen des Kiels das „Falsche Kreuz“, das man leicht mit dem Kreuz des Südens verwechselt. Hier liegt auch der Rest einer über 10.000 Jahre alten Sternexplosion.',
    },
    en: {
      title: 'The Sails of the Argo',
      text: 'Heroes such as Heracles, Orpheus and the twins Castor and Pollux sailed on the Argo all the way to the Black Sea. Vela is the third part of the old ship. Two of its stars form the “False Cross” with two stars of Carina, easily mistaken for the Southern Cross. It also holds the remains of a star that exploded more than 10,000 years ago.',
    },
  },
  // ── Jungfrau ──
  {
    con: 'Vir',
    culture: 'greek',
    de: {
      title: 'Die Göttin der Gerechtigkeit',
      text: 'Die Jungfrau gilt oft als Astraia, die Göttin der Gerechtigkeit. Im Goldenen Zeitalter lebte sie unter den Menschen. Als diese immer gieriger und gewalttätiger wurden, verließ sie als letzte Unsterbliche die Erde und zog an den Himmel. In der Hand hält sie eine Ähre: den hellen Stern Spica, lateinisch für „Ähre“.',
    },
    en: {
      title: 'The Goddess of Justice',
      text: 'Virgo is often seen as Astraea, the goddess of justice. In the Golden Age she lived among humans. When people grew ever greedier and more violent, she was the last immortal to leave the Earth and went up to the sky. In her hand she holds an ear of wheat: the bright star Spica, Latin for “ear of grain”.',
    },
  },
  // ── Fliegender Fisch ──
  {
    con: 'Vol',
    culture: 'origin',
    de: {
      title: 'Der Fliegende Fisch',
      text: 'Fliegende Fische, die mit flügelartigen Flossen über die Wellen gleiten, begeisterten die Seefahrer in tropischen Meeren. Keyser und de Houtman setzten einen davon um 1596 an den Südhimmel; Plancius veröffentlichte ihn 1598. Passend schwimmt gleich daneben die Goldmakrele (Dorado), ein echter Fressfeind fliegender Fische.',
    },
    en: {
      title: 'The Flying Fish',
      text: 'Flying fish, gliding over the waves on wing-like fins, delighted sailors in tropical seas. Keyser and de Houtman placed one in the southern sky around 1596; Plancius published it in 1598. Fittingly, right next to it swims the dorado, a real-life predator of flying fish.',
    },
  },
  // ── Fuchs ──
  {
    con: 'Vul',
    culture: 'origin',
    de: {
      title: 'Der Fuchs mit der Gans',
      text: 'Hevelius nannte dieses Sternbild ursprünglich „Füchslein mit Gans“; sein Atlas erschien 1690. Später blieb nur der Fuchs übrig. In ihm liegt der Hantelnebel, die leuchtende Gashülle eines sterbenden Sterns. 1967 entdeckte Jocelyn Bell Burnell hier den ersten Pulsar – einen rasend schnell rotierenden Neutronenstern, der regelmäßig Radiopulse aussendet.',
    },
    en: {
      title: 'The Fox with the Goose',
      text: 'Hevelius originally called this constellation the “little fox with goose”; his atlas appeared in 1690. Later only the fox remained. It contains the Dumbbell Nebula, the glowing gas shell of a dying star. In 1967, Jocelyn Bell Burnell discovered the first pulsar here – a rapidly spinning neutron star that sends out regular radio pulses.',
    },
  },
];
