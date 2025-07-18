import React from "react";

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-500 text-center p-8 animate__fadeIn">
          Something went wrong. Please try again.
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;