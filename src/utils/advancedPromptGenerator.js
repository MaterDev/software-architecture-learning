import coreConcepts from '../data/core-concepts.json';
import lessonTemplates from '../data/lesson-templates.json';
import contextualScenarios from '../data/contextual-scenarios.json';
import obliqueStrategies from '../data/oblique-strategies.json';
import { logger } from './logger.js';

// Advanced Prompt Generation Engine
class AdvancedPromptGenerator {
  constructor() {
    this.concepts = coreConcepts;
    this.lessonTemplates = lessonTemplates;
    this.scenarios = contextualScenarios;
    this.strategies = obliqueStrategies;
    
    logger.info('AdvancedPromptGenerator', 'Initialized for educational lesson generation', {
      conceptCategories: Object.keys(this.concepts.conceptCategories).length,
      lessonFormats: Object.keys(this.lessonTemplates.lessonFormats).length,
      domainContexts: Object.keys(this.scenarios.domainContexts).length,
      obliqueStrategies: this.strategies.strategies.length
    });
  }

  // Generate a complete learning cycle with sophisticated prompts
  generateCycle() {
    const timestamp = Date.now();
    logger.info('AdvancedPromptGenerator', 'Generating new advanced cycle');

    // Select contextual scenario for the entire cycle
    const selectedContext = this.selectContext();
    const selectedComplexity = this.selectComplexityLevel();
    
    // Generate oblique strategy for additional variance (30% chance)
    const obliqueStrategy = Math.random() < 0.3 ? this.selectObliqueStrategy() : null;

    const stages = [
      this.generateStagePrompt('expertEngineer', selectedContext, selectedComplexity, obliqueStrategy),
      this.generateStagePrompt('systemDesigner', selectedContext, selectedComplexity, obliqueStrategy),
      this.generateStagePrompt('leader', selectedContext, selectedComplexity, obliqueStrategy),
      this.generateStagePrompt('reviewSynthesis', selectedContext, selectedComplexity, obliqueStrategy)
    ];

    const cycle = {
      id: `cycle-${timestamp}`,
      timestamp,
      context: selectedContext,
      complexity: selectedComplexity,
      obliqueStrategy,
      stages,
      metadata: {
        generationApproach: 'advanced-combinatorial',
        dataVersion: '2.0.0'
      }
    };

    logger.prompt('AdvancedPromptGenerator', 'Advanced cycle generated', {
      cycleId: cycle.id,
      context: selectedContext.name,
      complexity: selectedComplexity,
      hasObliqueStrategy: !!obliqueStrategy,
      stageCount: stages.length
    });

    return cycle;
  }

  // Generate educational meta-prompts for AI lesson creation
  generateStagePrompt(roleKey, context, complexity, obliqueStrategy) {
    const roleName = this.getRoleNameFromKey(roleKey);
    
    // Select relevant concepts for this role and complexity
    const relevantConcepts = this.selectRelevantConcepts(roleKey, complexity);
    
    // Build educational meta-prompt
    const prompt = this.buildCombinatorialPrompt(
      roleName,
      null, // No template variation needed for new approach
      context,
      relevantConcepts,
      complexity,
      obliqueStrategy
    );

    const hashtags = this.generateContextualHashtags(relevantConcepts, context) || [];

    const stage = {
      stage: roleName,
      prompt,
      hashtags,
      context: context.name || 'general',
      complexity,
      lessonType: this.selectLessonFormat(relevantConcepts, context, complexity).description,
      conceptsUsed: relevantConcepts && relevantConcepts.length > 0 ? relevantConcepts.map(c => c && c.name ? c.name : 'unknown') : ['architecture'],
      timestamp: Date.now()
    };

    logger.debug('AdvancedPromptGenerator', `Generated ${roleKey} educational prompt`, {
      promptLength: prompt ? prompt.length : 0,
      hashtagCount: hashtags ? hashtags.length : 0,
      conceptsCount: relevantConcepts ? relevantConcepts.length : 0,
      lessonType: stage.lessonType
    });

    return stage;
  }

