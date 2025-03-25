import { taskService } from '@/services';
import { GetPaginatedQueryProps } from '@/types';
import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query';

export function useGetTasks({ page, limit, params = {} }: GetPaginatedQueryProps) {
  const query = useQuery({
    queryKey: ['tasks', ...Object.values(params), ...(page ? [page] : [])],
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
  return useInfiniteQuery({
    queryKey: ['tasks', 'infinite-tasks', ...Object.values(params ?? {})],
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
