import React, { useEffect, useMemo, useState } from 'react';
import promptEngine, { setDomainWeights, getDomainWeights } from '../../engines/prompt/PromptEngine.js';
import { logger } from '../../utils/logger.js';

const STORAGE_KEY = 'domainWeightsOverrides';

const coerceWeight = (v) => {
  const n = Math.max(1, Number(v || 1));
  return Number.isFinite(n) ? Math.floor(n) : 1;
};

const DomainWeightsSection = () => {
  const [domainNames, setDomainNames] = useState([]);
  const [weights, setWeights] = useState({});

  // Load stats & current weights
  useEffect(() => {
    try {
      const stats = promptEngine.getStats();
      const names = stats?.scenarios?.domainNames || [];
      setDomainNames(names);
      const current = getDomainWeights() || {};
      setWeights(current);
      logger.debug('DomainWeightsSection', 'init:loaded-stats', {
        domainCount: names.length,
        sampleWeights: Object.fromEntries(Object.entries(current).slice(0, 6)),
      });
    } catch (e) {
      logger.warn('DomainWeightsSection', 'Failed to read engine stats/weights', { error: e?.message });
    }
  }, []);

  // Apply overrides from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const stored = JSON.parse(raw);
      if (stored && typeof stored === 'object') {
        setDomainWeights(stored);
        setWeights(prev => ({ ...prev, ...stored }));
        logger.info('DomainWeightsSection', 'Applied stored domain weight overrides', { keys: Object.keys(stored) });
      }
    } catch (e) {
      logger.warn('DomainWeightsSection', 'Invalid stored overrides', { error: e?.message });
    }
  }, []);

  const sortedDomains = useMemo(() => {
    return [...domainNames].sort((a, b) => a.localeCompare(b));
  }, [domainNames]);

  const handleChange = (name, value) => {
    const newVal = coerceWeight(value);
    setWeights(prev => ({ ...prev, [name]: newVal }));
    try {
      setDomainWeights({ [name]: newVal }); // partial merge in repo
      const raw = localStorage.getItem(STORAGE_KEY);
      const existing = raw ? (JSON.parse(raw) || {}) : {};
      const merged = { ...existing, [name]: newVal };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      const snapshot = getDomainWeights() || {};
      logger.info('DomainWeightsSection', 'Weight updated', { name, newVal, effective: snapshot[name] });
      logger.debug('DomainWeightsSection', 'weights-snapshot', {
        changed: name,
        sample: Object.fromEntries(Object.entries(snapshot).slice(0, 8))
      });
    } catch (e) {
      logger.error('DomainWeightsSection', 'Failed to update weight', { name, error: e?.message });
    }
  };

  const handleReset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      // Easiest way to restore defaultDomainWeights from the engine singletons
      window.location.reload();
    } catch (e) {
      logger.warn('DomainWeightsSection', 'Failed to reset; reloading anyway', { error: e?.message });
      window.location.reload();
    }
  };

  return (
    <div className="explorer-section">
      <div className="section-header">
        <i className="pi pi-sliders-h" />
        <span className="section-title">Domain Weights</span>
        <div className="section-actions">
          <button
            className="quick-action-btn"
            onClick={handleReset}
            title="Clear overrides and reload with defaults"
            aria-label="Reset weights to defaults"
          >
            <i className="pi pi-undo" />
            Reset
          </button>
        </div>
      </div>
      <div className="section-content">
        <div className="weights-grid">
          {sortedDomains.map((name) => (
            <div className="weight-row" key={name}>
              <label className="weight-label" htmlFor={`w-${name}`}>{name}</label>
              <input
                id={`w-${name}`}
                type="number"
                min={1}
                step={1}
                className="weight-input"
                value={weights[name] ?? 1}
                onChange={(e) => handleChange(name, e.target.value)}
                aria-label={`Weight for ${name}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DomainWeightsSection;
