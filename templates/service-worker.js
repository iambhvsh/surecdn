const CACHE_NAME = 'smoothx';
const urlsToCache = [
  '/index.html',
  'https://cdn.jsdelivr.net/gh/iambhvsh/surecdn/templates/css/smoothx.css',
  'https://cdn.jsdelivr.net/gh/iambhvsh/surecdn/templates/js/smoothx.js',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSL6VZWGiWn_LdaW-Pi1c3C_HDuVGuRHiTtU2sVNCxfBKN_2cBfOiUTHXs3&s=10',
  'https://cdn.jsdelivr.net/gh/iambhvsh/surecdn/templates/data.json',
  'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js',
  'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js'
];

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
      // Cache hit - return response
      if (response) {
        return response;
      }

      // Clone the request to fetch from the network
      const fetchRequest = event.request.clone();

      return fetch(fetchRequest).then(
        response => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response to cache it
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
});