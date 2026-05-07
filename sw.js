const CACHE = 'kegel-spiele-v2';
const FILES = ['./spiele.html', './manifest.json', './icons/icon-192.png', './icons/icon-512.png'];

// Install: cache new files and skip waiting immediately
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting(); // take over without waiting for old SW to die
});

// Activate: delete ALL old caches, then claim clients
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim()) // take control of all open tabs now
  );
});

// Fetch: serve from cache, fall back to network
// index.html is NOT in the cache — always fetched fresh from network
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
