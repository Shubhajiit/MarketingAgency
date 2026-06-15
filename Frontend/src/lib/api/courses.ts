import apiClient from './client';
import { Course } from '@/components/common/CoursesCardsUI';

export interface CourseResponse {
  success: boolean;
  data: {
    courses: Course[];
  };
}

export interface SingleCourseResponse {
  success: boolean;
  data: {
    course: Course;
  };
}

export interface CourseOrderResponse {
  success: boolean;
  free?: boolean;
  message?: string;
  data: {
    orderId?: string;
    amount?: number;
    currency?: string;
    enrollmentId: string;
    keyId?: string;
    courseTitle?: string;
    basePrice?: number;
    gstAmount?: number;
    totalAmount?: number;
  };
}

export interface CourseVideo {
  _id: string;
  title: string;
  s3Key?: string;
  duration?: string;
  description?: string;
  order: number;
  url: string | null;
}

export interface CourseVideosResponse {
  success: boolean;
  message?: string;
  data: {
    course: {
      _id: string;
      title: string;
      instructorName?: string;
      metaType?: string;
    };
    videos: CourseVideo[];
  };
}

export const coursesApi = {
  list: async (params?: { all?: boolean }): Promise<CourseResponse> => {
    try {
      const res = await apiClient.get<CourseResponse>('/courses', { params });
      return res.data;
    } catch (error: any) {
      console.error("apiClient.get('/courses') failed:", {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data
      });
      return {
        success: false,
        data: { courses: [] }
      };
    }
  },

  get: async (id: string) => {
    const res = await apiClient.get<SingleCourseResponse>(`/courses/${id}`);
    return res.data;
  },

  create: async (data: Partial<Course>) => {
    const res = await apiClient.post<SingleCourseResponse>('/courses', data);
    return res.data;
  },

  update: async (id: string, data: Partial<Course>) => {
    const res = await apiClient.patch<SingleCourseResponse>(`/courses/${id}`, data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await apiClient.delete<{ success: boolean; message: string }>(`/courses/${id}`);
    return res.data;
  },

  enroll: async (id: string) => {
    const res = await apiClient.post<{ success: boolean; message: string; data: { enrolledCourses: string[] } }>(`/courses/${id}/enroll`);
    return res.data;
  },

  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await apiClient.post<{ success: boolean; url: string; filename: string }>('/courses/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // ─── Course Payment (Razorpay) ──────────────────────────────────

  /**
   * Create a Razorpay order for course enrollment.
   * If the course is free, backend auto-enrolls and returns free: true.
   */
  createCourseOrder: async (courseId: string): Promise<CourseOrderResponse> => {
    const res = await apiClient.post<CourseOrderResponse>('/payments/course/create-order', { courseId });
    return res.data;
  },

  /**
   * Verify Razorpay payment signature after checkout success.
   */
  verifyCoursePayment: async (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    enrollmentId: string;
  }) => {
    const res = await apiClient.post<{ success: boolean; message: string; data: any }>('/payments/course/verify', data);
    return res.data;
  },

  /**
   * Mark course payment as failed when user dismisses Razorpay checkout.
   */
  markCoursePaymentFailed: async (enrollmentId: string) => {
    const res = await apiClient.post<{ success: boolean; message: string }>('/payments/course/failed', { enrollmentId });
    return res.data;
  },

  // ─── Course Videos (AWS S3 Pre-signed URLs) ───────────────────

  /**
   * Get S3 pre-signed video URLs for an enrolled course.
   * Returns 403 if not enrolled.
   */
  getCourseVideos: async (courseId: string): Promise<CourseVideosResponse> => {
    const res = await apiClient.get<CourseVideosResponse>(`/courses/${courseId}/videos`);
    return res.data;
  },

  /**
   * Upload a course video file to S3.
   */
  uploadVideo: async (
    id: string,
    file: File,
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<{ success: boolean; s3Key: string; message: string }> => {
    const formData = new FormData();
    formData.append('video', file);
    const res = await apiClient.post<{ success: boolean; s3Key: string; message: string }>(
      `/courses/${id}/upload-video`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress,
      }
    );
    return res.data;
  },
};
