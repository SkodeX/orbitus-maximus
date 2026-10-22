// Bereitet die NASA-Planetentexturen (nasa/NASA-3D-Resources, gemeinfrei) für die App auf.
// Aufruf: node scripts/build-textures.mjs <Ordner mit den Original-JPGs> [--preview <kontaktbogen.jpg>]
// Schreibt verkleinerte Texturen nach public/textures/.
import sharp from 'sharp';
import { mkdirSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const [src, flag, previewOut] = process.argv.slice(2);
if (!src) {
  console.error('Bitte den Ordner mit den Original-Texturen angeben.');
  process.exit(1);
}
const files = readdirSync(src).filter((f) => f.endsWith('.jpg'));

if (flag === '--preview') {
  const tiles = await Promise.all(files.map((f) => sharp(join(src, f)).resize(360, 180, { fit: 'fill' }).toBuffer()));
  const cols = 3;
  const rows = Math.ceil(tiles.length / cols);
  await sharp({ create: { width: cols * 370, height: rows * 190, channels: 3, background: '#111' } })
    .composite(tiles.map((input, i) => ({ input, left: (i % cols) * 370 + 5, top: Math.floor(i / cols) * 190 + 5 })))
    .jpeg({ quality: 80 })
    .toFile(previewOut);
  console.log(`Kontaktbogen: ${files.join(', ')}`);
  process.exit(0);
}

const out = join(root, 'public', 'textures');
mkdirSync(out, { recursive: true });
for (const f of files) {
  const target = join(out, f);
  // Höchstens 2048 × 1024, nie hochskalieren
  await sharp(join(src, f))
    .resize(2048, 1024, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 84, progressive: true, mozjpeg: true })
    .toFile(target);
  console.log(`${f}: ${(statSync(target).size / 1024).toFixed(0)} KB`);
}
