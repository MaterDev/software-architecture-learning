/**
 * Stage data model
 * Represents a learning stage with prompt and metadata
 */
export class Stage {
  constructor(data) {
    this.stage = data.stage || '';
    this.prompt = data.prompt || '';
    this.hashtags = Array.isArray(data.hashtags) ? data.hashtags : [];
    this.context = data.context || '';
    this.complexity = data.complexity || 'intermediate';
    this.lessonType = data.lessonType || '';
    this.conceptsUsed = Array.isArray(data.conceptsUsed) ? data.conceptsUsed : [];
    this.timestamp = data.timestamp || Date.now();
    
    this.validate();
  }

  validate() {
    if (!this.stage || typeof this.stage !== 'string') {
      throw new Error('Stage must have a valid stage name');
    }
    
    if (!this.prompt || typeof this.prompt !== 'string') {
      throw new Error('Stage must have a valid prompt');
    }
    
    const validComplexities = ['beginner', 'intermediate', 'advanced'];
    if (!validComplexities.includes(this.complexity)) {
      throw new Error(`Invalid complexity level: ${this.complexity}`);
    }
  }

  /**
   * Get stage role key for programmatic use
   */
  getRoleKey() {
    const roleMapping = {
      'Expert Engineer': 'expertEngineer',
      'System Designer': 'systemDesigner',
      'Leader': 'leader',
      'Review & Synthesis': 'reviewSynthesis'
    };
    return roleMapping[this.stage] || 'expertEngineer';
  }

  /**
   * Check if stage is educational meta-prompt
   */
  isMetaPrompt() {
    return this.prompt.includes('Educational Lesson Generation Prompt');
  }

  /**
   * Get word count of prompt
   */
  getWordCount() {
    return this.prompt.split(/\s+/).length;
  }

  /**
   * Get estimated reading time in minutes
   */
  getEstimatedReadingTime() {
    const wordsPerMinute = 200;
    return Math.ceil(this.getWordCount() / wordsPerMinute);
  }

  /**
   * Convert to plain object for serialization
   */
  toJSON() {
    return {
      stage: this.stage,
      prompt: this.prompt,
      hashtags: this.hashtags,
      context: this.context,
      complexity: this.complexity,
      lessonType: this.lessonType,
      conceptsUsed: this.conceptsUsed,
      timestamp: this.timestamp
    };
  }
}
