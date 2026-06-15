'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { authApi } from '@/lib/api/auth';
import Cookies from 'js-cookie';

// Token lifespan: 5 days
const TOKEN_EXPIRY_DAYS = 5;

// Module-level flag: prevents checkAuth from being called concurrently
// if multiple components happen to trigger it at the same time.
let authCheckInFlight = false;

export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, setAuth, clearAuth, setLoading, token } = useAuthStore();

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        const { data } = await authApi.login(email, password);
        // Set cookie with explicit 5-day expiry so it persists across browser/server restarts
        Cookies.set('refreshToken', data.session.access_token, {
          expires: TOKEN_EXPIRY_DAYS,
          sameSite: 'lax',
        });
        setAuth(data.user, data.session.access_token);
        return data;
      } catch (error: any) {
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setAuth, setLoading]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      setLoading(true);
      try {
        const { data } = await authApi.register(name, email, password);
        // Set cookie with explicit 5-day expiry
        Cookies.set('refreshToken', data.session.access_token, {
          expires: TOKEN_EXPIRY_DAYS,
          sameSite: 'lax',
        });
        setAuth(data.user, data.session.access_token);
        return data;
      } catch (error: any) {
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setAuth, setLoading]
  );

  const logout = useCallback(async () => {
    Cookies.remove('refreshToken');
    clearAuth();
    router.push('/');
  }, [clearAuth, router]);

  /**
   * Verifies the stored token with the backend.
   * Protected by a module-level in-flight flag so it only runs once at a time,
   * even if multiple components call it on mount simultaneously.
   */
  const checkAuth = useCallback(async (background = false) => {
    // Get latest token directly from store (not the stale closure value)
    const currentToken = useAuthStore.getState().token;

    if (!currentToken) {
      setLoading(false);
      return;
    }

    // Deduplicate: if a check is already running, skip
    if (authCheckInFlight) return;
    authCheckInFlight = true;

    if (!background) {
      setLoading(true);
    }

    try {
      const { data } = await authApi.getMe();
      if (data?.user) {
        useAuthStore.getState().setAuth(data.user, currentToken);
      } else {
        // Token invalid or expired — clear everything
        Cookies.remove('refreshToken');
        useAuthStore.getState().clearAuth();
      }
    } catch {
      // Network error or 401 — clear session
      Cookies.remove('refreshToken');
      useAuthStore.getState().clearAuth();
    } finally {
      if (!background) {
        setLoading(false);
      }
      authCheckInFlight = false;
    }
  }, [setLoading]);

  const googleLogin = useCallback(
    async (googleToken: string) => {
      setLoading(true);
      try {
        const { data } = await authApi.googleLogin(googleToken);
        // Set cookie with explicit 5-day expiry
        Cookies.set('refreshToken', data.session.access_token, {
          expires: TOKEN_EXPIRY_DAYS,
          sameSite: 'lax',
        });
        setAuth(data.user, data.session.access_token);
        return data;
      } catch (error: any) {
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setAuth, setLoading]
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