  // Regenerate a specific stage with new variance
  regenerateStage(stageName) {
    logger.info('AdvancedPromptGenerator', `Regenerating stage: ${stageName}`);
    
    const roleKey = this.getRoleKeyFromStageName(stageName);
    const selectedContext = this.selectContext();
    const selectedComplexity = this.selectComplexityLevel();
    const obliqueStrategy = Math.random() < 0.4 ? this.selectObliqueStrategy() : null; // Higher chance for regeneration

    return this.generateStagePrompt(roleKey, selectedContext, selectedComplexity, obliqueStrategy);
  }

  // Build educational meta-prompts for AI lesson generation
  buildCombinatorialPrompt(role, templateVariation, context, concepts, complexity, obliqueStrategy) {
    const lessonFormat = this.selectLessonFormat(concepts, context, complexity);
    const roleInstructions = this.lessonTemplates.roleInstructions[role.toLowerCase().replace(' ', '')];
    
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
      this.buildTemplateVariables(concepts, context, complexity, role)
    );
    prompt += `${interpolatedGuidance}\n\n`;
    
    // Role-specific perspective
    if (roleInstructions) {
      prompt += `## ${role} Perspective\n`;
      prompt += `- **Focus**: ${roleInstructions.focus}\n`;
      prompt += `- **Tone**: ${roleInstructions.tone}\n`;
      prompt += `- **Key Deliverables**: ${roleInstructions.deliverables.join(', ')}\n\n`;
    }
    
    // Context and domain adaptation
    prompt += this.addContextualGuidance(context, complexity);
    
    // Concept-specific details
    prompt += this.addConceptGuidance(concepts);
    
    // Oblique strategy for creative variation
    if (obliqueStrategy) {
      prompt += this.addObliqueStrategy(obliqueStrategy);
    }
    
    // Final formatting instructions
    prompt += this.addFormattingInstructions();
    
