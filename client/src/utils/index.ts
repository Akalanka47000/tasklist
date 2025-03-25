import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export * from './errors';
export * from './forms';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
