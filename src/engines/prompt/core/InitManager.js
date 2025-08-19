import { logger as defaultLogger } from '../../../utils/logger.js';

/**
 * Initialization utilities for PromptEngine repositories.
 */
export function isFullyInitialized({ conceptRepo, templateRepo, scenarioRepo, strategyRepo }) {
  return Boolean(
    conceptRepo?.initialized &&
    templateRepo?.initialized &&
    scenarioRepo?.initialized &&
    strategyRepo?.initialized
  );
}

export function reinitialize({ conceptRepo, templateRepo, scenarioRepo, strategyRepo }, logger = defaultLogger) {
  try {
    if (!conceptRepo?.initialized && conceptRepo?.initializeCache) {
      conceptRepo.initializeCache();
    }
    if (!templateRepo?.initialized && templateRepo?.initializeCache) {
      templateRepo.initializeCache();
    }
    if (!scenarioRepo?.initialized && scenarioRepo?.initializeCache) {
      scenarioRepo.initializeCache();
    }
    if (!strategyRepo?.initialized && strategyRepo?.initializeCache) {
      strategyRepo.initializeCache();
    }
  } catch (error) {
    try { logger.error('PromptEngine', 'Failed to reinitialize repositories', { error }); }
    catch (e) { console.debug && console.debug('[PromptEngine] log suppressed:reinitialize', e && e.message); }
  }
}
