/**
 * Stage Generator
 * Handles the generation of individual learning stages
 */
import { HashtagGenerator } from './HashtagGenerator.js';
import { TemplateEngine } from '../templates/TemplateEngine.js';
import { logger } from '../../../utils/logger.js';

export class StageGenerator {
  constructor({ conceptRepo, templateRepo, scenarioRepo, strategyRepo }) {
    this.conceptRepo = conceptRepo;
    this.templateRepo = templateRepo;
    this.scenarioRepo = scenarioRepo;
    this.strategyRepo = strategyRepo;
    
    this.hashtagGenerator = new HashtagGenerator();
    this.templateEngine = new TemplateEngine({ templateRepo });
  }

  /**
   * Generate a single learning stage
   */
  generate(roleKey, context, complexity, obliqueStrategy) {
    logger.debug('StageGenerator', `Starting stage generation for ${roleKey}`, {
      roleKey,
      hasContext: !!context,
      contextType: typeof context,
      complexity,
      hasObliqueStrategy: !!obliqueStrategy
    });

    const roleName = this.getRoleNameFromKey(roleKey);
    
    logger.debug('StageGenerator', `Role name resolved for ${roleKey}`, {
      roleKey,
      roleName,
      roleNameType: typeof roleName
    });
    
    // Select relevant concepts for this role and complexity
    logger.debug('StageGenerator', `Selecting concepts for ${roleKey}`, {
      roleKey,
      complexity,
      hasConceptRepo: !!this.conceptRepo,
      conceptRepoInitialized: this.conceptRepo?.initialized
    });
    
    const relevantConcepts = this.conceptRepo.selectRelevantConcepts(roleKey, complexity);
    
    logger.debug('StageGenerator', `Concepts selected for ${roleKey}`, {
      roleKey,
      conceptCount: relevantConcepts ? relevantConcepts.length : 0,
      conceptsType: typeof relevantConcepts,
      conceptsIsArray: Array.isArray(relevantConcepts),
      conceptNames: relevantConcepts ? relevantConcepts.map(c => c?.name || 'unnamed') : []
    });
    
    // Build educational meta-prompt
    logger.debug('StageGenerator', `Building prompt for ${roleKey}`, {
      roleKey,
      hasTemplateEngine: !!this.templateEngine,
      roleName,
      conceptCount: relevantConcepts?.length || 0
    });
    
    const prompt = this.templateEngine.buildPrompt(
      roleName,
      context,
      relevantConcepts,
      complexity,
      obliqueStrategy
    );

    logger.debug('StageGenerator', `Prompt built for ${roleKey}`, {
      roleKey,
      promptGenerated: !!prompt,
      promptType: typeof prompt,
      promptLength: prompt ? prompt.length : 0
    });

    logger.debug('StageGenerator', `Generating hashtags for ${roleKey}`, {
      roleKey,
      hasHashtagGenerator: !!this.hashtagGenerator,
      conceptsForHashtags: relevantConcepts?.length || 0
    });

    const hashtags = this.hashtagGenerator.generate(relevantConcepts, context);
    
    logger.debug('StageGenerator', `Hashtags generated for ${roleKey}`, {
      roleKey,
      hashtagsGenerated: !!hashtags,
      hashtagsType: typeof hashtags,
      hashtagsIsArray: Array.isArray(hashtags),
      hashtagCount: hashtags ? hashtags.length : 0,
      hashtagsList: hashtags || []
    });

    // Get lesson format
    logger.debug('StageGenerator', `Selecting lesson format for ${roleKey}`, {
      roleKey,
      hasTemplateRepo: !!this.templateRepo,
      conceptCount: relevantConcepts?.length || 0
    });
    
    const lessonFormat = this.templateRepo.selectLessonFormat(relevantConcepts, context, complexity);
    
    logger.debug('StageGenerator', `Lesson format selected for ${roleKey}`, {
      roleKey,
      hasLessonFormat: !!lessonFormat,
      lessonFormatType: typeof lessonFormat,
      lessonDescription: lessonFormat?.description || 'no description'
    });

    const stage = {
      stage: roleName,
      prompt,
      hashtags,
      context: context?.name || 'general',
      complexity,
      lessonType: lessonFormat?.description || 'Generated lesson',
      conceptsUsed: relevantConcepts && relevantConcepts.length > 0 ? 
        relevantConcepts.map(c => c && c.name ? c.name : 'unknown') : ['architecture'],
      timestamp: Date.now()
    };

    logger.debug('StageGenerator', `Stage object created for ${roleKey}`, {
      roleKey,
      stageKeys: Object.keys(stage),
      stageStructure: {
        hasStage: !!stage.stage,
        hasPrompt: !!stage.prompt,
        hasHashtags: !!stage.hashtags,
        hashtagsIsArray: Array.isArray(stage.hashtags),
        hashtagCount: stage.hashtags?.length || 0,
        hasContext: !!stage.context,
        hasComplexity: !!stage.complexity,
        hasLessonType: !!stage.lessonType,
        hasConceptsUsed: !!stage.conceptsUsed,
        conceptsUsedIsArray: Array.isArray(stage.conceptsUsed),
        hasTimestamp: !!stage.timestamp
      }
    });

    logger.debug('StageGenerator', `Generated ${roleKey} educational prompt`, {
      promptLength: prompt ? prompt.length : 0,
      hashtagCount: hashtags ? hashtags.length : 0,
      conceptsCount: relevantConcepts ? relevantConcepts.length : 0,
      lessonType: stage.lessonType
    });

    // Final validation before return
    if (!stage.hashtags || !Array.isArray(stage.hashtags)) {
      logger.error('StageGenerator', `CRITICAL: Stage ${roleKey} has invalid hashtags!`, {
        roleKey,
        hashtagsValue: stage.hashtags,
        hashtagsType: typeof stage.hashtags,
        stageKeys: Object.keys(stage)
      });
      // Force fallback hashtags
      stage.hashtags = ['#software-architecture', '#learning', '#fallback'];
    }

    logger.info('StageGenerator', `Stage generation complete for ${roleKey}`, {
      roleKey,
      success: true,
      finalHashtagCount: stage.hashtags.length,
      stageValid: !!(stage.stage && stage.prompt && stage.hashtags)
    });

    return stage;
  }

