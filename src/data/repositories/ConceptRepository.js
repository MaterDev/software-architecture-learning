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
    this.initialized = false;
    this.initializeCache();
  }

  initializeCache() {
    try {
      // Defensive check for data structure
      if (!this.data || !this.data.conceptCategories) {
        console.warn('ConceptRepository: Invalid data structure, using fallback');
        this.createFallbackData();
        return;
      }

      // Pre-process concepts into model instances
      Object.entries(this.data.conceptCategories).forEach(([categoryKey, category]) => {
        if (category && category.concepts) {
          Object.entries(category.concepts).forEach(([conceptKey, conceptData]) => {
            try {
              const concept = new Concept({
                name: conceptKey,
                category: categoryKey,
                ...conceptData
              });
              this.conceptCache.set(conceptKey, concept);
            } catch (error) {
              console.warn(`ConceptRepository: Failed to create concept ${conceptKey}:`, error);
            }
          });
        }
      });
      
      this.initialized = true;
    } catch (error) {
      console.error('ConceptRepository: Failed to initialize cache:', error);
      this.createFallbackData();
    }
  }

  createFallbackData() {
    // Create minimal fallback concepts to prevent crashes
    const fallbackConcepts = [
      { name: 'software-architecture', category: 'foundational', complexity: 'beginner' },
      { name: 'system-design', category: 'structural', complexity: 'intermediate' },
      { name: 'quality-attributes', category: 'qualitative', complexity: 'intermediate' }
    ];

    fallbackConcepts.forEach(conceptData => {
      try {
        const concept = new Concept(conceptData);
        this.conceptCache.set(conceptData.name, concept);
      } catch (error) {
        console.warn('ConceptRepository: Failed to create fallback concept:', error);
      }
    });
    
    this.initialized = true;
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
    // Ensure repository is initialized
    if (!this.initialized) {
      console.warn('ConceptRepository: Not fully initialized, using fallback concepts');
      return this.getFallbackConcepts();
    }

    const relevantConcepts = this.getConceptsForRole(roleKey, complexity);
    
    if (relevantConcepts.length === 0) {
      // Fallback to any concepts if none match criteria
      const allConcepts = this.getAllConcepts();
      return allConcepts.length > 0 ? allConcepts.slice(0, 2) : this.getFallbackConcepts();
    }

    const selectedCount = count || Math.min(relevantConcepts.length, 3 + Math.floor(Math.random() * 3));
    return this.shuffleArray(relevantConcepts).slice(0, selectedCount);
  }

  getFallbackConcepts() {
    // Return minimal concepts to prevent null errors
    return [
      new Concept({ name: 'software-architecture', category: 'foundational', complexity: 'beginner' }),
      new Concept({ name: 'system-design', category: 'structural', complexity: 'intermediate' })
    ];
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
