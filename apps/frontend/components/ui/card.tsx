import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'theme-card border rounded-3xl p-5 sm:p-6 transition-all duration-200 relative overflow-hidden',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
