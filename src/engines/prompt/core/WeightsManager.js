import { logger as defaultLogger } from '../../../utils/logger.js';

export function setDomainWeights(engine, weights = {}, logger = defaultLogger) {
  try {
    logger.debug('PromptEngine', 'setDomainWeights:input', { keys: Object.keys(weights || {}) });
  } catch (e) { console.debug && console.debug('[PromptEngine] log suppressed:setDomainWeights:input', e && e.message); }
  const repo = engine?.scenarioRepo;
  if (repo?.setDomainWeights) {
    const before = repo?.getDomainWeights ? repo.getDomainWeights() : {};
    repo.setDomainWeights(weights);
    const after = repo?.getDomainWeights ? repo.getDomainWeights() : {};
    try {
      const changedKeys = Object.keys(weights || {});
      const changed = changedKeys.reduce((acc, k) => {
        acc[k] = { from: before[k], to: after[k] };
        return acc;
      }, {});
      logger.info('PromptEngine', 'setDomainWeights:applied', { changedKeys, changed });
    } catch (e) { console.debug && console.debug('[PromptEngine] log suppressed:setDomainWeights:applied', e && e.message); }
  }
}

export function getDomainWeights(engine, logger = defaultLogger) {
  const repo = engine?.scenarioRepo;
  const out = repo?.getDomainWeights ? repo.getDomainWeights() : {};
  try {
    const sample = Object.fromEntries(Object.entries(out).slice(0, 8));
    logger.debug('PromptEngine', 'getDomainWeights:read', { count: Object.keys(out || {}).length, sample });
  } catch (e) { console.debug && console.debug('[PromptEngine] log suppressed:getDomainWeights:read', e && e.message); }
  return out;
}
