# Orbitus Maximus

Dein interaktiver Weltraum im Browser – als installierbare Web-App (PWA), auf Deutsch und Englisch.

**Live:** https://skodex.github.io/orbitus-maximus/

Auf dem iPhone: Seite in Safari öffnen → „Teilen“ → „Zum Home-Bildschirm“. Dann startet die App im Vollbild und funktioniert auch offline.

**Phase 1 „Himmel heute“**

- **Heute-Nacht-Planer:** Dämmerung, dunkle Zeit, Wolkenvorhersage, Bewertung der Beobachtungsbedingungen, Zeitleiste der Nacht, Planeten mit Sichtbarkeitsfenstern, Mond, Meteorströme und Deep-Sky-Tipps
- **Live-Sternkarte:** rund 5.000 Sterne, Sternbilder, Planeten, Mond mit Phase, Messier-Objekte, Milchstraße, Meteor-Radianten; Ziehen, Zoomen, Antippen für Infos, Suche, Zeitreise ±12 h
- **Handy-Modus:** Handy zum Himmel halten, Lagesensor und Kompass richten die Karte aus (auf dem iPhone nach einmaliger Freigabe)
- **Rotlicht-Nachtmodus**, Standort per GPS oder Ortssuche

**Phase 2 „Live“**

- **ISS-Tracker:** Globus oder Weltkarte mit Tag-Nacht-Grenze, Bahn und Sichtbarkeitskreis; sichtbare Überflüge für deinen Ort (7 Tage, im Browser per SGP4 berechnet) – mit „Am Himmel zeigen“ läuft der Überflug auf der Sternkarte ab
- **Raketenstarts** mit Countdown, **Menschen im All**, **NASA-Bild des Tages**, **Raumfahrt-News**
- **Weltraumwetter:** Kp-Index, Kp-Vorhersage, Polarlicht-Chance für deinen Ort, NOAA-Skalen, Sonnenwind, Live-Bilder der Sonne (SDO) und das Polarlicht-Oval

**Phase 3 „3D-Sonnensystem“**

- Sonne, acht Planeten, Pluto und die großen Monde (Mond, Io, Europa, Ganymed, Kallisto, Titan, Charon) an ihren echten Positionen, mit Zeitraffer bis 1 Jahr pro Sekunde
- Echte NASA-Oberflächenkarten; Wolken, Atmosphärensaum, Saturnringe und Körper ohne NASA-Karte werden im Browser erzeugt
- Drei Maßstäbe: Übersicht, echte Abstände, Größenvergleich
- Planeten antippen: Kamerafahrt, Steckbrief mit Live-Abständen, Monden und „Am Himmel zeigen“

**Phase 4 „Wissen“**

- **Lexikon** mit Artikeln zu Sonnensystem, Sternen & Galaxien, Himmelsbeobachtung und Raumfahrt – verknüpft mit Sternkarte und 3D-Sonnensystem
- **Zeitstrahl** der Raumfahrt von Sputnik bis heute, filterbar nach Themen
- **Größen & Distanzen:** Skalenreise vom Menschen bis zum beobachtbaren Universum, Reisezeit-Rechner, Gewicht und Alter auf anderen Welten
- **Quiz** mit vier Themen, Erklärungen und Abzeichen

**Phase 5 „Konto & Beobachten“**

- **Konto** ohne Passwort: Anmeldung mit 6-stelligem Code per E-Mail; Ort, Sprache, Sternkarten-Ebenen und Lernfortschritt werden zwischen Geräten synchronisiert
- **Beobachtungstagebuch** mit Zeit, Ort, Objekten, Bedingungen, Ausrüstung, Notizen und Fotos – funktioniert offline und synchronisiert sich nach dem Anmelden; direkt aus Sternkarte und Heute-Seite eintragen
- **Benachrichtigungen** (Web-Push): ISS-Überflüge, Polarlicht-Alarm, klare Nacht und Meteorschauer-Maxima für deinen Ort – auf dem iPhone nur in der installierten App

**Phase 6 „Mehr von allem“**

