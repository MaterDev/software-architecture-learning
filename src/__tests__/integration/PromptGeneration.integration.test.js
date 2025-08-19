/**
 * Integration Tests for Complete Prompt Generation System
 * Tests the entire flow from data loading through prompt generation
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { PromptEngine } from '../../engines/prompt/PromptEngine.js';
import { ConceptRepository } from '../../data/repositories/ConceptRepository.js';
import { TemplateRepository } from '../../data/repositories/TemplateRepository.js';
import { ScenarioRepository } from '../../data/repositories/ScenarioRepository.js';
import { StrategyRepository } from '../../data/repositories/StrategyRepository.js';

describe('Prompt Generation Integration', () => {
  let promptEngine;

  beforeAll(() => {
    promptEngine = new PromptEngine();
  });

  describe('Full System Integration', () => {
    it('should generate complete learning cycle', () => {
      const cycle = promptEngine.generateCycle();
      
      // Validate cycle structure
      expect(cycle).toHaveProperty('id');
      expect(cycle).toHaveProperty('timestamp');
      expect(cycle).toHaveProperty('context');
      expect(cycle).toHaveProperty('complexity');
      expect(cycle).toHaveProperty('stages');
      expect(cycle).toHaveProperty('metadata');
      
      // Validate stages
      expect(Array.isArray(cycle.stages)).toBe(true);
      expect(cycle.stages).toHaveLength(4);
      
      cycle.stages.forEach(stage => {
        expect(stage).toHaveProperty('stage');
        expect(stage).toHaveProperty('prompt');
        expect(stage).toHaveProperty('hashtags');
        expect(stage).toHaveProperty('context');
        expect(stage).toHaveProperty('complexity');
        expect(stage).toHaveProperty('lessonType');
        expect(stage).toHaveProperty('conceptsUsed');
        expect(stage).toHaveProperty('timestamp');
        
        // Validate prompt content
        expect(typeof stage.prompt).toBe('string');
        expect(stage.prompt.length).toBeGreaterThan(100);
        expect(stage.prompt).toContain('Educational Lesson Generation Prompt');
        
        // Validate hashtags
        expect(Array.isArray(stage.hashtags)).toBe(true);
        expect(stage.hashtags.length).toBeGreaterThan(0);
        stage.hashtags.forEach(hashtag => {
          expect(hashtag).toMatch(/^#/);
        });
      });
    });

    it('should regenerate individual stages', () => {
      const stageNames = ['Expert Engineer', 'System Designer', 'Leader', 'Review & Synthesis'];
      
      stageNames.forEach(stageName => {
        const stage = promptEngine.regenerateStage(stageName);
        
        expect(stage).toHaveProperty('stage', stageName);
        expect(stage).toHaveProperty('prompt');
        expect(stage).toHaveProperty('hashtags');
        expect(typeof stage.prompt).toBe('string');
        expect(stage.prompt.length).toBeGreaterThan(100);
      });
    });

    it('should generate different content on multiple calls', () => {
      const cycle1 = promptEngine.generateCycle();
      const cycle2 = promptEngine.generateCycle();
      
      // Should have different IDs and timestamps
      expect(cycle1.id).not.toBe(cycle2.id);
      expect(cycle1.timestamp).not.toBe(cycle2.timestamp);
      
      // Content should vary (at least some differences)
      const stage1_1 = cycle1.stages[0];
      const stage1_2 = cycle2.stages[0];
      
      // At least context or concepts should be different
      const hasDifferences = 
        stage1_1.context !== stage1_2.context ||
        stage1_1.complexity !== stage1_2.complexity ||
        JSON.stringify(stage1_1.conceptsUsed) !== JSON.stringify(stage1_2.conceptsUsed);
      
      expect(hasDifferences).toBe(true);
    });
  });

  describe('Data Repository Integration', () => {
    it('should load and process all data sources', () => {
      const conceptRepo = new ConceptRepository();
      const templateRepo = new TemplateRepository();
      const scenarioRepo = new ScenarioRepository();
      const strategyRepo = new StrategyRepository();
      
      // Verify data loading
      expect(conceptRepo.getAllConcepts().length).toBeGreaterThan(0);
      expect(templateRepo.getAllFormats().length).toBeGreaterThan(0);
      expect(scenarioRepo.getAllDomains().length).toBeGreaterThan(0);
      expect(strategyRepo.getAllStrategies().length).toBeGreaterThan(0);
      
      // Verify data integrity
      const concepts = conceptRepo.getAllConcepts();
      concepts.forEach(concept => {
        expect(concept.name).toBeTruthy();
        expect(concept.category).toBeTruthy();
        expect(['beginner', 'intermediate', 'advanced']).toContain(concept.complexity);
      });
    });

    it('should provide comprehensive statistics', () => {
      const stats = promptEngine.getStats();
      
      expect(stats.concepts.totalConcepts).toBeGreaterThan(0);
      expect(stats.templates.totalFormats).toBeGreaterThan(0);
      expect(stats.scenarios.totalDomains).toBeGreaterThan(0);
      expect(stats.strategies.totalStrategies).toBeGreaterThan(0);
      
      expect(Array.isArray(stats.concepts.categoryNames)).toBe(true);
      expect(Array.isArray(stats.templates.formatKeys)).toBe(true);
      expect(Array.isArray(stats.scenarios.domainNames)).toBe(true);
    });
  });

  describe('Template Interpolation', () => {
    it('should properly interpolate template variables', () => {
      const cycle = promptEngine.generateCycle();
      const stage = cycle.stages[0];
      
      // Should not contain unresolved template variables
      expect(stage.prompt).not.toContain('{concept}');
      expect(stage.prompt).not.toContain('{context}');
      expect(stage.prompt).not.toContain('{domain}');
      expect(stage.prompt).not.toContain('{decisionType}');
      
      // Should contain resolved content
      expect(stage.prompt).toMatch(/software engineers about \*\*[\w\s-]+\*\*/);
      expect(stage.prompt).toContain('Domain Context:');
      expect(stage.prompt).toContain('Technical Challenges');
    });
  });

  describe('Error Handling', () => {
    it('should handle missing data gracefully', () => {
      // This tests the fallback mechanisms built into the system
      expect(() => promptEngine.generateCycle()).not.toThrow();
      expect(() => promptEngine.regenerateStage('Expert Engineer')).not.toThrow();
    });

    it('should generate valid hashtags even with edge cases', () => {
      const cycle = promptEngine.generateCycle();
      
      cycle.stages.forEach(stage => {
        expect(Array.isArray(stage.hashtags)).toBe(true);
        expect(stage.hashtags.length).toBeGreaterThan(0);
        
        stage.hashtags.forEach(hashtag => {
          expect(hashtag).toMatch(/^#[\w-]+$/);
          expect(hashtag).not.toContain(' ');
          expect(hashtag.length).toBeGreaterThan(1);
        });
      });
    });
  });

  describe('Performance', () => {
    it('should generate cycles within reasonable time', () => {
      const startTime = Date.now();
      const cycle = promptEngine.generateCycle();
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeLessThan(1000); // Should take less than 1 second
      expect(cycle).toBeDefined();
    });

    it('should handle multiple rapid generations', () => {
      const startTime = Date.now();
      const cycles = [];
      
      for (let i = 0; i < 10; i++) {
        cycles.push(promptEngine.generateCycle());
      }
      
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeLessThan(5000); // 10 cycles in less than 5 seconds
      expect(cycles).toHaveLength(10);
      
      // All cycles should be valid and unique
      const ids = cycles.map(c => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(10);
    });
  });
});
