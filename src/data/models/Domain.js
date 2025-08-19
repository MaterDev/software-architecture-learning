/**
 * Domain data model
 * Represents a problem/domain area with workflows, KPIs, constraints and scenarios
 */
export class Domain {
  constructor(data = {}) {
    this.name = data.name || '';
    this.description = data.description || '';
    this.characteristics = Array.isArray(data.characteristics) ? data.characteristics : [];
    this.workflows = Array.isArray(data.workflows) ? data.workflows : [];
    this.kpis = Array.isArray(data.kpis) ? data.kpis : [];
    this.constraints = Array.isArray(data.constraints) ? data.constraints : [];
    this.stakeholders = Array.isArray(data.stakeholders) ? data.stakeholders : [];
    this.scenarios = Array.isArray(data.scenarios) ? data.scenarios : [];

    this.validate();
  }

  validate() {
    if (!this.name || typeof this.name !== 'string') {
      throw new Error('Domain must have a valid name');
    }
  }

  getHashtags(maxCount = 6) {
    const tags = [];
    if (this.name) tags.push(`#${String(this.name).toLowerCase().replace(/\s+/g, '-')}`);

    const charTags = (this.characteristics || [])
      .slice(0, 3)
      .filter(Boolean)
      .map(c => `#${String(c).toLowerCase().replace(/\s+/g, '-')}`);
    tags.push(...charTags);

    const constraintTags = (this.constraints || [])
      .slice(0, 2)
      .filter(Boolean)
      .map(c => `#${String(c).toLowerCase().replace(/\s+/g, '-')}`);
    tags.push(...constraintTags);

    return Array.from(new Set(tags)).slice(0, maxCount);
  }

  toJSON() {
    return {
      name: this.name,
      description: this.description,
      characteristics: this.characteristics,
      workflows: this.workflows,
      kpis: this.kpis,
      constraints: this.constraints,
      stakeholders: this.stakeholders,
      scenarios: this.scenarios
    };
  }
}
