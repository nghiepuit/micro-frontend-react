import React from "react";
import {
  BrowserRouter,
  Link,
  Redirect,
  Route,
  Switch,
  RouteComponentProps,
} from "react-router-dom";
import { ErrorBoundary } from "../ErrorBoundary/ErrorBoundary";
import { MicroFrontend } from "../MicroFrontend/MicroFrontend";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import { ThemeProvider } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";

const RemoteA: React.FC<RouteComponentProps> = ({ history }) => (
  <MicroFrontend
    history={history}
    host={process.env.REACT_APP_REMOTEA_HOST!}
    name="RemoteA"
  />
);

const RemoteB: React.FC<RouteComponentProps> = ({ history }) => (
  <MicroFrontend
    history={history}
    host={process.env.REACT_APP_REMOTEB_HOST!}
    name="RemoteB"
  />
);

const Headline = styled.h1`
  font-size: 2rem;
  font-weight: 500;
  color: hotpink;
`;

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#bada55",
    },
  },
});

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Headline>
            <Link to="/">Host</Link>
          </Headline>
          <Button variant="contained" color="primary">
            green host button
          </Button>
          <nav>
            <div>
              <Link to="/a">Remote A</Link>
            </div>
            <div>
              <Link to="/b">Remote B</Link>
            </div>
          </nav>
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/a" />} />
            <Route path="/a" component={RemoteA} />
            <Route path="/b" component={RemoteB} />
            {/* <Route exact path="/details/:id" component={Details} /> */}
          </Switch>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
