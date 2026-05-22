import apiClient from './client';

export interface Video {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  price: number;
  currency: string;
  tags: string[];
  isPublished: boolean;
  hasPurchased?: boolean;
  videoUrl?: string | null;
  createdAt: string;
}

export const videoApi = {
  list: async (params?: { page?: number; limit?: number; tag?: string }) => {
    const res = await apiClient.get<{
      success: boolean;
      data: {
        videos: Video[];
        pagination: { page: number; limit: number; total: number; pages: number };
      };
    }>('/videos', { params });
    return res.data;
  },

  get: async (id: string) => {
    const res = await apiClient.get<{
      success: boolean;
      data: { video: Video };
    }>(`/videos/${id}`);
    return res.data;
  },

  getMyVideos: async () => {
    const res = await apiClient.get<{
      success: boolean;
      data: { videos: Video[] };
    }>('/videos/my');
    return res.data;
  },

  purchase: async (id: string) => {
    const res = await apiClient.post(`/videos/${id}/purchase`);
    return res.data;
  },
};
