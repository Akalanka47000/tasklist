import { TaskStatus } from '@shared/constants';
import { cva } from 'class-variance-authority';
import { cn } from '@/utils';

const statusVariants = cva('px-[.5rem] py-[.2rem] border text-xs rounded-full text-nowrap', {
  variants: {
    variant: {
      [TaskStatus.Done]: 'bg-green-500/10 border border-green-500/10 text-green-500',
      [TaskStatus.NotDone]: 'bg-red-500/10 border border-red-500/10 text-red-500'
    }
  },
  defaultVariants: {
    variant: TaskStatus.NotDone
  }
});

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span
      className={cn('rounded-full px-2 py-[.15rem] text-xs w-fit cursor-default', statusVariants({ variant: status }))}>
      {status}
    </span>
  );
}

export default StatusBadge;
