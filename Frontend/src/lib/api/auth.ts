import apiClient from './client';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
}

export const authApi = {
  getMe: async () => {
    const res = await apiClient.get<{ data: { user: AuthUser } }>('/auth/me');
    return res.data;
  },
  login: async (email: string, password: string) => {
    const res = await apiClient.post<{ message: string, data: { session: { access_token: string }, user: AuthUser } }>('/auth/login', { email, password });
    return res.data;
  },
  register: async (name: string, email: string, password: string) => {
    const res = await apiClient.post<{ message: string, data: { session: { access_token: string }, user: AuthUser } }>('/auth/signup', { name, email, password });
    return res.data;
  },
  googleLogin: async (token: string) => {
    const res = await apiClient.post<{ message: string, data: { session: { access_token: string }, user: AuthUser } }>('/auth/google', { token });
    return res.data;
  }
};
