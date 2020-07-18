import React from "react";
import ReactDOM from "react-dom";
import ReactGA from "react-ga";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import App from "./app/App";
import getStore from "./app/store";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

const { store, persistor } = getStore();

if (process.env.REACT_APP_GA_TRACKING_ID) {
  ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID, {
    // debug: true,
  });
  ReactGA.pageview(window.location.pathname + window.location.search);
}

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
