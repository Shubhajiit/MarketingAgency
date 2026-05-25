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
  workshopTime: string;
  duration: string;
  durationDetail: string;
  fee: string;
  feeNote: string;
  eligibility: string;
  eligibilityDetail: string;
  applicationDeadline: string | null;
  heroImage: string;
  brochureUrl: string;
  hasBrochure: boolean;

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
  /**
   * List all ACTIVE workshops (public, no auth required).
   * Used by the Navbar popup and any public listing.
   */
  listPublic: async (params?: { page?: number; limit?: number; tag?: string }) => {
    const res = await apiClient.get<WorkshopListResponse>('/workshops', { params });
    return res.data;
  },

  /**
   * List ALL workshops including inactive (admin only, requires auth).
   * Used by the Admin Dashboard workshops page.
   */
  list: async (params?: { page?: number; limit?: number; tag?: string }) => {
    const res = await apiClient.get<WorkshopListResponse>('/admin/workshops', { params });
    return res.data;
  },

  /**
   * Get a single workshop by its MongoDB _id (admin use).
   */
  get: async (id: string) => {
    const res = await apiClient.get<WorkshopDetailResponse>(`/workshops/${id}`);
    return res.data;
  },

  /**
   * Get a single workshop by URL slug (public, used on the detail page).
   */
  getBySlug: async (slug: string) => {
    const res = await apiClient.get<WorkshopDetailResponse>(`/workshops/${slug}`);
    return res.data;
  },

  /**
   * Create a new workshop (admin only).
   */
  create: async (data: Omit<Partial<Workshop>, 'slots'> & { slots?: Partial<WorkshopSlot>[] }) => {
    const res = await apiClient.post('/workshops', data);
    return res.data;
  },

  /**
   * Update an existing workshop by ID (admin only).
   */
  update: async (id: string, data: Omit<Partial<Workshop>, 'slots'> & { slots?: Partial<WorkshopSlot>[] }) => {
    const res = await apiClient.patch(`/workshops/${id}`, data);
    return res.data;
  },

  /**
   * Soft-delete a workshop by ID (admin only).
   */
  delete: async (id: string) => {
    const res = await apiClient.delete(`/workshops/${id}`);
    return res.data;
  },

  /**
   * Upload an image file (admin only).
   */
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await apiClient.post<{ success: boolean; url: string; filename: string }>('/workshops/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
};
