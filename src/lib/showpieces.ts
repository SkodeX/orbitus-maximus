// Ausgewählte Himmelsobjekte, die sich besonders lohnen (J2000-Koordinaten in Grad)
import type { Equipment } from './astro';

export interface Showpiece {
  id: string;
  ra: number;
  dec: number;
  mag: number;
  eye: Equipment;
  de: { name: string; type: string; text: string };
  en: { name: string; type: string; text: string };
}

export const SHOWPIECES: Showpiece[] = [
  {
    id: 'M31', ra: 10.68, dec: 41.27, mag: 3.4, eye: 'naked',
    de: { name: 'Andromedagalaxie', type: 'Spiralgalaxie', text: 'Die nächste große Galaxie – ihr Licht ist 2,5 Millionen Jahre zu dir unterwegs.' },
    en: { name: 'Andromeda Galaxy', type: 'Spiral galaxy', text: 'The nearest large galaxy – its light has travelled 2.5 million years to reach you.' },
  },
  {
    id: 'M45', ra: 56.75, dec: 24.12, mag: 1.6, eye: 'naked',
    de: { name: 'Plejaden', type: 'Offener Sternhaufen', text: 'Das „Siebengestirn“: junge, bläuliche Sterne, schön im Fernglas.' },
    en: { name: 'Pleiades', type: 'Open cluster', text: 'The "Seven Sisters": young blue stars, stunning in binoculars.' },
  },
  {
    id: 'M42', ra: 83.82, dec: -5.39, mag: 4.0, eye: 'naked',
    de: { name: 'Orionnebel', type: 'Sternentstehungsgebiet', text: 'Eine Sternenwiege, in der gerade neue Sonnen entstehen.' },
    en: { name: 'Orion Nebula', type: 'Star-forming region', text: 'A stellar nursery where new suns are being born right now.' },
  },
  {
    id: 'NGC869', ra: 35.0, dec: 57.13, mag: 4.3, eye: 'binoculars',
    de: { name: 'h und χ Persei', type: 'Doppelsternhaufen', text: 'Zwei funkelnde Sternhaufen direkt nebeneinander.' },
    en: { name: 'Double Cluster', type: 'Double open cluster', text: 'Two glittering star clusters side by side.' },
  },
  {
    id: 'M44', ra: 130.1, dec: 19.98, mag: 3.7, eye: 'naked',
    de: { name: 'Krippe (Praesepe)', type: 'Offener Sternhaufen', text: 'Ein Nebelfleck mit bloßem Auge, im Fernglas Dutzende Sterne.' },
    en: { name: 'Beehive Cluster', type: 'Open cluster', text: 'A hazy patch to the eye, dozens of stars in binoculars.' },
  },
  {
    id: 'M13', ra: 250.42, dec: 36.46, mag: 5.8, eye: 'binoculars',
    de: { name: 'Herkuleshaufen', type: 'Kugelsternhaufen', text: 'Rund 300.000 Sterne, dicht gepackt zu einer leuchtenden Kugel.' },
    en: { name: 'Hercules Cluster', type: 'Globular cluster', text: 'About 300,000 stars packed into a glowing ball.' },
  },
  {
    id: 'M33', ra: 23.46, dec: 30.66, mag: 5.7, eye: 'binoculars',
    de: { name: 'Dreiecksgalaxie', type: 'Spiralgalaxie', text: 'Zartes Leuchten, das unter wirklich dunklem Himmel auftaucht.' },
    en: { name: 'Triangulum Galaxy', type: 'Spiral galaxy', text: 'A faint glow that appears under truly dark skies.' },
  },
  {
    id: 'M8', ra: 270.92, dec: -24.38, mag: 6.0, eye: 'binoculars',
    de: { name: 'Lagunennebel', type: 'Emissionsnebel', text: 'Leuchtende Gaswolke im Herzen der Milchstraße.' },
    en: { name: 'Lagoon Nebula', type: 'Emission nebula', text: 'A glowing gas cloud near the heart of the Milky Way.' },
  },
  {
    id: 'M7', ra: 268.47, dec: -34.79, mag: 3.3, eye: 'naked',
    de: { name: 'Ptolemäus-Haufen', type: 'Offener Sternhaufen', text: 'Schon in der Antike beschrieben – hell und groß.' },
    en: { name: "Ptolemy's Cluster", type: 'Open cluster', text: 'Described since antiquity – big and bright.' },
  },
  {
    id: 'M22', ra: 279.1, dec: -23.9, mag: 5.1, eye: 'binoculars',
    de: { name: 'M22', type: 'Kugelsternhaufen', text: 'Einer der hellsten Kugelsternhaufen am ganzen Himmel.' },
    en: { name: 'M22', type: 'Globular cluster', text: 'One of the brightest globular clusters in the sky.' },
  },
  {
    id: 'M27', ra: 299.9, dec: 22.72, mag: 7.5, eye: 'binoculars',
    de: { name: 'Hantelnebel', type: 'Planetarischer Nebel', text: 'Die abgestoßene Hülle eines sterbenden Sterns.' },
    en: { name: 'Dumbbell Nebula', type: 'Planetary nebula', text: 'The cast-off shell of a dying star.' },
  },
  {
    id: 'M57', ra: 283.4, dec: 33.03, mag: 8.8, eye: 'telescope',
    de: { name: 'Ringnebel', type: 'Planetarischer Nebel', text: 'Ein kosmischer Rauchring – im Teleskop unverwechselbar.' },
    en: { name: 'Ring Nebula', type: 'Planetary nebula', text: 'A cosmic smoke ring – unmistakable in a telescope.' },
  },
  {
    id: 'M81', ra: 148.89, dec: 69.07, mag: 6.9, eye: 'binoculars',
    de: { name: 'Bodes Galaxie', type: 'Spiralgalaxie', text: 'Zusammen mit M82 ein schönes Galaxienpaar im Großen Bären.' },
    en: { name: "Bode's Galaxy", type: 'Spiral galaxy', text: 'Forms a lovely galaxy pair with M82 in the Great Bear.' },
  },
  {
    id: 'M51', ra: 202.47, dec: 47.2, mag: 8.4, eye: 'telescope',
    de: { name: 'Whirlpool-Galaxie', type: 'Spiralgalaxie', text: 'Eine Galaxie, die gerade mit ihrer Nachbarin verschmilzt.' },
    en: { name: 'Whirlpool Galaxy', type: 'Spiral galaxy', text: 'A galaxy caught in the act of merging with its neighbour.' },
  },
  {
    id: 'NGC5139', ra: 201.7, dec: -47.48, mag: 3.7, eye: 'naked',
    de: { name: 'Omega Centauri', type: 'Kugelsternhaufen', text: 'Der größte Kugelsternhaufen der Milchstraße (Südhimmel).' },
    en: { name: 'Omega Centauri', type: 'Globular cluster', text: "The Milky Way's largest globular cluster (southern sky)." },
  },
  {
    id: 'NGC104', ra: 6.02, dec: -72.08, mag: 4.1, eye: 'naked',
    de: { name: '47 Tucanae', type: 'Kugelsternhaufen', text: 'Ein Juwel des Südhimmels neben der Kleinen Magellanschen Wolke.' },
    en: { name: '47 Tucanae', type: 'Globular cluster', text: 'A southern-sky jewel next to the Small Magellanic Cloud.' },
  },
];
