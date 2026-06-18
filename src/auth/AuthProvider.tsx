import React from 'react';

// This component is now deprecated in favor of AppProvider.
// We keep it as a pass-through to avoid breaking imports if any remain.
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};
