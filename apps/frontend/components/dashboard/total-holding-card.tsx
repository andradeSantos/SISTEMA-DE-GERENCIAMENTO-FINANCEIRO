import React from 'react';
import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export interface TotalHoldingCardProps {
  saldo: number;
  totalReceitas: number;
  totalDespesas: number;
}

export function TotalHoldingCard({ saldo, totalReceitas, totalDespesas }: TotalHoldingCardProps) {
  const isPositive = saldo >= 0;

  return (
    <Card className="flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium theme-text-secondary">Saldo Consolidado</span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full theme-card-elevated border text-[11px] theme-text-primary">
            Mês Vigente
          </span>
        </div>

        <div className="mt-5">
          <div
            className={`text-3xl sm:text-4xl font-bold tracking-tight transition-colors ${
              isPositive ? 'text-emerald-500' : 'text-rose-500'
            }`}
          >
            {formatCurrency(saldo)}
          </div>
          <p className="mt-1 text-xs theme-text-secondary">
            {isPositive
              ? 'Superávit financeiro acumulado no período'
              : 'Déficit no fluxo de caixa do período'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t theme-border">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-500">
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="block text-[10px] theme-text-secondary uppercase tracking-wider">Entradas</span>
            <span className="text-xs font-semibold theme-text-primary">{formatCurrency(totalReceitas)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-rose-500/10 text-rose-500">
            <ArrowDownRight className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="block text-[10px] theme-text-secondary uppercase tracking-wider">Saídas</span>
            <span className="text-xs font-semibold theme-text-primary">{formatCurrency(totalDespesas)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
