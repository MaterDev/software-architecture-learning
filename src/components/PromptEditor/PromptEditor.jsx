import React, { useState } from 'react';
import { copyText, copyAllStages } from '../../utils/clipboard.js';
import { logger } from '../../utils/logger.js';

const PromptEditor = ({ stage, activeStage, loading, error, onRegenerate, onNewCycle, allStages }) => {
  const [showAudit, setShowAudit] = useState(false);

  const handleCopyToClipboard = async (text) => {
    if (!text) return;
    await copyText(text, { action: 'copy-stage', stage: stage?.stage, source: 'PromptEditor' });
  };

  const handleCopyAllPrompts = async () => {
    if (!Array.isArray(allStages) || allStages.length === 0) return;
    await copyAllStages(allStages, {}, { source: 'PromptEditor' });
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

  const buildAuditPayload = (s) => {
    if (!s) return null;
    const audit = s.audit || {};
    return {
      stage: s.stage,
      generatedAt: s.timestamp || null,
      context: audit.context || s.context || null,
      complexity: s.complexity || null,
      lessonType: s.lessonType || null,
      conceptsUsed: s.conceptsUsed || [],
      technologiesUsed: s.technologiesUsed || [],
      variables: audit.variables || {},
      lessonFormat: audit.lessonFormat || null,
      enrichment: audit.enrichment || s.enrichment || null,
      obliqueStrategy: audit.obliqueStrategy || null
    };
  };

  const handleCopyAudit = async () => {
    const payload = buildAuditPayload(stage);
    if (!payload) return;
    const text = JSON.stringify(payload, null, 2);
    logger.prompt('PromptEditor', 'copy-stage-audit', { stage: stage?.stage, payload });
    await copyText(text, { action: 'copy-stage-audit', stage: stage?.stage, source: 'PromptEditor' });
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
            <button
              className="editor-btn primary"
              onClick={handleCopyAllPrompts}
              disabled={!Array.isArray(allStages) || allStages.filter(s => !!s?.prompt).length < 2}
              title="Copy all stage prompts to clipboard (--- --- --- separators)"
            >
              <i className="pi pi-copy" />
              Copy All
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
                      {stage.hashtags.map((hashtag, index) => {
                        const display = typeof hashtag === 'string' && hashtag.startsWith('#') ? hashtag : `#${hashtag}`;
                        return (
                          <span key={index} className="hashtag">
                            {display}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Context Details */}
                <div className="context-details-section">
                  <div className="section-header">
                    <i className="pi pi-database" />
                    <span>Context Details</span>
                  </div>
                  <div className="context-details-grid">
                    {stage.context && (
                      <div className="detail-row">
                        <span className="label">Context</span>
                        <span className="value">{typeof stage.context === 'string' ? stage.context : (stage.context?.name || stage.context?.domain || '—')}</span>
                      </div>
                    )}
                    {stage.complexity && (
                      <div className="detail-row">
                        <span className="label">Complexity</span>
                        <span className="value">{stage.complexity}</span>
                      </div>
                    )}
                    {stage.lessonType && (
                      <div className="detail-row">
                        <span className="label">Lesson Type</span>
                        <span className="value">{stage.lessonType}</span>
                      </div>
                    )}
                    {Array.isArray(stage.conceptsUsed) && stage.conceptsUsed.length > 0 && (
                      <div className="detail-row">
                        <span className="label">Concepts Used</span>
                        <span className="value">
                          {stage.conceptsUsed.join(', ')}
                        </span>
                      </div>
                    )}
                    {stage.timestamp && (
                      <div className="detail-row">
                        <span className="label">Generated</span>
                        <span className="value">{new Date(stage.timestamp).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Audit: Context & Inputs (collapsible) */}
                <div className="context-details-section">
                  <div className="section-header" onClick={() => setShowAudit(prev => !prev)} style={{ cursor: 'pointer' }}>
                    <i className={`pi ${showAudit ? 'pi-chevron-down' : 'pi-chevron-right'}`} />
                    <span>Context & Inputs</span>
                    <div className="editor-actions" style={{ marginLeft: 'auto' }}>
                      <button
                        className="editor-btn secondary"
                        onClick={(e) => { e.stopPropagation(); handleCopyAudit(); }}
                        disabled={!stage}
                        title="Copy audit JSON to clipboard"
                      >
                        <i className="pi pi-copy" />
                        Copy Audit
                      </button>
                    </div>
                  </div>
                  {showAudit && (
                    <div className="context-details-grid">
                      {/* Domain */}
                      {stage?.audit?.enrichment?.domain && (
                        <div className="detail-row">
                          <span className="label">Domain</span>
                          <span className="value">{stage.audit.enrichment.domain.name}</span>
                        </div>
                      )}
                      {/* Technologies */}
                      {Array.isArray(stage?.audit?.enrichment?.technologies) && stage.audit.enrichment.technologies.length > 0 && (
                        <div className="detail-row">
                          <span className="label">Technologies</span>
                          <span className="value">{stage.audit.enrichment.technologies.map(t => t.name).join(', ')}</span>
                        </div>
                      )}
                      {/* Scenario */}
                      {stage?.audit?.context?.selectedScenario && (
                        <div className="detail-row">
                          <span className="label">Scenario</span>
                          <span className="value">{stage.audit.context.selectedScenario.description || stage.audit.context.selectedScenario.name}</span>
                        </div>
                      )}
                      {/* Stakeholders */}
                      {Array.isArray(stage?.audit?.context?.stakeholders) && stage.audit.context.stakeholders.length > 0 && (
                        <div className="detail-row">
                          <span className="label">Stakeholders</span>
                          <span className="value">{stage.audit.context.stakeholders.join(', ')}</span>
                        </div>
                      )}
                      {/* Lesson Format */}
                      {stage?.audit?.lessonFormat && (
                        <div className="detail-row">
                          <span className="label">Lesson Format</span>
                          <span className="value">{stage.audit.lessonFormat.description}</span>
                        </div>
                      )}
                      {/* Variables (compact) */}
                      {stage?.audit?.variables && (
                        <div className="detail-row">
                          <span className="label">Variables</span>
                          <span className="value" style={{ maxHeight: '8rem', overflow: 'auto' }}>
                            <pre style={{ margin: 0 }}>
{JSON.stringify(stage.audit.variables, null, 2)}
                            </pre>
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PromptEditor;
