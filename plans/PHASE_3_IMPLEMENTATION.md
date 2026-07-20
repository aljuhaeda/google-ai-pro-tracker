# 🚀 Phase 3: Advanced Features & Professional Enhancements

## 📋 Overview

Phase 3 transforms your solid foundation into a professional-grade application with advanced analytics, smart insights, and enhanced user experience. This phase focuses on data visualization, intelligent recommendations, and productivity optimization.

## 🎯 Phase 3 Objectives

### **Core Advanced Features**
- ✅ **Analytics Dashboard** - Visual charts and trend analysis
- ✅ **Smart Insights Engine** - AI-powered usage recommendations  
- ✅ **Goal Setting & Tracking** - Personal productivity targets
- ✅ **Advanced Notifications** - Smart timing and personalization
- ✅ **Data Visualization** - Interactive charts and graphs
- ✅ **Productivity Metrics** - ROI calculations and efficiency tracking
- ✅ **Enhanced Settings** - Advanced customization options

### **Technical Enhancements**
- Chart.js integration for professional data visualization
- Advanced analytics engine with trend calculation
- Smart recommendation system
- Goal tracking and progress monitoring
- Enhanced notification system with intelligent timing
- Performance optimizations and code improvements

## 📁 New File Structure

```
js/
├── app.js           (EXISTING - Will be enhanced)
├── config.js        (EXISTING)
├── storage.js       (EXISTING)
├── reminders.js     (EXISTING)
├── analytics.js     (NEW - Analytics engine)
├── charts.js        (NEW - Chart management)
├── insights.js      (NEW - Smart recommendations)
├── goals.js         (NEW - Goal tracking system)
├── notifications.js (NEW - Enhanced notification system)
└── utils.js         (NEW - Utility functions)

css/
├── main.css         (EXISTING - Will be enhanced)
├── charts.css       (NEW - Chart styling)
└── advanced.css     (NEW - Advanced UI components)

index.html           (EXISTING - Will be enhanced)
```

---

## 📝 Implementation Instructions

### **Step 1: Create `js/analytics.js`**

Create this file with the comprehensive analytics engine:

