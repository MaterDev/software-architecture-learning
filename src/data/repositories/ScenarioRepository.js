/**
 * Scenario Repository
 * Handles all contextual scenario data access and selection logic
 */
import contextualScenarios from '../sources/contextual-scenarios.json';
import { Context } from '../models/Context.js';
import { logger } from '../../utils/logger.js';

export class ScenarioRepository {
  constructor({ domainWeights } = {}) {
    this.data = contextualScenarios;
    this.domainCache = new Map();
    this.initialized = false;
    // Weighting for preferred domains (higher number => more likely)
    // Defaults to 1 if a domain isn't listed here
    this.defaultDomainWeights = {
      'entertainment-arts': 4,
      'comics': 3,
      'graphic-apps': 4,
      'creative-coding': 4,
      'server-side-development': 3,
      'scripting-tooling': 3,
      'analytics-data-viz': 3,
      'computer-graphics': 4,
      'webassembly': 3,
      'tauri': 3,
      'javascript': 3,
      'typescript': 3,
      'go': 3,
      'rust': 3,
      'payment-systems': 4,
      'devops': 3,
      'software-distribution': 3,
      'generative-ai': 4,
      'app-development': 3
    };
    // Merge overrides on top of defaults (shallow)
    this.domainWeights = { ...this.defaultDomainWeights, ...(domainWeights || {}) };
    try {
      logger.info('ScenarioRepository', 'init-domain-weights', {
        defaultCount: Object.keys(this.defaultDomainWeights).length,
        overrideKeys: Object.keys(domainWeights || {}),
      });
    } catch (e) { console.debug && console.debug('[ScenarioRepository] log suppressed:init', e && e.message); }
    this.initializeCache();
  }

  initializeCache() {
    // Cache domain contexts as model instances
    Object.entries(this.data.domainContexts).forEach(([domainKey, domainData]) => {
      const context = new Context({
        name: domainKey,
        ...domainData
      });
      this.domainCache.set(domainKey, context);
    });
    this.initialized = true;
  }

  /**
   * Get all domain contexts
   */
  getAllDomains() {
    return Array.from(this.domainCache.values());
  }

  /**
   * Get domain context by name
   */
  getDomain(domainName) {
    return this.domainCache.get(domainName);
  }

  /**
   * Select a random context with intelligent weighting
   */
  selectContext() {
    const domains = this.getAllDomains();
    
    if (domains.length === 0) {
      return new Context({
        name: 'general',
        description: 'General software architecture context',
        characteristics: ['maintainability', 'scalability', 'reliability'],
        constraints: ['resource-limitations', 'time-constraints'],
        stakeholders: ['developers', 'users', 'business-stakeholders']
      });
    }

    // Build a weighted list and select
    const weighted = [];
    for (const d of domains) {
      const key = d.name;
      const weight = Math.max(1, this.domainWeights[key] || 1);
      for (let i = 0; i < weight; i++) weighted.push(d);
    }
    try {
      const sample = Object.fromEntries(Array.from(this.domainCache.keys()).slice(0, 8).map(k => [k, this.domainWeights[k] ?? 1]));
      logger.debug('ScenarioRepository', 'selectContext:weights-snapshot', {
        totalDomains: domains.length,
        weightedListLength: weighted.length,
        sample,
      });
    } catch (e) { console.debug && console.debug('[ScenarioRepository] log suppressed:weights-snapshot', e && e.message); }

    const selectedDomain = weighted[Math.floor(Math.random() * weighted.length)] || domains[0];
    try {
      logger.info('ScenarioRepository', 'selectContext:selected', {
        domain: selectedDomain?.name,
        weight: this.domainWeights[selectedDomain?.name] ?? 1,
        weightedListLength: weighted.length,
      });
    } catch (e) { console.debug && console.debug('[ScenarioRepository] log suppressed:selected', e && e.message); }
    
    // Sometimes select a specific scenario within the domain
    if (selectedDomain.scenarios && Array.isArray(selectedDomain.scenarios) && Math.random() < 0.6) {
      const selectedScenario = selectedDomain.scenarios[Math.floor(Math.random() * selectedDomain.scenarios.length)];
      selectedDomain.selectedScenario = selectedScenario;
      try {
        logger.debug('ScenarioRepository', 'selectContext:selected-scenario', {
          domain: selectedDomain?.name,
          scenario: selectedScenario?.name,
        });
      } catch (e) { console.debug && console.debug('[ScenarioRepository] log suppressed:selected-scenario', e && e.message); }
    }

    return selectedDomain;
  }

  /**
   * Override domain weighting preferences at runtime
   * Passing a partial map will merge with existing weights
   */
  setDomainWeights(newWeights = {}) {
    if (!newWeights || typeof newWeights !== 'object') return;
    const before = { ...this.domainWeights };
    this.domainWeights = { ...this.domainWeights, ...newWeights };
    try {
      const changed = Object.keys(newWeights).reduce((acc, k) => {
        acc[k] = { from: before[k] ?? 1, to: this.domainWeights[k] };
        return acc;
      }, {});
      logger.info('ScenarioRepository', 'setDomainWeights:merge', { changedKeys: Object.keys(newWeights), changed });
    } catch (e) { console.debug && console.debug('[ScenarioRepository] log suppressed:setDomainWeights', e && e.message); }
  }

  /**
   * Read current domain weights (copy)
   */
  getDomainWeights() {
    return { ...this.domainWeights };
  }

  /**
   * Get domain count for stats
   */
  getDomainCount() {
    return this.domainCache.size;
  }

  /**
   * Get repository statistics
   */
  getStats() {
    const domains = this.getAllDomains();
    const totalScenarios = domains.reduce((total, domain) => {
      return total + (domain.scenarios ? domain.scenarios.length : 0);
    }, 0);

    return {
      totalDomains: this.domainCache.size,
      domainNames: Array.from(this.domainCache.keys()),
      totalScenarios,
      averageScenariosPerDomain: totalScenarios / this.domainCache.size
    };
  }
}
