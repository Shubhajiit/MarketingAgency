import apiClient from './client';

export const paymentApi = {
  createOrder: async (data: {
    type: 'booking' | 'video';
    referenceId: string;
    gateway: 'razorpay' | 'stripe';
  }) => {
    const res = await apiClient.post('/payments/create-order', data);
    return res.data;
  },
};
