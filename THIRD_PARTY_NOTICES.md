# Fremde Daten und Bibliotheken

Orbitus Maximus nutzt die folgenden Daten und Open-Source-Bibliotheken.

## Daten

| Quelle | Verwendung | Lizenz |
| --- | --- | --- |
| [d3-celestial](https://github.com/ofrohn/d3-celestial) © 2015 Olaf Frohn | Sternkatalog, Sternbilder, Messier-Objekte, Milchstraße (aufbereitet in `src/data/`) | BSD-3-Clause (siehe unten) |
| [NASA 3D Resources](https://github.com/nasa/NASA-3D-Resources) | Planetentexturen in `public/textures/` | gemeinfrei (NASA) |
| [Natural Earth](https://www.naturalearthdata.com) über [world-atlas](https://github.com/topojson/world-atlas) | Landmassen der Weltkarte, Land/Wasser-Maske der Lichtkarte | gemeinfrei / ISC |
| Falchi et al. (2016): *The New World Atlas of Artificial Night Sky Brightness*, GFZ Data Services, [doi:10.5880/GFZ.1.4.2016.001](https://doi.org/10.5880/GFZ.1.4.2016.001); Science Advances, doi:10.1126/sciadv.1600377 | Lichtverschmutzung, vergröbert und quantisiert in `public/data/lightpollution.png` | [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) – **nur nicht-kommerzielle Nutzung** |
| [NASA Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu) (Caltech/NASA) | Exoplaneten-Katalog `public/data/exoplanets.json` | frei mit Quellenangabe – *„This research has made use of the NASA Exoplanet Archive, which is operated by the California Institute of Technology, under contract with the National Aeronautics and Space Administration under the Exoplanet Exploration Program.“* |
| [NASA/JPL Small-Body Database](https://ssd.jpl.nasa.gov/tools/sbdb_query.html) und [Horizons](https://ssd.jpl.nasa.gov/horizons/) | Bahnen von Asteroiden und Kometen, Raumsonden und Saturnmonden (`public/data/`) | NASA/JPL, frei mit Quellenangabe |
| ESA Hipparcos über [VizieR](https://vizier.cds.unistra.fr) und [SIMBAD](https://simbad.cds.unistra.fr) (CDS, Straßburg) | Nachbarsterne `public/data/neighbors.json`, Koordinaten der Beobachtungslisten und Galerie-Verknüpfungen | frei mit Quellenangabe: *„This research has made use of the SIMBAD database and the VizieR catalogue access tool, CDS, Strasbourg, France.“* |
| [IAU/USGS Gazetteer of Planetary Nomenclature](https://planetarynames.wr.usgs.gov) und [LROC](https://www.lroc.asu.edu) (Landeplätze) | Namen und Positionen im Mondatlas | gemeinfrei (USGS) / NASA |
| [NASA SVS CGI Moon Kit](https://svs.gsfc.nasa.gov/4720) (LRO) | Mondtextur `public/textures/moon.jpg` | gemeinfrei (NASA) |
| [NASA Image and Video Library](https://images.nasa.gov) | Bilder der Galerie (verlinkt, nicht im Repository); Bildnachweis je Bild in der App | NASA-Mediennutzungsrichtlinien; Bilder mit ESA/CSA-Beteiligung zusätzlich nach deren Bedingungen |

Zur Laufzeit abgerufen (nicht im Repository enthalten): Open-Meteo Wetter und Luftqualität (CC BY 4.0), BigDataCloud, CelesTrak (aktive Satelliten, ISS), The Space Devs (Launch Library 2, inkl. Livestream-Links), NASA (Image of the Day, SDO, DSN Now, NeoWs), NOAA SWPC, Spaceflight News API. Kartenlinks führen zu OpenStreetMap.

Inhalte wie Lexikon, Mythen, Lernpfade, Beobachtungstipps und „Heute in der Raumfahrtgeschichte“ sind eigene Texte; Fakten wurden mit Wikipedia, NASA- und ESA-Quellen abgeglichen.

## Bibliotheken

| Paket | Lizenz |
| --- | --- |
| [astronomy-engine](https://github.com/cosinekitty/astronomy) | MIT |
| [three.js](https://threejs.org) | MIT |
| [satellite.js](https://github.com/shashwatak/satellite-js) | MIT |
| [React](https://react.dev) | MIT |
| [supabase-js](https://github.com/supabase/supabase-js) (mit auth-js, postgrest-js, storage-js, functions-js, realtime-js, phoenix) | MIT |
| [web-push](https://github.com/web-push-libs/web-push) – nur in der Edge Function auf dem Server | MPL-2.0 |
| [d3-geo](https://github.com/d3/d3-geo), [topojson-client](https://github.com/topojson/topojson-client) | ISC |
| [Lucide](https://lucide.dev) | ISC |
| [Inter](https://rsms.me/inter/), [Space Grotesk](https://github.com/floriankarsten/space-grotesk) über Fontsource | SIL Open Font License 1.1 |

## d3-celestial – BSD-3-Clause

Copyright (c) 2015, Olaf Frohn
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
