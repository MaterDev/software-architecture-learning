/**
 * Scenario Repository
 * Handles all contextual scenario data access and selection logic
 */
import contextualScenarios from '../sources/contextual-scenarios.json';
import { Context } from '../models/Context.js';

export class ScenarioRepository {
  constructor() {
    this.data = contextualScenarios;
    this.domainCache = new Map();
    // Weighting for preferred domains (higher number => more likely)
    // Defaults to 1 if a domain isn't listed here
    this.domainWeights = {
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
    const selectedDomain = weighted[Math.floor(Math.random() * weighted.length)] || domains[0];
    
    // Sometimes select a specific scenario within the domain
    if (selectedDomain.scenarios && Array.isArray(selectedDomain.scenarios) && Math.random() < 0.6) {
      const selectedScenario = selectedDomain.scenarios[Math.floor(Math.random() * selectedDomain.scenarios.length)];
      selectedDomain.selectedScenario = selectedScenario;
    }

    return selectedDomain;
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
