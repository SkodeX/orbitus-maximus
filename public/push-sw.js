// Wird in den generierten Service Worker eingebunden (siehe vite.config.ts → workbox.importScripts).
// Zeigt eingehende Push-Nachrichten an und öffnet beim Antippen die passende Seite der App.

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: 'Orbitus Maximus', body: event.data ? event.data.text() : '' };
  }
  const scope = self.registration.scope;
  event.waitUntil(
    self.registration.showNotification(data.title || 'Orbitus Maximus', {
      body: data.body || '',
      icon: scope + 'pwa-192x192.png',
      badge: scope + 'pwa-64x64.png',
      tag: data.tag,
      data: { url: data.url || '' },
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const scope = self.registration.scope;
  const target = scope + (event.notification.data && event.notification.data.url ? event.notification.data.url : '');
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if (client.url.startsWith(scope) && 'focus' in client) {
          client.navigate(target);
          return client.focus();
        }
      }
      return self.clients.openWindow(target);
    }),
  );
});
