/**
 * Template Repository
 * Handles all lesson template data access and selection logic
 */
import lessonTemplates from '../sources/lesson-templates.json';
import { LessonTemplate } from '../models/LessonTemplate.js';

export class TemplateRepository {
  constructor() {
    this.data = lessonTemplates;
    this.formatCache = new Map();
    this.roleInstructionsCache = new Map();
    this.initialized = false;
    this.initializeCache();
  }

  initializeCache() {
    // Cache lesson formats
    Object.entries(this.data.lessonFormats).forEach(([formatKey, formatData]) => {
      const template = new LessonTemplate({
        key: formatKey,
        ...formatData
      });
      this.formatCache.set(formatKey, template);
    });

    // Cache role instructions
    Object.entries(this.data.roleInstructions).forEach(([roleKey, instructions]) => {
      this.roleInstructionsCache.set(roleKey, instructions);
    });
  }

  /**
   * Get all lesson formats
   */
  getAllFormats() {
    return Array.from(this.formatCache.values());
  }

  /**
   * Get lesson format by key
   */
  getFormat(formatKey) {
    return this.formatCache.get(formatKey);
  }

  /**
   * Select appropriate lesson format based on concepts and context
   */
  selectLessonFormat(concepts, context, complexity) {
    // Default lesson format if templates are not available
    const defaultFormat = new LessonTemplate({
      key: 'default',
      description: "Concept exploration and practical application",
      structure: [
        "## Concept Overview",
        "## Why This Matters", 
        "## Core Principles",
        "## Real-World Examples",
        "## Common Pitfalls",
        "## Practical Exercises",
        "## Reflection Questions",
        "## Further Reading"
      ],
      instructionalGuidance: "Create an engaging lesson that helps software engineers understand the concept through concrete examples and hands-on thinking exercises."
    });

    if (this.formatCache.size === 0) {
      return defaultFormat;
    }

    // Simple selection logic with null checks
    if (concepts && Array.isArray(concepts)) {
      if (concepts.some(c => c && c.name && (c.name.includes('trade-off') || c.name.includes('decision')))) {
        return this.getFormat('tradeoffAnalysis') || defaultFormat;
      } else if (concepts.some(c => c && c.category === 'structural')) {
        return this.getFormat('patternStudy') || defaultFormat;
      } else if (complexity === 'beginner') {
        return this.getFormat('conceptExploration') || defaultFormat;
      } else if (concepts.length > 1) {
        return this.getFormat('skillDevelopment') || defaultFormat;
      }
    }
    
    return this.getFormat('conceptExploration') || defaultFormat;
  }

  /**
   * Get role instructions
   */
  getRoleInstructions(roleKey) {
    return this.roleInstructionsCache.get(roleKey);
  }

  /**
   * Get format count for stats
   */
  getFormatCount() {
    return this.formatCache.size;
  }

  /**
   * Get repository statistics
   */
  getStats() {
    return {
      totalFormats: this.formatCache.size,
      formatKeys: Array.from(this.formatCache.keys()),
      roleInstructions: Array.from(this.roleInstructionsCache.keys()).length
    };
  }
}
