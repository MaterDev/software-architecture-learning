/**
 * Strategy Repository
 * Handles all oblique strategy data access and selection logic
 */
import obliqueStrategies from '../sources/oblique-strategies.json';
import { ObliqueStrategy } from '../models/ObliqueStrategy.js';

export class StrategyRepository {
  constructor() {
    this.data = obliqueStrategies;
    this.strategyCache = new Map();
    this.initializeCache();
  }

  initializeCache() {
    // Cache strategies as model instances
    this.data.strategies.forEach((strategyData, index) => {
      const strategy = new ObliqueStrategy({
        id: index,
        ...strategyData
      });
      this.strategyCache.set(index, strategy);
    });
  }

  /**
   * Get all strategies
   */
  getAllStrategies() {
    return Array.from(this.strategyCache.values());
  }

  /**
   * Get strategy by ID
   */
  getStrategy(id) {
    return this.strategyCache.get(id);
  }

  /**
   * Select a random oblique strategy
   */
  selectStrategy() {
    const strategies = this.getAllStrategies();
    if (strategies.length === 0) {
      return null;
    }
    
    const randomIndex = Math.floor(Math.random() * strategies.length);
    return strategies[randomIndex];
  }

  /**
   * Get strategies by category
   */
  getStrategiesByCategory(category) {
    return this.getAllStrategies().filter(strategy => strategy.category === category);
  }

  /**
   * Get strategy count for stats
   */
  getStrategyCount() {
    return this.strategyCache.size;
  }

  /**
   * Get repository statistics
   */
  getStats() {
    const strategies = this.getAllStrategies();
    const categoryDistribution = strategies.reduce((acc, strategy) => {
      acc[strategy.category] = (acc[strategy.category] || 0) + 1;
      return acc;
    }, {});

    return {
      totalStrategies: this.strategyCache.size,
      categories: Object.keys(categoryDistribution),
      categoryDistribution
    };
  }
}
