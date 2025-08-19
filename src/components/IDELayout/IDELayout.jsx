import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { usePrompts } from '../../hooks/usePrompts';
import PromptEditor from '../PromptEditor';
import SidebarExplorer from '../SidebarExplorer';
import StatusBar from '../StatusBar';
import HowItWorks from '../HowItWorks/HowItWorks.jsx';
import { logger } from '../../utils/logger.js';

const IDELayout = () => {
  const { state, generateNewCycle, regenerateStagePrompt, clearError, resetCycles } = usePrompts();
  const navigate = useNavigate();
  const location = useLocation();
  const { stageId } = useParams();
  const [activeStage, setActiveStage] = useState(null);
  const prevPathRef = useRef(location.pathname);

  // Sync active stage from route param
  useEffect(() => {
    setActiveStage(stageId || null);
  }, [stageId]);

  // Log route changes
  useEffect(() => {
    const prev = prevPathRef.current;
    const curr = location.pathname;
    if (prev !== curr) {
      logger.info('Navigation', 'route-change', {
        from: prev,
        to: curr,
        stageId: stageId || null,
      });
      prevPathRef.current = curr;
    }
  }, [location.pathname, stageId]);

  const handleNewCycle = () => {
    generateNewCycle();
  };

  const handleStageRegenerate = (stage) => {
    regenerateStagePrompt(stage);
  };

  const handleStageSelect = (stage) => {
    logger.info('Navigation', 'navigate-stage', { stage });
    navigate(`/stage/${encodeURIComponent(stage)}`);
  };

  const currentStage = activeStage ? 
    state.currentCycle?.stages?.find(stage => stage.stage === activeStage) : 
    null;

  const isHowItWorksActive = location.pathname.startsWith('/how-it-works');

  return (
    <div className="ide-container">
      {/* Title Bar */}
      <div className="ide-titlebar">
        <div className="title">Software Architecture Learning - Dynamic Prompt Generator</div>
      </div>

      <div className="ide-main">
        {/* Sidebar */}
        <div className="ide-sidebar">
          <div className="sidebar-header">
            <i className="pi pi-list" />
            Learning Assistant
          </div>
          <div className="sidebar-content">
            <SidebarExplorer 
              currentCycle={state.currentCycle}
              loading={state.loading}
              error={state.error}
              onNewCycle={handleNewCycle}
              onClearError={clearError}
              onReset={resetCycles}
              onStageSelect={handleStageSelect}
              activeStage={activeStage}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="ide-content">
          {isHowItWorksActive ? (
            <HowItWorks />
          ) : (
            <PromptEditor
              key={`${activeStage}-${currentStage?.timestamp || 'no-timestamp'}`}
              stage={currentStage}
              activeStage={activeStage}
              loading={state.loading}
              error={state.error}
              onRegenerate={handleStageRegenerate}
              onNewCycle={handleNewCycle}
              allStages={state.currentCycle?.stages || []}
            />
          )}
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar 
        currentCycle={state.currentCycle}
        loading={state.loading}
        error={state.error}
      />
    </div>
  );
};

export default IDELayout;
