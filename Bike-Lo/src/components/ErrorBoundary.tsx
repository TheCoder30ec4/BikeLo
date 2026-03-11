import React from 'react';

interface State {
  hasError: boolean;
  error?: Error | null;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    // Log error - in production send to monitoring
    // eslint-disable-next-line no-console
    console.error('Uncaught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, fontFamily: 'Inter, system-ui, Arial, sans-serif' }}>
          <h2 style={{ color: '#DC2626' }}>Something went wrong</h2>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#333' }}>
            {this.state.error?.message}
          </pre>
          <p>Please check the console for more details.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

