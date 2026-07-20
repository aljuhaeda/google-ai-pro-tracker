// Smart Notification System - Phase 4.3
class SmartNotificationSystem {
  constructor(app) {
    this.app = app;
    this.notificationQueue = [];
    this.activeNotifications = new Map();
    this.userPreferences = {
      enableSmart: true,
      quietHours: { start: 22, end: 8 },
      maxPerHour: 3,
      priorityThreshold: 'medium',
      contextualTiming: true,
      adaptiveTiming: true
    };
    this.contextAnalyzer = null;
    this.timingOptimizer = null;
    this.lastNotificationTime = null;
    this.notificationHistory = [];
    
    this.init();
  }

  async init() {
    console.log('🔔 Initializing Smart Notification System...');
    
    try {
      // Load user preferences
      this.loadPreferences();
      
      // Initialize context analyzer
      this.contextAnalyzer = new NotificationContextAnalyzer(this.app);
      
      // Initialize timing optimizer
      this.timingOptimizer = new NotificationTimingOptimizer(this.app);
      
      // Setup notification scheduling
      this.setupNotificationScheduling();
      
      // Request notification permissions
      await this.requestNotificationPermission();
      
      console.log('✅ Smart Notification System initialized successfully');
    } catch (error) {
      console.error('❌ Smart Notification System initialization failed:', error);
    }
  }

  loadPreferences() {
    const savedPreferences = StorageService.get('smartNotificationPreferences', {});
    this.userPreferences = { ...this.userPreferences, ...savedPreferences };
    
    // Load notification history
    this.notificationHistory = StorageService.get('notificationHistory', []);
  }

  savePreferences() {
    StorageService.set('smartNotificationPreferences', this.userPreferences);
    StorageService.set('notificationHistory', this.notificationHistory.slice(-100)); // Keep last 100
  }

