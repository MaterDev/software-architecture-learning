/**
 * Variable Builder
 * Builds template variables for interpolation based on context and concepts
 */
export class VariableBuilder {
  /**
   * Build comprehensive template variables for interpolation
   */
  build(concepts, context, complexity, role, enrichment) {
    const mainConcept = this.getMainConcept(concepts);
    const conceptNames = concepts && concepts.length > 0 ? concepts.map(c => c.name).join(', ') : 'architecture concepts';
    const domainName = enrichment?.domain?.name || enrichment?.domain || context?.name || 'general';
    const techArray = Array.isArray(enrichment?.technologies) ? enrichment.technologies.map(t => t?.name).filter(Boolean) : [];
    const techList = techArray.join(', ');
    
    return {
      // Core concepts
      concept: mainConcept,
      concepts: conceptNames,
      
      // Context variables
      context: context.name || 'software architecture',
      domain: domainName,
      domainContext: context.description || 'software architecture context',
      domainScenario: context?.selectedScenario?.name || context?.selectedScenario?.description || `${context.name} system development scenario`,
      
      // Decision and analysis variables
      decisionType: this.getDecisionType(concepts, context),
      decisionContext: this.getDecisionContext(concepts, context),
      
      // Technical variables
      technicalChallenges: context.getTechnicalChallenges(),
      technologies: techList || 'n/a',
      primaryTechnology: techArray[0] || 'n/a',
      implementationGoal: this.getImplementationGoal(concepts),
      systemContext: context.name || 'distributed system',
      
      // Organizational variables
      stakeholderNeeds: context.stakeholders ? context.stakeholders.join(', ') : 'user experience, operational efficiency',
      businessContext: context.getBusinessContext(),
      
      // Complexity and role
      complexity: complexity,
      role: role,
      
      // Characteristics and constraints
      qualityAttributes: context.characteristics ? context.characteristics.join(', ') : 'maintainability, scalability',
      constraints: context.constraints ? context.constraints.join(', ') : 'resource limitations',
      
      // Patterns and approaches
      pattern: this.getRelevantPattern(concepts),
      approach: this.getApproach(concepts, complexity),
      
      // Skills and frameworks
      skill: this.getSkillFocus(concepts, role),
      framework: this.getFramework(concepts, complexity),
      
      // Scenarios
      scenario: this.getScenario(context),
      caseStudy: context.getCaseStudy(),
      useCase: this.getUseCase(concepts, context)
    };
  }

  getMainConcept(concepts) {
    if (!concepts || concepts.length === 0) {
      return 'software architecture fundamentals';
    }
    return concepts[0].name;
  }

  getDecisionType(concepts, context) {
    if (concepts && concepts.some(c => c.name && c.name.includes('trade-off'))) {
      return 'architectural trade-off decisions';
    }
    if (concepts && concepts.some(c => c.name && c.name.includes('pattern'))) {
      return 'pattern selection decisions';
    }
    if (context && context.name === 'fintech') {
      return 'security and compliance decisions';
    }
    return 'architectural design decisions';
  }

  getDecisionContext(concepts, context) {
    const contextName = context.name || 'general';
    const mainConcept = this.getMainConcept(concepts);
    return `${mainConcept} in ${contextName} systems`;
  }

  getImplementationGoal(concepts) {
    if (concepts && concepts.length > 0) {
      const concept = concepts[0];
      if (concept.name.includes('modularity')) return 'improved system modularity';
      if (concept.name.includes('performance')) return 'performance optimization';
      if (concept.name.includes('security')) return 'security enhancement';
      if (concept.name.includes('scalability')) return 'scalability improvement';
    }
    return 'architectural excellence';
  }

  getRelevantPattern(concepts) {
    if (concepts && concepts.length > 0) {
      const concept = concepts[0];
      if (concept.category === 'structural') return 'modular architecture patterns';
      if (concept.name.includes('quantum')) return 'microservices patterns';
      if (concept.name.includes('coupling')) return 'decoupling patterns';
    }
    return 'architectural design patterns';
  }

  getApproach(concepts, complexity) {
    if (complexity === 'beginner') return 'step-by-step guided approach';
    if (complexity === 'advanced') return 'comprehensive analysis approach';
    return 'practical application approach';
  }

  getSkillFocus(concepts, role) {
    if (role.includes('Expert Engineer')) return 'technical implementation skills';
    if (role.includes('System Designer')) return 'architectural design skills';
    if (role.includes('Leader')) return 'decision-making and communication skills';
    return 'architectural thinking skills';
  }

  getFramework(concepts, complexity) {
    if (concepts && concepts.some(c => c.name && c.name.includes('decision'))) {
      return 'architectural decision framework';
    }
    if (complexity === 'advanced') return 'comprehensive analysis framework';
    return 'practical learning framework';
  }

  getScenario(context) {
    if (context.selectedScenario) {
      return context.selectedScenario.name || context.selectedScenario.description;
    }
    return `${context.name} system development scenario`;
  }

  getUseCase(concepts, context) {
    const mainConcept = this.getMainConcept(concepts);
    return `applying ${mainConcept} in ${context.name} systems`;
  }
}
