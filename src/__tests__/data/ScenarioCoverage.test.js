import { describe, it, expect } from 'vitest';
import { ScenarioRepository } from '../../data/repositories/ScenarioRepository.js';

/**
 * Repository: Scenario data coverage and diversity
 */
describe('Scenario data coverage', () => {
  it('has adequate average scenarios per domain and covers preferred domains', () => {
    const repo = new ScenarioRepository();
    const stats = repo.getStats();

    expect(stats.totalDomains).toBeGreaterThan(0);
    // Ensure reasonable average scenarios per domain
    expect(stats.averageScenariosPerDomain).toBeGreaterThanOrEqual(2);

    // Preferred domains must exist and have at least 2 scenarios each
    const preferred = [
      'entertainment-arts',
      'comics',
      'graphic-apps',
      'creative-coding',
      'server-side-development',
      'scripting-tooling',
      'analytics-data-viz',
      'computer-graphics',
      'webassembly',
      'tauri',
      'javascript',
      'typescript',
      'go',
      'rust',
      'payment-systems',
      'devops',
      'software-distribution',
      'generative-ai',
      'app-development'
    ];

    preferred.forEach((name) => {
      const d = repo.getDomain(name);
      expect(d, `Domain missing: ${name}`).toBeTruthy();
      expect(Array.isArray(d.scenarios)).toBe(true);
      expect(d.scenarios.length, `Insufficient scenarios for ${name}`).toBeGreaterThanOrEqual(2);
    });
  });
});
