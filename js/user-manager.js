// Phase 5.1: Multi-User & Team Features - User Manager
class UserManager {
  constructor(storage) {
    this.storage = storage;
    this.currentUser = null;
    this.users = new Map();
    this.teams = new Map();
    this.roles = {
      ADMIN: 'admin',
      MANAGER: 'manager',
      USER: 'user'
    };
    this.init();
  }

  init() {
    this.loadUsers();
    this.loadTeams();
    this.loadCurrentUser();
    console.log('👥 User Manager initialized');
  }

  // User Management
  createUser(userData) {
    const user = {
      id: this.generateUserId(),
      email: userData.email,
      name: userData.name,
      role: userData.role || this.roles.USER,
      teamId: userData.teamId || null,
      avatar: userData.avatar || this.generateAvatar(userData.name),
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      settings: {
        notifications: true,
        emailDigest: true,
        shareUsage: true
      },
      stats: {
        totalUsage: 0,
        streakDays: 0,
        achievements: []
      }
    };

    this.users.set(user.id, user);
    this.saveUsers();
    console.log(`✅ User created: ${user.name} (${user.email})`);
    return user;
  }

  authenticateUser(email, password) {
    // Simulate authentication - in real app would connect to auth service
    const user = Array.from(this.users.values()).find(u => u.email === email);
    if (user) {
      this.currentUser = user;
      user.lastActive = new Date().toISOString();
      this.saveCurrentUser();
      this.saveUsers();
      console.log(`🔐 User authenticated: ${user.name}`);
      return user;
    }
    return null;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  updateUserRole(userId, newRole) {
    const user = this.users.get(userId);
    if (user && this.canModifyUser(userId)) {
      user.role = newRole;
      this.saveUsers();
      console.log(`👤 User role updated: ${user.name} -> ${newRole}`);
      return true;
    }
    return false;
  }

  // Team Management
  createTeam(teamData) {
    const team = {
      id: this.generateTeamId(),
      name: teamData.name,
      description: teamData.description || '',
      ownerId: this.currentUser?.id,
      members: [this.currentUser?.id].filter(Boolean),
      settings: {
        shareAnalytics: true,
        allowMemberInvites: false,
        publicLeaderboard: true
      },
      stats: {
        totalUsage: 0,
        activeMembers: 1,
        achievements: []
      },
      createdAt: new Date().toISOString()
    };

    this.teams.set(team.id, team);
    
    // Update current user's team
    if (this.currentUser) {
      this.currentUser.teamId = team.id;
      this.users.set(this.currentUser.id, this.currentUser);
    }

    this.saveTeams();
    this.saveUsers();
    console.log(`🏢 Team created: ${team.name}`);
    return team;
  }

  joinTeam(teamId, userId = null) {
    const user = userId ? this.users.get(userId) : this.currentUser;
    const team = this.teams.get(teamId);

    if (user && team) {
      user.teamId = teamId;
      if (!team.members.includes(user.id)) {
        team.members.push(user.id);
        team.stats.activeMembers = team.members.length;
      }

      this.users.set(user.id, user);
      this.teams.set(teamId, team);
      this.saveUsers();
      this.saveTeams();
      console.log(`👥 User ${user.name} joined team ${team.name}`);
      return true;
    }
    return false;
  }

  getTeamMembers(teamId) {
    const team = this.teams.get(teamId);
    if (!team) return [];

    return team.members.map(memberId => this.users.get(memberId)).filter(Boolean);
  }

  getTeamAnalytics(teamId) {
    const team = this.teams.get(teamId);
    if (!team) return null;

    const members = this.getTeamMembers(teamId);
    const analytics = {
      teamName: team.name,
      memberCount: members.length,
      totalUsage: 0,
      averageUsage: 0,
      topPerformers: [],
      usageTrends: [],
      achievements: team.stats.achievements
    };

    // Calculate team usage statistics
    members.forEach(member => {
      analytics.totalUsage += member.stats.totalUsage;
    });

    analytics.averageUsage = analytics.totalUsage / members.length || 0;

    // Get top performers
    analytics.topPerformers = members
      .sort((a, b) => b.stats.totalUsage - a.stats.totalUsage)
      .slice(0, 5)
      .map(member => ({
        name: member.name,
        usage: member.stats.totalUsage,
        streak: member.stats.streakDays
      }));

    return analytics;
  }

  // Permission System
  canModifyUser(userId) {
    if (!this.currentUser) return false;
    
    const targetUser = this.users.get(userId);
    if (!targetUser) return false;

    // Admin can modify anyone
    if (this.currentUser.role === this.roles.ADMIN) return true;
    
    // Manager can modify users in same team
    if (this.currentUser.role === this.roles.MANAGER && 
        this.currentUser.teamId === targetUser.teamId) return true;
    
    // Users can only modify themselves
    return this.currentUser.id === userId;
  }

  canViewTeamAnalytics(teamId) {
    if (!this.currentUser) return false;
    
    const team = this.teams.get(teamId);
    if (!team) return false;

    // Admin can view any team
    if (this.currentUser.role === this.roles.ADMIN) return true;
    
    // Team members can view their team
    return team.members.includes(this.currentUser.id);
  }

  // Utility Methods
  generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  generateTeamId() {
    return 'team_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  generateAvatar(name) {
    const colors = ['#4285f4', '#34a853', '#fbbc04', '#ea4335', '#9c27b0', '#ff9800'];
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const color = colors[name.length % colors.length];
    
    return {
      initials,
      backgroundColor: color,
      textColor: '#ffffff'
    };
  }

  // Storage Methods
  loadUsers() {
    const userData = this.storage.get('users', {});
    Object.entries(userData).forEach(([id, user]) => {
      this.users.set(id, user);
    });
  }

  saveUsers() {
    const userData = {};
    this.users.forEach((user, id) => {
      userData[id] = user;
    });
    this.storage.set('users', userData);
  }

  loadTeams() {
    const teamData = this.storage.get('teams', {});
    Object.entries(teamData).forEach(([id, team]) => {
      this.teams.set(id, team);
    });
  }

  saveTeams() {
    const teamData = {};
    this.teams.forEach((team, id) => {
      teamData[id] = team;
    });
    this.storage.set('teams', teamData);
  }

  loadCurrentUser() {
    const currentUserId = this.storage.get('currentUserId');
    if (currentUserId) {
      this.currentUser = this.users.get(currentUserId);
    }
  }

  saveCurrentUser() {
    if (this.currentUser) {
      this.storage.set('currentUserId', this.currentUser.id);
    }
  }

  // Demo Data
  createDemoData() {
    // Create demo users
    const adminUser = this.createUser({
      email: 'admin@company.com',
      name: 'Admin User',
      role: this.roles.ADMIN
    });

    const managerUser = this.createUser({
      email: 'manager@company.com',
      name: 'Team Manager',
      role: this.roles.MANAGER
    });

    const user1 = this.createUser({
      email: 'user1@company.com',
      name: 'John Smith',
      role: this.roles.USER
    });

    const user2 = this.createUser({
      email: 'user2@company.com',
      name: 'Sarah Johnson',
      role: this.roles.USER
    });

    // Create demo team
    this.authenticateUser('admin@company.com');
    const team = this.createTeam({
      name: 'AI Innovation Team',
      description: 'Exploring AI capabilities for business growth'
    });

    // Add users to team
    this.joinTeam(team.id, managerUser.id);
    this.joinTeam(team.id, user1.id);
    this.joinTeam(team.id, user2.id);

    console.log('🎭 Demo data created');
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UserManager;
}