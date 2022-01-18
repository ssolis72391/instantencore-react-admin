import { applyMiddleware, compose, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import loggerMiddleware from "../middleware/logger";
import rootReducer from "../reducers";

function configureStore() {
  const middlewareEnhancer = applyMiddleware(loggerMiddleware, thunkMiddleware);

  const composedEnhancers = compose(middlewareEnhancer);

  const store = createStore(
    rootReducer, // root reducer with router state
    composedEnhancers
  );

  if (process.env.NODE_ENV !== "production" && module.hot) {
    module.hot.accept("../reducers", () => store.replaceReducer(rootReducer));
  }

  return store;
}

const store = configureStore();

export default store;
