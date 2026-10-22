// satellite.js ohne den WebAssembly-Teil: Der Paket-Einstieg lädt zusätzlich eine WASM-Variante mit
// Worker und Top-Level-await, die wir nicht brauchen und die sich nicht in die PWA bündeln lässt.
// Deshalb werden hier nur die reinen JavaScript-Module direkt eingebunden.
export { twoline2satrec } from '../../../node_modules/satellite.js/dist/io.js';
export { propagate, gstime } from '../../../node_modules/satellite.js/dist/propagation.js';
export { jday } from '../../../node_modules/satellite.js/dist/ext.js';
export {
  degreesLat,
  degreesLong,
  degreesToRadians,
  eciToGeodetic,
  eciToEcf,
  ecfToEci,
  ecfToLookAngles,
  geodeticToEcf,
} from '../../../node_modules/satellite.js/dist/transforms.js';
export { sunPos } from '../../../node_modules/satellite.js/dist/sun.js';
export { shadowFraction } from '../../../node_modules/satellite.js/dist/shadow.js';
export type { SatRec } from '../../../node_modules/satellite.js/dist/propagation/SatRec.js';
export type { EciVec3 } from '../../../node_modules/satellite.js/dist/common-types.js';
