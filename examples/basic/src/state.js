import { combineReducers, createStore as createReduxStore } from 'redux'

const LOAD_NAME = 'LOAD_NAME';
const LOAD_NAME_SUCCESS = 'LOAD_NAME_SUCCESS';
const LOAD_NAME_FAILURE = 'LOAD_NAME_FAILURE';

const aboutReducer = (
  state = { loading: false, loaded: false, name: null },
  action = {},
) => {
  switch (action.type) {
    case LOAD_NAME:
      return { ...state, loading: true };
    case LOAD_NAME_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        name: action.result
      };
    case LOAD_NAME_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: false,
        name: null,
        error: action.error,
      };
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  about: aboutReducer,
});

export function createStore (initialData) {
  return createReduxStore(rootReducer, initialData);
};

export function loadName(match) {
  return {
    types: [LOAD_NAME, LOAD_NAME_SUCCESS, LOAD_NAME_FAILURE],
    promise: () => new Promise(resolve => {
      // fake a delay to some client request
      setTimeout(() => resolve(match.params.name), 100);
    }),
  }
}
