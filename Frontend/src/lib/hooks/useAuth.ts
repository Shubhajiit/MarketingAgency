'use client';

import { useCallback } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { authApi } from '@/lib/api/auth';
import { setAccessToken } from '@/lib/api/client';

export function useAuth() {
  const { user, isAuthenticated, isLoading, setAuth, clearAuth, setLoading } = useAuthStore();

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await authApi.login({ email, password });
      if (response.data?.user) {
        setAuth(response.data.user);
      }
      return response;
    },
    [setAuth]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const response = await authApi.register({ name, email, password });
      return response;
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Even if API call fails, clear local state
    }
    setAccessToken(null);
    clearAuth();
  }, [clearAuth]);

  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      // Try to refresh the token (uses httpOnly cookie)
      await authApi.refresh();
      const meResponse = await authApi.getMe();
      if (meResponse.data?.user) {
        setAuth(meResponse.data.user);
      } else {
        clearAuth();
      }
    } catch {
      clearAuth();
    }
  }, [setAuth, clearAuth, setLoading]);

  const googleLogin = useCallback(
    async (token: string) => {
      const response = await authApi.googleLogin(token);
      if (response.data?.user) {
        setAuth(response.data.user);
      }
      return response;
    },
    [setAuth]
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    googleLogin,
    logout,
    checkAuth,
  };
}
