/**
 * Context data model
 * Represents a domain context with scenarios and constraints
 */
export class Context {
  constructor(data) {
    this.name = data.name || '';
    this.description = data.description || '';
    this.characteristics = Array.isArray(data.characteristics) ? data.characteristics : [];
    this.constraints = Array.isArray(data.constraints) ? data.constraints : [];
    this.stakeholders = Array.isArray(data.stakeholders) ? data.stakeholders : [];
    this.scenarios = Array.isArray(data.scenarios) ? data.scenarios : [];
    this.selectedScenario = data.selectedScenario || null;
    
    this.validate();
  }

  validate() {
    if (!this.name || typeof this.name !== 'string') {
      throw new Error('Context must have a valid name');
    }
  }

  /**
   * Get characteristics as hashtags
   */
  getCharacteristicHashtags(maxCount = 3) {
    return this.characteristics
      .slice(0, maxCount)
      .filter(char => char && typeof char === 'string')
      .map(char => `#${char.replace(/\s+/g, '-')}`);
  }

  /**
   * Get scenario-specific hashtags
   */
  getScenarioHashtags(maxCount = 2) {
    if (!this.selectedScenario || !this.selectedScenario.characteristics) {
      return [];
    }
    
    return this.selectedScenario.characteristics
      .slice(0, maxCount)
      .filter(char => char && typeof char === 'string')
      .map(char => `#${char.replace(/\s+/g, '-')}`);
  }

  /**
   * Get combined context hashtags (domain + characteristics + constraints)
   */
  getHashtags(maxCount = 6) {
    const tags = [];

    // Domain hashtag
    if (this.name) {
      tags.push(`#${String(this.name).toLowerCase().replace(/\s+/g, '-')}`);
    }

    // Characteristic hashtags (up to 3)
    const characteristicTags = this.getCharacteristicHashtags(3);
    tags.push(...characteristicTags);

    // Constraint hashtags (up to 2)
    const constraintTags = (this.constraints || [])
      .filter(c => typeof c === 'string' && c.trim().length > 0)
      .slice(0, 2)
      .map(c => `#${c.replace(/\s+/g, '-').toLowerCase()}`);
    tags.push(...constraintTags);

    // Deduplicate and cap
    return Array.from(new Set(tags)).slice(0, maxCount);
  }

  /**
   * Get technical challenges for this context
   */
  getTechnicalChallenges() {
    if (this.constraints && this.constraints.length > 0) {
      return this.constraints.join(', ');
    }
    
    // Context-specific challenges
    const challengeMap = {
      'fintech': 'regulatory compliance, transaction integrity, security',
      'ecommerce': 'seasonal traffic spikes, inventory consistency, payment processing',
      'healthcare': 'data privacy, system integration, regulatory compliance',
      'gaming': 'real-time performance, state synchronization, anti-cheat',
      'iot': 'resource constraints, connectivity issues, edge processing',
      'entertainment-arts': 'media pipelines, real-time rendering, collaboration tooling',
      'comics': 'asset management, responsive rendering, platform distribution',
      'graphic-apps': 'GPU acceleration, complex UI interactions, plugin ecosystems',
      'creative-coding': 'live-coding performance, generative pipelines, audiovisual sync',
      'server-side-development': 'API scalability, observability, reliability',
      'scripting-tooling': 'cross-platform portability, dependency management, ergonomics',
      'analytics-data-visualization': 'real-time streaming, large-scale aggregation, interactive UX',
      'computer-graphics': 'rendering performance, memory bandwidth, shader compilation',
      'web-assembly': 'sandboxing, ABI compatibility, performance across browsers',
      'tauri': 'desktop integration, secure IPC, cross-platform packaging',
      'javascript': 'single-threaded concurrency, bundling, runtime differences',
      'typescript': 'type system design, incremental builds, API evolution',
      'golang': 'concurrency patterns, memory profiling, deployment footprints',
      'rust': 'ownership, borrow checking, FFI and performance',
      'payment-systems': 'idempotency, PCI compliance, reconciliation',
      'devops': 'CI/CD pipelines, infrastructure as code, observability',
      'software-distribution': 'update channels, code signing, artifact management',
      'generative-ai': 'model serving, safety controls, cost/performance trade-offs',
      'app-development': 'cross-platform consistency, offline-first, app store policies'
    };
    
    return challengeMap[this.name] || 'scalability, maintainability, performance';
  }

