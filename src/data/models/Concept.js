/**
 * Concept data model
 * Represents a software architecture concept with validation and utilities
 */
export class Concept {
  constructor(data) {
    this.name = data.name || '';
    this.category = data.category || 'general';
    this.definition = data.definition || '';
    this.complexity = data.complexity || 'intermediate';
    this.components = Array.isArray(data.components) ? data.components : [];
    this.keyInsights = Array.isArray(data.keyInsights) ? data.keyInsights : [];
    this.relationships = Array.isArray(data.relationships) ? data.relationships : [];
    
    this.validate();
  }

  validate() {
    if (!this.name || typeof this.name !== 'string') {
      throw new Error('Concept must have a valid name');
    }
    
    const validComplexities = ['beginner', 'intermediate', 'advanced'];
    if (!validComplexities.includes(this.complexity)) {
      throw new Error(`Invalid complexity level: ${this.complexity}`);
    }
  }

  /**
   * Check if this concept is relevant to a specific role
   */
  isRelevantToRole(roleKey) {
    const roleConceptMapping = {
      'expertEngineer': ['structural', 'foundational'],
      'systemDesigner': ['qualitative', 'structural', 'foundational'],
      'leader': ['qualitative', 'foundational'],
      'reviewSynthesis': ['qualitative', 'structural', 'foundational']
    };

    const relevantCategories = roleConceptMapping[roleKey] || [];
    return relevantCategories.includes(this.category);
  }

  /**
   * Check if this concept matches a complexity level
   */
  matchesComplexity(targetComplexity) {
    if (this.complexity === targetComplexity) return true;
    if (targetComplexity === 'advanced' && this.complexity === 'intermediate') return true;
    if (targetComplexity === 'beginner') return true; // Allow beginner concepts for all levels
    return false;
  }

  /**
   * Get sanitized hashtag for this concept
   */
  getHashtag() {
    return `#${this.name.replace(/\s+/g, '-')}`;
  }

  /**
   * Get component hashtags
   */
  getComponentHashtags(maxCount = 2) {
    return this.components
      .filter(comp => comp && typeof comp === 'string' && comp.trim().length > 0)
      .slice(0, maxCount)
      .map(comp => `#${comp.replace(/\s+/g, '-').toLowerCase()}`);
  }

  /**
   * Convert to plain object for serialization
   */
  toJSON() {
    return {
      name: this.name,
      category: this.category,
      definition: this.definition,
      complexity: this.complexity,
      components: this.components,
      keyInsights: this.keyInsights,
      relationships: this.relationships
    };
  }
}