  async requestNotificationPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      console.log('🔔 Notification permission:', permission);
      return permission === 'granted';
    }
    return false;
  }

  setupNotificationScheduling() {
    // Check for pending notifications every minute
    setInterval(() => {
      this.processNotificationQueue();
    }, 60000);

    // Analyze context every 5 minutes
    setInterval(() => {
      this.analyzeCurrentContext();
    }, 300000);

    // Generate proactive notifications
    setInterval(() => {
      this.generateProactiveNotifications();
    }, 1800000); // Every 30 minutes
  }

  async showSmartNotification(notification) {
    if (!this.userPreferences.enableSmart) {
      return this.showBasicNotification(notification);
    }

    try {
      // Analyze context and optimize timing
      const context = await this.contextAnalyzer.analyzeContext();
      const optimalTiming = await this.timingOptimizer.calculateOptimalTiming(notification, context);
      
      // Enhanced notification with context
      const enhancedNotification = {
        ...notification,
        id: this.generateNotificationId(),
        timestamp: new Date().toISOString(),
        context,
        optimalTiming,
        priority: this.calculatePriority(notification, context),
        personalization: this.generatePersonalization(notification, context)
      };

      // Decide whether to show immediately or queue
      if (this.shouldShowImmediately(enhancedNotification)) {
        return this.displayNotification(enhancedNotification);
      } else {
        this.queueNotification(enhancedNotification);
        return true;
      }
    } catch (error) {
      console.error('❌ Smart notification failed:', error);
      return this.showBasicNotification(notification);
    }
  }

  shouldShowImmediately(notification) {
    // Check quiet hours
    if (this.isQuietHour()) {
      return notification.priority === 'critical';
    }

    // Check rate limiting
    if (this.isRateLimited()) {
      return notification.priority === 'critical';
    }

    // Check user context
    if (notification.context.userState === 'busy' && notification.priority !== 'high') {
      return false;
    }

    // Check if user is likely to be productive
    if (notification.context.productivityScore < 0.3 && notification.type === 'reminder') {
      return false;
    }

    return true;
  }

  async displayNotification(notification) {
    try {
      // Create enhanced notification content
      const content = this.createNotificationContent(notification);
      
      // Show browser notification if available
      if ('Notification' in window && Notification.permission === 'granted') {
        const browserNotification = new Notification(content.title, {
          body: content.body,
          icon: content.icon,
          badge: '/icons/badge-72x72.png',
          tag: notification.id,
          requireInteraction: notification.priority === 'critical',
          actions: content.actions,
          data: notification
        });

        browserNotification.onclick = () => {
          this.handleNotificationClick(notification);
          browserNotification.close();
        };

        setTimeout(() => {
          browserNotification.close();
        }, content.duration);
      }

      // Show in-app notification
      this.showInAppNotification(content);
      
      // Track notification
      this.trackNotification(notification);
      
      console.log('🔔 Smart notification displayed:', notification.id);
      return true;
    } catch (error) {
      console.error('❌ Notification display failed:', error);
      return false;
    }
  }

  createNotificationContent(notification) {
    const personalized = notification.personalization;
    
    return {
      title: personalized.title || notification.title,
      body: personalized.message || notification.message,
      icon: notification.icon || '/icons/icon-192x192.png',
      duration: this.calculateNotificationDuration(notification),
      actions: this.generateNotificationActions(notification),
      style: this.getNotificationStyle(notification.priority)
    };
  }

  generateNotificationActions(notification) {
    const actions = [];
    
    switch (notification.type) {
      case 'reminder':
        actions.push(
          { action: 'snooze', title: 'Snooze 15min' },
          { action: 'complete', title: 'Mark Done' }
        );
        break;
        
      case 'insight':
        actions.push(
          { action: 'view', title: 'View Details' },
          { action: 'dismiss', title: 'Dismiss' }
        );
        break;
        
      case 'achievement':
        actions.push(
          { action: 'share', title: 'Share' },
          { action: 'continue', title: 'Keep Going' }
        );
        break;
    }
    
    return actions;
  }

  calculateNotificationDuration(notification) {
    const baseDuration = {
      'low': 3000,
      'medium': 5000,
      'high': 8000,
      'critical': 0 // Persistent
    };
    
    return baseDuration[notification.priority] || 5000;
  }

  getNotificationStyle(priority) {
    const styles = {
      'low': { backgroundColor: '#e3f2fd', borderColor: '#2196f3' },
      'medium': { backgroundColor: '#fff3e0', borderColor: '#ff9800' },
      'high': { backgroundColor: '#fce4ec', borderColor: '#e91e63' },
      'critical': { backgroundColor: '#ffebee', borderColor: '#f44336' }
    };
    
    return styles[priority] || styles.medium;
  }

  showInAppNotification(content) {
    const container = document.getElementById('notificationContainer');
    if (!container) return;

    const notificationElement = document.createElement('div');
    notificationElement.className = `notification smart-notification ${content.style.priority || ''}`;
    notificationElement.style.backgroundColor = content.style.backgroundColor;
    notificationElement.style.borderLeftColor = content.style.borderColor;
    
    notificationElement.innerHTML = `
      <div class="notification-header">
        <div class="notification-icon">${content.icon}</div>
        <div class="notification-title">${content.title}</div>
        <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
      <div class="notification-body">${content.body}</div>
      ${content.actions.length > 0 ? `
        <div class="notification-actions">
          ${content.actions.map(action => 
            `<button class="notification-action" data-action="${action.action}">${action.title}</button>`
          ).join('')}
        </div>
      ` : ''}
    `;

    // Add event listeners for actions
    content.actions.forEach(action => {
      const button = notificationElement.querySelector(`[data-action="${action.action}"]`);
      if (button) {
        button.addEventListener('click', () => {
          this.handleNotificationAction(action.action, content);
          notificationElement.remove();
        });
      }
    });

    container.appendChild(notificationElement);

    // Auto-remove after duration
    if (content.duration > 0) {
      setTimeout(() => {
        if (notificationElement.parentNode) {
          notificationElement.remove();
        }
      }, content.duration);
    }
  }

  handleNotificationClick(notification) {
    console.log('🔔 Notification clicked:', notification.id);
    
    // Track interaction
    this.trackNotificationInteraction(notification.id, 'click');
    
    // Handle based on notification type
    switch (notification.type) {
      case 'reminder':
        this.handleReminderClick(notification);
        break;
      case 'insight':
        this.handleInsightClick(notification);
        break;
      case 'achievement':
        this.handleAchievementClick(notification);
        break;
    }
  }

  handleNotificationAction(action, notification) {
    console.log('🔔 Notification action:', action);
    
    switch (action) {
      case 'snooze':
        this.snoozeNotification(notification, 15); // 15 minutes
        break;
      case 'complete':
        this.markNotificationComplete(notification);
        break;
      case 'view':
        this.showNotificationDetails(notification);
        break;
      case 'share':
        this.shareAchievement(notification);
        break;
    }
  }

  generateProactiveNotifications() {
    if (!this.userPreferences.enableSmart) return;

    console.log('🤖 Generating proactive notifications...');

    try {
      // Usage reminders
      this.generateUsageReminders();
      
      // Goal progress notifications
      this.generateGoalProgressNotifications();
      
      // Optimization suggestions
      this.generateOptimizationNotifications();
      
      // Achievement notifications
      this.generateAchievementNotifications();
      
      // Insight notifications
      this.generateInsightNotifications();
    } catch (error) {
      console.error('❌ Proactive notification generation failed:', error);
    }
  }

  generateUsageReminders() {
    const now = new Date();
    const hour = now.getHours();
    
    // Morning productivity reminder
    if (hour === 9) {
      const mostProductiveFeature = this.findMostProductiveFeature();
      if (mostProductiveFeature) {
        this.queueNotification({
          type: 'reminder',
          title: 'Morning Productivity Boost',
          message: `Start your day with ${mostProductiveFeature.name}! You're most productive with this feature in the morning.`,
          icon: mostProductiveFeature.icon,
          priority: 'medium',
          category: 'productivity'
        });
      }
    }

    // Afternoon creative reminder
    if (hour === 14) {
      const creativeFeatures = this.getUnderutilizedCreativeFeatures();
      if (creativeFeatures.length > 0) {
        const feature = creativeFeatures[0];
        this.queueNotification({
          type: 'reminder',
          title: 'Creative Afternoon',
          message: `Perfect time for ${feature.name}! You have ${feature.remainingQuota} uses left this month.`,
          icon: feature.icon,
          priority: 'medium',
          category: 'creative'
        });
      }
    }
  }

  generateGoalProgressNotifications() {
    const goals = StorageService.get('goals', []);
    
    goals.forEach(goal => {
      if (goal.status === 'active') {
        const progress = this.calculateGoalProgress(goal);
        
        // Milestone notifications
        if (progress >= 25 && progress < 30 && !goal.notified25) {
          this.queueNotification({
            type: 'achievement',
            title: 'Quarter Way There!',
            message: `You're 25% towards your ${goal.title} goal. Keep it up!`,
            icon: '🎯',
            priority: 'low',
            category: 'goals'
          });
          goal.notified25 = true;
        }
        
        if (progress >= 75 && progress < 80 && !goal.notified75) {
          this.queueNotification({
            type: 'achievement',
            title: 'Almost There!',
            message: `You're 75% towards your ${goal.title} goal. Final push!`,
            icon: '🚀',
            priority: 'medium',
            category: 'goals'
          });
          goal.notified75 = true;
        }
      }
    });
  }

  generateOptimizationNotifications() {
    if (!this.app.mlAnalytics) return;

    const optimizations = this.app.mlAnalytics.getOptimizations();
    const highImpactOptimizations = optimizations.filter(opt => opt.impact === 'high');
    
    if (highImpactOptimizations.length > 0) {
      const optimization = highImpactOptimizations[0];
      this.queueNotification({
        type: 'insight',
        title: 'Optimization Opportunity',
        message: `${optimization.title}: ${optimization.description}`,
        icon: '💡',
        priority: 'medium',
        category: 'optimization',
        data: optimization
      });
    }
  }

  generateAchievementNotifications() {
    // Check for new achievements
    const achievements = this.detectNewAchievements();
    
    achievements.forEach(achievement => {
      this.queueNotification({
        type: 'achievement',
        title: achievement.title,
        message: achievement.description,
        icon: achievement.icon,
        priority: 'high',
        category: 'achievement',
        data: achievement
      });
    });
  }

  detectNewAchievements() {
    const achievements = [];
    const productivityScore = this.app.analytics?.getProductivityScore() || 0;
    
    // High productivity achievement
    if (productivityScore >= 90) {
      achievements.push({
        title: 'Productivity Master!',
        description: `Amazing! You've reached ${productivityScore}% productivity score.`,
        icon: '🏆'
      });
    }
    
    // Consistency achievement
    const consistentDays = this.calculateConsistentDays();
    if (consistentDays >= 7) {
      achievements.push({
        title: 'Consistency Champion!',
        description: `You've used AI tools for ${consistentDays} days straight!`,
        icon: '🔥'
      });
    }
    
    return achievements;
  }

  // Utility methods
  generateNotificationId() {
    return `smart_notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  calculatePriority(notification, context) {
    let priority = notification.priority || 'medium';
    
    // Adjust based on context
    if (context.userState === 'focused' && notification.type === 'reminder') {
      priority = this.lowerPriority(priority);
    }
    
    if (context.productivityScore > 0.8 && notification.category === 'optimization') {
      priority = this.raisePriority(priority);
    }
    
    return priority;
  }

  generatePersonalization(notification, context) {
    const personalization = {
      title: notification.title,
      message: notification.message
    };
    
    // Personalize based on user patterns
    if (context.preferredTime && notification.type === 'reminder') {
      personalization.message += ` (Your most productive time is ${context.preferredTime})`;
    }
    
    // Add user's name if available
    const userName = this.getUserName();
    if (userName) {
      personalization.title = `${userName}, ${personalization.title}`;
    }
    
    return personalization;
  }

  isQuietHour() {
    const hour = new Date().getHours();
    const { start, end } = this.userPreferences.quietHours;
    
    if (start > end) { // Overnight quiet hours
      return hour >= start || hour < end;
    } else {
      return hour >= start && hour < end;
    }
  }

  isRateLimited() {
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);
    
    const recentNotifications = this.notificationHistory.filter(
      n => new Date(n.timestamp).getTime() > oneHourAgo
    );
    
    return recentNotifications.length >= this.userPreferences.maxPerHour;
  }

  trackNotification(notification) {
    this.notificationHistory.push({
      id: notification.id,
      type: notification.type,
      priority: notification.priority,
      timestamp: notification.timestamp,
      shown: true
    });
    
    this.lastNotificationTime = new Date();
    this.savePreferences();
  }

  trackNotificationInteraction(notificationId, interaction) {
    const notification = this.notificationHistory.find(n => n.id === notificationId);
    if (notification) {
      notification.interactions = notification.interactions || [];
      notification.interactions.push({
        type: interaction,
        timestamp: new Date().toISOString()
      });
      this.savePreferences();
    }
  }

  // Queue management
  queueNotification(notification) {
    this.notificationQueue.push(notification);
    console.log('🔔 Notification queued:', notification.title);
  }

  processNotificationQueue() {
    if (this.notificationQueue.length === 0) return;

    // Sort by priority and optimal timing
    this.notificationQueue.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    // Process top notification if conditions are met
    const notification = this.notificationQueue[0];
    if (this.shouldShowImmediately(notification)) {
      this.notificationQueue.shift();
      this.displayNotification(notification);
    }
  }

  // Helper methods
  findMostProductiveFeature() {
    let mostUsed = null;
    let maxUsage = 0;
    
    this.app.data.usage.forEach((usage, featureId) => {
      if (usage.monthly > maxUsage) {
        maxUsage = usage.monthly;
        mostUsed = CONFIG.features[featureId];
      }
    });
    
    return mostUsed;
  }

  getUnderutilizedCreativeFeatures() {
    const creativeFeatures = ['imagen3', 'veo', 'musicAI'];
    const underutilized = [];
    
    creativeFeatures.forEach(featureId => {
      const usage = this.app.data.usage.get(featureId);
      const feature = CONFIG.features[featureId];
      
      if (usage && usage.monthly < feature.quotas.pro.monthly * 0.5) {
        underutilized.push({
          ...feature,
          remainingQuota: feature.quotas.pro.monthly - usage.monthly
        });
      }
    });
    
    return underutilized;
  }

  calculateGoalProgress(goal) {
    if (goal.type === 'usage') {
      const currentUsage = this.app.data.usage.get(goal.featureId)?.monthly || 0;
      return Math.min((currentUsage / goal.target) * 100, 100);
    }
    return 0;
  }

  calculateConsistentDays() {
    // Calculate consecutive days with AI usage
    let consecutive = 0;
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      
      const dayData = this.app.analytics?.analytics?.daily?.get(dateKey);
      const hasUsage = dayData && Object.values(dayData).some(usage => usage > 0);
      
      if (hasUsage) {
        consecutive++;
      } else {
        break;
      }
    }
    
    return consecutive;
  }

  getUserName() {
    // In a real implementation, this would get the user's name from profile
    return null;
  }

  lowerPriority(priority) {
    const order = ['critical', 'high', 'medium', 'low'];
    const currentIndex = order.indexOf(priority);
    return currentIndex < order.length - 1 ? order[currentIndex + 1] : priority;
  }

  raisePriority(priority) {
    const order = ['low', 'medium', 'high', 'critical'];
    const currentIndex = order.indexOf(priority);
    return currentIndex < order.length - 1 ? order[currentIndex + 1] : priority;
  }

  // Public API
  updatePreferences(newPreferences) {
    this.userPreferences = { ...this.userPreferences, ...newPreferences };
    this.savePreferences();
  }

  getNotificationHistory() {
    return this.notificationHistory;
  }

  clearNotificationHistory() {
    this.notificationHistory = [];
    this.savePreferences();
  }

  getQueuedNotifications() {
    return this.notificationQueue;
  }

  clearNotificationQueue() {
    this.notificationQueue = [];
  }
}

// Context Analyzer for Smart Notifications
class NotificationContextAnalyzer {
  constructor(app) {
    this.app = app;
  }

  async analyzeContext() {
    return {
      userState: this.analyzeUserState(),
      productivityScore: this.calculateProductivityScore(),
      currentActivity: this.detectCurrentActivity(),
      timeContext: this.analyzeTimeContext(),
      preferredTime: this.getPreferredTime(),
      focusLevel: this.calculateFocusLevel()
    };
  }

  analyzeUserState() {
    // Analyze user's current state based on recent activity
    const recentActivity = this.getRecentActivity();
    
    if (recentActivity.length === 0) return 'idle';
    if (recentActivity.length > 5) return 'busy';
    return 'active';
  }

  calculateProductivityScore() {
    return this.app.analytics?.getProductivityScore() / 100 || 0;
  }

  detectCurrentActivity() {
    // Detect what the user is currently doing
    const lastUsage = this.getLastUsage();
    return lastUsage ? lastUsage.featureId : null;
  }

  analyzeTimeContext() {
    const hour = new Date().getHours();
    
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 22) return 'evening';
    return 'night';
  }

  getPreferredTime() {
    // Analyze historical data to find user's most productive time
    // This is a simplified version
    const hour = new Date().getHours();
    
    if (hour >= 9 && hour <= 11) return '9-11 AM';
    if (hour >= 14 && hour <= 16) return '2-4 PM';
    return null;
  }

  calculateFocusLevel() {
    // Calculate user's current focus level based on usage patterns
    const recentActivity = this.getRecentActivity();
    const varietyScore = new Set(recentActivity.map(a => a.featureId)).size;
    
    // Lower variety = higher focus
    return Math.max(0, 1 - (varietyScore / 5));
  }

  getRecentActivity() {
    // Get activity from last 30 minutes
    const thirtyMinutesAgo = Date.now() - (30 * 60 * 1000);
    return this.app.data.usage ? Array.from(this.app.data.usage.entries())
      .filter(([_, usage]) => 
        usage.history && usage.history.some(h => 
          new Date(h.date).getTime() > thirtyMinutesAgo
        )
      ) : [];
  }

  getLastUsage() {
    let lastUsage = null;
    let lastTime = 0;
    
    this.app.data.usage.forEach((usage, featureId) => {
      if (usage.lastUsed) {
        const time = new Date(usage.lastUsed).getTime();
        if (time > lastTime) {
          lastTime = time;
          lastUsage = { featureId, time };
        }
      }
    });
    
    return lastUsage;
  }
}

// Timing Optimizer for Smart Notifications
class NotificationTimingOptimizer {
  constructor(app) {
    this.app = app;
  }

  async calculateOptimalTiming(notification, context) {
    const timing = {
      immediate: this.shouldShowImmediately(notification, context),
      delay: this.calculateOptimalDelay(notification, context),
      score: this.calculateTimingScore(notification, context)
    };
    
    return timing;
  }

  shouldShowImmediately(notification, context) {
    // Critical notifications always show immediately
    if (notification.priority === 'critical') return true;
    
    // High priority during active periods
    if (notification.priority === 'high' && context.userState === 'active') return true;
    
    // Productivity notifications during high focus
    if (notification.category === 'productivity' && context.focusLevel > 0.7) return true;
    
    return false;
  }

  calculateOptimalDelay(notification, context) {
    // Calculate delay in minutes
    let delay = 0;
    
    // Delay during busy periods
    if (context.userState === 'busy') {
      delay += 15;
    }
    
    // Delay during low focus
    if (context.focusLevel < 0.3) {
      delay += 10;
    }
    
    // Delay non-urgent notifications during night
    if (context.timeContext === 'night' && notification.priority !== 'high') {
      delay += 480; // 8 hours
    }
    
    return delay;
  }

  calculateTimingScore(notification, context) {
    let score = 0.5; // Base score
    
    // Boost score for good timing
    if (context.timeContext === 'morning' && notification.category === 'productivity') {
      score += 0.3;
    }
    
    if (context.userState === 'active' && notification.priority === 'medium') {
      score += 0.2;
    }
    
    if (context.focusLevel > 0.7 && notification.type === 'insight') {
      score += 0.2;
    }
    
    return Math.min(1, score);
  }
}

// Export for use in main app
window.SmartNotificationSystem = SmartNotificationSystem;