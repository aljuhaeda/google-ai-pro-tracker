// Google AI Pro Features Configuration
const CONFIG = {
  features: {
    veo: {
      id: "veo",
      name: "Veo Video Generation",
      icon: "🎬",
      category: "creative",
      description: "AI-powered video generation with cinematic quality",
      quotas: { pro: { monthly: 100, daily: 10 } },
      estimatedValue: 50,
      tips: [
        "Use specific camera movements in prompts",
        "Experiment with different artistic styles",
        "Combine multiple shots for longer videos",
      ],
    },
    imagen3: {
      id: "imagen3",
      name: "Imagen 3 Image Generation",
      icon: "🎨",
      category: "creative",
      description: "Photorealistic AI image generation",
      quotas: { pro: { monthly: 1000, daily: 50 } },
      estimatedValue: 30,
      tips: [
        "Be specific with lighting descriptions",
        "Use aspect ratio parameters",
        "Include composition details",
      ],
    },
    geminiPro: {
      id: "geminiPro",
      name: "Gemini Pro Chat",
      icon: "💬",
      category: "productivity",
      description: "Advanced conversational AI with extended context",
      quotas: { pro: { monthly: 1000, daily: 100 } },
      estimatedValue: 20,
      tips: [
        "Provide clear context and background",
        "Break complex tasks into steps",
        "Use follow-up questions effectively",
      ],
    },
    musicAI: {
      id: "musicAI",
      name: "Music AI Generation",
      icon: "🎵",
      category: "creative",
      description: "AI-powered music composition",
      quotas: { pro: { monthly: 50, daily: 5 } },
      estimatedValue: 25,
      tips: [
        "Specify genre and mood clearly",
        "Use tempo and key signatures",
        "Describe instrumentation",
      ],
    },
    codeGeneration: {
      id: "codeGeneration",
      name: "Code Generation",
      icon: "💻",
      category: "development",
      description: "AI-assisted code generation and debugging",
      quotas: { pro: { monthly: 2000, daily: 200 } },
      estimatedValue: 40,
      tips: [
        "Provide clear requirements",
        "Specify programming language",
        "Include context and constraints",
      ],
    },
    workspaceAI: {
      id: "workspaceAI",
      name: "Google Workspace AI",
      icon: "📊",
      category: "productivity",
      description: "Enhanced AI features in Gmail, Docs, Sheets",
      quotas: { pro: { monthly: 500, daily: 50 } },
      estimatedValue: 35,
      tips: [
        "Use AI writing assistance",
        "Generate data insights",
        "Create presentation outlines",
      ],
    },
    multimodal: {
      id: "multimodal",
      name: "Multimodal Processing",
      icon: "🔍",
      category: "analysis",
      description: "Combined text, image, video analysis",
      quotas: { pro: { monthly: 200, daily: 20 } },
      estimatedValue: 45,
      tips: [
        "Combine multiple media types",
        "Ask specific analysis questions",
        "Extract structured data",
      ],
    },
  },

  reminders: {
    templates: {
      daily: [
        "Time to create something amazing with {feature}! {icon}",
        "Your daily {feature} inspiration awaits",
        "Don't let your {feature} quota go unused today",
      ],
      quota: [
        "⚠️ You've used {percentage}% of your {feature} quota",
        "Quota alert: {remaining} {feature} uses left this month",
      ],
    },
  },

  storage: {
    keys: {
      usage: "aiProTracker_usage",
      settings: "aiProTracker_settings",
    },
  },
};

const VoiceConfig = {
  recognition: {
    language: 'en-US',
    continuous: true,
    interimResults: true,
    maxAlternatives: 3
  },
  synthesis: {
    voice: 'en-US-Neural2-A',
    rate: 1.0,
    pitch: 1.0,
    volume: 0.8
  },
  commands: {
    wakeWords: ['hey tracker', 'ai assistant', 'google tracker'],
    timeoutMs: 5000,
    confidenceThreshold: 0.7
  }
};
// --- END IGNORE ---
// --- END IGNORE ---
