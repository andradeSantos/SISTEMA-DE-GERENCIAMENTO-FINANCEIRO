'use client';

import React from 'react';
import { PillButton } from '@/components/ui/pill-button';
import { useMonthFilter } from '@/hooks/use-month-filter';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

export function MonthNavigator() {
  const { periodoFormatado, proximoMes, mesAnterior } = useMonthFilter();

  return (
    <div className="inline-flex items-center gap-1.5 p-1 rounded-full bg-[#14141b] border border-white/[0.08] shadow-inner">
      <PillButton
        onClick={mesAnterior}
        aria-label="Mês anterior"
        className="px-2 py-1 text-zinc-400 hover:text-white"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </PillButton>

      <div className="flex items-center gap-1.5 px-2.5 text-xs font-medium text-zinc-200">
        <Calendar className="w-3.5 h-3.5 text-purple-400" />
        <span className="capitalize">{periodoFormatado}</span>
      </div>

      <PillButton
        onClick={proximoMes}
        aria-label="Próximo mês"
        className="px-2 py-1 text-zinc-400 hover:text-white"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </PillButton>
    </div>
  );
}
