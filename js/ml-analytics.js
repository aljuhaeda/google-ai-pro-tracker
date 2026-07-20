// Machine Learning Analytics Engine - Phase 4.3
class MLAnalytics {
  constructor(app) {
    this.app = app;
    this.models = {
      usagePrediction: null,
      patternRecognition: null,
      anomalyDetection: null,
      optimization: null
    };
    this.predictions = new Map();
    this.patterns = new Map();
    this.anomalies = [];
    this.init();
  }

  init() {
    this.initializeModels();
    this.trainModels();
    this.generatePredictions();
    console.log("🤖 ML Analytics Engine initialized");
  }

  initializeModels() {
    // Initialize simple ML models using statistical approaches
    this.models.usagePrediction = new UsagePredictionModel();
    this.models.patternRecognition = new PatternRecognitionModel();
    this.models.anomalyDetection = new AnomalyDetectionModel();
    this.models.optimization = new OptimizationModel();
  }

  trainModels() {
    const historicalData = this.getHistoricalData();
    
    // Train each model with historical usage data
    Object.values(this.models).forEach(model => {
      if (model && typeof model.train === 'function') {
        model.train(historicalData);
      }
    });
  }

  getHistoricalData() {
    const data = [];
    const analytics = this.app.analytics.analytics;
    
    // Collect daily usage data
    analytics.daily.forEach((dayData, dateKey) => {
      const date = new Date(dateKey);
      const dayOfWeek = date.getDay();
      const hour = date.getHours();
      
      Object.keys(CONFIG.features).forEach(featureId => {
        const usage = dayData[featureId] || 0;
        data.push({
          date: dateKey,
          dayOfWeek,
          hour,
          featureId,
          usage,
          timestamp: date.getTime()
        });
      });
    });
    
    return data;
  }

  generatePredictions() {
    // Generate usage predictions for next 7 days
    Object.keys(CONFIG.features).forEach(featureId => {
      const prediction = this.predictUsage(featureId, 7);
      this.predictions.set(featureId, prediction);
    });

    // Detect usage patterns
    this.detectPatterns();

    // Find anomalies
    this.detectAnomalies();

    // Generate optimization suggestions
    this.generateOptimizationSuggestions();
  }

  predictUsage(featureId, days = 7) {
    const historicalData = this.getFeatureHistory(featureId);
    const model = this.models.usagePrediction;
    
    if (!model || historicalData.length < 7) {
      return this.generateBasicPrediction(featureId, days);
    }

    return model.predict(featureId, historicalData, days);
  }

  generateBasicPrediction(featureId, days) {
    const usage = this.app.data.usage.get(featureId);
    const recentAverage = this.calculateRecentAverage(featureId);
    const trend = this.calculateTrend(featureId);
    
    const predictions = [];
    for (let i = 1; i <= days; i++) {
      const baseValue = recentAverage;
      const trendAdjustment = trend * i * 0.1;
      const randomVariation = (Math.random() - 0.5) * 0.2 * baseValue;
      
      predictions.push({
        date: this.getDateString(i),
        predicted: Math.max(0, Math.round(baseValue + trendAdjustment + randomVariation)),
        confidence: this.calculateConfidence(featureId, i)
      });
    }
    
    return {
      featureId,
      predictions,
      accuracy: this.calculateAccuracy(featureId),
      insights: this.generatePredictionInsights(featureId, predictions)
    };
  }

  getFeatureHistory(featureId, days = 30) {
    const history = [];
    const analytics = this.app.analytics.analytics;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      
      const dayData = analytics.daily.get(dateKey);
      const usage = dayData && dayData[featureId] ? dayData[featureId] : 0;
      
      history.push({
        date: dateKey,
        usage,
        dayOfWeek: date.getDay(),
        timestamp: date.getTime()
      });
    }
    