```javascript
// Advanced Analytics Engine
class AnalyticsEngine {
    constructor(app) {
        this.app = app;
        this.analytics = {
            daily: new Map(),
            weekly: new Map(),
            monthly: new Map(),
            trends: new Map()
        };
        this.init();
    }

    init() {
        this.loadAnalytics();
        this.startTracking();
        this.calculateTrends();
        console.log('📊 Analytics Engine initialized');
    }

    loadAnalytics() {
        const savedAnalytics = StorageService.get('analytics', {});
        Object.keys(savedAnalytics).forEach(period => {
            if (this.analytics[period]) {
                this.analytics[period] = new Map(Object.entries(savedAnalytics[period] || {}));
            }
        });
    }

    saveAnalytics() {
        const analyticsData = {};
        Object.keys(this.analytics).forEach(period => {
            analyticsData[period] = Object.fromEntries(this.analytics[period]);
        });
        StorageService.set('analytics', analyticsData);
    }

    trackUsage(featureId, amount, timestamp = new Date()) {
        const dateKey = timestamp.toISOString().split('T')[0];
        const weekKey = this.getWeekKey(timestamp);
        const monthKey = timestamp.toISOString().substring(0, 7);

        // Track daily
        this.updatePeriodData('daily', dateKey, featureId, amount);
        
        // Track weekly
        this.updatePeriodData('weekly', weekKey, featureId, amount);
        
        // Track monthly
        this.updatePeriodData('monthly', monthKey, featureId, amount);

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
        return startOfWeek.toISOString().split('T')[0];
    }

    calculateTrends() {
        Object.keys(CONFIG.features).forEach(featureId => {
            const trend = this.calculateFeatureTrend(featureId);
            this.analytics.trends.set(featureId, trend);
        });
    }

    calculateFeatureTrend(featureId) {
        const last7Days = this.getLast7DaysData(featureId);
        const previous7Days = this.getPrevious7DaysData(featureId);
        
        const currentAvg = last7Days.reduce((a, b) => a + b, 0) / 7;
        const previousAvg = previous7Days.reduce((a, b) => a + b, 0) / 7;
        
        const percentChange = previousAvg === 0 ? 
            (currentAvg > 0 ? 100 : 0) : 
            ((currentAvg - previousAvg) / previousAvg) * 100;

        return {
            current: currentAvg,
            previous: previousAvg,
            change: percentChange,
            direction: percentChange > 0 ? 'up' : percentChange < 0 ? 'down' : 'stable'
        };
    }

    getLast7DaysData(featureId) {
        const data = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateKey = date.toISOString().split('T')[0];
            const dayData = this.analytics.daily.get(dateKey) || {};
            data.push(dayData[featureId] || 0);
        }
        return data;
    }

    getPrevious7DaysData(featureId) {
        const data = [];
        for (let i = 13; i >= 7; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateKey = date.toISOString().split('T')[0];
            const dayData = this.analytics.daily.get(dateKey) || {};
            data.push(dayData[featureId] || 0);
        }
        return data;
    }

    getInsights() {
        const insights = [];
        
        // Most used feature
        const mostUsed = this.getMostUsedFeature();
        if (mostUsed) {
            insights.push({
                type: 'success',
                title: 'Top Performer',
                message: `${CONFIG.features[mostUsed.id].name} is your most used feature with ${mostUsed.usage} uses this month!`,
                icon: CONFIG.features[mostUsed.id].icon
            });
        }

        // Underutilized features
        const underutilized = this.getUnderutilizedFeatures();
        if (underutilized.length > 0) {
            insights.push({
                type: 'info',
                title: 'Opportunity',
                message: `You haven't used ${underutilized[0].name} much. Try it to maximize your subscription value!`,
                icon: underutilized[0].icon
            });
        }

        // Trending features
        this.analytics.trends.forEach((trend, featureId) => {
            if (trend.change > 50) {
                insights.push({
                    type: 'success',
                    title: 'Trending Up',
                    message: `${CONFIG.features[featureId].name} usage increased by ${Math.round(trend.change)}%!`,
                    icon: '📈'
                });
            }
        });

        return insights;
    }

    getMostUsedFeature() {
        let maxUsage = 0;
        let mostUsedId = null;

        this.app.data.usage.forEach((usage, featureId) => {
            if (usage.monthly > maxUsage) {
                maxUsage = usage.monthly;
                mostUsedId = featureId;
            }
        });

        return mostUsedId ? { id: mostUsedId, usage: maxUsage } : null;
    }

    getUnderutilizedFeatures() {
        const underutilized = [];
        
        this.app.data.usage.forEach((usage, featureId) => {
            const feature = CONFIG.features[featureId];
            const utilizationRate = usage.monthly / feature.quotas.pro.monthly;
            
            if (utilizationRate < 0.1) { // Less than 10% utilized
                underutilized.push({
                    id: featureId,
                    name: feature.name,
                    icon: feature.icon,
                    rate: utilizationRate
                });
            }
        });

        return underutilized.sort((a, b) => a.rate - b.rate);
    }

    getProductivityScore() {
        let totalScore = 0;
        let featureCount = 0;

        this.app.data.usage.forEach((usage, featureId) => {
            const feature = CONFIG.features[featureId];
            const utilizationRate = Math.min(usage.monthly / feature.quotas.pro.monthly, 1);
            const categoryMultiplier = feature.category === 'creative' ? 1.2 : 1.0;
            
            totalScore += utilizationRate * categoryMultiplier * 100;
            featureCount++;
        });

        return Math.round(totalScore / featureCount);
    }
}
```

### **Step 2: Create `js/charts.js`**

Create this file for comprehensive chart management:

```javascript
// Chart Management System
class ChartManager {
    constructor(app) {
        this.app = app;
        this.charts = new Map();
        this.init();
    }

    init() {
        this.loadChartLibrary();
        console.log('📈 Chart Manager initialized');
    }

    async loadChartLibrary() {
        if (!window.Chart) {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = () => {
                console.log('📊 Chart.js loaded');
                this.setupCharts();
            };
            document.head.appendChild(script);
        } else {
            this.setupCharts();
        }
    }

    setupCharts() {
        // Usage trend chart
        this.createUsageTrendChart();
        
        // Feature distribution chart
        this.createFeatureDistributionChart();
        
        // Daily activity chart
        this.createDailyActivityChart();
    }

    createUsageTrendChart() {
        const canvas = document.getElementById('usageTrendChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = this.getUsageTrendData();

        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: data.datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Usage Count'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: '7-Day Usage Trend'
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });

