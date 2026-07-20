class CommandRouter {
  constructor(app) {
    this.app = app;
    this.commands = new Map();
    this.setupCommands();
  }
  
  setupCommands() {
    this.commands.set('show_usage', new ShowUsageCommand(this.app));
    this.commands.set('log_usage', new LogUsageCommand(this.app));
    this.commands.set('get_insights', new GetInsightsCommand(this.app));
    this.commands.set('set_goal', new SetGoalCommand(this.app));
    this.commands.set('export_data', new ExportDataCommand(this.app));
  }
  
  async executeCommand(processedCommand) {
    const { intent, entities, context } = processedCommand;
    
    const command = this.commands.get(intent.intent);
    if (!command) {
      return {
        success: false,
        message: "I'm sorry, I didn't understand that command.",
        shouldSpeak: true
      };
    }
    
    try {
      const result = await command.execute(entities, context);
      return {
        success: true,
        message: result.message,
        data: result.data,
        shouldSpeak: result.shouldSpeak || true
      };
    } catch (error) {
      console.error('Command execution error:', error);
      return {
        success: false,
        message: "I encountered an error while processing your request.",
        shouldSpeak: true
      };
    }
  }
}

// Placeholder Command Classes
class ShowUsageCommand {
  constructor(app) { this.app = app; }
  async execute(entities, context) {
    this.app.switchView('analytics');
    return { message: "Showing your usage statistics.", shouldSpeak: true };
  }
}

class LogUsageCommand {
  constructor(app) { this.app = app; }
  async execute(entities, context) {
    // Example: extract featureId and amount from entities
    const featureId = entities.featureId || 'geminiPro'; // Default
    const amount = entities.amount || 1;
    this.app.logUsage(featureId, amount);
    return { message: `Logged ${amount} use of ${featureId}.`, shouldSpeak: true };
  }
}

class GetInsightsCommand {
  constructor(app) { this.app = app; }
  async execute(entities, context) {
    this.app.switchView('analytics');
    return { message: "Here are some insights and recommendations.", shouldSpeak: true };
  }
}

class SetGoalCommand {
  constructor(app) { this.app = app; }
  async execute(entities, context) {
    this.app.showGoalModal();
    return { message: "Opening the goal creation form.", shouldSpeak: true };
  }
}

class ExportDataCommand {
  constructor(app) { this.app = app; }
  async execute(entities, context) {
    this.app.exportData();
    return { message: "Exporting your data now.", shouldSpeak: true };
  }
}