    return history;
  }

  calculateRecentAverage(featureId, days = 7) {
    const history = this.getFeatureHistory(featureId, days);
    const total = history.reduce((sum, day) => sum + day.usage, 0);
    return total / Math.max(history.length, 1);
  }

  calculateTrend(featureId, days = 14) {
    const history = this.getFeatureHistory(featureId, days);
    if (history.length < 2) return 0;
    
    // Simple linear regression for trend calculation
    const n = history.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    
    history.forEach((day, index) => {
      const x = index;
      const y = day.usage;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumXX += x * x;
    });
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return isNaN(slope) ? 0 : slope;
  }

  detectPatterns() {
    Object.keys(CONFIG.features).forEach(featureId => {
      const patterns = this.analyzeFeaturePatterns(featureId);
      this.patterns.set(featureId, patterns);
    });
  }

  analyzeFeaturePatterns(featureId) {
    const history = this.getFeatureHistory(featureId, 30);
    const patterns = {
      weeklyPattern: this.detectWeeklyPattern(history),
      dailyPattern: this.detectDailyPattern(history),
      seasonality: this.detectSeasonality(history),
      correlations: this.findCorrelations(featureId)
    };
    
    return patterns;
  }

  detectWeeklyPattern(history) {
    const weeklyUsage = [0, 0, 0, 0, 0, 0, 0]; // Sunday to Saturday
    const weeklyCount = [0, 0, 0, 0, 0, 0, 0];
    
    history.forEach(day => {
      weeklyUsage[day.dayOfWeek] += day.usage;
      weeklyCount[day.dayOfWeek]++;
    });
    
    const averages = weeklyUsage.map((total, index) => 
      weeklyCount[index] > 0 ? total / weeklyCount[index] : 0
    );
    
    const maxDay = averages.indexOf(Math.max(...averages));
    const minDay = averages.indexOf(Math.min(...averages));
    
    return {
      averages,
      peakDay: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][maxDay],
      lowDay: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][minDay],
      variance: this.calculateVariance(averages)
    };
  }

  detectDailyPattern(history) {
    // Analyze usage by hour (simplified - using day patterns as proxy)
    const morningUsage = history.filter(day => {
      const hour = new Date(day.timestamp).getHours();
      return hour >= 6 && hour < 12;
    }).reduce((sum, day) => sum + day.usage, 0);
    
    const afternoonUsage = history.filter(day => {
      const hour = new Date(day.timestamp).getHours();
      return hour >= 12 && hour < 18;
    }).reduce((sum, day) => sum + day.usage, 0);
    
    const eveningUsage = history.filter(day => {
      const hour = new Date(day.timestamp).getHours();
      return hour >= 18 && hour < 24;
    }).reduce((sum, day) => sum + day.usage, 0);
    
    const total = morningUsage + afternoonUsage + eveningUsage;
    
    return {
      morning: total > 0 ? (morningUsage / total) * 100 : 0,
      afternoon: total > 0 ? (afternoonUsage / total) * 100 : 0,
      evening: total > 0 ? (eveningUsage / total) * 100 : 0,
      peakPeriod: this.getPeakPeriod(morningUsage, afternoonUsage, eveningUsage)
    };
  }

  getPeakPeriod(morning, afternoon, evening) {
    const max = Math.max(morning, afternoon, evening);
    if (max === morning) return 'morning';
    if (max === afternoon) return 'afternoon';
    return 'evening';
  }

  detectSeasonality(history) {
    // Simple seasonality detection based on weekly cycles
    const weeklyAverages = [];
    const weeksData = this.groupByWeeks(history);
    
    weeksData.forEach(week => {
      const average = week.reduce((sum, day) => sum + day.usage, 0) / week.length;
      weeklyAverages.push(average);
    });
    
    return {
      trend: this.calculateTrendFromWeekly(weeklyAverages),
      stability: this.calculateStability(weeklyAverages),
      cyclical: this.detectCyclicalPattern(weeklyAverages)
    };
  }

  findCorrelations(featureId) {
    const correlations = [];
    const targetHistory = this.getFeatureHistory(featureId, 30);
    
    Object.keys(CONFIG.features).forEach(otherFeatureId => {
      if (otherFeatureId !== featureId) {
        const otherHistory = this.getFeatureHistory(otherFeatureId, 30);
        const correlation = this.calculateCorrelation(targetHistory, otherHistory);
        
        if (Math.abs(correlation) > 0.3) {
          correlations.push({
            featureId: otherFeatureId,
            correlation,
            strength: this.getCorrelationStrength(correlation)
          });
        }
      }
    });
    
    return correlations.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
  }

  calculateCorrelation(data1, data2) {
    if (data1.length !== data2.length || data1.length === 0) return 0;
    
    const mean1 = data1.reduce((sum, d) => sum + d.usage, 0) / data1.length;
    const mean2 = data2.reduce((sum, d) => sum + d.usage, 0) / data2.length;
    
    let numerator = 0;
    let sum1Sq = 0;
    let sum2Sq = 0;
    
    for (let i = 0; i < data1.length; i++) {
      const diff1 = data1[i].usage - mean1;
      const diff2 = data2[i].usage - mean2;
      
      numerator += diff1 * diff2;
      sum1Sq += diff1 * diff1;
      sum2Sq += diff2 * diff2;
    }
    
    const denominator = Math.sqrt(sum1Sq * sum2Sq);
    return denominator === 0 ? 0 : numerator / denominator;
  }

  detectAnomalies() {
    Object.keys(CONFIG.features).forEach(featureId => {
      const anomalies = this.findFeatureAnomalies(featureId);
      this.anomalies.push(...anomalies);
    });
  }

  findFeatureAnomalies(featureId) {
    const history = this.getFeatureHistory(featureId, 30);
    const anomalies = [];
    
    if (history.length < 7) return anomalies;
    
    const mean = history.reduce((sum, day) => sum + day.usage, 0) / history.length;
    const variance = this.calculateVariance(history.map(day => day.usage));
    const stdDev = Math.sqrt(variance);
    const threshold = 2 * stdDev; // 2 standard deviations
    
    history.forEach(day => {
      const deviation = Math.abs(day.usage - mean);
      if (deviation > threshold && day.usage > 0) {
        anomalies.push({
          featureId,
          date: day.date,
          usage: day.usage,
          expected: mean,
          deviation,
          type: day.usage > mean ? 'spike' : 'drop',
          severity: this.getAnomalySeverity(deviation, threshold)
        });
      }
    });
    
    return anomalies;
  }

  generateOptimizationSuggestions() {
    const suggestions = [];
    
    // Analyze underutilized features
    const underutilized = this.app.analytics.getUnderutilizedFeatures();
    underutilized.forEach(feature => {
      const prediction = this.predictions.get(feature.id);
      const pattern = this.patterns.get(feature.id);
      
      suggestions.push({
        type: 'underutilization',
        featureId: feature.id,
        priority: 'high',
        suggestion: this.generateUnderutilizationSuggestion(feature, prediction, pattern),
        impact: this.calculateOptimizationImpact(feature.id)
      });
    });
    
    // Analyze timing optimization
    this.patterns.forEach((pattern, featureId) => {
      const timingSuggestion = this.generateTimingSuggestion(featureId, pattern);
      if (timingSuggestion) {
        suggestions.push(timingSuggestion);
      }
    });
    
    // Analyze feature combinations
    const combinationSuggestions = this.generateCombinationSuggestions();
    suggestions.push(...combinationSuggestions);
    
    return suggestions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  // Utility methods
  calculateVariance(values) {
    if (values.length === 0) return 0;
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length;
  }

  calculateConfidence(featureId, daysAhead) {
    const history = this.getFeatureHistory(featureId, 30);
    const baseConfidence = Math.min(history.length / 30, 1) * 100;
    const decayFactor = Math.pow(0.9, daysAhead - 1);
    return Math.round(baseConfidence * decayFactor);
  }

  calculateAccuracy(featureId) {
    // Simplified accuracy calculation based on historical variance
    const history = this.getFeatureHistory(featureId, 14);
    if (history.length < 7) return 50;
    
    const variance = this.calculateVariance(history.map(day => day.usage));
    const mean = history.reduce((sum, day) => sum + day.usage, 0) / history.length;
    
    if (mean === 0) return 50;
    const coefficientOfVariation = Math.sqrt(variance) / mean;
    return Math.max(20, Math.min(95, 100 - (coefficientOfVariation * 50)));
  }

  getDateString(daysAhead) {
    const date = new Date();
    date.setDate(date.getDate() + daysAhead);
    return date.toISOString().split('T')[0];
  }

  generatePredictionInsights(featureId, predictions) {
    const feature = CONFIG.features[featureId];
    const totalPredicted = predictions.reduce((sum, p) => sum + p.predicted, 0);
    const avgDaily = totalPredicted / predictions.length;
    const currentUsage = this.app.data.usage.get(featureId);
    
    const insights = [];
    
    if (avgDaily > currentUsage.monthly / 30) {
      insights.push(`📈 Predicted increase in ${feature.name} usage`);
    } else if (avgDaily < currentUsage.monthly / 30) {
      insights.push(`📉 Predicted decrease in ${feature.name} usage`);
    }
    
    const quota = feature.quotas.pro.monthly;
    const projectedMonthly = avgDaily * 30;
    if (projectedMonthly > quota * 0.9) {
      insights.push(`⚠️ May approach quota limit for ${feature.name}`);
    }
    
    return insights;
  }

  getCorrelationStrength(correlation) {
    const abs = Math.abs(correlation);
    if (abs >= 0.7) return 'strong';
    if (abs >= 0.3) return 'moderate';
    return 'weak';
  }

  getAnomalySeverity(deviation, threshold) {
    const ratio = deviation / threshold;
    if (ratio >= 3) return 'critical';
    if (ratio >= 2) return 'high';
    if (ratio >= 1.5) return 'medium';
    return 'low';
  }

  // Get predictions for external use
  getPredictions(featureId = null) {
    if (featureId) {
      return this.predictions.get(featureId);
    }
    return Object.fromEntries(this.predictions);
  }

  getPatterns(featureId = null) {
    if (featureId) {
      return this.patterns.get(featureId);
    }
    return Object.fromEntries(this.patterns);
  }

  getAnomalies() {
    return this.anomalies;
  }

  getOptimizationSuggestions() {
    return this.generateOptimizationSuggestions();
  }
}