        this.charts.set('usageTrend', chart);
    }

    createFeatureDistributionChart() {
        const canvas = document.getElementById('featureDistributionChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = this.getFeatureDistributionData();

        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.values,
                    backgroundColor: [
                        '#4285f4', '#34a853', '#fbbc04', '#ea4335',
                        '#9aa0a6', '#5f6368', '#8ab4f8'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Feature Usage Distribution'
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });

        this.charts.set('featureDistribution', chart);
    }

    createDailyActivityChart() {
        const canvas = document.getElementById('dailyActivityChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = this.getDailyActivityData();

        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Daily Usage',
                    data: data.values,
                    backgroundColor: '#4285f4',
                    borderColor: '#1a73e8',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Total Uses'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Daily Activity (Last 7 Days)'
                    }
                }
            }
        });

        this.charts.set('dailyActivity', chart);
    }

    getUsageTrendData() {
        const labels = [];
        const datasets = [];
        const colors = ['#4285f4', '#34a853', '#fbbc04', '#ea4335'];

        // Generate last 7 days labels
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        }

        // Get top 4 most used features
        const topFeatures = this.getTopFeatures(4);
        
        topFeatures.forEach((featureId, index) => {
            const feature = CONFIG.features[featureId];
            const data = this.app.analytics.getLast7DaysData(featureId);
            
            datasets.push({
                label: feature.name,
                data: data,
                borderColor: colors[index],
                backgroundColor: colors[index] + '20',
                tension: 0.4
            });
        });

        return { labels, datasets };
    }

    getFeatureDistributionData() {
        const labels = [];
        const values = [];

        this.app.data.usage.forEach((usage, featureId) => {
            if (usage.monthly > 0) {
                labels.push(CONFIG.features[featureId].name);
                values.push(usage.monthly);
            }
        });

        return { labels, values };
    }

    getDailyActivityData() {
        const labels = [];
        const values = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateKey = date.toISOString().split('T')[0];
            
            labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
            
            let dayTotal = 0;
            if (this.app.analytics && this.app.analytics.analytics.daily.has(dateKey)) {
                const dayData = this.app.analytics.analytics.daily.get(dateKey);
                dayTotal = Object.values(dayData).reduce((sum, val) => sum + val, 0);
            }
            values.push(dayTotal);
        }

        return { labels, values };
    }

    getTopFeatures(count = 4) {
        const featureUsage = [];
        
        this.app.data.usage.forEach((usage, featureId) => {
            featureUsage.push({ id: featureId, usage: usage.monthly });
        });

        return featureUsage
            .sort((a, b) => b.usage - a.usage)
            .slice(0, count)
            .map(item => item.id);
    }

    updateCharts() {
        this.charts.forEach((chart, name) => {
            switch(name) {
                case 'usageTrend':
                    this.updateUsageTrendChart(chart);
                    break;
                case 'featureDistribution':
                    this.updateFeatureDistributionChart(chart);
                    break;
                case 'dailyActivity':
                    this.updateDailyActivityChart(chart);
                    break;
            }
        });
    }

    updateUsageTrendChart(chart) {
        const data = this.getUsageTrendData();
        chart.data.labels = data.labels;
        chart.data.datasets = data.datasets;
        chart.update();
    }

    updateFeatureDistributionChart(chart) {
        const data = this.getFeatureDistributionData();
        chart.data.labels = data.labels;
        chart.data.datasets[0].data = data.values;
        chart.update();
    }

    updateDailyActivityChart(chart) {
        const data = this.getDailyActivityData();
        chart.data.labels = data.labels;
        chart.data.datasets[0].data = data.values;
        chart.update();
    }
}
```

### **Step 3: Create `js/insights.js`**

Create this file for smart recommendations and insights:

```javascript
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
        console.log('🧠 Insights Engine initialized');
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
                type: 'success',
                category: 'productivity',
                title: 'Excellent Productivity!',
                message: `You're maximizing your AI Pro subscription with a ${productivityScore}% productivity score!`,
                icon: '🚀',
                priority: 'high'
            });
        } else if (productivityScore >= 60) {
            this.insights.push({
                type: 'info',
                category: 'productivity',
                title: 'Good Progress',
                message: `Your productivity score is ${productivityScore}%. Try using more creative features to boost it!`,
                icon: '📈',
                priority: 'medium'
            });
        } else {
            this.insights.push({
                type: 'warning',
                category: 'productivity',
                title: 'Room for Improvement',
                message: `Your productivity score is ${productivityScore}%. Explore more AI features to get better value!`,
                icon: '💡',
                priority: 'high'
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
                type: 'info',
                category: 'patterns',
                title: 'Usage Pattern Detected',
                message: `You're most productive with AI tools around ${peakHours[0]}:00. Consider scheduling creative work during this time!`,
                icon: '⏰',
                priority: 'medium'
            });
        }

        // Feature combination insights
        const combinations = this.findFeatureCombinations();
        if (combinations.length > 0) {
            this.insights.push({
                type: 'success',
                category: 'patterns',
                title: 'Smart Workflow',
                message: `You often use ${combinations[0].features.join(' + ')} together. This is an efficient creative workflow!`,
                icon: '🔄',
                priority: 'low'
            });
        }
    }

    analyzeValueOptimization() {
        let totalValue = 0;
        let potentialValue = 0;
        
        this.app.data.usage.forEach((usage, featureId) => {
            const feature = CONFIG.features[featureId];
            const utilizationRate = Math.min(usage.monthly / feature.quotas.pro.monthly, 1);
            totalValue += feature.estimatedValue * utilizationRate;
            potentialValue += feature.estimatedValue;
        });

        const valueRealization = (totalValue / potentialValue) * 100;
        const subscriptionCost = 20; // $20/month for AI Pro
        
        if (totalValue >= subscriptionCost) {
            this.insights.push({
                type: 'success',
                category: 'value',
                title: 'Great ROI!',
                message: `You're getting $${Math.round(totalValue)} value from your $${subscriptionCost} subscription!`,
                icon: '💰',
                priority: 'high'
            });
        } else {
            const deficit = subscriptionCost - totalValue;
            this.insights.push({
                type: 'warning',
                category: 'value',
                title: 'Optimize Your Value',
                message: `Use $${Math.round(deficit)} more in AI features to break even on your subscription!`,
                icon: '📊',
                priority: 'high'
            });
        }
    }

    analyzeTrends() {
        if (!this.app.analytics) return;

        this.app.analytics.analytics.trends.forEach((trend, featureId) => {
            const feature = CONFIG.features[featureId];
            
            if (trend.change > 100) {
                this.insights.push({
                    type: 'success',
                    category: 'trends',
                    title: 'Feature Momentum',
                    message: `${feature.name} usage doubled this week! You're on fire! 🔥`,
                    icon: '📈',
                    priority: 'medium'
                });
            } else if (trend.change < -50) {
                this.insights.push({
                    type: 'info',
                    category: 'trends',
                    title: 'Feature Decline',
                    message: `${feature.name} usage dropped this week. Consider revisiting it!`,
                    icon: '📉',
                    priority: 'low'
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
                type: 'time',
                title: 'Morning Boost',
                message: 'Start your day with Gemini Pro for planning and ideation!',
                action: 'logUsage',
                actionData: 'geminiPro',
                icon: '🌅'
            });
        }
        
        // Afternoon recommendations (12-18)
        else if (hour >= 12 && hour < 18) {
            this.recommendations.push({
                type: 'time',
                title: 'Creative Afternoon',
                message: 'Perfect time for Imagen 3 or Veo creative work!',
                action: 'showFeature',
                actionData: 'imagen3',
                icon: '🎨'
            });
        }
        
        // Evening recommendations (18-22)
        else if (hour >= 18 && hour < 22) {
            this.recommendations.push({
                type: 'time',
                title: 'Evening Projects',
                message: 'Wind down with Music AI or review your daily progress!',
                action: 'showFeature',
                actionData: 'musicAI',
                icon: '🎵'
            });
        }
    }

    generateFeatureRecommendations() {
        // Find underutilized high-value features
        const underutilized = this.app.analytics.getUnderutilizedFeatures();
        
        underutilized.slice(0, 2).forEach(feature => {
            this.recommendations.push({
                type: 'feature',
                title: `Try ${feature.name}`,
                message: `You're only using ${Math.round(feature.rate * 100)}% of this feature's potential!`,
                action: 'showTips',
                actionData: feature.id,
                icon: feature.icon
            });
        });

        // Suggest feature combinations
        const mostUsed = this.app.analytics.getMostUsedFeature();
        if (mostUsed) {
            const suggestions = this.getComplementaryFeatures(mostUsed.id);
            if (suggestions.length > 0) {
                this.recommendations.push({
                    type: 'combination',
                    title: 'Perfect Pair',
                    message: `Since you love ${CONFIG.features[mostUsed.id].name}, try combining it with ${CONFIG.features[suggestions[0]].name}!`,
                    action: 'showFeature',
                    actionData: suggestions[0],
                    icon: '🤝'
                });
            }
        }
    }

    generateGoalRecommendations() {
        // Check if goals exist and suggest actions
        const goals = StorageService.get('goals', []);
        
        goals.forEach(goal => {
            if (goal.status === 'active') {
                const progress = this.calculateGoalProgress(goal);
                
                if (progress < 50) {
                    this.recommendations.push({
                        type: 'goal',
                        title: 'Goal Progress',
                        message: `You're ${Math.round(progress)}% towards your ${goal.title} goal. Keep going!`,
                        action: 'showGoals',
                        actionData: goal.id,
                        icon: '🎯'
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
            { features: ['Imagen 3', 'Veo'], frequency: 5 },
            { features: ['Gemini Pro', 'Code Generation'], frequency: 3 }
        ];
    }

    getComplementaryFeatures(featureId) {
        const complementary = {
            'imagen3': ['veo', 'musicAI'],
            'veo': ['imagen3', 'musicAI'],
            'geminiPro': ['codeGeneration', 'workspaceAI'],
            'codeGeneration': ['geminiPro', 'multimodal'],
            'musicAI': ['imagen3', 'veo'],
            'workspaceAI': ['geminiPro', 'multimodal'],
            'multimodal': ['codeGeneration', 'workspaceAI']
        };
        
        return complementary[featureId] || [];
    }

    calculateGoalProgress(goal) {
        // Calculate progress based on goal type and current usage
        if (goal.type === 'usage') {
            const currentUsage = this.app.data.usage.get(goal.featureId)?.monthly || 0;
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
```

### **Step 4: Create `js/goals.js`**

Create this file for goal tracking and management:

```javascript
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
        console.log('🎯 Goal Manager initialized');
    }

    loadGoals() {
        this.goals = StorageService.get('goals', []);
    }

    saveGoals() {
        StorageService.set('goals', this.goals);
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
            status: 'active',
            progress: 0,
            createdAt: new Date().toISOString(),
            completedAt: null,
            rewards: goalData.rewards || []
        };

        this.goals.push(goal);
        this.saveGoals();
        
        this.app.showNotification(
            `🎯 Goal created: ${goal.title}`,
            'success'
        );

        return goal;
    }

    updateGoalProgress(goalId, progress) {
        const goal = this.goals.find(g => g.id === goalId);
        if (!goal) return;

        goal.progress = Math.min(progress, 100);
        
        if (goal.progress >= 100 && goal.status === 'active') {
            this.completeGoal(goalId);
        }

        this.saveGoals();
    }

    completeGoal(goalId) {
        const goal = this.goals.find(g => g.id === goalId);
        if (!goal) return;

        goal.status = 'completed';
        goal.completedAt = new Date().toISOString();
        goal.progress = 100;

        // Show celebration
        this.app.showNotification(
            `🎉 Goal completed: ${goal.title}! Well done!`,
            'success'
        );

        // Process rewards
        this.processGoalRewards(goal);

        this.saveGoals();
    }

    processGoalRewards(goal) {
        goal.rewards.forEach(reward => {
            switch(reward.type) {
                case 'badge':
                    this.awardBadge(reward.data);
                    break;
                case 'points':
                    this.awardPoints(reward.data);
                    break;
                case 'unlock':
                    this.unlockFeature(reward.data);
                    break;
            }
        });
    }

    awardBadge(badgeData) {
        const badges = StorageService.get('badges', []);
        badges.push({
            ...badgeData,
            earnedAt: new Date().toISOString()
        });
        StorageService.set('badges', badges);
        
        this.app.showNotification(
            `🏆 Badge earned: ${badgeData.name}!`,
            'success'
        );
    }

    awardPoints(points) {
        const currentPoints = StorageService.get('totalPoints', 0);
        StorageService.set('totalPoints', currentPoints + points);
        
        this.app.showNotification(
            `⭐ +${points} points earned!`,
            'success'
        );
    }

    unlockFeature(featureData) {
        const unlockedFeatures = StorageService.get('unlockedFeatures', []);
        unlockedFeatures.push(featureData);
        StorageService.set('unlockedFeatures', unlockedFeatures);
        
        this.app.showNotification(
            `🔓 Feature unlocked: ${featureData.name}!`,
            'success'
        );
    }

    checkGoalProgress() {
        this.goals.forEach(goal => {
            if (goal.status !== 'active') return;

            const progress = this.calculateGoalProgress(goal);
            this.updateGoalProgress(goal.id, progress);
        });
    }

    calculateGoalProgress(goal) {
        switch(goal.type) {
            case 'usage':
                return this.calculateUsageProgress(goal);
            case 'streak':
                return this.calculateStreakProgress(goal);
            case 'value':
                return this.calculateValueProgress(goal);
            default:
                return 0;
        }
    }

    calculateUsageProgress(goal) {
        const usage = this.app.data.usage.get(goal.featureId);
        if (!usage) return 0;

        let currentUsage = 0;
        switch(goal.period) {
            case 'daily':
                currentUsage = usage.daily;
                break;
            case 'weekly':
                // Calculate weekly usage from analytics
                currentUsage = this.getWeeklyUsage(goal.featureId);
                break;
            case 'monthly':
                currentUsage = usage.monthly;
                break;
        }

        return Math.min((currentUsage / goal.target) * 100, 100);
    }

    calculateStreakProgress(goal) {
        // Calculate consecutive days of usage
        const streak = this.getCurrentStreak(goal.featureId);
        return Math.min((streak / goal.target) * 100, 100);
    }

    calculateValueProgress(goal) {
        // Calculate value generated from feature usage
        const feature = CONFIG.features[goal.featureId];
        const usage = this.app.data.usage.get(goal.featureId);
        
        if (!feature || !usage) return 0;

        const utilizationRate = Math.min(usage.monthly / feature.quotas.pro.monthly, 1);
        const currentValue = feature.estimatedValue * utilizationRate;
        
        return Math.min((currentValue / goal.target) * 100, 100);
    }

    getWeeklyUsage(featureId) {
        if (!this.app.analytics) return 0;
        
        const weekKey = this.app.analytics.getWeekKey(new Date());
        const weekData = this.app.analytics.analytics.weekly.get(weekKey);
        
        return weekData ? (weekData[featureId] || 0) : 0;
    }

    getCurrentStreak(featureId) {
        const usage = this.app.data.usage.get(featureId);
        if (!usage || !usage.history.length) return 0;

        let streak = 0;
        const today = new Date();
        
        for (let i = 0; i < 30; i++) { // Check last 30 days
            const checkDate = new Date(today);
            checkDate.setDate(today.getDate() - i);
            const dateKey = checkDate.toISOString().split('T')[0];
            
            const dayHasUsage = usage.history.some(entry => 
                entry.date.startsWith(dateKey)
            );
            
            if (dayHasUsage) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    }

    generateGoalId() {
        return 'goal_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
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
        
        this.app.showNotification(
            'Goal deleted successfully',
            'info'
        );
    }

    getSuggestedGoals() {
        const suggestions = [];
        
        // Suggest goals based on underutilized features
        const underutilized = this.app.analytics.getUnderutilizedFeatures();
        
        underutilized.slice(0, 3).forEach(feature => {
            suggestions.push({
                title: `Master ${feature.name}`,
                description: `Use ${feature.name} 10 times this month`,
                type: 'usage',
                featureId: feature.id,
                target: 10,
                period: 'monthly',
                rewards: [
                    { type: 'badge', data: { name: `${feature.name} Explorer`, icon: feature.icon } },
                    { type: 'points', data: 100 }
                ]
            });
        });

        // Suggest streak goals for most used features
        const mostUsed = this.app.analytics.getMostUsedFeature();
        if (mostUsed) {
            suggestions.push({
                title: `${CONFIG.features[mostUsed.id].name} Streak`,
                description: `Use ${CONFIG.features[mostUsed.id].name} for 7 consecutive days`,
                type: 'streak',
                featureId: mostUsed.id,
                target: 7,
                period: 'daily',
                rewards: [
                    { type: 'badge', data: { name: 'Consistency Master', icon: '🔥' } },
                    { type: 'points', data: 200 }
                ]
            });
        }

        return suggestions;
    }
}
```

### **Step 5: Create `js/notifications.js`**

Create this enhanced notification system:

```javascript
// Enhanced Notification System
class NotificationManager {
    constructor(app) {
        this.app = app;
        this.notifications = [];
        this.settings = {
            enabled: true,
            sound: true,
            desktop: true,
            timing: 'smart', // 'immediate', 'smart', 'scheduled'
            quietHours: {
                enabled: true,
                start: '22:00',
                end: '08:00'
            }
        };
        this.init();
    }

    init() {
        this.loadSettings();
        this.requestPermissions();
        this.scheduleSmartNotifications();
        console.log('🔔 Enhanced Notification Manager initialized');
    }

    loadSettings() {
        this.settings = {
            ...this.settings,
            ...StorageService.get('notificationSettings', {})
        };
    }

    saveSettings() {
        StorageService.set('notificationSettings', this.settings);
    }

    async requestPermissions() {
        if ('Notification' in window && Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            console.log('Notification permission:', permission);
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
        this.scheduleDaily('09:00', () => {
            const messages = [
                "🌟 Ready to create something amazing today?",
                "💡 Your AI tools are waiting to help you innovate!",
                "🚀 Let's make today more productive than yesterday!",
                "✨ Time to turn ideas into reality with AI!"
            ];
            
            const message = messages[Math.floor(Math.random() * messages.length)];
            this.showNotification(message, 'motivation', { persistent: false });
        });

        // Afternoon boost (2 PM)
        this.scheduleDaily('14:00', () => {
            const underutilized = this.app.analytics.getUnderutilizedFeatures();
            if (underutilized.length > 0) {
                const feature = underutilized[0];
                this.showNotification(
                    `🎯 Afternoon challenge: Try ${feature.name} to boost your productivity!`,
                    'challenge',
                    { 
                        action: 'showFeature',
                        actionData: feature.id,
                        persistent: true
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
        this.scheduleDaily('18:00', () => {
            this.checkGoalProgress();
        });

        // Weekly goal summary (Sunday 7 PM)
        this.scheduleWeekly(0, '19:00', () => {
            this.sendWeeklyGoalSummary();
        });
    }

    scheduleInsightNotifications() {
        // Daily insights (8 PM)
        this.scheduleDaily('20:00', () => {
            this.sendDailyInsights();
        });
    }

    scheduleDaily(time, callback) {
        const [hours, minutes] = time.split(':').map(Number);
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
        const [hours, minutes] = time.split(':').map(Number);
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
            const currentTime = now.getHours().toString().padStart(2, '0') + ':' + 
                              now.getMinutes().toString().padStart(2, '0');
            
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

    showNotification(message, type = 'info', options = {}) {
        const notification = {
            id: this.generateNotificationId(),
            message,
            type,
            timestamp: new Date().toISOString(),
            read: false,
            ...options
        };

        this.notifications.unshift(notification);
        
        // Limit notification history
        if (this.notifications.length > 100) {
            this.notifications = this.notifications.slice(0, 100);
        }

        // Show in-app notification
        this.displayInAppNotification(notification);

        // Show desktop notification if enabled
        if (this.settings.desktop && 'Notification' in window && Notification.permission === 'granted') {
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
        const container = document.getElementById('notificationContainer');
        if (!container) return;

        const element = document.createElement('div');
        element.className = `notification enhanced ${notification.type}`;
        element.innerHTML = `
            <div class="notification-content">
                <div class="notification-message">${notification.message}</div>
                <div class="notification-time">${new Date(notification.timestamp).toLocaleTimeString()}</div>
            </div>
            <div class="notification-actions">
                ${notification.action ? `<button class="notification-action" data-action="${notification.action}" data-data="${notification.actionData}">Act</button>` : ''}
                <button class="notification-close">×</button>
            </div>
        `;

        // Add event listeners
        element.querySelector('.notification-close').addEventListener('click', () => {
            element.remove();
        });

        if (notification.action) {
            element.querySelector('.notification-action').addEventListener('click', () => {
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
        const desktopNotification = new Notification('AI Pro Tracker', {
            body: notification.message,
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🤖</text></svg>',
            tag: notification.id
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
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
            const audioContext = new (AudioContext || webkitAudioContext)();
            
            // Generate different tones for different notification types
            const frequencies = {
                'info': 440,
                'success': 523,
                'warning': 349,
                'error': 294,
                'motivation': 659,
                'challenge': 587
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
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration / 1000);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration / 1000);
    }

    handleNotificationAction(notification) {
        switch(notification.action) {
            case 'showFeature':
                this.app.switchView('features');
                // Highlight specific feature
                break;
            case 'logUsage':
                this.app.logUsage(notification.actionData);
                break;
            case 'showGoals':
                this.app.switchView('goals');
                break;
            case 'showTips':
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
                    'suggestion',
                    {
                        action: 'showTips',
                        actionData: featureId,
                        persistent: true
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
                    `⚠️ ${feature.name} quota at ${Math.round(percentage)}%! Plan your usage carefully.`,
                    'warning',
                    { persistent: true }
                );
            } else if (percentage >= 75) {
                this.showNotification(
                    `📊 ${feature.name} quota at ${Math.round(percentage)}%. Consider optimizing your usage.`,
                    'info'
                );
            }
        });
    }

    checkGoalProgress() {
        const goals = this.app.goalManager.getActiveGoals();
        
        goals.forEach(goal => {
            if (goal.progress < 30) {
                this.showNotification(
                    `🎯 Goal "${goal.title}" needs attention! You're at ${Math.round(goal.progress)}% progress.`,
                    'challenge',
                    {
                        action: 'showGoals',
                        actionData: goal.id,
                        persistent: true
                    }
                );
            } else if (goal.progress >= 80) {
                this.showNotification(
                    `🔥 Almost there! "${goal.title}" is at ${Math.round(goal.progress)}%. Push to finish!`,
                    'motivation'
                );
            }
        });
    }

    sendWeeklyGoalSummary() {
        const completedThisWeek = this.app.goalManager.getCompletedGoals()
            .filter(goal => {
                const completed = new Date(goal.completedAt);
                const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                return completed > weekAgo;
            });

        const message = completedThisWeek.length > 0 
            ? `🏆 Great week! You completed ${completedThisWeek.length} goal(s). Keep up the momentum!`
            : `📈 New week, new opportunities! Set some goals to maximize your AI Pro value.`;

        this.showNotification(message, 'summary', { persistent: true });
    }

    sendDailyInsights() {
        const insights = this.app.insightsEngine.getTopInsights(1);
        if (insights.length > 0) {
            this.showNotification(
                `💡 Daily Insight: ${insights[0].message}`,
                'insight',
                { persistent: true }
            );
        }
    }

    generateNotificationId() {
        return 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    saveNotifications() {
        // Save only recent notifications to avoid storage bloat
        const recentNotifications = this.notifications.slice(0, 50);
        StorageService.set('notifications', recentNotifications);
    }

    loadNotifications() {
        this.notifications = StorageService.get('notifications', []);
    }

    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            this.saveNotifications();
        }
    }

    getUnreadCount() {
        return this.notifications.filter(n => !n.read).length;
    }

    clearAll() {
        this.notifications = [];
        this.saveNotifications();
    }
}
```

### **Step 6: Create `js/utils.js`**

Create this utility functions file:

```javascript
// Utility Functions and Helpers
class Utils {
    // Date and time utilities
    static formatDate(date, format = 'short') {
        const d = new Date(date);
        
        switch(format) {
            case 'short':
                return d.toLocaleDateString();
            case 'long':
                return d.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                });
            case 'time':
                return d.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
            case 'datetime':
                return d.toLocaleString();
            default:
                return d.toLocaleDateString();
        }
    }

    static getTimeAgo(date) {
        const now = new Date();
        const past = new Date(date);
        const diffMs = now - past;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return this.formatDate(date);
    }

    static getWeekNumber(date = new Date()) {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    }

    // Number formatting utilities
    static formatNumber(num, decimals = 0) {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(num);
    }

    static formatCurrency(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    static formatPercentage(value, decimals = 1) {
        return new Intl.NumberFormat('en-US', {
            style: 'percent',
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(value / 100);
    }

    // String utilities
    static truncateText(text, maxLength = 100, suffix = '...') {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - suffix.length) + suffix;
    }

    static capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    static camelToTitle(str) {
        return str
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (match) => match.toUpperCase())
            .trim();
    }

    // Array utilities
    static groupBy(array, key) {
        return array.reduce((groups, item) => {
            const group = item[key];
            groups[group] = groups[group] || [];
            groups[group].push(item);
            return groups;
        }, {});
    }

    static sortBy(array, key, direction = 'asc') {
        return array.sort((a, b) => {
            const aVal = typeof key === 'function' ? key(a) : a[key];
            const bVal = typeof key === 'function' ? key(b) : b[key];
            
            if (direction === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });
    }

    static unique(array, key = null) {
        if (!key) {
            return [...new Set(array)];
        }
        
        const seen = new Set();
        return array.filter(item => {
            const value = item[key];
            if (seen.has(value)) {
                return false;
            }
            seen.add(value);
            return true;
        });
    }

    // Object utilities
    static deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        if (typeof obj === 'object') {
            const clonedObj = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    clonedObj[key] = this.deepClone(obj[key]);
                }
            }
            return clonedObj;
        }
    }

    static mergeDeep(target, source) {
        const output = { ...target };
        
        if (this.isObject(target) && this.isObject(source)) {
            Object.keys(source).forEach(key => {
                if (this.isObject(source[key])) {
                    if (!(key in target)) {
                        output[key] = source[key];
                    } else {
                        output[key] = this.mergeDeep(target[key], source[key]);
                    }
                } else {
                    output[key] = source[key];
                }
            });
        }
        
        return output;
    }

    static isObject(item) {
        return item && typeof item === 'object' && !Array.isArray(item);
    }

    // Color utilities
    static hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    static rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    static getContrastColor(hexColor) {
        const rgb = this.hexToRgb(hexColor);
        if (!rgb) return '#000000';
        
        const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        return brightness > 128 ? '#000000' : '#ffffff';
    }

    // DOM utilities
    static createElement(tag, className = '', innerHTML = '') {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (innerHTML) element.innerHTML = innerHTML;
        return element;
    }

    static addEventListenerOnce(element, event, handler) {
        const onceHandler = (e) => {
            handler(e);
            element.removeEventListener(event, onceHandler);
        };
        element.addEventListener(event, onceHandler);
    }

    static fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        const start = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = progress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    static fadeOut(element, duration = 300) {
        const start = performance.now();
        const startOpacity = parseFloat(element.style.opacity) || 1;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = startOpacity * (1 - progress);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        };
        
        requestAnimationFrame(animate);
    }

    // Validation utilities
    static isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    static isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    static sanitizeHtml(html) {
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    }

    // Performance utilities
    static debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(this, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(this, args);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Local storage utilities with compression
    static compressData(data) {
        try {
            return btoa(JSON.stringify(data));
        } catch (error) {
            console.warn('Data compression failed:', error);
            return JSON.stringify(data);
        }
    }

    static decompressData(compressedData) {
        try {
            return JSON.parse(atob(compressedData));
        } catch (error) {
            // Fallback to regular JSON parse if not compressed
            try {
                return JSON.parse(compressedData);
            } catch (parseError) {
                console.error('Data decompression failed:', parseError);
                return null;
            }
        }
    }

    // Analytics utilities
    static calculateTrend(data) {
        if (data.length < 2) return { direction: 'stable', change: 0 };
        
        const recent = data.slice(-3).reduce((a, b) => a + b, 0) / 3;
        const previous = data.slice(-6, -3).reduce((a, b) => a + b, 0) / 3;
        
        if (previous === 0) {
            return { direction: recent > 0 ? 'up' : 'stable', change: recent > 0 ? 100 : 0 };
        }
        
        const change = ((recent - previous) / previous) * 100;
        const direction = change > 5 ? 'up' : change < -5 ? 'down' : 'stable';
        
        return { direction, change: Math.round(change) };
    }

    static generateId(prefix = 'id') {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Export utilities
    static downloadFile(content, filename, mimeType = 'application/json') {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    static readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
        });
    }
}

// Make Utils available globally
window.Utils = Utils;
```

---

## 🎨 Next Steps

After creating these JavaScript files, you'll need to:

1. **Update CSS files** - Add styling for charts and advanced components
2. **Update HTML structure** - Add new sections for analytics and goals
3. **Update app.js** - Integrate all new components
4. **Test integration** - Ensure all components work together

Create these 6 JavaScript files first, then I'll provide the CSS updates and HTML modifications to complete Phase 3!

---

## ✅ Phase 3 Completion Checklist

- [ ] Create `js/analytics.js`
- [ ] Create `js/charts.js` 
- [ ] Create `js/insights.js`
- [ ] Create `js/goals.js`
- [ ] Create `js/notifications.js`
- [ ] Create `js/utils.js`
- [ ] Update CSS files (next step)
- [ ] Update HTML structure (next step)
- [ ] Update app.js integration (next step)
- [ ] Test all functionality (final step)

Ready to implement Phase 3? Start with creating the JavaScript files above!