import apiClient from './client';

export const userApi = {
  getProfile: async () => {
    const res = await apiClient.get('/users/me');
    return res.data;
  },

  updateProfile: async (data: { name?: string; avatar?: string }) => {
    const res = await apiClient.patch('/users/me', data);
    return res.data;
  },
};