    return prompt.trim();
  }

  // Advanced variable mapping for combinatorial templates
  buildAdvancedVariableMap(templateVariation, context, concepts, complexity) {
    const variableMap = {};
    
    // For each variable in the template, intelligently select values
    Object.entries(templateVariation.variables).forEach(([varName, options]) => {
      if (Array.isArray(options)) {
        // Select contextually appropriate option
        variableMap[varName] = this.selectContextualOption(options, context, concepts, complexity);
      } else {
        variableMap[varName] = options;
      }
    });

    return variableMap;
  }

  // Select contextually appropriate options based on domain and concepts
  selectContextualOption(options, context, concepts, complexity) {
    // Weight options based on context relevance
    const weightedOptions = options.map(option => ({
      option,
      weight: this.calculateOptionWeight(option, context, concepts, complexity)
    }));

    // Select based on weighted probability
    const totalWeight = weightedOptions.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const item of weightedOptions) {
      random -= item.weight;
      if (random <= 0) {
        return item.option;
      }
    }
    
    return options[0]; // Fallback
  }

  // Calculate contextual relevance weight for options
  calculateOptionWeight(option, context, concepts, complexity) {
    let weight = 1.0; // Base weight

    // Boost weight for domain-relevant options
    if (context.characteristics.some(char => option.includes(char))) {
      weight += 2.0;
    }

    // Boost weight for concept-relevant options
    if (concepts.some(concept => option.includes(concept.name) || concept.components.some(comp => option.includes(comp)))) {
      weight += 1.5;
    }

    // Adjust for complexity level
    const complexityBoost = {
      'beginner': option.includes('basic') || option.includes('simple') ? 1.5 : 0.8,
      'intermediate': option.includes('analysis') || option.includes('design') ? 1.5 : 1.0,
      'advanced': option.includes('advanced') || option.includes('complex') ? 1.5 : 0.9
    };

    weight *= complexityBoost[complexity] || 1.0;

    return weight;
  }

  // Template interpolation with variable substitution
  interpolateTemplate(template, variableMap) {
    if (!template || typeof template !== 'string') {
      return template || '';
    }
    
    return template.replace(/\{([^}]+)\}/g, (match, varName) => {
      return variableMap[varName] || match;
    });
  }

  // Build template variables for interpolation
  buildTemplateVariables(concepts, context, complexity, role) {
    const mainConcept = this.getMainConcept(concepts);
    const conceptNames = concepts && concepts.length > 0 ? concepts.map(c => c.name).join(', ') : 'architecture concepts';
    
    return {
      // Core concepts
      concept: mainConcept,
      concepts: conceptNames,
      
      // Context variables
      context: context.name || 'software architecture',
      domain: context.name || 'general',
      domainContext: context.description || 'software architecture context',
      
      // Decision and analysis variables
      decisionType: this.getDecisionType(concepts, context),
      decisionContext: this.getDecisionContext(concepts, context),
      
      // Technical variables
      technicalChallenges: this.getTechnicalChallenges(context),
      implementationGoal: this.getImplementationGoal(concepts),
      systemContext: context.name || 'distributed system',
      
      // Organizational variables
      stakeholderNeeds: context.stakeholders ? context.stakeholders.join(', ') : 'user experience, operational efficiency',
      businessContext: this.getBusinessContext(context),
      
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
      caseStudy: this.getCaseStudy(context),
      useCase: this.getUseCase(concepts, context)
    };
  }

  // Select appropriate lesson format based on concepts and context
  selectLessonFormat(concepts, context, complexity) {
    // Default lesson format if templates are not available
    const defaultFormat = {
      description: "Concept exploration and practical application",
      structure: [
        "## Concept Overview",
        "## Why This Matters", 
        "## Core Principles",
        "## Real-World Examples",
        "## Common Pitfalls",
        "## Practical Exercises",
        "## Reflection Questions",
        "## Further Reading"
      ],
      instructionalGuidance: "Create an engaging lesson that helps software engineers understand the concept through concrete examples and hands-on thinking exercises."
    };

    if (!this.lessonTemplates || !this.lessonTemplates.lessonFormats) {
      return defaultFormat;
    }

    const formats = this.lessonTemplates.lessonFormats;
    
    // Simple selection logic with null checks
    if (concepts && Array.isArray(concepts)) {
      if (concepts.some(c => c && c.name && (c.name.includes('trade-off') || c.name.includes('decision')))) {
        return formats.tradeoffAnalysis || defaultFormat;
      } else if (concepts.some(c => c && c.category === 'structural')) {
        return formats.patternStudy || defaultFormat;
      } else if (complexity === 'beginner') {
        return formats.conceptExploration || defaultFormat;
      } else if (concepts.length > 1) {
        return formats.skillDevelopment || defaultFormat;
      }
    }
    
    return formats.conceptExploration || defaultFormat;
  }

  // Add contextual guidance for lesson adaptation
  addContextualGuidance(context, complexity) {
    let guidance = `## Domain Context: ${context.name.charAt(0).toUpperCase() + context.name.slice(1)}\n`;
    
    const domainGuidance = this.lessonTemplates.adaptationInstructions.domainSpecific[context.name];
    if (domainGuidance) {
      guidance += `**Domain Focus**: ${domainGuidance}\n\n`;
    }
    
    const complexityGuidance = this.lessonTemplates.adaptationInstructions.complexityLevel[complexity];
    if (complexityGuidance) {
      guidance += `**Complexity Adaptation**: ${complexityGuidance}\n\n`;
    }
    
    if (context.characteristics) {
      guidance += `**Key Characteristics**: ${context.characteristics.join(', ')}\n`;
    }
    
    if (context.constraints) {
      guidance += `**Important Constraints**: ${context.constraints.join(', ')}\n\n`;
    }

    return guidance;
  }

  // Add oblique strategy for creative lesson variation
  addObliqueStrategy(strategy) {
    return `\n## Creative Perspective\n` +
           `**Oblique Strategy**: "${strategy.strategy}"\n` +
           `Incorporate this perspective to add creative depth and challenge conventional thinking in your lesson.\n\n`;
  }

  // Add concept-specific guidance
  addConceptGuidance(concepts) {
    if (!concepts || concepts.length === 0) return '';
    
    let guidance = `## Key Concepts to Address\n`;
    
    concepts.forEach(concept => {
      guidance += `### ${concept.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}\n`;
      if (concept.definition) {
        guidance += `**Definition**: ${concept.definition}\n`;
      }
      if (concept.keyInsights && concept.keyInsights.length > 0) {
        guidance += `**Key Insights**: ${concept.keyInsights.join(', ')}\n`;
      }
      guidance += `\n`;
    });
    
    return guidance;
  }

  // Get complexity-appropriate deliverables
  getComplexityAppropriateDeliverables(roleName, complexity) {
    const baseDeliverables = {
      'Expert Engineer': [
        '• Technical analysis with specific metrics and measurements',
        '• Implementation recommendations with code patterns/examples',
        '• Trade-off analysis with quantified benefits and drawbacks',
        '• Risk assessment with mitigation strategies'
      ],
      'System Designer': [
        '• Architecture characteristics identification and prioritization',
        '• System boundary definitions with interaction patterns',
        '• Component design with interface specifications',
        '• Governance strategy with fitness function examples'
      ],
      'Leader': [
        '• Architecture decision record (ADR) with rationale',
        '• Stakeholder communication plan',
        '• Risk management strategy with contingency plans',
        '• Team alignment and consensus-building approach'
      ],
      'Review & Synthesis': [
        '• Cross-role insight integration and synthesis',
        '• Key learning reflections and takeaways',
        '• Practical application roadmap',
        '• Wisdom extraction for future scenarios'
      ]
    };

    let deliverables = baseDeliverables[roleName] || [];

    // Add complexity-specific deliverables
    if (complexity === 'advanced') {
      deliverables.push('• Advanced analysis with innovative approaches');
      deliverables.push('• Detailed implementation strategy with automation');
    } else if (complexity === 'beginner') {
      deliverables.push('• Clear explanations with basic examples');
      deliverables.push('• Step-by-step guidance for implementation');
    }

    return deliverables;
  }

  // Context selection with intelligent weighting
  selectContext() {
    // Default context if scenarios are not available
    const defaultContext = {
      name: 'general',
      description: 'General software architecture context',
      characteristics: ['maintainability', 'scalability', 'reliability'],
      constraints: ['resource-limitations', 'time-constraints'],
      stakeholders: ['developers', 'users', 'business-stakeholders']
    };

    if (!this.scenarios || !this.scenarios.domainContexts) {
      return defaultContext;
    }

    const domains = Object.entries(this.scenarios.domainContexts);
    if (domains.length === 0) {
      return defaultContext;
    }

    const selectedDomain = domains[Math.floor(Math.random() * domains.length)];
    const [domainKey, domainData] = selectedDomain;
    
    if (!domainData) {
      return defaultContext;
    }
    
    // Sometimes select a specific scenario within the domain
    let selectedScenario = null;
    if (domainData.scenarios && Array.isArray(domainData.scenarios) && Math.random() < 0.6) {
      selectedScenario = domainData.scenarios[Math.floor(Math.random() * domainData.scenarios.length)];
    }

    return {
      name: domainKey,
      description: domainData.description || 'Software architecture context',
      characteristics: domainData.characteristics || ['maintainability', 'scalability'],
      constraints: domainData.constraints || ['resource-limitations'],
      stakeholders: domainData.stakeholders || ['developers', 'users'],
      ...domainData,
      selectedScenario
    };
  }

  // Complexity level selection with progression logic
  selectComplexityLevel() {
    const levels = ['beginner', 'intermediate', 'advanced'];
    const weights = [0.3, 0.5, 0.2]; // Favor intermediate level
    
    const random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < levels.length; i++) {
      cumulative += weights[i];
      if (random <= cumulative) {
        return levels[i];
      }
    }
    
    return 'intermediate'; // Fallback
  }

  // Select relevant concepts based on role and complexity
  selectRelevantConcepts(roleKey, complexity) {
    const allConcepts = [];
    
    // Collect concepts from all categories with null checks
    if (this.concepts && this.concepts.conceptCategories) {
      Object.entries(this.concepts.conceptCategories).forEach(([categoryKey, category]) => {
        if (category && category.concepts) {
          Object.entries(category.concepts).forEach(([conceptKey, concept]) => {
            if (concept) {
              allConcepts.push({
                name: conceptKey,
                category: categoryKey,
                definition: concept.definition || 'Architecture concept',
                complexity: concept.complexity || 'intermediate',
                components: concept.components || [],
                keyInsights: concept.keyInsights || [],
                ...concept
              });
            }
          });
        }
      });
    }

    // If no concepts found, return default concepts
    if (allConcepts.length === 0) {
      return [{
        name: 'software-architecture',
        category: 'foundational',
        definition: 'Structure + Characteristics + Decisions + Principles',
        complexity: 'beginner',
        components: ['structure', 'characteristics', 'decisions', 'principles'],
        keyInsights: ['Architecture is more than structure', 'Quality attributes drive choices']
      }];
    }

    // Filter by complexity and role relevance
    const relevantConcepts = allConcepts.filter(concept => {
      const complexityMatch = concept.complexity === complexity || 
                             (complexity === 'advanced' && concept.complexity === 'intermediate') ||
                             (complexity === 'beginner'); // Allow beginner concepts for all levels
      
      const roleRelevance = this.isConceptRelevantToRole(concept, roleKey);
      
      return complexityMatch && roleRelevance;
    });

    // If no relevant concepts, return first few concepts
    if (relevantConcepts.length === 0) {
      return allConcepts.slice(0, 2);
    }

    // Select 3-5 concepts randomly from relevant ones
    const selectedCount = Math.min(relevantConcepts.length, 3 + Math.floor(Math.random() * 3));
    return this.shuffleArray(relevantConcepts).slice(0, selectedCount);
  }

  // Check if concept is relevant to specific role
  isConceptRelevantToRole(concept, roleKey) {
    const roleConceptMapping = {
      'expertEngineer': ['structural', 'foundational'],
      'systemDesigner': ['qualitative', 'structural', 'foundational'],
      'leader': ['organizational', 'foundational'],
      'reviewSynthesis': ['foundational', 'structural', 'qualitative', 'organizational']
    };

    return roleConceptMapping[roleKey]?.includes(concept.category) || false;
  }

  // Generate contextual hashtags based on concepts and context
  generateContextualHashtags(concepts, context) {
    try {
      const hashtags = [];

      // Add concept-based hashtags
      if (concepts && Array.isArray(concepts)) {
        concepts.forEach(concept => {
          if (concept && concept.name && typeof concept.name === 'string') {
            hashtags.push(`#${concept.name.replace(/\s+/g, '-')}`);
            // Add some component hashtags
            if (concept.components && Array.isArray(concept.components) && concept.components.length > 0) {
              const selectedComponents = concept.components.slice(0, 2);
              selectedComponents.forEach(comp => {
                if (comp && typeof comp === 'string') {
                  hashtags.push(`#${comp.replace(/\s+/g, '-')}`);
                }
              });
            }
          }
        });
      }

      // Add context-based hashtags
      if (context && context.characteristics && Array.isArray(context.characteristics)) {
        context.characteristics.slice(0, 3).forEach(char => {
          if (char && typeof char === 'string') {
            hashtags.push(`#${char.replace(/\s+/g, '-')}`);
          }
        });
      }

      // Add scenario-specific hashtags if available
      if (context && context.selectedScenario && context.selectedScenario.characteristics && Array.isArray(context.selectedScenario.characteristics)) {
        context.selectedScenario.characteristics.slice(0, 2).forEach(char => {
          if (char && typeof char === 'string') {
            hashtags.push(`#${char.replace(/\s+/g, '-')}`);
          }
        });
      }

      // Ensure we always have at least some default hashtags
      if (hashtags.length === 0) {
        hashtags.push('#software-architecture', '#learning', '#engineering');
      }

      return [...new Set(hashtags)]; // Remove duplicates
    } catch {
      // Fallback hashtags if anything goes wrong
      return ['#software-architecture', '#learning', '#engineering'];
    }
  }

  // Select oblique strategy
  selectObliqueStrategy() {
    const strategies = this.strategies.strategies;
    return strategies[Math.floor(Math.random() * strategies.length)];
  }

  // Get main concept for lesson focus
  getMainConcept(concepts) {
    if (!concepts || concepts.length === 0) return 'Software Architecture Principles';
    return concepts[0].name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  // Helper method to get role key from stage name
  getRoleKeyFromStageName(stageName) {
    const mapping = {
      'Expert Engineer': 'expertEngineer',
      'System Designer': 'systemDesigner',
      'Leader': 'leader',
      'Review & Synthesis': 'reviewSynthesis'
    };
    return mapping[stageName] || 'expertEngineer';
  }
  
  // Helper method to get role name from key
  getRoleNameFromKey(roleKey) {
    const mapping = {
      'expertEngineer': 'Expert Engineer',
      'systemDesigner': 'System Designer',
      'leader': 'Leader',
      'reviewSynthesis': 'Review & Synthesis'
    };
    return mapping[roleKey] || 'Expert Engineer';
  }
  
  // Add formatting instructions for AI systems
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

  // Helper methods for template variable generation
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

  getTechnicalChallenges(context) {
    if (context.constraints) {
      return context.constraints.join(', ');
    }
    switch (context.name) {
      case 'fintech': return 'regulatory compliance, transaction integrity, security';
      case 'ecommerce': return 'seasonal traffic spikes, inventory consistency, payment processing';
      case 'healthcare': return 'data privacy, system integration, regulatory compliance';
      case 'gaming': return 'real-time performance, state synchronization, anti-cheat';
      case 'iot': return 'resource constraints, connectivity issues, edge processing';
      default: return 'scalability, maintainability, performance';
    }
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

  getBusinessContext(context) {
    switch (context.name) {
      case 'fintech': return 'regulated financial services environment';
      case 'ecommerce': return 'competitive online retail market';
      case 'healthcare': return 'patient care and medical compliance environment';
      case 'gaming': return 'entertainment and user engagement focused industry';
      case 'iot': return 'connected device and smart systems ecosystem';
      default: return 'modern software development environment';
    }
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

  getCaseStudy(context) {
    switch (context.name) {
      case 'fintech': return 'high-frequency trading platform';
      case 'ecommerce': return 'global marketplace scaling';
      case 'healthcare': return 'patient data exchange system';
      case 'gaming': return 'multiplayer game architecture';
      case 'iot': return 'smart city infrastructure';
      default: return 'enterprise system modernization';
    }
  }

  getUseCase(concepts, context) {
    const mainConcept = this.getMainConcept(concepts);
    return `applying ${mainConcept} in ${context.name} systems`;
  }

  // Utility methods
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  buildVariableMap(role, templateVariation, context, concepts, complexity) {
    return {
      action: 'analyze and design solutions',
      technicalConstraints: context.constraints?.join(', ') || 'system constraints',
      qualityAttributes: context.characteristics?.join(', ') || 'quality attributes',
      systemContext: context.name,
      complexity: complexity
    };
  }
}

// Export functions for compatibility with existing system
const generator = new AdvancedPromptGenerator();

export const generateCycle = () => generator.generateCycle();
export const regenerateStage = (stageName) => generator.regenerateStage(stageName);

export default generator;
