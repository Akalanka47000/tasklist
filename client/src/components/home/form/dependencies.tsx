import { useMemo, useState } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, MultiSelect } from '@/components';
import { CASE_INSENSITIVE_REGEX, LIMIT, LIMIT_10, NE, SELECT } from '@/constants';
import { useDebounce } from '@/hooks';
import { useGetInfiniteTasks } from '@/hooks/services';
import { useTaskStore } from '@/store/task';
import { FormFieldProps } from '@/types';

export default function DependencyFormField({ form, name = 'dependencies' }: FormFieldProps) {
  const [search, setSearch] = useState('');
  const deferredSearch = useDebounce(search, 300);
  const selectedTask = useTaskStore((state) => state.selectedTask);
  const { data, isFetching, fetchNextPage } = useGetInfiniteTasks({
    params: {
      [SELECT]: '_id,title',
      filter: {
        ...(deferredSearch && { name: CASE_INSENSITIVE_REGEX.replace(':value', deferredSearch) }),
        ...(selectedTask && { _id: NE.replace(':value', selectedTask._id) })
      }
    },
    [LIMIT]: LIMIT_10
  });

  const dependencies = useMemo(() => (data ? data.pages.map((x) => x.docs).flat() : []), [data]);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <FormItem>
          <FormLabel>Dependencies</FormLabel>
          <FormControl>
            <MultiSelect
              selected={value ?? []}
              placeholder="Select dependencies..."
              options={
                dependencies?.map((e) => ({
                  value: e._id,
                  label: e.title
                })) ?? []
              }
              onChange={onChange}
              endReached={() => fetchNextPage()}
              isLoading={isFetching}
              searchProps={{
                value: search,
                onChange: setSearch
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
