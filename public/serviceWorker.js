import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

// Precache and route the files specified in the Webpack manifest
precacheAndRoute(self.__WB_MANIFEST);

/**
 * Caches page navigations (HTML) using a Stale While Revalidate strategy.
 * This allows for quicker loading of pages while ensuring users see the latest content.
 */
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new StaleWhileRevalidate({
    cacheName: 'pages',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

/**
 * Caches images using a Cache First strategy.
 * This will prioritize loading images from the cache, falling back to the network if not found.
 */
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  })
);

/**
 * Caches Firebase data with a Stale While Revalidate strategy.
 * This allows data to be cached and updated in the background for faster access.
 */
registerRoute(
  ({ url }) => url.origin === 'https://firestore.googleapis.com',
  new StaleWhileRevalidate({
    cacheName: 'firebase-data',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

/**
 * Handles offline fallback for navigation requests.
 * If a network request fails, it will return the offline page.
 */
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/offline.html');
      })
    );
  }
});

/**
 * Listens for the 'message' event to handle updates from the client.
 * Allows the service worker to skip waiting and activate immediately.
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
