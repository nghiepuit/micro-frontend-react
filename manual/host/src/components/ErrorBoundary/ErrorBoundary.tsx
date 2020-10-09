import React, { ErrorInfo } from "react";

export class ErrorBoundary extends React.Component {
  public state = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Could not load microfrontend.</h1>;
    }

    return this.props.children;
  }
}
