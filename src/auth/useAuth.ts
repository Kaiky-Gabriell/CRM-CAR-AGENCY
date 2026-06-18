import { useApp } from '../providers/AppProvider';

export const useAuth = () => {
  const { user, session, loading, initialized, signOut, refreshAuth } = useApp();
  return { user, session, loading, initialized, signOut, refreshAuth };
};

