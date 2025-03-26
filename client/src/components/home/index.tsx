import { useState } from 'react';
import { Priority, TaskStatus } from '@shared/constants';
import { Button, DataTable, Filters } from '@/components';
import { dataAttributes } from '@/constants';
import { useGetTasks, useMediaQuery } from '@/hooks';
import { cn } from '@/utils';
import { columns } from './columns';
import { testIds as createDialogTestIds, default as CreateOrUpdateDialog } from './create-dialog';
import { default as DeleteDialog } from './delete';
import { default as DependencyDialog } from './dependency-dialog';

export const testIds = {
  ...createDialogTestIds,
  taskList: 'task-list',
  createButton: 'task-create-button'
};

export default function TaskTable() {
  const isMobile = useMediaQuery('(max-width: 768px)');

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
              },
              {
                key: 'status',
                placeholder: 'Status',
                options: Object.values(TaskStatus).map((status) => ({
                  key: status,
                  label: status
                })),
                className: 'md:max-w-36'
              },
              {
                key: 'priority',
                placeholder: 'Priority',
                options: Object.values(Priority)
                  .filter(Number)
                  .map((priority) => ({
                    key: Number(priority),
                    label: Priority[Number(priority)]
                  })),
                className: 'md:max-w-36'
              }
            ]}
            setFilters={setFilters}
            drawer={isMobile}
          />
        }
        useDataFetcher={{
          fn: useGetTasks as any,
          params: filters
        }}
        endComponent={
          <CreateOrUpdateDialog>
            <Button variant="outline" {...{ [dataAttributes.testId]: testIds.createButton }}>
              Create New Task
            </Button>
          </CreateOrUpdateDialog>
        }
        filterContainerClassName={cn(isMobile && 'justify-end')}
        endComponentClassName={cn(isMobile && 'ml-0')}
        tableProps={{
          body: {
            [dataAttributes.testId]: testIds.taskList
          }
        }}
      />
      <DeleteDialog />
      <DependencyDialog />
    </>
  );
}
