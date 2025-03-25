import { authService } from '@/services';
import { useAuthStore } from '@/store/auth';
import { useQuery } from '@tanstack/react-query';

export function useGetProfile() {
  const profile = useAuthStore((state) => state.profile);
  const setProfile = useAuthStore((state) => state.setProfile);
  const query = useQuery({
    queryKey: ['auth', profile?._id],
    queryFn: () => {
      return authService.current().then((profile) => {
        if (profile.data.email) setProfile(profile.data);
        return profile.data;
      });
    },
    retry: false
  });
  return {
    ...query,
    data: (query.isLoading || query.isFetching) && !query.data && profile ? profile : query.data
  };
}
