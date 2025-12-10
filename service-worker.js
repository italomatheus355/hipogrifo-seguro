// service-worker.js - ATUALIZADO
const CACHE_NAME = 'hipogrifo-v4'; 
const FILES_TO_CACHE = [
  '.',
  './index.html',
  './instrucoes.html', 
  './checklist.html', 
  './thankyou.html',
  './app.css',
  './app.js',
  './nova_logo_engrenagem.png', // NOVA LOGO
  './manifest.json'
];

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)));
    })
  );
  evt.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (evt) => {
  evt.respondWith(
    caches.match(evt.request).then((res) => {
      return res || fetch(evt.request);
    })
  );
});