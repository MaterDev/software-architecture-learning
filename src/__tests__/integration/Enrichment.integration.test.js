import { describe, it, expect } from 'vitest';
import { generateCycle } from '../../engines/prompt/PromptEngine.js';

/**
 * Integration: Enrichment presence in generated stages
 */
describe('Enrichment Integration', () => {
  it('includes enrichment and technologiesUsed in each stage', () => {
    const cycle = generateCycle();
    expect(cycle).toBeTruthy();
    expect(Array.isArray(cycle.stages)).toBe(true);
    expect(cycle.stages.length).toBeGreaterThan(0);

    for (const stage of cycle.stages) {
      expect(stage).toBeTruthy();
      // technologiesUsed should be present and an array (may be empty)
      expect(Object.prototype.hasOwnProperty.call(stage, 'technologiesUsed')).toBe(true);
      expect(Array.isArray(stage.technologiesUsed)).toBe(true);

      // enrichment object should be present with hashtags array (may be empty)
      expect(Object.prototype.hasOwnProperty.call(stage, 'enrichment')).toBe(true);
      const hashtags = stage.enrichment?.hashtags;
      expect(Array.isArray(hashtags)).toBe(true);
    }
  });
});
