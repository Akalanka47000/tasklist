import { Priority } from '@shared/constants';
import { cva } from 'class-variance-authority';
import { cn } from '@/utils';

const priorityVariants = cva('px-[.5rem] py-[.2rem] border text-xs rounded-full text-nowrap', {
  variants: {
    variant: {
      [Priority.Low]: 'bg-green-500/10 border border-green-500/10 text-green-500',
      [Priority.Medium]: 'bg-yellow-500/10 border border-yellow-500/10 text-yellow-500',
      [Priority.High]: 'bg-red-500/10 border border-red-500/10 text-red-500'
    }
  },
  defaultVariants: {
    variant: Priority.Low
  }
});

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={cn(
        'rounded-full px-2 py-[.15rem] text-xs w-fit cursor-default',
        priorityVariants({ variant: priority })
      )}>
      {Priority[priority]}
    </span>
  );
}

export default PriorityBadge;
