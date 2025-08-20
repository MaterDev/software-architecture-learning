import React from 'react';
import { copyText, copyAllStages } from '../../utils/clipboard.js';
import { logger } from '../../utils/logger.js';
import NavigationSection from './NavigationSection.jsx';
import StageListSection from './StageListSection.jsx';
import ActionsSection from './ActionsSection.jsx';
import DomainWeightsSection from './DomainWeightsSection.jsx';

const SidebarExplorer = ({ 
  currentCycle,
  loading, 
  error, 
  onNewCycle, 
  onClearError, 
  onReset, 
  onStageSelect, 
  activeStage,
}) => {
  const handleKeyActivate = (e, fn) => {
    if (!fn) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fn();
    }
  };

  const handleSelectStage = (stageName) => {
    try {
      const s = currentCycle?.stages?.find(st => st?.stage === stageName);
      if (s?.prompt) {
        logger.prompt('SidebarExplorer', 'open-stage-prompt', {
          stage: stageName,
          prompt: s.prompt,
          length: s.prompt.length || 0,
          complexity: s.complexity,
          lessonType: s.lessonType,
          hashtagsCount: Array.isArray(s.hashtags) ? s.hashtags.length : 0,
          timestamp: s.timestamp || null,
        });
      } else {
        logger.prompt('SidebarExplorer', 'open-stage-no-prompt', { stage: stageName });
      }
    } catch (error) {
      logger.error('SidebarExplorer', 'open-stage-log-error', { stage: stageName, error });
    }
    onStageSelect(stageName);
  };

  const handleCopyAll = async () => {
    if (!currentCycle?.stages) return;
    await copyAllStages(currentCycle.stages, {}, { source: 'SidebarExplorer' });
  };

  const handleCopyStage = async (stageName) => {
    const s = currentCycle?.stages?.find(st => st?.stage === stageName);
    if (!s?.prompt) return;
    await copyText(s.prompt, { action: 'copy-stage', stage: stageName, source: 'SidebarExplorer' });
  };

  const buildCycleAuditPayload = () => {
    if (!currentCycle) return null;
    const baseAudit = currentCycle.audit || {};
    return {
      id: currentCycle.id,
      generatedAt: currentCycle.timestamp || null,
      context: baseAudit.context || currentCycle.context || null,
      complexity: currentCycle.complexity || baseAudit.complexity || null,
      obliqueStrategy: baseAudit.obliqueStrategy || currentCycle.obliqueStrategy || null,
      enrichment: baseAudit.enrichment || null,
      roles: baseAudit.roles || (currentCycle.stages ? currentCycle.stages.map(s => s.stage) : []),
      stageSummaries: baseAudit.stageSummaries || [],
      stageAudits: Array.isArray(currentCycle.stages) ? currentCycle.stages.map(s => ({
        stage: s.stage,
        audit: s.audit || null
      })) : []
    };
  };

  const handleCopyCycleAudit = async () => {
    const payload = buildCycleAuditPayload();
    if (!payload) return;
    const text = JSON.stringify(payload, null, 2);
    logger.prompt('SidebarExplorer', 'copy-cycle-audit', { cycleId: currentCycle?.id, payload });
    await copyText(text, { action: 'copy-cycle-audit', cycleId: currentCycle?.id, source: 'SidebarExplorer' });
  };

  return (
    <div 
      className="explorer-content"
      role="navigation"
      aria-label="Learning Assistant navigation"
    >
      <NavigationSection />

      <div className="explorer-section">
        <div className="action-buttons">
          <button 
            className="explorer-button primary"
            onClick={onNewCycle}
            disabled={loading}
            aria-label={loading ? 'Generating new cycle' : 'Generate new cycle'}
          >
            <i className="pi pi-refresh" />
            {loading ? 'Generating...' : 'Generate New Cycle'}
          </button>
        </div>
      </div>


      <StageListSection
        currentCycle={currentCycle}
        activeStage={activeStage}
        onSelectStage={handleSelectStage}
        onKeyActivate={handleKeyActivate}
        onCopyStage={handleCopyStage}
        onCopyAll={handleCopyAll}
      />

      {/* New: Domain Weights panel */}
      <DomainWeightsSection />

      {(error || currentCycle) && (
        <ActionsSection
          error={error}
          currentCycle={currentCycle}
          onClearError={onClearError}
          onReset={onReset}
          onCopyCycleAudit={handleCopyCycleAudit}
        />
      )}

      {error && (
        <div className="explorer-section error-section" role="alert" aria-live="assertive">
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

export default SidebarExplorer;
