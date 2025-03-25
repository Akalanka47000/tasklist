import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button
} from '@/components';
import { taskService } from '@/services';
import { useTaskStore } from '@/store/task';
import { filterAndNotifyError } from '@/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function DeleteDialog() {
  const isOpen = useTaskStore((state) => state.isTaskDeleteDialogOpen);
  const setIsOpen = useTaskStore((state) => state.setIsTaskDeleteDialogOpen);
  const selectedTask = useTaskStore((state) => state.selectedTask);

  const client = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => taskService.deleteTask({ id: selectedTask?._id }),
    onSuccess: (result) => {
      client.invalidateQueries({ queryKey: ['tasks'] });
      toast.success(result.message);
    },
    onError: filterAndNotifyError,
    onSettled: () => setIsOpen(false)
  });

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-left">Are you sure you want to delete this task?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>Cancel</AlertDialogCancel>
          <Button
            loading={mutation.isPending}
            disabled={mutation.isPending}
            onClick={mutation.mutate as any}
            variant="destructive">
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
