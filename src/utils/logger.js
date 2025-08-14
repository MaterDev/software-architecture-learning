/**
 * Logger utility for consistent logging across the application
 * Provides different log levels and namespacing for better filtering
 */

/**
 * Application logger with namespacing and colorized output
 */
class Logger {
  constructor() {
    this.sessionStartTime = Date.now();
    this.lastLogTime = this.sessionStartTime;
  }

  static getInstance() {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Get time elapsed since last log or since session start
   */
  getTimeInfo() {
    const now = Date.now();
    const sinceStart = ((now - this.sessionStartTime) / 1000).toFixed(2);
    const sinceLastLog = ((now - this.lastLogTime) / 1000).toFixed(2);
    this.lastLogTime = now;
    return `[${sinceStart}s | +${sinceLastLog}s]`;
  }

  /**
   * Log with a specific namespace and level
   */
  log(namespace, level, message, data = null, options = { timestamp: true }) {
    // Skip logging in production
    if (import.meta.env.MODE === 'production') return;

    const timeInfo = options.timestamp ? this.getTimeInfo() : '';

    // Colorize based on log level
    let style = '';
    let prefix = '';

    switch (level) {
      case 'info':
        style = 'color: #4CAF50; font-weight: bold';
        prefix = 'ℹ️';
        break;
      case 'debug':
        style = 'color: #2196F3; font-weight: bold';
        prefix = '🔍';
        break;
      case 'warn':
        style = 'color: #FF9800; font-weight: bold';
        prefix = '⚠️';
        break;
      case 'error':
        style = 'color: #F44336; font-weight: bold';
        prefix = '❌';
        break;
      case 'navigation':
        style = 'color: #9C27B0; font-weight: bold';
        prefix = '🧭';
        break;
      case 'api':
        style = 'color: #00BCD4; font-weight: bold';
        prefix = '🔄';
        break;
      case 'hydration':
        style = 'color: #FF5722; font-weight: bold';
        prefix = '💧';
        break;
      case 'state':
        style = 'color: #8BC34A; font-weight: bold';
        prefix = '🏪';
        break;
      case 'prompt':
        style = 'color: #E91E63; font-weight: bold';
        prefix = '💬';
        break;
    }

    const namespaceBadge = `[${namespace}]`;

    if (data) {
      console.log(
        `%c${prefix} ${timeInfo} ${namespaceBadge} ${message}`,
        style,
        data
      );
    } else {
      console.log(
        `%c${prefix} ${timeInfo} ${namespaceBadge} ${message}`,
        style
      );
    }
  }

  // Convenience methods for different log types
  info(namespace, message, data = null) {
    this.log(namespace, 'info', message, data);
  }

  debug(namespace, message, data = null) {
    this.log(namespace, 'debug', message, data);
  }

  warn(namespace, message, data = null) {
    this.log(namespace, 'warn', message, data);
  }

  error(namespace, message, data = null) {
    this.log(namespace, 'error', message, data);
  }

  navigation(from, to, data = null) {
    this.log('Router', 'navigation', `Navigation from ${from} to ${to}`, data);
  }

  api(namespace, method, endpoint, data = null) {
    this.log(namespace, 'api', `${method} ${endpoint}`, data);
  }

  hydration(namespace, message, data = null) {
    this.log(namespace, 'hydration', message, data);
  }

  // New methods for our prompt generation app
  state(namespace, message, data = null) {
    this.log(namespace, 'state', message, data);
  }

  prompt(namespace, message, data = null) {
    this.log(namespace, 'prompt', message, data);
  }
}

// Export singleton instance
export const logger = Logger.getInstance();
