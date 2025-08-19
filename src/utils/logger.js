/**
 * Logger utility for consistent logging across the application
 * Provides different log levels and namespacing for better filtering
 *
 * Enhancements:
 * - Level control (error/warn/info/debug/trace)
 * - Production toggle via env (VITE_LOGGER_ENABLED) or localStorage
 * - Context-aware child loggers (withContext)
 * - Timing helpers (timeStart/timeEnd/measure)
 * - Error serialization
 * - Structured metadata enrichment (session, mode)
 */

/**
 * Application logger with namespacing and colorized output
 */
class Logger {
  constructor() {
    this.sessionStartTime = Date.now();
    this.lastLogTime = this.sessionStartTime;
    this.sessionId = Math.random().toString(36).slice(2, 10);
    this.defaultContext = {};
    this._timers = new Map();

    // severity map (lower = higher priority)
    this._severity = { error: 0, warn: 1, api: 2, state: 2, prompt: 2, info: 2, hydration: 2, navigation: 2, debug: 3, trace: 4 };
    this.level = this._detectLevel();
    this.enabled = this._detectEnabled();
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

  _getMode() {
    let mode;
    try {
      // Vite / Vitest (ESM)
      mode = (import.meta && import.meta.env && (import.meta.env.MODE || import.meta.env.NODE_ENV)) || undefined;
    } catch { mode = undefined; }
    if (!mode) {
      const env = (typeof globalThis !== 'undefined' && globalThis.process && globalThis.process.env) ? globalThis.process.env : undefined;
      mode = (env && (env.MODE || env.NODE_ENV)) || undefined;
    }
    return mode || 'development';
  }

  _getEnvVar(key) {
    let val;
    try {
      if (import.meta && import.meta.env && (key in import.meta.env)) {
        val = import.meta.env[key];
      }
    } catch { val = undefined; }
    if (typeof val === 'undefined') {
      const env = (typeof globalThis !== 'undefined' && globalThis.process && globalThis.process.env) ? globalThis.process.env : undefined;
      if (env && key in env) val = env[key];
    }
    return val;
  }

  _detectEnabled() {
    const mode = this._getMode();
    // local override via localStorage
    let ls = null;
    try {
      if (typeof localStorage !== 'undefined') {
        ls = localStorage.getItem('logger:enabled');
      }
    } catch { ls = null; }
    if (ls === 'true') return true;
    if (ls === 'false') return false;
    const envToggle = this._getEnvVar('VITE_LOGGER_ENABLED');
    if (typeof envToggle !== 'undefined') return String(envToggle) === 'true';
    // default: enabled unless explicitly disabled in production
    return mode !== 'production';
  }

  _detectLevel() {
    const fromEnv = this._getEnvVar('VITE_LOG_LEVEL');
    const fromLS = (() => {
      try {
        return typeof localStorage !== 'undefined' ? localStorage.getItem('logger:level') : null;
      } catch { return null; }
    })();
    const raw = (fromEnv || fromLS || 'info').toLowerCase();
    const valid = ['error', 'warn', 'info', 'debug', 'trace'];
    return valid.includes(raw) ? raw : 'info';
  }

  setLevel(level) {
    const valid = ['error', 'warn', 'info', 'debug', 'trace'];
    if (valid.includes(level)) this.level = level;
  }

  enable() { this.enabled = true; }
  disable() { this.enabled = false; }

  setDefaultContext(ctx = {}) {
    this.defaultContext = { ...(this.defaultContext || {}), ...(ctx || {}) };
  }

  withContext(ctx = {}) {
    const base = this;
    const merge = (data) => ({ sessionId: base.sessionId, mode: base._getMode(), ...(base.defaultContext || {}), ...(ctx || {}), ...(data || {}) });
    const mkwrap = (method) => (namespace, ...args) => {
      // last arg can be data object; merge it
      const data = args.length > 1 ? args[1] : null;
      const first = args.length > 0 ? args[0] : '';
      return base[method](namespace, first, merge(data));
    };
    return {
      info: mkwrap('info'),
      debug: mkwrap('debug'),
      warn: mkwrap('warn'),
      error: (namespace, message, data = null) => base.error(namespace, message, merge(data)),
      navigation: (from, to, data = null) => base.navigation(from, to, merge(data)),
      api: (namespace, method, endpoint, data = null) => base.api(namespace, method, endpoint, merge(data)),
      hydration: (namespace, message, data = null) => base.hydration(namespace, message, merge(data)),
      state: (namespace, message, data = null) => base.state(namespace, message, merge(data)),
      prompt: (namespace, message, data = null) => base.prompt(namespace, message, merge(data)),
      event: (namespace, eventName, payload = null, meta = null) => base.event(namespace, eventName, payload, merge(meta)),
      timeStart: (label, meta = null) => base.timeStart(label, merge(meta)),
      timeEnd: (label, meta = null) => base.timeEnd(label, merge(meta)),
      measure: (namespace, label, fn, meta = null) => base.measure(namespace, label, fn, merge(meta))
    };
  }

  /**
   * Log with a specific namespace and level
   */
  log(namespace, level, message, data = null, options = { timestamp: true }) {
    if (!this.enabled) return;
    const sevOk = (this._severity[level] ?? 2) <= (this._severity[this.level] ?? 2);
    if (!sevOk) return;

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
      case 'trace':
        style = 'color: #9E9E9E; font-weight: bold';
        prefix = '🧵';
        break;
    }

    const namespaceBadge = `[${namespace}]`;

    const meta = {
      sessionId: this.sessionId,
      mode: this._getMode(),
      ...(this.defaultContext || {}),
      ...(data || {})
    };

    // Serialize error if present
    if (meta && meta.error instanceof Error) {
      meta.error = {
        name: meta.error.name,
        message: meta.error.message,
        stack: meta.error.stack
      };
    }

    // Prefer console.error for error level
    const out = `%c${prefix} ${timeInfo} ${namespaceBadge} ${message}`;
    if (level === 'error') {
      console.error(out, style, meta);
    } else {
      console.log(out, style, meta);
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

  // Generic event logger for UI/engine interactions
  event(namespace, eventName, payload = null, meta = null) {
    this.log(namespace, 'info', `event:${eventName}`, { payload, ...(meta || {}) });
  }

  // Timing helpers
  timeStart(label, meta = null) {
    const key = `${label}:${Math.random().toString(36).slice(2, 8)}`;
    const now = (typeof performance !== 'undefined' && typeof performance.now === 'function') ? performance.now() : Date.now();
    this._timers.set(key, { start: now, label, meta });
    this.debug('Timer', `⏱️ start ${label}`, { key, ...(meta || {}) });
    return {
      end: (extra = null) => this.timeEnd(key, extra)
    };
  }

  timeEnd(keyOrLabel, meta = null) {
    const isKey = String(keyOrLabel).includes(':');
    let key = keyOrLabel;
    if (!isKey) {
      // find any timer with this label (last started wins)
      const found = Array.from(this._timers.entries()).reverse().find(([, v]) => v.label === keyOrLabel);
      key = found ? found[0] : null;
    }
    const rec = key ? this._timers.get(key) : null;
    if (!rec) {
      this.warn('Timer', `⏱️ missing timer ${keyOrLabel}`);
      return null;
    }
    const end = (typeof performance !== 'undefined' && typeof performance.now === 'function') ? performance.now() : Date.now();
    const durationMs = Math.max(0, end - rec.start);
    this.debug('Timer', `⏱️ end ${rec.label}`, { key, durationMs, ...(rec.meta || {}), ...(meta || {}) });
    this._timers.delete(key);
    return durationMs;
  }

  async measure(namespace, label, fn, meta = null) {
    const t = this.timeStart(label, meta);
    try {
      const res = await fn();
      this.info(namespace, `measure:${label}:success`, meta);
      t.end();
      return res;
    } catch (error) {
      this.error(namespace, `measure:${label}:error`, { ...(meta || {}), error });
      t.end();
      throw error;
    }
  }
}

// Export singleton instance
export const logger = Logger.getInstance();
