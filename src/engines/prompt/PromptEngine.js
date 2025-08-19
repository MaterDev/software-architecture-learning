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
import { ContextEnricher } from './services/ContextEnricher.js';
import { createFallbackCycle as createFallback } from './core/FallbackFactory.js';
import { isFullyInitialized as isInit, reinitialize as doReinit } from './core/InitManager.js';
import { setDomainWeights as setWeights, getDomainWeights as readWeights } from './core/WeightsManager.js';
import { getStats as aggregateStats } from './core/StatsProvider.js';

export class PromptEngine {
  constructor({
    conceptRepo = null,
    templateRepo = null,
    scenarioRepo = null,
    strategyRepo = null,
    cycleGenerator = null,
    stageGenerator = null,
    domainWeights = undefined
  } = {}) {
    // Initialize data repositories (allow DI for testing)
    this.conceptRepo = conceptRepo || new ConceptRepository();
    this.templateRepo = templateRepo || new TemplateRepository();
    this.scenarioRepo = scenarioRepo || new ScenarioRepository({ domainWeights });
    this.strategyRepo = strategyRepo || new StrategyRepository();
    this.contextEnricher = new ContextEnricher();
    
    // Initialize generators (allow DI for testing)
    this.cycleGenerator = cycleGenerator || new CycleGenerator({
      conceptRepo: this.conceptRepo,
      templateRepo: this.templateRepo,
      scenarioRepo: this.scenarioRepo,
      strategyRepo: this.strategyRepo,
      contextEnricher: this.contextEnricher
    });
    
    this.stageGenerator = stageGenerator || new StageGenerator({
      conceptRepo: this.conceptRepo,
      templateRepo: this.templateRepo,
      scenarioRepo: this.scenarioRepo,
      strategyRepo: this.strategyRepo,
      contextEnricher: this.contextEnricher
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
        return createFallback();
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
    return isInit({
      conceptRepo: this.conceptRepo,
      templateRepo: this.templateRepo,
      scenarioRepo: this.scenarioRepo,
      strategyRepo: this.strategyRepo
    });
  }

  /**
   * Reinitialize repositories if needed
   */
  reinitialize() {
    return doReinit({
      conceptRepo: this.conceptRepo,
      templateRepo: this.templateRepo,
      scenarioRepo: this.scenarioRepo,
      strategyRepo: this.strategyRepo
    }, logger);
  }

  /**
   * Create a fallback cycle when generation fails
   */
  createFallbackCycle() {
    return createFallback();
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
    return aggregateStats(this);
  }

  /**
   * Update domain weighting preferences (passthrough to ScenarioRepository)
   */
  setDomainWeights(weights = {}) {
    return setWeights(this, weights, logger);
  }

  /**
   * Read current domain weighting preferences
   */
  getDomainWeights() {
    return readWeights(this, logger);
  }
}

// Export singleton instance for backward compatibility
const promptEngine = new PromptEngine();

export const generateCycle = () => promptEngine.generateCycle();
export const regenerateStage = (stageName) => promptEngine.regenerateStage(stageName);
export const setDomainWeights = (weights) => promptEngine.setDomainWeights(weights);
export const getDomainWeights = () => promptEngine.getDomainWeights();

export default promptEngine;
