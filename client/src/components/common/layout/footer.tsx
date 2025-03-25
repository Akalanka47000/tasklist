import { HTMLProps } from 'react';
import { cn } from '@/utils';

export function Footer({ className, ...props }: HTMLProps<HTMLHeadElement>) {
  return (
    <footer className={cn('w-full h-18 flex justify-center items-center bg-black', className)} {...props}>
      <span className="opacity-75 text-sm md:text-base tracking-wider">Built with ❤️ in Sri Lanka</span>
    </footer>
  );
}
