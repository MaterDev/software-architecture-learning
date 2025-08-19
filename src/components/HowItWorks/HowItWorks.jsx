import React from 'react';

const HowItWorks = () => (
  <div className="how-it-works" style={{ padding: '1rem' }}>
    <div className="generator-view">
      <div className="welcome-message">
        <h2>Software Architecture Learning Assistant</h2>
        <p>Generate AI prompts for structured software architecture learning across four key perspectives.</p>
      </div>

      <div className="stage-explanations">
        <div className="stage-explanation">
          <div className="stage-header">
            <i className="pi pi-code" />
            <strong>Expert Engineer</strong>
          </div>
          <p>Deep technical implementation focus. Explores code-level architecture decisions, patterns, and technical trade-offs. Perfect for diving into implementation details and understanding how architectural decisions manifest in code.</p>
        </div>

        <div className="stage-explanation">
          <div className="stage-header">
            <i className="pi pi-sitemap" />
            <strong>System Designer</strong>
          </div>
          <p>System-wide architecture thinking. Focuses on component relationships, data flow, and scalability patterns. Ideal for understanding how different parts of a system work together and designing for scale.</p>
        </div>

        <div className="stage-explanation">
          <div className="stage-header">
            <i className="pi pi-users" />
            <strong>Leader</strong>
          </div>
          <p>Team and organizational perspectives. Considers communication, team dynamics, and business alignment. Essential for understanding the human side of architecture and organizational impact.</p>
        </div>

        <div className="stage-explanation">
          <div className="stage-header">
            <i className="pi pi-file-edit" />
            <strong>Review & Synthesis</strong>
          </div>
          <p>Integration and reflection. Connects all perspectives for holistic architectural understanding. Brings together technical, design, and leadership insights for comprehensive learning.</p>
        </div>
      </div>

      <div className="usage-steps">
        <h4>How to Use This Tool:</h4>
        <ol>
          <li><strong>Generate a New Cycle:</strong> Click "Generate New Cycle" to create 4 unique AI prompts</li>
          <li><strong>Select a Learning Stage:</strong> Choose from Expert Engineer, System Designer, Leader, or Review & Synthesis</li>
          <li><strong>Copy the Prompt:</strong> Use the generated prompt with AI assistants like ChatGPT, Claude, or others</li>
          <li><strong>Regenerate for Variety:</strong> Click "Regenerate" to get new variations of prompts for deeper exploration</li>
          <li><strong>Learn Iteratively:</strong> Work through all 4 stages for comprehensive architectural understanding</li>
        </ol>
      </div>

      <div className="features-info">
        <h4>Key Features:</h4>
        <ul>
          <li><strong>Language Agnostic:</strong> Prompts focus on architectural concepts, not specific technologies</li>
          <li><strong>Dynamic Generation:</strong> Each cycle creates unique combinations of architectural concepts</li>
          <li><strong>Multi-Perspective Learning:</strong> Four complementary viewpoints for holistic understanding</li>
          <li><strong>Copy-Ready Prompts:</strong> Formatted for immediate use with AI assistants</li>
        </ul>
      </div>
    </div>
  </div>
);

export default HowItWorks;
