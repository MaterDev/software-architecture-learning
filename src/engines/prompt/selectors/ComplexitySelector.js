/**
 * Complexity Selector
 * Handles intelligent complexity level selection with progression logic
 */
export class ComplexitySelector {
  constructor() {
    this.complexities = ['beginner', 'intermediate', 'advanced'];
    this.weights = [0.3, 0.5, 0.2]; // Favor intermediate complexity
  }

  /**
   * Select complexity level with weighted randomization
   */
  select() {
    const random = Math.random();
    let cumulativeWeight = 0;
    
    for (let i = 0; i < this.complexities.length; i++) {
      cumulativeWeight += this.weights[i];
      if (random <= cumulativeWeight) {
        return this.complexities[i];
      }
    }
    
    return 'intermediate'; // Fallback
  }

  /**
   * Select complexity with bias towards specific level
   */
  selectWithBias(preferredComplexity) {
    const biasedWeights = this.weights.map((weight, index) => {
      return this.complexities[index] === preferredComplexity ? weight * 2 : weight;
    });
    
    const totalWeight = biasedWeights.reduce((sum, weight) => sum + weight, 0);
    const normalizedWeights = biasedWeights.map(weight => weight / totalWeight);
    
    const random = Math.random();
    let cumulativeWeight = 0;
    
    for (let i = 0; i < this.complexities.length; i++) {
      cumulativeWeight += normalizedWeights[i];
      if (random <= cumulativeWeight) {
        return this.complexities[i];
      }
    }
    
    return preferredComplexity;
  }

  /**
   * Get all available complexity levels
   */
  getAvailableComplexities() {
    return [...this.complexities];
  }
}
