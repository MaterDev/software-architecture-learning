/**
 * Technology Repository
 * Loads and indexes technology data by category and tags
 */
import technologiesData from '../sources/technologies.json';
import { Technology } from '../models/Technology.js';

export class TechnologyRepository {
  constructor() {
    this.data = technologiesData;
    this.techCache = new Map();
    this.initialized = false;
    this.initializeCache();
  }

  initializeCache() {
    try {
      if (!this.data || !Array.isArray(this.data.technologies)) {
        console.warn('TechnologyRepository: Invalid data structure, using empty list');
        this.data = { technologies: [] };
      }
      this.data.technologies.forEach((tData) => {
        try {
          const tech = new Technology(tData);
          this.techCache.set(tech.name, tech);
        } catch (e) {
          console.warn('TechnologyRepository: Failed to create technology', tData?.name, e?.message);
        }
      });
      this.initialized = true;
    } catch (error) {
      console.error('TechnologyRepository: Failed to initialize cache:', error);
      this.data = { technologies: [] };
      this.initialized = true;
    }
  }

  getAllTechnologies() {
    return Array.from(this.techCache.values());
  }

  getTechnology(name) {
    return this.techCache.get(name);
  }

  getByCategory(category) {
    const cat = String(category || '').toLowerCase();
    return this.getAllTechnologies().filter(t => String(t.category).toLowerCase() === cat);
  }

  getByTag(tag) {
    const needle = String(tag || '').toLowerCase();
    return this.getAllTechnologies().filter(t =>
      t.tags?.some(x => String(x).toLowerCase() === needle) ||
      t.qualityAttributes?.some(x => String(x).toLowerCase() === needle)
    );
  }

  getTechnologyCount() {
    return this.techCache.size;
  }

  getStats() {
    const all = this.getAllTechnologies();
    const byCategory = all.reduce((acc, t) => {
      const k = (t.category || 'general').toLowerCase();
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {});
    return {
      totalTechnologies: all.length,
      categories: Object.keys(byCategory),
      distributionByCategory: byCategory
    };
  }
}
