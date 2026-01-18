import React from 'react';

type Props = { children: React.ReactNode };
type State = { hasError: boolean; error?: Error };

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('UI ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <div className="bg-white border border-red-200 rounded-xl shadow p-6 max-w-lg">
            <h2 className="text-xl font-bold text-red-700 mb-2">Se produjo un error</h2>
            <p className="text-sm text-gray-700 mb-4">
              Lo sentimos, hubo un problema mostrando la página. Recarga e intenta de nuevo.
            </p>
            <pre className="text-xs text-gray-500 bg-red-50 p-3 rounded overflow-auto">
              {this.state.error?.message}
            </pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
