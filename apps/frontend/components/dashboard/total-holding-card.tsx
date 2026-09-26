import React from 'react';
import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { ChevronDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export interface TotalHoldingCardProps {
  saldo: number;
  totalReceitas: number;
  totalDespesas: number;
}

export function TotalHoldingCard({ saldo, totalReceitas, totalDespesas }: TotalHoldingCardProps) {
  const isPositive = saldo >= 0;

  return (
    <Card className="flex flex-col justify-between bg-[#14141b] border-white/[0.06]">
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-400">Total Holding</span>
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-xs text-zinc-300">
            <span>6M</span>
            <ChevronDown className="w-3 h-3 text-zinc-500" />
          </div>
        </div>

        <div className="mt-5">
          <div
            className={`text-3xl sm:text-4xl font-bold tracking-tight transition-colors ${
              isPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {formatCurrency(saldo)}
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            {isPositive ? '+8.4% em relação ao mês anterior' : '-3.2% despesas excedentes'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-white/[0.04]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="block text-[10px] text-zinc-500 uppercase tracking-wider">Entradas</span>
            <span className="text-xs font-semibold text-zinc-200">{formatCurrency(totalReceitas)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-rose-500/10 text-rose-400">
            <ArrowDownRight className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="block text-[10px] text-zinc-500 uppercase tracking-wider">Saídas</span>
            <span className="text-xs font-semibold text-zinc-200">{formatCurrency(totalDespesas)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
