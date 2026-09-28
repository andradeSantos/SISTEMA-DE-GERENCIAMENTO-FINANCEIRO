'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { CheckCircle2, Circle, ArrowUpRight, ArrowDownRight, Tag, PlusCircle } from 'lucide-react';

export interface RecentTransactionItem {
  id: string;
  descricao: string;
  valor: number;
  data: string;
  tipo: 'receita' | 'despesa';
  categoria: string;
  pago?: boolean;
}

export function RecentTransactions({
  items = [],
  onTogglePago,
}: {
  items?: RecentTransactionItem[];
  onTogglePago?: (id: string, tipo: 'receita' | 'despesa') => void;
}) {
  return (
    <Card className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4">
        <div>
          <h3 className="text-base font-bold theme-text-primary tracking-tight">
            Transações Recentes
          </h3>
          <p className="text-xs theme-text-secondary mt-0.5">Movimentações reais registradas no período</p>
        </div>

        <Link
          href="/gastos"
          className="text-xs font-semibold theme-text-secondary hover:theme-text-primary transition-colors self-start sm:self-auto"
        >
          Ver histórico completo →
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="py-12 text-center theme-text-muted space-y-2">
          <p className="text-xs">Nenhuma movimentação financeira encontrada neste período.</p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              href="/rendas"
              className="inline-flex items-center gap-1 text-[11px] text-emerald-500 font-medium"
            >
              <PlusCircle className="w-3 h-3" />
              <span>Adicionar Renda</span>
            </Link>
            <span className="opacity-40">•</span>
            <Link
              href="/gastos"
              className="inline-flex items-center gap-1 text-[11px] text-rose-500 font-medium"
            >
              <PlusCircle className="w-3 h-3" />
              <span>Adicionar Gasto</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs min-w-[560px]">
            <thead>
              <tr className="border-b theme-border theme-text-secondary uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Descrição</th>
                <th className="py-2.5 px-3">Categoria</th>
                <th className="py-2.5 px-3">Data</th>
                <th className="py-2.5 px-3 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y theme-border">
              {items.map((item) => {
                const isIncome = item.tipo === 'receita';

                return (
                  <tr key={item.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3">
                      <button
                        onClick={() => onTogglePago && onTogglePago(item.id, item.tipo)}
                        className="cursor-pointer"
                        title={item.pago ? 'Pago/Recebido' : 'Pendente'}
                      >
                        {item.pago ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Circle className="w-4 h-4 theme-text-muted hover:theme-text-primary" />
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-3 font-semibold theme-text-primary">
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded-lg ${isIncome ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                          {isIncome ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        </div>
                        <span className="truncate max-w-[200px] sm:max-w-xs">{item.descricao}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 theme-text-secondary">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full theme-card-elevated border text-[10px] theme-text-primary">
                        <Tag className="w-2.5 h-2.5 opacity-60" />
                        {item.categoria}
                      </span>
                    </td>
                    <td className="py-3 px-3 theme-text-secondary">
                      {new Date(item.data).toLocaleDateString('pt-BR')}
                    </td>
                    <td className={`py-3 px-3 text-right font-bold ${isIncome ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {isIncome ? '+' : '-'}{formatCurrency(item.valor)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
