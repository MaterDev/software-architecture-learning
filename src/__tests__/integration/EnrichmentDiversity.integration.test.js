import { describe, it, expect } from 'vitest';
import { ContextEnricher } from '../../engines/prompt/services/ContextEnricher.js';

/**
 * Integration: Enrichment diversity and alignment
 */
describe('Enrichment Diversity', () => {
  it('selects WebAssembly-related technologies for webassembly domain', () => {
    const enricher = new ContextEnricher();
    const result = enricher.enrich({ domainName: 'webassembly' });
    expect(result).toBeTruthy();
    expect(result.domain?.name).toBe('webassembly');
    expect(Array.isArray(result.technologies)).toBe(true);

    const techNames = result.technologies.map(t => t.name);
    // Expect core WASM tech to be present among top selections
    expect(techNames).toContain('WebAssembly');

    // Hashtags should include domain tag
    const hashtags = result.hashtags || [];
    expect(hashtags.some(h => /#webassembly/.test(h))).toBe(true);
  });

  it('selects analytics-related technologies for analytics-data-viz domain', () => {
    const enricher = new ContextEnricher();
    const result = enricher.enrich({ domainName: 'analytics-data-viz' });
    expect(result).toBeTruthy();
    expect(result.domain?.name).toBe('analytics-data-viz');
    expect(Array.isArray(result.technologies)).toBe(true);

    const techNames = result.technologies.map(t => t.name);
    const expectedAny = ['ClickHouse', 'DuckDB', 'Grafana', 'Kafka'];
    // At least one known analytics tech should appear
    expect(techNames.some(n => expectedAny.includes(n))).toBe(true);

    // Hashtags should include domain tag
    const hashtags = result.hashtags || [];
    expect(hashtags.some(h => /#analytics-data-viz/.test(h))).toBe(true);
  });
});
