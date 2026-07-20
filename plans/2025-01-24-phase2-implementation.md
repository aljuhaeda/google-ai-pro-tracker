# Phase 2: Feature Tracking and Core Functionality Implementation

## 🎯 **Phase 2 Goal**
Transform your beautiful static interface into a fully functional Google AI Pro tracker with real-time statistics, interactive navigation, and feature usage logging.

---

## Step 6: Create Main Application Controller (20 minutes)

### **File**: `js/app.js`
**This is the heart of your application - copy this exact code:**

```javascript
// Main Application Controller
class AIProTracker {
    constructor() {
        this.currentView = 'dashboard';
        this.data = {
            usage: new Map(),
            settings: {
                notifications: true,
                quotaAlerts: true
            }
        };
        
        this.init();
    }
    
    init() {
        this.loadData();
        this.setupEventListeners();
        this.renderDashboard();
        this.renderFeatures();
        this.checkDailyReset();
        console.log('🚀 AI Pro Tracker initialized successfully');
        
        // Show welcome message for new users
        this.showWelcomeIfFirstTime();
    }
    
    loadData() {
        // Load usage data from storage
        const savedUsage = StorageService.get(CONFIG.storage.keys.usage, {});
        Object.keys(CONFIG.features).forEach(featureId => {
            this.data.usage.set(featureId, savedUsage[featureId] || {
                monthly: 0,
                daily: 0,
                lastUsed: null,
                totalUsed: 0,
                history: []
            });
        });
        
        // Load settings
        this.data.settings = StorageService.get(CONFIG.storage.keys.settings, this.data.settings);
        console.log('📊 Data loaded successfully');
    }
    
    saveData() {
        // Convert Map to object for storage
        const usageData = {};
        this.data.usage.forEach((usage, featureId) => {
            usageData[featureId] = usage;
        });
        
        StorageService.set(CONFIG.storage.keys.usage, usageData);
        StorageService.set(CONFIG.storage.keys.settings, this.data.settings);
    }
    
    setupEventListeners() {
        // Navigation event listeners
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchView(e.target.dataset.view);
            });
        });
        
        // Quick action event listeners
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const featureId = e.currentTarget.dataset.feature;
                this.logUsage(featureId);
            });
        });
        
        // Settings event listeners
        document.getElementById('browserNotifications')?.addEventListener('change', (e) => {
            this.data.settings.notifications = e.target.checked;
            this.saveData();
            this.showNotification(`Notifications ${e.target.checked ? 'enabled' : 'disabled'}`, 'success');
        });
        
        document.getElementById('quotaAlerts')?.addEventListener('change', (e) => {
            this.data.settings.quotaAlerts = e.target.checked;
            this.saveData();
            this.showNotification(`Quota alerts ${e.target.checked ? 'enabled' : 'disabled'}`, 'success');
        });
        
        // Export/Import event listeners
        document.getElementById('exportData')?.addEventListener('click', () => {
            this.exportData();
        });
        
        document.getElementById('clearData')?.addEventListener('click', () => {
            this.clearData();
        });
        
        console.log('🎯 Event listeners set up');
    }
    
    switchView(viewName) {
        // Hide all views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        
        // Remove active from nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show target view
        document.getElementById(`${viewName}View`).classList.add('active');
        document.querySelector(`[data-view="${viewName}"]`).classList.add('active');
        
        this.currentView = viewName;
        
        // Refresh view content
        if (viewName === 'dashboard') {
            this.renderDashboard();
        } else if (viewName === 'features') {
            this.renderFeatures();
        }
        
        console.log(`📱 Switched to ${viewName} view`);
    }
    
    logUsage(featureId, amount = 1) {
        const usage = this.data.usage.get(featureId);
        const feature = CONFIG.features[featureId];
        
        if (usage && feature) {
            // Update usage data
            usage.monthly += amount;
            usage.daily += amount;
            usage.totalUsed += amount;
            usage.lastUsed = new Date().toISOString();
            
            // Add to history
            usage.history.push({
                date: new Date().toISOString(),
                amount: amount,
                type: 'manual'
            });
            
            // Save data
            this.saveData();
            
            // Update UI
            this.renderDashboard();
            this.renderFeatures();
            
            // Show success notification
            this.showNotification(
                `✅ Logged ${amount} use of ${feature.name} ${feature.icon}`, 
                'success'
            );
            
            // Check for quota warnings
            this.checkQuotaWarnings(featureId);
            
            console.log(`📝 Logged usage: ${feature.name} (+${amount})`);
        }
    }
    
    checkQuotaWarnings(featureId) {
        if (!this.data.settings.quotaAlerts) return;
        
        const feature = CONFIG.features[featureId];
        const usage = this.data.usage.get(featureId);
        const quota = feature.quotas.pro.monthly;
        const percentage = (usage.monthly / quota) * 100;
        
        if (percentage >= 90) {
            this.showNotification(
                `⚠️ Warning: ${Math.round(percentage)}% of ${feature.name} quota used!`, 
                'error'
            );
        } else if (percentage >= 75) {
            this.showNotification(
                `📊 Notice: ${Math.round(percentage)}% of ${feature.name} quota used`, 
                'warning'
            );
        }
    }
    
    renderDashboard() {
        this.updateQuickStats();
        this.renderFeaturesGrid();
    }
    
    updateQuickStats() {
        let totalUsage = 0;
        let totalQuota = 0;
        let featuresUsed = 0;
        let totalValue = 0;
        
        // Calculate overall statistics
        Object.keys(CONFIG.features).forEach(featureId => {
            const feature = CONFIG.features[featureId];
            const usage = this.data.usage.get(featureId);
            
            totalUsage += usage.monthly;
            totalQuota += feature.quotas.pro.monthly;
            
            if (usage.monthly > 0) {
                featuresUsed++;
                // Calculate value based on usage percentage
                const usagePercentage = Math.min(usage.monthly / feature.quotas.pro.monthly, 1);
                totalValue += feature.estimatedValue * usagePercentage;
            }
        });
        
        // Update monthly usage percentage
        const usagePercentage = totalQuota > 0 ? Math.round((totalUsage / totalQuota) * 100) : 0;
        document.getElementById('monthlyUsage').textContent = `${usagePercentage}%`;
        document.getElementById('monthlyProgress').style.width = `${Math.min(usagePercentage, 100)}%`;
        
        // Update features used
        const totalFeatures = Object.keys(CONFIG.features).length;
        document.getElementById('featuresUsed').textContent = `${featuresUsed}/${totalFeatures}`;
        document.getElementById('featuresProgress').style.width = `${(featuresUsed / totalFeatures) * 100}%`;
        
        // Update subscription value
        document.getElementById('subscriptionValue').textContent = `$${Math.round(totalValue)}`;
    }
    
    renderFeaturesGrid() {
        const grid = document.getElementById('featuresGrid');
        grid.innerHTML = '';
        
        // Sort features by priority (creative features first)
        const sortedFeatures = Object.keys(CONFIG.features).sort((a, b) => {
            const featureA = CONFIG.features[a];
            const featureB = CONFIG.features[b];
            
            // Prioritize creative features
            if (featureA.category === 'creative' && featureB.category !== 'creative') return -1;
            if (featureA.category !== 'creative' && featureB.category === 'creative') return 1;
            
            return featureA.estimatedValue - featureB.estimatedValue;
        });
        
        sortedFeatures.forEach(featureId => {
            const feature = CONFIG.features[featureId];
            const usage = this.data.usage.get(featureId);
            const percentage = Math.round((usage.monthly / feature.quotas.pro.monthly) * 100);
            const remaining = feature.quotas.pro.monthly - usage.monthly;
            
            // Determine card color based on usage
            let borderColor = '#4285f4'; // Default blue
            if (percentage >= 90) borderColor = '#ea4335'; // Red for high usage
            else if (percentage >= 75) borderColor = '#fbbc04'; // Yellow for medium usage
            else if (percentage > 0) borderColor = '#34a853'; // Green for some usage
            
            const card = document.createElement('div');
            card.className = 'feature-card';
            card.style.borderLeftColor = borderColor;
            card.innerHTML = `
                <div class="feature-header">
                    <span class="feature-icon">${feature.icon}</span>
                    <span class="feature-name">${feature.name}</span>
                </div>
                <div class="feature-usage">
                    <div class="usage-stats">
                        <span>Used: ${usage.monthly}</span>
                        <span>Limit: ${feature.quotas.pro.monthly}</span>
                        <span>${percentage}%</span>
                    </div>
                    <div class="stat-progress">
                        <div class="progress-bar" style="width: ${Math.min(percentage, 100)}%; background-color: ${borderColor};"></div>
                    </div>
                    <div class="usage-details">
                        <small style="color: #5f6368;">
                            Remaining: ${remaining} | Daily: ${usage.daily}/${feature.quotas.pro.daily}
                            ${usage.lastUsed ? ` | Last used: ${new Date(usage.lastUsed).toLocaleDateString()}` : ''}
                        </small>
                    </div>
                </div>
                <div class="feature-actions">
                    <button class="btn primary" onclick="app.logUsage('${featureId}')">
                        Log Usage
                    </button>
                    <button class="btn secondary" onclick="app.showTips('${featureId}')">
                        Tips
                    </button>
                    <button class="btn secondary" onclick="app.logCustomUsage('${featureId}')">
                        Custom
                    </button>
                </div>
            `;
            
            grid.appendChild(card);
        });
    }
    
    renderFeatures() {
        const list = document.getElementById('featuresList');
        list.innerHTML = '';
        
        Object.keys(CONFIG.features).forEach(featureId => {
            const feature = CONFIG.features[featureId];
            const usage = this.data.usage.get(featureId);
            const monthlyPercentage = Math.round((usage.monthly / feature.quotas.pro.monthly) * 100);
            const dailyPercentage = Math.round((usage.daily / feature.quotas.pro.daily) * 100);
            
            const card = document.createElement('div');
            card.className = 'feature-card';
            card.innerHTML = `
                <div class="feature-header">
                    <span class="feature-icon">${feature.icon}</span>
                    <span class="feature-name">${feature.name}</span>
                    <span class="feature-category" style="background: #e8eaed; padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.8rem; color: #5f6368;">
                        ${feature.category}
                    </span>
                </div>
                <p style="margin: 0.5rem 0; color: #5f6368;">${feature.description}</p>
                <div class="feature-usage">
                    <div class="usage-stats">
                        <div>
                            <strong>Monthly:</strong> ${usage.monthly}/${feature.quotas.pro.monthly} (${monthlyPercentage}%)
                        </div>
                        <div>
                            <strong>Daily:</strong> ${usage.daily}/${feature.quotas.pro.daily} (${dailyPercentage}%)
                        </div>
                        <div>
                            <strong>Total Used:</strong> ${usage.totalUsed}
                        </div>
                        <div>
                            <strong>Estimated Value:</strong> $${feature.estimatedValue}/month
                        </div>
                    </div>
                    <div class="stat-progress" style="margin-top: 0.5rem;">
                        <div class="progress-bar" style="width: ${Math.min(monthlyPercentage, 100)}%;"></div>
                    </div>
                </div>
                <div class="feature-actions" style="margin-top: 1rem;">
                    <button class="btn primary" onclick="app.logUsage('${featureId}')">
                        Log Usage
                    </button>
                    <button class="btn secondary" onclick="app.showTips('${featureId}')">
                        Show Tips
                    </button>
                    <button class="btn secondary" onclick="app.showHistory('${featureId}')">
                        History
                    </button>
                </div>
            `;
            
            list.appendChild(card);
        });
    }
    
    logCustomUsage(featureId) {
        const feature = CONFIG.features[featureId];
        const amount = prompt(`How many ${feature.name} uses would you like to log?`, '1');
        
        if (amount && !isNaN(amount) && parseInt(amount) > 0) {
            this.logUsage(featureId, parseInt(amount));
        }
    }
    
    showTips(featureId) {
        const feature = CONFIG.features[featureId];
        const tips = feature.tips.map((tip, index) => `${index + 1}. ${tip}`).join('\n');
        
        alert(`💡 Tips for ${feature.name}:\n\n${tips}\n\n💰 Estimated Value: $${feature.estimatedValue}/month`);
    }
    
    showHistory(featureId) {
        const feature = CONFIG.features[featureId];
        const usage = this.data.usage.get(featureId);
        
        if (usage.history.length === 0) {
            alert(`📊 No usage history for ${feature.name} yet.`);
            return;
        }
        
        const recentHistory = usage.history.slice(-10).reverse(); // Last 10 entries
        const historyText = recentHistory.map(entry => {
            const date = new Date(entry.date).toLocaleString();
            return `• ${date}: +${entry.amount} use(s)`;
        }).join('\n');
        
        alert(`📈 Recent History for ${feature.name}:\n\n${historyText}\n\nTotal: ${usage.totalUsed} uses`);
    }
    
    showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        container.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
        
        // Add click to dismiss
        notification.addEventListener('click', () => {
            notification.remove();
        });
    }
    
    exportData() {
        const data = {
            usage: Object.fromEntries(this.data.usage),
            settings: this.data.settings,
            exportDate: new Date().toISOString(),
            appVersion: '1.0.0'
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai-pro-tracker-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('📥 Data exported successfully!', 'success');
    }
    
    clearData() {
        if (confirm('⚠️ Are you sure you want to clear all data? This cannot be undone.')) {
            // Clear storage
            StorageService.clear();
            
            // Reset usage data
            this.data.usage.clear();
            Object.keys(CONFIG.features).forEach(featureId => {
                this.data.usage.set(featureId, {
                    monthly: 0,
                    daily: 0,
                    lastUsed: null,
                    totalUsed: 0,
                    history: []
                });
            });
            
            // Reset settings
            this.data.settings = {
                notifications: true,
                quotaAlerts: true
            };
            
            // Update UI
            this.renderDashboard();
            this.renderFeatures();
            
            this.showNotification('🗑️ All data cleared successfully!', 'success');
        }
    }
    
    checkDailyReset() {
        const lastReset = StorageService.get('lastDailyReset');
        const today = new Date().toDateString();
        
        if (lastReset !== today) {
            // Reset daily counters
            this.data.usage.forEach(usage => {
                usage.daily = 0;
            });
            
            StorageService.set('lastDailyReset', today);
            this.saveData();
            console.log('🔄 Daily usage counters reset');
        }
        
        // Schedule next check
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const msUntilMidnight = tomorrow.getTime() - now.getTime();
        setTimeout(() => {
            this.checkDailyReset();
            // Check again every 24 hours
            setInterval(() => this.checkDailyReset(), 24 * 60 * 60 * 1000);
        }, msUntilMidnight);
    }
    
    showWelcomeIfFirstTime() {
        const hasVisited = StorageService.get('hasVisited');
        if (!hasVisited) {
            setTimeout(() => {
                this.showNotification(
                    '🎉 Welcome to AI Pro Tracker! Start by logging your Google AI Pro usage with the quick action buttons.',
                    'success'
                );
                StorageService.set('hasVisited', true);
            }, 1000);
        }
    }
}

// Initialize the application
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new AIProTracker();
});

// Global functions for button clicks
window.app = app;
```

