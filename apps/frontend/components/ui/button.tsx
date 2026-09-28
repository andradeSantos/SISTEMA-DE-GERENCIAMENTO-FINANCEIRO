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
    // Botão primário de alto contraste (branco no dark, preto no light)
    primary: 'theme-btn-primary rounded-2xl active:scale-[0.98] font-semibold shadow-sm',
    glow: 'theme-btn-primary rounded-2xl active:scale-[0.98] font-semibold shadow-sm ring-1 ring-black/10 dark:ring-white/20',
    secondary: 'theme-card border hover:theme-text-primary rounded-2xl active:scale-[0.98]',
    ghost: 'bg-transparent theme-text-secondary hover:theme-text-primary hover:bg-black/[0.04] dark:hover:bg-white/[0.05] rounded-2xl',
    pill: 'theme-card border rounded-full text-xs font-semibold',
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
