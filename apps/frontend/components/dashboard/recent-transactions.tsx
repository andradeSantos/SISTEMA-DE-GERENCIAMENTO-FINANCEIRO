'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { CheckCircle2, Circle, ArrowUpRight, ArrowDownRight, Tag } from 'lucide-react';

interface TransactionItem {
  id: string;
  descricao: string;
  valor: number;
  data: string;
  tipo: 'income' | 'expense';
  categoria: string;
  pago?: boolean;
}

export function RecentTransactions({
  items = [],
  onTogglePago,
}: {
  items?: TransactionItem[];
  onTogglePago?: (id: string) => void;
}) {
  const defaultItems: TransactionItem[] = items.length > 0 ? items : [
    { id: '1', descricao: 'Salário Mensal', valor: 8500.0, data: '2026-06-05', tipo: 'income', categoria: 'Trabalho', pago: true },
    { id: '2', descricao: 'Supermercado Mensal', valor: 1420.5, data: '2026-06-10', tipo: 'expense', categoria: 'Alimentação', pago: true },
    { id: '3', descricao: 'Fatura Nubank', valor: 2890.0, data: '2026-06-15', tipo: 'expense', categoria: 'Cartão', pago: false },
    { id: '4', descricao: 'Freelance Design', valor: 2100.0, data: '2026-06-18', tipo: 'income', categoria: 'Projetos', pago: true },
  ];

  return (
    <Card className="bg-[#14141b] border-white/[0.06] p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Transações Recentes
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">Últimas movimentações registradas</p>
        </div>

        <Link
          href="/gastos"
          className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
        >
          Ver histórico completo →
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/[0.06] text-zinc-500 uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">Descrição</th>
              <th className="py-2.5 px-3">Categoria</th>
              <th className="py-2.5 px-3">Data</th>
              <th className="py-2.5 px-3 text-right">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {defaultItems.map((item) => {
              const isIncome = item.tipo === 'income';

              return (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3">
                    <button
                      onClick={() => onTogglePago && onTogglePago(item.id)}
                      className="cursor-pointer"
                      title={item.pago ? 'Pago/Recebido' : 'Pendente'}
                    >
                      {item.pago ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Circle className="w-4 h-4 text-zinc-600 hover:text-zinc-400" />
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-3 font-semibold text-zinc-200">
                    <div className="flex items-center gap-2">
                      <div className={`p-1 rounded-lg ${isIncome ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {isIncome ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      </div>
                      <span>{item.descricao}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-zinc-400">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.04] text-[10px] text-zinc-300">
                      <Tag className="w-2.5 h-2.5 text-zinc-500" />
                      {item.categoria}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-zinc-400">
                    {new Date(item.data).toLocaleDateString('pt-BR')}
                  </td>
                  <td className={`py-3 px-3 text-right font-bold ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isIncome ? '+' : '-'}{formatCurrency(item.valor)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
