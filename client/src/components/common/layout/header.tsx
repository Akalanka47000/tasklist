import { HTMLProps } from 'react';
import { cn } from '@/utils';

export function Header({ className, ...props }: HTMLProps<HTMLHeadElement>) {
  return <header className={cn('', className)} {...props}></header>;
}
