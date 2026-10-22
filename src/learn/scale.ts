// Daten für „Größen & Distanzen“: Stationen der Skalenreise und Ziele/Fahrzeuge des Reisezeit-Rechners
const LY_M = 9.4607e15;
const AU_M = 1.495978707e11;

export interface ScaleStop {
  id: string;
  /** Durchmesser bzw. Ausdehnung in Metern */
  meters: number;
  de: { name: string; fact: string };
  en: { name: string; fact: string };
}

export const SCALE_STOPS: ScaleStop[] = [
  { id: 'human', meters: 1.7, de: { name: 'Ein Mensch', fact: 'Unser Ausgangspunkt: rund 1,7 Meter.' }, en: { name: 'A human', fact: 'Our starting point: about 1.7 metres.' } },
  { id: 'football', meters: 105, de: { name: 'Ein Fußballfeld', fact: 'Etwa 60 Menschen hintereinander.' }, en: { name: 'A football pitch', fact: 'About 60 people lying head to toe.' } },
  { id: 'everest', meters: 8_849, de: { name: 'Mount Everest', fact: 'Der höchste Berg der Erde ragt 8.849 Meter über den Meeresspiegel.' }, en: { name: 'Mount Everest', fact: 'Earth’s highest mountain rises 8,849 metres above sea level.' } },
  { id: 'moon', meters: 3.4748e6, de: { name: 'Der Mond', fact: 'Sein Durchmesser ist etwas kleiner als die Breite Australiens.' }, en: { name: 'The Moon', fact: 'Its diameter is a little less than the width of Australia.' } },
  { id: 'earth', meters: 1.2742e7, de: { name: 'Die Erde', fact: 'Knapp vier Monde passen nebeneinander auf ihren Durchmesser.' }, en: { name: 'Earth', fact: 'Almost four Moons fit side by side across it.' } },
  { id: 'jupiter', meters: 1.3982e8, de: { name: 'Jupiter', fact: 'Elf Erden passen nebeneinander in seinen Durchmesser.' }, en: { name: 'Jupiter', fact: 'Eleven Earths fit side by side across it.' } },
  { id: 'moon-orbit', meters: 7.688e8, de: { name: 'Die Mondbahn', fact: 'Der Mond kreist in 384.400 km Abstand – die ganze Bahn würde in die Sonne passen.' }, en: { name: 'The Moon’s orbit', fact: 'The Moon circles 384,400 km away – its whole orbit would fit inside the Sun.' } },
  { id: 'sun', meters: 1.3927e9, de: { name: 'Die Sonne', fact: '109 Erden nebeneinander ergeben ihren Durchmesser.' }, en: { name: 'The Sun', fact: '109 Earths side by side span its diameter.' } },
  { id: 'earth-orbit', meters: 2 * AU_M, de: { name: 'Die Erdbahn', fact: 'Licht braucht gut 16 Minuten, um sie zu durchqueren.' }, en: { name: 'Earth’s orbit', fact: 'Light needs just over 16 minutes to cross it.' } },
  { id: 'solar-system', meters: 60.1 * AU_M, de: { name: 'Das Sonnensystem bis Neptun', fact: 'Licht braucht über 8 Stunden von einer Seite zur anderen.' }, en: { name: 'The solar system out to Neptune', fact: 'Light takes over 8 hours to cross from one side to the other.' } },
  { id: 'proxima', meters: 4.24 * LY_M, de: { name: 'Bis zum nächsten Stern', fact: 'Proxima Centauri ist 4,2 Lichtjahre entfernt – die Sonde Voyager 1 bräuchte über 70.000 Jahre.' }, en: { name: 'To the nearest star', fact: 'Proxima Centauri is 4.2 light-years away – Voyager 1 would need over 70,000 years.' } },
  { id: 'milky-way', meters: 1e5 * LY_M, de: { name: 'Die Milchstraße', fact: 'Unsere Galaxie: eine Scheibe mit 100 bis 400 Milliarden Sternen.' }, en: { name: 'The Milky Way', fact: 'Our galaxy: a disc of 100 to 400 billion stars.' } },
  { id: 'local-group', meters: 1e7 * LY_M, de: { name: 'Die Lokale Gruppe', fact: 'Über 80 Galaxien, darunter Andromeda und die Milchstraße.' }, en: { name: 'The Local Group', fact: 'More than 80 galaxies, including Andromeda and the Milky Way.' } },
  { id: 'universe', meters: 9.3e10 * LY_M, de: { name: 'Das beobachtbare Universum', fact: 'Rund 93 Milliarden Lichtjahre – weiter können wir nicht blicken.' }, en: { name: 'The observable universe', fact: 'About 93 billion light-years across – we can’t see any farther.' } },
];

export interface Destination {
  id: string;
  km: number;
  de: string;
  en: string;
}

const LY_KM = LY_M / 1000;
export const DESTINATIONS: Destination[] = [
  { id: 'moon', km: 384_400, de: 'Mond', en: 'Moon' },
  { id: 'sun', km: 149_600_000, de: 'Sonne', en: 'Sun' },
  { id: 'mars', km: 225_000_000, de: 'Mars (im Mittel)', en: 'Mars (average)' },
  { id: 'jupiter', km: 778_000_000, de: 'Jupiter (im Mittel)', en: 'Jupiter (average)' },
  { id: 'neptune', km: 4_500_000_000, de: 'Neptun', en: 'Neptune' },
  { id: 'proxima', km: 4.24 * LY_KM, de: 'Proxima Centauri', en: 'Proxima Centauri' },
  { id: 'center', km: 26_000 * LY_KM, de: 'Zentrum der Milchstraße', en: 'Milky Way centre' },
  { id: 'andromeda', km: 2.5e6 * LY_KM, de: 'Andromedagalaxie', en: 'Andromeda Galaxy' },
];

export interface Vehicle {
  id: string;
  kmh: number;
  de: string;
  en: string;
}

export const VEHICLES: Vehicle[] = [
  { id: 'walk', kmh: 5, de: 'Zu Fuß', en: 'On foot' },
  { id: 'car', kmh: 100, de: 'Auto', en: 'Car' },
  { id: 'plane', kmh: 900, de: 'Flugzeug', en: 'Airliner' },
  { id: 'iss', kmh: 27_600, de: 'ISS-Tempo', en: 'ISS speed' },
  { id: 'parker', kmh: 690_000, de: 'Parker Solar Probe', en: 'Parker Solar Probe' },
  { id: 'light', kmh: 1_079_252_849, de: 'Lichtgeschwindigkeit', en: 'Speed of light' },
];

export const LIGHT_YEAR_M = LY_M;
export const AU_METERS = AU_M;
