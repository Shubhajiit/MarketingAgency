import apiClient from './client';
import { Course } from '@/components/common/CoursesCardsUI';

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  enrolledWorkshops: any[];
  enrolledCourses: Course[];
  createdAt: string;
}

export const adminApi = {
  getUsers: async () => {
    const res = await apiClient.get<{
      success: boolean;
      data: { users: AdminUser[] };
    }>('/admin/users');
    return res.data;
  },

  assignCourse: async (userId: string, courseId: string) => {
    const res = await apiClient.post<{
      success: boolean;
      message: string;
    }>('/admin/users/assign', { userId, courseId });
    return res.data;
  },

  unassignCourse: async (userId: string, courseId: string) => {
    const res = await apiClient.post<{
      success: boolean;
      message: string;
    }>('/admin/users/unassign', { userId, courseId });
    return res.data;
  },
};
