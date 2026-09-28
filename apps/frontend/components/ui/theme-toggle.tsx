'use client';

import React from 'react';
import { useTheme } from '@/components/providers/theme-provider';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all duration-200 cursor-pointer shadow-sm',
        isDark
          ? 'bg-white/[0.06] hover:bg-white/[0.12] border-white/[0.1] text-zinc-200 hover:text-white'
          : 'bg-zinc-100 hover:bg-zinc-200 border-zinc-300 text-zinc-800 hover:text-zinc-950',
        className
      )}
      title={isDark ? 'Mudar para Tema Diurno' : 'Mudar para Tema Noturno'}
    >
      {isDark ? (
        <>
          <Moon className="w-3.5 h-3.5 text-zinc-300" />
          <span className="text-[11px]">Noturno</span>
        </>
      ) : (
        <>
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-[11px]">Diurno</span>
        </>
      )}
    </button>
  );
}
