import React, { createContext, useReducer, useEffect } from 'react';
import { generateCycle, regenerateStage } from '../utils/advancedPromptGenerator.js';
import { ActionTypes, initialState } from './constants';
import { logger } from '../utils/logger.js';

// Reducer function with comprehensive logging
const promptReducer = (state, action) => {
  logger.debug('PromptContext', `Action dispatched: ${action.type}`, { 
    action, 
    currentState: state 
  });
  let newState;
  
  switch (action.type) {
    case ActionTypes.GENERATE_CYCLE_START:
      logger.info('PromptContext', 'Starting cycle generation');
      newState = {
        ...state,
        isLoading: true,
        error: null
      };
      break;

    case ActionTypes.GENERATE_CYCLE_SUCCESS:
      logger.info('PromptContext', 'Cycle generation successful', {
        cycleCount: state.cycleCount + 1,
        stagesGenerated: Object.keys(action.payload)
      });
      newState = {
        ...state,
        isLoading: false,
        currentCycle: action.payload,
        cycleHistory: [...state.cycleHistory, action.payload],
        cycleCount: state.cycleCount + 1,
        error: null
      };
      break;

    case ActionTypes.GENERATE_CYCLE_ERROR:
      logger.error('PromptContext', 'Cycle generation failed', { error: action.payload });
      newState = {
        ...state,
        isLoading: false,
        error: action.payload
      };
      break;

    case ActionTypes.REGENERATE_STAGE: {
      logger.info('PromptContext', `Regenerating stage: ${action.payload.stage}`, {
        stage: action.payload.stage,
        newPrompt: action.payload.prompt,
        hashtags: action.payload.hashtags
      });
      
      const updatedStages = state.currentCycle.stages.map(stage => 
        stage.stage === action.payload.stage ? action.payload : stage
      );
      
      const updatedCycle = {
        ...state.currentCycle,
        stages: updatedStages,
        timestamp: Date.now() // Update timestamp to force re-render
      };
      
      newState = {
        ...state,
        currentCycle: updatedCycle,
        cycleHistory: state.cycleHistory.map((cycle, index) => 
          index === state.cycleHistory.length - 1 ? updatedCycle : cycle
        )
      };
      break;
    }

    case ActionTypes.CLEAR_ERROR:
      logger.info('PromptContext', 'Clearing error state');
      newState = {
        ...state,
        error: null
      };
      break;

    case ActionTypes.RESET_CYCLES:
      logger.warn('PromptContext', 'Resetting all cycles and state');
      newState = {
        ...initialState
      };
      break;

    default:
      logger.warn('PromptContext', `Unknown action type: ${action.type}`, { action });
      newState = state;
      break;
  }
  
  const logStateChange = (action, previousState, newState) => {
    const stateChange = {
      cycleCountChanged: previousState.cycleCount !== newState.cycleCount,
      currentCycleChanged: previousState.currentCycle !== newState.currentCycle,
      loadingChanged: previousState.isLoading !== newState.isLoading,
      errorChanged: previousState.error !== newState.error,
      cycleHistoryChanged: previousState.cycleHistory.length !== newState.cycleHistory.length
    };

    // Log data structure validation
    if (newState.currentCycle) {
      const cycleValidation = {
        hasStages: Array.isArray(newState.currentCycle.stages),
        stageCount: newState.currentCycle.stages?.length || 0,
        hasTimestamp: !!newState.currentCycle.timestamp,
        timestampValid: newState.currentCycle.timestamp && !isNaN(new Date(newState.currentCycle.timestamp)),
        stagesStructure: newState.currentCycle.stages?.map(stage => ({
          stage: stage.stage,
          hasPrompt: !!stage.prompt,
          hasHashtags: Array.isArray(stage.hashtags),
          hashtagCount: stage.hashtags?.length || 0,
          hasCopyableText: !!stage.copyableText
        })) || []
      };

      logger.state('PromptContext', 'Cycle Data Validation', cycleValidation);
      
      // Log specific issues
      if (!cycleValidation.hasStages) {
        logger.warn('PromptContext', ' ISSUE: currentCycle.stages is not an array', {
          currentCycleType: typeof newState.currentCycle,
          stagesType: typeof newState.currentCycle.stages,
          stagesValue: newState.currentCycle.stages
        });
      }
      
      if (!cycleValidation.timestampValid) {
        logger.warn('PromptContext', ' ISSUE: Invalid timestamp in currentCycle', {
          timestamp: newState.currentCycle.timestamp,
          timestampType: typeof newState.currentCycle.timestamp
        });
      }
    }

    logger.state('PromptContext', 'State updated', {
      action: action.type,
      stateChange,
      cycleCount: newState.cycleCount,
      hasCurrentCycle: !!newState.currentCycle,
      isLoading: newState.isLoading,
      hasError: !!newState.error
    });
  };

  logStateChange(action, state, newState);

  return newState;
};

// Create context
const PromptContext = createContext();

// Provider component
export const PromptProvider = ({ children }) => {
  const [state, dispatch] = useReducer(promptReducer, initialState);

  // Generate initial cycle on mount
  useEffect(() => {
    generateNewCycle();
  }, []);

  // Action creators with comprehensive logging
  const generateNewCycle = async () => {
    logger.info('PromptProvider', 'User initiated new cycle generation');
    dispatch({ type: ActionTypes.GENERATE_CYCLE_START });
    
    try {
      logger.debug('PromptProvider', 'Calling generateCycle from promptGenerator');
      const newCycle = generateCycle();
      
      logger.prompt('PromptProvider', 'New cycle generated successfully', {
        stages: Object.keys(newCycle),
        stageDetails: Object.entries(newCycle).map(([stage, data]) => ({
          stage,
          hashtagCount: data.hashtags?.length || 0,
          promptLength: data.prompt?.length || 0,
          timestamp: data.timestamp
        }))
      });
      
      dispatch({ 
        type: ActionTypes.GENERATE_CYCLE_SUCCESS, 
        payload: newCycle 
      });
    } catch (error) {
      logger.error('PromptProvider', 'Failed to generate new cycle', { 
        error: error.message,
        stack: error.stack 
      });
      dispatch({ 
        type: ActionTypes.GENERATE_CYCLE_ERROR, 
        payload: error.message 
      });
    }
  };

  const regenerateStagePrompt = (stage) => {
    logger.info('PromptProvider', `User requested stage regeneration: ${stage}`);
    
    try {
      logger.debug('PromptProvider', 'Calling regenerateStage from promptGenerator', { stage });
      const newStageData = regenerateStage(stage);
      
      logger.prompt('PromptProvider', `Stage ${stage} regenerated successfully`, {
        stage,
        newHashtags: newStageData.hashtags,
        newPrompt: newStageData.prompt,
        promptLength: newStageData.prompt?.length || 0,
        timestamp: newStageData.timestamp
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
    }
  };

  const clearError = () => {
    logger.info('PromptProvider', 'User cleared error state');
    dispatch({ type: ActionTypes.CLEAR_ERROR });
  };

  const resetCycles = () => {
    logger.warn('PromptProvider', 'User reset all cycles - clearing all data');
    dispatch({ type: ActionTypes.RESET_CYCLES });
  };

  // Context value
  const contextValue = {
    // Complete state object
    state: {
      currentCycle: state.currentCycle,
      cycleHistory: state.cycleHistory,
      loading: state.isLoading,
      error: state.error,
      cycleCount: state.cycleCount
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
    hasCurrentCycle: !!state.currentCycle
  };

  return (
    <PromptContext.Provider value={contextValue}>
      {children}
    </PromptContext.Provider>
  );
};

export default PromptContext;
