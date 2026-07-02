import { useQuery } from '@tanstack/react-query';
import { workshopApi } from '@/lib/api/workshops';

export function useWorkshops(params?: { page?: number; limit?: number; tag?: string }) {
  return useQuery({
    queryKey: ['workshops', params],
    queryFn: () => workshopApi.list(params),
    staleTime: 5 * 60 * 1000, // 5 min
  });
}

export function useWorkshop(id: string) {
  return useQuery({
    queryKey: ['workshop', id],
    queryFn: () => workshopApi.get(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 min
  });
}

export function usePublicWorkshops(params?: { page?: number; limit?: number; tag?: string; type?: string }) {
  return useQuery({
    queryKey: ['public-workshops', params],
    queryFn: () => workshopApi.listPublic(params),
    staleTime: 5 * 60 * 1000, // 5 min
  });
}

