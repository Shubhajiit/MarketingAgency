import apiClient from './client';

export interface WorkshopSlot {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  totalSeats: number;
  bookedSeats: number;
  isAvailable: boolean;
  meetingLink: string;
}

export interface Workshop {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  currency: string;
  thumbnail: string;
  tags: string[];
  isActive: boolean;
  slots: WorkshopSlot[];
  createdAt: string;
}

interface WorkshopListResponse {
  success: boolean;
  data: {
    workshops: Workshop[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export const workshopApi = {
  list: async (params?: { page?: number; limit?: number; tag?: string }) => {
    const res = await apiClient.get<WorkshopListResponse>('/workshops', { params });
    return res.data;
  },

  get: async (id: string) => {
    const res = await apiClient.get<{ success: boolean; data: { workshop: Workshop } }>(`/workshops/${id}`);
    return res.data;
  },

  create: async (data: Partial<Workshop>) => {
    const res = await apiClient.post('/workshops', data);
    return res.data;
  },

  update: async (id: string, data: Partial<Workshop>) => {
    const res = await apiClient.patch(`/workshops/${id}`, data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await apiClient.delete(`/workshops/${id}`);
    return res.data;
  },
};
