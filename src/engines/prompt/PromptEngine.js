/**
 * Main Prompt Generation Engine
 * Orchestrates the entire prompt generation process using modular components
 */
import { CycleGenerator } from './generators/CycleGenerator.js';
import { StageGenerator } from './generators/StageGenerator.js';
import { ConceptRepository } from '../../data/repositories/ConceptRepository.js';
import { TemplateRepository } from '../../data/repositories/TemplateRepository.js';
import { ScenarioRepository } from '../../data/repositories/ScenarioRepository.js';
import { StrategyRepository } from '../../data/repositories/StrategyRepository.js';
import { logger } from '../../utils/logger.js';

export class PromptEngine {
  constructor({
    conceptRepo = null,
    templateRepo = null,
    scenarioRepo = null,
    strategyRepo = null,
    cycleGenerator = null,
    stageGenerator = null
  } = {}) {
    // Initialize data repositories (allow DI for testing)
    this.conceptRepo = conceptRepo || new ConceptRepository();
    this.templateRepo = templateRepo || new TemplateRepository();
    this.scenarioRepo = scenarioRepo || new ScenarioRepository();
    this.strategyRepo = strategyRepo || new StrategyRepository();
    
    // Initialize generators (allow DI for testing)
    this.cycleGenerator = cycleGenerator || new CycleGenerator({
      conceptRepo: this.conceptRepo,
      templateRepo: this.templateRepo,
      scenarioRepo: this.scenarioRepo,
      strategyRepo: this.strategyRepo
    });
    
    this.stageGenerator = stageGenerator || new StageGenerator({
      conceptRepo: this.conceptRepo,
      templateRepo: this.templateRepo,
      scenarioRepo: this.scenarioRepo,
      strategyRepo: this.strategyRepo
    });
    
    // Safe logging in case DI passes partial mocks
    try {
      logger.info('PromptEngine', 'Initialized with modular architecture', {
        conceptCategories: this.conceptRepo?.getCategoryCount?.(),
        lessonFormats: this.templateRepo?.getFormatCount?.(),
        domainContexts: this.scenarioRepo?.getDomainCount?.(),
        obliqueStrategies: this.strategyRepo?.getStrategyCount?.()
      });
    } catch (e) {
      logger.warn('PromptEngine', 'Initialization stats logging encountered an issue', { error: e?.message });
    }
  }

  /**
   * Generate a complete learning cycle
   */
  generateCycle() {
    // Ensure all repositories are properly initialized before generation
    if (!this.isFullyInitialized()) {
      logger.warn('PromptEngine', 'Repositories not fully initialized, reinitializing...');
      this.reinitialize();
    }
    
    try {
      const cycle = this.cycleGenerator.generate();
      // Normalize structure to meet contract even with mocked generators
      if (!cycle || typeof cycle !== 'object') {
        return this.createFallbackCycle();
      }
      if (typeof cycle.timestamp !== 'number') {
        cycle.timestamp = Date.now();
      }
      if (!cycle.id) {
        const rand = Math.random().toString(36).slice(2, 8);
        cycle.id = `cycle-${cycle.timestamp}-${rand}`;
      }
      if (!Array.isArray(cycle.stages)) {
        cycle.stages = [];
      }
      return cycle;
    } catch (error) {
      logger.error('PromptEngine', 'Failed to generate cycle', { error });
      // Return a fallback cycle to prevent UI crashes
      return this.createFallbackCycle();
    }
  }

  /**
   * Check if all repositories are properly initialized
   */
  isFullyInitialized() {
    return this.conceptRepo?.initialized && 
           this.templateRepo?.initialized && 
           this.scenarioRepo?.initialized && 
           this.strategyRepo?.initialized;
  }

  /**
   * Reinitialize repositories if needed
   */
  reinitialize() {
    try {
      if (!this.conceptRepo?.initialized) {
        this.conceptRepo.initializeCache();
      }
      if (!this.templateRepo?.initialized) {
        this.templateRepo.initializeCache();
      }
      if (!this.scenarioRepo?.initialized) {
        this.scenarioRepo.initializeCache();
      }
      if (!this.strategyRepo?.initialized) {
        this.strategyRepo.initializeCache();
      }
    } catch (error) {
      logger.error('PromptEngine', 'Failed to reinitialize repositories', { error });
    }
  }

  /**
   * Create a fallback cycle when generation fails
   */
  createFallbackCycle() {
    const timestamp = Date.now();
    return {
      id: `fallback-cycle-${timestamp}`,
      timestamp,
      context: { name: 'general', domain: 'software-architecture' },
      complexity: 'intermediate',
      obliqueStrategy: null,
      stages: [
        {
          stage: 'Expert Engineer',
          prompt: 'Fallback prompt: Explore software architecture fundamentals and design patterns.',
          hashtags: ['#software-architecture', '#design-patterns', '#engineering'],
          context: 'general',
          complexity: 'intermediate',
          lessonType: 'Foundational concepts',
          conceptsUsed: ['software-architecture'],
          timestamp
        },
        {
          stage: 'System Designer',
          prompt: 'Fallback prompt: Design scalable systems with proper architectural decisions.',
          hashtags: ['#system-design', '#scalability', '#architecture'],
          context: 'general',
          complexity: 'intermediate',
          lessonType: 'System design',
          conceptsUsed: ['system-design'],
          timestamp
        },
        {
          stage: 'Leader',
          prompt: 'Fallback prompt: Lead architectural decisions and communicate technical vision.',
          hashtags: ['#leadership', '#technical-vision', '#communication'],
          context: 'general',
          complexity: 'intermediate',
          lessonType: 'Leadership skills',
          conceptsUsed: ['leadership'],
          timestamp
        },
        {
          stage: 'Review & Synthesis',
          prompt: 'Fallback prompt: Review architectural decisions and synthesize learnings.',
          hashtags: ['#review', '#synthesis', '#reflection'],
          context: 'general',
          complexity: 'intermediate',
          lessonType: 'Reflection and synthesis',
          conceptsUsed: ['reflection'],
          timestamp
        }
      ],
      metadata: {
        generationApproach: 'fallback-mode',
        dataVersion: '3.0.0',
        generator: 'PromptEngine-Fallback'
      }
    };
  }

  /**
   * Regenerate a specific stage
   */
  regenerateStage(stageName) {
    return this.stageGenerator.regenerate(stageName);
  }

  /**
   * Get engine statistics
   */
  getStats() {
    return {
      concepts: this.conceptRepo.getStats(),
      templates: this.templateRepo.getStats(),
      scenarios: this.scenarioRepo.getStats(),
      strategies: this.strategyRepo.getStats()
    };
  }
}

// Export singleton instance for backward compatibility
const promptEngine = new PromptEngine();

export const generateCycle = () => promptEngine.generateCycle();
export const regenerateStage = (stageName) => promptEngine.regenerateStage(stageName);

export default promptEngine;
