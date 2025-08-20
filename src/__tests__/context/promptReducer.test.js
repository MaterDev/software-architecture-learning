import { describe, it, expect } from 'vitest';
import { promptReducer } from '../../context/promptReducer.js';
import { ActionTypes, initialState } from '../../context/constants.js';

const clone = (obj) => JSON.parse(JSON.stringify(obj));

describe('promptReducer - immediate generation & core flows', () => {
  it('GENERATE_CYCLE_START sets loading and clears error', () => {
    const s0 = clone(initialState);
    const s1 = promptReducer(s0, { type: ActionTypes.GENERATE_CYCLE_START });
    expect(s1.isLoading).toBe(true);
    expect(s1.error).toBe(null);
  });

  it('GENERATE_CYCLE_SUCCESS applies new cycle, appends to history, increments count', () => {
    const s0 = clone(initialState);
    const cycle = { id: 'c1', stages: [{ stage: 'Expert Engineer', prompt: 'x', hashtags: [] }], timestamp: Date.now() };
    const s1 = promptReducer(s0, { type: ActionTypes.GENERATE_CYCLE_SUCCESS, payload: cycle });
    expect(s1.isLoading).toBe(false);
    expect(s1.error).toBe(null);
    expect(s1.currentCycle).toEqual(cycle);
    expect(s1.cycleHistory.at(-1)).toEqual(cycle);
    expect(s1.cycleCount).toBe(1);
  });

  it('GENERATE_CYCLE_ERROR stores error and clears loading', () => {
    const s0 = clone(initialState);
    const s1 = promptReducer(s0, { type: ActionTypes.GENERATE_CYCLE_ERROR, payload: 'boom' });
    expect(s1.isLoading).toBe(false);
    expect(s1.error).toBe('boom');
  });

  it('REGENERATE_STAGE updates stage in currentCycle and last history entry', () => {
    const baseStage = { stage: 'Leader', prompt: 'old', hashtags: [], timestamp: 1 };
    const curr = { id: 'live', stages: [baseStage], timestamp: 1 };
    const s0 = { ...clone(initialState), currentCycle: curr, cycleHistory: [curr], cycleCount: 1 };

    const updatedStage = { stage: 'Leader', prompt: 'new', hashtags: ['#a'], timestamp: Date.now() };
    const s1 = promptReducer(s0, { type: ActionTypes.REGENERATE_STAGE, payload: updatedStage });

    expect(s1.currentCycle.stages[0]).toEqual(updatedStage);
    expect(s1.cycleHistory.at(-1).stages[0]).toEqual(updatedStage);
    expect(s1.currentCycle.timestamp).toBeTruthy();
  });

  it('HYDRATE_STATE restores persisted state and clears loading/error', () => {
    const persisted = { currentCycle: { id: 'p1', stages: [] }, cycleHistory: [{ id: 'p0', stages: [] }], cycleCount: 2 };
    const s1 = promptReducer(initialState, { type: ActionTypes.HYDRATE_STATE, payload: persisted });
    expect(s1.currentCycle?.id).toBe('p1');
    expect(s1.cycleHistory).toHaveLength(1);
    expect(s1.cycleCount).toBe(2);
    expect(s1.isLoading).toBe(false);
    expect(s1.error).toBe(null);
  });

  it('CLEAR_ERROR removes error', () => {
    const s0 = { ...clone(initialState), error: 'oops' };
    const s1 = promptReducer(s0, { type: ActionTypes.CLEAR_ERROR });
    expect(s1.error).toBe(null);
  });

  it('RESET_CYCLES returns to initial state', () => {
    const s0 = { ...clone(initialState), currentCycle: { id: 'x', stages: [] }, cycleCount: 3, cycleHistory: [{}], isLoading: true, error: 'x' };
    const s1 = promptReducer(s0, { type: ActionTypes.RESET_CYCLES });
    expect(s1).toEqual(initialState);
  });
});
