/**
 * Technology data model
 * Captures technology characteristics, interfaces and quality attributes
 */
export class Technology {
  constructor(data = {}) {
    this.name = data.name || '';
    this.category = data.category || 'general'; // e.g., language, runtime, framework, protocol, storage, messaging, ops
    this.description = data.description || '';

    this.interfaces = {
      inputs: Array.isArray(data.interfaces?.inputs) ? data.interfaces.inputs : [],
      outputs: Array.isArray(data.interfaces?.outputs) ? data.interfaces.outputs : [],
      protocols: Array.isArray(data.interfaces?.protocols) ? data.interfaces.protocols : []
    };

    this.qualityAttributes = Array.isArray(data.qualityAttributes) ? data.qualityAttributes : [];
    this.constraints = Array.isArray(data.constraints) ? data.constraints : [];
    this.tags = Array.isArray(data.tags) ? data.tags : [];

    this.validate();
  }

  validate() {
    if (!this.name || typeof this.name !== 'string') {
      throw new Error('Technology must have a valid name');
    }
  }

  getHashtags(maxCount = 6) {
    const tags = [];
    if (this.name) tags.push(`#tech-${String(this.name).toLowerCase().replace(/\s+/g, '-')}`);

    const catTag = this.category ? `#cat-${String(this.category).toLowerCase().replace(/\s+/g, '-')}` : null;
    if (catTag) tags.push(catTag);

    const qaTags = (this.qualityAttributes || []).slice(0, 2).map(q => `#${String(q).toLowerCase().replace(/\s+/g, '-')}`);
    tags.push(...qaTags);

    const customTags = (this.tags || []).slice(0, 2).map(t => `#${String(t).toLowerCase().replace(/\s+/g, '-')}`);
    tags.push(...customTags);

    return Array.from(new Set(tags)).slice(0, maxCount);
  }

  toJSON() {
    return {
      name: this.name,
      category: this.category,
      description: this.description,
      interfaces: this.interfaces,
      qualityAttributes: this.qualityAttributes,
      constraints: this.constraints,
      tags: this.tags
    };
  }
}
