import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { authService } from '../api/services';

const AUTH_STORAGE_KEY = 'course_saas_token';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(AUTH_STORAGE_KEY) || '');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(token));

  const persistToken = useCallback((nextToken) => {
    if (nextToken) {
      localStorage.setItem(AUTH_STORAGE_KEY, nextToken);
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    setToken(nextToken || '');
  }, []);

  const refreshProfile = useCallback(
    async (activeToken = token) => {
      if (!activeToken) {
        setUser(null);
        return null;
      }

      const response = await authService.me(activeToken);
      setUser(response.user);
      return response.user;
    },
    [token]
  );

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await authService.me(token);
        if (!cancelled) {
          setUser(response.user);
        }
      } catch (_error) {
        if (!cancelled) {
          persistToken('');
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [token, persistToken]);

  const login = useCallback(
    async (credentials) => {
      const response = await authService.login(credentials);
      persistToken(response.token);
      setUser(response.user);
      return response.user;
    },
    [persistToken]
  );

  const register = useCallback(
    async (payload) => {
      const response = await authService.register(payload);
      persistToken(response.token);
      setUser(response.user);
      return response.user;
    },
    [persistToken]
  );

  const logout = useCallback(() => {
    persistToken('');
    setUser(null);
  }, [persistToken]);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      isLoading,
      login,
      register,
      logout,
      refreshProfile
    }),
    [token, user, isLoading, login, register, logout, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
