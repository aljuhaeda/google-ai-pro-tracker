// Smart Insights and Recommendations Engine
class InsightsEngine {
  constructor(app) {
    this.app = app;
    this.insights = [];
    this.recommendations = [];
    this.init();
  }

  init() {
    this.generateInsights();
    this.generateRecommendations();
    console.log("🧠 Insights Engine initialized");
  }

  generateInsights() {
    this.insights = [];

    // Productivity insights
    this.analyzeProductivity();

    // Usage pattern insights
    this.analyzeUsagePatterns();

    // Value optimization insights
    this.analyzeValueOptimization();

    // Trend insights
    this.analyzeTrends();
  }

  analyzeProductivity() {
    const productivityScore = this.app.analytics.getProductivityScore();

    if (productivityScore >= 80) {
      this.insights.push({
        type: "success",
        category: "productivity",
        title: "Excellent Productivity!",
        message: `You're maximizing your AI Pro subscription with a ${productivityScore}% productivity score!`,
        icon: "🚀",
        priority: "high",
      });
    } else if (productivityScore >= 60) {
      this.insights.push({
        type: "info",
        category: "productivity",
        title: "Good Progress",
        message: `Your productivity score is ${productivityScore}%. Try using more creative features to boost it!`,
        icon: "📈",
        priority: "medium",
      });
    } else {
      this.insights.push({
        type: "warning",
        category: "productivity",
        title: "Room for Improvement",
        message: `Your productivity score is ${productivityScore}%. Explore more AI features to get better value!`,
        icon: "💡",
        priority: "high",
      });
    }
  }

  analyzeUsagePatterns() {
    const currentHour = new Date().getHours();
    const usage = this.app.data.usage;

    // Peak usage time analysis
    const peakHours = this.calculatePeakUsageHours();
    if (peakHours.length > 0) {
      this.insights.push({
        type: "info",
        category: "patterns",
        title: "Usage Pattern Detected",
        message: `You're most productive with AI tools around ${peakHours[0]}:00. Consider scheduling creative work during this time!`,
        icon: "⏰",
        priority: "medium",
      });
    }

    // Feature combination insights
    const combinations = this.findFeatureCombinations();
    if (combinations.length > 0) {
      this.insights.push({
        type: "success",
        category: "patterns",
        title: "Smart Workflow",
        message: `You often use ${combinations[0].features.join(
          " + "
        )} together. This is an efficient creative workflow!`,
        icon: "🔄",
        priority: "low",
      });
    }
  }

  analyzeValueOptimization() {
    let totalValue = 0;
    let potentialValue = 0;

    this.app.data.usage.forEach((usage, featureId) => {
      const feature = CONFIG.features[featureId];
      const utilizationRate = Math.min(
        usage.monthly / feature.quotas.pro.monthly,
        1
      );
      totalValue += feature.estimatedValue * utilizationRate;
      potentialValue += feature.estimatedValue;
    });

    const valueRealization = (totalValue / potentialValue) * 100;
    const subscriptionCost = 20; // $20/month for AI Pro

    if (totalValue >= subscriptionCost) {
      this.insights.push({
        type: "success",
        category: "value",
        title: "Great ROI!",
        message: `You're getting $${Math.round(
          totalValue
        )} value from your $${subscriptionCost} subscription!`,
        icon: "💰",
        priority: "high",
      });
    } else {
      const deficit = subscriptionCost - totalValue;
      this.insights.push({
        type: "warning",
        category: "value",
        title: "Optimize Your Value",
        message: `Use $${Math.round(
          deficit
        )} more in AI features to break even on your subscription!`,
        icon: "📊",
        priority: "high",
      });
    }
  }

  analyzeTrends() {
    if (!this.app.analytics) return;

    this.app.analytics.analytics.trends.forEach((trend, featureId) => {
      const feature = CONFIG.features[featureId];

      if (trend.change > 100) {
        this.insights.push({
          type: "success",
          category: "trends",
          title: "Feature Momentum",
          message: `${feature.name} usage doubled this week! You're on fire! 🔥`,
          icon: "📈",
          priority: "medium",
        });
      } else if (trend.change < -50) {
        this.insights.push({
          type: "info",
          category: "trends",
          title: "Feature Decline",
          message: `${feature.name} usage dropped this week. Consider revisiting it!`,
          icon: "📉",
          priority: "low",
        });
      }
    });
  }

