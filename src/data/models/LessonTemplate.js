/**
 * Lesson Template data model
 * Represents a lesson template with structure and guidance
 */
export class LessonTemplate {
  constructor(data) {
    this.key = data.key || '';
    this.description = data.description || '';
    this.structure = Array.isArray(data.structure) ? data.structure : [];
    this.instructionalGuidance = data.instructionalGuidance || '';
    this.adaptationInstructions = data.adaptationInstructions || '';
    this.deliverables = data.deliverables || {};
    
    this.validate();
  }

  validate() {
    if (!this.key || typeof this.key !== 'string') {
      throw new Error('LessonTemplate must have a valid key');
    }
    
    if (!Array.isArray(this.structure) || this.structure.length === 0) {
      throw new Error('LessonTemplate must have a valid structure array');
    }
  }

  /**
   * Get structure as formatted string
   */
  getStructureString() {
    return this.structure.join('\n');
  }

  /**
   * Get deliverables for specific complexity and role
   */
  getDeliverables(complexity, role) {
    const complexityDeliverables = this.deliverables[complexity] || {};
    return complexityDeliverables[role] || [];
  }

  /**
   * Check if template is suitable for concepts
   */
  isSuitableFor() {
    // This could be enhanced with more sophisticated matching logic
    return true;
  }

  /**
   * Convert to plain object for serialization
   */
  toJSON() {
    return {
      key: this.key,
      description: this.description,
      structure: this.structure,
      instructionalGuidance: this.instructionalGuidance,
      adaptationInstructions: this.adaptationInstructions,
      deliverables: this.deliverables
    };
  }
}
