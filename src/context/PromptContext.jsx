import React, { createContext, useReducer, useEffect, useRef } from 'react';
import { generateCycle, regenerateStage, setDomainWeights } from '../engines/prompt/PromptEngine.js';
import { logger } from '../utils/logger.js';
import { ActionTypes, initialState } from './constants';
import { promptReducer } from './promptReducer.js';

// Reducer moved to separate file for testability and to satisfy fast-refresh rules

// Create context
const PromptContext = createContext();

// Persistence key for storing prompt context state
const PERSIST_KEY = 'promptContextState.v1';

// Provider component
export const PromptProvider = ({ children }) => {
  const [state, dispatch] = useReducer(promptReducer, initialState);

  // Concurrency/race guards
  const isGeneratingRef = useRef(false);
  const hasMountedRef = useRef(false); // Avoid double-run under React Strict Mode
  const regeneratingRef = useRef(new Set()); // Track in-flight stage regenerations

  // Hydrate from localStorage on mount; only generate if nothing persisted
  useEffect(() => {
    if (hasMountedRef.current) return;
    hasMountedRef.current = true;

    // Apply persisted domain weight overrides BEFORE hydration/generation
    try {
      const rawWeights = localStorage.getItem('domainWeightsOverrides');
      if (rawWeights) {
        const stored = JSON.parse(rawWeights);
        if (stored && typeof stored === 'object') {
          setDomainWeights(stored);
          logger.info('PromptProvider', 'Applied persisted domain weight overrides before hydrate');
        }
      }
    } catch (e) {
      logger.warn('PromptProvider', 'Failed to apply persisted domain weights', { error: e?.message });
    }

    // Try hydration
    let hydrated = false;
    try {
      const raw = localStorage.getItem(PERSIST_KEY);
      if (raw) {
        const persisted = JSON.parse(raw);
        if (persisted && (persisted.currentCycle || (Array.isArray(persisted.cycleHistory) && persisted.cycleHistory.length > 0) || Number.isFinite(persisted.cycleCount))) {
          logger.info('PromptProvider', 'Hydrating prompt state from localStorage');
          dispatch({ type: ActionTypes.HYDRATE_STATE, payload: persisted });
          hydrated = true;
        }
      }
    } catch (e) {
      logger.warn('PromptProvider', 'Failed to hydrate prompt state', { error: e?.message });
    }

    if (!hydrated) {
      // First run: generate and apply initial cycle so app has content
      generateAndApplyInitialCycle();
    }
  }, []);

  // Persist selected state slices whenever they change
  useEffect(() => {
    try {
      const snapshot = {
        currentCycle: state.currentCycle,
        cycleHistory: state.cycleHistory,
        cycleCount: state.cycleCount,
      };
      localStorage.setItem(PERSIST_KEY, JSON.stringify(snapshot));
    } catch (e) {
      logger.warn('PromptProvider', 'Failed to persist prompt state', { error: e?.message });
    }
  }, [state.currentCycle, state.cycleHistory, state.cycleCount]);

  // Action creators with comprehensive logging
  // Generate and immediately apply a new cycle (no preview)
  const generateNewCycle = async () => {
    if (isGeneratingRef.current) {
      logger.warn('PromptProvider', 'Generation already in progress; ignoring duplicate request');
      return;
    }
    isGeneratingRef.current = true;

    logger.info('PromptProvider', 'User initiated cycle generation');
    dispatch({ type: ActionTypes.GENERATE_CYCLE_START });

    try {
      logger.debug('PromptProvider', 'Calling generateCycle from promptGenerator');
      const newCycle = generateCycle();

      logger.prompt('PromptProvider', 'New cycle generated successfully', {
        cycleId: newCycle?.id,
        stageNames: Array.isArray(newCycle?.stages)
          ? newCycle.stages.map((s) => s?.stage)
          : [],
        stageDetails: Array.isArray(newCycle?.stages)
          ? newCycle.stages.map((s) => ({
              stage: s?.stage,
              hashtagCount: s?.hashtags?.length || 0,
              promptLength: s?.prompt?.length || 0,
              timestamp: s?.timestamp,
            }))
          : [],
      });

      dispatch({ type: ActionTypes.GENERATE_CYCLE_SUCCESS, payload: newCycle });
    } catch (error) {
      logger.error('PromptProvider', 'Failed to generate new cycle', {
        error: error.message,
        stack: error.stack,
      });
      dispatch({ type: ActionTypes.GENERATE_CYCLE_ERROR, payload: error.message });
    } finally {
      isGeneratingRef.current = false;
    }
  };

  // Internal: generate and immediately apply (used on initial mount only)
  const generateAndApplyInitialCycle = async () => {
    if (isGeneratingRef.current) return;
    isGeneratingRef.current = true;

    dispatch({ type: ActionTypes.GENERATE_CYCLE_START });
    try {
      const newCycle = generateCycle();
      dispatch({ type: ActionTypes.GENERATE_CYCLE_SUCCESS, payload: newCycle });
    } catch (error) {
      dispatch({ type: ActionTypes.GENERATE_CYCLE_ERROR, payload: error.message });
    } finally {
      isGeneratingRef.current = false;
    }
  };

  const regenerateStagePrompt = (stage) => {
    if (regeneratingRef.current.has(stage)) {
      logger.warn('PromptProvider', `Stage regeneration already in progress for: ${stage}`);
      return;
    }
    regeneratingRef.current.add(stage);

    logger.info('PromptProvider', `User requested stage regeneration: ${stage}`);
    
    try {
      logger.debug('PromptProvider', 'Calling regenerateStage from promptGenerator', { stage });
      const newStageData = regenerateStage(stage);
      
      logger.prompt('PromptProvider', `Stage ${stage} regenerated successfully`, {
        stage,
        newHashtags: newStageData?.hashtags,
        newPrompt: newStageData?.prompt,
        promptLength: newStageData?.prompt?.length || 0,
        timestamp: newStageData?.timestamp
      });
      
      dispatch({
        type: ActionTypes.REGENERATE_STAGE,
        payload: newStageData
      });
    } catch (error) {
      logger.error('PromptProvider', `Failed to regenerate stage: ${stage}`, { 
        stage,
        error: error.message,
        stack: error.stack 
      });
      dispatch({ 
        type: ActionTypes.GENERATE_CYCLE_ERROR, 
        payload: error.message 
      });
    } finally {
      regeneratingRef.current.delete(stage);
    }
  };

  const clearError = () => {
    logger.info('PromptProvider', 'User cleared error state');
    dispatch({ type: ActionTypes.CLEAR_ERROR });
  };

  const resetCycles = () => {
    logger.warn('PromptProvider', 'User reset all cycles - clearing all data');
    dispatch({ type: ActionTypes.RESET_CYCLES });
    try { localStorage.removeItem(PERSIST_KEY); } catch (e) { logger.warn('PromptProvider', 'Failed to clear persisted state', { error: e?.message }); }
  };

  // Removed preview flow (apply/discard)

  // Context value
  const contextValue = {
    // Complete state object
    state: {
      currentCycle: state.currentCycle,
      cycleHistory: state.cycleHistory,
      loading: state.isLoading,
      error: state.error,
      cycleCount: state.cycleCount,
      
    },
    
    // Individual state properties for backward compatibility
    currentCycle: state.currentCycle,
    cycleHistory: state.cycleHistory,
    isLoading: state.isLoading,
    loading: state.isLoading,
    error: state.error,
    cycleCount: state.cycleCount,
    
    
    // Actions
    generateNewCycle,
    regenerateStagePrompt,
    clearError,
    resetCycles,
    
    // Utilities
    stages: ['Expert Engineer', 'System Designer', 'Leader', 'Review & Synthesis'],
    hasCurrentCycle: !!state.currentCycle,
    
  };

  return (
    <PromptContext.Provider value={contextValue}>
      {children}
    </PromptContext.Provider>
  );
};

export default PromptContext;
