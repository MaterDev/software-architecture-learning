// Action types for PromptContext reducer
export const ActionTypes = {
  GENERATE_CYCLE_START: 'GENERATE_CYCLE_START',
  GENERATE_CYCLE_SUCCESS: 'GENERATE_CYCLE_SUCCESS',
  GENERATE_CYCLE_ERROR: 'GENERATE_CYCLE_ERROR',
  REGENERATE_STAGE: 'REGENERATE_STAGE',
  CLEAR_ERROR: 'CLEAR_ERROR',
  RESET_CYCLES: 'RESET_CYCLES',
  HYDRATE_STATE: 'HYDRATE_STATE',
};

// Initial state for PromptContext
export const initialState = {
  currentCycle: null,
  cycleHistory: [],
  isLoading: false,
  error: null,
  cycleCount: 0,
};
