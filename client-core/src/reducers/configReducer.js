import { SET_CONFIG } from "../utils/constants";

export function configReducer(state = {}, action) {
  if (action.type === SET_CONFIG) {
    const { apiUrl, apiKey, storage } = action.config;
    return {
      ...state,
      apiUrl,
      apiKey,
      storage,
    };
  }
  return state;
}
