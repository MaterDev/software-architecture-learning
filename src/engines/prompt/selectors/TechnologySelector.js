/**
 * TechnologySelector
 * Selects relevant technologies for a domain/context
 */
import { TechnologyRepository } from '../../../data/repositories/TechnologyRepository.js';

export class TechnologySelector {
  constructor({ technologyRepo = null } = {}) {
    this.technologyRepo = technologyRepo || new TechnologyRepository();
  }

  /**
   * Select technologies for a given domain
   * @param {object} domain Domain model or plain object with name/characteristics
   * @param {object} options { limit: number, requiredTags: string[] }
   */
  selectForDomain(domain, options = {}) {
    if (!domain) return [];
    const limit = Number.isFinite(options.limit) ? options.limit : 3;
    const required = (options.requiredTags || []).map(s => String(s).toLowerCase());

    const signals = new Set([
      String(domain.name || '').toLowerCase(),
      ...(domain.characteristics || []).map(s => String(s).toLowerCase())
    ]);

    const candidates = this.technologyRepo.getAllTechnologies();

    const scored = candidates.map(t => {
      const tags = new Set([
        ...(t.tags || []).map(s => String(s).toLowerCase()),
        ...(t.qualityAttributes || []).map(s => String(s).toLowerCase()),
        String(t.category || '').toLowerCase()
      ]);

      // score by overlap with domain signals
      let score = 0;
      signals.forEach(s => { if (tags.has(s)) score += 2; });

      // boost performance/observability/reliability for server-side/devops contexts
      const boost = ['performance', 'observability', 'reliability'];
      boost.forEach(b => { if (signals.has('server-side-development') && tags.has(b)) score += 1; });

      // penalize if required tags are missing
      const missingRequired = required.some(r => !tags.has(r));
      if (missingRequired) score -= 100;

      return { tech: t, score };
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(x => x.tech);
  }
}
