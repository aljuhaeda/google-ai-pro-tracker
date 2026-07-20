// API Integration Manager - Phase 4.2: Real-time Tracking & API Integration
class APIManager {
  constructor(app) {
    this.app = app;
    this.isEnabled = false;
    this.isConnected = false;
    this.apiEndpoints = {
      base: 'https://api.google.com/ai-pro', // Mock endpoint for Phase 4.2
      usage: '/usage',
      features: '/features',
      quotas: '/quotas',
      sync: '/sync'
    };
    this.authToken = null;
    this.refreshToken = null;
    this.syncInterval = null;
    this.lastSync = null;
    this.pendingRequests = new Map();
    this.rateLimitQueue = [];
    this.isRateLimited = false;
    
    this.init();
  }

  async init() {
    console.log('🔌 Initializing API Manager...');
    
    try {
      // Load saved auth tokens
      this.loadAuthTokens();
      
      // Check API availability
      await this.checkAPIAvailability();
      
      // Setup automatic sync if authenticated
      if (this.authToken) {
        this.setupAutoSync();
      }
      
      console.log('✅ API Manager initialized successfully');
    } catch (error) {
      console.error('❌ API Manager initialization failed:', error);
      this.handleConnectionError(error);
    }
  }

  loadAuthTokens() {
    const savedAuth = StorageService.get('aiProTracker_auth', {});
    this.authToken = savedAuth.accessToken;
    this.refreshToken = savedAuth.refreshToken;
    this.lastSync = savedAuth.lastSync;
    
    if (this.authToken) {
      console.log('🔑 Auth tokens loaded from storage');
    }
  }

  saveAuthTokens() {
    StorageService.set('aiProTracker_auth', {
      accessToken: this.authToken,
      refreshToken: this.refreshToken,
      lastSync: this.lastSync
    });
  }

  async checkAPIAvailability() {
    try {
      console.log('🔍 Checking API availability...');
      
      // For Phase 4.2, we'll simulate API availability
      // In production, this would make an actual API call
      const mockResponse = await this.simulateAPICall('/health');
      
      if (mockResponse.status === 'ok') {
        this.isEnabled = true;
        this.isConnected = true;
        console.log('✅ API is available and responsive');
      } else {
        throw new Error('API health check failed');
      }
    } catch (error) {
      console.warn('⚠️ API not available:', error.message);
      this.isEnabled = false;
      this.isConnected = false;
      
      // Show offline mode notification
      if (this.app) {
        this.app.showNotification(
          'API integration unavailable. Running in offline mode.',
          'warning'
        );
      }
    }
  }

