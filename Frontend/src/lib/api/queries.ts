import apiClient from './client';

export interface UserQuery {
  _id: string;
  fullName: string;
  email: string;
  countryCode: string;
  phone: string;
  experience: string;
  querySection: string;
  learningMode: 'Online' | 'Classroom';
  consent: boolean;
  createdAt: string;
}

export const queriesApi = {
  submitQuery: async (data: Omit<UserQuery, '_id' | 'createdAt'>) => {
    const res = await apiClient.post<{ success: boolean; message: string }>('/queries', data);
    return res.data;
  },
  
  getAllQueries: async () => {
    const res = await apiClient.get<{ success: boolean; data: { queries: UserQuery[] } }>('/queries');
    return res.data;
  },
  
  deleteQuery: async (id: string) => {
    const res = await apiClient.delete<{ success: boolean; message: string }>(`/queries/${id}`);
    return res.data;
  }
};
