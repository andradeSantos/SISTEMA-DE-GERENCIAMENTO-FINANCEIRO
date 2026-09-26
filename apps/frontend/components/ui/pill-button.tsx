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
          ? 'bg-white/[0.12] text-white border border-white/[0.2] shadow-sm font-semibold'
          : 'bg-[#14141b]/80 text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05] border border-white/[0.05]',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
