import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={id} className="block text-xs font-medium theme-text-secondary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full rounded-2xl theme-card border px-4 py-2.5 text-sm theme-text-primary placeholder:text-zinc-500 transition-colors',
            'focus:outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/30',
            error && 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/30',
            className
          )}
          {...props}
        />
        {error && <span className="block text-xs text-rose-500">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
