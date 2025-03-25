import { HTMLProps } from 'react';
import { cn } from '@/utils';

export function Footer({ className, ...props }: HTMLProps<HTMLHeadElement>) {
  return <footer className={cn('', className)} {...props}></footer>;
}
