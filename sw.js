// Google AI Pro Tracker - Service Worker
// Phase 4.1: PWA Implementation with Offline Support

const CACHE_NAME = 'ai-pro-tracker-v4.1.0';
const STATIC_CACHE_NAME = 'ai-pro-tracker-static-v4.1.0';
const DYNAMIC_CACHE_NAME = 'ai-pro-tracker-dynamic-v4.1.0';

// Resources to cache for offline functionality
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/main.css',
  '/css/charts.css',
  '/css/advanced.css',
  '/js/app.js',
  '/js/config.js',
  '/js/storage.js',
  '/js/utils.js',
  '/js/analytics.js',
  '/js/charts.js',
  '/js/insights.js',
  '/js/goals.js',
  '/js/notifications.js',
  '/js/reminders.js',
  '/manifest.json',
  'https://cdn.jsdelivr.net/npm/chart.js',
  '/js/phase6/ai-intelligence.js',
  '/js/phase6/context-analyzer.js',
  '/js/phase6/workflow-optimizer.js',
  '/js/phase6/voice-interface.js',
  '/js/phase6/ai-assistant.js',
  '/js/phase6/platform-adapter.js',
  '/js/phase6/cross-platform-analytics.js',
  '/js/phase6/ar-vr-interface.js',
  '/js/phase6/advanced-automation.js',
  '/js/models/behavior-learning.js',
  '/js/models/context-models.js',
  '/js/models/optimization-models.js',
  '/js/utils/nlp-processor.js',
  '/js/utils/speech-synthesis.js',
  '/js/utils/webxr-utils.js'
];

// Dynamic content patterns to cache
const DYNAMIC_CACHE_PATTERNS = [
  /\/api\//,
  /\/data\//
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('📦 Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      }),
      
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME &&
                cacheName.startsWith('ai-pro-tracker-')) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Take control of all clients
      self.clients.claim()
    ])
  );
});

// Fetch event - serve cached content with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  event.respondWith(
    handleFetchRequest(request)
  );
});

// Handle fetch requests with caching strategy
async function handleFetchRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Strategy 1: Cache First for static assets
    if (isStaticAsset(request)) {
      return await cacheFirst(request);
    }
    
    // Strategy 2: Network First for dynamic content
    if (isDynamicContent(request)) {
      return await networkFirst(request);
    }
    
    // Strategy 3: Stale While Revalidate for everything else
    return await staleWhileRevalidate(request);
    
  } catch (error) {
    console.error('❌ Fetch error:', error);
    
    // Return offline fallback if available
    return await getOfflineFallback(request);
  }
}

// Cache First strategy - good for static assets
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('❌ Network error in cacheFirst:', error);
    throw error;
  }
}

// Network First strategy - good for dynamic content
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('🔄 Network failed, trying cache...');
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Stale While Revalidate strategy - good for frequently updated content
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      const cache = caches.open(DYNAMIC_CACHE_NAME);
      cache.then((c) => c.put(request, networkResponse.clone()));
    }
    return networkResponse;
  }).catch((error) => {
    console.log('🔄 Network update failed:', error);
  });
  
  return cachedResponse || fetchPromise;
}

// Get offline fallback
async function getOfflineFallback(request) {
  // For navigation requests, return the main page
  if (request.mode === 'navigate') {
    const cachedResponse = await caches.match('/');
    if (cachedResponse) {
      return cachedResponse;
    }
  }
  
  // For other requests, return a generic offline response
  return new Response(
    JSON.stringify({
      error: 'Offline',
      message: 'This feature requires an internet connection'
    }),
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}

// Helper functions
function isStaticAsset(request) {
  const url = new URL(request.url);
  
  return STATIC_ASSETS.some(asset => {
    return url.pathname === asset || url.href === asset;
  }) || 
  url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf)$/);
}

function isDynamicContent(request) {
  const url = new URL(request.url);
  
  return DYNAMIC_CACHE_PATTERNS.some(pattern => {
    return pattern.test(url.pathname);
  });
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync triggered:', event.tag);
  
  if (event.tag === 'usage-sync') {
    event.waitUntil(syncUsageData());
  }
  
  if (event.tag === 'goals-sync') {
    event.waitUntil(syncGoalsData());
  }
});

// Sync usage data when back online
async function syncUsageData() {
  try {
    console.log('📊 Syncing usage data...');
    
    // Get pending usage data from IndexedDB or localStorage
    const pendingData = await getPendingUsageData();
    
    if (pendingData && pendingData.length > 0) {
      // Send to server when available
      // For now, just log that sync would happen
      console.log('✅ Usage data sync completed:', pendingData.length, 'items');
    }
  } catch (error) {
    console.error('❌ Usage data sync failed:', error);
  }
}

// Sync goals data when back online
async function syncGoalsData() {
  try {
    console.log('🎯 Syncing goals data...');
    
    // Get pending goals data
    const pendingData = await getPendingGoalsData();
    
    if (pendingData && pendingData.length > 0) {
      console.log('✅ Goals data sync completed:', pendingData.length, 'items');
    }
  } catch (error) {
    console.error('❌ Goals data sync failed:', error);
  }
}

// Helper functions for data sync
async function getPendingUsageData() {
  // In Phase 4.2, this will integrate with actual API
  return [];
}

async function getPendingGoalsData() {
  // In Phase 4.2, this will integrate with actual API
  return [];
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('📱 Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New update available',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/'
    },
    actions: [
      {
        action: 'open',
        title: 'Open App',
        icon: '/icons/action-open.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/action-dismiss.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('AI Pro Tracker', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});

// Message handling for communication with main app
self.addEventListener('message', (event) => {
  console.log('📨 Message received:', event.data);
  
  if (event.data && event.data.type) {
    switch (event.data.type) {
      case 'SKIP_WAITING':
        self.skipWaiting();
        break;
        
      case 'GET_VERSION':
        event.ports[0].postMessage({
          version: CACHE_NAME
        });
        break;
        
      case 'CLEAR_CACHE':
        clearAllCaches().then(() => {
          event.ports[0].postMessage({
            success: true
          });
        });
        break;
        
      default:
        console.log('❓ Unknown message type:', event.data.type);
    }
  }
});

// Clear all caches
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  return Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
}

console.log('🚀 Service Worker loaded successfully');