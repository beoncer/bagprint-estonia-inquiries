
const CACHE_NAME = 'leatex-ee-v3.0.1';
const STATIC_CACHE = 'static-v3.0.1';
const DYNAMIC_CACHE = 'dynamic-v3.0.1';

const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/assets/category-cotton-bags.jpg',
  '/assets/category-paper-bags.jpg',
  '/assets/category-drawstring-bags.jpg',
  '/assets/category-shoe-bags.jpg'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE)
          .map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - cache strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol !== 'https:') {
    return;
  }

  // Force consistent favicon: always serve PNG bag icon for /favicon.ico
  if (url.pathname === '/favicon.ico') {
    event.respondWith(
      caches.match('/favicon-32x32.png?v=2').then((cached) => {
        if (cached) return cached;
        return fetch('/favicon-32x32.png?v=2', { cache: 'reload' }).then((resp) => {
          return caches.open(STATIC_CACHE).then((cache) => {
            cache.put('/favicon-32x32.png?v=2', resp.clone());
            return resp;
          });
        });
      })
    );
    return;
  }

  // Static assets - cache first
  if (STATIC_ASSETS.includes(url.pathname) || url.pathname.includes('/assets/')) {
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request).then((fetchResponse) => {
          return caches.open(STATIC_CACHE).then((cache) => {
            cache.put(request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
    return;
  }

  // API requests - network first
  if (url.pathname.includes('/rest/v1/') || url.pathname.includes('/storage/v1/')) {
    event.respondWith(
      fetch(request).then((response) => {
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      }).catch(() => {
        return caches.match(request);
      })
    );
    return;
  }

  // HTML pages - network first with cache fallback
  event.respondWith(
    fetch(request).then((response) => {
      if (response.ok && response.status === 200) {
        const responseClone = response.clone();
        caches.open(DYNAMIC_CACHE).then((cache) => {
          cache.put(request, responseClone);
        });
      }
      return response;
    }).catch((error) => {
      console.log('SW: Network failed, trying cache', error);
      return caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        // If no cached version, return a basic offline page
        return new Response('Page not available offline', {
          status: 200,
          headers: { 'Content-Type': 'text/html' }
        });
      });
    })
  );
});
