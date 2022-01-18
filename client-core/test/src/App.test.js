import React from "react";
import { Provider } from "react-redux";
import App from "../../src/App";
import thunk from "redux-thunk";
import { MemoryRouter } from "react-router-dom";
import configureMockStore from "redux-mock-store";
import { act, render } from "@testing-library/react";
import * as fetchMock from "jest-fetch-mock";
fetchMock.enableMocks();
const mockStore = configureMockStore([thunk]);

// mock icons to prevent issues with random identifiers
jest.mock("@fortawesome/react-fontawesome", () => ({
  // eslint-disable-next-line react/display-name
  FontAwesomeIcon: ({ title }) => <div title={title}>{title} Icon</div>,
}));

let component;

describe("App", () => {
  it("renders", async () => {
    //   fetchMock.mockResponseOnce(
    //     JSON.stringify({
    //       helloWorldEndpointUrl: "http://dontfetchme",
    //     })
    //   );
    //   fetchMock.mockResponseOnce(JSON.stringify([]));
    //   const mockOnEvent = jest.fn();
    //   const config = {
    //     target: "root",
    //     backLabel: "Back",
    //     onEvent: mockOnEvent,
    //   };
    //   const store = mockStore({
    //     config,
    //     app: { data: {} },
    //   });
    //   await act(
    //     async () =>
    //       (component = render(
    //         <Provider store={store}>
    //           <MemoryRouter>
    //             <App config={config} />
    //           </MemoryRouter>
    //         </Provider>
    //       ))
    //   );
    //   const { asFragment } = component;
    //   const html = asFragment();
    //   expect(html).toMatchSnapshot(); // empty
    //   mockOnEvent.mockClear();
  });
});
