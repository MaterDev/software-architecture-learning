/**
 * Concept Model Tests
 */
import { describe, it, expect } from 'vitest';
import { Concept } from '../../../data/models/Concept.js';

describe('Concept', () => {
  describe('constructor', () => {
    it('should create concept with valid data', () => {
      const data = {
        name: 'test-concept',
        category: 'foundational',
        definition: 'Test definition',
        complexity: 'intermediate',
        components: ['comp1', 'comp2'],
        keyInsights: ['insight1']
      };

      const concept = new Concept(data);
      
      expect(concept.name).toBe('test-concept');
      expect(concept.category).toBe('foundational');
      expect(concept.definition).toBe('Test definition');
      expect(concept.complexity).toBe('intermediate');
      expect(concept.components).toEqual(['comp1', 'comp2']);
      expect(concept.keyInsights).toEqual(['insight1']);
    });

    it('should use default values for missing properties', () => {
      const concept = new Concept({ name: 'test' });
      
      expect(concept.name).toBe('test');
      expect(concept.category).toBe('general');
      expect(concept.definition).toBe('');
      expect(concept.complexity).toBe('intermediate');
      expect(concept.components).toEqual([]);
      expect(concept.keyInsights).toEqual([]);
    });

    it('should throw error for invalid name', () => {
      expect(() => new Concept({})).toThrow('Concept must have a valid name');
      expect(() => new Concept({ name: '' })).toThrow('Concept must have a valid name');
      expect(() => new Concept({ name: 123 })).toThrow('Concept must have a valid name');
    });

    it('should throw error for invalid complexity', () => {
      expect(() => new Concept({ 
        name: 'test', 
        complexity: 'invalid' 
      })).toThrow('Invalid complexity level: invalid');
    });
  });

  describe('isRelevantToRole', () => {
    it('should return true for relevant role-category combinations', () => {
      const structuralConcept = new Concept({
        name: 'test',
        category: 'structural'
      });

      expect(structuralConcept.isRelevantToRole('expertEngineer')).toBe(true);
      expect(structuralConcept.isRelevantToRole('systemDesigner')).toBe(true);
    });

    it('should return false for irrelevant role-category combinations', () => {
      const structuralConcept = new Concept({
        name: 'test',
        category: 'unrelated'
      });

      expect(structuralConcept.isRelevantToRole('expertEngineer')).toBe(false);
    });

    it('should handle unknown roles gracefully', () => {
      const concept = new Concept({ name: 'test' });
      expect(concept.isRelevantToRole('unknownRole')).toBe(false);
    });
  });

  describe('matchesComplexity', () => {
    it('should match exact complexity', () => {
      const concept = new Concept({ name: 'test', complexity: 'intermediate' });
      expect(concept.matchesComplexity('intermediate')).toBe(true);
    });

    it('should allow intermediate concepts for advanced level', () => {
      const concept = new Concept({ name: 'test', complexity: 'intermediate' });
      expect(concept.matchesComplexity('advanced')).toBe(true);
    });

    it('should allow all concepts for beginner level', () => {
      const advancedConcept = new Concept({ name: 'test', complexity: 'advanced' });
      expect(advancedConcept.matchesComplexity('beginner')).toBe(true);
    });

    it('should not allow advanced concepts for intermediate level', () => {
      const advancedConcept = new Concept({ name: 'test', complexity: 'advanced' });
      expect(advancedConcept.matchesComplexity('intermediate')).toBe(false);
    });
  });

  describe('getHashtag', () => {
    it('should return formatted hashtag', () => {
      const concept = new Concept({ name: 'test concept' });
      expect(concept.getHashtag()).toBe('#test-concept');
    });

    it('should handle single word names', () => {
      const concept = new Concept({ name: 'modularity' });
      expect(concept.getHashtag()).toBe('#modularity');
    });
  });

  describe('getComponentHashtags', () => {
    it('should return component hashtags with default limit', () => {
      const concept = new Concept({
        name: 'test',
        components: ['comp one', 'comp two', 'comp three']
      });
      
      const hashtags = concept.getComponentHashtags();
      expect(hashtags).toEqual(['#comp-one', '#comp-two']);
    });

    it('should respect custom limit', () => {
      const concept = new Concept({
        name: 'test',
        components: ['comp1', 'comp2', 'comp3']
      });
      
      const hashtags = concept.getComponentHashtags(1);
      expect(hashtags).toEqual(['#comp1']);
    });

    it('should filter out invalid components', () => {
      const concept = new Concept({
        name: 'test',
        components: ['valid', null, '', 123, 'another valid']
      });
      
      const hashtags = concept.getComponentHashtags();
      expect(hashtags).toEqual(['#valid', '#another-valid']);
    });

    it('should return empty array for no components', () => {
      const concept = new Concept({ name: 'test' });
      expect(concept.getComponentHashtags()).toEqual([]);
    });
  });

  describe('toJSON', () => {
    it('should return serializable object', () => {
      const data = {
        name: 'test-concept',
        category: 'foundational',
        definition: 'Test definition',
        complexity: 'intermediate',
        components: ['comp1', 'comp2'],
        keyInsights: ['insight1'],
        relationships: ['rel1']
      };

      const concept = new Concept(data);
      const json = concept.toJSON();
      
      expect(json).toEqual(data);
      expect(typeof json).toBe('object');
    });
  });
});
