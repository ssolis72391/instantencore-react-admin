import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import Pkg from "../package.json";
import App from "./App";
import store from "./store";

import "./styles/styles.scss";

export default class DigitalProgramBookComponent {
  constructor(config) {
    this.config = config || {};
    window.iedpb = {};
    window.iedpb.appConfig = config;
  }

  getBasename() {
    const pathParts = document.location.pathname.split("/");
    let basename = "";
    if (pathParts.length >= 4) {
      //const basename = "@instantencore/digital-program-book/0.1.43/";
      //basename = `${pathParts[1]}/${pathParts[2]}/${pathParts[3]}`;
    }
    //basename = "/@instantencore/digital-program-book/0.1.0-PR144.4";
    //debugger;
    console.log(`basename: ${basename}`);
    return basename;
  }

  display() {
    const container = document.getElementById(this.config.target || "root");
    ReactDOM.render(
      <Provider store={store}>
        <div className="ie-dpb">
          {this.config.useBrowserRouter ? (
            // basename does not need to be set because we are not serving from a sub folder
            <BrowserRouter>
              <App config={this.config} />
            </BrowserRouter>
          ) : (
            <MemoryRouter>
              <App config={this.config} />
            </MemoryRouter>
          )}
        </div>
      </Provider>,
      container
    );
  }

  // Return a string with a package version
  version() {
    if (Pkg) {
      return Pkg.version;
    }
    return null;
  }

  destroy() {
    const container = document.getElementById(this.config.target || "root");
    ReactDOM.unmountComponentAtNode(container);
  }
}
