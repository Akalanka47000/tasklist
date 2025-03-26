import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  PriorityBadge,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/common';
import { useTaskStore } from '@/store/task';

export default function DependencyDialog() {
  const isOpen = useTaskStore((state) => state.isTaskDependencyDialogOpen);
  const setIsOpen = useTaskStore((state) => state.setIsTaskDependencyDialogOpen);
  const selectedTask = useTaskStore((state) => state.selectedTask) as IDetailedTask;
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Task Depends On</DialogTitle>
        </DialogHeader>
        <Table className="border border-border/60">
          <TableHeader className="[&>th]:text-center [&>th]:border [&>th]:border-border/60">
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
          </TableHeader>
          <TableBody>
            {selectedTask?.dependencies.map((task) => {
              return (
                <TableRow key={task._id} className="[&>td]:text-center [&>td]:border [&>td]:border-border/60">
                  <TableCell>{task.title}</TableCell>
                  <TableCell>
                    <StatusBadge status={task.status} />
                  </TableCell>
                  <TableCell>
                    <PriorityBadge priority={task.priority} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
