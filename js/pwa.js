// PWA Manager - Phase 4.1: Progressive Web App Features
class PWAManager {
  constructor() {
    this.deferredPrompt = null;
    this.isInstalled = false;
    this.isOnline = navigator.onLine;
    this.serviceWorkerRegistration = null;
    
    this.init();
  }

  async init() {
    console.log('🚀 Initializing PWA Manager...');
    
    try {
      // Register service worker
      await this.registerServiceWorker();
      
      // Setup PWA install prompt
      this.setupInstallPrompt();
      
      // Setup offline/online detection
      this.setupNetworkDetection();
      
      // Setup background sync
      this.setupBackgroundSync();
      
      // Setup push notifications
      this.setupPushNotifications();
      
      // Check if already installed
      this.checkInstallStatus();
      
      console.log('✅ PWA Manager initialized successfully');
    } catch (error) {
      console.error('❌ PWA Manager initialization failed:', error);
    }
  }

  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        console.log('📦 Registering service worker...');
        
        this.serviceWorkerRegistration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });
        
        console.log('✅ Service worker registered:', this.serviceWorkerRegistration.scope);
        
        // Handle service worker updates
        this.serviceWorkerRegistration.addEventListener('updatefound', () => {
          console.log('🔄 Service worker update found');
          this.handleServiceWorkerUpdate();
        });
        
        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
          this.handleServiceWorkerMessage(event);
        });
        
      } catch (error) {
        console.error('❌ Service worker registration failed:', error);
        throw error;
      }
    } else {
      console.warn('⚠️ Service workers not supported');
    }
  }

  setupInstallPrompt() {
    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (event) => {
      console.log('📱 PWA install prompt available');
      
      // Prevent the mini-infobar from appearing
      event.preventDefault();
      
      // Store the event for later use
      this.deferredPrompt = event;
      
      // Show custom install banner
      this.showInstallBanner();
    });

    // Listen for app installed event
    window.addEventListener('appinstalled', (event) => {
      console.log('✅ PWA installed successfully');
      this.isInstalled = true;
      this.hideInstallBanner();
      
      // Track installation
      if (window.app && window.app.analytics) {
        window.app.analytics.trackEvent('pwa_installed');
      }
      
      // Show success notification
      if (window.app) {
        window.app.showNotification('App installed successfully! 🎉', 'success');
      }
    });
  }

  showInstallBanner() {
    // Create install banner if it doesn't exist
    let banner = document.getElementById('pwaInstallBanner');
    
    if (!banner) {
      banner = this.createInstallBanner();
      document.body.appendChild(banner);
    }
    
    // Show banner with animation
    setTimeout(() => {
      banner.classList.add('show');
    }, 1000);
  }

  createInstallBanner() {
    const banner = document.createElement('div');
    banner.id = 'pwaInstallBanner';
    banner.className = 'pwa-install-banner';
    
    banner.innerHTML = `
      <div class="pwa-install-content">
        <div class="pwa-install-icon">📱</div>
        <div class="pwa-install-text">
          <div class="pwa-install-title">Install AI Pro Tracker</div>
          <div class="pwa-install-subtitle">Get quick access and offline features</div>
        </div>
      </div>
      <div class="pwa-install-actions">
        <button class="pwa-install-btn" id="dismissInstall">Later</button>
        <button class="pwa-install-btn primary" id="installPWA">Install</button>
      </div>
    `;
    
    // Add event listeners
    banner.querySelector('#installPWA').addEventListener('click', () => {
      this.installPWA();
    });
    
    banner.querySelector('#dismissInstall').addEventListener('click', () => {
      this.hideInstallBanner();
    });
    
    return banner;
  }

  async installPWA() {
    if (!this.deferredPrompt) {
      console.warn('⚠️ No install prompt available');
      return;
    }

    try {
      console.log('📱 Showing PWA install prompt...');
      
      // Show the install prompt
      this.deferredPrompt.prompt();
      
      // Wait for the user's response
      const { outcome } = await this.deferredPrompt.userChoice;
      
      console.log(`👤 User choice: ${outcome}`);
      
      if (outcome === 'accepted') {
        console.log('✅ User accepted PWA install');
      } else {
        console.log('❌ User dismissed PWA install');
      }
      
      // Clear the prompt
      this.deferredPrompt = null;
      this.hideInstallBanner();
      
    } catch (error) {
      console.error('❌ PWA install failed:', error);
    }
  }

  hideInstallBanner() {
    const banner = document.getElementById('pwaInstallBanner');
    if (banner) {
      banner.classList.remove('show');
      setTimeout(() => {
        banner.remove();
      }, 300);
    }
  }

  setupNetworkDetection() {
    // Create offline indicator
    this.createOfflineIndicator();
    
    // Listen for online/offline events
    window.addEventListener('online', () => {
      console.log('🌐 Back online');
      this.isOnline = true;
      this.hideOfflineIndicator();
      this.syncWhenOnline();
      
      if (window.app) {
        window.app.showNotification('Back online! 🌐', 'success');
      }
    });

    window.addEventListener('offline', () => {
      console.log('📵 Gone offline');
      this.isOnline = false;
      this.showOfflineIndicator();
      
      if (window.app) {
        window.app.showNotification('You are offline. Some features may be limited.', 'warning');
      }
    });
    
    // Initial status check
    if (!this.isOnline) {
      this.showOfflineIndicator();
    }
  }

  createOfflineIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'offlineIndicator';
    indicator.className = 'offline-indicator';
    indicator.innerHTML = '📵 You are offline';
    
    document.body.appendChild(indicator);
  }

  showOfflineIndicator() {
    const indicator = document.getElementById('offlineIndicator');
    if (indicator) {
      indicator.classList.add('show');
    }
  }

  hideOfflineIndicator() {
    const indicator = document.getElementById('offlineIndicator');
    if (indicator) {
      indicator.classList.remove('show');
    }
  }

  setupBackgroundSync() {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      console.log('🔄 Background sync available');
      
      // Register sync events when data needs to be synced
      this.registerSyncEvent = (tag) => {
        if (this.serviceWorkerRegistration) {
          return this.serviceWorkerRegistration.sync.register(tag);
        }
      };
    } else {
      console.warn('⚠️ Background sync not supported');
    }
  }

  async setupPushNotifications() {
    if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
      console.log('🔔 Push notifications available');
      
      // Check current permission
      const permission = await Notification.requestPermission();
      console.log('🔔 Notification permission:', permission);
      
      if (permission === 'granted') {
        this.subscribeToPushNotifications();
      }
    } else {
      console.warn('⚠️ Push notifications not supported');
    }
  }

  async subscribeToPushNotifications() {
    try {
      if (!this.serviceWorkerRegistration) {
        console.warn('⚠️ No service worker registration for push notifications');
        return;
      }

      const subscription = await this.serviceWorkerRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          // In Phase 4.2, this will be replaced with actual VAPID key
          'BEl62iUYgUivxIkv69yViEuiBIa40HI0y2HbHgYF6LnFkDjEBJDKbgwuE9qLWkWmQBDHGGmZJvKUqOKfSjOSj9Q'
        )
      });

      console.log('✅ Push notification subscription created');
      
      // In Phase 4.2, send subscription to server
      // await this.sendSubscriptionToServer(subscription);
      
    } catch (error) {
      console.error('❌ Push notification subscription failed:', error);
    }
  }

  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  checkInstallStatus() {
    // Check if running as PWA
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      console.log('✅ Running as installed PWA');
      this.isInstalled = true;
    }
    
    // Check if running in iOS Safari standalone mode
    if (window.navigator.standalone === true) {
      console.log('✅ Running as iOS PWA');
      this.isInstalled = true;
    }
  }

  handleServiceWorkerUpdate() {
    const newWorker = this.serviceWorkerRegistration.installing;
    
    if (newWorker) {
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          console.log('🔄 New service worker available');
          this.showUpdateAvailable();
        }
      });
    }
  }

  showUpdateAvailable() {
    if (window.app) {
      const notification = window.app.showNotification(
        'App update available! Refresh to get the latest features.',
        'info',
        {
          persistent: true,
          actions: [
            {
              text: 'Update Now',
              action: () => this.applyUpdate()
            },
            {
              text: 'Later',
              action: () => {} // Do nothing
            }
          ]
        }
      );
    }
  }

  async applyUpdate() {
    if (this.serviceWorkerRegistration && this.serviceWorkerRegistration.waiting) {
      // Tell the waiting service worker to skip waiting
      this.serviceWorkerRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Reload the page to use the new service worker
      window.location.reload();
    }
  }

  handleServiceWorkerMessage(event) {
    const { data } = event;
    
    if (data && data.type) {
      switch (data.type) {
        case 'CACHE_UPDATED':
          console.log('📦 Cache updated');
          break;
          
        case 'BACKGROUND_SYNC_SUCCESS':
          console.log('🔄 Background sync successful');
          if (window.app) {
            window.app.showNotification('Data synced successfully! ✅', 'success');
          }
          break;
          
        case 'BACKGROUND_SYNC_FAILED':
          console.log('❌ Background sync failed');
          break;
          
        default:
          console.log('📨 Unknown service worker message:', data);
      }
    }
  }

  async syncWhenOnline() {
    if (this.isOnline && this.registerSyncEvent) {
      try {
        // Sync usage data
        await this.registerSyncEvent('usage-sync');
        
        // Sync goals data
        await this.registerSyncEvent('goals-sync');
        
        console.log('🔄 Background sync registered');
      } catch (error) {
        console.error('❌ Background sync registration failed:', error);
      }
    }
  }

  // Utility methods for app integration
  isOffline() {
    return !this.isOnline;
  }

  isPWAInstalled() {
    return this.isInstalled;
  }

  async clearCache() {
    if (this.serviceWorkerRegistration) {
      const messageChannel = new MessageChannel();
      
      return new Promise((resolve) => {
        messageChannel.port1.onmessage = (event) => {
          resolve(event.data.success);
        };
        
        this.serviceWorkerRegistration.active.postMessage(
          { type: 'CLEAR_CACHE' },
          [messageChannel.port2]
        );
      });
    }
  }

  async getVersion() {
    if (this.serviceWorkerRegistration) {
      const messageChannel = new MessageChannel();
      
      return new Promise((resolve) => {
        messageChannel.port1.onmessage = (event) => {
          resolve(event.data.version);
        };
        
        this.serviceWorkerRegistration.active.postMessage(
          { type: 'GET_VERSION' },
          [messageChannel.port2]
        );
      });
    }
  }

  // Share API integration
  async shareApp(data = {}) {
    const shareData = {
      title: 'AI Pro Tracker',
      text: 'Track and maximize your Google AI Pro subscription usage',
      url: window.location.href,
      ...data
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log('✅ Shared successfully');
        
        if (window.app && window.app.analytics) {
          window.app.analytics.trackEvent('app_shared');
        }
      } catch (error) {
        console.log('❌ Share failed:', error);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareData.url);
        if (window.app) {
          window.app.showNotification('Link copied to clipboard! 📋', 'success');
        }
      } catch (error) {
        console.error('❌ Clipboard write failed:', error);
      }
    }
  }

  // Haptic feedback for mobile devices
  vibrate(pattern = [100]) {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }

  // Screen wake lock for important operations
  async requestWakeLock() {
    if ('wakeLock' in navigator) {
      try {
        const wakeLock = await navigator.wakeLock.request('screen');
        console.log('🔒 Screen wake lock acquired');
        return wakeLock;
      } catch (error) {
        console.error('❌ Wake lock failed:', error);
      }
    }
  }
}

// Export for use in main app
window.PWAManager = PWAManager;