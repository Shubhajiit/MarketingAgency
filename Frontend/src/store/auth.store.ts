import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '@/lib/api/auth';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  setAuth: (user: AuthUser, token?: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true, // Start as loading until we check auth status
      token: null,

      setAuth: (user, token) =>
        set((state) => ({
          user,
          isAuthenticated: true,
          isLoading: false,
          token: token !== undefined ? token : state.token,
        })),

      clearAuth: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          token: null,
        }),

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'ai-scale-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
      }),
    }
  )
);
