// Main Application Controller
class AIProTracker {
  constructor() {
    this.currentView = "dashboard";
    this.data = {
      usage: new Map(),
      settings: {
        notifications: true,
        quotaAlerts: true,
        smartReminders: true,
        detailedAnalytics: true,
        usageTracking: true,
      },
    };
    this.notifications = []; // To store notifications for the list

    // Initialize Phase 3 components
    this.analytics = null;
    this.charts = null;
    this.insightsEngine = null;
    this.goalManager = null;
    this.notificationManager = null;
    
    // Initialize Phase 4 components
    this.pwaManager = null;
    this.apiManager = null;
    this.mlAnalytics = null;
    this.pdfReports = null;
    this.enhancedCharts = null;
    this.smartNotifications = null;
    // Initialize Phase 5 components
    this.userManager = null;
    this.teamDashboard = null;
    this.workspaceIntegration = null;
    this.enterpriseDashboard = null;

    // Initialize Phase 6 components
    this.aiIntelligence = null;
    this.voiceInterface = null;
    this.platformAdapter = null;
    this.arVrInterface = null;
    this.advancedAutomation = null;

    this.init();
  }

  init() {
    this.loadData();
    this.setupEventListeners();
    this.initializePhase3Components();
    this.initializePhase4Components();
    this.initializePhase5Components();
    this.initializePhase6Components();
    this.renderDashboard();
    this.checkDailyReset();
    console.log("🚀 AI Pro Tracker initialized successfully");

    // Show welcome message for new users
    this.showWelcomeIfFirstTime();
  }

  initializePhase6Components() {
    console.log("🔧 Starting Phase 6 component initialization...");
    
    try {
      // Initialize AI Intelligence Engine
      if (typeof AIIntelligenceEngine !== "undefined") {
        this.aiIntelligence = new AIIntelligenceEngine(this);
        console.log("✅ AI Intelligence Engine initialized");
      }
      
      // Initialize Voice Interface
      if (typeof VoiceInterface !== "undefined") {
        this.voiceInterface = new VoiceInterface(this);
        console.log("✅ Voice Interface initialized");
      }
      
      // Initialize Platform Adapter
      if (typeof PlatformAdapter !== "undefined") {
        this.platformAdapter = new PlatformAdapter(this);
        console.log("✅ Platform Adapter initialized");
      }
      
      // Initialize AR/VR Interface
      if (typeof ARVRInterface !== "undefined") {
        this.arVrInterface = new ARVRInterface(this);
        console.log("✅ AR/VR Interface initialized");
      }
      
      // Initialize Advanced Automation
      if (typeof AdvancedAutomation !== "undefined") {
        this.advancedAutomation = new AdvancedAutomation(this);
        console.log("✅ Advanced Automation initialized");
      }
      
      console.log("✅ Phase 6 components initialized successfully");
    } catch (error) {
      console.error("❌ Error initializing Phase 6 components:", error);
    }
  }

  initializePhase3Components() {
    console.log("🔧 Starting Phase 3 component initialization...");

    try {
      // Check if required classes exist
      if (typeof AnalyticsEngine === "undefined") {
        console.error("❌ AnalyticsEngine class not found");
        return;
      }
      if (typeof ChartManager === "undefined") {
        console.error("❌ ChartManager class not found");
        return;
      }
      if (typeof InsightsEngine === "undefined") {
        console.error("❌ InsightsEngine class not found");
        return;
      }
      if (typeof GoalManager === "undefined") {
        console.error("❌ GoalManager class not found");
        return;
      }
      if (typeof NotificationManager === "undefined") {
        console.error("❌ NotificationManager class not found");
        return;
      }

      // Initialize analytics engine
      console.log("📊 Initializing AnalyticsEngine...");
      this.analytics = new AnalyticsEngine(this);

      // Initialize chart manager
      console.log("📈 Initializing ChartManager...");
      this.charts = new ChartManager(this);

      // Initialize insights engine
      console.log("💡 Initializing InsightsEngine...");
      this.insightsEngine = new InsightsEngine(this);

      // Initialize goal manager
      console.log("🎯 Initializing GoalManager...");
      this.goalManager = new GoalManager(this);

      // Initialize enhanced notification manager
      console.log("🔔 Initializing NotificationManager...");
      this.notificationManager = new NotificationManager(this);

      console.log("✅ Phase 3 components initialized successfully");
    } catch (error) {
      console.error("❌ Error initializing Phase 3 components:", error);
      console.error("Stack trace:", error.stack);
    }
  }

  initializePhase4Components() {
    console.log("🔧 Starting Phase 4 component initialization...");

    try {
      // Initialize PWA Manager
      if (typeof PWAManager !== "undefined") {
        console.log("📱 Initializing PWA Manager...");
        this.pwaManager = new PWAManager();
        console.log("✅ PWA Manager initialized successfully");
      } else {
        console.error("❌ PWA Manager class not found");
      }

      // Initialize API Manager
      if (typeof APIManager !== "undefined") {
        console.log("🔌 Initializing API Manager...");
        this.apiManager = new APIManager(this);
        console.log("✅ API Manager initialized successfully");
      } else {
        console.error("❌ API Manager class not found");
      }

      // Initialize ML Analytics Engine
      if (typeof MLAnalyticsEngine !== "undefined") {
        console.log("🤖 Initializing ML Analytics Engine...");
        this.mlAnalytics = new MLAnalyticsEngine(this);
        console.log("✅ ML Analytics Engine initialized successfully");
      }

      // Initialize PDF Report Generator
      if (typeof PDFReportGenerator !== "undefined") {
        console.log("📄 Initializing PDF Report Generator...");
        this.pdfReports = new PDFReportGenerator(this);
        console.log("✅ PDF Report Generator initialized successfully");
      }

      // Initialize Enhanced Chart Manager
      if (typeof EnhancedChartManager !== "undefined") {
        console.log("📊 Initializing Enhanced Chart Manager...");
        this.enhancedCharts = new EnhancedChartManager(this);
        console.log("✅ Enhanced Chart Manager initialized successfully");
      }

      // Initialize Smart Notification System
      if (typeof SmartNotificationSystem !== "undefined") {
        console.log("🔔 Initializing Smart Notification System...");
        this.smartNotifications = new SmartNotificationSystem(this);
        console.log("✅ Smart Notification System initialized successfully");
      }

      console.log("✅ Phase 4 components initialized successfully");
    } catch (error) {
      console.error("❌ Error initializing Phase 4 components:", error);
      console.error("Stack trace:", error.stack);
    }
  }
  initializePhase5Components() {
    console.log("🔧 Starting Phase 5 component initialization...");

    try {
      // Initialize User Manager
      if (typeof UserManager !== "undefined") {
        console.log("👥 Initializing User Manager...");
        this.userManager = new UserManager(StorageService);
        console.log("✅ User Manager initialized successfully");
      }

      // Initialize Team Dashboard
      if (typeof TeamDashboard !== "undefined" && this.userManager) {
        console.log("🏢 Initializing Team Dashboard...");
        this.teamDashboard = new TeamDashboard(this.userManager, StorageService, this.analytics);
        console.log("✅ Team Dashboard initialized successfully");
      }

      // Initialize Workspace Integration
      if (typeof GoogleWorkspaceIntegration !== "undefined") {
        console.log("🔗 Initializing Workspace Integration...");
        this.workspaceIntegration = new GoogleWorkspaceIntegration(StorageService, this.analytics);
        console.log("✅ Workspace Integration initialized successfully");
      }

      // Initialize Enterprise Dashboard
      if (typeof EnterpriseDashboard !== "undefined" && this.userManager) {
        console.log("📊 Initializing Enterprise Dashboard...");
        this.enterpriseDashboard = new EnterpriseDashboard(this.userManager, StorageService, this.analytics);
        console.log("✅ Enterprise Dashboard initialized successfully");
      }

      // Show enterprise features if user is admin
      this.checkEnterpriseAccess();

      console.log("✅ Phase 5 components initialized successfully");
    } catch (error) {
      console.error("❌ Error initializing Phase 5 components:", error);
      console.error("Stack trace:", error.stack);
    }
  }

