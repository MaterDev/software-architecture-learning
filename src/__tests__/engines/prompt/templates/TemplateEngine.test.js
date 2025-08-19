/**
 * TemplateEngine Tests
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TemplateEngine } from '../../../../engines/prompt/templates/TemplateEngine.js';
import { VariableBuilder } from '../../../../engines/prompt/templates/VariableBuilder.js';
import { Concept } from '../../../../data/models/Concept.js';
import { Context } from '../../../../data/models/Context.js';
import { LessonTemplate } from '../../../../data/models/LessonTemplate.js';

describe('TemplateEngine', () => {
  let templateEngine;
  let mockTemplateRepo;
  let mockConcepts;
  let mockContext;

  beforeEach(() => {
    // Mock template repository
    mockTemplateRepo = {
      selectLessonFormat: vi.fn(),
      getRoleInstructions: vi.fn()
    };

    // Mock lesson template
    const mockLessonTemplate = new LessonTemplate({
      key: 'conceptExploration',
      description: 'Test lesson format',
      structure: ['## Overview', '## Details', '## Examples'],
      instructionalGuidance: 'Guide the reader through {concept} in {context}.',
      deliverables: {
        beginner: {
          'expert engineer': ['Implementation example', 'Key principles']
        }
      }
    });

    mockTemplateRepo.selectLessonFormat.mockReturnValue(mockLessonTemplate);
    mockTemplateRepo.getRoleInstructions.mockReturnValue({
      focus: 'Technical implementation details',
      tone: 'Practical and hands-on'
    });

    templateEngine = new TemplateEngine({ templateRepo: mockTemplateRepo });

    // Mock concepts
    mockConcepts = [
      new Concept({
        name: 'modularity',
        category: 'foundational',
        definition: 'Breaking systems into cohesive modules',
        complexity: 'intermediate',
        components: ['cohesion', 'coupling'],
        keyInsights: ['High cohesion, low coupling']
      })
    ];

    // Mock context
    mockContext = new Context({
      name: 'ecommerce',
      description: 'Online retail systems',
      characteristics: ['scalability', 'availability'],
      constraints: ['seasonal-traffic'],
      stakeholders: ['customers', 'merchants']
    });
  });

  describe('buildPrompt', () => {
    it('should build complete educational prompt', () => {
      const prompt = templateEngine.buildPrompt(
        'Expert Engineer',
        mockContext,
        mockConcepts,
        'intermediate',
        null
      );

      expect(prompt).toContain('# Educational Lesson Generation Prompt');
      expect(prompt).toContain('modularity');
      expect(prompt).toContain('Expert Engineer');
      expect(prompt).toContain('## Overview');
      expect(prompt).toContain('## Details');
      expect(prompt).toContain('## Examples');
    });

    it('should interpolate template variables', () => {
      const prompt = templateEngine.buildPrompt(
        'Expert Engineer',
        mockContext,
        mockConcepts,
        'intermediate',
        null
      );

      // Should replace {concept} and {context} placeholders
      expect(prompt).toContain('modularity in ecommerce');
      expect(prompt).not.toContain('{concept}');
      expect(prompt).not.toContain('{context}');
    });

    it('should include role-specific instructions', () => {
      const prompt = templateEngine.buildPrompt(
        'Expert Engineer',
        mockContext,
        mockConcepts,
        'intermediate',
        null
      );

      expect(prompt).toContain('## Expert Engineer Perspective');
      expect(prompt).toContain('Technical implementation details');
      expect(prompt).toContain('**Key Deliverables:**');
    });

    it('should include contextual guidance', () => {
      const prompt = templateEngine.buildPrompt(
        'Expert Engineer',
        mockContext,
        mockConcepts,
        'intermediate',
        null
      );

      expect(prompt).toContain('## Domain Context: ecommerce');
      expect(prompt).toContain('Online retail systems');
      expect(prompt).toContain('**Technical Challenges**');
      expect(prompt).toContain('**Business Context**');
    });

    it('should include concept guidance', () => {
      const prompt = templateEngine.buildPrompt(
        'Expert Engineer',
        mockContext,
        mockConcepts,
        'intermediate',
        null
      );

      expect(prompt).toContain('## Concept Focus');
      expect(prompt).toContain('**modularity** (intermediate)');
      expect(prompt).toContain('Breaking systems into cohesive modules');
    });

    it('should include oblique strategy when provided', () => {
      const mockStrategy = {
        getFormattedText: () => '**Oblique Strategy**: Think sideways',
        getIntegrationGuidance: () => 'Consider alternative approaches'
      };

      const prompt = templateEngine.buildPrompt(
        'Expert Engineer',
        mockContext,
        mockConcepts,
        'intermediate',
        mockStrategy
      );

      expect(prompt).toContain('## Creative Approach');
      expect(prompt).toContain('Think sideways');
      expect(prompt).toContain('Consider alternative approaches');
    });

    it('should include formatting instructions', () => {
      const prompt = templateEngine.buildPrompt(
        'Expert Engineer',
        mockContext,
        mockConcepts,
        'intermediate',
        null
      );

      expect(prompt).toContain('## Formatting Requirements');
      expect(prompt).toContain('Use clear markdown formatting');
      expect(prompt).toContain('Target 10-15 minutes reading time');
    });
  });

  describe('interpolateTemplate', () => {
    it('should replace template variables', () => {
      const template = 'Learn about {concept} in {context} systems';
      const variables = { concept: 'modularity', context: 'ecommerce' };
      
      const result = templateEngine.interpolateTemplate(template, variables);
      expect(result).toBe('Learn about modularity in ecommerce systems');
    });

    it('should leave unreplaced variables as-is', () => {
      const template = 'Learn about {concept} and {unknown}';
      const variables = { concept: 'modularity' };
      
      const result = templateEngine.interpolateTemplate(template, variables);
      expect(result).toBe('Learn about modularity and {unknown}');
    });

    it('should handle null/undefined template', () => {
      expect(templateEngine.interpolateTemplate(null, {})).toBe('');
      expect(templateEngine.interpolateTemplate(undefined, {})).toBe('');
      expect(templateEngine.interpolateTemplate('', {})).toBe('');
    });

    it('should handle non-string template', () => {
      expect(templateEngine.interpolateTemplate(123, {})).toBe(123);
    });
  });

  describe('getMainConcept', () => {
    it('should return first concept name', () => {
      const result = templateEngine.getMainConcept(mockConcepts);
      expect(result).toBe('modularity');
    });

    it('should return default for empty concepts', () => {
      const result = templateEngine.getMainConcept([]);
      expect(result).toBe('software architecture fundamentals');
    });

    it('should return default for null concepts', () => {
      const result = templateEngine.getMainConcept(null);
      expect(result).toBe('software architecture fundamentals');
    });
  });

  describe('addContextualGuidance', () => {
    it('should format context information', () => {
      const guidance = templateEngine.addContextualGuidance(mockContext, 'intermediate');
      
      expect(guidance).toContain('## Domain Context: ecommerce');
      expect(guidance).toContain('Online retail systems');
      expect(guidance).toContain('**Technical Challenges**');
      expect(guidance).toContain('**Business Context**');
      expect(guidance).toContain('**Key Stakeholders**: customers, merchants');
    });

    it('should include selected scenario when available', () => {
      mockContext.selectedScenario = {
        name: 'Black Friday',
        description: 'Peak traffic scenario'
      };

      const guidance = templateEngine.addContextualGuidance(mockContext, 'intermediate');
      expect(guidance).toContain('**Specific Scenario**: Peak traffic scenario');
    });
  });

  describe('addConceptGuidance', () => {
    it('should format concept information', () => {
      const guidance = templateEngine.addConceptGuidance(mockConcepts);
      
      expect(guidance).toContain('## Concept Focus');
      expect(guidance).toContain('**modularity** (intermediate)');
      expect(guidance).toContain('Breaking systems into cohesive modules');
      expect(guidance).toContain('Key insight: High cohesion, low coupling');
    });

    it('should return empty string for no concepts', () => {
      const guidance = templateEngine.addConceptGuidance([]);
      expect(guidance).toBe('');
    });

    it('should handle concepts without key insights', () => {
      const conceptWithoutInsights = new Concept({
        name: 'test',
        definition: 'Test concept'
      });

      const guidance = templateEngine.addConceptGuidance([conceptWithoutInsights]);
      expect(guidance).toContain('**test**');
      expect(guidance).not.toContain('Key insight:');
    });
  });
});
