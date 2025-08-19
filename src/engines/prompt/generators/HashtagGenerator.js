/**
 * Hashtag Generator
 * Handles the generation of contextual hashtags for learning stages
 */
import { logger } from '../../../utils/logger.js';

export class HashtagGenerator {
  /**
   * Generate contextual hashtags based on concepts and context
   */
  generate(concepts, context) {
    logger.debug('HashtagGenerator', 'Starting hashtag generation', {
      hasConceptsInput: !!concepts,
      conceptsType: typeof concepts,
      conceptsIsArray: Array.isArray(concepts),
      conceptCount: concepts?.length || 0,
      hasContextInput: !!context,
      contextType: typeof context,
      contextName: context?.name || 'unknown'
    });

    try {
      const hashtags = [];

      // Add concept-based hashtags
      logger.debug('HashtagGenerator', 'Processing concept-based hashtags', {
        conceptsAvailable: !!(concepts && Array.isArray(concepts)),
        conceptCount: concepts?.length || 0
      });

      if (concepts && Array.isArray(concepts)) {
        concepts.forEach((concept, index) => {
          logger.debug('HashtagGenerator', `Processing concept ${index}`, {
            index,
            hasConcept: !!concept,
            conceptType: typeof concept,
            hasGetHashtag: !!(concept && typeof concept.getHashtag === 'function'),
            conceptName: concept?.name || 'unnamed'
          });

          if (concept && concept.getHashtag) {
            const conceptHashtag = concept.getHashtag();
            hashtags.push(conceptHashtag);

            logger.debug('HashtagGenerator', `Added concept hashtag`, {
              conceptIndex: index,
              conceptName: concept.name,
              hashtag: conceptHashtag
            });

            // Add component hashtags
            if (typeof concept.getComponentHashtags === 'function') {
              const componentHashtags = concept.getComponentHashtags(2);
              hashtags.push(...componentHashtags);

              logger.debug('HashtagGenerator', `Added component hashtags`, {
                conceptIndex: index,
                conceptName: concept.name,
                componentHashtags,
                componentCount: componentHashtags.length
              });
            }
          } else {
            logger.warn('HashtagGenerator', `Concept ${index} missing getHashtag method`, {
              index,
              conceptType: typeof concept,
              conceptKeys: concept ? Object.keys(concept) : []
            });
          }
        });
      }

      // Add context-based hashtags
      logger.debug('HashtagGenerator', 'Processing context-based hashtags', {
        hasContext: !!context,
        hasGetHashtags: !!(context && typeof context.getHashtags === 'function'),
        contextName: context?.name
      });

      if (context && context.getHashtags) {
        const contextHashtags = context.getHashtags();
        hashtags.push(...contextHashtags);

        logger.debug('HashtagGenerator', 'Added context hashtags', {
          contextHashtags,
          contextHashtagCount: contextHashtags.length
        });

        // Add scenario-specific hashtags
        if (typeof context.getScenarioHashtags === 'function') {
          const scenarioHashtags = context.getScenarioHashtags();
          hashtags.push(...scenarioHashtags);

          logger.debug('HashtagGenerator', 'Added scenario hashtags', {
            scenarioHashtags,
            scenarioHashtagCount: scenarioHashtags.length
          });
        }
      }

      logger.debug('HashtagGenerator', 'Hashtag collection before deduplication', {
        totalHashtags: hashtags.length,
        hashtagsList: hashtags
      });

      // Ensure we always have at least some default hashtags
      if (hashtags.length === 0) {
        logger.warn('HashtagGenerator', 'No hashtags generated, using defaults');
        hashtags.push('#software-architecture', '#learning', '#engineering');
      }

      const finalHashtags = [...new Set(hashtags)]; // Remove duplicates

      logger.debug('HashtagGenerator', 'Hashtag generation complete', {
        originalCount: hashtags.length,
        finalCount: finalHashtags.length,
        duplicatesRemoved: hashtags.length - finalHashtags.length,
        finalHashtags
      });

      return finalHashtags;
    } catch (error) {
      logger.error('HashtagGenerator', 'Error during hashtag generation', {
        error: error.message,
        stack: error.stack,
        errorType: error.constructor.name,
        conceptsInput: concepts,
        contextInput: context
      });
      
      // Fallback hashtags if anything goes wrong
      const fallbackHashtags = ['#software-architecture', '#learning', '#engineering'];
      
      logger.warn('HashtagGenerator', 'Using fallback hashtags due to error', {
        fallbackHashtags
      });
      
      return fallbackHashtags;
    }
  }

  /**
   * Generate hashtags for specific role
   */
  generateForRole(concepts, context, roleKey) {
    const baseHashtags = this.generate(concepts, context);
    
    // Add role-specific hashtags
    const roleHashtags = {
      'expertEngineer': ['#implementation', '#technical-depth'],
      'systemDesigner': ['#architecture-design', '#system-thinking'],
      'leader': ['#leadership', '#decision-making'],
      'reviewSynthesis': ['#synthesis', '#reflection']
    };

    const roleSpecific = roleHashtags[roleKey] || [];
    return [...new Set([...baseHashtags, ...roleSpecific])];
  }
}
