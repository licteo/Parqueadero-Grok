const CACHE = 'park-smart-v1';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll([
      '/',
      '/park-smart-pwa/index.html',
      '/park-smart-pwa/style.css',
      '/park-smart-pwa/script.js',
      '/park-smart-pwa/manifest.json'
    ]))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});