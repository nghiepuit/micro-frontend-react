import React from "react";
import ReactDOM from "react-dom";
import { App } from "./components/App/App";
import { unregister } from "./serviceWorker";

// @ts-ignore
__webpack_public_path__ = `${process.env.REACT_APP_HOST}/`;

(window as any).renderRemoteA = (containerId: string, history: any) => {
  ReactDOM.render(
    <React.StrictMode>
      <App history={history} />
    </React.StrictMode>,
    document.getElementById(containerId)
  );
  unregister();
};

(window as any).unmountRemoteA = (containerId: string) => {
  ReactDOM.unmountComponentAtNode(document.getElementById(containerId)!);
};
