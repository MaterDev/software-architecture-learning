import React from 'react';

const NavigationSection = ({ activeStage, onStageSelect, onKeyActivate }) => (
  <div className="explorer-section">
    <div className="section-header">
      <i className="pi pi-home" />
      <span className="section-title">Navigation</span>
    </div>
    <div className="section-content">
      <div
        className={`nav-item ${activeStage === 'home' ? 'active' : ''}`}
        role="button"
        tabIndex={0}
        aria-pressed={activeStage === 'home'}
        onClick={() => onStageSelect('home')}
        onKeyDown={(e) => onKeyActivate(e, () => onStageSelect('home'))}
      >
        <i className="pi pi-info-circle" />
        <span className="nav-name">How It Works</span>
      </div>
    </div>
  </div>
);

export default NavigationSection;
