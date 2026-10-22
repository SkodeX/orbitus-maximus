# ToDo

## Weitere Benachrichtigungen (Ideen)

Umgesetzt sind ISS-Überflüge, Polarlicht-Alarm, klare Nacht und Meteorschauer. Diese Ideen warten noch:

- [ ] **Raketenstart-Erinnerung** – 1 Stunde bzw. 10 Minuten vor dem Start, optional nur bemannte Flüge oder Starts aus Europa; mit Link zum Livestream
- [ ] **Finsternisse** – Sonnen- oder Mondfinsternis, die bei dir sichtbar ist: am Vortag und eine Stunde vorher
- [ ] **Enge Begegnungen** – Mond nahe an einem hellen Planeten, zwei Planeten dicht beieinander (Konjunktionen)
- [ ] **Beste Planetensichtbarkeit** – Opposition von Mars, Jupiter, Saturn; größte Elongation von Merkur und Venus
- [ ] **Mondphasen** – Neumond (beste Nächte für Galaxien und Nebel), Vollmond, Supermond
- [ ] **Bedeckungen** – der Mond schiebt sich vor einen hellen Stern oder Planeten
- [ ] **Helle Kometen** – sobald ein Komet mit bloßem Auge oder Fernglas sichtbar ist
- [ ] **Weitere Satelliten** – Tiangong, Hubble, frisch gestartete Starlink-Ketten
- [ ] **Starke Sonnenaktivität** – X-Flare oder geomagnetischer Sturm ab G3, auch tagsüber als Info
- [ ] **Aufklaren** – kurzfristige Wolkenlücke in den nächsten Stunden
- [ ] **Wochenvorschau** – Sonntagabend: die Himmels-Highlights der kommenden Woche
- [ ] **Lernen** – Artikel des Tages oder Erinnerung an die Quiz-Serie
- [ ] **Tagebuch** – am Morgen nach einer klaren Nacht: „Hast du etwas beobachtet?“

## Weitere Ideen (allgemein)

Umgesetzt im Oktober 2026 (abgehakt). Was davon noch fehlt, steht jeweils dahinter.

### Beobachten

- [x] **Astro-Wetter** – neben Wolken auch Seeing (Luftunruhe) und Transparenz, z. B. über 7Timer! ASTRO – *umgesetzt als Schätzung aus Open-Meteo (Jetstream, Wind, Feuchte, Aerosole); 7Timer! erlaubt keinen Abruf aus dem Browser*
- [x] **Lichtverschmutzung** – Bortle-Klasse für den eigenen Ort und dunkle Plätze in der Nähe auf einer Karte
- [x] **AR-Modus** – Kamerabild des iPhones mit eingeblendeten Sternbildern und Planeten – *Bildwinkel auf dem iPhone noch prüfen/kalibrieren*
- [x] **Beobachtungslisten** – Messier, Caldwell, „Die 20 schönsten Objekte fürs Fernglas“ zum Abhaken, verknüpft mit dem Tagebuch
- [x] **Okular-/Teleskop-Rechner** – Vergrößerung, Gesichtsfeld und eine Vorschau, wie ein Objekt im eigenen Gerät aussieht
- [x] **Mondatlas** – zoombare Mondkarte mit Kratern, Meeren, Apollo-Landeplätzen und der aktuellen Licht-Schatten-Grenze
- [x] **Jupiter- und Saturnmonde** – aktuelle Stellung, Schattendurchgänge, Großer Roter Fleck – *offen: Großer Roter Fleck (seine Länge driftet und müsste regelmäßig nachgeführt werden)*
- [x] **Finsternis-Simulator** – kommende Sonnen- und Mondfinsternisse mit Verlauf für den eigenen Ort (z. B. totale Sonnenfinsternis 2. August 2027 über Südspanien und Nordafrika)
- [x] **Kometen und Asteroiden** – helle Kometen, erdnahe Vorbeiflüge (NASA/JPL CNEOS)
- [x] **Kalender-Export** – Himmelsereignisse als .ics in den iPhone-Kalender

### Live

- [x] **Deep Space Network live** – welche Raumsonde gerade mit der Erde funkt (Daten wie bei NASA „DSN Now“)
- [x] **Raumsonden-Tracker** – wo Voyager 1/2, New Horizons, JWST und Juno gerade sind, mit Entfernung und Signallaufzeit (JPL Horizons)
- [x] **Livestreams** – Start-Livestreams direkt bei den Raketenstarts verlinken
- [x] **Starlink & Co.** – alle aktiven Satelliten als Wolke um die Erde

### 3D & Wissen

