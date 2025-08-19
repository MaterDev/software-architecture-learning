/**
 * Cycle Domain Model
 */
let cycleCounter = 0;

/**
 * Cycle data model
 * Represents a complete learning cycle with multiple stages
 */
import { Stage } from './Stage.js';

export class Cycle {
  constructor(data) {
    this.id = data.id || `cycle-${Date.now()}-${++cycleCounter}`;
    this.timestamp = data.timestamp || Date.now();
    this.context = data.context || {};
    this.complexity = data.complexity || 'intermediate';
    this.obliqueStrategy = data.obliqueStrategy || null;
    this.stages = this.processStages(data.stages || []);
    this.metadata = data.metadata || {};
    
    // Ensure all stages have required properties
    this.stages = this.stages.map(stage => {
      if (!stage.hashtags) {
        stage.hashtags = ['#software-architecture', '#learning'];
      }
      return stage;
    });
    
    this.validate();
  }

  validate() {
    if (!this.id || typeof this.id !== 'string') {
      throw new Error('Cycle must have a valid ID');
    }
    
    if (!Array.isArray(this.stages) || this.stages.length === 0) {
      throw new Error('Cycle must have at least one stage');
    }
    
    const validComplexities = ['beginner', 'intermediate', 'advanced'];
    if (!validComplexities.includes(this.complexity)) {
      throw new Error(`Invalid complexity level: ${this.complexity}`);
    }
  }

  processStages(stages) {
    if (!Array.isArray(stages)) {
      return [];
    }
    return stages
      .filter(stage => stage != null)
      .map(stage => {
        if (stage instanceof Stage) {
          return stage;
        }
        return new Stage(stage);
      });
  }

  /**
   * Get stage by name
   */
  getStage(stageName) {
    return this.stages.find(stage => stage.stage === stageName);
  }

  /**
   * Get all stage names
   */
  getStageNames() {
    return this.stages.map(stage => stage.stage);
  }

  /**
   * Get total word count across all stages
   */
  getTotalWordCount() {
    return this.stages.reduce((total, stage) => total + stage.getWordCount(), 0);
  }

  /**
   * Get estimated total reading time
   */
  getTotalReadingTime() {
    return this.stages.reduce((total, stage) => total + stage.getEstimatedReadingTime(), 0);
  }

  /**
   * Get all unique hashtags across stages
   */
  getAllHashtags() {
    const allHashtags = this.stages
      .filter(stage => stage && stage.hashtags)
      .flatMap(stage => stage.hashtags);
    return [...new Set(allHashtags)];
  }

  /**
   * Get all concepts used across stages
   */
  getAllConcepts() {
    const allConcepts = this.stages.flatMap(stage => stage.conceptsUsed);
    return [...new Set(allConcepts)];
  }

  /**
   * Check if cycle has oblique strategy
   */
  hasObliqueStrategy() {
    return this.obliqueStrategy !== null;
  }

  /**
   * Get cycle summary
   */
  getSummary() {
    return {
      id: this.id,
      context: typeof this.context === 'object' ? this.context.name : this.context,
      complexity: this.complexity,
      stageCount: this.stages.length,
      totalWords: this.getTotalWordCount(),
      readingTime: this.getTotalReadingTime(),
      uniqueHashtags: this.getAllHashtags().length,
      uniqueConcepts: this.getAllConcepts().length,
      hasObliqueStrategy: this.hasObliqueStrategy(),
      timestamp: this.timestamp
    };
  }

  /**
   * Convert to plain object for serialization
   */
  toJSON() {
    return {
      id: this.id,
      timestamp: this.timestamp,
      context: this.context,
      complexity: this.complexity,
      obliqueStrategy: this.obliqueStrategy,
      stages: this.stages.map(stage => stage.toJSON()),
      metadata: this.metadata
    };
  }
}
