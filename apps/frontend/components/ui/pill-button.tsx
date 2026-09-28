import React from 'react';
import { cn } from '@/lib/utils';

export interface PillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export function PillButton({ className, active, children, ...props }: PillButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center justify-center rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer',
        active
          ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm font-semibold'
          : 'bg-transparent theme-text-secondary hover:theme-text-primary hover:bg-black/[0.04] dark:hover:bg-white/[0.06]',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
