import React from 'react';

const ActionsSection = ({ error, currentCycle, onClearError, onReset, onCopyCycleAudit }) => (
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
            aria-label="Clear error"
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
            aria-label="Reset all cycles"
          >
            <i className="pi pi-trash" />
            Reset All
          </button>
        )}

        {currentCycle && (
          <button
            className="quick-action-btn"
            onClick={onCopyCycleAudit}
            title="Copy Cycle Audit JSON"
            aria-label="Copy cycle audit"
          >
            <i className="pi pi-copy" />
            Copy Cycle Audit
          </button>
        )}
      </div>
    </div>
  </div>
);

export default ActionsSection;
