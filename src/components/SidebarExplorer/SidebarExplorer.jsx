import React from 'react';
import { copyText, copyAllStages } from '../../utils/clipboard.js';

const SidebarExplorer = ({ 
  currentCycle, 
  loading, 
  error, 
  onNewCycle, 
  onClearError, 
  onReset, 
  onStageSelect, 
  activeStage 
}) => {
  const handleCopyAll = async () => {
    if (!currentCycle?.stages) return;
    await copyAllStages(currentCycle.stages, {}, { source: 'SidebarExplorer' });
  };

  const handleCopyStage = async (stageName) => {
    const s = currentCycle?.stages?.find(st => st?.stage === stageName);
    if (!s?.prompt) return;
    await copyText(s.prompt, { action: 'copy-stage', stage: stageName, source: 'SidebarExplorer' });
  };

  return (
    <div className="explorer-content">
      {/* Navigation */}
      <div className="explorer-section">
        <div className="section-header">
          <i className="pi pi-home" />
          <span className="section-title">Navigation</span>
        </div>
        <div className="section-content">
          <div 
            className={`nav-item ${activeStage === 'home' ? 'active' : ''}`}
            onClick={() => onStageSelect('home')}
          >
            <i className="pi pi-info-circle" />
            <span className="nav-name">How It Works</span>
          </div>
        </div>
      </div>

      {/* Generate New Cycle */}
      <div className="explorer-section">
        <div className="action-buttons">
          <button 
            className="explorer-button primary"
            onClick={onNewCycle}
            disabled={loading}
          >
            <i className="pi pi-refresh" />
            {loading ? 'Generating...' : 'Generate New Cycle'}
          </button>
        </div>
      </div>

      {/* Learning Stages */}
      {currentCycle && (
        <div className="explorer-section">
          <div className="section-header">
            <i className="pi pi-list" />
            <span className="section-title">Learning Stages</span>
            <div className="section-actions">
              <button
                className="quick-action-btn"
                onClick={handleCopyAll}
                disabled={!currentCycle || (currentCycle.stages?.filter(s => !!s?.prompt).length || 0) < 2}
                title="Copy all prompts (--- --- --- separators)"
              >
                <i className="pi pi-copy" />
                Copy All
              </button>
            </div>
          </div>
          <div className="section-content">
            {currentCycle.stages?.map((stage) => (
              <div 
                key={stage.stage}
                className={`stage-item ${activeStage === stage.stage ? 'active' : ''}`}
                onClick={() => onStageSelect(stage.stage)}
              >
                <i className={`pi ${getStageIcon(stage.stage)}`} />
                <div className="stage-info">
                  <span className="stage-name">{getStageTitle(stage.stage)}</span>
                  <span className="stage-meta">{stage.hashtags?.length || 0} concepts</span>
                </div>
                <button
                  className="quick-action-btn"
                  onClick={(e) => { e.stopPropagation(); handleCopyStage(stage.stage); }}
                  title="Copy this stage prompt"
                  disabled={!stage.prompt}
                >
                  <i className="pi pi-copy" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {(error || currentCycle) && (
        <div className="explorer-section">
          <div className="section-header">
            <i className="pi pi-cog" />
            <span className="section-title">Actions</span>
          </div>
          <div className="section-content">
            <div className="quick-actions">
              {error && (
                <button 
                  className="quick-action-btn"
                  onClick={onClearError}
                  title="Clear Error"
                >
                  <i className="pi pi-times-circle" />
                  Clear Error
                </button>
              )}
              
              {currentCycle && (
                <button 
                  className="quick-action-btn"
                  onClick={onReset}
                  title="Reset All Cycles"
                >
                  <i className="pi pi-trash" />
                  Reset All
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="explorer-section error-section">
          <div className="section-header">
            <i className="pi pi-exclamation-triangle" />
            <span className="section-title">Error</span>
          </div>
          <div className="section-content">
            <div className="error-display">
              {error}
            </div>
          </div>
        </div>
      )}
    </div>
  );
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

const getStageTitle = (stage) => {
  return stage;
};

export default SidebarExplorer;