  generateRecommendations() {
    this.recommendations = [];

    // Time-based recommendations
    this.generateTimeBasedRecommendations();

    // Feature-specific recommendations
    this.generateFeatureRecommendations();

    // Goal-based recommendations
    this.generateGoalRecommendations();
  }

  generateTimeBasedRecommendations() {
    const hour = new Date().getHours();
    const day = new Date().getDay();

    // Morning recommendations (6-12)
    if (hour >= 6 && hour < 12) {
      this.recommendations.push({
        type: "time",
        title: "Morning Boost",
        message: "Start your day with Gemini Pro for planning and ideation!",
        action: "logUsage",
        actionData: "geminiPro",
        icon: "🌅",
      });
    }

    // Afternoon recommendations (12-18)
    else if (hour >= 12 && hour < 18) {
      this.recommendations.push({
        type: "time",
        title: "Creative Afternoon",
        message: "Perfect time for Imagen 3 or Veo creative work!",
        action: "showFeature",
        actionData: "imagen3",
        icon: "🎨",
      });
    }

    // Evening recommendations (18-22)
    else if (hour >= 18 && hour < 22) {
      this.recommendations.push({
        type: "time",
        title: "Evening Projects",
        message: "Wind down with Music AI or review your daily progress!",
        action: "showFeature",
        actionData: "musicAI",
        icon: "🎵",
      });
    }
  }

  generateFeatureRecommendations() {
    // Find underutilized high-value features
    const underutilized = this.app.analytics.getUnderutilizedFeatures();

    underutilized.slice(0, 2).forEach((feature) => {
      this.recommendations.push({
        type: "feature",
        title: `Try ${feature.name}`,
        message: `You're only using ${Math.round(
          feature.rate * 100
        )}% of this feature's potential!`,
        action: "showTips",
        actionData: feature.id,
        icon: feature.icon,
      });
    });

    // Suggest feature combinations
    const mostUsed = this.app.analytics.getMostUsedFeature();
    if (mostUsed) {
      const suggestions = this.getComplementaryFeatures(mostUsed.id);
      if (suggestions.length > 0) {
        this.recommendations.push({
          type: "combination",
          title: "Perfect Pair",
          message: `Since you love ${
            CONFIG.features[mostUsed.id].name
          }, try combining it with ${CONFIG.features[suggestions[0]].name}!`,
          action: "showFeature",
          actionData: suggestions[0],
          icon: "🤝",
        });
      }
    }
  }

  generateGoalRecommendations() {
    // Check if goals exist and suggest actions
    const goals = StorageService.get("goals", []);

    goals.forEach((goal) => {
      if (goal.status === "active") {
        const progress = this.calculateGoalProgress(goal);

        if (progress < 50) {
          this.recommendations.push({
            type: "goal",
            title: "Goal Progress",
            message: `You're ${Math.round(progress)}% towards your ${
              goal.title
            } goal. Keep going!`,
            action: "showGoals",
            actionData: goal.id,
            icon: "🎯",
          });
        }
      }
    });
  }

  calculatePeakUsageHours() {
    // This would analyze historical data to find peak hours
    // For now, return common productive hours
    return [9, 14, 16]; // 9 AM, 2 PM, 4 PM
  }

  findFeatureCombinations() {
    // Analyze which features are often used together
    return [
      { features: ["Imagen 3", "Veo"], frequency: 5 },
      { features: ["Gemini Pro", "Code Generation"], frequency: 3 },
    ];
  }

  getComplementaryFeatures(featureId) {
    const complementary = {
      imagen3: ["veo", "musicAI"],
      veo: ["imagen3", "musicAI"],
      geminiPro: ["codeGeneration", "workspaceAI"],
      codeGeneration: ["geminiPro", "multimodal"],
      musicAI: ["imagen3", "veo"],
      workspaceAI: ["geminiPro", "multimodal"],
      multimodal: ["codeGeneration", "workspaceAI"],
    };

    return complementary[featureId] || [];
  }

  calculateGoalProgress(goal) {
    // Calculate progress based on goal type and current usage
    if (goal.type === "usage") {
      const currentUsage =
        this.app.data.usage.get(goal.featureId)?.monthly || 0;
      return Math.min((currentUsage / goal.target) * 100, 100);
    }
    return 0;
  }

  getTopInsights(count = 5) {
    return this.insights
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      })
      .slice(0, count);
  }

  getTopRecommendations(count = 3) {
    return this.recommendations.slice(0, count);
  }
}