- [x] **Sondenbahnen im 3D-Sonnensystem** – Voyager, Cassini, New Horizons; dazu Asteroidengürtel und Kuipergürtel – *ohne Cassini (Mission 2017 beendet)*
- [x] **Nachbarsterne in 3D** – die Sterne im Umkreis von 50 Lichtjahren, später Milchstraße – *offen: Milchstraße*
- [x] **Exoplaneten** – Katalog der bekannten Exoplaneten (NASA Exoplanet Archive) mit Vergleich zur Erde
- [x] **Sternbild-Trainer** – auf der Karte „Zeig mir den Orion“, Karteikarten mit Wiederholung
- [x] **Lernpfade** – z. B. „In 7 Nächten den Himmel kennenlernen“ mit Aufgaben für draußen
- [x] **Heute in der Raumfahrtgeschichte** – täglicher Eintrag auf der Heute-Seite
- [x] **Sternbild-Mythen** – Geschichten zu den Sternbildern aus verschiedenen Kulturen
- [x] **Bildergalerie** – Hubble- und JWST-Bilder mit Erklärung, verknüpft mit Objekten auf der Sternkarte – *die NASA-Bibliothek hat nur vier Webb-Bilder; der Rest kommt von Hubble, Spitzer, Chandra und Raumsonden*

### Tagebuch & Konto

- [x] **Export** – Tagebuch als PDF oder CSV
- [x] **Teilen** – einzelne Beobachtung als Link oder Bild teilen – *als Bild umgesetzt; ein Link zum Teilen braucht das Supabase-Backend*
- [x] **Statistik** – Beobachtungen pro Monat, meistgesehene Objekte, beste Nächte

## Zukünftige Ideen

- [ ] **Himmel an einem beliebigen Datum** – Datum und Uhrzeit frei wählen (z. B. Geburtstag, Mondlandung 1969, Silvester 2099) und die Sternkarte so zeigen, wie der Himmel damals bzw. dann aussah.
  - *Machbarkeit: gut.* Die Sternkarte kann die Zeit schon um ±12 Stunden verschieben, und Astronomy Engine rechnet Sonne, Mond und Planeten für jedes Datum (sehr genau etwa 1700–2200). Nötig sind ein Datumswähler und Sprungziele („Mondlandung“, „mein Geburtstag“).
  - *Tagsüber:* Der Taghimmel wird schon dargestellt. Dazu kommt ein Schalter „Tageslicht ausblenden“, damit man die Sterne hinter der Sonne sieht, z. B. in welchem Sternbild die Sonne an deinem Geburtstag stand.
  - *Grenzen:* ISS und Satelliten gibt es nur für die Gegenwart. Für Jahrtausende zurück verschieben sich die Sterne durch Präzession und Eigenbewegung, dafür bräuchte es eine Sonderbehandlung.

## Vergleichsseiten zur Inspiration

- **Sternkarte:** [Stellarium Web](https://stellarium-web.org), [Stellarium](https://stellarium.org) (Desktop), SkySafari, Star Walk 2, Sky Guide (Apps)
- **3D:** [NASA's Eyes](https://eyes.nasa.gov), [Solar System Scope](https://www.solarsystemscope.com), [Celestia](https://celestiaproject.space), [WorldWide Telescope](https://www.worldwidetelescope.org), [ESASky](https://sky.esa.int)
- **Satelliten:** [Heavens-Above](https://www.heavens-above.com), [Spot the Station](https://spotthestation.nasa.gov), [N2YO](https://www.n2yo.com), [Where the ISS at?](https://wheretheiss.at)
- **Wetter & Planung:** [Clear Outside](https://clearoutside.com), [Astrospheric](https://www.astrospheric.com), [7Timer!](https://www.7timer.info), [Light Pollution Map](https://www.lightpollutionmap.info), [Telescopius](https://telescopius.com)
- **Ereignisse:** [In-The-Sky.org](https://in-the-sky.org), [timeanddate Astronomie](https://www.timeanddate.de/astronomie/)
- **Live:** [SpaceWeatherLive](https://www.spaceweatherlive.com), [Next Spaceflight](https://nextspaceflight.com), [DSN Now](https://eyes.nasa.gov/apps/dsn-now/)
- **Größen & Distanzen:** [The Size of Space](https://neal.fun/size-of-space/), [Scale of the Universe](https://htwins.net/scale2/), [If the Moon Were Only 1 Pixel](https://joshworth.com/dev/pixelspace/pixelspace_solarsystem.html)
- **Mitmachen & Teilen:** [Zooniverse](https://www.zooniverse.org) (Bürgerwissenschaft), [AstroBin](https://www.astrobin.com) (Astrofotos), [NASA Exoplanets](https://exoplanets.nasa.gov)

## Sonstiges

- [ ] Supabase-Connector verbinden und Backend einrichten (Schritte im README unter „Backend (Supabase)“)
- [ ] Lizenz für den eigenen Code festlegen (z. B. MIT)
- [ ] GPS, Handy-Modus, AR-Kamera und 3D-Flüssigkeit auf dem iPhone testen
- [ ] Hinweis: Die Lichtverschmutzungsdaten (Falchi et al.) stehen unter CC BY-NC 4.0 – die App muss dafür nicht-kommerziell bleiben
