/**
 * Mock templates for testing
 */
export const mockTemplateData = {
  lessonFormats: {
    conceptExploration: {
      description: "Deep dive into architectural concepts",
      structure: [
        "## Concept Overview",
        "## Why This Matters",
        "## Core Principles",
        "## Real-World Examples"
      ],
      instructionalGuidance: "Guide the reader through systematic exploration of {concept} in {context}, providing a reusable framework they can apply to similar {decisionType}.",
      adaptationInstructions: "Adapt examples to {domain} context"
    },
    tradeoffAnalysis: {
      description: "Systematic analysis of architectural trade-offs",
      structure: [
        "## The Decision Context",
        "## Available Options",
        "## Trade-off Matrix",
        "## Decision Framework"
      ],
      instructionalGuidance: "Create a systematic framework for analyzing {decisionType} in {context}.",
      adaptationInstructions: "Focus on {domain} specific constraints"
    }
  },
  roleInstructions: {
    expertEngineer: {
      focus: "Technical implementation and deep architectural understanding",
      tone: "Detailed and implementation-focused"
    },
    systemDesigner: {
      focus: "System-wide design decisions and architectural patterns",
      tone: "Strategic and design-oriented"
    }
  }
};

export const mockLessonTemplate = {
  key: "conceptExploration",
  description: "Deep dive into architectural concepts",
  structure: [
    "## Concept Overview",
    "## Why This Matters",
    "## Core Principles",
    "## Real-World Examples"
  ],
  instructionalGuidance: "Guide the reader through systematic exploration of concepts.",
  adaptationInstructions: "Adapt examples to domain context",
  deliverables: {
    beginner: {
      expertEngineer: ["Basic implementation example", "Key principles summary"]
    }
  }
};
