/**
 * Mock concepts for testing
 */
export const mockConceptData = {
  conceptCategories: {
    foundational: {
      description: "Core architectural thinking and fundamental concepts",
      concepts: {
        "software-architecture": {
          definition: "Structure + Characteristics + Decisions + Principles",
          complexity: "beginner",
          components: ["structure", "characteristics", "decisions", "principles"],
          keyInsights: ["Architecture is more than structure", "Quality attributes drive choices"]
        },
        "modularity": {
          definition: "Breaking systems into cohesive, loosely coupled modules",
          complexity: "intermediate",
          components: ["cohesion", "coupling", "boundaries"],
          keyInsights: ["High cohesion, low coupling", "Clear module boundaries"]
        }
      }
    },
    structural: {
      description: "Structural patterns and organization",
      concepts: {
        "layered-architecture": {
          definition: "Organizing code into horizontal layers",
          complexity: "beginner",
          components: ["presentation", "business", "persistence"],
          keyInsights: ["Separation of concerns", "Dependency direction matters"]
        }
      }
    }
  }
};

export const mockConcepts = [
  {
    name: "software-architecture",
    category: "foundational",
    definition: "Structure + Characteristics + Decisions + Principles",
    complexity: "beginner",
    components: ["structure", "characteristics", "decisions", "principles"],
    keyInsights: ["Architecture is more than structure"]
  },
  {
    name: "modularity",
    category: "foundational", 
    definition: "Breaking systems into cohesive, loosely coupled modules",
    complexity: "intermediate",
    components: ["cohesion", "coupling", "boundaries"],
    keyInsights: ["High cohesion, low coupling"]
  }
];
