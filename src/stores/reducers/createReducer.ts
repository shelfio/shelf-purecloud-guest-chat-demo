import { has } from "lodash";

/**
 * Helper for reducers
 * @param {Object} initialState - store state
 * @param {Object} handlers - cb
 * @return {Function} {reducer} - ready to use reducer
 */
export default function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    if (has(handlers, action.type)) {
      return handlers[action.type](state, action);
    }

    return state;
  };
}
