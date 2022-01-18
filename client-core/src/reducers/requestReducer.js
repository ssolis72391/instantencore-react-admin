// sample redux reducer
import { LOADING, SUCCESS_MESSAGE, ERROR_MESSAGE } from "../utils/constants";

function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action);
    } else {
      return state;
    }
  };
}

function loading(requestState, action) {
  return {
    loading: true,
  };
}

function successMessage(requestState, action) {
  return {
    loading: false,
    message: action.message,
    error: false,
  };
}

function errorMessage(requestState, action) {
  return {
    loading: false,
    message: action.message,
    error: true,
  };
}

export const requestReducer = createReducer(
  { loading: false, message: "", error: false },
  {
    LOADING: loading,
    SUCCESS_MESSAGE: successMessage,
    ERROR_MESSAGE: errorMessage,
  }
);
