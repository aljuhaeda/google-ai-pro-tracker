// Goal Tracking and Management System
class GoalManager {
  constructor(app) {
    this.app = app;
    this.goals = [];
    this.init();
  }

  init() {
    this.loadGoals();
    this.checkGoalProgress();
    console.log("🎯 Goal Manager initialized");
  }

  loadGoals() {
    this.goals = StorageService.get("goals", []);
  }

  saveGoals() {
    StorageService.set("goals", this.goals);
  }

  createGoal(goalData) {
    const goal = {
      id: this.generateGoalId(),
      title: goalData.title,
      description: goalData.description,
      type: goalData.type, // 'usage', 'streak', 'value'
      featureId: goalData.featureId,
      target: goalData.target,
      period: goalData.period, // 'daily', 'weekly', 'monthly'
      status: "active",
      progress: 0,
      createdAt: new Date().toISOString(),
      completedAt: null,
      rewards: goalData.rewards || [],
    };

    this.goals.push(goal);
    this.saveGoals();

    this.app.showNotification(`🎯 Goal created: ${goal.title}`, "success");

    return goal;
  }

  updateGoalProgress(goalId, progress) {
    const goal = this.goals.find((g) => g.id === goalId);
    if (!goal) return;

    goal.progress = Math.min(progress, 100);

    if (goal.progress >= 100 && goal.status === "active") {
      this.completeGoal(goalId);
    }

    this.saveGoals();
  }

  completeGoal(goalId) {
    const goal = this.goals.find((g) => g.id === goalId);
    if (!goal) return;

    goal.status = "completed";
    goal.completedAt = new Date().toISOString();
    goal.progress = 100;

    // Show celebration
    this.app.showNotification(
      `🎉 Goal completed: ${goal.title}! Well done!`,
      "success"
    );

    // Process rewards
    this.processGoalRewards(goal);

    this.saveGoals();
  }

  processGoalRewards(goal) {
    goal.rewards.forEach((reward) => {
      switch (reward.type) {
        case "badge":
          this.awardBadge(reward.data);
          break;
        case "points":
          this.awardPoints(reward.data);
          break;
        case "unlock":
          this.unlockFeature(reward.data);
          break;
      }
    });
  }

  awardBadge(badgeData) {
    const badges = StorageService.get("badges", []);
    badges.push({
      ...badgeData,
      earnedAt: new Date().toISOString(),
    });
    StorageService.set("badges", badges);

    this.app.showNotification(
      `🏆 Badge earned: ${badgeData.name} ${badgeData.icon}`,
      "success"
    );
  }

  awardPoints(points) {
    const currentPoints = StorageService.get("points", 0);
    const newTotal = currentPoints + points;
    StorageService.set("points", newTotal);

    this.app.showNotification(`⭐ +${points} points! Total: ${newTotal}`, "success");
  }

  unlockFeature(featureData) {
    const unlockedFeatures = StorageService.get("unlockedFeatures", []);
    unlockedFeatures.push(featureData);
    StorageService.set("unlockedFeatures", unlockedFeatures);

    this.app.showNotification(`🔓 Unlocked: ${featureData.name}`, "success");
  }

  checkGoalProgress() {
    this.goals.forEach((goal) => {
      if (goal.status === "active") {
        const progress = this.calculateGoalProgress(goal);
        this.updateGoalProgress(goal.id, progress);
      }
    });
  }

  calculateGoalProgress(goal) {
    if (goal.type === 'usage') {
      const currentUsage = this.app.data.usage.get(goal.featureId)?.monthly || 0;
      return Math.min((currentUsage / goal.target) * 100, 100);
    }
    return goal.progress || 0;
  }

  getActiveGoals() {
    return this.goals.filter(goal => goal.status === 'active');
  }

  getCompletedGoals() {
    return this.goals.filter(goal => goal.status === 'completed');
  }

  deleteGoal(goalId) {
    this.goals = this.goals.filter(goal => goal.id !== goalId);
    this.saveGoals();
  }

  getSuggestedGoals() {
    return [
      {
        title: "Creative Streak",
        description: "Use Imagen 3 for 7 consecutive days",
        type: "streak",
        featureId: "imagen3",
        target: 7,
        period: "daily",
        rewards: [
          { type: 'badge', data: { name: 'Creative Streak', icon: '🎨' } },
          { type: 'points', data: 150 }
        ]
      },
      {
        title: "Video Master",
        description: "Create 10 videos with Veo this month",
        type: "usage", 
        featureId: "veo",
        target: 10,
        period: "monthly",
        rewards: [
          { type: 'badge', data: { name: 'Video Master', icon: '🎬' } },
          { type: 'points', data: 200 }
        ]
      },
      {
        title: "AI Assistant",
        description: "Use Gemini Pro 50 times this month",
        type: "usage",
        featureId: "geminiPro", 
        target: 50,
        period: "monthly",
        rewards: [
          { type: 'badge', data: { name: 'AI Assistant', icon: '💬' } },
          { type: 'points', data: 100 }
        ]
      },
      {
        title: "Code Ninja",
        description: "Generate code 25 times this month",
        type: "usage",
        featureId: "codeGeneration",
        target: 25,
        period: "monthly",
        rewards: [
          { type: 'badge', data: { name: 'Code Ninja', icon: '💻' } },
          { type: 'points', data: 175 }
        ]
      },
      {
        title: "Music Composer",
        description: "Create 5 music tracks this month",
        type: "usage",
        featureId: "musicAI",
        target: 5,
        period: "monthly",
        rewards: [
          { type: 'badge', data: { name: 'Music Composer', icon: '🎵' } },
          { type: 'points', data: 125 }
        ]
      }
    ];
  }

  generateGoalId() {
    return 'goal_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}