  /**
   * Get business context description
   */
  getBusinessContext() {
    const contextMap = {
      'fintech': 'regulated financial services environment',
      'ecommerce': 'competitive online retail market',
      'healthcare': 'patient care and medical compliance environment',
      'gaming': 'entertainment and user engagement focused industry',
      'iot': 'connected device and smart systems ecosystem',
      'entertainment-arts': 'creative production and media technology ecosystem',
      'comics': 'digital publishing and storytelling platforms',
      'graphic-apps': 'professional creative tools and design workflows',
      'creative-coding': 'artistic exploration through code and interactive media',
      'server-side-development': 'backend services powering applications and APIs',
      'scripting-tooling': 'developer productivity and automation tooling landscape',
      'analytics-data-visualization': 'data-driven decision-making environments',
      'computer-graphics': 'visual computing and rendering ecosystems',
      'web-assembly': 'portable high-performance modules in the web platform',
      'tauri': 'secure cross-platform desktop app ecosystem',
      'javascript': 'web and server runtimes with rich ecosystem',
      'typescript': 'typed JS development for large-scale applications',
      'golang': 'cloud-native services and tooling ecosystem',
      'rust': 'safety-critical and performance-oriented systems',
      'payment-systems': 'financial transaction processing and settlement',
      'devops': 'software delivery and operations culture',
      'software-distribution': 'packaging, updates, and delivery channels',
      'generative-ai': 'AI-assisted creation and automation platforms',
      'app-development': 'mobile and cross-platform application ecosystems'
    };
    
    return contextMap[this.name] || 'modern software development environment';
  }

  /**
   * Get case study example for this context
   */
  getCaseStudy() {
    const caseStudyMap = {
      'fintech': 'high-frequency trading platform',
      'ecommerce': 'global marketplace scaling',
      'healthcare': 'patient data exchange system',
      'gaming': 'multiplayer game architecture',
      'iot': 'smart city infrastructure',
      'entertainment-arts': 'real-time VFX collaboration pipeline',
      'comics': 'cloud-based collaborative comic editor',
      'graphic-apps': 'vector graphics editor plugin system',
      'creative-coding': 'live-coded audiovisual performance toolkit',
      'server-side-development': 'multi-tenant API gateway and BFF layer',
      'scripting-tooling': 'cross-platform CLI with plugin architecture',
      'analytics-data-visualization': 'real-time analytics dashboard at scale',
      'computer-graphics': 'GPU-accelerated rendering engine',
      'web-assembly': 'WASM-accelerated image processing in-browser',
      'tauri': 'Rust-based desktop app with secure updater',
      'javascript': 'isomorphic web app with SSR and hydration',
      'typescript': 'type-safe monorepo with incremental builds',
      'golang': 'high-throughput message processing service',
      'rust': 'memory-safe systems component with FFI',
      'payment-systems': 'PCI-compliant payment orchestration service',
      'devops': 'GitOps-managed multi-cluster deployment',
      'software-distribution': 'signed auto-update channel with delta patches',
      'generative-ai': 'LLM-powered coding assistant service',
      'app-development': 'cross-platform app with offline-first sync'
    };
    
    return caseStudyMap[this.name] || 'enterprise system modernization';
  }

  /**
   * Convert to plain object for serialization
   */
  toJSON() {
    return {
      name: this.name,
      description: this.description,
      characteristics: this.characteristics,
      constraints: this.constraints,
      stakeholders: this.stakeholders,
      scenarios: this.scenarios,
      selectedScenario: this.selectedScenario
    };
  }
}
