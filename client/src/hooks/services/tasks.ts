import { taskService } from '@/services';
import { GetPaginatedQueryProps } from '@/types';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export function useGetTasks({ page, limit, params = {} }: GetPaginatedQueryProps) {
  const query = useQuery({
    queryKey: ['tasks', ...Object.values(params), ...(page ? [page] : [])],
    queryFn: () =>
      taskService.getTasks({
        options: {
          params: {
            page,
            limit,
            ...params
          }
        }
      }),
    retry: 1,
    placeholderData: keepPreviousData
  });
  return query;
}
