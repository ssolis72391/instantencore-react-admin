import React, { Component } from "react";
import { withRouter, Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import {
  ThemeProvider,
  createTheme,
  StylesProvider,
  createGenerateClassName,
} from "@material-ui/core/styles";
import { setConfig } from "./actions";
import routes from "./routing";
import getConfiguration from "./services/getConfiguration";

const defaultTheme = createTheme({
  typography: {
    fontFamily: ["Montserrat-Light", "sans-serif"].join(","),
    fontSize: 12,
  },
  palette: {
    primary: {
      main: "#1960bb",
    },
  },
});

const generateClassName = createGenerateClassName({
  productionPrefix: "hms-jss", // short prefix unique to the component
});

class App extends Component {
  state = {
    hasError: false,
    error: null,
  };

  componentDidMount() {
    this.props.setConfig({ ...this.props.config }, this.props.history);
    this.onLoad();
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
  }

  async onLoad() {
    try {
      const configuration = await getConfiguration();
      const { cssVariables, customCss } = configuration;
      let cssText = "";
      cssText += customCss;
      var style = document.createElement("style");
      style.type = "text/css";
      if (cssVariables.length > 0) {
        cssText += ".ie-dpb {";
        cssVariables.forEach((variable) => {
          cssText += `--${variable.name}: ${variable.value};`;
        });
        cssText += "}";
      }
      style.innerHTML = cssText;
      document.getElementsByTagName("head")[0].appendChild(style);
    } catch (error) {
      this.setState({ hasError: true, error });
    }
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong: {this.state.error}</h1>;
    }

    // customize theme colors, if available
    let theme = defaultTheme;
    const colors = this.props.config.colors;
    if (colors && colors.primary && colors.secondary && colors.action) {
      theme = createMuiTheme({
        typography: {
          fontFamily: ["Montserrat-Light", "sans-serif"].join(","),
          fontSize: 12,
        },
        palette: {
          // "action" color
          primary: {
            main: colors.action,
          },
          // "secondary" color
          secondary: {
            main: colors.secondary,
          },
          // "primary" color
          success: {
            main: colors.primary,
          },
        },
      });
    }

    return (
      <StylesProvider generateClassName={generateClassName}>
        <ThemeProvider theme={theme}>
          <Switch>
            {routes.map((item, i) => {
              return (
                <Route
                  key={i}
                  path={item.path}
                  exact={item.exact}
                  name={item.name}
                  render={(props) => <item.component {...props} />}
                />
              );
            })}
          </Switch>
        </ThemeProvider>
      </StylesProvider>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setConfig: (config, history) => {
      dispatch(setConfig(config, history));
    },
  };
};

export default withRouter(connect(null, mapDispatchToProps)(App));