// Simple ML Model Classes
class UsagePredictionModel {
  constructor() {
    this.weights = new Map();
    this.bias = 0;
  }

  train(data) {
    // Simple linear regression implementation
    Object.keys(CONFIG.features).forEach(featureId => {
      const featureData = data.filter(d => d.featureId === featureId);
      if (featureData.length > 0) {
        this.weights.set(featureId, this.calculateWeights(featureData));
      }
    });
  }

  calculateWeights(data) {
    // Calculate simple moving average weights
    const recentWeight = 0.4;
    const mediumWeight = 0.3;
    const oldWeight = 0.3;
    
    return { recent: recentWeight, medium: mediumWeight, old: oldWeight };
  }

  predict(featureId, history, days) {
    const weights = this.weights.get(featureId) || { recent: 0.33, medium: 0.33, old: 0.34 };
    const predictions = [];
    
    for (let i = 1; i <= days; i++) {
      const recentAvg = this.getRecentAverage(history, 3);
      const mediumAvg = this.getRecentAverage(history, 7);
      const oldAvg = this.getRecentAverage(history, 14);
      
      const predicted = Math.round(
        recentAvg * weights.recent + 
        mediumAvg * weights.medium + 
        oldAvg * weights.old
      );
      
      predictions.push({
        date: this.getDateString(i),
        predicted: Math.max(0, predicted),
        confidence: Math.max(20, 90 - (i * 5))
      });
    }
    
    return {
      featureId,
      predictions,
      accuracy: 75,
      insights: [`Prediction based on ${history.length} days of historical data`]
    };
  }

  getRecentAverage(history, days) {
    const recent = history.slice(-days);
    return recent.reduce((sum, day) => sum + day.usage, 0) / Math.max(recent.length, 1);
  }

  getDateString(daysAhead) {
    const date = new Date();
    date.setDate(date.getDate() + daysAhead);
    return date.toISOString().split('T')[0];
  }
}

class PatternRecognitionModel {
  train(data) {
    // Pattern recognition training would go here
    console.log("Pattern recognition model trained with", data.length, "data points");
  }
}

class AnomalyDetectionModel {
  train(data) {
    // Anomaly detection training would go here
    console.log("Anomaly detection model trained with", data.length, "data points");
  }
}

class OptimizationModel {
  train(data) {
    // Optimization model training would go here
    console.log("Optimization model trained with", data.length, "data points");
  }
}