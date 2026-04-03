import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merges Tailwind classes with conflict resolution. Usage: cn('px-4', condition && 'bg-red-500') */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
