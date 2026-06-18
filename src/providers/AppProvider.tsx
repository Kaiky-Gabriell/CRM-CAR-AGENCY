import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';
import { logger } from '../lib/logger';
// Unified State for Auth and Tenant
interface AppState {
  user: User | null;
  session: Session | null;
  companyId: string | null;
  initialized: boolean;
  loading: boolean;
}

interface AppContextType extends AppState {
  signOut: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    user: null,
    session: null,
    companyId: null,
    initialized: false,
    loading: true,
  });

  const updateState = useCallback((updates: Partial<AppState>) => {
    setState(prev => {
      const hasChanged = Object.entries(updates).some(([key, value]) => prev[key as keyof AppState] !== value);
      if (!hasChanged) return prev;
      return { ...prev, ...updates };
    });
  }, []);

  const resolveCompanyId = (user: User | null): string | null => {
    if (!user) return null;
    const cid = user.user_metadata?.company_id;
    logger.debug('AppProvider: Verificando company_id do usuário');

    if (cid) {
      // Aceita qualquer string por enquanto para facilitar o teste, mas loga se não for UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(cid)) {
        logger.warn('AppProvider: company_id não é um UUID padrão.');
      }
      return cid;
    }

    logger.error('AppProvider: CRÍTICO - Usuário sem company_id. Vá em Auth > Users > Metadata e adicione um company_id.');
    return null;
  };

  const refreshAuth = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) throw error;

      const user = session?.user ?? null;
      const cid = resolveCompanyId(user);

      updateState({
        session,
        user,
        companyId: cid,
        initialized: true,
        loading: false,
      });
    } catch (err) {
      logger.error('AppProvider initialization error:', err);
      updateState({ initialized: true, loading: false });
    }
  }, [updateState]);

  useEffect(() => {
    refreshAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        updateState({
          user: null,
          session: null,
          companyId: null,
          initialized: true,
          loading: false,
        });
      } else if (session) {
        const cid = resolveCompanyId(session.user);
        updateState({
          session,
          user: session.user,
          companyId: cid,
          initialized: true,
          loading: false,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [refreshAuth, updateState]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    updateState({
      user: null,
      session: null,
      companyId: null,
      initialized: true,
      loading: false,
    });
  }, [updateState]);

  const contextValue = useMemo(() => ({
    ...state,
    signOut,
    refreshAuth,
  }), [state, signOut, refreshAuth]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

