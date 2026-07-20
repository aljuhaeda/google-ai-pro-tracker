// Phase 5.1: Team Dashboard Component
class TeamDashboard {
  constructor(userManager, storage, analytics, mlAnalytics, chartsModule) {
    this.userManager = userManager;
    this.storage = storage;
    this.analytics = analytics;
    this.mlAnalytics = mlAnalytics; // Phase 4.3: ML Analytics integration
    this.chartsModule = chartsModule; // Phase 4.3: Enhanced charts
    this.currentTeam = null;
    this.init();
  }

  init() {
    this.loadCurrentTeam();
    console.log('👥 Team Dashboard initialized');
  }

  loadCurrentTeam() {
    const currentUser = this.userManager.getCurrentUser();
    if (currentUser && currentUser.teamId) {
      this.currentTeam = this.userManager.teams.get(currentUser.teamId);
    }
  }

  renderTeamDashboard() {
    if (!this.currentTeam) {
      return this.renderNoTeamView();
    }

    const analytics = this.userManager.getTeamAnalytics(this.currentTeam.id);
    const members = this.userManager.getTeamMembers(this.currentTeam.id);

    return `
      <div class="team-dashboard">
        <div class="team-header">
          <div class="team-info">
            <h2 class="team-name">${this.currentTeam.name}</h2>
            <p class="team-description">${this.currentTeam.description}</p>
            <div class="team-stats">
              <span class="stat-item">👥 ${analytics.memberCount} members</span>
              <span class="stat-item">📊 ${analytics.totalUsage} total usage</span>
              <span class="stat-item">⭐ ${analytics.achievements.length} achievements</span>
            </div>
          </div>
          <div class="team-actions">
            <button class="btn primary" onclick="teamDashboard.showInviteModal()">
              ➕ Invite Members
            </button>
            <button class="btn secondary" onclick="teamDashboard.showTeamSettings()">
              ⚙️ Team Settings
            </button>
          </div>
        </div>

        <div class="team-content">
          <div class="team-overview">
            <div class="overview-card">
              <h3>📈 Team Performance</h3>
              <div class="performance-metrics">
                <div class="metric">
                  <span class="metric-value">${analytics.totalUsage}</span>
                  <span class="metric-label">Total Usage</span>
                </div>
                <div class="metric">
                  <span class="metric-value">${Math.round(analytics.averageUsage)}</span>
                  <span class="metric-label">Avg per Member</span>
                </div>
                <div class="metric">
                  <span class="metric-value">${analytics.memberCount}</span>
                  <span class="metric-label">Active Members</span>
                </div>
              </div>
            </div>

            <!-- Phase 4.3: Advanced Analytics Section -->
            <div class="overview-card advanced-analytics">
              <h3>🧠 AI-Powered Insights</h3>
              <div class="analytics-tabs">
                <button class="tab-btn active" onclick="teamDashboard.showAnalyticsTab('comparison')">
                  📊 Comparison
                </button>
                <button class="tab-btn" onclick="teamDashboard.showAnalyticsTab('predictive')">
                  🔮 Predictions
                </button>
                <button class="tab-btn" onclick="teamDashboard.showAnalyticsTab('trends')">
                  📈 Trends
                </button>
              </div>
              <div class="analytics-content">
                <div id="comparisonTab" class="analytics-tab active">
                  <canvas id="teamComparisonChart" width="400" height="200"></canvas>
                </div>
                <div id="predictiveTab" class="analytics-tab">
                  <canvas id="teamPredictiveChart" width="400" height="200"></canvas>
                </div>
                <div id="trendsTab" class="analytics-tab">
                  <canvas id="teamTrendsChart" width="400" height="200"></canvas>
                </div>
              </div>
            </div>

            <div class="overview-card">
              <h3>🏆 Top Performers</h3>
              <div class="leaderboard">
                ${analytics.topPerformers.map((performer, index) => `
                  <div class="leaderboard-item">
                    <span class="rank">#${index + 1}</span>
                    <div class="performer-info">
                      <span class="performer-name">${performer.name}</span>
                      <span class="performer-stats">${performer.usage} usage • ${performer.streak} day streak</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <div class="team-members">
            <h3>👥 Team Members</h3>
            <div class="members-grid">
              ${members.map(member => this.renderMemberCard(member)).join('')}
            </div>
          </div>

          <div class="team-goals">
            <h3>🎯 Team Goals</h3>
            <div class="goals-section">
              ${this.renderTeamGoals()}
            </div>
          </div>

          <div class="team-challenges">
            <h3>🏁 Team Challenges</h3>
            <div class="challenges-section">
              ${this.renderTeamChallenges()}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderMemberCard(member) {
    const avatar = member.avatar;
    const isCurrentUser = this.userManager.getCurrentUser()?.id === member.id;
    
    return `
      <div class="member-card ${isCurrentUser ? 'current-user' : ''}">
        <div class="member-avatar" style="background-color: ${avatar.backgroundColor}; color: ${avatar.textColor}">
          ${avatar.initials}
        </div>
        <div class="member-info">
          <h4 class="member-name">${member.name} ${isCurrentUser ? '(You)' : ''}</h4>
          <span class="member-role">${member.role}</span>
          <div class="member-stats">
            <span class="stat">📊 ${member.stats.totalUsage} usage</span>
            <span class="stat">🔥 ${member.stats.streakDays} day streak</span>
          </div>
          <div class="member-status">
            <span class="status-indicator ${this.getMemberStatus(member)}"></span>
            <span class="status-text">${this.getMemberStatusText(member)}</span>
          </div>
        </div>
        ${this.canManageMember(member) ? `
          <div class="member-actions">
            <button class="btn-icon" onclick="teamDashboard.manageMember('${member.id}')" title="Manage Member">
              ⚙️
            </button>
          </div>
        ` : ''}
      </div>
    `;
  }

  renderTeamGoals() {
    const teamGoals = this.getTeamGoals();
    
    if (teamGoals.length === 0) {
      return `
        <div class="empty-state">
          <p>No team goals set yet</p>
          <button class="btn primary" onclick="teamDashboard.createTeamGoal()">
            Create Team Goal
          </button>
        </div>
      `;
    }

    return teamGoals.map(goal => `
      <div class="goal-card team-goal">
        <div class="goal-header">
          <h4>${goal.title}</h4>
          <span class="goal-progress">${goal.progress}%</span>
        </div>
        <div class="goal-progress-bar">
          <div class="progress-fill" style="width: ${goal.progress}%"></div>
        </div>
        <p class="goal-description">${goal.description}</p>
        <div class="goal-contributors">
          ${goal.contributors.map(contributor => `
            <span class="contributor">${contributor.name}: ${contributor.contribution}</span>
          `).join('')}
        </div>
      </div>
    `).join('');
  }

  renderTeamChallenges() {
    const challenges = this.getTeamChallenges();
    
    return challenges.map(challenge => `
      <div class="challenge-card ${challenge.status}">
        <div class="challenge-header">
          <h4>${challenge.title}</h4>
          <span class="challenge-reward">${challenge.reward}</span>
        </div>
        <p class="challenge-description">${challenge.description}</p>
        <div class="challenge-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${challenge.progress}%"></div>
          </div>
          <span class="progress-text">${challenge.current}/${challenge.target}</span>
        </div>
        <div class="challenge-participants">
          <span class="participants-count">${challenge.participants} participants</span>
          <span class="time-remaining">${challenge.timeRemaining}</span>
        </div>
      </div>
    `).join('');
  }

  renderNoTeamView() {
    return `
      <div class="no-team-view">
        <div class="no-team-content">
          <h2>👥 Join or Create a Team</h2>
          <p>Teams help you collaborate, share insights, and achieve goals together.</p>
          
          <div class="team-options">
            <div class="option-card">
              <h3>🏢 Create New Team</h3>
              <p>Start your own team and invite colleagues</p>
              <button class="btn primary" onclick="teamDashboard.showCreateTeamModal()">
                Create Team
              </button>
            </div>
            
            <div class="option-card">
              <h3>🔗 Join Existing Team</h3>
              <p>Enter a team invitation code</p>
              <button class="btn secondary" onclick="teamDashboard.showJoinTeamModal()">
                Join Team
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Team Management Methods
  showInviteModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3>Invite Team Members</h3>
          <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
        </div>
        <div class="modal-body">
          <div class="invite-methods">
            <div class="invite-method">
              <h4>📧 Email Invitation</h4>
              <input type="email" placeholder="Enter email address" id="inviteEmail">
              <button class="btn primary" onclick="teamDashboard.sendEmailInvite()">
                Send Invite
              </button>
            </div>
            
            <div class="invite-method">
              <h4>🔗 Share Invitation Link</h4>
              <div class="invite-link">
                <input type="text" value="${this.generateInviteLink()}" readonly id="inviteLink">
                <button class="btn secondary" onclick="teamDashboard.copyInviteLink()">
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  showCreateTeamModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3>Create New Team</h3>
          <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
        </div>
        <div class="modal-body">
          <form id="createTeamForm">
            <div class="form-group">
              <label>Team Name</label>
              <input type="text" id="teamName" required>
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea id="teamDescription" rows="3"></textarea>
            </div>
            <div class="form-group">
              <label>
                <input type="checkbox" id="publicTeam">
                Make team discoverable by others
              </label>
            </div>
            <button type="submit" class="btn primary">Create Team</button>
          </form>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('createTeamForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.createTeam();
    });
  }

  createTeam() {
    const name = document.getElementById('teamName').value;
    const description = document.getElementById('teamDescription').value;
    const isPublic = document.getElementById('publicTeam').checked;

    const team = this.userManager.createTeam({
      name,
      description,
      isPublic
    });

    if (team) {
      this.currentTeam = team;
      this.refreshDashboard();
      document.querySelector('.modal-overlay').remove();
    }
  }

  // Utility Methods
  getMemberStatus(member) {
    const lastActive = new Date(member.lastActive);
    const now = new Date();
    const hoursSinceActive = (now - lastActive) / (1000 * 60 * 60);

    if (hoursSinceActive < 1) return 'online';
    if (hoursSinceActive < 24) return 'recent';
    return 'offline';
  }

  getMemberStatusText(member) {
    const status = this.getMemberStatus(member);
    switch (status) {
      case 'online': return 'Active now';
      case 'recent': return 'Active today';
      case 'offline': return 'Offline';
    }
  }

  canManageMember(member) {
    const currentUser = this.userManager.getCurrentUser();
    return currentUser && (
      currentUser.role === 'admin' || 
      (currentUser.role === 'manager' && member.role === 'user')
    );
  }

  getTeamGoals() {
    // Mock team goals - in real app would fetch from storage
    return [
      {
        title: 'Team AI Usage Challenge',
        description: 'Reach 1000 total AI interactions this month',
        progress: 75,
        target: 1000,
        current: 750,
        contributors: [
          { name: 'John', contribution: 250 },
          { name: 'Sarah', contribution: 300 },
          { name: 'Mike', contribution: 200 }
        ]
      }
    ];
  }

  getTeamChallenges() {
    // Mock challenges - in real app would fetch from storage
    return [
      {
        title: 'Weekly Innovation Sprint',
        description: 'Try 3 new AI features this week',
        progress: 66,
        current: 2,
        target: 3,
        participants: 4,
        timeRemaining: '2 days left',
        reward: '🏆 Innovation Badge',
        status: 'active'
      },
      {
        title: 'Monthly Consistency Challenge',
        description: 'Use AI tools every day for 30 days',
        progress: 80,
        current: 24,
        target: 30,
        participants: 6,
        timeRemaining: '6 days left',
        reward: '🔥 Consistency Master',
        status: 'active'
      }
    ];
  }

  generateInviteLink() {
    return `${window.location.origin}/invite/${this.currentTeam.id}`;
  }

  refreshDashboard() {
    const dashboardContainer = document.getElementById('teamDashboardContainer');
    if (dashboardContainer) {
      dashboardContainer.innerHTML = this.renderTeamDashboard();
      // Phase 4.3: Initialize advanced analytics charts
      this.initializeAdvancedCharts();
    }
  }

  // Phase 4.3: Advanced Analytics Methods
  initializeAdvancedCharts() {
    setTimeout(() => {
      this.createTeamComparisonChart();
      this.createTeamPredictiveChart();
      this.createTeamTrendsChart();
    }, 100); // Small delay to ensure DOM elements are rendered
  }

  showAnalyticsTab(tabName) {
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

    // Refresh chart if needed
    if (tabName === 'comparison') {
      this.createTeamComparisonChart();
    } else if (tabName === 'predictive') {
      this.createTeamPredictiveChart();
    } else if (tabName === 'trends') {
      this.createTeamTrendsChart();
    }
  }

  createTeamComparisonChart() {
    if (!this.chartsModule || !this.currentTeam) return;

    const teamData = this.getTeamComparisonData();
    this.chartsModule.createComparisonChart('teamComparisonChart', teamData, {
      title: 'Team Performance: This Week vs Last Week',
      type: 'team'
    });
  }

  createTeamPredictiveChart() {
    if (!this.chartsModule || !this.mlAnalytics || !this.currentTeam) return;

    const predictions = this.getTeamPredictiveData();
    this.chartsModule.createPredictiveChart('teamPredictiveChart', predictions, {
      title: 'Team Performance Predictions (Next 7 Days)',
      type: 'team'
    });
  }

  createTeamTrendsChart() {
    if (!this.chartsModule || !this.currentTeam) return;

    const trendsData = this.getTeamTrendsData();
    this.chartsModule.createTrendsChart('teamTrendsChart', trendsData, {
      title: 'Team Usage Trends (Last 30 Days)',
      type: 'team'
    });
  }

  getTeamComparisonData() {
    const teamAnalytics = this.userManager.getTeamAnalytics(this.currentTeam.id);
    
    return {
      current: {
        totalUsage: teamAnalytics.thisWeek.totalUsage,
        activeMembers: teamAnalytics.thisWeek.activeMembers,
        collaborations: teamAnalytics.thisWeek.collaborations,
        achievements: teamAnalytics.thisWeek.achievements
      },
      previous: {
        totalUsage: teamAnalytics.lastWeek.totalUsage,
        activeMembers: teamAnalytics.lastWeek.activeMembers,
        collaborations: teamAnalytics.lastWeek.collaborations,
        achievements: teamAnalytics.lastWeek.achievements
      }
    };
  }

  getTeamPredictiveData() {
    if (!this.mlAnalytics) return null;

    const teamId = this.currentTeam.id;
    const predictions = this.mlAnalytics.predictTeamPerformance(teamId, 7);
    
    return {
      predictions: predictions.dailyPredictions,
      confidence: predictions.confidence,
      features: ['Team Usage', 'Active Members', 'Collaborations', 'Goal Progress']
    };
  }

  getTeamTrendsData() {
    const teamAnalytics = this.userManager.getTeamAnalytics(this.currentTeam.id);
    
    return {
      labels: teamAnalytics.last30Days.map(day => day.date),
      datasets: [
        {
          label: 'Team Usage',
          data: teamAnalytics.last30Days.map(day => day.totalUsage),
          borderColor: '#4285f4',
          backgroundColor: 'rgba(66, 133, 244, 0.1)'
        },
        {
          label: 'Active Members',
          data: teamAnalytics.last30Days.map(day => day.activeMembers),
          borderColor: '#34a853',
          backgroundColor: 'rgba(52, 168, 83, 0.1)'
        },
        {
          label: 'Collaborations',
          data: teamAnalytics.last30Days.map(day => day.collaborations),
          borderColor: '#fbbc04',
          backgroundColor: 'rgba(251, 188, 4, 0.1)'
        }
      ]
    };
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TeamDashboard;
}