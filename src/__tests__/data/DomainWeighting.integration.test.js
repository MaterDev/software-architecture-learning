import { describe, it, expect } from 'vitest';
import { ScenarioRepository } from '../../data/repositories/ScenarioRepository.js';

/**
 * Integration: Domain weighting influences selection
 */
describe('Domain weighting influences selection', () => {
  it('heavily weighted domain is selected majority of the time', () => {
    const repo = new ScenarioRepository();

    const allDomains = repo.getAllDomains().map(d => d.name);
    expect(allDomains.length).toBeGreaterThan(0);

    const target = allDomains.includes('webassembly') ? 'webassembly' : allDomains[0];

    // Skew weights strongly toward target
    const overrides = {};
    allDomains.forEach(name => { overrides[name] = name === target ? 100 : 1; });
    repo.setDomainWeights(overrides);

    const trials = 300;
    let selectedTarget = 0;
    for (let i = 0; i < trials; i++) {
      const ctx = repo.selectContext();
      if (ctx?.name === target) selectedTarget++;
    }

    const ratio = selectedTarget / trials;
    // With 100:1 weighting, we should see dominant selection comfortably > 0.6
    expect(ratio).toBeGreaterThan(0.6);
  });
});
