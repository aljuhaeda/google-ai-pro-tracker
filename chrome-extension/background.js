// Phase 5.3: Chrome Extension Background Script
class AIProTrackerExtension {
  constructor() {
    this.isActive = false;
    this.usageData = new Map();
    this.sessionStart = null;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadStoredData();
    console.log('🔧 AI Pro Tracker Extension initialized');
  }

  setupEventListeners() {
    // Listen for tab updates
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete' && this.isAIRelatedURL(tab.url)) {
        this.trackPageVisit(tab.url, tabId);
      }
    });

    // Listen for web requests to AI services
    chrome.webRequest.onBeforeRequest.addListener(
      (details) => {
        this.trackAPIRequest(details);
      },
      {
        urls: [
          "*://gemini.google.com/api/*",
          "*://bard.google.com/api/*",
          "*://makersuite.google.com/api/*",
          "*://generativelanguage.googleapis.com/*"
        ]
      },
      ["requestBody"]
    );

    // Listen for messages from content scripts
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sender, sendResponse);
    });

    // Periodic sync with main app
    chrome.alarms.create('syncData', { periodInMinutes: 15 });
    chrome.alarms.onAlarm.addListener((alarm) => {
      if (alarm.name === 'syncData') {
        this.syncWithMainApp();
      }
    });
  }

  isAIRelatedURL(url) {
    if (!url) return false;
    
    const aiDomains = [
      'gemini.google.com',
      'bard.google.com',
      'makersuite.google.com',
      'ai.google.dev',
      'openai.com',
      'chat.openai.com',
      'claude.ai',
      'anthropic.com'
    ];

    return aiDomains.some(domain => url.includes(domain));
  }

  trackPageVisit(url, tabId) {
    const visit = {
      url,
      timestamp: new Date().toISOString(),
      tabId,
      type: 'page_visit',
      service: this.identifyService(url)
    };

    this.addUsageEvent(visit);
    this.notifyContentScript(tabId);
    console.log('📊 Page visit tracked:', visit);
  }

  trackAPIRequest(details) {
    const request = {
      url: details.url,
      method: details.method,
      timestamp: new Date().toISOString(),
      type: 'api_request',
      service: this.identifyService(details.url),
      requestSize: this.estimateRequestSize(details)
    };

    this.addUsageEvent(request);
    console.log('🔌 API request tracked:', request);
  }

  identifyService(url) {
    if (url.includes('gemini')) return 'gemini';
    if (url.includes('bard')) return 'bard';
    if (url.includes('makersuite')) return 'makersuite';
    if (url.includes('openai')) return 'openai';
    if (url.includes('claude') || url.includes('anthropic')) return 'claude';
    return 'unknown';
  }

  estimateRequestSize(details) {
    if (details.requestBody && details.requestBody.raw) {
      return details.requestBody.raw.reduce((size, chunk) => {
        return size + (chunk.bytes ? chunk.bytes.byteLength : 0);
      }, 0);
    }
    return 0;
  }

  addUsageEvent(event) {
    const today = new Date().toISOString().split('T')[0];
    
    if (!this.usageData.has(today)) {
      this.usageData.set(today, []);
    }
    
    this.usageData.get(today).push(event);
    this.saveUsageData();
    
    // Update badge
    this.updateBadge();
  }

  updateBadge() {
    const today = new Date().toISOString().split('T')[0];
    const todayEvents = this.usageData.get(today) || [];
    const count = todayEvents.length;
    
    chrome.action.setBadgeText({
      text: count > 0 ? count.toString() : ''
    });
    
    chrome.action.setBadgeBackgroundColor({
      color: '#4285f4'
    });
  }

  notifyContentScript(tabId) {
    chrome.tabs.sendMessage(tabId, {
      type: 'TRACKER_ACTIVE',
      data: { isTracking: true }
    }).catch(() => {
      // Content script might not be ready, ignore error
    });
  }

  handleMessage(message, sender, sendResponse) {
    switch (message.type) {
      case 'GET_USAGE_DATA':
        sendResponse({ data: this.getUsageData() });
        break;
        
      case 'TRACK_INTERACTION':
        this.trackInteraction(message.data, sender.tab);
        sendResponse({ success: true });
        break;
        
      case 'GET_STATUS':
        sendResponse({ 
          isActive: this.isActive,
          todayCount: this.getTodayCount()
        });
        break;
        
      case 'TOGGLE_TRACKING':
        this.isActive = !this.isActive;
        this.saveSettings();
        sendResponse({ isActive: this.isActive });
        break;
    }
  }

  trackInteraction(data, tab) {
    const interaction = {
      ...data,
      timestamp: new Date().toISOString(),
      type: 'user_interaction',
      url: tab.url,
      service: this.identifyService(tab.url)
    };

    this.addUsageEvent(interaction);
    console.log('👆 User interaction tracked:', interaction);
  }

  getUsageData() {
    const data = {};
    this.usageData.forEach((events, date) => {
      data[date] = events;
    });
    return data;
  }

  getTodayCount() {
    const today = new Date().toISOString().split('T')[0];
    return (this.usageData.get(today) || []).length;
  }

  async syncWithMainApp() {
    try {
      const usageData = this.getUsageData();
      
      // Send data to main app (if available)
      const response = await fetch('http://localhost:8000/api/sync-extension-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          extensionData: usageData,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        console.log('✅ Data synced with main app');
        this.showNotification('Data synced successfully', 'success');
      }
    } catch (error) {
      console.log('ℹ️ Main app not available, data stored locally');
    }
  }

  showNotification(message, type = 'info') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'AI Pro Tracker',
      message: message
    });
  }

  // Storage methods
  loadStoredData() {
    chrome.storage.local.get(['usageData', 'settings'], (result) => {
      if (result.usageData) {
        this.usageData = new Map(Object.entries(result.usageData));
      }
      
      if (result.settings) {
        this.isActive = result.settings.isActive !== false;
      }
      
      this.updateBadge();
    });
  }

  saveUsageData() {
    const data = {};
    this.usageData.forEach((events, date) => {
      data[date] = events;
    });
    
    chrome.storage.local.set({ usageData: data });
  }

  saveSettings() {
    chrome.storage.local.set({
      settings: {
        isActive: this.isActive
      }
    });
  }

  // Cleanup old data (keep last 30 days)
  cleanupOldData() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const cutoffDate = thirtyDaysAgo.toISOString().split('T')[0];

    for (const [date] of this.usageData) {
      if (date < cutoffDate) {
        this.usageData.delete(date);
      }
    }
    
    this.saveUsageData();
  }

  // Export data for main app
  exportData() {
    const exportData = {
      usageData: this.getUsageData(),
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };

    return exportData;
  }
}

// Initialize extension
const tracker = new AIProTrackerExtension();

// Cleanup old data daily
chrome.alarms.create('cleanup', { periodInMinutes: 1440 }); // 24 hours
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'cleanup') {
    tracker.cleanupOldData();
  }
});