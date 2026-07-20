class OptimizationModels {
  constructor(app) {
    this.app = app;
    this.sequenceOptimizer = new SequenceOptimizer();
    this.contextualOptimizer = new ContextualOptimizer();
  }

  optimize(workflow, context) {
    const sequenceOptimizations = this.sequenceOptimizer.optimize(workflow);
    const contextualOptimizations = this.contextualOptimizer.optimize(workflow, context);

    return [...sequenceOptimizations, ...contextualOptimizations];
  }

  predictUsage(featureId, period = 'monthly') {
    // Simple prediction: average usage over available data
    const usageData = this.app.data.usage.get(featureId);
    if (!usageData) return 0;

    if (period === 'monthly') return usageData.monthly;
    if (period === 'weekly') return usageData.weekly;
    if (period === 'daily') return usageData.daily;
    return usageData.totalUsed; // Default to total
  }

  predictValue(featureId) {
    // Predict value based on configured estimated value and current usage
    const featureConfig = CONFIG.features[featureId];
    const usageData = this.app.data.usage.get(featureId);

    if (!featureConfig || !usageData) return 0;

    return featureConfig.estimatedValue * (usageData.monthly / featureConfig.quotas.pro.monthly);
  }

  async predictOptimalTime(taskType, context) {
    // Predict optimal time based on context analysis
    // This is a simplified example; a real model would use historical data
    if (context.workload.meetingDensity > 0.5) {
      return new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours later if busy
    }
    if (context.temporal.timeOfDayCategory === 'morning') {
      return new Date(Date.now() + 30 * 60 * 1000); // 30 mins later in morning
    }
    return new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour later by default
  }
}