import React from "react";
import ErrorState from "./ErrorState";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught React rendering error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/login";
  };

  render() {
    if (this.state.hasError) {
      const errorMessage =
        typeof this.state.error?.message === "string"
          ? this.state.error.message
          : "An unexpected application rendering error occurred. Please try again.";

      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
          <div className="max-w-md w-full">
            <ErrorState
              message={errorMessage}
              onRetry={this.handleRetry}
            />
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
