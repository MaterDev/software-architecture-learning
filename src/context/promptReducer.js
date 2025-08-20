import { ActionTypes, initialState } from './constants';
import { logger } from '../utils/logger.js';

export const promptReducer = (state, action) => {
  logger.debug('PromptContext', `Action dispatched: ${action.type}`, {
    action,
    currentState: state,
  });

  let newState = state;

  switch (action.type) {
    case ActionTypes.HYDRATE_STATE: {
      const persisted = action.payload || {};
      const safe = {
        currentCycle: persisted.currentCycle || null,
        cycleHistory: Array.isArray(persisted.cycleHistory) ? persisted.cycleHistory : [],
        cycleCount: Number.isFinite(persisted.cycleCount) ? persisted.cycleCount : 0,
      };
      logger.info('PromptContext', 'Hydrating state from persistence', {
        hasCurrent: !!safe.currentCycle,
        historyLen: safe.cycleHistory.length,
        cycleCount: safe.cycleCount,
      });
      newState = { ...state, ...safe, isLoading: false, error: null };
      break;
    }
    case ActionTypes.GENERATE_CYCLE_START:
      logger.info('PromptContext', 'Starting cycle generation');
      newState = { ...state, isLoading: true, error: null };
      break;

    case ActionTypes.GENERATE_CYCLE_SUCCESS:
      logger.info('PromptContext', 'Cycle generation successful', {
        cycleCount: state.cycleCount + 1,
        stagesGenerated: Array.isArray(action.payload?.stages)
          ? action.payload.stages.map((s) => s?.stage)
          : [],
      });
      newState = {
        ...state,
        isLoading: false,
        currentCycle: action.payload,
        cycleHistory: [...state.cycleHistory, action.payload],
        cycleCount: state.cycleCount + 1,
        error: null,
      };
      break;

    case ActionTypes.GENERATE_CYCLE_ERROR:
      logger.error('PromptContext', 'Cycle generation failed', { error: action.payload });
      newState = { ...state, isLoading: false, error: action.payload };
      break;

    // Removed preview/cached cycle flow

    case ActionTypes.REGENERATE_STAGE: {
      logger.info('PromptContext', `Regenerating stage: ${action.payload.stage}`, {
        stage: action.payload.stage,
        newPrompt: action.payload.prompt,
        hashtags: action.payload.hashtags,
      });

      if (!state.currentCycle || !Array.isArray(state.currentCycle.stages)) {
        logger.warn('PromptContext', 'REGENERATE_STAGE ignored: no currentCycle or stages array', {
          hasCurrentCycle: !!state.currentCycle,
          stagesType: typeof state.currentCycle?.stages,
        });
        newState = state;
        break;
      }

      const updatedStages = state.currentCycle.stages.map((stage) =>
        stage.stage === action.payload.stage ? action.payload : stage
      );

      const updatedCycle = {
        ...state.currentCycle,
        stages: updatedStages,
        timestamp: Date.now(), // force re-render
      };

      newState = {
        ...state,
        currentCycle: updatedCycle,
        cycleHistory: state.cycleHistory.map((cycle, index) =>
          index === state.cycleHistory.length - 1 ? updatedCycle : cycle
        ),
      };
      break;
    }

    case ActionTypes.CLEAR_ERROR:
      logger.info('PromptContext', 'Clearing error state');
      newState = { ...state, error: null };
      break;

    case ActionTypes.RESET_CYCLES:
      logger.warn('PromptContext', 'Resetting all cycles and state');
      newState = { ...initialState };
      break;

    default:
      logger.warn('PromptContext', `Unknown action type: ${action.type}`, { action });
      newState = state;
      break;
  }

  // Post-action logging snapshot
  const stateChange = {
    cycleCountChanged: state.cycleCount !== newState.cycleCount,
    currentCycleChanged: state.currentCycle !== newState.currentCycle,
    loadingChanged: state.isLoading !== newState.isLoading,
    errorChanged: state.error !== newState.error,
    cycleHistoryChanged: state.cycleHistory.length !== newState.cycleHistory.length,
  };

  if (newState.currentCycle) {
    const cycleValidation = {
      hasStages: Array.isArray(newState.currentCycle.stages),
      stageCount: newState.currentCycle.stages?.length || 0,
      hasTimestamp: !!newState.currentCycle.timestamp,
      timestampValid:
        newState.currentCycle.timestamp && !isNaN(new Date(newState.currentCycle.timestamp)),
      stagesStructure:
        newState.currentCycle.stages?.filter((s) => s != null).map((s) => ({
          stage: s?.stage || 'Unknown',
          hasPrompt: !!s?.prompt,
          hasHashtags: Array.isArray(s?.hashtags),
          hashtagCount: s?.hashtags?.length || 0,
          hasCopyableText: !!s?.copyableText,
        })) || [],
    };

    logger.state('PromptContext', 'Cycle Data Validation', cycleValidation);
  }

  logger.state('PromptContext', 'State updated', {
    action: action.type,
    stateChange,
    cycleCount: newState.cycleCount,
    hasCurrentCycle: !!newState.currentCycle,
    isLoading: newState.isLoading,
    hasError: !!newState.error,
  });

  return newState;
};
