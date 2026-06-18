import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useApp } from '../providers/AppProvider';

export const ProtectedRoute: React.FC = () => {
  const { user, initialized, loading } = useApp();
  const location = useLocation();

  // Full Page Loader with a higher contrast and clear message
  if (!initialized || (loading && !user)) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        width: '100vw',
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#0a0a0f', // Match your dark theme
        color: '#ffffff',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid rgba(255, 255, 255, 0.1)',
          borderTop: '4px solid #6c5ce7',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }}></div>
        <p style={{ fontFamily: 'sans-serif', fontSize: '14px', opacity: 0.8 }}>
          Sincronizando ambiente seguro...
        </p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Auth successful, render children
  return <Outlet />;
};
