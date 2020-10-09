import React, { Suspense, lazy } from "react";
import { createBrowserHistory, History } from "history";
import { Router, Route, Switch } from "react-router-dom";
import useUrlPrefix from "../../hooks/useUrlPrefix";

type AppProps = {
  history?: History;
};

const Detail = lazy(() => import("../Detail/Detail"));
const List = lazy(() => import("../List/List"));

const Routes: React.FC = () => {
  const urlPrefix = useUrlPrefix();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route path={urlPrefix} exact component={List} />
        <Route path={`${urlPrefix}details/:id`} exact component={Detail} />
      </Switch>
    </Suspense>
  );
};

export const App: React.FC<AppProps> = ({
  history = createBrowserHistory(),
}) => {
  return (
    <Router history={history}>
      <h2>Remote B</h2>
      <Routes />
    </Router>
  );
};
