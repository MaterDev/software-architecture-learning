/**
 * Template Engine
 * Handles template interpolation and prompt building
 */
import { VariableBuilder } from './VariableBuilder.js';

export class TemplateEngine {
  constructor({ templateRepo }) {
    this.templateRepo = templateRepo;
    this.variableBuilder = new VariableBuilder();
  }

  /**
   * Add enrichment guidance for domain and technologies
   */
  addEnrichmentGuidance(enrichment) {
    let out = '';
    const domainName = enrichment?.domain?.name || enrichment?.domain || null;
    const technologies = Array.isArray(enrichment?.technologies) ? enrichment.technologies.map(t => t?.name).filter(Boolean) : [];
    if (domainName || technologies.length > 0) {
      out += `## Technology & Domain Enrichment\n`;
      if (domainName) out += `Domain Focus: ${domainName}\n`;
      if (technologies.length > 0) {
        out += `Technologies to integrate: ${technologies.join(', ')}\n`;
        out += `- Provide examples and trade-offs referencing these technologies where relevant.\n`;
      }
      out += `\n`;
    }
    return out;
  }

  /**
   * Build educational meta-prompt for AI lesson generation
   */
  buildPrompt(role, context, concepts, complexity, obliqueStrategy, enrichment) {
    const lessonFormat = this.templateRepo.selectLessonFormat(concepts, context, complexity);
    const roleInstructions = this.templateRepo.getRoleInstructions(role.toLowerCase().replace(' ', ''));
    
    let prompt = `# Educational Lesson Generation Prompt\n\n`;
    
    // Main instruction for AI system
    prompt += `You are an expert software architecture educator. Create a comprehensive, engaging lesson that teaches software engineers about **${this.getMainConcept(concepts)}** from the perspective of a **${role}**.\n\n`;
    
    // Lesson format instructions
    prompt += `## Lesson Structure Requirements\n`;
    prompt += `Create a lesson using this exact structure:\n\n`;
    lessonFormat.structure.forEach(section => {
      prompt += `${section}\n`;
    });
    
    prompt += `\n## Content Guidelines\n`;
    // Interpolate template variables in the instructional guidance
    const interpolatedGuidance = this.interpolateTemplate(
      lessonFormat.instructionalGuidance,
      this.variableBuilder.build(concepts, context, complexity, role, enrichment)
    );
    prompt += `${interpolatedGuidance}\n\n`;

    // Add adaptation instructions when available
    if (lessonFormat?.adaptationInstructions) {
      const interpolatedAdaptation = this.interpolateTemplate(
        lessonFormat.adaptationInstructions,
        this.variableBuilder.build(concepts, context, complexity, role, enrichment)
      );
      prompt += `## Adaptation Instructions\n`;
      prompt += `${interpolatedAdaptation}\n\n`;
    }
    
    // Role-specific perspective
    if (roleInstructions) {
      prompt += `## ${role} Perspective\n`;
      prompt += `${roleInstructions.focus}\n\n`;
      prompt += `**Key Deliverables:**\n`;
      const deliverables = lessonFormat.getDeliverables(complexity, role.toLowerCase().replace(' ', ''));
      if (deliverables.length > 0) {
        deliverables.forEach(deliverable => {
          prompt += `- ${deliverable}\n`;
        });
      } else {
        prompt += `- Practical implementation guidance\n`;
        prompt += `- Real-world application examples\n`;
        prompt += `- Common pitfalls and solutions\n`;
      }
      prompt += `\n`;
    }

    // Add contextual guidance
    prompt += this.addContextualGuidance(context);

    // Add enrichment (domain & technologies) guidance when available
    if (enrichment) {
      prompt += this.addEnrichmentGuidance(enrichment);
    }
    
    // Add concept-specific guidance
    prompt += this.addConceptGuidance(concepts);
    
    // Add oblique strategy if provided
    if (obliqueStrategy) {
      prompt += this.addObliqueStrategy(obliqueStrategy);
    }
    
    // Add formatting instructions
    prompt += this.addFormattingInstructions();

    return prompt;
  }

  /**
   * Template interpolation with variable substitution
   */
  interpolateTemplate(template, variableMap) {
    if (!template || typeof template !== 'string') {
      return template || '';
    }
    
    return template.replace(/\{([^}]+)\}/g, (match, varName) => {
      return variableMap[varName] || match;
    });
  }

  /**
   * Add contextual guidance for lesson adaptation
   */
  addContextualGuidance(context) {
    let guidance = `## Domain Context: ${context.name}\n`;
    guidance += `${context.description}\n\n`;
    guidance += `**Technical Challenges**: ${context.getTechnicalChallenges()}\n`;
    guidance += `**Business Context**: ${context.getBusinessContext()}\n`;
    guidance += `**Key Stakeholders**: ${context.stakeholders.join(', ')}\n\n`;
    
    if (context.selectedScenario) {
      guidance += `**Specific Scenario**: ${context.selectedScenario.description || context.selectedScenario.name}\n\n`;
    }
    
    return guidance;
  }

  /**
   * Add concept-specific guidance
   */
  addConceptGuidance(concepts) {
    if (!concepts || concepts.length === 0) {
      return '';
    }

    let guidance = `## Concept Focus\n`;
    guidance += `This lesson should deeply explore these key concepts:\n\n`;
    
    concepts.forEach(concept => {
      guidance += `**${concept.name}** (${concept.complexity}): ${concept.definition}\n`;
      if (concept.keyInsights && concept.keyInsights.length > 0) {
        guidance += `- Key insight: ${concept.keyInsights[0]}\n`;
      }
    });
    
    guidance += `\nEnsure the lesson connects these concepts to practical software architecture decisions.\n\n`;
    return guidance;
  }

  /**
   * Add oblique strategy for creative lesson variation
   */
  addObliqueStrategy(strategy) {
    return `## Creative Approach\n${strategy.getFormattedText()}\n\n${strategy.getIntegrationGuidance()}\n\n`;
  }

  /**
   * Add formatting instructions for AI systems
   */
  addFormattingInstructions() {
    return `\n## Formatting Requirements\n` +
           `- Use clear markdown formatting with proper headings\n` +
           `- Include bullet points and numbered lists where appropriate\n` +
           `- Add code examples in fenced code blocks when relevant\n` +
           `- Keep paragraphs concise and scannable\n` +
           `- Include practical examples and real-world scenarios\n` +
           `- End each section with actionable takeaways\n` +
           `- Target 10-15 minutes reading time for busy engineers\n\n` +
           `**Remember**: This lesson should be immediately useful for software engineers to reference and apply in their daily work.`;
  }

  /**
   * Get main concept for lesson focus
   */
  getMainConcept(concepts) {
    if (!concepts || concepts.length === 0) {
      return 'software architecture fundamentals';
    }
    return concepts[0].name;
  }
}
