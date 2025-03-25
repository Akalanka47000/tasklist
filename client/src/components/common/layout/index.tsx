import { HTMLProps } from 'react';
import { cn } from '@/utils';
import { Footer } from './footer';
import { Header } from './header';

export function Layout({ className, children, ...props }: HTMLProps<HTMLElement>) {
  return (
    <main className={cn('w-full overflow-x-hidden min-h-svh flex justify-center items-center', className)} {...props}>
      <Header />
      {children}
      <Footer />
    </main>
  );
}
