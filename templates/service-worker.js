// service-worker.js

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

self.addEventListener('install', async event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(resourcesToCache);
    })()
  );
});

self.addEventListener('fetch', async event => {
  const request = event.request;
  const url = new URL(request.url);

  // Handle offline requests
  if (!navigator.onLine) {
    if (url.pathname === '/') {
      event.respondWith(caches.match(OFFLINE_URL));
    } else {
      event.respondWith(caches.match(request));
    }
    return;
  }

  // Handle cache hits
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    event.respondWith(cachedResponse);
    return;
  }

  // Handle cache misses
  try {
    const response = await fetch(request);
    event.respondWith(response);
    cache.put(request, response.clone());
  } catch (error) {
    console.error('Error fetching resource:', error);
    event.respondWith(caches.match(OFFLINE_URL));
  }
});
