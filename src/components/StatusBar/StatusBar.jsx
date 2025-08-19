import React from 'react';

const StatusBar = ({ currentCycle, loading, error }) => {
  return (
    <div className="status-bar">
      <div className="status-left">
        <span className="status-item">
          <i className="pi pi-book" />
          Software Architecture Learning
        </span>
      </div>
      
      <div className="status-right">
        {loading && (
          <span className="status-item loading">
            <i className="pi pi-spin pi-spinner" />
            Generating...
          </span>
        )}
        {error && (
          <span className="status-item error">
            <i className="pi pi-exclamation-triangle" />
            Error
          </span>
        )}
        {!loading && !error && currentCycle && (
          <span className="status-item success">
            <i className="pi pi-check-circle" />
            Ready
          </span>
        )}
      </div>
    </div>
  );
};

export default StatusBar;
