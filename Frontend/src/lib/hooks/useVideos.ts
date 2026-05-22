import { useQuery } from '@tanstack/react-query';
import { videoApi } from '@/lib/api/videos';

export function useVideos(params?: { page?: number; limit?: number; tag?: string }) {
  return useQuery({
    queryKey: ['videos', params],
    queryFn: () => videoApi.list(params),
    staleTime: 10 * 60 * 1000,
  });
}

export function useVideo(id: string) {
  return useQuery({
    queryKey: ['video', id],
    queryFn: () => videoApi.get(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}

export function useMyVideos() {
  return useQuery({
    queryKey: ['my-videos'],
    queryFn: () => videoApi.getMyVideos(),
    staleTime: 5 * 60 * 1000,
  });
}
