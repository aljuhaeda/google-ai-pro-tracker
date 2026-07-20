// Chart Management System
class ChartManager {
  constructor(app) {
    this.app = app;
    this.charts = new Map();
    this.init();
  }

  init() {
    if (typeof Chart === "undefined") {
      console.error("Chart.js library not loaded");
      return;
    }
    this.setupCharts();
    console.log("📈 Chart Manager initialized");
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
    const canvas = document.getElementById("usageTrendChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const data = this.getUsageTrendData();

    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.labels,
        datasets: data.datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Usage Count",
            },
          },
          x: {
            title: {
              display: true,
              text: "Date",
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: "7-Day Usage Trend",
          },
          legend: {
            position: "bottom",
          },
        },
      },
    });

    this.charts.set("usageTrend", chart);
  }

  createFeatureDistributionChart() {
    const canvas = document.getElementById("featureDistributionChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const data = this.getFeatureDistributionData();

    const chart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: data.labels,
        datasets: [
          {
            data: data.values,
            backgroundColor: [
              "#4285f4",
              "#34a853",
              "#fbbc04",
              "#ea4335",
              "#9aa0a6",
              "#5f6368",
              "#8ab4f8",
            ],
            borderWidth: 2,
            borderColor: "#fff",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: "Feature Usage Distribution",
          },
          legend: {
            position: "bottom",
          },
        },
      },
    });

    this.charts.set("featureDistribution", chart);
  }

  createDailyActivityChart() {
    const canvas = document.getElementById("dailyActivityChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const data = this.getDailyActivityData();

    const chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.labels,
        datasets: [
          {
            label: "Daily Usage",
            data: data.values,
            backgroundColor: "#4285f4",
            borderColor: "#1a73e8",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Total Uses",
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: "Daily Activity (Last 7 Days)",
          },
        },
      },
    });

    this.charts.set("dailyActivity", chart);
  }

  getUsageTrendData() {
    const labels = [];
    const datasets = [];
    const colors = ["#4285f4", "#34a853", "#fbbc04", "#ea4335"];

    // Generate last 7 days labels
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(
        date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      );
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
        backgroundColor: colors[index] + "20",
        tension: 0.4,
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
      const dateKey = date.toISOString().split("T")[0];

      labels.push(date.toLocaleDateString("en-US", { weekday: "short" }));

      let dayTotal = 0;
      if (
        this.app.analytics &&
        this.app.analytics.analytics.daily.has(dateKey)
      ) {
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
      .map((item) => item.id);
  }

  updateCharts() {
    this.charts.forEach((chart, name) => {
      switch (name) {
        case "usageTrend":
          this.updateUsageTrendChart(chart);
          break;
        case "featureDistribution":
          this.updateFeatureDistributionChart(chart);
          break;
        case "dailyActivity":
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

  // Enhanced chart features for Phase 4.3
  createComparisonChart() {
    const canvas = document.getElementById("comparisonChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const data = this.getComparisonData();

    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.labels,
        datasets: data.datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Usage Count",
            },
          },
          x: {
            title: {
              display: true,
              text: "Time Period",
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: "Period Comparison",
          },
          legend: {
            position: "bottom",
          },
          tooltip: {
            callbacks: {
              afterLabel: function(context) {
                const change = data.changes[context.dataIndex];
                return change ? `Change: ${change > 0 ? '+' : ''}${change}%` : '';
              }
            }
          }
        },
      },
    });

    this.charts.set("comparison", chart);
  }

  createPredictiveChart() {
    const canvas = document.getElementById("predictiveChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const data = this.getPredictiveData();

    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.labels,
        datasets: data.datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Predicted Usage",
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: "Usage Predictions (Next 7 Days)",
          },
          legend: {
            position: "bottom",
          },
        },
        elements: {
          line: {
            borderDash: [5, 5], // Dashed line for predictions
          },
        },
      },
    });

    this.charts.set("predictive", chart);
  }

  getComparisonData() {
    const labels = [];
    const currentPeriod = [];
    const previousPeriod = [];
    const changes = [];

    // Generate last 7 days for current period
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(date.toLocaleDateString("en-US", { month: "short", day: "numeric" }));

      const dateKey = date.toISOString().split("T")[0];
      let currentTotal = 0;

      // Previous period (same day last week)
      const prevDate = new Date(date);
      prevDate.setDate(prevDate.getDate() - 7);
      const prevDateKey = prevDate.toISOString().split("T")[0];
      let previousTotal = 0;

      if (this.app.analytics && this.app.analytics.analytics.daily.has(dateKey)) {
        const dayData = this.app.analytics.analytics.daily.get(dateKey);
        currentTotal = Object.values(dayData).reduce((sum, val) => sum + val, 0);
      }

      if (this.app.analytics && this.app.analytics.analytics.daily.has(prevDateKey)) {
        const prevDayData = this.app.analytics.analytics.daily.get(prevDateKey);
        previousTotal = Object.values(prevDayData).reduce((sum, val) => sum + val, 0);
      }

      currentPeriod.push(currentTotal);
      previousPeriod.push(previousTotal);

      // Calculate percentage change
      const change = previousTotal > 0 ? Math.round(((currentTotal - previousTotal) / previousTotal) * 100) : 0;
      changes.push(change);
    }

    return {
      labels,
      changes,
      datasets: [
        {
          label: "Current Week",
          data: currentPeriod,
          borderColor: "#4285f4",
          backgroundColor: "#4285f420",
          tension: 0.4,
        },
        {
          label: "Previous Week",
          data: previousPeriod,
          borderColor: "#9aa0a6",
          backgroundColor: "#9aa0a620",
          tension: 0.4,
        },
      ],
    };
  }

  getPredictiveData() {
    const labels = [];
    const datasets = [];
    const colors = ["#4285f4", "#34a853", "#fbbc04", "#ea4335"];

    // Generate next 7 days labels
    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      labels.push(date.toLocaleDateString("en-US", { month: "short", day: "numeric" }));
    }

    // Get predictions from ML analytics if available
    if (this.app.mlAnalytics) {
      const predictions = this.app.mlAnalytics.getPredictions();
      const topFeatures = this.getTopFeatures(4);

      topFeatures.forEach((featureId, index) => {
        const feature = CONFIG.features[featureId];
        const prediction = predictions[featureId];

        if (prediction && prediction.predictions) {
          const data = prediction.predictions.map(p => p.predicted);
          
          datasets.push({
            label: feature.name,
            data: data,
            borderColor: colors[index],
            backgroundColor: colors[index] + "20",
            tension: 0.4,
            borderDash: [5, 5],
          });
        }
      });
    }

    return { labels, datasets };
  }
}
