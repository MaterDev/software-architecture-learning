/**
 * Domain Repository
 * Loads and indexes domain data for selection and enrichment
 */
import domainsData from '../sources/domains.json';
import { Domain } from '../models/Domain.js';

export class DomainRepository {
  constructor() {
    this.data = domainsData;
    this.domainCache = new Map();
    this.initialized = false;
    this.initializeCache();
  }

  initializeCache() {
    try {
      if (!this.data || !Array.isArray(this.data.domains)) {
        console.warn('DomainRepository: Invalid data structure, using empty list');
        this.data = { domains: [] };
      }

      this.data.domains.forEach((domainData) => {
        try {
          const domain = new Domain(domainData);
          this.domainCache.set(domain.name, domain);
        } catch (e) {
          console.warn('DomainRepository: Failed to create domain', domainData?.name, e?.message);
        }
      });
      this.initialized = true;
    } catch (error) {
      console.error('DomainRepository: Failed to initialize cache:', error);
      this.data = { domains: [] };
      this.initialized = true;
    }
  }

  getAllDomains() {
    return Array.from(this.domainCache.values());
  }

  getDomain(name) {
    return this.domainCache.get(name);
  }

  getDomainsByTag(tag) {
    const needle = String(tag || '').toLowerCase();
    return this.getAllDomains().filter(d =>
      d.characteristics?.some(c => String(c).toLowerCase() === needle) ||
      d.kpis?.some(k => String(k).toLowerCase() === needle) ||
      d.constraints?.some(c => String(c).toLowerCase() === needle)
    );
  }

  getDomainCount() {
    return this.domainCache.size;
  }

  getStats() {
    const domains = this.getAllDomains();
    const byFirstChar = domains.reduce((acc, d) => {
      const k = (d.name?.[0] || '#').toLowerCase();
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {});
    return {
      totalDomains: domains.length,
      distributionByInitial: byFirstChar
    };
  }
}
