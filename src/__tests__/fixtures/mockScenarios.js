/**
 * Mock scenarios for testing
 */
export const mockScenarioData = {
  domainContexts: {
    ecommerce: {
      description: "Online retail and marketplace systems",
      characteristics: ["scalability", "availability", "consistency"],
      constraints: ["seasonal-traffic", "payment-processing", "inventory-sync"],
      stakeholders: ["customers", "merchants", "operations"],
      scenarios: [
        {
          name: "Black Friday Traffic Spike",
          description: "Handling 10x normal traffic during peak shopping",
          characteristics: ["performance", "scalability"]
        }
      ]
    },
    fintech: {
      description: "Financial technology and banking systems",
      characteristics: ["security", "compliance", "consistency"],
      constraints: ["regulatory-compliance", "transaction-integrity"],
      stakeholders: ["customers", "regulators", "auditors"],
      scenarios: [
        {
          name: "Real-time Payment Processing",
          description: "Processing high-frequency transactions with strict consistency",
          characteristics: ["consistency", "performance"]
        }
      ]
    }
  }
};

export const mockContext = {
  name: "ecommerce",
  description: "Online retail and marketplace systems",
  characteristics: ["scalability", "availability", "consistency"],
  constraints: ["seasonal-traffic", "payment-processing"],
  stakeholders: ["customers", "merchants", "operations"],
  scenarios: [
    {
      name: "Black Friday Traffic Spike",
      description: "Handling 10x normal traffic during peak shopping"
    }
  ]
};
