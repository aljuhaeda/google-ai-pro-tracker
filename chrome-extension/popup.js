// Phase 5.3: Chrome Extension Popup Script
class ExtensionPopup {
  constructor() {
    this.isTracking = false;
    this.usageData = {};
    this.init();
  }

  init() {
    this.loadData();
    this.setupEventListeners();
    this.updateUI();
    console.log('🔧 Extension popup initialized');
  }

  setupEventListeners() {
    // Tracking toggle
    document.getElementById('trackingSwitch').addEventListener('click', () => {
      this.toggleTracking();
    });

    // Sync button
    document.getElementById('syncBtn').addEventListener('click', () => {
      this.syncData();
    });

    // Open main app button
    document.getElementById('openAppBtn').addEventListener('click', () => {
      this.openMainApp();
    });

    // Auto-refresh data every 30 seconds
    setInterval(() => {
      this.loadData();
      this.updateUI();
    }, 30000);
  }

  async loadData() {
    try {
      // Get tracking status
      const statusResponse = await this.sendMessage({ type: 'GET_STATUS' });
      this.isTracking = statusResponse.isActive;

      // Get usage data
      const dataResponse = await this.sendMessage({ type: 'GET_USAGE_DATA' });
      this.usageData = dataResponse.data;

      console.log('📊 Data loaded:', { isTracking: this.isTracking, dataKeys: Object.keys(this.usageData) });
    } catch (error) {
      console.error('❌ Error loading data:', error);
    }
  }

  updateUI() {
    this.updateStatus();
    this.updateStats();
    this.updateRecentActivity();
    this.updateSyncStatus();
  }

  updateStatus() {
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    const trackingSwitch = document.getElementById('trackingSwitch');

    if (this.isTracking) {
      statusDot.className = 'status-dot active';
      statusText.textContent = 'Tracking active';
      trackingSwitch.classList.add('active');
    } else {
      statusDot.className = 'status-dot inactive';
      statusText.textContent = 'Tracking paused';
      trackingSwitch.classList.remove('active');
    }
  }

  updateStats() {
    const today = new Date().toISOString().split('T')[0];
    const todayData = this.usageData[today] || [];
    
    let totalCount = 0;
    Object.values(this.usageData).forEach(dayData => {
      totalCount += dayData.length;
    });

    document.getElementById('todayCount').textContent = todayData.length;
    document.getElementById('totalCount').textContent = totalCount;
  }

  updateRecentActivity() {
    const container = document.getElementById('recentActivity');
    
    // Get recent activities from all days
    const allActivities = [];
    Object.entries(this.usageData).forEach(([date, activities]) => {
      activities.forEach(activity => {
        allActivities.push({ ...activity, date });
      });
    });

    // Sort by timestamp and take last 5
    const recentActivities = allActivities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5);

    if (recentActivities.length === 0) {
      container.innerHTML = '<div class="empty-state">No recent activity</div>';
      return;
    }

    container.innerHTML = recentActivities.map(activity => `
      <div class="activity-item">
        <div class="activity-icon ${activity.service}">
          ${this.getServiceIcon(activity.service)}
        </div>
        <div class="activity-details">
          <div class="activity-title">${this.formatActivityTitle(activity)}</div>
          <div class="activity-time">${this.formatTime(activity.timestamp)}</div>
        </div>
      </div>
    `).join('');
  }

  updateSyncStatus() {
    const syncStatus = document.getElementById('syncStatus');
    const lastSync = localStorage.getItem('lastSyncTime');
    
    if (lastSync) {
      const syncTime = new Date(lastSync);
      syncStatus.textContent = `Last sync: ${this.formatTime(syncTime.toISOString())}`;
    } else {
      syncStatus.textContent = 'Last sync: Never';
    }
  }

  async toggleTracking() {
    try {
      const response = await this.sendMessage({ type: 'TOGGLE_TRACKING' });
      this.isTracking = response.isActive;
      this.updateStatus();
      
      // Show feedback
      this.showToast(this.isTracking ? 'Tracking enabled' : 'Tracking paused');
    } catch (error) {
      console.error('❌ Error toggling tracking:', error);
      this.showToast('Error toggling tracking', 'error');
    }
  }

  async syncData() {
    const syncBtn = document.getElementById('syncBtn');
    const originalText = syncBtn.textContent;
    
    try {
      syncBtn.textContent = 'Syncing...';
      syncBtn.disabled = true;

      // Trigger sync in background script
      await this.sendMessage({ type: 'SYNC_DATA' });
      
      // Update last sync time
      localStorage.setItem('lastSyncTime', new Date().toISOString());
      this.updateSyncStatus();
      
      this.showToast('Data synced successfully');
    } catch (error) {
      console.error('❌ Sync error:', error);
      this.showToast('Sync failed', 'error');
    } finally {
      syncBtn.textContent = originalText;
      syncBtn.disabled = false;
    }
  }

  openMainApp() {
    // Try to open the main app
    const appUrl = 'http://localhost:8000'; // Default local development URL
    chrome.tabs.create({ url: appUrl });
    
    // Close popup
    window.close();
  }

  // Utility methods
  sendMessage(message) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(response);
        }
      });
    });
  }

  getServiceIcon(service) {
    const icons = {
      gemini: '🔮',
      bard: '🎭',
      openai: '🤖',
      chatgpt: '💬',
      claude: '🧠',
      makersuite: '🛠️',
      unknown: '❓'
    };
    return icons[service] || icons.unknown;
  }

  formatActivityTitle(activity) {
    const titles = {
      prompt_sent: 'Prompt sent',
      response_received: 'Response received',
      page_visit: 'Page visited',
      api_request: 'API request',
      user_interaction: 'User interaction',
      session_active: 'Session active',
      conversation_turn: 'Conversation turn',
      generic_interaction: 'Interaction'
    };
    
    return titles[activity.type] || activity.type;
  }

  formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  }

  showToast(message, type = 'success') {
    // Create toast notification
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: ${type === 'error' ? '#ea4335' : '#34a853'};
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;
    toast.textContent = message;

    document.body.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  // Export data functionality
  async exportData() {
    try {
      const exportData = {
        usageData: this.usageData,
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-tracker-extension-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      
      URL.revokeObjectURL(url);
      this.showToast('Data exported successfully');
    } catch (error) {
      console.error('❌ Export error:', error);
      this.showToast('Export failed', 'error');
    }
  }

  // Settings management
  async openSettings() {
    // Create settings modal or navigate to settings page
    chrome.tabs.create({ url: chrome.runtime.getURL('settings.html') });
    window.close();
  }

  // Quick stats calculation
  getQuickStats() {
    const stats = {
      totalInteractions: 0,
      servicesUsed: new Set(),
      activeToday: false,
      weeklyTrend: 0
    };

    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    Object.entries(this.usageData).forEach(([date, activities]) => {
      stats.totalInteractions += activities.length;
      
      if (date === today && activities.length > 0) {
        stats.activeToday = true;
      }

      if (date >= weekAgo) {
        stats.weeklyTrend += activities.length;
      }

      activities.forEach(activity => {
        if (activity.service) {
          stats.servicesUsed.add(activity.service);
        }
      });
    });

    return {
      ...stats,
      servicesCount: stats.servicesUsed.size,
      servicesUsed: Array.from(stats.servicesUsed)
    };
  }
}

// Initialize popup when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ExtensionPopup();
});