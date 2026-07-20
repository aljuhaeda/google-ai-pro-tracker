// Enhanced Notification System
class NotificationManager {
  constructor(app) {
    this.app = app;
    this.notifications = [];
    this.settings = {
      enabled: true,
      sound: true,
      desktop: true,
      timing: "smart", // 'immediate', 'smart', 'scheduled'
      quietHours: {
        enabled: true,
        start: "22:00",
        end: "08:00",
      },
    };
    this.init();
  }

  init() {
    this.loadSettings();
    this.requestPermissions();
    this.scheduleSmartNotifications();
    console.log("🔔 Enhanced Notification Manager initialized");
  }

  loadSettings() {
    this.settings = {
      ...this.settings,
      ...StorageService.get("notificationSettings", {}),
    };
  }

  saveSettings() {
    StorageService.set("notificationSettings", this.settings);
  }

  async requestPermissions() {
    if ("Notification" in window && Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      console.log("Notification permission:", permission);
    }
  }

  scheduleSmartNotifications() {
    // Schedule different types of smart notifications
    this.scheduleMotivationalReminders();
    this.scheduleUsageReminders();
    this.scheduleGoalReminders();
    this.scheduleInsightNotifications();
  }

  scheduleMotivationalReminders() {
    // Morning motivation (9 AM)
    this.scheduleDaily("09:00", () => {
      const messages = [
        "🌟 Ready to create something amazing today?",
        "💡 Your AI tools are waiting to help you innovate!",
        "🚀 Let's make today more productive than yesterday!",
        "✨ Time to turn ideas into reality with AI!",
      ];

      const message = messages[Math.floor(Math.random() * messages.length)];
      this.showNotification(message, "motivation", { persistent: false });
    });

    // Afternoon boost (2 PM)
    this.scheduleDaily("14:00", () => {
      const underutilized = this.app.analytics.getUnderutilizedFeatures();
      if (underutilized.length > 0) {
        const feature = underutilized[0];
        this.showNotification(
          `🎯 Afternoon challenge: Try ${feature.name} to boost your productivity!`,
          "challenge",
          {
            action: "showFeature",
            actionData: feature.id,
            persistent: true,
          }
        );
      }
    });
  }

  scheduleUsageReminders() {
    // Check for unused features every 6 hours
    setInterval(() => {
      this.checkUnusedFeatures();
    }, 6 * 60 * 60 * 1000);

    // Quota warnings (check every 2 hours)
    setInterval(() => {
      this.checkQuotaWarnings();
    }, 2 * 60 * 60 * 1000);
  }

  scheduleGoalReminders() {
    // Daily goal check (6 PM)
    this.scheduleDaily("18:00", () => {
      this.checkGoalProgress();
    });

    // Weekly goal summary (Sunday 7 PM)
    this.scheduleWeekly(0, "19:00", () => {
      this.sendWeeklyGoalSummary();
    });
  }

  scheduleInsightNotifications() {
    // Daily insights (8 PM)
    this.scheduleDaily("20:00", () => {
      this.sendDailyInsights();
    });
  }

  scheduleDaily(time, callback) {
    const [hours, minutes] = time.split(":").map(Number);
    const now = new Date();
    const scheduledTime = new Date(now);
    scheduledTime.setHours(hours, minutes, 0, 0);

    // If the time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const delay = scheduledTime.getTime() - now.getTime();

    setTimeout(() => {
      if (this.canShowNotification()) {
        callback();
      }
      // Schedule for next day
      setInterval(() => {
        if (this.canShowNotification()) {
          callback();
        }
      }, 24 * 60 * 60 * 1000);
    }, delay);
  }

