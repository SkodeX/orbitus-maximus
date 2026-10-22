import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config';

// Das Logo hat einen eigenen dunklen Hintergrund, daher kein zusätzlicher Rand
const dark = { background: '#05060f', fit: 'contain' };

export default defineConfig({
  headLinkOptions: { preset: '2023' },
  preset: {
    ...minimal2023Preset,
    transparent: { ...minimal2023Preset.transparent, padding: 0 },
    maskable: { ...minimal2023Preset.maskable, padding: 0, resizeOptions: dark },
    apple: { ...minimal2023Preset.apple, padding: 0, resizeOptions: dark },
  },
  images: ['public/logo.svg'],
});
