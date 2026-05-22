import apiClient, { setAccessToken } from './client';

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  isEmailVerified: boolean;
  purchasedVideos: string[];
  createdAt: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
    accessToken: string;
  };
}

interface RefreshResponse {
  success: boolean;
  data: {
    accessToken: string;
  };
}

export const authApi = {
  register: async (data: { name: string; email: string; password: string }) => {
    const res = await apiClient.post<AuthResponse>('/auth/register', data);
    return res.data;
  },

  login: async (data: { email: string; password: string }) => {
    const res = await apiClient.post<AuthResponse>('/auth/login', data);
    if (res.data.data?.accessToken) {
      setAccessToken(res.data.data.accessToken);
    }
    return res.data;
  },

  logout: async () => {
    const res = await apiClient.post('/auth/logout');
    setAccessToken(null);
    return res.data;
  },

  refresh: async () => {
    const res = await apiClient.post<RefreshResponse>('/auth/refresh');
    if (res.data.data?.accessToken) {
      setAccessToken(res.data.data.accessToken);
    }
    return res.data;
  },

  forgotPassword: async (email: string) => {
    const res = await apiClient.post('/auth/forgot-password', { email });
    return res.data;
  },

  resetPassword: async (data: { token: string; password: string }) => {
    const res = await apiClient.post('/auth/reset-password', data);
    return res.data;
  },

  getMe: async () => {
    const res = await apiClient.get<{ success: boolean; data: { user: AuthUser } }>('/users/me');
    return res.data;
  },
};
