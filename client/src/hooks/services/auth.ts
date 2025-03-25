import { authService } from '@/services';
import { useQuery } from '@tanstack/react-query';

export function useGetProfile() {
  const query = useQuery({
    queryKey: ['auth'],
    queryFn: () => authService.current(),
    retry: false
  });
  return query;
}
