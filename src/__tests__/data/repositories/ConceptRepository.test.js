/**
 * ConceptRepository Tests
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ConceptRepository } from '../../../data/repositories/ConceptRepository.js';
import { Concept } from '../../../data/models/Concept.js';
// import { mockConceptData } from '../../fixtures/mockConcepts.js'; // TODO: Use for mocking when needed

describe('ConceptRepository', () => {
  let repository;

  beforeEach(() => {
    repository = new ConceptRepository();
  });

  describe('initialization', () => {
    it('should initialize with concept data', () => {
      expect(repository.data).toBeDefined();
      expect(repository.conceptCache).toBeDefined();
      expect(repository.conceptCache.size).toBeGreaterThan(0);
    });

    it('should create Concept model instances', () => {
      const concept = repository.getConcept('software-architecture');
      expect(concept).toBeInstanceOf(Concept);
      expect(concept.name).toBe('software-architecture');
      expect(concept.category).toBe('foundational');
    });
  });

  describe('getAllConcepts', () => {
    it('should return all concepts as model instances', () => {
      const concepts = repository.getAllConcepts();
      expect(Array.isArray(concepts)).toBe(true);
      expect(concepts.length).toBeGreaterThan(0);
      expect(concepts[0]).toBeInstanceOf(Concept);
    });
  });

  describe('getConceptsByCategory', () => {
    it('should filter concepts by category', () => {
      const foundationalConcepts = repository.getConceptsByCategory('foundational');
      expect(foundationalConcepts.length).toBeGreaterThan(0);
      foundationalConcepts.forEach(concept => {
        expect(concept.category).toBe('foundational');
      });
    });

    it('should return empty array for non-existent category', () => {
      const concepts = repository.getConceptsByCategory('non-existent');
      expect(concepts).toEqual([]);
    });
  });

  describe('getConceptsByComplexity', () => {
    it('should filter concepts by complexity level', () => {
      const beginnerConcepts = repository.getConceptsByComplexity('beginner');
      expect(beginnerConcepts.length).toBeGreaterThan(0);
      beginnerConcepts.forEach(concept => {
        expect(concept.matchesComplexity('beginner')).toBe(true);
      });
    });

    it('should handle advanced complexity matching intermediate', () => {
      const advancedConcepts = repository.getConceptsByComplexity('advanced');
      // Should include both advanced and intermediate concepts
      expect(advancedConcepts.length).toBeGreaterThan(0);
    });
  });

  describe('getConceptsForRole', () => {
    it('should return concepts relevant to expert engineer role', () => {
      const concepts = repository.getConceptsForRole('expertEngineer');
      expect(concepts.length).toBeGreaterThan(0);
      concepts.forEach(concept => {
        expect(concept.isRelevantToRole('expertEngineer')).toBe(true);
      });
    });

    it('should filter by both role and complexity', () => {
      const concepts = repository.getConceptsForRole('expertEngineer', 'beginner');
      expect(concepts.length).toBeGreaterThan(0);
      concepts.forEach(concept => {
        expect(concept.isRelevantToRole('expertEngineer')).toBe(true);
        expect(concept.matchesComplexity('beginner')).toBe(true);
      });
    });
  });

  describe('selectRelevantConcepts', () => {
    it('should select random concepts with specified count', () => {
      const concepts = repository.selectRelevantConcepts('expertEngineer', 'beginner', 2);
      expect(concepts.length).toBeLessThanOrEqual(2);
      expect(concepts.length).toBeGreaterThan(0);
    });

    it('should return fallback concepts when no matches found', () => {
      // Mock empty results
      vi.spyOn(repository, 'getConceptsForRole').mockReturnValue([]);
      
      const concepts = repository.selectRelevantConcepts('nonExistentRole', 'advanced');
      expect(concepts.length).toBe(2); // Fallback to first 2 concepts
    });

    it('should limit selection to available concepts', () => {
      const concepts = repository.selectRelevantConcepts('expertEngineer', 'beginner', 100);
      const availableConcepts = repository.getConceptsForRole('expertEngineer', 'beginner');
      expect(concepts.length).toBeLessThanOrEqual(availableConcepts.length);
    });
  });

  describe('getConcept', () => {
    it('should return specific concept by name', () => {
      const concept = repository.getConcept('software-architecture');
      expect(concept).toBeInstanceOf(Concept);
      expect(concept.name).toBe('software-architecture');
    });

    it('should return undefined for non-existent concept', () => {
      const concept = repository.getConcept('non-existent');
      expect(concept).toBeUndefined();
    });
  });

  describe('getStats', () => {
    it('should return repository statistics', () => {
      const stats = repository.getStats();
      expect(stats).toHaveProperty('totalConcepts');
      expect(stats).toHaveProperty('categories');
      expect(stats).toHaveProperty('categoryNames');
      expect(stats).toHaveProperty('complexityDistribution');
      
      expect(typeof stats.totalConcepts).toBe('number');
      expect(Array.isArray(stats.categoryNames)).toBe(true);
      expect(typeof stats.complexityDistribution).toBe('object');
    });
  });

  describe('shuffleArray', () => {
    it('should shuffle array elements', () => {
      const original = [1, 2, 3, 4, 5];
      const shuffled = repository.shuffleArray(original);
      
      expect(shuffled).toHaveLength(original.length);
      expect(shuffled).toEqual(expect.arrayContaining(original));
      // Note: There's a small chance this could fail if shuffle returns same order
    });

    it('should not modify original array', () => {
      const original = [1, 2, 3];
      const originalCopy = [...original];
      repository.shuffleArray(original);
      
      expect(original).toEqual(originalCopy);
    });
  });
});
