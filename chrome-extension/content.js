// Phase 5.3: Chrome Extension Content Script
class AIPageTracker {
  constructor() {
    this.isTracking = false;
    this.interactions = [];
    this.pageStartTime = Date.now();
    this.lastActivity = Date.now();
    this.init();
  }

  init() {
    this.detectPageType();
    this.setupTracking();
    this.createTrackingUI();
    this.startActivityMonitoring();
    console.log('🔍 AI Page Tracker initialized on:', window.location.hostname);
  }

  detectPageType() {
    const hostname = window.location.hostname;
    
    if (hostname.includes('gemini.google.com')) {
      this.pageType = 'gemini';
      this.setupGeminiTracking();
    } else if (hostname.includes('bard.google.com')) {
      this.pageType = 'bard';
      this.setupBardTracking();
    } else if (hostname.includes('makersuite.google.com')) {
      this.pageType = 'makersuite';
      this.setupMakerSuiteTracking();
    } else if (hostname.includes('openai.com')) {
      this.pageType = 'openai';
      this.setupOpenAITracking();
    } else {
      this.pageType = 'unknown';
      this.setupGenericTracking();
    }
  }

  setupGeminiTracking() {
    // Track Gemini-specific interactions
    this.observeElement('[data-test-id="send-button"]', () => {
      this.trackInteraction('prompt_sent', 'gemini');
    });

    this.observeElement('[data-test-id="response"]', () => {
      this.trackInteraction('response_received', 'gemini');
    });

    // Track conversation length
    this.observeConversationLength('.conversation-turn');
  }

  setupBardTracking() {
    // Track Bard-specific interactions
    this.observeElement('button[aria-label*="Send"]', () => {
      this.trackInteraction('prompt_sent', 'bard');
    });

    this.observeElement('.response-container', () => {
      this.trackInteraction('response_received', 'bard');
    });
  }

  setupMakerSuiteTracking() {
    // Track MakerSuite interactions
    this.observeElement('button[type="submit"]', () => {
      this.trackInteraction('api_call', 'makersuite');
    });

    this.observeElement('.output-panel', () => {
      this.trackInteraction('output_generated', 'makersuite');
    });
  }

  setupOpenAITracking() {
    // Track ChatGPT interactions
    this.observeElement('[data-testid="send-button"]', () => {
      this.trackInteraction('prompt_sent', 'chatgpt');
    });

    this.observeElement('.markdown', () => {
      this.trackInteraction('response_received', 'chatgpt');
    });
  }

  setupGenericTracking() {
    // Generic AI interaction tracking
    const commonSelectors = [
      'button[type="submit"]',
      'input[type="submit"]',
      '.send-button',
      '.submit-button'
    ];

    commonSelectors.forEach(selector => {
      this.observeElement(selector, () => {
        this.trackInteraction('generic_interaction', 'unknown');
      });
    });
  }

  observeElement(selector, callback) {
    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element && !element.hasAttribute('data-tracked')) {
        element.setAttribute('data-tracked', 'true');
        element.addEventListener('click', callback);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Check if element already exists
    const existingElement = document.querySelector(selector);
    if (existingElement && !existingElement.hasAttribute('data-tracked')) {
      existingElement.setAttribute('data-tracked', 'true');
      existingElement.addEventListener('click', callback);
    }
  }

