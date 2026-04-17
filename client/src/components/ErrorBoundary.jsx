/* eslint-disable react/prop-types */
import React from 'react';

/**
 * 🛡️ ENTERPRISE ERROR BOUNDARY
 * ----------------------------
 * Prevents "White Screen of Death" by catching runtime errors 
 * and offering a graceful recovery UI.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // 📊 In production, you would send this to Sentry or LogRocket
    if (import.meta.env.PROD) {
      console.error("Critical Runtime Error Captured:", error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Systems Critical</h1>
          <p className="text-slate-400 mb-6 max-w-md">
            The application cluster encountered an unexpected runtime failure. 
            Session data is safe, but a reload is required to restore modular integrity.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium"
          >
            Restart Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
