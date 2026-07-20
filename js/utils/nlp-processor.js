class NLPProcessor {
  constructor() {
    this.intentClassifier = new IntentClassifier();
    this.entityExtractor = new EntityExtractor();
    this.contextManager = new ContextManager();
  }
  
  async processCommand(text) {
    // Preprocessing
    const cleanText = this.preprocessText(text);
    
    // Intent classification
    const intent = await this.intentClassifier.classify(cleanText);
    
    // Entity extraction
    const entities = await this.entityExtractor.extract(cleanText);
    
    // Context resolution
    const context = this.contextManager.resolveContext(intent, entities);
    
    return {
      originalText: text,
      cleanText,
      intent,
      entities,
      context,
      confidence: Math.min(intent.confidence, entities.confidence)
    };
  }
  
  preprocessText(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .replace(/\s+/g, ' ')    // Normalize whitespace
      .trim();
  }
}

class IntentClassifier {
  constructor() {
    this.patterns = {
      'show_usage': [
        /show.*usage/,
        /display.*statistics/,
        /how much.*used/,
        /usage.*report/
      ],
      'log_usage': [
        /log.*usage/,
        /add.*usage/,
        /used.*feature/,
        /increment.*counter/
      ],
      'get_insights': [
        /insights/,
        /recommendations/,
        /suggestions/,
        /what.*should.*do/
      ],
      'set_goal': [
        /set.*goal/,
        /create.*goal/,
        /new.*goal/,
        /goal.*target/
      ],
      'export_data': [
        /export.*data/,
        /download.*report/,
        /save.*data/,
        /backup.*information/
      ]
    };
    this.fallbackIntent = 'unknown';
  }
  
  async classify(text) {
    let bestMatch = {
      intent: this.fallbackIntent,
      confidence: 0
    };
    
    for (const [intent, patterns] of Object.entries(this.patterns)) {
      for (const pattern of patterns) {
        if (pattern.test(text)) {
          const confidence = this.calculatePatternConfidence(text, pattern);
          if (confidence > bestMatch.confidence) {
            bestMatch = { intent, confidence };
          }
        }
      }
    }
    
    return bestMatch;
  }
  
  calculatePatternConfidence(text, pattern) {
    const match = text.match(pattern);
    if (!match) return 0;
    
    // Calculate confidence based on match length and position
    const matchLength = match[0].length;
    const textLength = text.length;
    const position = match.index / textLength;
    
    return (matchLength / textLength) * (1 - position * 0.1);
  }
}

class EntityExtractor {
  constructor() {}

  async extract(text) {
    const entities = [];
    let confidence = 1;

    // Example: Extract feature names
    for (const featureId in CONFIG.features) {
      const feature = CONFIG.features[featureId];
      if (text.includes(feature.name.toLowerCase())) {
        entities.push({ type: 'feature', value: featureId, name: feature.name });
      }
    }

    // Example: Extract numbers (for usage, goals)
    const numbers = text.match(/\d+/g);
    if (numbers) {
      numbers.forEach(num => entities.push({ type: 'number', value: parseInt(num) }));
    }

    // Example: Extract time periods
    if (text.includes('daily')) entities.push({ type: 'period', value: 'daily' });
    if (text.includes('weekly')) entities.push({ type: 'period', value: 'weekly' });
    if (text.includes('monthly')) entities.push({ type: 'period', value: 'monthly' });

    return { confidence, entities };
  }
}

class ContextManager {
  constructor() {}

  resolveContext(intent, entities) {
    const context = {};

    // Based on intent, populate context
    if (intent.intent === 'log_usage') {
      const featureEntity = entities.find(e => e.type === 'feature');
      const numberEntity = entities.find(e => e.type === 'number');
      if (featureEntity) context.featureId = featureEntity.value;
      if (numberEntity) context.usageCount = numberEntity.value;
    } else if (intent.intent === 'set_goal') {
      const featureEntity = entities.find(e => e.type === 'feature');
      const numberEntity = entities.find(e => e.type === 'number');
      const periodEntity = entities.find(e => e.type === 'period');
      if (featureEntity) context.featureId = featureEntity.value;
      if (numberEntity) context.target = numberEntity.value;
      if (periodEntity) context.period = periodEntity.value;
    }

    return context;
  }
}