import React from 'react';
import { logger } from '../../utils/logger.js';

const PromptEditor = ({ stage, activeStage, loading, error, onRegenerate, onNewCycle }) => {
  const handleCopyToClipboard = async (text) => {
    if (!text) return;
    
    try {
      logger.info('PromptEditor', `User copied prompt to clipboard for stage: ${stage?.stage}`, {
        stage: stage?.stage,
        promptLength: text.length,
        hashtagCount: stage?.hashtags?.length || 0
      });
      
      await navigator.clipboard.writeText(text);
      
      logger.debug('PromptEditor', 'Clipboard copy successful', {
        stage: stage?.stage,
        copiedLength: text.length
      });
    } catch (err) {
      logger.error('PromptEditor', 'Failed to copy to clipboard', {
        stage: stage?.stage,
        error: err.message
      });
    }
  };

  const getStageIcon = (stage) => {
    const icons = {
      'Expert Engineer': 'pi-code',
      'System Designer': 'pi-sitemap',
      'Leader': 'pi-users',
      'Review & Synthesis': 'pi-file-edit'
    };
    return icons[stage] || 'pi-file';
  };

  return (
    <div className="prompt-editor">
      {/* Header */}
      <div className="editor-header">
        <div className="editor-title">
          <i className={`pi ${getStageIcon(activeStage)}`} />
          <h2>{activeStage ? activeStage : 'Select a Learning Stage'}</h2>
        </div>
        
        {stage && activeStage && (
          <div className="editor-actions">
            <button 
              className="editor-btn secondary"
              onClick={() => onRegenerate(activeStage)}
              disabled={loading}
              title="Regenerate this stage"
            >
              <i className="pi pi-refresh" />
              Regenerate
            </button>
            <button 
              className="editor-btn primary"
              onClick={() => handleCopyToClipboard(stage.prompt)}
              disabled={!stage.prompt}
              title="Copy prompt to clipboard"
            >
              <i className="pi pi-copy" />
              Copy Prompt
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="editor-content">
        {loading && (
          <div className="loading-state">
            <i className="pi pi-spin pi-spinner" />
            <p>Generating prompts...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <i className="pi pi-exclamation-triangle" />
            <div className="error-content">
              <h3>Error Generating Prompts</h3>
              <p>{error}</p>
              <button 
                className="retry-button"
                onClick={onNewCycle}
              >
                <i className="pi pi-refresh" />
                Try Again
              </button>
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            {activeStage === 'home' && (
              <div className="generator-view">
                <div className="welcome-message">
                  <h3>Software Architecture Learning Assistant</h3>
                  <p>Generate AI prompts for structured software architecture learning across four key perspectives</p>
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
            )}

            {!activeStage && (
              <div className="generator-view">
                <div className="welcome-message">
                  <h3>Welcome to Software Architecture Learning</h3>
                  <p>Select "How It Works" from the sidebar to learn about this tool, or generate a new cycle to get started with AI prompts.</p>
                </div>
              </div>
            )}

            {stage && activeStage && activeStage !== 'home' && (
              <div className="stage-view">
                {/* Generated Prompt */}
                <div className="prompt-section">
                  <div className="prompt-content">
                    {stage.prompt || 'No prompt generated yet.'}
                  </div>
                </div>

                {/* Context Hashtags */}
                {stage.hashtags && stage.hashtags.length > 0 && (
                  <div className="hashtags-section">
                    <div className="section-header">
                      <i className="pi pi-tags" />
                      <span>Context ({stage.hashtags.length})</span>
                    </div>
                    <div className="hashtags-grid">
                      {stage.hashtags.map((hashtag, index) => (
                        <span key={index} className="hashtag">
                          #{hashtag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PromptEditor;
