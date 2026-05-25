'use client';

import { useCallback, useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { authApi } from '@/lib/api/auth';
import Cookies from 'js-cookie';

export function useAuth() {
  const { user, isAuthenticated, isLoading, setAuth, clearAuth, setLoading, token } = useAuthStore();

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        const { data } = await authApi.login(email, password);
        Cookies.set('refreshToken', data.session.access_token);
        setAuth(data.user, data.session.access_token);
        setLoading(false);
        return data;
      } catch (error: any) {
        setLoading(false);
        throw error;
      }
    },
    [setAuth, setLoading]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      setLoading(true);
      try {
        const { data } = await authApi.register(name, email, password);
        Cookies.set('refreshToken', data.session.access_token);
        setAuth(data.user, data.session.access_token);
        setLoading(false);
        return data;
      } catch (error: any) {
        setLoading(false);
        throw error;
      }
    },
    [setAuth, setLoading]
  );

  const logout = useCallback(async () => {
    Cookies.remove('refreshToken');
    clearAuth();
  }, [clearAuth]);

  const checkAuth = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    
    if (!isAuthenticated) {
      setLoading(true);
    }
    
    try {
      const { data } = await authApi.getMe();
      if (data?.user) {
        setAuth(data.user, token);
      } else {
        clearAuth();
      }
    } catch {
      clearAuth();
    } finally {
      setLoading(false);
    }
  }, [setAuth, clearAuth, setLoading, token, isAuthenticated]);

  const googleLogin = useCallback(
    async (googleToken: string) => {
      setLoading(true);
      try {
        const { data } = await authApi.googleLogin(googleToken);
        Cookies.set('refreshToken', data.session.access_token);
        setAuth(data.user, data.session.access_token);
        setLoading(false);
        return data;
      } catch (error: any) {
        setLoading(false);
        throw error;
      }
    },
    [setAuth, setLoading]
  );

  useEffect(() => {
    if (token && !user) {
      checkAuth();
    } else if (!token) {
      setLoading(false);
    }
  }, [token, user, checkAuth, setLoading]);

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