- **Beobachten** (`#/beobachten`): Astro-Wetter mit Luftruhe, Durchsicht und Taugefahr · Lichtverschmutzung mit Bortle-Klasse und dunkleren Orten in der Nähe · AR-Himmel mit der Handykamera · Beobachtungslisten zum Abhaken (Messier, Caldwell, Fernglas, bloßes Auge, Doppelsterne) · Okular- und Fernglas-Rechner mit Gesichtsfeld-Kreis in der Sternkarte · 3D-Mondatlas mit Lichtgrenze, Libration und Landeplätzen · Jupitermonde mit Schattendurchgängen, Saturnmonde und Ringneigung · Finsternisse mit Zentrallinie auf der Weltkarte und Simulator · helle Kometen und Asteroiden-Vorbeiflüge · Himmelskalender mit Export in den Handy-Kalender (.ics)
- **Live**: Livestream-Links bei den Raketenstarts („Jetzt live“), Deep Space Network live, Raumsonden-Tracker mit Karte und Signallaufzeit, alle aktiven Satelliten als 3D-Wolke um die Erde
- **3D & Wissen**: Raumsonden-Bahnen, Asteroidengürtel, Trojaner und Kuipergürtel im 3D-Sonnensystem · Nachbarsterne bis 50 Lichtjahre in 3D · Exoplaneten-Katalog · Sternbild-Trainer (Karteikasten) · Lernpfade · Sternbild-Mythen aus aller Welt · Bildergalerie von Hubble, Webb & Co. · „Heute in der Raumfahrtgeschichte“
- **Tagebuch**: Statistik, Export als CSV, Druckansicht (PDF) und Teilen als Bild

## Entwickeln

```bash
npm install
npm run dev        # Entwicklungsserver auf http://localhost:5173
npm run build      # Typprüfung + Produktions-Build nach dist/
npm run preview    # Build lokal ansehen
npm run sky-data   # Sterndaten aus d3-celestial neu erzeugen (src/data/)
npm run icons      # App-Icons aus public/logo.svg erzeugen
node scripts/build-textures.mjs <Ordner>   # NASA-Texturen verkleinern (nach public/textures/)
npm run data       # Kataloge (Exoplaneten, Kleinkörper, Kometen, Nachbarsterne) und Bahnen (Sonden, Saturnmonde) neu laden
node scripts/build-lightpollution.mjs <World_Atlas_2015.zip>   # Lichtkarte aus dem Falchi-Atlas erzeugen
```

`npm run data` holt die Daten von NASA/JPL, CDS und dem NASA Exoplanet Archive nach `public/data/`. Fällt eine Quelle aus, bleiben die alten Dateien erhalten. GitHub Actions führt das vor jedem Build aus und baut die App zusätzlich jeden Montag neu.

### Backend (Supabase)

Konto, Sync und Benachrichtigungen laufen über ein eigenes Supabase-Projekt. Ohne Eintrag in `src/lib/cloud/config.ts` läuft die App komplett lokal weiter.

1. Migrationen aus `supabase/migrations/` der Reihe nach ausführen (Tabellen, Zugriffsregeln, Foto-Speicher, Cron-Job).
2. Im Vault drei Geheimnisse anlegen: `orbitus_vapid_private` (privater VAPID-Schlüssel), `orbitus_cron_key` (beliebige Zufallsfolge) und `orbitus_project_url` (Projekt-URL).
3. Edge Function `supabase/functions/push-alerts` mit `verify_jwt = false` veröffentlichen.
4. Projekt-URL und Anon-Key in `src/lib/cloud/config.ts` eintragen.
5. In den E-Mail-Vorlagen „Magic Link“ und „Confirm signup“ den Code `{{ .Token }}` einbauen, damit die Mail den 6-stelligen Code enthält.

Geheime Schlüssel (privater VAPID-Schlüssel, Service-Role-Key, Cron-Key) gehören nie ins Repo.

GPS und Lagesensor funktionieren auf dem Handy nur über HTTPS, also in der Live-Version. Jeder Push auf `main` baut die App per GitHub Actions und veröffentlicht sie auf GitHub Pages (`.github/workflows/deploy.yml`).

## Aufbau

