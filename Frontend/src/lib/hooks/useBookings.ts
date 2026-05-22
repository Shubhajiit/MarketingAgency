import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';

interface Booking {
  _id: string;
  workshop: {
    _id: string;
    title: string;
    instructor: string;
    thumbnail: string;
  };
  slotDate: string;
  slotTime: string;
  amount: number;
  currency: string;
  paymentStatus: string;
  createdAt: string;
}

export function useMyBookings() {
  return useQuery({
    queryKey: ['my-bookings'],
    queryFn: async () => {
      const res = await apiClient.get<{
        success: boolean;
        data: { bookings: Booking[] };
      }>('/bookings/my');
      return res.data;
    },
    staleTime: 2 * 60 * 1000, // 2 min
  });
}

export function useBooking(id: string) {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: async () => {
      const res = await apiClient.get(`/bookings/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}
