import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { AppState, AppAction } from './types';
import { appReducer, loadPersistedState } from './reducer';

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, undefined, loadPersistedState);

  useEffect(() => {
    // Listen to storage events across tabs if needed
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'genz_groww_prototype_state_v1' && e.newValue) {
        try {
          JSON.parse(e.newValue);
        } catch {

          // ignore
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return ctx;
}
