// Enhanced Interactive Charts - Phase 4.3
class EnhancedChartManager {
  constructor(app) {
    this.app = app;
    this.charts = new Map();
    this.chartConfigs = new Map();
    this.animations = new Map();
    this.interactionHandlers = new Map();
    
    this.init();
  }

  init() {
    console.log('📊 Initializing Enhanced Chart Manager...');
    
    try {
      this.setupChartConfigurations();
      this.setupInteractionHandlers();
      console.log('✅ Enhanced Chart Manager initialized successfully');
    } catch (error) {
      console.error('❌ Enhanced Chart Manager initialization failed:', error);
    }
  }

  setupChartConfigurations() {
    // Enhanced Usage Trend Chart
    this.chartConfigs.set('usageTrend', {
      type: 'line',
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          title: {
            display: true,
            text: 'Usage Trends (Last 30 Days)',
            font: { size: 16, weight: 'bold' }
          },
          legend: {
            display: true,
            position: 'top'
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'white',
            bodyColor: 'white',
            borderColor: '#4285f4',
            borderWidth: 1,
            callbacks: {
              title: (context) => {
                return `Day ${context[0].dataIndex + 1}`;
              },
              label: (context) => {
                const feature = CONFIG.features[context.dataset.featureId];
                return `${feature.name}: ${context.parsed.y} uses`;
              }
            }
          }
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Days'
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Usage Count'
            },
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          }
        },
        animation: {
          duration: 2000,
          easing: 'easeInOutQuart'
        }
      }
    });

    // Enhanced Feature Distribution Chart
    this.chartConfigs.set('featureDistribution', {
      type: 'doughnut',
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Feature Usage Distribution',
            font: { size: 16, weight: 'bold' }
          },
          legend: {
            display: true,
            position: 'right'
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'white',
            bodyColor: 'white',
            callbacks: {
              label: (context) => {
                const feature = CONFIG.features[context.dataset.featureIds[context.dataIndex]];
                const percentage = ((context.parsed / context.dataset.total) * 100).toFixed(1);
                return `${feature.name}: ${context.parsed} uses (${percentage}%)`;
              }
            }
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 2000
        }
      }
    });

    // New: Productivity Heatmap
    this.chartConfigs.set('productivityHeatmap', {
      type: 'scatter',
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Productivity Heatmap (Hour vs Day)',
            font: { size: 16, weight: 'bold' }
          },
          tooltip: {
            callbacks: {
              title: () => 'Productivity Data',
              label: (context) => {
                return `Hour ${context.parsed.x}:00, Day ${context.parsed.y}: ${context.raw.usage} uses`;
              }
            }
          }
        },
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            title: {
              display: true,
              text: 'Hour of Day'
            },
            min: 0,
            max: 23,
            ticks: {
              stepSize: 1
            }
          },
          y: {
            type: 'linear',
            title: {
              display: true,
              text: 'Day of Week'
            },
            min: 0,
            max: 6,
            ticks: {
              stepSize: 1,
              callback: function(value) {
                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                return days[value];
              }
            }
          }
        }
      }
    });

    // New: Value Realization Chart
    this.chartConfigs.set('valueRealization', {
      type: 'radar',
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Feature Value Realization',
            font: { size: 16, weight: 'bold' }
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: {
              stepSize: 20
            }
          }
        }
      }
    });

    // New: Predictive Analytics Chart
    this.chartConfigs.set('predictiveAnalytics', {
      type: 'line',
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Usage Predictions (Next 4 Weeks)',
            font: { size: 16, weight: 'bold' }
          },
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Weeks'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Predicted Usage'
            },
            beginAtZero: true
          }
        },
        elements: {
          line: {
            borderDash: [5, 5] // Dashed line for predictions
          }
        }
      }
    });
  }

  setupInteractionHandlers() {
    // Click handler for drill-down functionality
    this.interactionHandlers.set('onClick', (event, elements, chart) => {
      if (elements.length > 0) {
        const element = elements[0];
        this.handleChartClick(chart.canvas.id, element);
      }
    });

    // Hover handler for enhanced tooltips
    this.interactionHandlers.set('onHover', (event, elements, chart) => {
      chart.canvas.style.cursor = elements.length > 0 ? 'pointer' : 'default';
    });
  }

  async updateCharts() {
    console.log('📊 Updating enhanced charts...');
    
    try {
      // Update all existing charts
      await Promise.all([
        this.updateUsageTrendChart(),
        this.updateFeatureDistributionChart(),
        this.updateProductivityHeatmap(),
        this.updateValueRealizationChart(),
        this.updatePredictiveAnalyticsChart()
      ]);
      
      console.log('✅ Enhanced charts updated successfully');
    } catch (error) {
      console.error('❌ Chart update failed:', error);
    }
  }

  async updateUsageTrendChart() {
    const canvas = document.getElementById('usageTrendChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const existingChart = this.charts.get('usageTrend');
    
    if (existingChart) {
      existingChart.destroy();
    }

    const data = this.generateUsageTrendData();
    const config = {
      ...this.chartConfigs.get('usageTrend'),
      data,
      options: {
        ...this.chartConfigs.get('usageTrend').options,
        onClick: this.interactionHandlers.get('onClick'),
        onHover: this.interactionHandlers.get('onHover')
      }
    };

    const chart = new Chart(ctx, config);
    this.charts.set('usageTrend', chart);

    // Add animation
    this.animateChart(chart, 'slideInUp');
  }

  generateUsageTrendData() {
    const labels = [];
    const datasets = [];
    const colors = [
      '#4285f4', '#34a853', '#fbbc04', '#ea4335', 
      '#9c27b0', '#ff9800', '#795548', '#607d8b'
    ];

    // Generate last 30 days labels
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }

    // Generate dataset for each feature
    Object.keys(CONFIG.features).forEach((featureId, index) => {
      const feature = CONFIG.features[featureId];
      const data = this.generateFeatureTrendData(featureId, 30);
      
      datasets.push({
        label: feature.name,
        data,
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length] + '20',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        featureId
      });
    });

    return { labels, datasets };
  }

  generateFeatureTrendData(featureId, days) {
    const data = [];
    const analytics = this.app.analytics?.analytics?.daily;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      
      const dayData = analytics?.get(dateKey);
      data.push(dayData && dayData[featureId] ? dayData[featureId] : 0);
    }
    
    return data;
  }

  async updateFeatureDistributionChart() {
    const canvas = document.getElementById('featureDistributionChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const existingChart = this.charts.get('featureDistribution');
    
    if (existingChart) {
      existingChart.destroy();
    }

    const data = this.generateFeatureDistributionData();
    const config = {
      ...this.chartConfigs.get('featureDistribution'),
      data,
      options: {
        ...this.chartConfigs.get('featureDistribution').options,
        onClick: this.interactionHandlers.get('onClick'),
        onHover: this.interactionHandlers.get('onHover')
      }
    };

    const chart = new Chart(ctx, config);
    this.charts.set('featureDistribution', chart);

    // Add animation
    this.animateChart(chart, 'rotateIn');
  }

  generateFeatureDistributionData() {
    const labels = [];
    const data = [];
    const backgroundColor = [];
    const featureIds = [];
    const colors = [
      '#4285f4', '#34a853', '#fbbc04', '#ea4335', 
      '#9c27b0', '#ff9800', '#795548', '#607d8b'
    ];

    let total = 0;

    this.app.data.usage.forEach((usage, featureId) => {
      if (usage.monthly > 0) {
        const feature = CONFIG.features[featureId];
        labels.push(feature.name);
        data.push(usage.monthly);
        backgroundColor.push(colors[labels.length - 1 % colors.length]);
        featureIds.push(featureId);
        total += usage.monthly;
      }
    });

    return {
      labels,
      datasets: [{
        data,
        backgroundColor,
        borderColor: '#ffffff',
        borderWidth: 2,
        featureIds,
        total
      }]
    };
  }

  async updateProductivityHeatmap() {
    const canvas = document.getElementById('productivityHeatmap');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const existingChart = this.charts.get('productivityHeatmap');
    
    if (existingChart) {
      existingChart.destroy();
    }

    const data = this.generateProductivityHeatmapData();
    const config = {
      ...this.chartConfigs.get('productivityHeatmap'),
      data
    };

    const chart = new Chart(ctx, config);
    this.charts.set('productivityHeatmap', chart);
  }

  generateProductivityHeatmapData() {
    const data = [];
    
    // Generate mock heatmap data (in real implementation, this would use actual usage timestamps)
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        const usage = Math.floor(Math.random() * 10);
        if (usage > 0) {
          data.push({
            x: hour,
            y: day,
            usage,
            r: Math.max(3, usage * 2) // Bubble size based on usage
          });
        }
      }
    }

    return {
      datasets: [{
        label: 'Productivity',
        data,
        backgroundColor: 'rgba(66, 133, 244, 0.6)',
        borderColor: '#4285f4',
        borderWidth: 1
      }]
    };
  }

  async updateValueRealizationChart() {
    const canvas = document.getElementById('valueRealizationChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const existingChart = this.charts.get('valueRealization');
    
    if (existingChart) {
      existingChart.destroy();
    }

    const data = this.generateValueRealizationData();
    const config = {
      ...this.chartConfigs.get('valueRealization'),
      data
    };

    const chart = new Chart(ctx, config);
    this.charts.set('valueRealization', chart);
  }

  generateValueRealizationData() {
    const labels = [];
    const data = [];

    this.app.data.usage.forEach((usage, featureId) => {
      const feature = CONFIG.features[featureId];
      const utilization = Math.min((usage.monthly / feature.quotas.pro.monthly) * 100, 100);
      
      labels.push(feature.name);
      data.push(utilization);
    });

    return {
      labels,
      datasets: [{
        label: 'Value Realization %',
        data,
        backgroundColor: 'rgba(66, 133, 244, 0.2)',
        borderColor: '#4285f4',
        borderWidth: 2,
        pointBackgroundColor: '#4285f4',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2
      }]
    };
  }

  async updatePredictiveAnalyticsChart() {
    const canvas = document.getElementById('predictiveAnalyticsChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const existingChart = this.charts.get('predictiveAnalytics');
    
    if (existingChart) {
      existingChart.destroy();
    }

    const data = this.generatePredictiveAnalyticsData();
    const config = {
      ...this.chartConfigs.get('predictiveAnalytics'),
      data
    };

    const chart = new Chart(ctx, config);
    this.charts.set('predictiveAnalytics', chart);
  }

  generatePredictiveAnalyticsData() {
    const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    const datasets = [];
    const colors = ['#4285f4', '#34a853', '#fbbc04', '#ea4335'];

    if (this.app.mlAnalytics) {
      const predictions = this.app.mlAnalytics.getPredictions();
      
      Object.entries(predictions).forEach(([featureId, prediction], index) => {
        const feature = CONFIG.features[featureId];
        
        // Generate 4 weeks of predictions
        const weeklyPredictions = [
          prediction.nextWeek,
          Math.round(prediction.nextWeek * 1.1),
          Math.round(prediction.nextWeek * 1.2),
          prediction.nextMonth
        ];

        datasets.push({
          label: feature.name,
          data: weeklyPredictions,
          borderColor: colors[index % colors.length],
          backgroundColor: colors[index % colors.length] + '20',
          borderWidth: 2,
          borderDash: [5, 5],
          fill: false,
          tension: 0.4
        });
      });
    }

    return { labels, datasets };
  }

  animateChart(chart, animationType) {
    const canvas = chart.canvas;
    
    switch (animationType) {
      case 'slideInUp':
        canvas.style.transform = 'translateY(50px)';
        canvas.style.opacity = '0';
        setTimeout(() => {
          canvas.style.transition = 'all 0.5s ease-out';
          canvas.style.transform = 'translateY(0)';
          canvas.style.opacity = '1';
        }, 100);
        break;
        
      case 'rotateIn':
        canvas.style.transform = 'rotate(-180deg) scale(0.5)';
        canvas.style.opacity = '0';
        setTimeout(() => {
          canvas.style.transition = 'all 0.8s ease-out';
          canvas.style.transform = 'rotate(0deg) scale(1)';
          canvas.style.opacity = '1';
        }, 100);
        break;
    }
  }

  handleChartClick(chartId, element) {
    console.log('📊 Chart clicked:', chartId, element);
    
    // Implement drill-down functionality
    switch (chartId) {
      case 'usageTrendChart':
        this.handleUsageTrendClick(element);
        break;
      case 'featureDistributionChart':
        this.handleFeatureDistributionClick(element);
        break;
      default:
        console.log('No drill-down available for this chart');
    }
  }

  handleUsageTrendClick(element) {
    const chart = this.charts.get('usageTrend');
    const dataset = chart.data.datasets[element.datasetIndex];
    const featureId = dataset.featureId;
    const feature = CONFIG.features[featureId];
    
    if (this.app) {
      this.app.showNotification(`Viewing details for ${feature.name}`, 'info');
      // Could open a detailed view or modal here
    }
  }

  handleFeatureDistributionClick(element) {
    const chart = this.charts.get('featureDistribution');
    const featureId = chart.data.datasets[0].featureIds[element.index];
    const feature = CONFIG.features[featureId];
    
    if (this.app) {
      this.app.showNotification(`Analyzing ${feature.name} usage patterns`, 'info');
      // Could show detailed feature analysis
    }
  }

  // Add new chart types
  async addCustomChart(containerId, chartType, data, options = {}) {
    const canvas = document.getElementById(containerId);
    if (!canvas) {
      console.error(`Canvas with id ${containerId} not found`);
      return null;
    }

    const ctx = canvas.getContext('2d');
    const config = {
      type: chartType,
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        ...options
      }
    };

    const chart = new Chart(ctx, config);
    this.charts.set(containerId, chart);
    
    return chart;
  }

  // Export chart as image
  async exportChart(chartId, format = 'png') {
    const chart = this.charts.get(chartId);
    if (!chart) {
      console.error(`Chart ${chartId} not found`);
      return null;
    }

    try {
      const url = chart.toBase64Image(format, 1.0);
      
      // Create download link
      const link = document.createElement('a');
      link.download = `${chartId}-${new Date().toISOString().split('T')[0]}.${format}`;
      link.href = url;
      link.click();
      
      console.log(`📊 Chart ${chartId} exported as ${format}`);
      return url;
    } catch (error) {
      console.error('Chart export failed:', error);
      return null;
    }
  }

  // Destroy all charts
  destroyAllCharts() {
    this.charts.forEach(chart => {
      chart.destroy();
    });
    this.charts.clear();
  }

  // Get chart data for external use
  getChartData(chartId) {
    const chart = this.charts.get(chartId);
    return chart ? chart.data : null;
  }

  // Update chart theme
  updateChartTheme(theme = 'light') {
    const isDark = theme === 'dark';
    
    this.charts.forEach(chart => {
      // Update grid colors
      if (chart.options.scales) {
        Object.keys(chart.options.scales).forEach(scaleId => {
          const scale = chart.options.scales[scaleId];
          if (scale.grid) {
            scale.grid.color = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
          }
          if (scale.ticks) {
            scale.ticks.color = isDark ? '#ffffff' : '#666666';
          }
        });
      }
      
      // Update text colors
      if (chart.options.plugins) {
        if (chart.options.plugins.title) {
          chart.options.plugins.title.color = isDark ? '#ffffff' : '#333333';
        }
        if (chart.options.plugins.legend) {
          chart.options.plugins.legend.labels = {
            ...chart.options.plugins.legend.labels,
            color: isDark ? '#ffffff' : '#333333'
          };
        }
      }
      
      chart.update();
    });
  }
}

// Export for use in main app
window.EnhancedChartManager = EnhancedChartManager;