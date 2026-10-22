import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // Relative Pfade, damit die App auch unter github.io/<repo>/ läuft
  base: './',
  server: { port: 5173, host: true },
  // three.js steckt in einem eigenen, nachgeladenen Paket von gut 600 kB
  build: { chunkSizeWarningLimit: 800 },
  define: { __APP_VERSION__: JSON.stringify(process.env.npm_package_version ?? '0.1.0') },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon-180x180.png', 'logo.svg'],
      manifest: {
        name: 'Orbitus Maximus',
        short_name: 'Orbitus',
        description: 'Dein interaktiver Weltraum: Sternkarte, Heute-Nacht-Planer und mehr.',
        lang: 'de',
        theme_color: '#05060f',
        background_color: '#05060f',
        display: 'standalone',
        orientation: 'any',
        start_url: './',
        scope: './',
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,ico,woff2}'],
        // Push-Empfang (public/push-sw.js) in den generierten Service Worker einbinden
        importScripts: ['push-sw.js'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.open-meteo\.com\/.*/,
            handler: 'NetworkFirst',
            options: { cacheName: 'weather', expiration: { maxEntries: 20, maxAgeSeconds: 6 * 3600 } },
          },
          {
            urlPattern: /^https:\/\/geocoding-api\.open-meteo\.com\/.*/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'geocoding', expiration: { maxEntries: 60, maxAgeSeconds: 30 * 86400 } },
          },
        ],
      },
    }),
  ],
});
