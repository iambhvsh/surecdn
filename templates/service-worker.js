const CACHE_NAME = 'smoothx-cache-v1';
const CACHE_EXPIRATION_MS = 259200000; // 3 days
const MAX_CACHE_SIZE = 50; // maximum number of cache entries
const OFFLINE_URL = '/offline.html';

const resourcesToCache = [
  '/start/index.html',
  '/css/smoothx.css',
  '/js/smoothx.js',
  'https://cdn.tailwindcss.com',
  '/working/index.html',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSL6VZWGiWn_LdaW-Pi1c3C_HDuVGuRHiTtU2sVNCxfBKN_2cBfOiUTHXs3&s=10',
  '/data.json',
  'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js',
  'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js',
  'https://surecdn.vercel.app/templates/fonts/OnePlusSans3.0En-VF.ttf',
  'https://surecdn.vercel.app/templates/fonts/OnePlusSans3.0En-VF.woff',
  'https://surecdn.vercel.app/templates/fonts/OnePlusSansDisplay-45Lt.woff',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(resourcesToCache);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  if (url.origin === location.origin) {
    if (url.pathname === '/') {
      event.respondWith(caches.match(OFFLINE_URL));
      return;
    }
  }

  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then(networkResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(request, networkResponse.clone());
          enforceCacheSizeLimit(CACHE_NAME, MAX_CACHE_SIZE);
          return networkResponse;
        });
      }).catch(() => {
        return caches.match(OFFLINE_URL);
      });
    })
  );
});

function enforceCacheSizeLimit(cacheName, maxItems) {
  caches.open(cacheName).then(cache => {
    cache.keys().then(keys => {
      if (keys.length > maxItems) {
        cache.delete(keys[0]).then(enforceCacheSizeLimit(cacheName, maxItems));
      }
    });
  });
}
