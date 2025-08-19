/**
 * PromptEngine Tests
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PromptEngine } from '../../../engines/prompt/PromptEngine.js';

// Note: Mocking approach simplified for now

describe('PromptEngine', () => {
  let promptEngine;
  let mockCycleGenerator;
  let mockStageGenerator;
  let mockRepos;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock repository responses
    mockRepos = {
      conceptRepo: {
        getCategoryCount: vi.fn().mockReturnValue(3),
        getStats: vi.fn().mockReturnValue({
          totalConcepts: 10,
          categories: 3
        })
      },
      templateRepo: {
        getFormatCount: vi.fn().mockReturnValue(4),
        getStats: vi.fn().mockReturnValue({
          totalFormats: 4,
          formatKeys: ['conceptExploration', 'tradeoffAnalysis']
        })
      },
      scenarioRepo: {
        getDomainCount: vi.fn().mockReturnValue(5),
        getStats: vi.fn().mockReturnValue({
          totalDomains: 5,
          domains: ['fintech', 'ecommerce', 'healthcare']
        })
      },
      strategyRepo: {
        getStrategyCount: vi.fn().mockReturnValue(8),
        getStats: vi.fn().mockReturnValue({
          totalStrategies: 8
        })
      }
    };

    // Mock generators
    mockCycleGenerator = {
      generate: vi.fn().mockReturnValue({
        id: 'test-cycle-123',
        context: { domain: 'fintech' },
        complexity: 'intermediate',
        obliqueStrategy: null,
        stages: [
          { stage: 'Architect', prompt: 'Test prompt 1' },
          { stage: 'Expert Engineer', prompt: 'Test prompt 2' }
        ]
      })
    };

    mockStageGenerator = {
      regenerate: vi.fn().mockReturnValue({
        stage: 'Expert Engineer',
        prompt: 'Test regenerated prompt',
        hashtags: ['#test', '#architecture']
      })
    };

    // Inject mocks into PromptEngine for proper spying
    promptEngine = new PromptEngine({
      conceptRepo: mockRepos.conceptRepo,
      templateRepo: mockRepos.templateRepo,
      scenarioRepo: mockRepos.scenarioRepo,
      strategyRepo: mockRepos.strategyRepo,
      cycleGenerator: mockCycleGenerator,
      stageGenerator: mockStageGenerator
    });
  });

  describe('initialization', () => {
    it('should initialize all repositories and generators', () => {
      expect(promptEngine.conceptRepo).toEqual(expect.objectContaining(mockRepos.conceptRepo));
      expect(promptEngine.templateRepo).toEqual(expect.objectContaining(mockRepos.templateRepo));
      expect(promptEngine.scenarioRepo).toEqual(expect.objectContaining(mockRepos.scenarioRepo));
      expect(promptEngine.strategyRepo).toEqual(expect.objectContaining(mockRepos.strategyRepo));
      expect(promptEngine.cycleGenerator).toEqual(expect.objectContaining(mockCycleGenerator));
      expect(promptEngine.stageGenerator).toEqual(expect.objectContaining(mockStageGenerator));
      expect(promptEngine.scenarioRepo).toBeDefined();
      expect(promptEngine.strategyRepo).toBeDefined();
      expect(promptEngine.cycleGenerator).toBeDefined();
      expect(promptEngine.stageGenerator).toBeDefined();
    });

    it('should log initialization statistics', () => {
      // Verify that repositories were called for stats during initialization
      expect(mockRepos.conceptRepo.getCategoryCount).toHaveBeenCalled();
      expect(mockRepos.templateRepo.getFormatCount).toHaveBeenCalled();
      expect(mockRepos.scenarioRepo.getDomainCount).toHaveBeenCalled();
      expect(mockRepos.strategyRepo.getStrategyCount).toHaveBeenCalled();
    });
  });

  describe('generateCycle', () => {
    it('should delegate to cycle generator', () => {
      const result = promptEngine.generateCycle();
      
      expect(mockCycleGenerator.generate).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expect.objectContaining({ id: 'test-cycle-123' }));
      expect(result.stages).toBeDefined();
      expect(Array.isArray(result.stages)).toBe(true);
    });

    it('should return valid cycle structure', () => {
      const cycle = promptEngine.generateCycle();
      
      expect(cycle).toHaveProperty('id');
      expect(cycle).toHaveProperty('timestamp');
      expect(cycle).toHaveProperty('stages');
      expect(Array.isArray(cycle.stages)).toBe(true);
    });
  });

  describe('regenerateStage', () => {
    it('should delegate to stage generator', () => {
      const stageName = 'Expert Engineer';
      const result = promptEngine.regenerateStage(stageName);
      
      expect(mockStageGenerator.regenerate).toHaveBeenCalledWith(stageName);
      expect(result).toEqual({
        stage: 'Expert Engineer',
        prompt: 'Test regenerated prompt',
        hashtags: ['#test', '#architecture']
      });
    });

    it('should handle different stage names', () => {
      const stageNames = ['Expert Engineer', 'System Designer', 'Leader', 'Review & Synthesis'];
      
      stageNames.forEach(stageName => {
        promptEngine.regenerateStage(stageName);
        expect(mockStageGenerator.regenerate).toHaveBeenCalledWith(stageName);
      });
    });
  });

  describe('getStats', () => {
    it('should return comprehensive statistics', () => {
      const stats = promptEngine.getStats();
      
      expect(stats).toHaveProperty('concepts');
      expect(stats).toHaveProperty('templates');
      expect(stats).toHaveProperty('scenarios');
      expect(stats).toHaveProperty('strategies');
      
      expect(mockRepos.conceptRepo.getStats).toHaveBeenCalled();
      expect(mockRepos.templateRepo.getStats).toHaveBeenCalled();
      expect(mockRepos.scenarioRepo.getStats).toHaveBeenCalled();
      expect(mockRepos.strategyRepo.getStats).toHaveBeenCalled();
    });

    it('should return properly structured stats', () => {
      const stats = promptEngine.getStats();
      
      expect(stats.concepts).toEqual(expect.objectContaining({
        totalConcepts: 10,
        categories: 3
      }));
      expect(stats.templates).toEqual(expect.objectContaining({
        totalFormats: 4,
        formatKeys: ['conceptExploration', 'tradeoffAnalysis']
      }));
    });
  });
});

describe('PromptEngine exports', () => {
  it('should export generateCycle function', async () => {
    const { generateCycle } = await import('../../../engines/prompt/PromptEngine.js');
    expect(typeof generateCycle).toBe('function');
  });

  it('should export regenerateStage function', async () => {
    const { regenerateStage } = await import('../../../engines/prompt/PromptEngine.js');
    expect(typeof regenerateStage).toBe('function');
  });

  it('should export default PromptEngine instance', async () => {
    const defaultExport = await import('../../../engines/prompt/PromptEngine.js');
    expect(defaultExport.default).toBeInstanceOf(PromptEngine);
  });
});
