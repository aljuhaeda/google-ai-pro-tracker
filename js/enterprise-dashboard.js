// Phase 5.4: Enterprise Dashboard
class EnterpriseDashboard {
  constructor(userManager, storage, analytics, mlAnalytics, chartsModule) {
    this.userManager = userManager;
    this.storage = storage;
    this.analytics = analytics;
    this.mlAnalytics = mlAnalytics; // Phase 4.3: ML Analytics integration
    this.chartsModule = chartsModule; // Phase 4.3: Enhanced charts
    this.currentUser = null;
    this.organizationData = null;
    this.init();
  }

  init() {
    this.currentUser = this.userManager.getCurrentUser();
    this.loadOrganizationData();
    console.log('🏢 Enterprise Dashboard initialized');
  }

  loadOrganizationData() {
    this.organizationData = this.storage.get('organizationData', {
      name: 'Enterprise Organization',
      plan: 'Enterprise',
      users: 0,
      teams: 0,
      totalUsage: 0,
      settings: {
        ssoEnabled: false,
        auditLogging: true,
        dataRetention: 365,
        complianceMode: 'standard'
      }
    });
  }

  renderEnterpriseDashboard() {
    if (!this.canAccessEnterprise()) {
      return this.renderAccessDenied();
    }

    return `
      <div class="enterprise-dashboard">
        <div class="enterprise-header">
          <div class="org-info">
            <h1 class="org-name">${this.organizationData.name}</h1>
            <span class="org-plan">Enterprise Plan</span>
          </div>
          <div class="header-actions">
            <button class="btn secondary" onclick="enterpriseDashboard.exportReport()">
              📊 Export Report
            </button>
            <button class="btn primary" onclick="enterpriseDashboard.showSettings()">
              ⚙️ Settings
            </button>
          </div>
        </div>

        <div class="enterprise-metrics">
          <div class="metrics-grid">
            ${this.renderMetricCards()}
          </div>
        </div>

        <div class="enterprise-content">
          <div class="content-grid">
            <div class="content-section">
              <h2>👥 User Management</h2>
              ${this.renderUserManagement()}
            </div>

            <div class="content-section">
              <h2>🏢 Team Analytics</h2>
              ${this.renderTeamAnalytics()}
            </div>

            <div class="content-section">
              <h2>💰 Cost Analysis</h2>
              ${this.renderCostAnalysis()}
            </div>

            <div class="content-section">
              <h2>🔒 Security & Compliance</h2>
              ${this.renderSecurityCompliance()}
            </div>

            <div class="content-section">
              <h2>📈 Usage Trends</h2>
              ${this.renderUsageTrends()}
            </div>

            <!-- Phase 4.3: Advanced Analytics Section -->
            <div class="content-section advanced-analytics">
              <h2>🧠 AI-Powered Enterprise Analytics</h2>
              ${this.renderAdvancedAnalytics()}
            </div>

            <div class="content-section">
              <h2>🎯 ROI Analysis</h2>
              ${this.renderROIAnalysis()}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderMetricCards() {
    const metrics = this.calculateEnterpriseMetrics();
    
    return `
      <div class="metric-card primary">
        <div class="metric-icon">👥</div>
        <div class="metric-content">
          <div class="metric-value">${metrics.totalUsers}</div>
          <div class="metric-label">Total Users</div>
          <div class="metric-change ${metrics.userGrowth >= 0 ? 'positive' : 'negative'}">
            ${metrics.userGrowth >= 0 ? '+' : ''}${metrics.userGrowth}% this month
          </div>
        </div>
      </div>

      <div class="metric-card success">
        <div class="metric-icon">🏢</div>
        <div class="metric-content">
          <div class="metric-value">${metrics.activeTeams}</div>
          <div class="metric-label">Active Teams</div>
          <div class="metric-change positive">
            ${metrics.teamUtilization}% utilization
          </div>
        </div>
      </div>

      <div class="metric-card info">
        <div class="metric-icon">📊</div>
        <div class="metric-content">
          <div class="metric-value">${this.formatNumber(metrics.totalUsage)}</div>
          <div class="metric-label">Total Usage</div>
          <div class="metric-change ${metrics.usageGrowth >= 0 ? 'positive' : 'negative'}">
            ${metrics.usageGrowth >= 0 ? '+' : ''}${metrics.usageGrowth}% vs last month
          </div>
        </div>
      </div>

      <div class="metric-card warning">
        <div class="metric-icon">💰</div>
        <div class="metric-content">
          <div class="metric-value">$${this.formatNumber(metrics.estimatedCost)}</div>
          <div class="metric-label">Monthly Cost</div>
          <div class="metric-change ${metrics.costEfficiency >= 0 ? 'positive' : 'negative'}">
            ${metrics.costEfficiency}% efficiency
          </div>
        </div>
      </div>

      <div class="metric-card secondary">
        <div class="metric-icon">🎯</div>
        <div class="metric-content">
          <div class="metric-value">${metrics.roi}%</div>
          <div class="metric-label">ROI</div>
          <div class="metric-change positive">
            ${metrics.valueRealized} value realized
          </div>
        </div>
      </div>

      <div class="metric-card error">
        <div class="metric-icon">⚠️</div>
        <div class="metric-content">
          <div class="metric-value">${metrics.alerts}</div>
          <div class="metric-label">Active Alerts</div>
          <div class="metric-change">
            ${metrics.criticalAlerts} critical
          </div>
        </div>
      </div>
    `;
  }

  renderUserManagement() {
    const users = Array.from(this.userManager.users.values());
    const recentUsers = users.slice(-5);

    return `
      <div class="user-management">
        <div class="section-header">
          <div class="section-stats">
            <span class="stat-item">${users.length} total users</span>
            <span class="stat-item">${this.getActiveUsers()} active today</span>
          </div>
          <button class="btn primary small" onclick="enterpriseDashboard.showUserModal()">
            ➕ Add User
          </button>
        </div>

        <div class="user-list">
          ${recentUsers.map(user => `
            <div class="user-item">
              <div class="user-avatar" style="background-color: ${user.avatar.backgroundColor}">
                ${user.avatar.initials}
              </div>
              <div class="user-info">
                <div class="user-name">${user.name}</div>
                <div class="user-details">${user.email} • ${user.role}</div>
                <div class="user-stats">
                  Usage: ${user.stats.totalUsage} • Last active: ${this.formatLastActive(user.lastActive)}
                </div>
              </div>
              <div class="user-actions">
                <button class="btn-icon" onclick="enterpriseDashboard.editUser('${user.id}')" title="Edit">
                  ✏️
                </button>
                <button class="btn-icon" onclick="enterpriseDashboard.viewUserAnalytics('${user.id}')" title="Analytics">
                  📊
                </button>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="section-footer">
          <button class="btn secondary" onclick="enterpriseDashboard.showAllUsers()">
            View All Users
          </button>
        </div>
      </div>
    `;
  }

  renderTeamAnalytics() {
    const teams = Array.from(this.userManager.teams.values());
    
    return `
      <div class="team-analytics">
        <div class="team-performance-chart">
          <canvas id="teamPerformanceChart"></canvas>
        </div>
        
        <div class="team-list">
          ${teams.map(team => {
            const analytics = this.userManager.getTeamAnalytics(team.id);
            return `
              <div class="team-item">
                <div class="team-info">
                  <h4 class="team-name">${team.name}</h4>
                  <div class="team-stats">
                    <span>${analytics.memberCount} members</span>
                    <span>${analytics.totalUsage} usage</span>
                    <span>${Math.round(analytics.averageUsage)} avg</span>
                  </div>
                </div>
                <div class="team-performance">
                  <div class="performance-bar">
                    <div class="performance-fill" style="width: ${Math.min(100, analytics.totalUsage / 10)}%"></div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  renderCostAnalysis() {
    const costData = this.calculateCostAnalysis();
    
    return `
      <div class="cost-analysis">
        <div class="cost-breakdown">
          <div class="cost-item">
            <span class="cost-label">Current Month</span>
            <span class="cost-value">$${this.formatNumber(costData.currentMonth)}</span>
          </div>
          <div class="cost-item">
            <span class="cost-label">Previous Month</span>
            <span class="cost-value">$${this.formatNumber(costData.previousMonth)}</span>
          </div>
          <div class="cost-item">
            <span class="cost-label">Projected</span>
            <span class="cost-value">$${this.formatNumber(costData.projected)}</span>
          </div>
          <div class="cost-item">
            <span class="cost-label">Budget</span>
            <span class="cost-value">$${this.formatNumber(costData.budget)}</span>
          </div>
        </div>

        <div class="cost-optimization">
          <h4>💡 Cost Optimization Recommendations</h4>
          <ul class="recommendations-list">
            ${costData.recommendations.map(rec => `
              <li class="recommendation-item">
                <span class="rec-icon">${rec.icon}</span>
                <span class="rec-text">${rec.text}</span>
                <span class="rec-savings">Save $${rec.savings}/month</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  renderSecurityCompliance() {
    const securityData = this.getSecurityComplianceData();
    
    return `
      <div class="security-compliance">
        <div class="compliance-status">
          <div class="status-item ${securityData.sso.status}">
            <div class="status-icon">${securityData.sso.status === 'active' ? '✅' : '❌'}</div>
            <div class="status-info">
              <div class="status-title">Single Sign-On</div>
              <div class="status-detail">${securityData.sso.detail}</div>
            </div>
          </div>

          <div class="status-item ${securityData.audit.status}">
            <div class="status-icon">${securityData.audit.status === 'active' ? '✅' : '❌'}</div>
            <div class="status-info">
              <div class="status-title">Audit Logging</div>
              <div class="status-detail">${securityData.audit.detail}</div>
            </div>
          </div>

          <div class="status-item ${securityData.compliance.status}">
            <div class="status-icon">${securityData.compliance.status === 'compliant' ? '✅' : '⚠️'}</div>
            <div class="status-info">
              <div class="status-title">GDPR Compliance</div>
              <div class="status-detail">${securityData.compliance.detail}</div>
            </div>
          </div>
        </div>

        <div class="recent-alerts">
          <h4>🚨 Recent Security Alerts</h4>
          <div class="alerts-list">
            ${securityData.alerts.map(alert => `
              <div class="alert-item ${alert.severity}">
                <div class="alert-time">${this.formatTime(alert.timestamp)}</div>
                <div class="alert-message">${alert.message}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  renderUsageTrends() {
    return `
      <div class="usage-trends">
        <div class="trend-chart">
          <canvas id="usageTrendChart"></canvas>
        </div>
        
        <div class="trend-insights">
          <h4>📈 Key Insights</h4>
          <ul class="insights-list">
            <li>Peak usage occurs on Tuesdays and Wednesdays</li>
            <li>25% increase in AI adoption this quarter</li>
            <li>Development team leads in usage efficiency</li>
            <li>Mobile usage growing 15% month-over-month</li>
          </ul>
        </div>
      </div>
    `;
  }

  // Phase 4.3: Advanced Analytics Methods
  renderAdvancedAnalytics() {
    return `
      <div class="advanced-analytics-section">
        <div class="analytics-controls">
          <div class="time-range-selector">
            <label>Time Range:</label>
            <select id="analyticsTimeRange" onchange="enterpriseDashboard.updateAnalyticsTimeRange()">
              <option value="7d">Last 7 days</option>
              <option value="30d" selected>Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
          <div class="analytics-tabs">
            <button class="tab-btn active" onclick="enterpriseDashboard.showEnterpriseTab('predictive')">
              🔮 Predictive Analytics
            </button>
            <button class="tab-btn" onclick="enterpriseDashboard.showEnterpriseTab('comparison')">
              📊 Period Comparison
            </button>
            <button class="tab-btn" onclick="enterpriseDashboard.showEnterpriseTab('forecasting')">
              📈 Forecasting
            </button>
          </div>
        </div>

        <div class="analytics-content">
          <div id="predictiveTab" class="analytics-tab active">
            <div class="predictive-insights">
              <div class="insight-cards">
                <div class="insight-card">
                  <h4>📊 Usage Prediction</h4>
                  <canvas id="enterprisePredictiveChart" width="400" height="200"></canvas>
                </div>
                <div class="insight-card">
                  <h4>💰 Cost Forecast</h4>
                  <canvas id="costForecastChart" width="400" height="200"></canvas>
                </div>
              </div>
              <div class="ml-insights">
                <h4>🧠 AI Insights</h4>
                <div id="mlInsightsList">
                  ${this.renderMLInsights()}
                </div>
              </div>
            </div>
          </div>

          <div id="comparisonTab" class="analytics-tab">
            <div class="comparison-analysis">
              <canvas id="enterpriseComparisonChart" width="800" height="300"></canvas>
              <div class="comparison-summary">
                ${this.renderComparisonSummary()}
              </div>
            </div>
          </div>

          <div id="forecastingTab" class="analytics-tab">
            <div class="forecasting-analysis">
              <canvas id="enterpriseForecastChart" width="800" height="300"></canvas>
              <div class="forecast-scenarios">
                ${this.renderForecastScenarios()}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderMLInsights() {
    if (!this.mlAnalytics) {
      return '<p>ML Analytics not available</p>';
    }

    const insights = this.mlAnalytics.generateEnterpriseInsights();
    
    return insights.map(insight => `
      <div class="ml-insight-item ${insight.priority}">
        <div class="insight-icon">${insight.icon}</div>
        <div class="insight-content">
          <h5>${insight.title}</h5>
          <p>${insight.description}</p>
          <div class="insight-metrics">
            <span class="confidence">Confidence: ${insight.confidence}%</span>
            <span class="impact">Impact: ${insight.impact}</span>
          </div>
        </div>
        <div class="insight-actions">
          <button class="btn small" onclick="enterpriseDashboard.actOnInsight('${insight.id}')">
            Act on This
          </button>
        </div>
      </div>
    `).join('');
  }

  renderComparisonSummary() {
    const comparisonData = this.getEnterpriseComparisonData();
    
    return `
      <div class="comparison-summary-grid">
        <div class="summary-item">
          <h4>Total Usage</h4>
          <div class="comparison-values">
            <span class="current">${comparisonData.current.totalUsage}</span>
            <span class="vs">vs</span>
            <span class="previous">${comparisonData.previous.totalUsage}</span>
          </div>
          <div class="change ${comparisonData.changes.totalUsage >= 0 ? 'positive' : 'negative'}">
            ${comparisonData.changes.totalUsage >= 0 ? '+' : ''}${comparisonData.changes.totalUsage}%
          </div>
        </div>

        <div class="summary-item">
          <h4>Active Users</h4>
          <div class="comparison-values">
            <span class="current">${comparisonData.current.activeUsers}</span>
            <span class="vs">vs</span>
            <span class="previous">${comparisonData.previous.activeUsers}</span>
          </div>
          <div class="change ${comparisonData.changes.activeUsers >= 0 ? 'positive' : 'negative'}">
            ${comparisonData.changes.activeUsers >= 0 ? '+' : ''}${comparisonData.changes.activeUsers}%
          </div>
        </div>

        <div class="summary-item">
          <h4>Cost Efficiency</h4>
          <div class="comparison-values">
            <span class="current">${comparisonData.current.costEfficiency}%</span>
            <span class="vs">vs</span>
            <span class="previous">${comparisonData.previous.costEfficiency}%</span>
          </div>
          <div class="change ${comparisonData.changes.costEfficiency >= 0 ? 'positive' : 'negative'}">
            ${comparisonData.changes.costEfficiency >= 0 ? '+' : ''}${comparisonData.changes.costEfficiency}%
          </div>
        </div>
      </div>
    `;
  }

  renderForecastScenarios() {
    const scenarios = this.getForecastScenarios();
    
    return `
      <div class="forecast-scenarios-grid">
        ${scenarios.map(scenario => `
          <div class="scenario-card ${scenario.type}">
            <h4>${scenario.name}</h4>
            <div class="scenario-metrics">
              <div class="metric">
                <span class="label">Expected Usage:</span>
                <span class="value">${scenario.expectedUsage}</span>
              </div>
              <div class="metric">
                <span class="label">Projected Cost:</span>
                <span class="value">$${this.formatNumber(scenario.projectedCost)}</span>
              </div>
              <div class="metric">
                <span class="label">Probability:</span>
                <span class="value">${scenario.probability}%</span>
              </div>
            </div>
            <div class="scenario-actions">
              ${scenario.recommendations.map(rec => `
                <div class="recommendation">${rec}</div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderROIAnalysis() {
    const roiData = this.calculateROIAnalysis();
    
    return `
      <div class="roi-analysis">
        <div class="roi-metrics">
          <div class="roi-metric">
            <div class="metric-value">${roiData.roi}%</div>
            <div class="metric-label">Overall ROI</div>
          </div>
          <div class="roi-metric">
            <div class="metric-value">$${this.formatNumber(roiData.costSavings)}</div>
            <div class="metric-label">Cost Savings</div>
          </div>
          <div class="roi-metric">
            <div class="metric-value">${roiData.productivityGain}%</div>
            <div class="metric-label">Productivity Gain</div>
          </div>
          <div class="roi-metric">
            <div class="metric-value">${roiData.timeToValue} days</div>
            <div class="metric-label">Time to Value</div>
          </div>
        </div>

        <div class="roi-breakdown">
          <h4>💰 Value Breakdown</h4>
          <div class="value-items">
            ${roiData.valueBreakdown.map(item => `
              <div class="value-item">
                <span class="value-category">${item.category}</span>
                <span class="value-amount">$${this.formatNumber(item.amount)}</span>
                <span class="value-percentage">${item.percentage}%</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  renderAccessDenied() {
    return `
      <div class="access-denied">
        <div class="access-denied-content">
          <h2>🔒 Access Denied</h2>
          <p>You need administrator privileges to access the Enterprise Dashboard.</p>
          <button class="btn primary" onclick="app.switchView('dashboard')">
            Return to Dashboard
          </button>
        </div>
      </div>
    `;
  }

  showEnterpriseTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.analytics-tab').forEach(tab => {
      tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(`${tabName}Tab`).classList.add('active');
    event.target.classList.add('active');

    // Initialize charts for the selected tab
    setTimeout(() => {
      if (tabName === 'predictive') {
        this.createEnterprisePredictiveChart();
        this.createCostForecastChart();
      } else if (tabName === 'comparison') {
        this.createEnterpriseComparisonChart();
      } else if (tabName === 'forecasting') {
        this.createEnterpriseForecastChart();
      }
    }, 100);
  }

  createEnterprisePredictiveChart() {
    if (!this.chartsModule || !this.mlAnalytics) return;

    const predictions = this.getEnterprisePredictiveData();
    this.chartsModule.createPredictiveChart('enterprisePredictiveChart', predictions, {
      title: 'Enterprise Usage Predictions (Next 30 Days)',
      type: 'enterprise'
    });
  }

  createEnterpriseComparisonChart() {
    if (!this.chartsModule) return;

    const comparisonData = this.getEnterpriseComparisonData();
    this.chartsModule.createComparisonChart('enterpriseComparisonChart', comparisonData, {
      title: 'Enterprise Performance: Current vs Previous Period',
      type: 'enterprise'
    });
  }

  createEnterpriseForecastChart() {
    if (!this.chartsModule || !this.mlAnalytics) return;

    const forecastData = this.getEnterpriseForecastData();
    this.chartsModule.createForecastChart('enterpriseForecastChart', forecastData, {
      title: 'Enterprise Growth Forecast (Next 12 Months)',
      type: 'enterprise'
    });
  }

  createCostForecastChart() {
    if (!this.chartsModule) return;

    const costData = this.getCostForecastData();
    this.chartsModule.createCostChart('costForecastChart', costData, {
      title: 'Cost Forecast & Budget Planning',
      type: 'cost'
    });
  }

  getEnterprisePredictiveData() {
    if (!this.mlAnalytics) return null;

    const predictions = this.mlAnalytics.predictEnterpriseGrowth(30);
    
    return {
      predictions: predictions.dailyPredictions,
      confidence: predictions.confidence,
      features: ['Total Usage', 'Active Users', 'Team Performance', 'Cost Efficiency']
    };
  }

  getEnterpriseComparisonData() {
    const currentPeriod = this.analytics.getCurrentPeriodData();
    const previousPeriod = this.analytics.getPreviousPeriodData();
    
    return {
      current: {
        totalUsage: currentPeriod.totalUsage,
        activeUsers: currentPeriod.activeUsers,
        costEfficiency: currentPeriod.costEfficiency,
        teamPerformance: currentPeriod.teamPerformance
      },
      previous: {
        totalUsage: previousPeriod.totalUsage,
        activeUsers: previousPeriod.activeUsers,
        costEfficiency: previousPeriod.costEfficiency,
        teamPerformance: previousPeriod.teamPerformance
      },
      changes: {
        totalUsage: ((currentPeriod.totalUsage - previousPeriod.totalUsage) / previousPeriod.totalUsage * 100).toFixed(1),
        activeUsers: ((currentPeriod.activeUsers - previousPeriod.activeUsers) / previousPeriod.activeUsers * 100).toFixed(1),
        costEfficiency: ((currentPeriod.costEfficiency - previousPeriod.costEfficiency) / previousPeriod.costEfficiency * 100).toFixed(1)
      }
    };
  }

  getEnterpriseForecastData() {
    if (!this.mlAnalytics) return null;

    return this.mlAnalytics.generateEnterpriseForecast(12);
  }

  getCostForecastData() {
    const currentCost = this.calculateEnterpriseMetrics().estimatedCost;
    const projectedGrowth = 1.15; // 15% monthly growth
    
    const months = [];
    const costs = [];
    const budget = [];
    
    for (let i = 0; i < 12; i++) {
      months.push(new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short' }));
      costs.push(Math.round(currentCost * Math.pow(projectedGrowth, i)));
      budget.push(Math.round(currentCost * Math.pow(1.2, i))); // 20% budget buffer
    }
    
    return {
      labels: months,
      datasets: [
        {
          label: 'Projected Cost',
          data: costs,
          borderColor: '#ea4335',
          backgroundColor: 'rgba(234, 67, 53, 0.1)'
        },
        {
          label: 'Budget',
          data: budget,
          borderColor: '#34a853',
          backgroundColor: 'rgba(52, 168, 83, 0.1)'
        }
      ]
    };
  }

  getForecastScenarios() {
    return [
      {
        name: 'Conservative Growth',
        type: 'conservative',
        expectedUsage: '125K',
        projectedCost: 18000,
        probability: 70,
        recommendations: [
          'Maintain current usage patterns',
          'Focus on efficiency optimization'
        ]
      },
      {
        name: 'Moderate Growth',
        type: 'moderate',
        expectedUsage: '175K',
        projectedCost: 25000,
        probability: 25,
        recommendations: [
          'Scale infrastructure proactively',
          'Implement usage monitoring'
        ]
      },
      {
        name: 'Aggressive Growth',
        type: 'aggressive',
        expectedUsage: '250K',
        projectedCost: 35000,
        probability: 5,
        recommendations: [
          'Negotiate enterprise pricing',
          'Implement strict quota management'
        ]
      }
    ];
  }

  updateAnalyticsTimeRange() {
    const timeRange = document.getElementById('analyticsTimeRange').value;
    // Refresh all charts with new time range
    this.refreshAdvancedAnalytics(timeRange);
  }

  refreshAdvancedAnalytics(timeRange = '30d') {
    // Refresh all active charts with new data
    const activeTab = document.querySelector('.analytics-tab.active');
    if (activeTab) {
      const tabId = activeTab.id;
      if (tabId === 'predictiveTab') {
        this.createEnterprisePredictiveChart();
        this.createCostForecastChart();
      } else if (tabId === 'comparisonTab') {
        this.createEnterpriseComparisonChart();
      } else if (tabId === 'forecastingTab') {
        this.createEnterpriseForecastChart();
      }
    }
  }

  actOnInsight(insightId) {
    // Handle insight actions
    console.log(`Acting on insight: ${insightId}`);
    // Implementation would depend on the specific insight
  }

  // Calculation Methods
  calculateEnterpriseMetrics() {
    const users = Array.from(this.userManager.users.values());
    const teams = Array.from(this.userManager.teams.values());
    
    return {
      totalUsers: users.length,
      activeTeams: teams.length,
      totalUsage: users.reduce((sum, user) => sum + user.stats.totalUsage, 0),
      userGrowth: 12, // Mock data
      teamUtilization: 85,
      usageGrowth: 23,
      estimatedCost: 15000,
      costEfficiency: 92,
      roi: 245,
      valueRealized: '$45K',
      alerts: 3,
      criticalAlerts: 1
    };
  }

  calculateCostAnalysis() {
    return {
      currentMonth: 15000,
      previousMonth: 12000,
      projected: 18000,
      budget: 20000,
      recommendations: [
        {
          icon: '🎯',
          text: 'Optimize quota allocation across teams',
          savings: 2000
        },
        {
          icon: '📊',
          text: 'Implement usage monitoring alerts',
          savings: 1500
        },
        {
          icon: '🔄',
          text: 'Automate repetitive AI tasks',
          savings: 3000
        }
      ]
    };
  }

  calculateROIAnalysis() {
    return {
      roi: 245,
      costSavings: 45000,
      productivityGain: 35,
      timeToValue: 30,
      valueBreakdown: [
        { category: 'Time Savings', amount: 25000, percentage: 55 },
        { category: 'Quality Improvement', amount: 12000, percentage: 27 },
        { category: 'Innovation Acceleration', amount: 8000, percentage: 18 }
      ]
    };
  }

  getSecurityComplianceData() {
    return {
      sso: {
        status: 'active',
        detail: 'Google SSO enabled for all users'
      },
      audit: {
        status: 'active',
        detail: 'All actions logged and monitored'
      },
      compliance: {
        status: 'compliant',
        detail: 'GDPR and SOC2 compliant'
      },
      alerts: [
        {
          timestamp: new Date().toISOString(),
          message: 'Unusual API usage pattern detected',
          severity: 'warning'
        },
        {
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          message: 'Failed login attempt from unknown location',
          severity: 'error'
        }
      ]
    };
  }

  // Utility Methods
  canAccessEnterprise() {
    return this.currentUser && (this.currentUser.role === 'admin' || this.currentUser.role === 'enterprise_admin');
  }

  getActiveUsers() {
    const users = Array.from(this.userManager.users.values());
    const today = new Date();
    return users.filter(user => {
      const lastActive = new Date(user.lastActive);
      const diffHours = (today - lastActive) / (1000 * 60 * 60);
      return diffHours < 24;
    }).length;
  }

  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  formatLastActive(timestamp) {
    const now = new Date();
    const lastActive = new Date(timestamp);
    const diffMinutes = Math.floor((now - lastActive) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffMinutes < 1440) {
      return `${Math.floor(diffMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffMinutes / 1440)}d ago`;
    }
  }

  formatTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString();
  }

  exportReport() {
    const reportData = {
      timestamp: new Date().toISOString(),
      metrics: this.calculateEnterpriseMetrics(),
      costAnalysis: this.calculateCostAnalysis(),
      roiAnalysis: this.calculateROIAnalysis(),
      securityStatus: this.getSecurityComplianceData()
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `enterprise-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  showSettings() {
    // Implementation for enterprise settings
    console.log('Show enterprise settings');
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EnterpriseDashboard;
}