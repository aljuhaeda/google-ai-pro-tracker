class AIIntelligenceEngine {
  constructor(app) {
    this.app = app;
    this.config = {
      learningRate: 0.01,
      modelUpdateInterval: 3600000, // 1 hour
      confidenceThreshold: 0.7,
      maxHistoryDays: 90
    };
    
    // Core components
    this.behaviorModel = new BehaviorLearningModel(this.config);
    this.contextAnalyzer = new ContextAnalyzer(this.app);
    this.workflowOptimizer = new WorkflowOptimizer(this.app);
    this.adaptiveRecommender = new AdaptiveRecommender(this.app);
    
    // Data stores
    this.userBehaviorData = new Map();
    this.contextHistory = [];
    this.workflowPatterns = new Map();
    this.recommendations = [];
    
    this.init();
  }
  
  async init() {
    await this.loadUserBehaviorData();
    await this.initializeModels();
    this.startLearningLoop();
    console.log('🤖 AI Intelligence Engine initialized');
  }

  async loadUserBehaviorData() {
    const savedData = await StorageService.get('userBehaviorData');
    if (savedData) {
      this.userBehaviorData = new Map(Object.entries(savedData));
    }
  }

  async initializeModels() {
    await this.behaviorModel.trainModel(this.userBehaviorData);
  }

  startLearningLoop() {
    setInterval(() => {
      this.behaviorModel.trainModel(this.userBehaviorData);
    }, this.config.modelUpdateInterval);
  }

  // Core AI methods
  learnUserBehavior(userData) {
    const { userId, sessionData } = userData;
    if (!this.userBehaviorData.has(userId)) {
      this.userBehaviorData.set(userId, []);
    }
    this.userBehaviorData.get(userId).push(sessionData);
    StorageService.set('userBehaviorData', Object.fromEntries(this.userBehaviorData));
  }

  async analyzeContext() {
    const context = await this.contextAnalyzer.analyzeCurrentContext();
    this.contextHistory.push(context);
    if (this.contextHistory.length > 100) {
      this.contextHistory.shift();
    }
    return context;
  }

  async optimizeWorkflow(currentWorkflow) {
    const context = await this.analyzeContext();
    return this.workflowOptimizer.optimizeWorkflow(currentWorkflow, context);
  }

  generateAdaptiveRecommendations() {
    const context = this.contextHistory[this.contextHistory.length - 1];
    return this.adaptiveRecommender.generateRecommendations(context, this.userBehaviorData);
  }
}

class AdaptiveRecommender {
  constructor(app) {
    this.app = app;
  }

  generateRecommendations(context, userBehaviorData) {
    const recommendations = [];

    // Example: Recommend features based on low usage and high estimated value
    const underutilizedFeatures = Array.from(this.app.data.usage.entries())
      .filter(([featureId, usage]) => usage.monthly < CONFIG.features[featureId].quotas.pro.monthly * 0.5)
      .sort((a, b) => CONFIG.features[b[0]].estimatedValue - CONFIG.features[a[0]].estimatedValue)
      .slice(0, 2); // Top 2 underutilized features

    underutilizedFeatures.forEach(([featureId, usage]) => {
      const feature = CONFIG.features[featureId];
      recommendations.push({
        title: `Explore ${feature.name}`,
        message: `You're not fully utilizing ${feature.name}. It has a high estimated value and could boost your productivity!`, 
        icon: feature.icon,
        action: 'showFeature',
        actionData: featureId
      });
    });

    // Example: Recommend optimizing workflow based on context
    if (context && context.analysis.stress > 0.7) {
      recommendations.push({
        title: "Optimize Your Workflow",
        message: "Your current context suggests high stress. Consider optimizing your workflow for better efficiency.",
        icon: "✨",
        action: 'optimizeWorkflow',
        actionData: ''
      });
    }

    // Example: Recommend setting a goal for a frequently used feature
    const mostUsedFeature = Array.from(this.app.data.usage.entries())
      .sort((a, b) => b[1].totalUsed - a[1].totalUsed)[0];

    if (mostUsedFeature && mostUsedFeature[1].totalUsed > 10) {
      const feature = CONFIG.features[mostUsedFeature[0]];
      recommendations.push({
        title: `Set a Goal for ${feature.name}`,
        message: `You use ${feature.name} frequently! Set a goal to maximize its value.`, 
        icon: "🎯",
        action: 'setGoal',
        actionData: feature.id
      });
    }

    return recommendations;
  }
}