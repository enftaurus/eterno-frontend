const CACHE_NAME = 'eterno-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/src/css/styles.css',
  '/src/js/app.js',
  '/src/js/utils/auth.js',
  '/src/js/utils/api.js',
  '/manifest.json'
];

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(URLS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
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
    }).then(() => self.clients.claim())
  );
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', event => {
  const { request } = event;

  // Skip API requests - let them go to network
  if (request.url.includes('/api/')) {
    return event.respondWith(
      fetch(request)
        .catch(() => new Response(
          JSON.stringify({ error: 'Offline' }), 
          { status: 503, headers: { 'Content-Type': 'application/json' } }
        ))
    );
  }

  // Cache first strategy for assets
  event.respondWith(
    caches.match(request)
      .then(response => response || fetch(request))
      .then(response => {
        if (!response) {
          return caches.match('/index.html');
        }
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(request, response.clone());
          return response;
        });
      })
      .catch(() => caches.match('/index.html'))
  );
});

// Background sync for pending operations
self.addEventListener('sync', event => {
  if (event.tag === 'sync-platforms') {
    event.waitUntil(syncPlatforms());
  }
});

async function syncPlatforms() {
  try {
    const response = await fetch('/auth/platforms', {
      method: 'POST',
      credentials: 'include'
    });
    return response.ok;
  } catch (error) {
    console.error('Background sync failed:', error);
    return false;
  }
}
