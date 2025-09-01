// public/sw.js
self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
});

self.addEventListener('fetch', (event) => {
  // For now, we are letting the network handle all fetch requests.
  // Firebase offline persistence handles the offline data caching.
  event.respondWith(fetch(event.request));
});