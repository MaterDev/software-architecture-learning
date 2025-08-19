/**
 * Cycle Generator
 * Handles the generation of complete learning cycles
 */
import { StageGenerator } from './StageGenerator.js';
import { ComplexitySelector } from '../selectors/ComplexitySelector.js';
import { logger } from '../../../utils/logger.js';
import { ContextEnricher } from '../services/ContextEnricher.js';

export class CycleGenerator {
  constructor({ conceptRepo, templateRepo, scenarioRepo, strategyRepo, contextEnricher } = {}) {
    this.conceptRepo = conceptRepo;
    this.templateRepo = templateRepo;
    this.scenarioRepo = scenarioRepo;
    this.strategyRepo = strategyRepo;
    
    this.stageGenerator = new StageGenerator({
      conceptRepo,
      templateRepo,
      scenarioRepo,
      strategyRepo,
      contextEnricher
    });
    
    this.complexitySelector = new ComplexitySelector();
    this.contextEnricher = contextEnricher || new ContextEnricher();
  }

  /**
   * Generate a complete learning cycle
   */
  generate() {
    // Monotonic timestamp to avoid collisions in rapid generations
    const nowRaw = Date.now();
    this._lastTs = this._lastTs || 0;
    const timestamp = nowRaw <= this._lastTs ? this._lastTs + 1 : nowRaw;
    this._lastTs = timestamp;
    logger.info('CycleGenerator', 'Generating new learning cycle');

    // Log repository states
    logger.debug('CycleGenerator', 'Repository initialization status', {
      conceptRepo: {
        initialized: this.conceptRepo?.initialized,
        hasData: !!this.conceptRepo?.data,
        cacheSize: this.conceptRepo?.conceptCache?.size || 0
      },
      templateRepo: {
        initialized: this.templateRepo?.initialized,
        hasData: !!this.templateRepo?.data
      },
      scenarioRepo: {
        initialized: this.scenarioRepo?.initialized,
        hasData: !!this.scenarioRepo?.data
      },
      strategyRepo: {
        initialized: this.strategyRepo?.initialized,
        hasData: !!this.strategyRepo?.data
      }
    });

    // Select contextual scenario for the entire cycle
    logger.debug('CycleGenerator', 'Selecting context and complexity');
    const selectedContext = this.scenarioRepo.selectContext();
    const selectedComplexity = this.complexitySelector.select();
    
    logger.debug('CycleGenerator', 'Context and complexity selected', {
      context: selectedContext?.name || 'null',
      contextType: typeof selectedContext,
      complexity: selectedComplexity,
      hasContextToJSON: typeof selectedContext?.toJSON === 'function'
    });
    
    // Generate oblique strategy for additional variance (30% chance)
    const obliqueStrategy = Math.random() < 0.3 ? this.strategyRepo.selectStrategy() : null;
    
    logger.debug('CycleGenerator', 'Oblique strategy selection', {
      hasStrategy: !!obliqueStrategy,
      strategyType: typeof obliqueStrategy
    });

    // Compute enrichment once per cycle
    const enrichment = this.contextEnricher.enrich({ domainName: selectedContext?.name });

    const stages = [];
    const roleKeys = ['expertEngineer', 'systemDesigner', 'leader', 'reviewSynthesis'];
    
    logger.debug('CycleGenerator', 'Starting stage generation', {
      roleCount: roleKeys.length,
      roles: roleKeys
    });
  
    for (const roleKey of roleKeys) {
      logger.debug('CycleGenerator', `Generating stage for role: ${roleKey}`, {
        roleKey,
        hasStageGenerator: !!this.stageGenerator,
        contextAvailable: !!selectedContext,
        complexitySet: !!selectedComplexity
      });
      
      try {
        const stage = this.stageGenerator.generate(
          roleKey,
          selectedContext,
          selectedComplexity,
          obliqueStrategy,
          { enrichment }
        );
        
        logger.debug('CycleGenerator', `Stage generation result for ${roleKey}`, {
          roleKey,
          stageGenerated: !!stage,
          stageType: typeof stage,
          hasStage: stage ? !!stage.stage : false,
          hasPrompt: stage ? !!stage.prompt : false,
          hasHashtags: stage ? !!stage.hashtags : false,
          hashtagsType: stage ? typeof stage.hashtags : 'undefined',
          hashtagsLength: stage?.hashtags ? stage.hashtags.length : 0,
          stageKeys: stage ? Object.keys(stage) : []
        });
        
        if (stage) {
          // Validate stage structure before adding
          if (!stage.hashtags) {
            logger.warn('CycleGenerator', `Stage ${roleKey} missing hashtags, adding fallback`, {
              roleKey,
              stageStructure: Object.keys(stage)
            });
            stage.hashtags = ['#software-architecture', '#learning'];
          }
          
          stages.push(stage);
          logger.debug('CycleGenerator', `Successfully added stage for ${roleKey}`, {
            roleKey,
            stageCount: stages.length,
            finalHashtagsLength: stage.hashtags.length
          });
        } else {
          logger.warn('CycleGenerator', `Stage generation returned null for role: ${roleKey}`);
          // Add fallback stage
          const fallbackStage = {
            stage: roleKey,
            prompt: 'Fallback prompt due to generation error',
            hashtags: ['#software-architecture', '#learning'],
            context: selectedContext?.name || 'general',
            complexity: selectedComplexity,
            lessonType: 'Fallback lesson',
            conceptsUsed: ['architecture'],
            technologiesUsed: Array.isArray(enrichment?.technologies) ? enrichment.technologies.map(t => t?.name).filter(Boolean) : [],
            enrichment,
            timestamp: Date.now()
          };
          stages.push(fallbackStage);
          logger.debug('CycleGenerator', `Added fallback stage for ${roleKey}`, {
            roleKey,
            fallbackStage: Object.keys(fallbackStage)
          });
        }
      } catch (error) {
        logger.error('CycleGenerator', `Error generating stage for role: ${roleKey}`, { 
          roleKey,
          error: error.message,
          stack: error.stack,
          errorType: error.constructor.name
        });
        // Add fallback stage
        const fallbackStage = {
          stage: roleKey,
          prompt: 'Fallback prompt due to generation error',
          hashtags: ['#software-architecture', '#learning'],
          context: selectedContext?.name || 'general',
          complexity: selectedComplexity,
          lessonType: 'Fallback lesson',
          conceptsUsed: ['architecture'],
          technologiesUsed: Array.isArray(enrichment?.technologies) ? enrichment.technologies.map(t => t?.name).filter(Boolean) : [],
          enrichment,
          timestamp: Date.now()
        };
        stages.push(fallbackStage);
        logger.debug('CycleGenerator', `Added error fallback stage for ${roleKey}`, {
          roleKey,
          errorFallback: Object.keys(fallbackStage)
        });
      }
    }
    
    logger.debug('CycleGenerator', 'Stage generation complete', {
      totalStages: stages.length,
      expectedStages: roleKeys.length,
      stageValidation: stages.map((stage, index) => ({
        index,
        hasStage: !!stage,
        stageName: stage?.stage,
        hasHashtags: !!stage?.hashtags,
        hashtagsIsArray: Array.isArray(stage?.hashtags),
        hashtagCount: stage?.hashtags?.length || 0
      }))
    });

    // Validate and sanitize all stages before creating cycle
    const validatedStages = stages.map((stage, index) => {
      if (!stage) {
        logger.error('CycleGenerator', `Stage ${index} is null, creating fallback`);
        return {
          stage: `Stage-${index}`,
          prompt: 'Fallback prompt due to null stage',
          hashtags: ['#software-architecture', '#learning'],
          context: selectedContext?.name || 'general',
          complexity: selectedComplexity,
          lessonType: 'Fallback lesson',
          conceptsUsed: ['architecture'],
          technologiesUsed: Array.isArray(enrichment?.technologies) ? enrichment.technologies.map(t => t?.name).filter(Boolean) : [],
          enrichment,
          timestamp
        };
      }
      
      // Ensure stage has all required properties
      return {
        stage: stage.stage || `Stage-${index}`,
        prompt: stage.prompt || 'Fallback prompt',
        hashtags: Array.isArray(stage.hashtags) ? stage.hashtags : ['#software-architecture', '#learning'],
        context: stage.context || selectedContext?.name || 'general',
        complexity: stage.complexity || selectedComplexity,
        lessonType: stage.lessonType || 'Generated lesson',
        conceptsUsed: Array.isArray(stage.conceptsUsed) ? stage.conceptsUsed : ['architecture'],
        technologiesUsed: Array.isArray(stage.technologiesUsed) ? stage.technologiesUsed : [],
        enrichment: stage.enrichment || enrichment || null,
        audit: stage.audit || null,
        timestamp: stage.timestamp || timestamp
      };
    });

    // Ensure unique cycle IDs even under rapid successive generations
    this._inc = (this._inc || 0) + 1;
    const rand = Math.random().toString(36).slice(2, 8);
    const cycle = {
      id: `cycle-${timestamp}-${this._inc}-${rand}`,
      timestamp,
      context: selectedContext?.toJSON() || { name: 'general', domain: 'software-architecture' },
      complexity: selectedComplexity,
      obliqueStrategy: obliqueStrategy ? obliqueStrategy.toJSON() : null,
      stages: validatedStages,
      metadata: {
        generationApproach: 'modular-architecture',
        dataVersion: '3.0.0',
        generator: 'CycleGenerator'
      },
      // Cycle-level audit metadata for UI and logging
      audit: {
        context: typeof selectedContext?.toJSON === 'function' ? selectedContext.toJSON() : { name: selectedContext?.name },
        complexity: selectedComplexity,
        obliqueStrategy: obliqueStrategy && typeof obliqueStrategy.toJSON === 'function' ? obliqueStrategy.toJSON() : (obliqueStrategy || null),
        enrichment,
        roles: roleKeys,
        stageSummaries: validatedStages.map(s => ({
          stage: s.stage,
          lessonType: s.lessonType,
          conceptsUsed: s.conceptsUsed,
          technologiesUsed: s.technologiesUsed,
          timestamp: s.timestamp
        }))
      }
    };

    logger.prompt('CycleGenerator', 'Learning cycle generated', {
      cycleId: cycle.id,
      context: selectedContext.name,
      complexity: selectedComplexity,
      hasObliqueStrategy: !!obliqueStrategy,
      stageCount: stages.length,
      audit: {
        contextName: cycle.audit?.context?.name,
        technologies: Array.isArray(enrichment?.technologies) ? enrichment.technologies.map(t => t?.name).filter(Boolean) : [],
        domain: enrichment?.domain?.name || null,
        roles: roleKeys,
        stageNames: validatedStages.map(s => s.stage)
      }
    });

    return cycle;
  }