  observeConversationLength(selector) {
    const observer = new MutationObserver(() => {
      const turns = document.querySelectorAll(selector);
      if (turns.length > 0) {
        this.trackInteraction('conversation_turn', this.pageType, {
          turnCount: turns.length
        });
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  trackInteraction(type, service, data = {}) {
    const interaction = {
      type,
      service,
      timestamp: Date.now(),
      url: window.location.href,
      data
    };

    this.interactions.push(interaction);
    this.lastActivity = Date.now();

    // Send to background script
    chrome.runtime.sendMessage({
      type: 'TRACK_INTERACTION',
      data: interaction
    });

    // Update UI
    this.updateTrackingUI();

    console.log('📊 Interaction tracked:', interaction);
  }

  startActivityMonitoring() {
    // Track time spent on page
    setInterval(() => {
      if (document.visibilityState === 'visible') {
        const timeSpent = Date.now() - this.pageStartTime;
        const timeSinceActivity = Date.now() - this.lastActivity;

        // Track session if user is active (activity within last 5 minutes)
        if (timeSinceActivity < 5 * 60 * 1000) {
          this.trackInteraction('session_active', this.pageType, {
            timeSpent: Math.round(timeSpent / 1000),
            timeSinceActivity: Math.round(timeSinceActivity / 1000)
          });
        }
      }
    }, 60000); // Check every minute

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.trackInteraction('page_focus', this.pageType);
      } else {
        this.trackInteraction('page_blur', this.pageType);
      }
    });

    // Track mouse movement and keyboard activity
    let activityTimer;
    const resetActivityTimer = () => {
      clearTimeout(activityTimer);
      activityTimer = setTimeout(() => {
        this.lastActivity = Date.now();
      }, 1000);
    };

    document.addEventListener('mousemove', resetActivityTimer);
    document.addEventListener('keypress', resetActivityTimer);
    document.addEventListener('click', resetActivityTimer);
    document.addEventListener('scroll', resetActivityTimer);
  }

  createTrackingUI() {
    // Create floating tracking indicator
    const indicator = document.createElement('div');
    indicator.id = 'ai-tracker-indicator';
    indicator.innerHTML = `
      <div class="tracker-icon">🤖</div>
      <div class="tracker-info">
        <div class="tracker-count">0</div>
        <div class="tracker-label">interactions</div>
      </div>
      <div class="tracker-toggle">
        <button id="tracker-toggle-btn">⏸️</button>
      </div>
    `;

    // Add styles
    const styles = document.createElement('style');
    styles.textContent = `
      #ai-tracker-indicator {
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(66, 133, 244, 0.9);
        color: white;
        padding: 8px 12px;
        border-radius: 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-size: 12px;
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
        cursor: pointer;
      }

      #ai-tracker-indicator:hover {
        background: rgba(66, 133, 244, 1);
        transform: translateY(-1px);
      }

      #ai-tracker-indicator.inactive {
        background: rgba(128, 128, 128, 0.7);
      }

      .tracker-icon {
        font-size: 16px;
      }

      .tracker-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        line-height: 1;
      }

      .tracker-count {
        font-weight: bold;
        font-size: 14px;
      }

      .tracker-label {
        font-size: 10px;
        opacity: 0.8;
      }

      .tracker-toggle button {
        background: none;
        border: none;
        color: white;
        font-size: 12px;
        cursor: pointer;
        padding: 2px;
      }

      .tracker-details {
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        color: black;
        padding: 12px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        min-width: 200px;
        margin-top: 8px;
        font-size: 12px;
        display: none;
      }

      .tracker-details.show {
        display: block;
      }
    `;

    document.head.appendChild(styles);
    document.body.appendChild(indicator);

    // Add click handlers
    document.getElementById('tracker-toggle-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleTracking();
    });

    indicator.addEventListener('click', () => {
      this.showTrackingDetails();
    });

    this.trackingIndicator = indicator;
  }

  updateTrackingUI() {
    if (this.trackingIndicator) {
      const countElement = this.trackingIndicator.querySelector('.tracker-count');
      countElement.textContent = this.interactions.length;
    }
  }

  toggleTracking() {
    chrome.runtime.sendMessage({ type: 'TOGGLE_TRACKING' }, (response) => {
      this.isTracking = response.isActive;
      
      const indicator = this.trackingIndicator;
      const toggleBtn = document.getElementById('tracker-toggle-btn');
      
      if (this.isTracking) {
        indicator.classList.remove('inactive');
        toggleBtn.textContent = '⏸️';
      } else {
        indicator.classList.add('inactive');
        toggleBtn.textContent = '▶️';
      }
    });
  }

  showTrackingDetails() {
    // Create or toggle details panel
    let details = document.querySelector('.tracker-details');
    
    if (!details) {
      details = document.createElement('div');
      details.className = 'tracker-details';
      this.trackingIndicator.appendChild(details);
    }

    const recentInteractions = this.interactions.slice(-5);
    
    details.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 8px;">Recent Activity</div>
      ${recentInteractions.map(interaction => `
        <div style="margin-bottom: 4px; padding: 4px; background: #f5f5f5; border-radius: 4px;">
          <div style="font-weight: 500;">${interaction.type}</div>
          <div style="font-size: 10px; color: #666;">
            ${new Date(interaction.timestamp).toLocaleTimeString()}
          </div>
        </div>
      `).join('')}
      
      <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee;">
        <button onclick="this.closest('.tracker-details').classList.remove('show')" 
                style="background: #4285f4; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">
          Close
        </button>
      </div>
    `;

    details.classList.toggle('show');
  }

  setupTracking() {
    // Listen for messages from background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'TRACKER_ACTIVE') {
        this.isTracking = message.data.isTracking;
        sendResponse({ received: true });
      }
    });

    // Get initial tracking status
    chrome.runtime.sendMessage({ type: 'GET_STATUS' }, (response) => {
      this.isTracking = response.isActive;
      this.updateTrackingUI();
    });
  }

  // Extract text content for analysis
  extractPageContent() {
    const content = {
      prompts: [],
      responses: [],
      metadata: {
        pageType: this.pageType,
        url: window.location.href,
        timestamp: Date.now()
      }
    };

    // Extract prompts and responses based on page type
    switch (this.pageType) {
      case 'gemini':
        content.prompts = Array.from(document.querySelectorAll('[data-test-id="user-message"]'))
          .map(el => el.textContent.trim());
        content.responses = Array.from(document.querySelectorAll('[data-test-id="bot-message"]'))
          .map(el => el.textContent.trim());
        break;
        
      case 'bard':
        content.prompts = Array.from(document.querySelectorAll('.user-message'))
          .map(el => el.textContent.trim());
        content.responses = Array.from(document.querySelectorAll('.bot-message'))
          .map(el => el.textContent.trim());
        break;
        
      default:
        // Generic extraction
        content.prompts = Array.from(document.querySelectorAll('input[type="text"], textarea'))
          .map(el => el.value.trim())
          .filter(text => text.length > 0);
    }

    return content;
  }
}

// Initialize tracker when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new AIPageTracker();
  });
} else {
  new AIPageTracker();
}