  /**
   * Regenerate a specific stage with new variance
   */
  regenerate(stageName) {
    logger.info('StageGenerator', `Regenerating stage: ${stageName}`);
    
    const roleKey = this.getRoleKeyFromStageName(stageName);
    const context = this.scenarioRepo.selectContext();
    const complexity = this.selectComplexityLevel();
    const obliqueStrategy = Math.random() < 0.4 ? this.strategyRepo.selectStrategy() : null;
    
    return this.generate(roleKey, context, complexity, obliqueStrategy);
  }

  /**
   * Helper method to get role key from stage name
   */
  getRoleKeyFromStageName(stageName) {
    const stageMapping = {
      'Expert Engineer': 'expertEngineer',
      'System Designer': 'systemDesigner',
      'Leader': 'leader',
      'Review & Synthesis': 'reviewSynthesis'
    };
    return stageMapping[stageName] || 'expertEngineer';
  }

  /**
   * Helper method to get role name from key
   */
  getRoleNameFromKey(roleKey) {
    const roleMapping = {
      'expertEngineer': 'Expert Engineer',
      'systemDesigner': 'System Designer',
      'leader': 'Leader',
      'reviewSynthesis': 'Review & Synthesis'
    };
    return roleMapping[roleKey] || 'Expert Engineer';
  }

  /**
   * Select complexity level with progression logic
   */
  selectComplexityLevel() {
    const complexities = ['beginner', 'intermediate', 'advanced'];
    const weights = [0.3, 0.5, 0.2]; // Favor intermediate
    
    const random = Math.random();
    let cumulativeWeight = 0;
    
    for (let i = 0; i < complexities.length; i++) {
      cumulativeWeight += weights[i];
      if (random <= cumulativeWeight) {
        return complexities[i];
      }
    }
    
    return 'intermediate';
  }
}
