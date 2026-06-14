import apiClient from './client';

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

export interface WorkshopWhatYouWillLearnStep {
  title: string;
  description: string;
}

export interface WorkshopCourseOutcome {
  title: string;
  description: string;
  image: string;
}

export interface WorkshopRegistration {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    whatsappNumber?: string;
    avatar?: string;
  };
  workshopId: {
    _id: string;
    title: string;
    slug: string;
    price: number;
    currency: string;
    type?: 'one-day' | 'three-days';
  };
  workshopTitle: string;
  workshopSlug: string;
  name: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  age?: string;
  profession?: string;
  selectedDate: string;
  amountPaid: number;
  currency: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentId?: string;
  razorpayOrderId?: string;
  createdAt: string;
}

export interface Workshop {
  _id: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  instructor: string;
  instructorImage?: string;
  instructorDescription?: string;
  price: number;
  currency: string;
  thumbnail: string;
  tags: string[];
  isActive: boolean;
  createdAt: string;

  // Detail page fields
  originalPrice: number;
  priceCaption: string;
  bonusDeadlineText: string;
  heroPoints: string[];
  workshopDates: string[];

  // Rich content
  highlights: WorkshopHighlight[];
  modules: WorkshopModule[];
  targetAudience: WorkshopTargetAudience[];
  learningOutcomes: string[];
  whatYouWillLearn?: WorkshopWhatYouWillLearnStep[];
  courseOutcomes?: WorkshopCourseOutcome[];
  experts: WorkshopExpert[];

  // Ratings
  rating1Value?: string;
  rating1Count?: string;
  rating1Platform?: string;
  rating2Value?: string;
  rating2Count?: string;
  rating2Platform?: string;
  type?: 'one-day' | 'three-days';
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

export interface CreateOrderResponse {
  success: boolean;
  data: {
    orderId: string;
    amount: number;
    currency: string;
    registrationId: string;
    keyId: string;
    workshopTitle: string;
    basePrice: number;
    gstAmount: number;
    totalAmount: number;
  };
}

export const workshopApi = {
  /**
   * List all ACTIVE workshops (public, no auth required).
   * Used by the Navbar popup and any public listing.
   */
  listPublic: async (params?: { page?: number; limit?: number; tag?: string; type?: string }) => {
    const res = await apiClient.get<WorkshopListResponse>('/workshops', { params });
    return res.data;
  },

  /**
   * List ALL workshops including inactive (admin only, requires auth).
   * Used by the Admin Dashboard workshops page.
   */
  list: async (params?: { page?: number; limit?: number; tag?: string; type?: string }) => {
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
  create: async (data: Partial<Workshop>) => {
    const res = await apiClient.post('/workshops', data);
    return res.data;
  },

  /**
   * Update an existing workshop by ID (admin only).
   */
  update: async (id: string, data: Partial<Workshop>) => {
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

  /**
   * Register a logged-in user for a workshop (LEGACY — kept for backward compat).
   */
  registerForWorkshop: async (
    workshopId: string,
    data: {
      name: string;
      email: string;
      phone: string;
      whatsappNumber?: string;
      selectedDate: string;
      age?: string;
      profession?: string;
    }
  ) => {
    const res = await apiClient.post<{ success: boolean; data: { registration: WorkshopRegistration }; message: string }>(
      `/workshops/${workshopId}/register`,
      data
    );
    return res.data;
  },

  /**
   * Admin: get all workshop registrations.
   */
  getWorkshopRegistrations: async () => {
    const res = await apiClient.get<{ success: boolean; data: { registrations: WorkshopRegistration[] } }>(
      '/admin/workshop-registrations'
    );
    return res.data;
  },

  // ─── Razorpay Payment Flow ─────────────────────────────────

  /**
   * Create a Razorpay order for workshop registration.
   * Returns order details needed to open Razorpay checkout.
   */
  createPaymentOrder: async (data: {
    workshopId: string;
    name: string;
    email: string;
    phone: string;
    whatsappNumber?: string;
    selectedDate: string;
    age?: string;
    profession?: string;
  }) => {
    const res = await apiClient.post<CreateOrderResponse>('/payments/create-order', data);
    return res.data;
  },

  /**
   * Verify Razorpay payment after checkout completes.
   */
  verifyPayment: async (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    registrationId: string;
  }) => {
    const res = await apiClient.post<{ success: boolean; data: { registration: WorkshopRegistration }; message: string }>(
      '/payments/verify',
      data
    );
    return res.data;
  },

  /**
   * Mark a payment as failed (when user dismisses Razorpay checkout).
   */
  markPaymentFailed: async (registrationId: string) => {
    const res = await apiClient.post<{ success: boolean; message: string }>(
      '/payments/failed',
      { registrationId }
    );
    return res.data;
  },
};
