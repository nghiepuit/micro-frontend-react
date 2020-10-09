import React from "react";
import { createBrowserHistory, History } from "history";
import { Router } from "react-router-dom";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import { ThemeProvider } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";

type AppProps = {
  history?: History;
};

const Headline = styled.h2`
  font-weight: 500;
`;

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#ff69b4",
    },
  },
});

export const App: React.FC<AppProps> = ({
  history = createBrowserHistory(),
}) => {
  return (
    <ThemeProvider theme={theme}>
      <Router history={history}>
        <Headline>Remote A</Headline>
        <Button variant="contained" color="primary">
          pink remote button
        </Button>
      </Router>
    </ThemeProvider>
  );
};