  async simulateAPICall(endpoint, options = {}) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 400));
    
    // Simulate different responses based on endpoint
    switch (endpoint) {
      case '/health':
        return { status: 'ok', version: '1.0.0' };
        
      case '/usage':
        return this.generateMockUsageData();
        
      case '/features':
        return this.generateMockFeatureData();
        
      case '/quotas':
        return this.generateMockQuotaData();
        
      case '/sync':
        return { synced: true, timestamp: new Date().toISOString() };
        
      default:
        throw new Error(`Unknown endpoint: ${endpoint}`);
    }
  }

  generateMockUsageData() {
    const features = Object.keys(CONFIG.features);
    const usageData = {};
    
    features.forEach(featureId => {
      const feature = CONFIG.features[featureId];
      const monthlyQuota = feature.quotas.pro.monthly;
      
      usageData[featureId] = {
        monthly: Math.floor(Math.random() * monthlyQuota * 0.7), // 0-70% usage
        daily: Math.floor(Math.random() * feature.quotas.pro.daily * 0.5), // 0-50% daily
        lastUsed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        history: this.generateUsageHistory(featureId)
      };
    });
    
    return { usage: usageData, timestamp: new Date().toISOString() };
  }

  generateUsageHistory(featureId) {
    const history = [];
    const daysBack = 30;
    
    for (let i = 0; i < daysBack; i++) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const usage = Math.floor(Math.random() * 10); // 0-10 uses per day
      
      if (usage > 0) {
        history.push({
          date: date.toISOString().split('T')[0],
          amount: usage,
          type: 'api'
        });
      }
    }
    
    return history.reverse();
  }

  generateMockFeatureData() {
    return {
      features: CONFIG.features,
      timestamp: new Date().toISOString()
    };
  }

  generateMockQuotaData() {
    const quotas = {};
    
    Object.keys(CONFIG.features).forEach(featureId => {
      const feature = CONFIG.features[featureId];
      quotas[featureId] = {
        monthly: {
          limit: feature.quotas.pro.monthly,
          used: Math.floor(Math.random() * feature.quotas.pro.monthly * 0.7),
          remaining: feature.quotas.pro.monthly - Math.floor(Math.random() * feature.quotas.pro.monthly * 0.7)
        },
        daily: {
          limit: feature.quotas.pro.daily,
          used: Math.floor(Math.random() * feature.quotas.pro.daily * 0.5),
          remaining: feature.quotas.pro.daily - Math.floor(Math.random() * feature.quotas.pro.daily * 0.5)
        }
      };
    });
    
    return { quotas, timestamp: new Date().toISOString() };
  }

  async authenticateUser() {
    try {
      console.log('🔐 Starting user authentication...');
      
      // For Phase 4.2, we'll simulate OAuth flow
      // In production, this would use Google OAuth
      const mockAuthResponse = await this.simulateOAuthFlow();
      
      this.authToken = mockAuthResponse.accessToken;
      this.refreshToken = mockAuthResponse.refreshToken;
      
      this.saveAuthTokens();
      
      console.log('✅ User authenticated successfully');
      
      // Start automatic sync
      this.setupAutoSync();
      
      if (this.app) {
        this.app.showNotification('Connected to Google AI Pro API! 🔌', 'success');
      }
      
      return true;
    } catch (error) {
      console.error('❌ Authentication failed:', error);
      
      if (this.app) {
        this.app.showNotification('Authentication failed. Please try again.', 'error');
      }
      
      return false;
    }
  }

  async simulateOAuthFlow() {
    // Simulate OAuth flow delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      accessToken: 'mock_access_token_' + Date.now(),
      refreshToken: 'mock_refresh_token_' + Date.now(),
      expiresIn: 3600
    };
  }

  async syncUsageData() {
    if (!this.isConnected || !this.authToken) {
      console.log('⚠️ Cannot sync: Not connected or authenticated');
      return false;
    }

    try {
      console.log('🔄 Syncing usage data...');
      
      // Get current local data
      const localData = this.app.data.usage;
      
      // Fetch latest data from API
      const apiResponse = await this.simulateAPICall('/usage');
      
      // Merge API data with local data
      const mergedData = this.mergeUsageData(localData, apiResponse.usage);
      
      // Update local storage
      this.updateLocalUsageData(mergedData);
      
      // Send local changes to API
      await this.simulateAPICall('/sync', {
        method: 'POST',
        data: this.prepareDataForSync(localData)
      });
      
      this.lastSync = new Date().toISOString();
      this.saveAuthTokens();
      
      console.log('✅ Usage data synced successfully');
      
      // Update UI
      if (this.app.currentView === 'dashboard') {
        this.app.renderDashboard();
      }
      
      return true;
    } catch (error) {
      console.error('❌ Sync failed:', error);
      this.handleSyncError(error);
      return false;
    }
  }

  mergeUsageData(localData, apiData) {
    const merged = new Map();
    
    // Start with local data
    localData.forEach((usage, featureId) => {
      merged.set(featureId, { ...usage });
    });
    
    // Merge API data
    Object.keys(apiData).forEach(featureId => {
      const apiUsage = apiData[featureId];
      const localUsage = merged.get(featureId) || {
        monthly: 0,
        daily: 0,
        lastUsed: null,
        totalUsed: 0,
        history: []
      };
      
      // Use API data as authoritative for monthly/daily totals
      localUsage.monthly = Math.max(localUsage.monthly, apiUsage.monthly);
      localUsage.daily = Math.max(localUsage.daily, apiUsage.daily);
      
      // Merge history arrays
      const combinedHistory = [...localUsage.history, ...apiUsage.history];
      localUsage.history = this.deduplicateHistory(combinedHistory);
      
      // Update last used
      if (apiUsage.lastUsed && (!localUsage.lastUsed || apiUsage.lastUsed > localUsage.lastUsed)) {
        localUsage.lastUsed = apiUsage.lastUsed;
      }
      
      merged.set(featureId, localUsage);
    });
    
    return merged;
  }

  deduplicateHistory(history) {
    const seen = new Set();
    return history.filter(entry => {
      const key = `${entry.date}_${entry.amount}_${entry.type}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  updateLocalUsageData(mergedData) {
    // Update app data
    this.app.data.usage = mergedData;
    
    // Save to storage
    this.app.saveData();
    
    console.log('📊 Local usage data updated');
  }

  prepareDataForSync(localData) {
    const syncData = {};
    
    localData.forEach((usage, featureId) => {
      syncData[featureId] = {
        monthly: usage.monthly,
        daily: usage.daily,
        lastUsed: usage.lastUsed,
        history: usage.history.filter(entry => entry.type === 'manual') // Only sync manual entries
      };
    });
    
    return syncData;
  }

  setupAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    
    // Sync every 5 minutes
    this.syncInterval = setInterval(() => {
      this.syncUsageData();
    }, 5 * 60 * 1000);
    
    console.log('🔄 Auto-sync enabled (5 minute intervals)');
  }

  async getRealTimeQuotas() {
    if (!this.isConnected || !this.authToken) {
      return null;
    }

    try {
      const response = await this.simulateAPICall('/quotas');
      return response.quotas;
    } catch (error) {
      console.error('❌ Failed to get real-time quotas:', error);
      return null;
    }
  }

  async logUsageToAPI(featureId, amount = 1) {
    if (!this.isConnected || !this.authToken) {
      console.log('⚠️ Cannot log to API: Not connected');
      return false;
    }

    try {
      const response = await this.simulateAPICall('/usage', {
        method: 'POST',
        data: {
          featureId,
          amount,
          timestamp: new Date().toISOString()
        }
      });
      
      console.log(`📝 Logged ${amount} use of ${featureId} to API`);
      return true;
    } catch (error) {
      console.error('❌ Failed to log usage to API:', error);
      return false;
    }
  }

  handleConnectionError(error) {
    console.error('🔌 Connection error:', error);
    
    this.isConnected = false;
    
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    
    // Retry connection after delay
    setTimeout(() => {
      this.checkAPIAvailability();
    }, 30000); // Retry after 30 seconds
  }

  handleSyncError(error) {
    console.error('🔄 Sync error:', error);
    
    if (this.app) {
      this.app.showNotification('Sync failed. Will retry automatically.', 'warning');
    }
    
    // Implement exponential backoff for retries
    const retryDelay = Math.min(30000, 1000 * Math.pow(2, this.syncRetryCount || 0));
    this.syncRetryCount = (this.syncRetryCount || 0) + 1;
    
    setTimeout(() => {
      this.syncUsageData();
    }, retryDelay);
  }

  async disconnect() {
    console.log('🔌 Disconnecting from API...');
    
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    
    this.authToken = null;
    this.refreshToken = null;
    this.isConnected = false;
    
    // Clear stored auth
    StorageService.remove('aiProTracker_auth');
    
    if (this.app) {
      this.app.showNotification('Disconnected from Google AI Pro API', 'info');
    }
    
    console.log('✅ Disconnected successfully');
  }

  // Public methods for app integration
  isAPIEnabled() {
    return this.isEnabled;
  }

  isAPIConnected() {
    return this.isConnected;
  }

  isAuthenticated() {
    return !!this.authToken;
  }

  getLastSyncTime() {
    return this.lastSync;
  }

  async forceSync() {
    if (!this.isConnected) {
      if (this.app) {
        this.app.showNotification('Not connected to API', 'warning');
      }
      return false;
    }
    
    return await this.syncUsageData();
  }

  getConnectionStatus() {
    return {
      enabled: this.isEnabled,
      connected: this.isConnected,
      authenticated: this.isAuthenticated(),
      lastSync: this.lastSync
    };
  }
}

// Export for use in main app
window.APIManager = APIManager;