| Ordner | Inhalt |
| --- | --- |
| `src/lib/astro.ts` | Astronomie: Nacht, Dämmerung, Planeten- und Mondberichte (astronomy-engine) |
| `src/sky/engine.ts` | Canvas-Renderer der Sternkarte (stereografische Projektion) |
| `src/sky/orientation.ts` | Lagesensor → Blickrichtung |
| `src/views/` | Seiten: Heute, Himmel, Planeten (3D), Live, Wissen, Tagebuch, Ort & mehr, Willkommen |
| `src/solar/` | 3D-Sonnensystem (three.js) und Daten der Himmelskörper |
| `src/learn/` | Lexikon, Zeitstrahl, Quiz, Abzeichen und Lernfortschritt |
| `src/lib/live/` | Live-Daten: ISS-Bahn, Starts, News, Weltraumwetter |
| `src/lib/cloud/` | Konto, Sync, Tagebuch und Push (Supabase) |
| `src/lib/observe/` | Beobachten: Optik, Finsternisse, Jupiter- und Saturnmonde, Mondgeometrie, Ereignisse, Listen, Lichtverschmutzung |
| `src/lib/catalogs.ts` | Kataloge und Bahnrechnung für Kleinkörper und Kometen |
| `public/data/` | Erzeugte Datenpakete (werden erst bei Bedarf geladen) |
| `supabase/` | Datenbank-Migrationen und Edge Function für Benachrichtigungen |
| `src/i18n/` | Texte Deutsch/Englisch |
| `src/data/` | Erzeugte Himmelsdaten |
| `scripts/` | Datenaufbereitung |

## Datenquellen

Lizenzen und Hinweise im Detail: [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

- [Astronomy Engine](https://github.com/cosinekitty/astronomy) – Positionen von Sonne, Mond und Planeten (MIT)
- [d3-celestial](https://github.com/ofrohn/d3-celestial) – Sterne, Sternbilder, Messier, Milchstraße (BSD-3-Clause)
- [Open-Meteo](https://open-meteo.com) – Wolkenvorhersage und Ortssuche (CC BY 4.0)
- [BigDataCloud](https://www.bigdatacloud.com) – Ortsname zum GPS-Standort
- [CelesTrak](https://celestrak.org) – Bahndaten der ISS; [satellite.js](https://github.com/shashwatak/satellite-js) – SGP4-Bahnrechnung (MIT)
- [The Space Devs – Launch Library 2](https://thespacedevs.com) – Raketenstarts und Menschen im All
- [NASA](https://www.nasa.gov) – Bild des Tages; [NASA SDO](https://sdo.gsfc.nasa.gov) – Sonnenbilder
- [NOAA SWPC](https://www.swpc.noaa.gov) – Kp-Index, Vorhersage, Sonnenwind, Polarlicht-Oval
- [Spaceflight News API](https://spaceflightnewsapi.net) – Raumfahrt-News
- [Natural Earth / world-atlas](https://github.com/topojson/world-atlas) – Landmassen der Weltkarte
- [NASA 3D Resources](https://github.com/nasa/NASA-3D-Resources) – Oberflächenkarten von Erde, Venus (Magellan-Radar), Mars, Jupiter, Saturn, Neptun, Pluto, Io, Europa und Titan (gemeinfrei)
- [three.js](https://threejs.org) – 3D-Darstellung (MIT)
- [Falchi et al. 2016, World Atlas of Artificial Night Sky Brightness](https://doi.org/10.5880/GFZ.1.4.2016.001) – Lichtverschmutzung (CC BY-NC 4.0, deshalb nur nicht-kommerziell)
- [NASA/JPL Horizons und Small-Body Database](https://ssd.jpl.nasa.gov) – Sondenbahnen, Saturnmonde, Asteroiden und Kometen; [NASA NeoWs](https://api.nasa.gov) – Vorbeiflüge
- [NASA Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu) – Exoplaneten; [CDS SIMBAD/VizieR](https://cds.unistra.fr) und ESA Hipparcos – Nachbarsterne und Koordinaten
- [IAU/USGS Gazetteer](https://planetarynames.wr.usgs.gov), [LROC](https://www.lroc.asu.edu) und [NASA SVS](https://svs.gsfc.nasa.gov/4720) – Mondatlas
- [NASA Image and Video Library](https://images.nasa.gov) – Bildergalerie; [NASA DSN Now](https://eyes.nasa.gov/apps/dsn-now/) – Deep Space Network live
- [Supabase](https://supabase.com) – Konto, Datenbank, Foto-Speicher und Edge Functions; [web-push](https://github.com/web-push-libs/web-push) – Versand der Benachrichtigungen (MPL-2.0)
