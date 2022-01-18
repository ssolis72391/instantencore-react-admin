import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import * as actions from "../../src/actions";
import * as constants from "../../src/utils/constants";

const mockStore = configureMockStore([thunk]);

describe("index actions", () => {
  it("should create action to set configuration", () => {
    const config = { test: "test config", another: "another test config" };
    expect(actions.setConfig(config)).toEqual({
      type: constants.SET_CONFIG,
      config,
    });
  });
});

describe("async index actions", () => {
  it("should not emit event if no params", () => {
    const spyError = jest.spyOn(console, "error").mockImplementation(() => {});
    const mockOnEvent = jest.fn();
    const store = mockStore({
      config: {
        onEvent: mockOnEvent,
      },
    });
    store.dispatch(actions.emitEvent());
    expect(spyError.mock.calls).toEqual([
      ["Trying to emit event, but category or action missing."],
    ]);
    spyError.mockClear();
  });

  it("should emit event if valid params", () => {
    const mockOnEvent = jest.fn();
    const store = mockStore({
      config: {
        onEvent: mockOnEvent,
      },
    });
    const category = "TEST CATEGORY";
    const action = "TEST ACTION";
    const data = { test: "data", test2: "data2" };
    store.dispatch(actions.emitEvent(category, action, data));
    expect(store.getActions()).toEqual([]);
  });
});
