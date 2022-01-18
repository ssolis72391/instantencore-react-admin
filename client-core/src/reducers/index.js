// exports a rootReducer that combines all reducers

import { combineReducers } from "redux";
import { requestReducer } from "./requestReducer";
import { configReducer } from "./configReducer";
// ...add more reducer imports

const rootReducer = combineReducers({
  config: configReducer,
  request: requestReducer,
  // ...add more reducers
});

export default rootReducer;
