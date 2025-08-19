/**
 * ContextEnricher
 * Builds enriched prompt context from domain + technology selection
 */
import { DomainRepository } from '../../../data/repositories/DomainRepository.js';
import { TechnologySelector } from '../selectors/TechnologySelector.js';

export class ContextEnricher {
  constructor({ domainRepo = null, technologySelector = null } = {}) {
    this.domainRepo = domainRepo || new DomainRepository();
    this.technologySelector = technologySelector || new TechnologySelector();
  }

  /**
   * Enrich context given a domain name and optional hints
   * @param {object} params { domainName, hints: { requiredTechTags: string[], limit: number } }
   */
  enrich(params = {}) {
    const domainName = params.domainName;
    const hints = params.hints || {};

    const domain = this.domainRepo.getDomain(domainName) || null;
    const selectedTech = domain ? this.technologySelector.selectForDomain(domain, {
      limit: hints.limit || 3,
      requiredTags: hints.requiredTechTags || []
    }) : [];

    return {
      domain: domain ? domain.toJSON() : null,
      technologies: selectedTech.map(t => t.toJSON()),
      hashtags: [
        ...(domain ? domain.getHashtags(4) : []),
        ...selectedTech.flatMap(t => t.getHashtags(2))
      ].slice(0, 8)
    };
  }
}
