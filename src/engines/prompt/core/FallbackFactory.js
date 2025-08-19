import { logger } from '../../../utils/logger.js';

/**
 * Create a fallback cycle when generation fails.
 * Kept functionally identical to the previous inline implementation.
 */
export function createFallbackCycle() {
  const timestamp = Date.now();
  try {
    logger.warn('PromptEngine', 'Using fallback cycle');
  } catch (e) { console.debug && console.debug('[PromptEngine] log suppressed:fallback', e && e.message); }
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
