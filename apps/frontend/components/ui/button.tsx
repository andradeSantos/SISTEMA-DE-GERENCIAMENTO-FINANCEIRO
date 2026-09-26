import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'glow' | 'secondary' | 'ghost' | 'pill';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const variants = {
    primary: 'bg-zinc-100 text-zinc-950 hover:bg-white rounded-2xl active:scale-[0.98]',
    glow: 'bg-glow-primary text-white shadow-glow-neon hover:brightness-110 rounded-2xl active:scale-[0.98] font-semibold',
    secondary: 'bg-white/[0.05] text-zinc-200 hover:bg-white/[0.08] border border-white/[0.08] rounded-2xl active:scale-[0.98]',
    ghost: 'bg-transparent text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04] rounded-2xl',
    pill: 'bg-white/[0.04] text-zinc-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.06] rounded-full text-xs font-semibold',
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-4.5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
