// Advanced Analytics Engine
class AnalyticsEngine {
  constructor(app) {
    this.app = app;
    this.analytics = {
      daily: new Map(),
      weekly: new Map(),
      monthly: new Map(),
      trends: new Map(),
    };
    this.init();
  }

  init() {
    this.loadAnalytics();
    this.startTracking();
    this.calculateTrends();
    console.log("📊 Analytics Engine initialized");
  }

  loadAnalytics() {
    const savedAnalytics = StorageService.get("analytics", {});
    Object.keys(savedAnalytics).forEach((period) => {
      if (this.analytics[period]) {
        this.analytics[period] = new Map(
          Object.entries(savedAnalytics[period] || {})
        );
      }
    });
  }

  saveAnalytics() {
    const analyticsData = {};
    Object.keys(this.analytics).forEach((period) => {
      analyticsData[period] = Object.fromEntries(this.analytics[period]);
    });
    StorageService.set("analytics", analyticsData);
  }

  trackUsage(featureId, amount, timestamp = new Date()) {
    const dateKey = timestamp.toISOString().split("T")[0];
    const weekKey = this.getWeekKey(timestamp);
    const monthKey = timestamp.toISOString().substring(0, 7);

    // Track daily
    this.updatePeriodData("daily", dateKey, featureId, amount);

    // Track weekly
    this.updatePeriodData("weekly", weekKey, featureId, amount);

    // Track monthly
    this.updatePeriodData("monthly", monthKey, featureId, amount);

    this.calculateTrends();
    this.saveAnalytics();
  }

  updatePeriodData(period, key, featureId, amount) {
    if (!this.analytics[period].has(key)) {
      this.analytics[period].set(key, {});
    }

    const periodData = this.analytics[period].get(key);
    periodData[featureId] = (periodData[featureId] || 0) + amount;
  }

  getWeekKey(date) {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    return startOfWeek.toISOString().split("T")[0];
  }

  calculateTrends() {
    Object.keys(CONFIG.features).forEach((featureId) => {
      const trend = this.calculateFeatureTrend(featureId);
      this.analytics.trends.set(featureId, trend);
    });
  }

  calculateFeatureTrend(featureId) {
    const weeklyData = Array.from(this.analytics.weekly.values())
      .map(week => week[featureId] || 0)
      .slice(-4); // Last 4 weeks

    if (weeklyData.length < 2) {
      return { direction: "stable", change: 0 };
    }

    const recent = weeklyData.slice(-2).reduce((a, b) => a + b, 0) / 2;
    const previous = weeklyData.slice(-4, -2).reduce((a, b) => a + b, 0) / 2;

    if (previous === 0) {
      return {
        direction: recent > 0 ? "up" : "stable",
        change: recent > 0 ? 100 : 0,
      };
    }

    const change = ((recent - previous) / previous) * 100;
    const direction = change > 5 ? "up" : change < -5 ? "down" : "stable";

    return { direction, change: Math.round(change) };
  }

  startTracking() {
    // Reset daily counters at midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    setTimeout(() => {
      this.resetDailyCounters();
      // Set up daily reset interval
      setInterval(() => {
        this.resetDailyCounters();
      }, 24 * 60 * 60 * 1000);
    }, msUntilMidnight);
  }

  resetDailyCounters() {
    this.app.data.usage.forEach((usage) => {
      usage.daily = 0;
    });
    this.app.saveData();
  }

  getProductivityScore() {
    let totalUsage = 0;
    let totalPossible = 0;
    
    this.app.data.usage.forEach((usage, featureId) => {
      const feature = CONFIG.features[featureId];
      totalUsage += Math.min(usage.monthly, feature.quotas.pro.monthly);
      totalPossible += feature.quotas.pro.monthly;
    });
    
    return Math.round((totalUsage / totalPossible) * 100);
  }

  getUnderutilizedFeatures() {
    const underutilized = [];
    this.app.data.usage.forEach((usage, featureId) => {
      const feature = CONFIG.features[featureId];
      const rate = usage.monthly / feature.quotas.pro.monthly;
      if (rate < 0.3) {
        underutilized.push({ id: featureId, name: feature.name, rate, icon: feature.icon });
      }
    });
    return underutilized.sort((a, b) => a.rate - b.rate);
  }

  getMostUsedFeature() {
    let mostUsed = null;
    let maxUsage = 0;
    
    this.app.data.usage.forEach((usage, featureId) => {
      if (usage.monthly > maxUsage) {
        maxUsage = usage.monthly;
        mostUsed = { id: featureId, usage: maxUsage };
      }
    });
    
    return mostUsed;
  }

  getLast7DaysData(featureId) {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      
      const dayData = this.analytics.daily.get(dateKey);
      data.push(dayData && dayData[featureId] ? dayData[featureId] : 0);
    }
    return data;
  }
}