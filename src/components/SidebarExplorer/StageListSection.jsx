import React from 'react';
import { getStageIcon, getStageTitle } from './utils.js';

const StageListSection = ({ currentCycle, activeStage, onSelectStage, onKeyActivate, onCopyStage, onCopyAll }) => {
  if (!currentCycle) return null;
  return (
    <div className="explorer-section">
      <div className="section-header">
        <i className="pi pi-list" />
        <span className="section-title">Learning Stages</span>
        <div className="section-actions">
          <button
            className="quick-action-btn"
            onClick={onCopyAll}
            disabled={!currentCycle || (currentCycle.stages?.filter(s => !!s?.prompt).length || 0) < 2}
            title="Copy all prompts (--- --- --- separators)"
            aria-label="Copy all prompts"
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
            role="button"
            tabIndex={0}
            aria-pressed={activeStage === stage.stage}
            onClick={() => onSelectStage(stage.stage)}
            onKeyDown={(e) => onKeyActivate(e, () => onSelectStage(stage.stage))}
          >
            <i className={`pi ${getStageIcon(stage.stage)}`} />
            <div className="stage-info">
              <span className="stage-name">{getStageTitle(stage.stage)}</span>
              <span className="stage-meta">{stage.hashtags?.length || 0} concepts</span>
            </div>
            <button
              className="quick-action-btn"
              onClick={(e) => { e.stopPropagation(); onCopyStage(stage.stage); }}
              title="Copy this stage prompt"
              disabled={!stage.prompt}
              aria-label={`Copy prompt for ${stage.stage}`}
            >
              <i className="pi pi-copy" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StageListSection;
