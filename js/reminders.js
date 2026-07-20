// Smart Reminder System
class ReminderService {
  constructor(app) {
    this.app = app;
    this.reminders = new Map();
    this.init();
  }

  init() {
    this.requestNotificationPermission();
    this.scheduleReminders();
    this.startDailyCheck();
  }

  async requestNotificationPermission() {
    if ("Notification" in window && Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      console.log("Notification permission:", permission);
    }
  }

  scheduleReminders() {
    // Schedule daily reminders for underused features
    setInterval(() => {
      this.checkUnderusedFeatures();
    }, 60000 * 60 * 24); // Daily

    // Schedule quota warnings
    setInterval(() => {
      this.checkQuotaWarnings();
    }, 60000 * 60 * 6); // Every 6 hours
  }

  startDailyCheck() {
    // Check every hour for reminders
    setInterval(() => {
      this.checkDailyReminders();
    }, 60000 * 60); // Hourly
  }

  checkUnderusedFeatures() {
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

    Object.keys(CONFIG.features).forEach((featureId) => {
      const feature = CONFIG.features[featureId];
      const usage = this.app.data.usage.get(featureId);

      if (!usage.lastUsed || new Date(usage.lastUsed) < threeDaysAgo) {
        this.sendReminder(featureId, "underused");
      }
    });
  }

  checkQuotaWarnings() {
    Object.keys(CONFIG.features).forEach((featureId) => {
      const feature = CONFIG.features[featureId];
      const usage = this.app.data.usage.get(featureId);
      const percentage = (usage.monthly / feature.quotas.pro.monthly) * 100;

      if (percentage >= 90) {
        this.sendReminder(featureId, "quota", percentage);
      }
    });
  }

  checkDailyReminders() {
    const hour = new Date().getHours();

    // Send morning reminders at 9 AM
    if (hour === 9) {
      this.sendDailyInspiration();
    }

    // Send evening summary at 6 PM
    if (hour === 18) {
      this.sendDailySummary();
    }
  }

  sendReminder(featureId, type, data = null) {
    const feature = CONFIG.features[featureId];
    let message = "";

    switch (type) {
      case "underused":
        message = `You haven't used ${feature.name} recently. Try it today! ${feature.icon}`;
        break;
      case "quota":
        message = `⚠️ You've used ${Math.round(data)}% of your ${
          feature.name
        } quota`;
        break;
      case "daily":
        const templates = CONFIG.reminders.templates.daily;
        const template =
          templates[Math.floor(Math.random() * templates.length)];
        message = template
          .replace("{feature}", feature.name)
          .replace("{icon}", feature.icon);
        break;
    }

    this.showReminder(message, featureId);
  }

  sendDailyInspiration() {
    // Pick a random creative feature for daily inspiration
    const creativeFeatures = Object.keys(CONFIG.features).filter(
      (id) => CONFIG.features[id].category === "creative"
    );

    if (creativeFeatures.length > 0) {
      const randomFeature =
        creativeFeatures[Math.floor(Math.random() * creativeFeatures.length)];
      this.sendReminder(randomFeature, "daily");
    }
  }

  sendDailySummary() {
    let totalUsed = 0;
    let featuresUsed = 0;

    this.app.data.usage.forEach((usage) => {
      totalUsed += usage.daily;
      if (usage.daily > 0) featuresUsed++;
    });

    if (totalUsed > 0) {
      const message = `Daily Summary: Used ${totalUsed} AI features across ${featuresUsed} services today! 📊`;
      this.showReminder(message);
    } else {
      const message = `No AI features used today. Try creating something with Veo or Imagen 3! 🎨`;
      this.showReminder(message);
    }
  }

  showReminder(message, featureId = null) {
    // Show browser notification
    if (Notification.permission === "granted") {
      new Notification("AI Pro Tracker Reminder", {
        body: message,
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🤖</text></svg>',
      });
    }

    // Show in-app notification
    this.app.showNotification(message, "info");

    // Log the reminder
    console.log("Reminder sent:", message);
  }
}
