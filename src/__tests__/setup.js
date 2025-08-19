/**
 * Test setup file for Vitest
 */
import { vi } from 'vitest';

// Mock logger to prevent console spam during tests
vi.mock('../utils/logger.js', () => ({
  logger: {
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    prompt: vi.fn()
  }
}));

// Global test utilities (use globalThis for cross-env compatibility)
globalThis.mockConcept = (overrides = {}) => ({
  name: 'test-concept',
  category: 'foundational',
  definition: 'Test definition',
  complexity: 'intermediate',
  components: ['comp1', 'comp2'],
  keyInsights: ['Test insight'],
  ...overrides
});

globalThis.mockContext = (overrides = {}) => ({
  name: 'test-context',
  description: 'Test context description',
  characteristics: ['scalability', 'maintainability'],
  constraints: ['resource-limits'],
  stakeholders: ['developers', 'users'],
  scenarios: [],
  ...overrides
});