  scheduleWeekly(dayOfWeek, time, callback) {
    const [hours, minutes] = time.split(":").map(Number);
    const now = new Date();
    const scheduledTime = new Date(now);

    // Calculate days until target day
    const daysUntilTarget = (dayOfWeek - now.getDay() + 7) % 7;
    scheduledTime.setDate(now.getDate() + daysUntilTarget);
    scheduledTime.setHours(hours, minutes, 0, 0);

    // If the time has passed this week, schedule for next week
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 7);
    }

    const delay = scheduledTime.getTime() - now.getTime();

    setTimeout(() => {
      if (this.canShowNotification()) {
        callback();
      }
      // Schedule for next week
      setInterval(() => {
        if (this.canShowNotification()) {
          callback();
        }
      }, 7 * 24 * 60 * 60 * 1000);
    }, delay);
  }

  canShowNotification() {
    if (!this.settings.enabled) return false;

    if (this.settings.quietHours.enabled) {
      const now = new Date();
      const currentTime =
        now.getHours().toString().padStart(2, "0") +
        ":" +
        now.getMinutes().toString().padStart(2, "0");

      const start = this.settings.quietHours.start;
      const end = this.settings.quietHours.end;

      // Handle overnight quiet hours (e.g., 22:00 to 08:00)
      if (start > end) {
        if (currentTime >= start || currentTime <= end) {
          return false;
        }
      } else {
        if (currentTime >= start && currentTime <= end) {
          return false;
        }
      }
    }

    return true;
  }

  showNotification(message, type = "info", options = {}) {
    const notification = {
      id: this.generateNotificationId(),
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false,
      ...options,
    };

    this.notifications.unshift(notification);

    // Limit notification history
    if (this.notifications.length > 100) {
      this.notifications = this.notifications.slice(0, 100);
    }

    // Show in-app notification
    this.displayInAppNotification(notification);

    // Show desktop notification if enabled
    if (
      this.settings.desktop &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      this.showDesktopNotification(notification);
    }

    // Play sound if enabled
    if (this.settings.sound) {
      this.playNotificationSound(type);
    }

    // Save to storage
    this.saveNotifications();

    return notification;
  }

  displayInAppNotification(notification) {
    const container = document.getElementById("notificationContainer");
    if (!container) return;

    const element = document.createElement("div");
    element.className = `notification enhanced ${notification.type}`;
    element.innerHTML = `
            <div class="notification-content">
                <div class="notification-message">${notification.message}</div>
                <div class="notification-time">${new Date(
                  notification.timestamp
                ).toLocaleTimeString()}</div>
            </div>
            <div class="notification-actions">
                ${
                  notification.action
                    ? `<button class="notification-action" data-action="${notification.action}" data-data="${notification.actionData}">Act</button>`
                    : ""
                }
                <button class="notification-close">×</button>
            </div>
        `;

    // Add event listeners
    element
      .querySelector(".notification-close")
      .addEventListener("click", () => {
        element.remove();
      });

    if (notification.action) {
      element
        .querySelector(".notification-action")
        .addEventListener("click", () => {
          this.handleNotificationAction(notification);
          element.remove();
        });
    }

    container.appendChild(element);

    // Auto-remove if not persistent
    if (!notification.persistent) {
      setTimeout(() => {
        if (element.parentNode) {
          element.remove();
        }
      }, 5000);
    }
  }

  showDesktopNotification(notification) {
    const desktopNotification = new Notification("AI Pro Tracker", {
      body: notification.message,
      icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🤖</text></svg>',
      tag: notification.id,
    });

    desktopNotification.onclick = () => {
      window.focus();
      if (notification.action) {
        this.handleNotificationAction(notification);
      }
      desktopNotification.close();
    };

    // Auto-close after 5 seconds
    setTimeout(() => {
      desktopNotification.close();
    }, 5000);
  }

  playNotificationSound(type) {
    // Create audio context for notification sounds
    if (
      typeof AudioContext !== "undefined" ||
      typeof webkitAudioContext !== "undefined"
    ) {
      const audioContext = new (AudioContext || webkitAudioContext)();

      // Generate different tones for different notification types
      const frequencies = {
        info: 440,
        success: 523,
        warning: 349,
        error: 294,
        motivation: 659,
        challenge: 587,
      };

      const frequency = frequencies[type] || frequencies.info;
      this.playTone(audioContext, frequency, 0.1, 200);
    }
  }

  playTone(audioContext, frequency, volume, duration) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(
      volume,
      audioContext.currentTime + 0.01
    );
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + duration / 1000
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
  }

  handleNotificationAction(notification) {
    switch (notification.action) {
      case "showFeature":
        this.app.switchView("features");
        // Highlight specific feature
        break;
      case "logUsage":
        this.app.logUsage(notification.actionData);
        break;
      case "showGoals":
        this.app.switchView("goals");
        break;
      case "showTips":
        this.app.showTips(notification.actionData);
        break;
    }
  }

  checkUnusedFeatures() {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

    this.app.data.usage.forEach((usage, featureId) => {
      const feature = CONFIG.features[featureId];
      const lastUsed = usage.lastUsed ? new Date(usage.lastUsed) : null;

      if (!lastUsed || lastUsed < threeDaysAgo) {
        this.showNotification(
          `💡 Haven't used ${feature.name} lately? It might be perfect for your current project!`,
          "suggestion",
          {
            action: "showTips",
            actionData: featureId,
            persistent: true,
          }
        );
      }
    });
  }

  checkQuotaWarnings() {
    this.app.data.usage.forEach((usage, featureId) => {
      const feature = CONFIG.features[featureId];
      const percentage = (usage.monthly / feature.quotas.pro.monthly) * 100;

      if (percentage >= 90) {
        this.showNotification(
          `⚠️ ${feature.name} quota at ${Math.round(
            percentage
          )}%! Plan your usage carefully.`,
          "warning",
          { persistent: true }
        );
      } else if (percentage >= 75) {
        this.showNotification(
          `📊 ${feature.name} quota at ${Math.round(
            percentage
          )}%. Consider optimizing your usage.`,
          "info"
        );
      }
    });
  }

  checkGoalProgress() {
    const goals = this.app.goalManager.getActiveGoals();

    goals.forEach((goal) => {
      if (goal.progress < 30) {
        this.showNotification(
          `🎯 Goal "${goal.title}" needs attention! You're at ${Math.round(
            goal.progress
          )}% progress.`,
          "challenge",
          {
            action: "showGoals",
            actionData: goal.id,
            persistent: true,
          }
        );
      } else if (goal.progress >= 80) {
        this.showNotification(
          `🔥 Almost there! "${goal.title}" is at ${Math.round(
            goal.progress
          )}%. Push to finish!`,
          "motivation"
        );
      }
    });
  }

  sendWeeklyGoalSummary() {
    const completedThisWeek = this.app.goalManager
      .getCompletedGoals()
      .filter((goal) => {
        const completed = new Date(goal.completedAt);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return completed > weekAgo;
      });

    const message =
      completedThisWeek.length > 0
        ? `🏆 Great week! You completed ${completedThisWeek.length} goal(s). Keep up the momentum!`
        : `📈 New week, new opportunities! Set some goals to maximize your AI Pro value.`;

    this.showNotification(message, "summary", { persistent: true });
  }

  sendDailyInsights() {
    const insights = this.app.insightsEngine.getTopInsights(1);
    if (insights.length > 0) {
      this.showNotification(
        `💡 Daily Insight: ${insights[0].message}`,
        "insight",
        { persistent: true }
      );
    }
  }

  generateNotificationId() {
    return (
      "notif_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
    );
  }

  saveNotifications() {
    // Save only recent notifications to avoid storage bloat
    const recentNotifications = this.notifications.slice(0, 50);
    StorageService.set("notifications", recentNotifications);
  }

  loadNotifications() {
    this.notifications = StorageService.get("notifications", []);
  }

  markAsRead(notificationId) {
    const notification = this.notifications.find(
      (n) => n.id === notificationId
    );
    if (notification) {
      notification.read = true;
      this.saveNotifications();
    }
  }

  getUnreadCount() {
    return this.notifications.filter((n) => !n.read).length;
  }

  clearAll() {
    this.notifications = [];
    this.saveNotifications();
  }
}
