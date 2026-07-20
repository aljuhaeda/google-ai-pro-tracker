class VoiceInterface {
  constructor(app) {
    this.app = app;
    this.recognition = null;
    this.synthesis = null;
    this.nlpProcessor = new NLPProcessor();
    this.commandRouter = new CommandRouter(app);
    this.isListening = false;
    this.currentSession = null;
  }
  
  async init() {
    await this.initializeSpeechRecognition();
    await this.initializeSpeechSynthesis();
    await this.setupVoiceCommands();
    this.startWakeWordDetection();
    console.log('🎤 Voice Interface initialized');
  }
  
  async initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new webkitSpeechRecognition();
    } else if ('SpeechRecognition' in window) {
      this.recognition = new SpeechRecognition();
    } else {
      throw new Error('Speech recognition not supported');
    }
    
    this.recognition.continuous = VoiceConfig.recognition.continuous;
    this.recognition.interimResults = VoiceConfig.recognition.interimResults;
    this.recognition.lang = VoiceConfig.recognition.language;
    
    this.recognition.onresult = this.handleSpeechResult.bind(this);
    this.recognition.onerror = this.handleSpeechError.bind(this);
    this.recognition.onend = this.handleSpeechEnd.bind(this);
  }

  async initializeSpeechSynthesis() {
    this.synthesis = new SpeechSynthesis();
  }

  async setupVoiceCommands() {
    // Example: Add a command to show usage statistics
    this.commandRouter.addCommand('show_usage', async (command) => {
      const totalUsage = Array.from(this.app.data.usage.values()).reduce((sum, usage) => sum + usage.totalUsed, 0);
      return { message: `You have used AI Pro features ${totalUsage} times.`, shouldSpeak: true };
    });

    // Example: Add a command to log usage for a feature
    this.commandRouter.addCommand('log_usage', async (command) => {
      const featureId = command.context.featureId;
      const usageCount = command.context.usageCount || 1;
      if (featureId) {
        this.app.logUsage(featureId, usageCount);
        return { message: `Logged ${usageCount} use for ${CONFIG.features[featureId].name}.`, shouldSpeak: true };
      } else {
        return { message: "Please specify which feature to log usage for.", shouldSpeak: true };
      }
    });

    // Example: Add a command to get recommendations
    this.commandRouter.addCommand('get_insights', async (command) => {
      const recommendations = this.app.aiIntelligence.generateAdaptiveRecommendations();
      if (recommendations.length > 0) {
        const message = "Here are some recommendations: " + recommendations.map(r => r.title).join(", ") + ".";
        return { message, shouldSpeak: true };
      } else {
        return { message: "I don't have specific recommendations right now.", shouldSpeak: true };
      }
    });

    // Example: Add a command to set a goal
    this.commandRouter.addCommand('set_goal', async (command) => {
      const featureId = command.context.featureId;
      const target = command.context.target;
      const period = command.context.period;
      if (featureId && target && period) {
        // Assuming app.goals.addGoal exists
        this.app.goals.addGoal({ featureId, target, period });
        return { message: `Goal set: ${target} ${period} uses for ${CONFIG.features[featureId].name}.`, shouldSpeak: true };
      } else {
        return { message: "Please specify the feature, target, and period for the goal.", shouldSpeak: true };
      }
    });

    // Fallback for unknown commands
    this.commandRouter.addCommand('unknown', async (command) => {
      return { message: "I didn't understand that command. Can you rephrase?", shouldSpeak: true };
    });
  }

  startWakeWordDetection() {
    // This is a placeholder for a more advanced wake word detection system.
    // In a real application, this would involve a continuously running audio processing
    // that triggers speech recognition only when a specific wake word is detected.
    // For this example, we'll simulate it by starting recognition on a button click.
    console.log('Wake word detection started (simulated).');
  }
  
  async handleSpeechResult(event) {
    const result = event.results[event.results.length - 1];
    const transcript = result[0].transcript.trim();
    const confidence = result[0].confidence;
    
    if (confidence >= VoiceConfig.commands.confidenceThreshold) {
      const command = await this.nlpProcessor.processCommand(transcript);
      const response = await this.commandRouter.executeCommand(command);
      
      if (response.shouldSpeak) {
        this.synthesis.speak(response.message);
      }
      
      this.updateUI(transcript, response);
    }
  }

  handleSpeechError(event) {
    console.error('Speech recognition error:', event.error);
  }

  handleSpeechEnd() {
    this.isListening = false;
  }

  updateUI(transcript, response) {
    const transcriptElement = document.getElementById('voiceTranscript');
    const statusElement = document.getElementById('voiceStatus');

    if (transcriptElement) {
      transcriptElement.textContent = `You said: "${transcript}"`;
    }
    if (statusElement) {
      statusElement.textContent = `AI Assistant: ${response.message}`;
    }
  }
}