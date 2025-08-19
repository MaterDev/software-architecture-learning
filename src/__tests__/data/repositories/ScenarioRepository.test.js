import { describe, it, expect } from 'vitest';
import { ScenarioRepository } from '../../../data/repositories/ScenarioRepository.js';
import canonicalData from '../../../data/sources/contextual-scenarios.json';

describe('ScenarioRepository (guardrails)', () => {
  it('should load canonical contextual-scenarios from sources path', () => {
    const repo = new ScenarioRepository();

    // Basic shape
    expect(repo.data).toBeTruthy();
    expect(repo.data.domainContexts).toBeTruthy();

    // Must not include keys that only exist in the deprecated file
    expect(repo.data.organizationalContexts).toBeUndefined();
    expect(repo.data.technicalContexts).toBeUndefined();
    expect(repo.data.constraintPatterns).toBeUndefined();

    // Ensure domains present only in canonical file exist
    expect(repo.getDomain('webassembly')).toBeTruthy();
    expect(repo.getDomain('entertainment-arts')).toBeTruthy();
    expect(repo.getDomain('analytics-data-viz')).toBeTruthy();

    // Cross-check with canonical JSON content
    const canonicalKeys = Object.keys(canonicalData.domainContexts);
    canonicalKeys.forEach(k => {
      expect(repo.getDomain(k)).toBeTruthy();
    });
  });

  it('should align Context helper keys with domain keys', () => {
    const repo = new ScenarioRepository();

    const webasm = repo.getDomain('webassembly');
    expect(webasm).toBeTruthy();
    // getTechnicalChallenges returns constraints when present
    expect(webasm.getTechnicalChallenges()).toMatch(/sandbox-limits|binary-size|sandboxing/i);

    const analytics = repo.getDomain('analytics-data-viz');
    expect(analytics).toBeTruthy();
    expect(analytics.getTechnicalChallenges()).toMatch(/pii|cost-per-query/i);

    const go = repo.getDomain('go');
    expect(go).toBeTruthy();
    expect(go.getTechnicalChallenges()).toMatch(/binary-size|gc-latency/i);
  });
});
