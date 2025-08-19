/**
 * Hashtag Validation Integration Tests
 * Tests to prevent the "Cannot read properties of null (reading 'hashtags')" error
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { PromptEngine } from '../../engines/prompt/PromptEngine.js';

describe('Hashtag Validation Integration', () => {
  let promptEngine;

  beforeEach(() => {
    promptEngine = new PromptEngine();
  });

  describe('Cycle Generation Hashtag Validation', () => {
    it('should never generate cycles with null hashtags', () => {
      // Generate multiple cycles to test for race conditions
      for (let i = 0; i < 10; i++) {
        const cycle = promptEngine.generateCycle();
        
        // Validate cycle structure
        expect(cycle).toBeDefined();
        expect(cycle).not.toBeNull();
        expect(cycle.stages).toBeDefined();
        expect(Array.isArray(cycle.stages)).toBe(true);
        expect(cycle.stages.length).toBeGreaterThan(0);

        // Validate each stage has valid hashtags
        cycle.stages.forEach((stage, stageIndex) => {
          expect(stage, `Stage ${stageIndex} should not be null`).toBeDefined();
          expect(stage, `Stage ${stageIndex} should not be null`).not.toBeNull();
          
          expect(stage.hashtags, `Stage ${stageIndex} should have hashtags property`).toBeDefined();
          expect(stage.hashtags, `Stage ${stageIndex} hashtags should not be null`).not.toBeNull();
          expect(Array.isArray(stage.hashtags), `Stage ${stageIndex} hashtags should be an array`).toBe(true);
          expect(stage.hashtags.length, `Stage ${stageIndex} should have at least one hashtag`).toBeGreaterThan(0);
          
          // Validate hashtag format
          stage.hashtags.forEach((hashtag, hashtagIndex) => {
            expect(hashtag, `Stage ${stageIndex}, hashtag ${hashtagIndex} should be defined`).toBeDefined();
            expect(hashtag, `Stage ${stageIndex}, hashtag ${hashtagIndex} should not be null`).not.toBeNull();
            expect(typeof hashtag, `Stage ${stageIndex}, hashtag ${hashtagIndex} should be a string`).toBe('string');
            expect(hashtag.startsWith('#'), `Stage ${stageIndex}, hashtag ${hashtagIndex} should start with #`).toBe(true);
            expect(hashtag.length, `Stage ${stageIndex}, hashtag ${hashtagIndex} should have content after #`).toBeGreaterThan(1);
          });
        });
      }
    });

    it('should handle rapid successive generations without null hashtags', () => {
      const cycles = [];
      
      // Generate 5 cycles rapidly to test race conditions
      for (let i = 0; i < 5; i++) {
        cycles.push(promptEngine.generateCycle());
      }

      // Validate all cycles
      cycles.forEach((cycle, cycleIndex) => {
        expect(cycle, `Cycle ${cycleIndex} should be defined`).toBeDefined();
        expect(cycle.stages, `Cycle ${cycleIndex} should have stages`).toBeDefined();
        expect(Array.isArray(cycle.stages), `Cycle ${cycleIndex} stages should be array`).toBe(true);

        cycle.stages.forEach((stage, stageIndex) => {
          expect(stage, `Cycle ${cycleIndex}, Stage ${stageIndex} should not be null`).not.toBeNull();
          expect(stage.hashtags, `Cycle ${cycleIndex}, Stage ${stageIndex} should have hashtags`).toBeDefined();
          expect(Array.isArray(stage.hashtags), `Cycle ${cycleIndex}, Stage ${stageIndex} hashtags should be array`).toBe(true);
          expect(stage.hashtags.length, `Cycle ${cycleIndex}, Stage ${stageIndex} should have hashtags`).toBeGreaterThan(0);
        });
      });
    });

    it('should validate hashtag generation with edge cases', () => {
      // Test multiple generations to catch intermittent issues
      const testRuns = 20;
      const results = [];

      for (let run = 0; run < testRuns; run++) {
        try {
          const cycle = promptEngine.generateCycle();
          
          // Track results for analysis
          results.push({
            run,
            success: true,
            stageCount: cycle.stages.length,
            hashtagCounts: cycle.stages.map(stage => stage.hashtags?.length || 0),
            hasNullStages: cycle.stages.some(stage => stage === null),
            hasNullHashtags: cycle.stages.some(stage => !stage.hashtags),
            hasEmptyHashtags: cycle.stages.some(stage => stage.hashtags?.length === 0)
          });

          // Validate no null references
          expect(cycle.stages.every(stage => stage !== null), `Run ${run}: No stages should be null`).toBe(true);
          expect(cycle.stages.every(stage => stage.hashtags !== null), `Run ${run}: No hashtags should be null`).toBe(true);
          expect(cycle.stages.every(stage => Array.isArray(stage.hashtags)), `Run ${run}: All hashtags should be arrays`).toBe(true);
          expect(cycle.stages.every(stage => stage.hashtags.length > 0), `Run ${run}: All stages should have hashtags`).toBe(true);

        } catch (error) {
          results.push({
            run,
            success: false,
            error: error.message,
            errorType: error.constructor.name
          });
          
          // Fail the test if we get the specific error we're trying to prevent
          if (error.message.includes("Cannot read properties of null (reading 'hashtags')")) {
            throw new Error(`Run ${run}: The hashtag null reference error occurred: ${error.message}`);
          }
          
          throw error;
        }
      }

      // Log results for analysis
      console.log('Hashtag validation test results:', {
        totalRuns: testRuns,
        successfulRuns: results.filter(r => r.success).length,
        failedRuns: results.filter(r => !r.success).length,
        nullStageIssues: results.filter(r => r.hasNullStages).length,
        nullHashtagIssues: results.filter(r => r.hasNullHashtags).length,
        emptyHashtagIssues: results.filter(r => r.hasEmptyHashtags).length
      });

      // All runs should be successful
      expect(results.every(r => r.success), 'All test runs should succeed').toBe(true);
    });

    it('should validate cycle model getAllHashtags method', () => {
      const cycle = promptEngine.generateCycle();
      
      // Test the specific method that was causing the error
      expect(() => {
        const allHashtags = cycle.getAllHashtags ? cycle.getAllHashtags() : [];
        expect(Array.isArray(allHashtags)).toBe(true);
      }).not.toThrow();
    });

    it('should handle repository initialization edge cases', () => {
      // Test with a fresh engine instance
      const freshEngine = new PromptEngine();
      
      // Immediately try to generate (potential race condition)
      const cycle = freshEngine.generateCycle();
      
      expect(cycle).toBeDefined();
      expect(cycle.stages).toBeDefined();
      expect(Array.isArray(cycle.stages)).toBe(true);
      
      cycle.stages.forEach((stage, index) => {
        expect(stage, `Fresh engine stage ${index} should not be null`).not.toBeNull();
        expect(stage.hashtags, `Fresh engine stage ${index} should have hashtags`).toBeDefined();
        expect(Array.isArray(stage.hashtags), `Fresh engine stage ${index} hashtags should be array`).toBe(true);
        expect(stage.hashtags.length, `Fresh engine stage ${index} should have hashtags`).toBeGreaterThan(0);
      });
    });
  });

  describe('Stage Regeneration Hashtag Validation', () => {
    it('should never generate stages with null hashtags during regeneration', () => {
      // First generate a cycle
      const cycle = promptEngine.generateCycle();
      expect(cycle.stages.length).toBeGreaterThan(0);

      // Test regenerating each stage type
      const stageTypes = ['Expert Engineer', 'System Designer', 'Leader', 'Review & Synthesis'];
      
      stageTypes.forEach(stageType => {
        try {
          const regeneratedStage = promptEngine.regenerateStage(stageType);
          
          expect(regeneratedStage, `Regenerated ${stageType} should be defined`).toBeDefined();
          expect(regeneratedStage, `Regenerated ${stageType} should not be null`).not.toBeNull();
          expect(regeneratedStage.hashtags, `Regenerated ${stageType} should have hashtags`).toBeDefined();
          expect(regeneratedStage.hashtags, `Regenerated ${stageType} hashtags should not be null`).not.toBeNull();
          expect(Array.isArray(regeneratedStage.hashtags), `Regenerated ${stageType} hashtags should be array`).toBe(true);
          expect(regeneratedStage.hashtags.length, `Regenerated ${stageType} should have hashtags`).toBeGreaterThan(0);
          
        } catch (error) {
          if (error.message.includes("Cannot read properties of null (reading 'hashtags')")) {
            throw new Error(`Stage regeneration for ${stageType} caused hashtag null reference error: ${error.message}`);
          }
          throw error;
        }
      });
    });
  });
});
