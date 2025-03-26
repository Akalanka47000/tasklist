import { TaskStatus } from '@shared/constants';
import { Blocks, CircleCheckBig, Ellipsis, Eye, Loader2, Pen, Trash2 } from 'lucide-react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components';
import { BooleanBadge, DataTableColumnHeader, PriorityBadge, StatusBadge } from '@/components/common';
import { taskService } from '@/services';
import { useTaskStore } from '@/store/task';
import { filterAndNotifyError } from '@/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<ITask>[] = [
  {
    accessorKey: 'title',
    header: 'Title'
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Priority" className="justify-center" />,
    cell: (data) => <PriorityBadge priority={data.row.original.priority} />,
    meta: {
      className: 'text-center'
    },
    enableSorting: true
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" className="justify-center" />,
    cell: (data) => <StatusBadge status={data.row.original.status} />,
    meta: {
      className: 'text-center'
    },
    enableSorting: true
  },
  {
    accessorKey: 'recurring_interval',
    header: 'Recurring Interval',
    cell: (data) => data.row.original.recurring_interval ?? '-',
    meta: {
      className: 'text-center'
    }
  },
  {
    accessorKey: 'recurring_source',
    header: 'Is Child Task',
    cell: (data) => <BooleanBadge value={!!data.row.original.recurring_source} />,
    meta: {
      className: 'text-center'
    }
  },
  {
    accessorKey: 'dependencies',
    header: 'Dependency count',
    cell: (data) => {
      if (data.row.original.dependencies.length) {
        return (
          <Button
            className="h-7 gap-2"
            variant="ghost"
            onClick={() => useTaskStore.getState().openTaskDependencyDialogWithSelector(data.row.original)}>
            {data.row.original.dependencies.length}
            <Eye className="w-4 h-4" />
          </Button>
        );
      }
      return 0;
    },
    meta: {
      className: 'text-center'
    }
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" className="justify-center" />,
    cell: (data) =>
      new Date(data.row.original.created_at).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }),
    meta: {
      className: 'text-center'
    },
    enableSorting: true
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: (data) => (
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 focus-visible:ring-0 focus-visible:ring-transparent">
              <span className="sr-only">Open menu</span>
              <Ellipsis className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <EditTask data={data.row.original} />
            <DeleteTask data={data.row.original} />
            {data.row.original.dependencies.length > 0 && <ViewTaskDependencies data={data.row.original} />}
            {data.row.original.status === TaskStatus.NotDone && <MarkTaskAsDone data={data.row.original} />}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }
];

function EditTask({ data }: { data: ITask }) {
  const openTaskDialogWithSelector = useTaskStore((store) => store.openTaskDialogWithSelector);

  const handleEdit = () => openTaskDialogWithSelector(data);

  return (
    <DropdownMenuItem className="gap-2" onClick={handleEdit}>
      <Pen className="h-4 w-4" />
      Edit
    </DropdownMenuItem>
  );
}

function DeleteTask({ data }: { data: ITask }) {
  const openTaskDeleteDialogWithSelector = useTaskStore((store) => store.openTaskDeleteDialogWithSelector);

  const handleDelete = () => openTaskDeleteDialogWithSelector(data);

  return (
    <DropdownMenuItem className="gap-2" onClick={handleDelete}>
      <Trash2 className="h-4 w-4" />
      Delete
    </DropdownMenuItem>
  );
}

function ViewTaskDependencies({ data }: { data: ITask }) {
  const openTaskDependencyDialogWithSelector = useTaskStore((store) => store.openTaskDependencyDialogWithSelector);

  const handleView = () => openTaskDependencyDialogWithSelector(data);

  return (
    <DropdownMenuItem className="gap-2" onClick={handleView}>
      <Blocks className="h-4 w-4" />
      View Dependencies
    </DropdownMenuItem>
  );
}

function MarkTaskAsDone({ data }: { data: ITask }) {
  const client = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      return taskService.updateTask({ id: data._id, data: { status: TaskStatus.Done } });
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: filterAndNotifyError
  });

  return (
    <DropdownMenuItem className="gap-2" onClick={mutation.mutate as any} disabled={mutation.isPending}>
      {mutation.isPending ? <Loader2 className="animate-spin h-4 w-4" /> : <CircleCheckBig className="h-4 w-4" />}
      Mark as Done
    </DropdownMenuItem>
  );
}
