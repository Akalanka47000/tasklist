import { useState } from 'react';
import { Button, DataTable, Filters } from '@/components';
import { useGetTasks } from '@/hooks';
import { columns } from './columns';
import { default as CreateOrUpdateDialog } from './create-or-update';
import { default as DeleteDialog } from './delete';

export default function TaskTable() {
  const [filters, setFilters] = useState({});

  return (
    <>
      <DataTable
        columns={columns}
        filters={
          <Filters
            definitions={[
              {
                key: 'title',
                placeholder: 'Search...',
                regexp: true
              }
            ]}
            setFilters={setFilters}
          />
        }
        useDataFetcher={{
          fn: useGetTasks as any,
          params: filters
        }}
        endComponent={
          <CreateOrUpdateDialog>
            <Button variant="outline">Create New Task</Button>
          </CreateOrUpdateDialog>
        }
      />
      <DeleteDialog />
    </>
  );
}
