'use client';

import React from 'react';
import { PillButton } from '@/components/ui/pill-button';
import { useMonthFilter } from '@/hooks/use-month-filter';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

export function MonthNavigator() {
  const { periodoFormatado, proximoMes, mesAnterior } = useMonthFilter();

  return (
    <div className="inline-flex items-center gap-1 sm:gap-1.5 p-1 rounded-full theme-card border shadow-inner">
      <PillButton
        onClick={mesAnterior}
        aria-label="Mês anterior"
        className="px-2 py-1 theme-text-secondary hover:theme-text-primary"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </PillButton>

      <div className="flex items-center gap-1.5 px-2 text-xs font-medium theme-text-primary">
        <Calendar className="w-3.5 h-3.5 theme-text-secondary" />
        <span className="capitalize text-[11px] sm:text-xs">{periodoFormatado}</span>
      </div>

      <PillButton
        onClick={proximoMes}
        aria-label="Próximo mês"
        className="px-2 py-1 theme-text-secondary hover:theme-text-primary"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </PillButton>
    </div>
  );
}
