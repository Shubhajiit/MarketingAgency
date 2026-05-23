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

export interface WorkshopModule {
  title: string;
  content: string[];
}

export interface WorkshopHighlight {
  title: string;
  description: string;
}

export interface WorkshopTargetAudience {
  title: string;
  description: string;
}

export interface WorkshopExpert {
  name: string;
  role: string;
  image: string;
}

export interface Workshop {
  _id: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  instructor: string;
  price: number;
  currency: string;
  thumbnail: string;
  tags: string[];
  isActive: boolean;
  slots: WorkshopSlot[];
  createdAt: string;

  // Detail page fields
  batchNumber: string;
  startDate: string | null;
  duration: string;
  durationDetail: string;
  fee: string;
  feeNote: string;
  eligibility: string;
  eligibilityDetail: string;
  applicationDeadline: string | null;
  heroImage: string;
  brochureUrl: string;

  // Rich content
  highlights: WorkshopHighlight[];
  modules: WorkshopModule[];
  targetAudience: WorkshopTargetAudience[];
  learningOutcomes: string[];
  experts: WorkshopExpert[];
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

interface WorkshopDetailResponse {
  success: boolean;
  data: {
    workshop: Workshop;
  };
}

export const workshopApi = {
  list: async (params?: { page?: number; limit?: number; tag?: string }) => {
    const res = await apiClient.get<WorkshopListResponse>('/workshops', { params });
    return res.data;
  },

  get: async (id: string) => {
    const res = await apiClient.get<WorkshopDetailResponse>(`/workshops/${id}`);
    return res.data;
  },

  getBySlug: async (slug: string) => {
    const res = await apiClient.get<WorkshopDetailResponse>(`/workshops/slug/${slug}`);
    return res.data;
  },

  create: async (data: Omit<Partial<Workshop>, 'slots'> & { slots?: Partial<WorkshopSlot>[] }) => {
    const res = await apiClient.post('/workshops', data);
    return res.data;
  },

  update: async (id: string, data: Omit<Partial<Workshop>, 'slots'> & { slots?: Partial<WorkshopSlot>[] }) => {
    const res = await apiClient.patch(`/workshops/${id}`, data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await apiClient.delete(`/workshops/${id}`);
    return res.data;
  },
};
