import React, { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // We would use our logger here, but ErrorBoundary is a class component.
    if (import.meta.env.DEV) {
      console.error('Uncaught error:', error, errorInfo);
    } else {
      console.error('An unexpected error occurred in React render tree.');
    }
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{ 
          padding: '2rem', 
          margin: '1rem', 
          background: 'rgba(225, 112, 85, 0.1)', 
          border: '1px solid var(--accent-danger)', 
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-primary)',
          fontFamily: 'sans-serif'
        }}>
          <h2 style={{ color: 'var(--accent-danger)', marginBottom: '1rem' }}>Ops! Algo deu errado.</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Ocorreu um erro ao renderizar este componente. Tente recarregar a página.
          </p>
          {import.meta.env.DEV && (
            <pre style={{ 
              background: 'var(--bg-primary)', 
              padding: '1rem', 
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              overflow: 'auto',
              maxHeight: '200px'
            }}>
              {this.state.error?.message}
            </pre>
          )}
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '1.5rem',
              background: 'var(--accent-primary)',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer'
            }}
          >
            Recarregar Sistema
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
