import React from 'react';
import { NavLink } from 'react-router-dom';
import { logger } from '../../utils/logger.js';

const NavigationSection = () => (
  <div className="explorer-section">
    <div className="section-header">
      <i className="pi pi-home" />
      <span className="section-title">Navigation</span>
    </div>
    <div className="section-content">
      <NavLink
        to="/how-it-works"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        onClick={() => logger.info('Navigation', 'navigate-how-it-works-click')}
      >
        <i className="pi pi-info-circle" />
        <span className="nav-name">How It Works</span>
      </NavLink>
    </div>
  </div>
);

export default NavigationSection;
