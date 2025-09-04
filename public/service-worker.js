const CACHE_NAME = 'eventhub-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  const cacheAllowlist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheAllowlist.includes(cacheName)) {
            console.log('Service Worker: Clearing old cache');
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  // Check if request is made by chrome extensions or web page
  if (!(event.request.url.startsWith('http'))) return;

  // Network first, then cache strategy for API calls
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone the response
          const responseClone = response.clone();
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              // Add response to cache
              cache.put(event.request, responseClone);
            });
            
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    // Cache first, then network for static assets
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request)
            .then((fetchResponse) => {
              // Clone the response
              const responseClone = fetchResponse.clone();
              
              caches.open(CACHE_NAME)
                .then((cache) => {
                  // Add response to cache
                  cache.put(event.request, responseClone);
                });
                
              return fetchResponse;
            });
        })
        .catch(() => {
          // If both cache and network fail, serve offline page if it's a page request
          if (event.request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
        })
    );
  }
});

// Push notification event
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: 'logo192.png',
    badge: 'logo192.png',
    data: {
      url: data.url
    },
    vibrate: [100, 50, 100],
    actions: data.actions || []
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action) {
    // Handle action button clicks
    console.log(`Action clicked: ${event.action}`);
  } else {
    // Handle notification click
    const urlToOpen = event.notification.data.url || '/';
    
    event.waitUntil(
      clients.matchAll({type: 'window'})
        .then((clientList) => {
          // Check if there is already a window/tab open with the target URL
          for (const client of clientList) {
            if (client.url === urlToOpen && 'focus' in client) {
              return client.focus();
            }
          }
          // If no window/tab is open, open new one
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  }
});
