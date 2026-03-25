import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { clearAuthSession, getCurrentUser, signIn, signOut } from '../services/authService';
import { setUnauthorizedHandler } from '../services/httpClient';
import { getAccessToken } from '../services/tokenStore';
import type { AuthUser, LoginInput } from '../services/authService';

type AuthStatus = 'loading' | 'guest' | 'authenticated';

type AuthContextValue = {
  status: AuthStatus;
  user: AuthUser | null;
  login: (input: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<AuthUser | null>(null);

  const forceGuest = useCallback(() => {
    clearAuthSession();
    setUser(null);
    setStatus('guest');
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(forceGuest);
  }, [forceGuest]);

  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      const accessToken = getAccessToken();
      if (!accessToken) {
        if (isMounted) {
          setStatus('guest');
        }
        return;
      }

      try {
        const me = await getCurrentUser();
        if (!isMounted) {
          return;
        }

        setUser(me);
        setStatus('authenticated');
      } catch {
        if (!isMounted) {
          return;
        }

        forceGuest();
      }
    }

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, [forceGuest]);

  const login = useCallback(async (input: LoginInput) => {
    const me = await signIn(input);
    setUser(me);
    setStatus('authenticated');
  }, []);

  const logout = useCallback(async () => {
    await signOut();
    setUser(null);
    setStatus('guest');
  }, []);

  const value = useMemo(
    () => ({
      status,
      user,
      login,
      logout,
    }),
    [status, user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
