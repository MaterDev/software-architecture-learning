import React, { useState } from 'react';
import { usePrompts } from '../../hooks/usePrompts';
import PromptEditor from '../PromptEditor';
import SidebarExplorer from '../SidebarExplorer';
import StatusBar from '../StatusBar';

const IDELayout = () => {
  const { state, generateNewCycle, regenerateStagePrompt, clearError, resetCycles } = usePrompts();
  const [activeStage, setActiveStage] = useState(null);

  const handleNewCycle = () => {
    generateNewCycle();
  };

  const handleStageRegenerate = (stage) => {
    regenerateStagePrompt(stage);
  };

  const handleStageSelect = (stage) => {
    setActiveStage(stage);
  };

  const currentStage = activeStage ? 
    state.currentCycle?.stages?.find(stage => stage.stage === activeStage) : 
    null;

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
