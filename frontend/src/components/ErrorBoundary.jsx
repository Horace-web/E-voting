import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidUpdate(prevProps) {
    if (this.props.resetKey !== prevProps.resetKey && this.state.hasError) {
      this.setState({ hasError: false, error: null, errorInfo: null });
    }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });

    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
          <div className="max-w-2xl w-full bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h1 className="text-xl font-bold text-gray-900 mb-2">Une erreur est survenue</h1>
            <p className="text-gray-600 mb-4">
              L'application a rencontré une erreur inattendue. Copie le message ci-dessous et envoie-le moi.
            </p>

            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-auto text-sm">
              <pre className="whitespace-pre-wrap break-words">
                {String(this.state.error?.message || this.state.error || "Unknown error")}
                {this.state.error?.stack ? `\n\nStack:\n${this.state.error.stack}` : ""}
                {this.state.errorInfo?.componentStack ? `\n\nComponent stack:\n${this.state.errorInfo.componentStack}` : ""}
              </pre>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={this.handleReload}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                Recharger
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("api_error_logs");
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  localStorage.removeItem("role");
                  window.location.href = "/login";
                }}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium"
              >
                Réinitialiser session
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
