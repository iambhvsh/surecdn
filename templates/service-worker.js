const CACHE_NAME = 'smoothx';
const urlsToCache = [
  'https://surecdn.vercel.app/templates/css/smoothx.css',
  'https://cdn.tailwindcss.com',
  'https://surecdn.vercel.app/templates/js/smoothx.js',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSL6VZWGiWn_LdaW-Pi1c3C_HDuVGuRHiTtU2sVNCxfBKN_2cBfOiUTHXs3&s=10',
  'https://surecdn.vercel.app/templates/data.json',
  'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js',
  'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js'
];

const LOCAL_STORAGE_KEY = 'cacheTimestamp';
const CACHE_EXPIRATION_MS = 3 * 60 * 60 * 1000;

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }

        const fetchRequest = event.request.clone();
        return fetch(fetchRequest).then(
          response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  cleanupCache();
});

function cleanupCache() {
  const timestamp = localStorage.getItem(LOCAL_STORAGE_KEY);
  const now = Date.now();

  if (!timestamp || (now - timestamp > CACHE_EXPIRATION_MS)) {
    caches.keys().then(cacheNames => {
      cacheNames.forEach(cacheName => {
        caches.delete(cacheName);
      });
    });
    localStorage.setItem(LOCAL_STORAGE_KEY, now);
  }
}
