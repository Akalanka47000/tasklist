import { taskService } from '@/services';
import { useAuthStore } from '@/store/auth';
import { GetPaginatedQueryProps } from '@/types';
import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query';

export function useGetTasks({ page, limit, params = {} }: GetPaginatedQueryProps) {
  const profile = useAuthStore((state) => state.profile);
  const query = useQuery({
    queryKey: ['tasks', ...Object.values(params), ...(page ? [page] : []), profile?._id],
    queryFn: () =>
      taskService
        .getTasks({
          options: {
            params: {
              page,
              limit,
              ...params
            }
          }
        })
        .then((res) => res.data),
    retry: 1,
    placeholderData: keepPreviousData
  });
  return query;
}

export function useGetInfiniteTasks({ limit, params }: GetPaginatedQueryProps) {
  const profile = useAuthStore((state) => state.profile);
  return useInfiniteQuery({
    queryKey: ['tasks', 'infinite-tasks', ...Object.values(params ?? {}), profile?._id],
    queryFn: ({ pageParam = 1 }) =>
      taskService
        .getTasks({
          options: {
            params: {
              page: pageParam,
              limit,
              ...params
            }
          }
        })
        .then((res) => res.data),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    retry: 1,
    staleTime: 30 * 1000
  });
}