  loadData() {
    // Load usage data from storage
    const savedUsage = StorageService.get(CONFIG.storage.keys.usage, {});
    Object.keys(CONFIG.features).forEach((featureId) => {
      this.data.usage.set(
        featureId,
        savedUsage[featureId] || {
          monthly: 0,
          daily: 0,
          lastUsed: null,
          totalUsed: 0,
          history: [],
        }
      );
    });

    // Load settings
    this.data.settings = StorageService.get(
      CONFIG.storage.keys.settings,
      this.data.settings
    );
    console.log("📊 Data loaded successfully");
  }

  saveData() {
    // Convert Map to object for storage
    const usageData = {};
    this.data.usage.forEach((usage, featureId) => {
      usageData[featureId] = usage;
    });

    StorageService.set(CONFIG.storage.keys.usage, usageData);
    StorageService.set(CONFIG.storage.keys.settings, this.data.settings);
  }

  setupEventListeners() {
    // Navigation event listeners (new structure)
    document.querySelectorAll(".nav-item").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.switchView(e.currentTarget.dataset.view);
      });
    });

    // Quick action event listeners (new structure)
    document.querySelectorAll(".action-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const featureId = e.currentTarget.dataset.feature;
        this.logUsage(featureId);
      });
    });

    // Settings event listeners (new structure)
    document.getElementById("browserNotifications")?.addEventListener("change", (e) => {
      this.data.settings.notifications = e.target.checked;
      this.saveData();
      this.showNotification(`Notifications ${e.target.checked ? "enabled" : "disabled"}`, "success");
    });
    document.getElementById("quotaAlerts")?.addEventListener("change", (e) => {
      this.data.settings.quotaAlerts = e.target.checked;
      this.saveData();
      this.showNotification(`Quota alerts ${e.target.checked ? "enabled" : "disabled"}`, "success");
    });
    document.getElementById("smartReminders")?.addEventListener("change", (e) => {
      this.data.settings.smartReminders = e.target.checked;
      this.saveData();
      this.showNotification(`Smart reminders ${e.target.checked ? "enabled" : "disabled"}`, "success");
    });
    document.getElementById("detailedAnalytics")?.addEventListener("change", (e) => {
      this.data.settings.detailedAnalytics = e.target.checked;
      this.saveData();
      this.showNotification(`Detailed analytics ${e.target.checked ? "enabled" : "disabled"}`, "success");
    });
    document.getElementById("usageTracking")?.addEventListener("change", (e) => {
      this.data.settings.usageTracking = e.target.checked;
      this.saveData();
      this.showNotification(`Usage tracking ${e.target.checked ? "enabled" : "disabled"}`, "success");
    });

    // Data management event listeners
    document.getElementById("exportData")?.addEventListener("click", () => {
      this.exportData();
    });
    document.getElementById("clearData")?.addEventListener("click", () => {
      this.clearData();
    });

    // API Integration event listeners
    document.getElementById("connectAPI")?.addEventListener("click", () => {
      this.connectToAPI();
    });
    document.getElementById("syncNow")?.addEventListener("click", () => {
      this.syncNow();
    });
    document.getElementById("disconnectAPI")?.addEventListener("click", () => {
      this.disconnectFromAPI();
    });

    // Phase 6 Event Listeners
    document.getElementById("optimizeWorkflow")?.addEventListener("click", () => {
      this.optimizeWorkflow();
    });
    document.getElementById("voiceActivation")?.addEventListener("click", () => {
      this.toggleVoiceInterface();
    });
    document.getElementById("enterVR")?.addEventListener("click", () => {
      this.enterVRAnalytics();
    });
    document.getElementById("enableAR")?.addEventListener("click", () => {
      this.enableAROverlay();
    });

    // Generic Modal Close Button
    document.getElementById("closeGenericModal")?.addEventListener("click", () => {
      this.closeGenericModal();
    });
    document.getElementById("genericModal")?.addEventListener("click", (e) => {
      if (e.target.id === "genericModal") {
        this.closeGenericModal();
      }
    });

    // Notification Bell
    document.getElementById("notificationBell")?.addEventListener("click", () => {
      this.showNotificationList();
    });

    // Goals event listeners
    document.getElementById("addGoalBtn")?.addEventListener("click", () => {
      this.showGoalModal();
    });

    console.log("🎯 Event listeners set up");
  }

  switchView(viewName) {
    // Update active navigation item
    document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));
    document.querySelector(`.nav-item[data-view="${viewName}"]`).classList.add("active");

    // Update view title
    document.getElementById("viewTitle").textContent = viewName.charAt(0).toUpperCase() + viewName.slice(1);

    // Hide all views and show the active one
    document.querySelectorAll(".view").forEach(view => view.classList.remove("active"));
    document.getElementById(`${viewName}View`).classList.add("active");

    this.currentView = viewName;

    // Render content for the active view
    if (viewName === "dashboard") {
      this.renderDashboard();
    } else if (viewName === "analytics") {
      this.renderAnalytics();
    } else if (viewName === "goals") {
      this.renderGoals();
    } else if (viewName === "settings") {
      this.renderSettings();
    }

    console.log(`📱 Switched to ${viewName} view`);
  }

  logUsage(featureId, amount = 1) {
    const usage = this.data.usage.get(featureId);
    const feature = CONFIG.features[featureId];

    if (usage && feature) {
      // Update usage data
      usage.monthly += amount;
      usage.daily += amount;
      usage.totalUsed += amount;
      usage.lastUsed = new Date().toISOString();

      // Add to history
      usage.history.push({
        date: new Date().toISOString(),
        amount: amount,
        type: "manual",
      });

      // Track in analytics
      if (this.analytics) {
        this.analytics.trackUsage(featureId, amount);
      }

      // Log to API if connected
      if (this.apiManager && this.apiManager.isAPIConnected()) {
        this.apiManager.logUsageToAPI(featureId, amount);
      }

      // Save data
      this.saveData();

      // Update UI
      this.renderDashboard();

      // Update analytics if on analytics view
      if (this.currentView === "analytics") {
        this.renderAnalytics();
      }

      // Update goals if on goals view
      if (this.currentView === "goals") {
        this.renderGoals();
      }

      // Show success notification
      this.showNotification(
        `✅ Logged ${amount} use of ${feature.name} ${feature.icon}`,
        "success"
      );

      // Check for quota warnings
      this.checkQuotaWarnings(featureId);

      console.log(`📝 Logged usage: ${feature.name} (+${amount})`);
    }
  }

  checkQuotaWarnings(featureId) {
    if (!this.data.settings.quotaAlerts) return;

    const feature = CONFIG.features[featureId];
    const usage = this.data.usage.get(featureId);
    const quota = feature.quotas.pro.monthly;
    const percentage = (usage.monthly / quota) * 100;

    if (percentage >= 90) {
      this.showNotification(
        `⚠️ Warning: ${Math.round(percentage)}% of ${feature.name} quota used! `,
        "error"
      );
    } else if (percentage >= 75) {
      this.showNotification(
        `📊 Notice: ${Math.round(percentage)}% of ${feature.name} quota used`,
        "warning"
      );
    }
  }

  renderDashboard() {
    this.updateQuickStats();
    this.renderFeaturesGrid();
    this.renderAIIntelligencePanel();
    this.renderMultiPlatformDashboard();
  }

  renderAnalytics() {
    console.log("📊 Starting analytics view render...");

    try {
      // Update productivity score
      if (this.analytics) {
        console.log("📈 Updating productivity score...");
        const score = this.analytics.getProductivityScore();
        const scoreElement = document.getElementById("productivityScore");
        if (scoreElement) {
          scoreElement.textContent = score;
          console.log(`✅ Productivity score updated: ${score}`);
        } else {
          console.warn("⚠️ Productivity score element not found");
        }
      } else {
        console.warn("⚠️ Analytics engine not initialized");
      }

      // Render insights
      console.log("💡 Rendering insights...");
      this.renderInsights();

      // Update charts
      if (this.charts) {
        console.log("📊 Updating charts...");
        setTimeout(() => {
          try {
            this.charts.updateCharts();
            console.log("✅ Charts updated successfully");
          } catch (chartError) {
            console.error("❌ Error updating charts:", chartError);
          }
        }, 100);
      } else {
        console.warn("⚠️ Chart manager not initialized");
      }

      // Render recommendations
      console.log("🎯 Rendering recommendations...");
      this.renderRecommendations();

      console.log("✅ Analytics view rendered successfully");
    } catch (error) {
      console.error("❌ Error rendering analytics:", error);
      console.error("Stack trace:", error.stack);

      // Show user-friendly error message
      this.showNotification(
        "Analytics temporarily unavailable. Please try refreshing the page.",
        "error"
      );
    }
  }

  renderGoals() {
    try {
      this.renderGoalsGrid();
      this.renderGoalSuggestions();
      console.log("🎯 Goals view rendered");
    } catch (error) {
      console.error("Error rendering goals:", error);
    }
  }

  renderSettings() {
    try {
      this.updateAPIStatus();
      console.log("⚙️ Settings view rendered");
    }
  }

  updateAPIStatus() {
    if (!this.apiManager) return;

    const status = this.apiManager.getConnectionStatus();
    const statusDot = document.getElementById("apiStatusDot");
    const statusText = document.getElementById("apiStatusText");
    const connectBtn = document.getElementById("connectAPI");
    const syncBtn = document.getElementById("syncNow");
    const disconnectBtn = document.getElementById("disconnectAPI");
    const apiInfo = document.getElementById("apiInfo");
    const lastSyncTime = document.getElementById("lastSyncTime");
    const realTimeStatus = document.getElementById("realTimeStatus");

    if (statusDot && statusText) {
      if (status.connected && status.authenticated) {
        statusDot.className = "status-dot connected";
        statusText.textContent = "Connected";
        if (connectBtn) connectBtn.style.display = "none";
        if (syncBtn) syncBtn.style.display = "inline-block";
        if (disconnectBtn) disconnectBtn.style.display = "inline-block";
        if (apiInfo) apiInfo.style.display = "block";
        if (realTimeStatus) realTimeStatus.textContent = "Enabled";
      } else if (status.enabled) {
        statusDot.className = "status-dot connecting";
        statusText.textContent = "Available - Not Connected";
        if (connectBtn) connectBtn.style.display = "inline-block";
        if (syncBtn) syncBtn.style.display = "none";
        if (disconnectBtn) disconnectBtn.style.display = "none";
        if (apiInfo) apiInfo.style.display = "none";
        if (realTimeStatus) realTimeStatus.textContent = "Disabled";
      } else {
        statusDot.className = "status-dot";
        statusText.textContent = "Unavailable";
        if (connectBtn) connectBtn.style.display = "none";
        if (syncBtn) syncBtn.style.display = "none";
        if (disconnectBtn) disconnectBtn.style.display = "none";
        if (apiInfo) apiInfo.style.display = "none";
        if (realTimeStatus) realTimeStatus.textContent = "Disabled";
      }
    }

    if (lastSyncTime && status.lastSync) {
      const syncDate = new Date(status.lastSync);
      lastSyncTime.textContent = syncDate.toLocaleString();
    }
  }

  async connectToAPI() {
    if (!this.apiManager) {
      this.showNotification("API Manager not available", "error");
      return;
    }

    try {
      this.showNotification("Connecting to Google AI Pro API...", "info");
      
      const success = await this.apiManager.authenticateUser();
      
      if (success) {
        this.updateAPIStatus();
        this.showNotification("Successfully connected to Google AI Pro API! 🔌", "success");
      } else {
        this.showNotification("Failed to connect to API", "error");
      }
    } catch (error) {
      console.error("API connection error:", error);
      this.showNotification("Connection failed. Please try again.", "error");
    }
  }

  async syncNow() {
    if (!this.apiManager) {
      this.showNotification("API Manager not available", "error");
      return;
    }

    try {
      this.showNotification("Syncing data...", "info");
      
      const success = await this.apiManager.forceSync();
      
      if (success) {
        this.updateAPIStatus();
        this.renderDashboard();
        this.showNotification("Data synced successfully! ✅", "success");
      } else {
        this.showNotification("Sync failed. Please try again.", "error");
      }

    } catch (error) {
      console.error("Sync error:", error);
      this.showNotification("Sync failed. Please try again.", "error");
    }
  }

  async disconnectFromAPI() {
    if (!this.apiManager) {
      this.showNotification("API Manager not available", "error");
      return;
    }

    try {
      await this.apiManager.disconnect();
      this.updateAPIStatus();
      this.showNotification("Disconnected from Google AI Pro API", "info");
    } catch (error) {
      console.error("Disconnect error:", error);
      this.showNotification("Disconnect failed", "error");
    }
  }

  renderInsights() {
    const grid = document.getElementById("insightsGrid");
    if (!grid || !this.insightsEngine) return;

    try {
      const insights = this.insightsEngine.getTopInsights();
      grid.innerHTML = insights
        .map(
          (insight) => `
        <div class="insight-card ${insight.type}">
          <div class="insight-header">
            <div class="insight-icon">${insight.icon}</div>
            <h4 class="insight-title">${insight.title}</h4>
          </div>
          <p class="insight-message">${insight.message}</p>
        </div>
      `
        )
        .join("");
    } catch (error) {
      console.error("Error rendering insights:", error);
      grid.innerHTML =
        '<div class="insight-card info"><p>Insights will appear as you use the app more.</p></div>';
    }
  }

  renderRecommendations() {
    const list = document.getElementById("recommendationsList");
    if (!list || !this.insightsEngine) return;

    try {
      const recommendations = this.insightsEngine.getTopRecommendations();
      list.innerHTML = recommendations
        .map(
          (rec) => `
        <div class="recommendation-card">
          <div class="recommendation-header">
            <span class="recommendation-icon">${rec.icon}</span>
            <h4 class="recommendation-title">${rec.title}</h4>
          </div>
          <p class="recommendation-message">${rec.message}</p>
          <button class="recommendation-action" onclick="app.handleRecommendation('${rec.action}', '${rec.actionData}')">
            Take Action
          </button>
        </div>
      `
        )
        .join("");
    } catch (error) {
      console.error("Error rendering recommendations:", error);
      list.innerHTML =
        '<div class="recommendation-card"><p>Recommendations will appear as you use the app more.</p></div>';
    }
  }

  renderGoalsGrid() {
    const grid = document.getElementById("goalsGrid");
    if (!grid || !this.goalManager) return;

    try {
      const goals = this.goalManager.getActiveGoals();
      if (goals.length === 0) {
        grid.innerHTML = `
          <div class="goal-card">
            <div class="goal-header">
              <h4 class="goal-title">No Active Goals</h4>
            </div>
            <p class="goal-description">Create your first goal to start tracking your progress!</p>
            <div class="goal-actions">
              <button class="goal-action-btn primary" onclick="app.showGoalModal()">Create Goal</button>
            </div>
          </div>
        `;
        return;
      }

      grid.innerHTML = goals
        .map((goal) => {
          const progress = this.goalManager.calculateGoalProgress(goal);
          return `
          <div class="goal-card ${goal.status}">
            <div class="goal-header">
              <h4 class="goal-title">${goal.title}</h4>
              <span class="goal-status ${goal.status}">${goal.status}</span>
            </div>
            <p class="goal-description">${goal.description}</p>
            <div class="goal-progress">
              <div class="goal-progress-bar">
                <div class="goal-progress-fill" style="width: ${progress}%"></div>
              </div>
              <div class="goal-progress-text">
                <span>${Math.round(progress)}% Complete</span>
                <span>${goal.target} ${goal.type}</span>
              </div>
            </div>
            <div class="goal-actions">
              <button class="goal-action-btn" onclick="app.deleteGoal('${
                goal.id
              }')">Delete</button>
            </div>
          </div>
        `;
        })
        .join("");
    } catch (error) {
      console.error("Error rendering goals grid:", error);
    }
  }

  renderGoalSuggestions() {
    const grid = document.getElementById("suggestionsGrid");
    if (!grid || !this.goalManager) return;

    try {
      const suggestions = this.goalManager.getSuggestedGoals();
      grid.innerHTML = suggestions
        .map(
          (suggestion, index) => `
        <div class="goal-card suggestion">
          <div class="goal-header">
            <h4 class="goal-title">${suggestion.title}</h4>
          </div>
          <p class="goal-description">${suggestion.description}</p>
          <div class="goal-meta">
            <span class="goal-target">Target: ${suggestion.target} ${suggestion.type}</span>
            <span class="goal-period">${suggestion.period}</span>
          </div>
          <div class="goal-rewards">
            ${suggestion.rewards.map(reward => 
              reward.type === 'badge' ? `<span class="reward-badge">${reward.data.icon} ${reward.data.name}</span>` :
              reward.type === 'points' ? `<span class="reward-points">⭐ ${reward.data} points</span>` : ''
            ).join('')}
          </div>
          <div class="goal-actions">
            <button class="goal-action-btn primary" data-suggestion-index="${index}">
              Create Goal
            </button>
          </div>
        </div>
      `
        )
        .join("");

      // Add event listeners to suggestion buttons
      grid.querySelectorAll('.goal-action-btn[data-suggestion-index]').forEach(button => {
        button.addEventListener('click', (e) => {
          const index = parseInt(e.target.dataset.suggestionIndex);
          this.createSuggestedGoal(suggestions[index]);
        });
      });
    } catch (error) {
      console.error("Error rendering goal suggestions:", error);
    }
  }

  // Generic Modal Functions
  showGenericModal(title, contentHtml, footerHtml = '') {
    const modal = document.getElementById('genericModal');
    const modalTitle = document.getElementById('genericModalTitle');
    const modalBody = document.getElementById('genericModalBody');
    const modalFooter = document.getElementById('genericModalFooter');

    if (modal && modalTitle && modalBody && modalFooter) {
      modalTitle.textContent = title;
      modalBody.innerHTML = contentHtml;
      modalFooter.innerHTML = footerHtml;
      modal.style.display = 'flex';
    }
  }

  closeGenericModal() {
    const modal = document.getElementById('genericModal');
    if (modal) {
      modal.style.display = 'none';
      document.getElementById('genericModalTitle').textContent = '';
      document.getElementById('genericModalBody').innerHTML = '';
      document.getElementById('genericModalFooter').innerHTML = '';
    }
  }

  // Updated Modal Triggers and Content Generation
  showGoalModal() {
    const formHtml = `
      <form id="goalForm">
        <div class="form-group">
          <label class="form-label">Goal Title</label>
          <input type="text" class="form-input" id="goalTitle" required>
        </div>
        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea class="form-textarea" id="goalDescription"></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Goal Type</label>
          <select class="form-select" id="goalType">
            <option value="usage">Usage Goal</option>
            <option value="streak">Streak Goal</option>
            <option value="value">Value Goal</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Feature</label>
          <select class="form-select" id="goalFeature">
            ${Object.keys(CONFIG.features).map(featureId => `<option value="${featureId}">${CONFIG.features[featureId].name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Target</label>
          <input type="number" class="form-input" id="goalTarget" min="1" required>
        </div>
        <div class="form-group">
          <label class="form-label">Period</label>
          <select class="form-select" id="goalPeriod">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </form>
    `;
    const footerHtml = `
      <button class="btn secondary" onclick="app.closeGenericModal()">Cancel</button>
      <button class="btn primary" onclick="app.createGoalFromForm()">Create Goal</button>
    `;
    this.showGenericModal("Create New Goal", formHtml, footerHtml);
  }

  createGoalFromForm() {
    console.log("🎯 Creating goal from form...");

    try {
      const titleElement = document.getElementById("goalTitle");
      const descriptionElement = document.getElementById("goalDescription");
      const typeElement = document.getElementById("goalType");
      const featureElement = document.getElementById("goalFeature");
      const targetElement = document.getElementById("goalTarget");
      const periodElement = document.getElementById("goalPeriod");

      if (
        !titleElement ||
        !typeElement ||
        !featureElement ||
        !targetElement ||
        !periodElement
      ) {
        console.error("❌ Goal form elements not found");
        this.showNotification("Goal form is not properly loaded. Please try refreshing the page.", "error");
        return;
      }

      const title = titleElement.value?.trim();
      const description = descriptionElement?.value?.trim() || "";
      const type = typeElement.value;
      const featureId = featureElement.value;
      const target = parseInt(targetElement.value);
      const period = periodElement.value;

      console.log("📝 Form data:", {
        title,
        description,
        type,
        featureId,
        target,
        period,
      });

      if (!title || !target || !featureId) {
        console.warn("⚠️ Missing required fields");
        this.showNotification("Please fill in all required fields", "error");
        return;
      }

      if (isNaN(target) || target <= 0) {
        console.warn("⚠️ Invalid target value");
        this.showNotification("Please enter a valid target number", "error");
        return;
      }

      const goalData = {
        title,
        description,
        type,
        featureId,
        target,
        period,
        rewards: [
          { type: "badge", data: { name: `${title} Achiever`, icon: "🏆" } },
          { type: "points", data: 100 },
        ],
      };

      console.log("🎯 Creating goal with data:", goalData);

      if (this.goalManager) {
        this.goalManager.createGoal(goalData);
        this.closeGenericModal();
        this.renderGoals();
        console.log("✅ Goal created successfully");
      } else {
        console.error("❌ Goal manager not initialized");
        this.showNotification("Goal system not ready. Please try refreshing the page.", "error");
      }
    } catch (error) {
      console.error("❌ Error creating goal:", error);
      console.error("Stack trace:", error.stack);
      this.showNotification("Error creating goal. Please try again.", "error");
    }
  }

  createSuggestedGoal(suggestion) {
    try {
      console.log("🎯 Creating suggested goal:", suggestion);
      
      if (this.goalManager) {
        const goal = this.goalManager.createGoal(suggestion);
        this.renderGoals();
        this.showNotification(`🎯 Goal "${suggestion.title}" created successfully!`, "success");
        console.log("✅ Suggested goal created:", goal);
      } else {
        console.error("❌ Goal manager not initialized");
        this.showNotification("Goal system not ready. Please try refreshing the page.", "error");
      }
    } catch (error) {
      console.error("❌ Error creating suggested goal:", error);
      this.showNotification("Error creating goal. Please try again.", "error");
    }
  }

  deleteGoal(goalId) {
    if (confirm("Are you sure you want to delete this goal?")) {
      if (this.goalManager) {
        this.goalManager.deleteGoal(goalId);
        this.renderGoals();
      }
    }
  }

  handleRecommendation(action, actionData) {
    switch (action) {
      case "logUsage":
        this.logUsage(actionData);
        break;
      case "showFeature":
        // Removed as dedicated features view is gone. Maybe redirect to dashboard or analytics?
        this.switchView("dashboard"); 
        break;
      case "showTips":
        this.showTips(actionData);
        break;
      case "showGoals":
        this.switchView("goals");
        break;
    }
  }

  updateQuickStats() {
    let totalUsage = 0;
    let totalQuota = 0;
    let featuresUsed = 0;
    let totalValue = 0;

    // Calculate overall statistics
    Object.keys(CONFIG.features).forEach((featureId) => {
      const feature = CONFIG.features[featureId];
      const usage = this.data.usage.get(featureId);

      totalUsage += usage.monthly;
      totalQuota += feature.quotas.pro.monthly;

      if (usage.monthly > 0) {
        featuresUsed++;
        // Calculate value based on usage percentage
        const usagePercentage = Math.min(
          usage.monthly / feature.quotas.pro.monthly,
          1
        );
        totalValue += feature.estimatedValue * usagePercentage;
      }
    });

    // Update monthly usage percentage
    const usagePercentage =
      totalQuota > 0 ? Math.round((totalUsage / totalQuota) * 100) : 0;
    document.getElementById("monthlyUsage").textContent = `${usagePercentage}%`;
    document.getElementById("monthlyProgress").style.width = `${Math.min(
      usagePercentage,
      100
    )}%`;

    // Update features used
    const totalFeatures = Object.keys(CONFIG.features).length;
    document.getElementById(
      "featuresUsed"
    ).textContent = `${featuresUsed}/${totalFeatures}`;
    document.getElementById("featuresProgress").style.width = `${
      (featuresUsed / totalFeatures) * 100
    }%`;

    // Update subscription value
    document.getElementById("subscriptionValue").textContent = `$${Math.round(
      totalValue
    )}`;
  }

  renderFeaturesGrid() {
    const grid = document.getElementById("featuresGrid");
    grid.innerHTML = "";

    // Sort features by priority (creative features first)
    const sortedFeatures = Object.keys(CONFIG.features).sort((a, b) => {
      const featureA = CONFIG.features[a];
      const featureB = CONFIG.features[b];

      // Prioritize creative features
      if (featureA.category === "creative" && featureB.category !== "creative")
        return -1;
      if (featureA.category !== "creative" && featureB.category === "creative")
        return 1;

      return featureA.estimatedValue - featureB.estimatedValue;
    });

    sortedFeatures.forEach((featureId) => {
      const feature = CONFIG.features[featureId];
      const usage = this.data.usage.get(featureId);
      const percentage = Math.round(
        (usage.monthly / feature.quotas.pro.monthly) * 100
      );
      const remaining = feature.quotas.pro.monthly - usage.monthly;

      // Determine card color based on usage
      let borderColor = "#4285f4"; // Default blue
      if (percentage >= 90) borderColor = "#ea4335"; // Red for high usage
      else if (percentage >= 75)
        borderColor = "#fbbc04"; // Yellow for medium usage
      else if (percentage > 0) borderColor = "#34a853"; // Green for some usage

      const card = document.createElement("div");
      card.className = "feature-card";
      card.style.borderLeftColor = borderColor;
      card.innerHTML = `
                <div class="feature-header">
                    <span class="feature-icon">${feature.icon}</span>
                    <span class="feature-name">${feature.name}</span>
                </div>
                <div class="feature-usage">
                    <div class="usage-stats">
                        <span>Used: ${usage.monthly}</span>
                        <span>Limit: ${feature.quotas.pro.monthly}</span>
                        <span>${percentage}%</span>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: ${Math.min(
                          percentage,
                          100
                        )}%; background-color: ${borderColor};"></div>
                    </div>
                    <div class="usage-details">
                        <small style="color: #5f6368;">
                            Remaining: ${remaining} | Daily: ${usage.daily}/${
        feature.quotas.pro.daily
      }
                            ${ 
                              usage.lastUsed
                                ? ` | Last used: ${new Date(
                                    usage.lastUsed
                                  ).toLocaleDateString()}`
                                : ""
                            }
                        </small>
                    </div>
                </div>
                <div class="feature-actions">
                    <button class="btn primary" onclick="app.logUsage('${featureId}')">
                        Log Usage
                    </button>
                    <button class="btn secondary" onclick="app.showTips('${featureId}')">
                        Tips
                    </button>
                    <button class="btn secondary" onclick="app.showHistory('${featureId}')">
                        Custom
                    </button>
                </div>
            `;

      grid.appendChild(card);
    });
  }

  logCustomUsage(featureId) {
    const feature = CONFIG.features[featureId];
    const amount = prompt(
      `How many ${feature.name} uses would you like to log?`,
      "1"
    );

    if (amount && !isNaN(amount) && parseInt(amount) > 0) {
      this.logUsage(featureId, parseInt(amount));
    }
  }

  showTips(featureId) {
    const feature = CONFIG.features[featureId];
    const tips = feature.tips
      .map((tip, index) => `${index + 1}. ${tip}`)
      .join("<br>");

    this.showGenericModal(
      `💡 Tips for ${feature.name}`,
      `<p>${tips}</p><p>💰 Estimated Value: $${feature.estimatedValue}/month</p>`,
      `<button class="btn primary" onclick="app.closeGenericModal()">Got It</button>`
    );
  }

  showHistory(featureId) {
    const feature = CONFIG.features[featureId];
    const usage = this.data.usage.get(featureId);

    if (usage.history.length === 0) {
      this.showGenericModal(
        `📊 Usage History for ${feature.name}`,
        `<p>No usage history for ${feature.name} yet.</p>`,
        `<button class="btn primary" onclick="app.closeGenericModal()">Close</button>`
      );
      return;
    }

    const recentHistory = usage.history.slice(-10).reverse(); // Last 10 entries
    const historyHtml = recentHistory
      .map((entry) => {
        const date = new Date(entry.date).toLocaleString();
        return `<li>• ${date}: +${entry.amount} use(s)</li>`;
      })
      .join("");

    this.showGenericModal(
      `📈 Recent History for ${feature.name}`,
      `<ul>${historyHtml}</ul><p>Total: ${usage.totalUsed} uses</p>`,
      `<button class="btn primary" onclick="app.closeGenericModal()">Close</button>`
    );
  }

  showNotification(message, type = "info") {
    const container = document.getElementById("notificationContainer");
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;

    container.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 5000);

    // Add click to dismiss
    notification.addEventListener("click", () => {
      notification.remove();
    });

    // Add to internal notifications list for bell icon
    this.notifications.push({ message, type, timestamp: new Date() });
    this.updateNotificationCount();
  }

  updateNotificationCount() {
    const countElement = document.getElementById("notificationCount");
    if (countElement) {
      const unreadCount = this.notifications.filter(n => !n.read).length;
      countElement.textContent = unreadCount;
      countElement.style.display = unreadCount > 0 ? 'block' : 'none';
    }
  }

  showNotificationList() {
    const notificationListHtml = this.notifications.length > 0 ?
      `<ul>
        ${this.notifications.map((n, index) => 
          `<li class="notification-item ${n.read ? 'read' : 'unread'}" onclick="app.markNotificationAsRead(${index})">
            <span class="notification-message">${n.message}</span>
            <span class="notification-time">${n.timestamp.toLocaleString()}</span>
          </li>`
        ).join('')}
      </ul>` :
      `<p>No new notifications.</p>`;

    const footerHtml = `<button class="btn secondary" onclick="app.clearAllNotifications()">Clear All</button>
                        <button class="btn primary" onclick="app.closeGenericModal()">Close</button>`;

    this.showGenericModal("🔔 Notifications", notificationListHtml, footerHtml);
  }

  markNotificationAsRead(index) {
    if (this.notifications[index]) {
      this.notifications[index].read = true;
      this.updateNotificationCount();
      this.showNotificationList(); // Re-render modal to show changes
    }
  }

  clearAllNotifications() {
    this.notifications = [];
    this.updateNotificationCount();
    this.showNotification("All notifications cleared.", "info");
    this.closeGenericModal();
  }

  exportData() {
    const data = {
      usage: Object.fromEntries(this.data.usage),
      settings: this.data.settings,
      exportDate: new Date().toISOString(),
      appVersion: "1.0.0",
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-pro-tracker-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.showNotification("📥 Data exported successfully!", "success");
  }

  clearData() {
    if (
      confirm(
        "⚠️ Are you sure you want to clear all data? This cannot be undone."
      )
    ) {
      // Clear storage
      StorageService.clear();

      // Reset usage data
      this.data.usage.clear();
      Object.keys(CONFIG.features).forEach((featureId) => {
        this.data.usage.set(featureId, {
          monthly: 0,
          daily: 0,
          lastUsed: null,
          totalUsed: 0,
          history: [],
        });
      });

      // Reset settings
      this.data.settings = {
        notifications: true,
        quotaAlerts: true,
        smartReminders: true,
        detailedAnalytics: true,
        usageTracking: true,
      };

      // Update UI
      this.renderDashboard();
      if (this.currentView === "analytics") {
        this.renderAnalytics();
      }
      if (this.currentView === "goals") {
        this.renderGoals();
      }

      this.showNotification("🗑️ All data cleared successfully!", "success");
    }
  }

  checkDailyReset() {
    const lastReset = StorageService.get("lastDailyReset");
    const today = new Date().toDateString();

    if (lastReset !== today) {
      // Reset daily counters
      this.data.usage.forEach((usage) => {
        usage.daily = 0;
      });

      StorageService.set("lastDailyReset", today);
      this.saveData();
      console.log("🔄 Daily usage counters reset");
    }

    // Schedule next check
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    setTimeout(() => {
      this.checkDailyReset();
      // Check again every 24 hours
      setInterval(() => this.checkDailyReset(), 24 * 60 * 60 * 1000);
    }, msUntilMidnight);
  }

  showWelcomeIfFirstTime() {
    const hasVisited = StorageService.get("hasVisited");
    if (!hasVisited) {
      setTimeout(() => {
        this.showNotification(
          "🎉 Welcome to AI Pro Tracker! Start by logging your Google AI Pro usage with the quick action buttons.",
          "success"
        );
        StorageService.set("hasVisited", true);
      }, 1000);
    }
  }
  // Phase 6 UI Methods
  async renderAIIntelligencePanel() {
    if (!this.aiIntelligence) return;

    const aiInsightsDiv = document.getElementById('aiInsights');
    const workflowSuggestionsDiv = document.getElementById('workflowSuggestions');

    if (aiInsightsDiv) {
      const recommendations = this.aiIntelligence.generateAdaptiveRecommendations();
      aiInsightsDiv.innerHTML = recommendations.map(rec => 
        `<div class="ai-insight-card">
          <h4>${rec.title}</h4>
          <p>${rec.message}</p>
        </div>`
      ).join('');
    }

    if (workflowSuggestionsDiv) {
      // Assuming a method to get current workflow from app
      const currentWorkflow = ['geminiPro', 'veo']; // Placeholder
      const optimizations = await this.aiIntelligence.optimizeWorkflow(currentWorkflow);
      workflowSuggestionsDiv.innerHTML = optimizations.map(opt => 
        `<div class="workflow-suggestion-card">
          <h4>${opt.type}</h4>
          <p>${opt.suggestion}</p>
          <small>Confidence: ${Math.round(opt.confidence * 100)}%</small>
        </div>`
      ).join('');
    }
  }

  async optimizeWorkflow() {
    this.showNotification("Optimizing your workflow...", "info");
    // This will trigger the workflow optimizer in aiIntelligence
    await this.renderAIIntelligencePanel(); // Re-render to show new suggestions
    this.showNotification("Workflow optimization complete!", "success");
  }

  async toggleVoiceInterface() {
    if (!this.voiceInterface) {
      this.showNotification("Voice interface not available.", "error");
      return;
    }

    const voiceActivationBtn = document.getElementById('voiceActivation');
    if (this.voiceInterface.isListening) {
      this.voiceInterface.recognition.stop();
      this.voiceInterface.isListening = false;
      voiceActivationBtn.textContent = "🎤 Ask AI Assistant";
      this.showNotification("Voice interface stopped.", "info");
    } else {
      try {
        await this.voiceInterface.recognition.start();
        this.voiceInterface.isListening = true;
        voiceActivationBtn.textContent = "🔴 Listening...";
        this.showNotification("Voice interface listening...", "info");
      } catch (error) {
        console.error("Error starting voice recognition:", error);
        this.showNotification("Failed to start voice interface. Check microphone permissions.", "error");
      }
    }
  }

  async renderMultiPlatformDashboard() {
    if (!this.platformAdapter) return;

    const platformSelectorDiv = document.getElementById('platformSelector');
    const unifiedAnalyticsDiv = document.getElementById('unifiedAnalytics');

    if (platformSelectorDiv) {
      // Placeholder for platform selection UI
      platformSelectorDiv.innerHTML = `<select><option>All Platforms</option></select>`;
    }

    if (unifiedAnalyticsDiv) {
      const unifiedData = await this.platformAdapter.generateUnifiedAnalytics();
      unifiedAnalyticsDiv.innerHTML = `
        <h3>Unified Analytics Summary</h3>
        <p>Total Requests: ${unifiedData.totalRequests}</p>
        <p>Total Tokens: ${unifiedData.totalTokens}</p>
        <p>Total Estimated Cost: ${unifiedData.totalCost.toFixed(2)}</p>
        <h4>Platform Breakdown:</h4>
        <ul>
          ${Object.entries(unifiedData.platforms).map(([platformId, data]) => 
            `<li>${platformId}: Requests: ${data.usage.requests}, Cost: ${data.usage.cost.toFixed(2)}</li>`
          ).join('')}
        </ul>
      `;
    }
  }

  async enterVRAnalytics() {
    if (!this.arVrInterface) {
      this.showNotification("AR/VR interface not available.", "error");
      return;
    }

    try {
      this.showNotification("Entering VR analytics...", "info");
      await this.arVrInterface.initializeVR();
      this.showNotification("VR analytics ready!", "success");
    } catch (error) {
      console.error("Error entering VR:", error);
      this.showNotification(`Failed to enter VR: ${error.message}`, "error");
    }
  }

  async enableAROverlay() {
    if (!this.arVrInterface) {
      this.showNotification("AR/VR interface not available.", "error");
      return;

    }
    try {
      this.showNotification("Enabling AR overlay... ", "info");
      await this.arVrInterface.initializeAR();
      this.showNotification("AR overlay enabled!", "success");
    } catch (error) {
      console.error("Error enabling AR:", error);
      this.showNotification(`Failed to enable AR: ${error.message}`, "error");
    }
  }

  // Phase 4.3 UI Methods (updated to use generic modal)
  showMLAnalytics() {
    const content = `
      <div class="analytics-grid">
        <div class="analytics-card">
          <h4>📈 Usage Predictions</h4>
          <div id="usagePredictions">${this.mlAnalytics ? 'Predictions loaded.' : 'ML Analytics not initialized.'}</div>
        </div>
        <div class="analytics-card">
          <h4>🔍 Pattern Recognition</h4>
          <div id="patternAnalysis">${this.mlAnalytics ? 'Patterns analyzed.' : 'ML Analytics not initialized.'}</div>
        </div>
        <div class="analytics-card">
          <h4>⚠️ Anomaly Detection</h4>
          <div id="anomalyDetection">${this.mlAnalytics ? 'No anomalies detected.' : 'ML Analytics not initialized.'}</div>
        </div>
        <div class="analytics-card">
          <h4>💡 Optimization Recommendations</h4>
          <div id="optimizationRecommendations">${this.mlAnalytics ? 'Recommendations generated.' : 'ML Analytics not initialized.'}</div>
        </div>
      </div>
    `;
    const footer = `<button class="btn primary" onclick="app.closeGenericModal()">Close</button>`;
    this.showGenericModal("🤖 ML Analytics Dashboard", content, footer);
    if (this.mlAnalytics) {
      this.mlAnalytics.displayDashboard(); // This method would update the divs within the modal
    }
  }

  generatePDFReport() {
    if (this.pdfReports) {
      this.pdfReports.generateExecutiveSummary();
      this.showNotification("Generating PDF report...", "info");
    } else {
      this.showNotification("PDF Report Generator not available.", "error");
    }
  }

  showEnhancedCharts() {
    const content = `
      <div class="chart-controls">
        <select id="chartTypeSelector" onchange="app.switchChartType()">
          <option value="usage">Usage Analytics</option>
          <option value="heatmap">Usage Heatmap</option>
          <option value="radar">Performance Radar</option>
          <option value="predictive">Predictive Analytics</option>
        </select>
        <button class="btn secondary" onclick="app.exportChart()">Export Chart</button>
      </div>
      <div id="enhancedChartsContainer">
        <canvas id="enhancedChart"></canvas>
      </div>
    `;
    const footer = `<button class="btn primary" onclick="app.closeGenericModal()">Close</button>`;
    this.showGenericModal("📈 Enhanced Analytics Charts", content, footer);
    if (this.enhancedCharts) {
      this.enhancedCharts.initializeCharts();
    }
  }

  configureSmartNotifications() {
    const content = `
      <div class="form-group">
        <label class="form-label" for="notificationMode">Notification Mode:</label>
        <select class="form-select" id="notificationMode">
          <option value="adaptive">Adaptive (AI-powered)</option>
          <option value="scheduled">Scheduled</option>
          <option value="manual">Manual Only</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">
          <input type="checkbox" id="productivityTracking">
          Enable Productivity Tracking
        </label>
      </div>
      <div class="form-group">
        <label class="form-label" for="contextAwareness">Context Awareness Level:</label>
        <input type="range" class="form-range" id="contextAwareness" min="1" max="5" value="3" oninput="document.getElementById('contextAwarenessValue').textContent = this.value">
        <span id="contextAwarenessValue">3</span>
      </div>
      <div class="form-group">
        <label class="form-label">Quiet Hours:</label>
        <div class="time-range">
          <input type="time" class="form-input" id="quietHoursStart" value="22:00">
          <span>to</span>
          <input type="time" class="form-input" id="quietHoursEnd" value="08:00">
        </div>
      </div>
    `;
    const footer = `<button class="btn primary" onclick="app.saveSmartNotificationSettings()">Save Settings</button>`;
    this.showGenericModal("🔔 Smart Notification Settings", content, footer);
    this.loadSmartNotificationSettings();
  }

  switchChartType() {
    const chartType = document.getElementById('chartTypeSelector').value;
    if (this.enhancedCharts) {
      this.enhancedCharts.switchChart(chartType);
    }
  }

  exportChart() {
    if (this.enhancedCharts) {
      this.enhancedCharts.exportChart();
    }
  }

  saveSmartNotificationSettings() {
    const settings = {
      mode: document.getElementById('notificationMode').value,
      productivityTracking: document.getElementById('productivityTracking').checked,
      contextAwareness: parseInt(document.getElementById('contextAwareness').value),
      quietHours: {
        start: document.getElementById('quietHoursStart').value,
        end: document.getElementById('quietHoursEnd').value
      }
    };

    if (this.smartNotifications) {
      this.smartNotifications.updateSettings(settings);
    }

    StorageService.set('smartNotificationSettings', settings);
    this.showNotification('Smart notification settings saved!', 'success');
    this.closeGenericModal();
  }

  loadSmartNotificationSettings() {
    const settings = StorageService.get('smartNotificationSettings', {
      mode: 'adaptive',
      productivityTracking: true,
      contextAwareness: 3,
      quietHours: { start: '22:00', end: '08:00' }
    });

    document.getElementById('notificationMode').value = settings.mode;
    document.getElementById('productivityTracking').checked = settings.productivityTracking;
    document.getElementById('contextAwareness').value = settings.contextAwareness;
    document.getElementById('contextAwarenessValue').textContent = settings.contextAwareness;
    document.getElementById('quietHoursStart').value = settings.quietHours.start;
    document.getElementById('quietHoursEnd').value = settings.quietHours.end;
  }

  // Phase 5 UI Methods (updated to use generic modal)
  showTeamDashboard() {
    const content = `<div id="teamDashboardContainer">${this.teamDashboard ? this.teamDashboard.renderTeamDashboard() : 'Team Dashboard not initialized.'}</div>`;
    const footer = `<button class="btn primary" onclick="app.closeGenericModal()">Close</button>`;
    this.showGenericModal("👥 Team Dashboard", content, footer);
  }

  showWorkspaceIntegration() {
    const content = `
      <div id="workspaceIntegrationContainer">
        <div class="integration-services">
          <div class="service-card">
            <div class="service-icon">📧</div>
            <div class="service-info">
              <h4>Gmail Integration</h4>
              <p>Track AI-related emails and extract usage insights</p>
              <button class="btn primary" onclick="app.enableGmailIntegration()">Enable</button>
            </div>
          </div>
          <div class="service-card">
            <div class="service-icon">💾</div>
            <div class="service-info">
              <h4>Google Drive Integration</h4>
              <p>Analyze AI-related files and documents</p>
              <button class="btn primary" onclick="app.enableDriveIntegration()">Enable</button>
            </div>
          </div>
          <div class="service-card">
            <div class="service-icon">📅</div>
            <div class="service-info">
              <h4>Calendar Integration</h4>
              <p>Track AI-related meetings and events</p>
              <button class="btn primary" onclick="app.enableCalendarIntegration()">Enable</button>
            </div>
          </div>
        </div>
      </div>
    `;
    const footer = `<button class="btn primary" onclick="app.closeGenericModal()">Close</button>`;
    this.showGenericModal("🔗 Google Workspace Integration", content, footer);
    this.updateWorkspaceIntegrationStatus();
  }

  showEnterpriseDashboard() {
    if (!this.canAccessEnterprise()) {
      this.showNotification('Enterprise features require administrator privileges', 'error');
      return;
    }
    const content = `<div id="enterpriseDashboardContainer">${this.enterpriseDashboard ? this.enterpriseDashboard.renderEnterpriseDashboard() : 'Enterprise Dashboard not initialized.'}</div>`;
    const footer = `<button class="btn primary" onclick="app.closeGenericModal()">Close</button>`;
    this.showGenericModal("🏢 Enterprise Dashboard", content, footer);
  }

  installChromeExtension() {
    const content = `
      <div class="extension-instructions">
        <h4>Installation Steps:</h4>
        <ol>
          <li>Open Chrome and go to <code>chrome://extensions/</code></li>
          <li>Enable "Developer mode" in the top right</li>
          <li>Click "Load unpacked" and select the <code>chrome-extension</code> folder</li>
          <li>The AI Pro Tracker extension will appear in your extensions</li>
        </ol>
        
        <div class="extension-features">
          <h4>Extension Features:</h4>
          <ul>
            <li>🔍 Automatic tracking on AI websites</li>
            <li>📊 Real-time usage statistics</li>
            <li>🔄 Sync with main application</li>
            <li>🎯 Cross-browser usage insights</li>
          </ul>
        </div>

        <div class="extension-download">
          <button class="btn primary" onclick="app.downloadExtensionFiles()">
            📦 Download Extension Files
          </button>
        </div>
      </div>
    `;
    const footer = `<button class="btn primary" onclick="app.closeGenericModal()">Close</button>`;
    this.showGenericModal("🌐 Install Chrome Extension", content, footer);
  }

  downloadExtensionFiles() {
    // Create a simple instruction file since we can't actually package the extension
    const instructions = `
AI Pro Tracker Chrome Extension Installation

1. Create a new folder called 'ai-pro-tracker-extension'
2. Copy all files from the chrome-extension directory to this folder
3. Open Chrome and navigate to chrome://extensions/
4. Enable Developer mode (toggle in top right)
5. Click "Load unpacked" and select your extension folder
6. The extension should now be installed and active

Files needed:
- manifest.json
- background.js
- content.js
- popup.html
- popup.js
- icons/ (folder with icon files)

For production use, you would need to:
- Package the extension as a .crx file
- Submit to Chrome Web Store for distribution
- Add proper API keys and configuration
    `;

    const blob = new Blob([instructions], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chrome-extension-installation-guide.txt';
    a.click();
    URL.revokeObjectURL(url);

    this.showNotification('Extension installation guide downloaded', 'success');
  }

  // Workspace Integration Methods
  async enableGmailIntegration() {
    if (this.workspaceIntegration) {
      const success = await this.workspaceIntegration.enableGmailIntegration();
      if (success) {
        this.showNotification('Gmail integration enabled successfully', 'success');
        this.updateWorkspaceIntegrationStatus();
      } else {
        this.showNotification('Failed to enable Gmail integration', 'error');
      }
    }
  }

  async enableDriveIntegration() {
    if (this.workspaceIntegration) {
      const success = await this.workspaceIntegration.enableDriveIntegration();
      if (success) {
        this.showNotification('Google Drive integration enabled successfully', 'success');
        this.updateWorkspaceIntegrationStatus();
      } else {
        this.showNotification('Failed to enable Drive integration', 'error');
      }
    }
  }

  async enableCalendarIntegration() {
    if (this.workspaceIntegration) {
      const success = await this.workspaceIntegration.enableCalendarIntegration();
      if (success) {
        this.showNotification('Calendar integration enabled successfully', 'success');
        this.updateWorkspaceIntegrationStatus();
      } else {
        this.showNotification('Failed to enable Calendar integration', 'error');
      }
    }
  }

  updateWorkspaceIntegrationStatus() {
    if (!this.workspaceIntegration) return;

    const status = this.workspaceIntegration.getIntegrationStatus();
    const container = document.getElementById('workspaceIntegrationContainer');
    
    if (container) {
      // Update button states based on integration status
      const buttons = container.querySelectorAll('button');
      buttons.forEach(button => {

        const service = button.onclick.toString().match(/enable(\w+)Integration/)?.[1]?.toLowerCase();
        if (service && status.integrations[service]) {
          button.textContent = 'Enabled';
          button.disabled = true;
          button.classList.remove('btn-primary');
          button.classList.add('btn-success');
        }
      });
    }
  }

  // Enterprise Access Control
  checkEnterpriseAccess() {
    const currentUser = this.userManager?.getCurrentUser();
    const enterpriseCard = document.getElementById('enterpriseCard');
    
    if (enterpriseCard) {
      if (currentUser && currentUser.role === 'admin') {
        enterpriseCard.style.display = 'block';
      } else {
        enterpriseCard.style.display = 'none';
      }
    }
  }

  canAccessEnterprise() {
    const currentUser = this.userManager?.getCurrentUser();
    return currentUser && currentUser.role === 'admin';
  }

  // Demo Data Creation
  createDemoEnterpriseData() {
    if (this.userManager) {
      this.userManager.createDemoData();
      this.showNotification('Demo enterprise data created', 'success');
      this.checkEnterpriseAccess();
    }
  }
}

// Initialize the application when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  window.app = new AIProTracker();
  console.log("🚀 Application initialized and ready");
});

window.debugApp = {
  getUsageData: () => Object.fromEntries(app.data.usage),

  getAnalytics: () => app.analytics?.analytics,

  getGoals: () => app.goalManager?.goals,

  clearData: () => {

    localStorage.clear();

    location.reload();

  },

  exportLogs: () => {

    const logs = {

      timestamp: new Date().toISOString(),

      userAgent: navigator.userAgent,

      localStorage: { ...localStorage },

      errors: window.errorLog || [],

    };

    console.log("Debug export:", logs);

    return logs;

  },

};