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
  constructor() {
    // Initialize data repositories
    this.conceptRepo = new ConceptRepository();
    this.templateRepo = new TemplateRepository();
    this.scenarioRepo = new ScenarioRepository();
    this.strategyRepo = new StrategyRepository();
    
    // Initialize generators
    this.cycleGenerator = new CycleGenerator({
      conceptRepo: this.conceptRepo,
      templateRepo: this.templateRepo,
      scenarioRepo: this.scenarioRepo,
      strategyRepo: this.strategyRepo
    });
    
    this.stageGenerator = new StageGenerator({
      conceptRepo: this.conceptRepo,
      templateRepo: this.templateRepo,
      scenarioRepo: this.scenarioRepo,
      strategyRepo: this.strategyRepo
    });
    
    logger.info('PromptEngine', 'Initialized with modular architecture', {
      conceptCategories: this.conceptRepo.getCategoryCount(),
      lessonFormats: this.templateRepo.getFormatCount(),
      domainContexts: this.scenarioRepo.getDomainCount(),
      obliqueStrategies: this.strategyRepo.getStrategyCount()
    });
  }

  /**
   * Generate a complete learning cycle
   */
  generateCycle() {
    return this.cycleGenerator.generate();
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
