// Phase 5.2: Google Workspace Integration
class GoogleWorkspaceIntegration {
  constructor(storage, analytics) {
    this.storage = storage;
    this.analytics = analytics;
    this.isAuthenticated = false;
    this.accessToken = null;
    this.integrations = {
      gmail: false,
      drive: false,
      calendar: false,
      meet: false
    };
    this.init();
  }

  init() {
    this.loadAuthState();
    this.initializeGoogleAPI();
    console.log('🔗 Google Workspace Integration initialized');
  }

  // Authentication
  async authenticateWithGoogle() {
    try {
      // Initialize Google API client
      await this.loadGoogleAPI();
      
      const authInstance = gapi.auth2.getAuthInstance();
      const user = await authInstance.signIn({
        scope: 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/calendar.readonly'
      });

      this.accessToken = user.getAuthResponse().access_token;
      this.isAuthenticated = true;
      this.saveAuthState();

      console.log('✅ Google Workspace authenticated');
      return true;
    } catch (error) {
      console.error('❌ Google Workspace authentication failed:', error);
      return false;
    }
  }

  async loadGoogleAPI() {
    return new Promise((resolve, reject) => {
      if (typeof gapi !== 'undefined') {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        gapi.load('auth2:client', () => {
          gapi.client.init({
            apiKey: 'YOUR_API_KEY', // Replace with actual API key
            clientId: 'YOUR_CLIENT_ID', // Replace with actual client ID
            discoveryDocs: [
              'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest',
              'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
              'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
            ],
            scope: 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/calendar.readonly'
          }).then(resolve, reject);
        });
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Gmail Integration
  async enableGmailIntegration() {
    if (!this.isAuthenticated) {
      await this.authenticateWithGoogle();
    }

    try {
      this.integrations.gmail = true;
      this.saveIntegrationState();
      
      // Start monitoring Gmail for AI-related emails
      this.startGmailMonitoring();
      
      console.log('📧 Gmail integration enabled');
      return true;
    } catch (error) {
      console.error('❌ Gmail integration failed:', error);
      return false;
    }
  }

  async startGmailMonitoring() {
    // Monitor for AI-related emails and extract usage insights
    try {
      const response = await gapi.client.gmail.users.messages.list({
        userId: 'me',
        q: 'from:noreply@google.com OR subject:"AI" OR subject:"Gemini" OR subject:"usage"',
        maxResults: 50
      });

      const messages = response.result.messages || [];
      
      for (const message of messages.slice(0, 10)) { // Process last 10 messages
        const messageData = await gapi.client.gmail.users.messages.get({
          userId: 'me',
          id: message.id
        });

        this.processGmailMessage(messageData.result);
      }

      console.log(`📧 Processed ${messages.length} Gmail messages`);
    } catch (error) {
      console.error('❌ Gmail monitoring error:', error);
    }
  }

  processGmailMessage(message) {
    const headers = message.payload.headers;
    const subject = headers.find(h => h.name === 'Subject')?.value || '';
    const from = headers.find(h => h.name === 'From')?.value || '';
    const date = new Date(parseInt(message.internalDate));

    // Extract AI usage information from email content
    if (subject.includes('usage') || subject.includes('quota')) {
      const insight = {
        type: 'email_insight',
        source: 'gmail',
        subject,
        from,
        date: date.toISOString(),
        extractedData: this.extractUsageFromEmail(message)
      };

      this.analytics.addInsight(insight);
    }
  }

  extractUsageFromEmail(message) {
    // Extract usage data from email body
    const body = this.getEmailBody(message);
    const usagePattern = /(\d+)\s*(requests?|queries?|tokens?)/gi;
    const matches = body.match(usagePattern) || [];
    
    return {
      mentions: matches,
      hasUsageData: matches.length > 0,
      timestamp: new Date().toISOString()
    };
  }

  // Google Drive Integration
  async enableDriveIntegration() {
    if (!this.isAuthenticated) {
      await this.authenticateWithGoogle();
    }

    try {
      this.integrations.drive = true;
      this.saveIntegrationState();
      
      // Scan Drive for AI-related files
      this.scanDriveForAIFiles();
      
      console.log('💾 Google Drive integration enabled');
      return true;
    } catch (error) {
      console.error('❌ Drive integration failed:', error);
      return false;
    }
  }

  async scanDriveForAIFiles() {
    try {
      const response = await gapi.client.drive.files.list({
        q: 'name contains "AI" or name contains "Gemini" or name contains "ChatGPT" or name contains "ML"',
        fields: 'files(id,name,mimeType,createdTime,modifiedTime,size)',
        orderBy: 'modifiedTime desc',
        pageSize: 100
      });

      const files = response.result.files || [];
      
      const aiFiles = files.map(file => ({
        id: file.id,
        name: file.name,
        type: file.mimeType,
        created: file.createdTime,
        modified: file.modifiedTime,
        size: file.size,
        category: this.categorizeAIFile(file.name)
      }));

      this.storage.set('driveAIFiles', aiFiles);
      
      // Generate insights from file patterns
      this.generateDriveInsights(aiFiles);
      
      console.log(`💾 Found ${aiFiles.length} AI-related files in Drive`);
      return aiFiles;
    } catch (error) {
      console.error('❌ Drive scan error:', error);
      return [];
    }
  }

  categorizeAIFile(filename) {
    const name = filename.toLowerCase();
    if (name.includes('prompt') || name.includes('query')) return 'prompts';
    if (name.includes('result') || name.includes('output')) return 'outputs';
    if (name.includes('model') || name.includes('train')) return 'models';
    if (name.includes('data') || name.includes('dataset')) return 'datasets';
    return 'other';
  }

  generateDriveInsights(files) {
    const categories = {};
    files.forEach(file => {
      categories[file.category] = (categories[file.category] || 0) + 1;
    });

    const insight = {
      type: 'drive_analysis',
      source: 'google_drive',
      timestamp: new Date().toISOString(),
      data: {
        totalFiles: files.length,
        categories,
        recentActivity: files.filter(f => {
          const modified = new Date(f.modified);
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          return modified > weekAgo;
        }).length
      }
    };

    this.analytics.addInsight(insight);
  }

  // Google Calendar Integration
  async enableCalendarIntegration() {
    if (!this.isAuthenticated) {
      await this.authenticateWithGoogle();
    }

    try {
      this.integrations.calendar = true;
      this.saveIntegrationState();
      
      // Analyze calendar for AI-related events
      this.analyzeCalendarEvents();
      
      console.log('📅 Google Calendar integration enabled');
      return true;
    } catch (error) {
      console.error('❌ Calendar integration failed:', error);
      return false;
    }
  }

  async analyzeCalendarEvents() {
    try {
      const now = new Date();
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const response = await gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: monthAgo.toISOString(),
        timeMax: now.toISOString(),
        q: 'AI OR machine learning OR ML OR Gemini OR ChatGPT OR automation',
        singleEvents: true,
        orderBy: 'startTime'
      });

      const events = response.result.items || [];
      
      const aiEvents = events.map(event => ({
        id: event.id,
        title: event.summary,
        start: event.start.dateTime || event.start.date,
        end: event.end.dateTime || event.end.date,
        description: event.description || '',
        attendees: event.attendees?.length || 0
      }));

      this.storage.set('calendarAIEvents', aiEvents);
      this.generateCalendarInsights(aiEvents);
      
      console.log(`📅 Found ${aiEvents.length} AI-related calendar events`);
      return aiEvents;
    } catch (error) {
      console.error('❌ Calendar analysis error:', error);
      return [];
    }
  }

  generateCalendarInsights(events) {
    const insight = {
      type: 'calendar_analysis',
      source: 'google_calendar',
      timestamp: new Date().toISOString(),
      data: {
        totalEvents: events.length,
        averageAttendees: events.reduce((sum, e) => sum + e.attendees, 0) / events.length || 0,
        timeSpent: this.calculateTimeSpent(events),
        trends: this.analyzeEventTrends(events)
      }
    };

    this.analytics.addInsight(insight);
  }

  calculateTimeSpent(events) {
    return events.reduce((total, event) => {
      const start = new Date(event.start);
      const end = new Date(event.end);
      return total + (end - start) / (1000 * 60 * 60); // Convert to hours
    }, 0);
  }

  analyzeEventTrends(events) {
    const weeklyCount = {};
    events.forEach(event => {
      const week = this.getWeekNumber(new Date(event.start));
      weeklyCount[week] = (weeklyCount[week] || 0) + 1;
    });

    return {
      weeklyDistribution: weeklyCount,
      peakWeek: Object.keys(weeklyCount).reduce((a, b) => 
        weeklyCount[a] > weeklyCount[b] ? a : b
      )
    };
  }

  // Google Meet Integration
  async enableMeetIntegration() {
    try {
      this.integrations.meet = true;
      this.saveIntegrationState();
      
      // Note: Google Meet API is limited, so we'll track through calendar events
      console.log('🎥 Google Meet integration enabled (via Calendar)');
      return true;
    } catch (error) {
      console.error('❌ Meet integration failed:', error);
      return false;
    }
  }

  // Data Export Methods
  async exportWorkspaceData() {
    const data = {
      gmail: this.integrations.gmail ? this.storage.get('gmailInsights', []) : null,
      drive: this.integrations.drive ? this.storage.get('driveAIFiles', []) : null,
      calendar: this.integrations.calendar ? this.storage.get('calendarAIEvents', []) : null,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `workspace-ai-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    console.log('📊 Workspace data exported');
  }

  // Utility Methods
  getEmailBody(message) {
    if (message.payload.body.data) {
      return atob(message.payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
    }
    
    if (message.payload.parts) {
      for (const part of message.payload.parts) {
        if (part.mimeType === 'text/plain' && part.body.data) {
          return atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/'));
        }
      }
    }
    
    return '';
  }

  getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  }

  // Storage Methods
  loadAuthState() {
    this.isAuthenticated = this.storage.get('workspaceAuthenticated', false);
    this.accessToken = this.storage.get('workspaceAccessToken', null);
  }

  saveAuthState() {
    this.storage.set('workspaceAuthenticated', this.isAuthenticated);
    this.storage.set('workspaceAccessToken', this.accessToken);
  }

  loadIntegrationState() {
    this.integrations = this.storage.get('workspaceIntegrations', this.integrations);
  }

  saveIntegrationState() {
    this.storage.set('workspaceIntegrations', this.integrations);
  }

  initializeGoogleAPI() {
    // Load Google API script if not already loaded
    if (typeof gapi === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }

  // Public API
  getIntegrationStatus() {
    return {
      isAuthenticated: this.isAuthenticated,
      integrations: { ...this.integrations }
    };
  }

  async disableIntegration(service) {
    this.integrations[service] = false;
    this.saveIntegrationState();
    console.log(`❌ ${service} integration disabled`);
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GoogleWorkspaceIntegration;
}