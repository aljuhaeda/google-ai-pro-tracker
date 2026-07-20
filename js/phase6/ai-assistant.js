class AIAssistant {
  constructor(app) {
    this.app = app;
    this.conversationalEngine = new ConversationalEngine();
    this.history = [];
  }

  async processQuery(query) {
    const context = await this.app.aiIntelligence.analyzeContext();
    const response = await this.conversationalEngine.generateResponse(query, context, this.history);
    this.history.push({ query, response });
    return response;
  }
}

class ConversationalEngine {
  constructor() {}

  async generateResponse(query, context, history) {
    query = query.toLowerCase();
    let response = { message: "I am an AI Assistant. How can I help you?" };

    if (query.includes("hello") || query.includes("hi")) {
      response.message = "Hello! How can I assist you today?";
    } else if (query.includes("usage")) {
      const totalUsage = Array.from(this.app.data.usage.values()).reduce((sum, usage) => sum + usage.totalUsed, 0);
      response.message = `You have a total of ${totalUsage} uses across all features.`;
    } else if (query.includes("recommend")) {
      const recommendations = this.app.aiIntelligence.generateAdaptiveRecommendations();
      if (recommendations.length > 0) {
        response.message = "Here are some recommendations: " + recommendations.map(r => r.title).join(", ") + ".";
      } else {
        response.message = "I don't have specific recommendations right now, but keep using the app to get personalized insights!";
      }
    } else if (query.includes("stress") && context && context.analysis.stress > 0.5) {
      response.message = "It seems you might be under some stress. Remember to take breaks and prioritize your tasks.";
    } else {
      response.message = "I'm not sure how to respond to that. Can you rephrase your question?";
    }

    return response;
  }
}