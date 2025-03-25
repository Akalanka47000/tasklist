import { HTMLProps } from 'react';
import { cn } from '@/utils';
import { Footer } from './footer';
import { Header } from './header';

export function Layout({ className, children, ...props }: HTMLProps<HTMLElement>) {
  return (
    <>
      <Header />
      <main
        className={cn(
          'w-full overflow-x-hidden min-h-[92svh] flex flex-col justify-center items-center font-inter',
          className
        )}
        {...props}>
        {children}
      </main>
      <Footer />
    </>
  );
}
