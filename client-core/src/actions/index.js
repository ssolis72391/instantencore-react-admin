// sample redux actions

// import and export actions from parallel files here
// instead of putting them all in a single one

import {
  LOADING,
  SUCCESS_MESSAGE,
  ERROR_MESSAGE,
  SET_CONFIG,
} from "../utils/constants";

export function startRequest(value) {
  return {
    type: LOADING,
    value: value,
  };
}

export function showSuccessMessage(message = "") {
  return {
    type: SUCCESS_MESSAGE,
    message: message,
  };
}

export function showErrorMessage(error = "") {
  return {
    type: ERROR_MESSAGE,
    message: error,
  };
}

export function setConfig(config) {
  return {
    type: SET_CONFIG,
    config,
  };
}

export function emitEvent(category, action, data) {
  return (dispatch, getState) => {
    const { config } = getState();
    if (!category || !action) {
      // category and action are required
      console.error("Trying to emit event, but category or action missing.");
      return;
    }
    // wrap in a consistent object
    let appEvent = {
      category: category,
      action: action,
    };
    if (data) {
      appEvent.data = data;
    }
    if (config.onEvent) {
      config.onEvent(appEvent);
    } else {
      console.error("onEvent() undefined.");
    }
  };
}
