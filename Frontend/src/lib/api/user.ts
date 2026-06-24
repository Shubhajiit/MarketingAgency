import apiClient from './client';

export const userApi = {
  getProfile: async () => {
    const res = await apiClient.get('/users/me');
    return res.data;
  },

  updateProfile: async (data: { name?: string; avatar?: string; phoneNumber?: string; whatsappNumber?: string }) => {
    const res = await apiClient.patch('/users/me', data);
    return res.data;
  },

  removeWorkshop: async (workshopId: string) => {
    const res = await apiClient.delete(`/users/me/workshops/${workshopId}`);
    return res.data;
  },

  getPurchaseHistory: async () => {
    const res = await apiClient.get('/users/me/purchase-history');
    return res.data;
  },
};