---

## 🎯 **Implementation Instructions**

### **Step 1: Create the app.js file**
1. Navigate to your `js/` folder
2. Create a new file called `app.js`
3. Copy the entire code block above into the file
4. Save the file

### **Step 2: Test the functionality**
1. Open `index.html` in your browser
2. **You should now see:**
   - ✅ Navigation works between Dashboard, Features, Settings
   - ✅ Quick action buttons log usage and show notifications
   - ✅ Real-time statistics update when you log usage
   - ✅ Progress bars fill up based on usage
   - ✅ Feature cards show detailed information
   - ✅ Export data functionality works
   - ✅ Settings toggles work

### **Step 3: Test these specific features:**
1. **Click quick action buttons** - should show success notifications
2. **Navigate between views** - should switch smoothly
3. **Log multiple uses** - watch statistics update
4. **Try "Custom" button** - allows logging multiple uses at once
5. **Click "Tips" button** - shows helpful tips for each feature
6. **Test export** - should download a JSON file
7. **Check responsive design** - resize browser window

---

## 🚀 **What You've Just Built**

### **Fully Functional Features:**
- ✨ **Interactive Navigation** - Smooth view switching
- ✨ **Real-time Usage Tracking** - Live statistics updates
- ✨ **Smart Progress Visualization** - Color-coded progress bars
- ✨ **Intelligent Notifications** - Success messages and quota warnings
- ✨ **Data Persistence** - Usage data saved automatically
- ✨ **Export Functionality** - Download your data as JSON
- ✨ **Daily Reset System** - Automatic daily counter reset
- ✨ **Custom Usage Logging** - Log multiple uses at once
- ✨ **Feature Tips** - Built-in guidance for each Google AI Pro feature

### **Smart Features:**
- 🎯 **Color-coded progress bars** (Blue → Green → Yellow → Red)
- 🎯 **Quota warnings** at 75% and 90% usage
- 🎯 **Usage history tracking** with timestamps
- 🎯 **Value calculation** showing subscription ROI
- 🎯 **Welcome message** for first-time users

---

## ✅ **CHECKPOINT 2**

**Test everything and let me know:**
1. ✅ Does navigation work between all views?
2. ✅ Do quick action buttons log usage and show notifications?
3. ✅ Do statistics update in real-time?
4. ✅ Do progress bars fill up correctly?
5. ✅ Does the export function work?
6. ✅ Any errors in the browser console?

**Once confirmed working, we'll move to Phase 3: Smart Reminders! 🔔**