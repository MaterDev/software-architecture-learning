/**
 * Concept Repository
 * Handles all concept data access and filtering logic
 */
import coreConcepts from '../sources/core-concepts.json';
import { Concept } from '../models/Concept.js';

export class ConceptRepository {
  constructor() {
    this.data = coreConcepts;
    this.conceptCache = new Map();
    this.initializeCache();
  }

  initializeCache() {
    // Pre-process concepts into model instances
    Object.entries(this.data.conceptCategories).forEach(([categoryKey, category]) => {
      Object.entries(category.concepts).forEach(([conceptKey, conceptData]) => {
        const concept = new Concept({
          name: conceptKey,
          category: categoryKey,
          ...conceptData
        });
        this.conceptCache.set(conceptKey, concept);
      });
    });
  }

  /**
   * Get all concepts as model instances
   */
  getAllConcepts() {
    return Array.from(this.conceptCache.values());
  }

  /**
   * Get concepts by category
   */
  getConceptsByCategory(category) {
    return this.getAllConcepts().filter(concept => concept.category === category);
  }

  /**
   * Get concepts by complexity level
   */
  getConceptsByComplexity(complexity) {
    return this.getAllConcepts().filter(concept => concept.matchesComplexity(complexity));
  }

  /**
   * Get concepts relevant to a specific role
   */
  getConceptsForRole(roleKey, complexity = null) {
    let concepts = this.getAllConcepts().filter(concept => concept.isRelevantToRole(roleKey));
    
    if (complexity) {
      concepts = concepts.filter(concept => concept.matchesComplexity(complexity));
    }
    
    return concepts;
  }

  /**
   * Select random concepts with intelligent filtering
   */
  selectRelevantConcepts(roleKey, complexity, count = null) {
    const relevantConcepts = this.getConceptsForRole(roleKey, complexity);
    
    if (relevantConcepts.length === 0) {
      // Fallback to any concepts if none match criteria
      return this.getAllConcepts().slice(0, 2);
    }

    const selectedCount = count || Math.min(relevantConcepts.length, 3 + Math.floor(Math.random() * 3));
    return this.shuffleArray(relevantConcepts).slice(0, selectedCount);
  }

  /**
   * Get concept by name
   */
  getConcept(name) {
    return this.conceptCache.get(name);
  }

  /**
   * Get category count for stats
   */
  getCategoryCount() {
    return Object.keys(this.data.conceptCategories).length;
  }

  /**
   * Get repository statistics
   */
  getStats() {
    const categories = Object.keys(this.data.conceptCategories);
    const totalConcepts = this.conceptCache.size;
    const complexityDistribution = this.getAllConcepts().reduce((acc, concept) => {
      acc[concept.complexity] = (acc[concept.complexity] || 0) + 1;
      return acc;
    }, {});

    return {
      totalConcepts,
      categories: categories.length,
      categoryNames: categories,
      complexityDistribution
    };
  }

  /**
   * Utility method to shuffle array
   */
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
