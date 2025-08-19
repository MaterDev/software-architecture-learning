/**
 * Oblique Strategy data model
 * Represents an oblique strategy for creative lesson variation
 */
export class ObliqueStrategy {
  constructor(data) {
    this.id = data.id || 0;
    this.text = data.text || '';
    this.category = data.category || 'general';
    this.integrationPattern = data.integrationPattern || '';
    
    this.validate();
  }

  validate() {
    if (!this.text || typeof this.text !== 'string') {
      throw new Error('ObliqueStrategy must have valid text');
    }
  }

  /**
   * Get formatted strategy text for prompt inclusion
   */
  getFormattedText() {
    return `**Oblique Strategy**: ${this.text}`;
  }

  /**
   * Get integration guidance
   */
  getIntegrationGuidance() {
    return this.integrationPattern || 'Consider this perspective when structuring your lesson.';
  }

  /**
   * Convert to plain object for serialization
   */
  toJSON() {
    return {
      id: this.id,
      text: this.text,
      category: this.category,
      integrationPattern: this.integrationPattern
    };
  }
}
