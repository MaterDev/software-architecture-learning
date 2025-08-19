/**
 * Stats aggregation utilities for PromptEngine.
 */
export function getStats(engine) {
  const conceptStats = engine?.conceptRepo?.getStats ? engine.conceptRepo.getStats() : {};
  const templateStats = engine?.templateRepo?.getStats ? engine.templateRepo.getStats() : {};
  const scenarioStats = engine?.scenarioRepo?.getStats ? engine.scenarioRepo.getStats() : {};
  const strategyStats = engine?.strategyRepo?.getStats ? engine.strategyRepo.getStats() : {};
  return {
    concepts: conceptStats,
    templates: templateStats,
    scenarios: scenarioStats,
    strategies: strategyStats,
  };
}
