import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form
} from '@/components/common';
import { taskService } from '@/services';
import { useTaskStore } from '@/store/task';
import { cn, filterAndNotifyError, filterDirtyFields } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormSchema, default as TaskForm } from './form';

export default function CreateOrUpdateDialog({ children }: { children: React.ReactNode }) {
  const isOpen = useTaskStore((state) => state.isTaskDialogOpen);
  const setIsOpen = useTaskStore((state) => state.setIsTaskDialogOpen);
  const selectedTask = useTaskStore((state) => state.selectedTask);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <CreateOrUpdateDialogContent key={selectedTask?._id} />
    </Dialog>
  );
}

function CreateOrUpdateDialogContent() {
  const setIsOpen = useTaskStore((state) => state.setIsTaskDialogOpen);
  const selectedTask = useTaskStore((state) => state.selectedTask);

  const client = useQueryClient();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: selectedTask?.title ?? '',
      status: selectedTask?.status,
      priority: selectedTask?.priority,
      recurring_interval: selectedTask?.recurring_interval,
      dependencies: (selectedTask?.dependencies as ITask[])?.map((d) => d._id)
    },
    mode: 'onBlur'
  });

  const mutation = useMutation({
    mutationFn: (data: any) => {
      if (selectedTask) {
        return taskService.updateTask({ id: selectedTask._id, data });
      }
      return taskService.createTask({ data });
    },
    onSuccess: (result) => {
      setIsOpen(false);
      form.reset();
      client.invalidateQueries({ queryKey: ['tasks'] });
      toast.success(result.message);
    },
    onError: filterAndNotifyError
  });

  const onSubmit: SubmitHandler<Partial<ITask>> = (data) => {
    mutation.mutate(selectedTask ? filterDirtyFields(form.formState.dirtyFields, data) : data);
  };

  return (
    <DialogContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{selectedTask ? 'Edit' : 'Add'} Task</DialogTitle>
          </DialogHeader>
          <TaskForm form={form} className={cn(mutation.isPending && 'opacity-50 pointer-events-none')} />
          <DialogFooter className="mt-4">
            <DialogClose disabled={mutation.isPending} asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button loading={mutation.isPending} disabled={!form.formState.isValid || mutation.isPending} type="submit">
              {selectedTask ? 'Save' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
