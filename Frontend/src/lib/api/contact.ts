import apiClient from './client';

export interface ContactSubmitData {
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
}

export const contactApi = {
  submitContactForm: async (data: ContactSubmitData) => {
    const res = await apiClient.post('/contact', data);
    return res.data;
  }
};
