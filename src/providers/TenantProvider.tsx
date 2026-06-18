import React from 'react';
import { useApp } from './AppProvider';

export const useTenant = () => {
  const { companyId, loading } = useApp();
  return { companyId, loading };
};

// Keeping the component for backwards compatibility if needed in the tree, 
// though it's no longer necessary in App.tsx
export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};
