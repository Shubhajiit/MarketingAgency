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

export const coursesApi = {
  list: async (params?: { all?: boolean }): Promise<CourseResponse> => {
    try {
      const res = await apiClient.get<CourseResponse>('/courses', { params });
      return res.data;
    } catch (error) {
      console.error("apiClient.get('/courses') failed:", error);
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
};
