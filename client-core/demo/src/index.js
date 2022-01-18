import DigitalProgramBookComponent from "../../src/index.js";
import * as serviceWorker from "../../src/serviceWorker";
import styles from "./styles.css";

// This index is for web browser testing,
// not used when exporting as a library
const app = new DigitalProgramBookComponent({
  // id of the container
  target: "dpb",
  cid: 1,
  useBrowserRouter: true,
  apiBasePath: "https://dpb-api.evan.instantencore.com/1",
  useMocks: false,
  onEvent: function (eventData) {
    console.log("on event in web", eventData);
  },
});

app.display();

console.log(`DigitalProgramBookComponent version: ${app.version()}`);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
