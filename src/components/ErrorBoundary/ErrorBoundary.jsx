import React from 'react';
import { logger } from '../../utils/logger.js';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Log the error with our custom logger
    logger.error('ErrorBoundary', 'React Error Boundary caught an error', {
      errorId,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      errorInfo: {
        componentStack: errorInfo.componentStack
      },
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });

    // Update state with error details
    this.setState({
      error,
      errorInfo,
      errorId
    });

    // You could also send this to an error reporting service here
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    logger.info('ErrorBoundary', 'User clicked retry button', {
      errorId: this.state.errorId,
      previousError: this.state.error?.message
    });
    
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null 
    });
  };

  handleReload = () => {
    logger.info('ErrorBoundary', 'User clicked reload page button', {
      errorId: this.state.errorId
    });
    
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container">
          <div className="error-boundary-content">
            {/* Error Header */}
            <div className="error-header">
              <div className="error-icon">💥</div>
              <div className="error-title">
                <h1>Something went wrong</h1>
                <p>The application encountered an unexpected error</p>
              </div>
            </div>

            {/* Error Details */}
            <div className="error-details">
              <div className="error-section">
                <h3>Error Information</h3>
                <div className="error-info">
                  <div className="error-item">
                    <strong>Error ID:</strong> <code>{this.state.errorId}</code>
                  </div>
                  <div className="error-item">
                    <strong>Error Type:</strong> <code>{this.state.error?.name || 'Unknown'}</code>
                  </div>
                  <div className="error-item">
                    <strong>Message:</strong> <code>{this.state.error?.message || 'No message available'}</code>
                  </div>
                  <div className="error-item">
                    <strong>Time:</strong> <code>{new Date().toLocaleString()}</code>
                  </div>
                </div>
              </div>

              {/* Stack Trace */}
              {this.state.error?.stack && (
                <div className="error-section">
                  <h3>Stack Trace</h3>
                  <div className="error-stack">
                    <pre>{this.state.error.stack}</pre>
                  </div>
                </div>
              )}

              {/* Component Stack */}
              {this.state.errorInfo?.componentStack && (
                <div className="error-section">
                  <h3>Component Stack</h3>
                  <div className="error-stack">
                    <pre>{this.state.errorInfo.componentStack}</pre>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="error-actions">
              <button 
                className="vscode-button"
                onClick={this.handleRetry}
              >
                🔄 Try Again
              </button>
              <button 
                className="vscode-button secondary"
                onClick={this.handleReload}
              >
                🔃 Reload Page
              </button>
              <button 
                className="vscode-button secondary"
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify({
                    errorId: this.state.errorId,
                    error: this.state.error?.message,
                    stack: this.state.error?.stack,
                    componentStack: this.state.errorInfo?.componentStack,
                    timestamp: new Date().toISOString()
                  }, null, 2));
                }}
              >
                📋 Copy Error Details
              </button>
            </div>

            {/* Help Text */}
            <div className="error-help">
              <p>
                This error has been logged with ID <code>{this.state.errorId}</code>. 
                You can copy the error details above to help with debugging.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
