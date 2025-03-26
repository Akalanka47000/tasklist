import { cn } from '@/utils';

export function BooleanBadge({ value, invertColors }: { value?: boolean; invertColors?: boolean }) {
  const condition = invertColors ? !value : value;
  return (
    <span
      className={cn(
        'rounded-full px-2 py-[.15rem] text-xs w-fit cursor-default',
        condition && 'bg-green-500/10 border border-green-500/10 text-green-500',
        !condition && 'bg-red-500/10 border border-red-500/10 text-red-500'
      )}>
      {value ? 'Yes' : 'No'}
    </span>
  );
}

export default BooleanBadge;
