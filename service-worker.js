const CACHE_NAME = 'chapter-images-cache-v1';
const IMAGE_CACHE = 'image-cache';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker installed and cache created.');
      return cache.addAll([]); // Add any initial resources if needed
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          console.log(`Serving image from cache: ${event.request.url}`);
          return response; // Serve the image from the cache
        }
        return fetch(event.request).then((networkResponse) => {
          return caches.open(IMAGE_CACHE).then((cache) => {
            cache.put(event.request, networkResponse.clone()); // Cache the image
            console.log(`Image cached: ${event.request.url}`);
            return networkResponse;
          });
        });
      })
    );
  }
});