  /**
   * Generate cycle with specific parameters (for testing)
   */
  generateWithParams(context, complexity, obliqueStrategy = null) {
    // Monotonic timestamp to avoid collisions
    const nowRaw = Date.now();
    this._lastTs = this._lastTs || 0;
    const timestamp = nowRaw <= this._lastTs ? this._lastTs + 1 : nowRaw;
    this._lastTs = timestamp;
    
    const stages = [
      this.stageGenerator.generate('expertEngineer', context, complexity, obliqueStrategy),
      this.stageGenerator.generate('systemDesigner', context, complexity, obliqueStrategy),
      this.stageGenerator.generate('leader', context, complexity, obliqueStrategy),
      this.stageGenerator.generate('reviewSynthesis', context, complexity, obliqueStrategy)
    ];

    this._inc = (this._inc || 0) + 1;
    const rand = Math.random().toString(36).slice(2, 8);
    return {
      id: `cycle-${timestamp}-${this._inc}-${rand}`,
      timestamp,
      context: context.toJSON(),
      complexity,
      obliqueStrategy: obliqueStrategy ? obliqueStrategy.toJSON() : null,
      stages,
      metadata: {
        generationApproach: 'modular-architecture',
        dataVersion: '3.0.0',
        generator: 'CycleGenerator'
      }
    };
  }
}
