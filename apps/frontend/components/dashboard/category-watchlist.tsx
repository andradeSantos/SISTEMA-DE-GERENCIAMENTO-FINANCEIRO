'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { PillButton } from '@/components/ui/pill-button';
import { formatCurrency } from '@/lib/utils';
import { ShoppingBag, Utensils, Home, Car, Film, Tag, PlusCircle } from 'lucide-react';

interface CategoryItem {
  categoria: string;
  total: number;
}

export function CategoryWatchlist({ data = [] }: { data?: CategoryItem[] }) {
  const [filter, setFilter] = useState<'all' | 'high' | 'low'>('all');

  const iconsMap: Record<string, React.ReactNode> = {
    'Alimentação': <Utensils className="w-3.5 h-3.5 text-orange-400" />,
    'Moradia': <Home className="w-3.5 h-3.5 text-blue-400" />,
    'Transporte': <Car className="w-3.5 h-3.5 text-emerald-400" />,
    'Lazer': <Film className="w-3.5 h-3.5 text-pink-400" />,
    'Compras': <ShoppingBag className="w-3.5 h-3.5 text-purple-400" />,
  };

  const totalGeral = data.reduce((acc, c) => acc + c.total, 0);

  const sortedCategories = [...data].sort((a, b) => {
    if (filter === 'low') return a.total - b.total;
    return b.total - a.total;
  });

  return (
    <Card className="bg-[#14141b] border-white/[0.06] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-sm font-bold text-white">Gastos por Categoria</span>
            <span className="block text-[10px] text-zinc-500">Distribuição mensal real</span>
          </div>
          
          {/* Tabs em Pílula em Português */}
          <div className="inline-flex items-center gap-1 p-0.5 rounded-full bg-[#0f0f13] border border-white/[0.06]">
            <PillButton
              active={filter === 'all'}
              onClick={() => setFilter('all')}
              className="py-1 px-3 text-[11px]"
            >
              Principal
            </PillButton>
            <PillButton
              active={filter === 'high'}
              onClick={() => setFilter('high')}
              className="py-1 px-3 text-[11px]"
            >
              Maiores
            </PillButton>
            <PillButton
              active={filter === 'low'}
              onClick={() => setFilter('low')}
              className="py-1 px-3 text-[11px]"
            >
              Menores
            </PillButton>
          </div>
        </div>

        {/* Lista de Categorias 100% Reais da API */}
        {sortedCategories.length === 0 ? (
          <div className="py-8 text-center text-zinc-500 space-y-2">
            <Tag className="w-6 h-6 mx-auto text-zinc-600" />
            <p className="text-xs">Nenhum gasto registrado neste mês.</p>
            <Link
              href="/gastos"
              className="inline-flex items-center gap-1 text-[11px] text-purple-400 hover:text-purple-300 font-medium"
            >
              <PlusCircle className="w-3 h-3" />
              <span>Registrar primeiro gasto</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3.5 mt-2">
            {sortedCategories.slice(0, 5).map((item, idx) => {
              const percentual = totalGeral > 0 ? ((item.total / totalGeral) * 100).toFixed(1) : '0';
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-2xl hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                      {iconsMap[item.categoria] || <Tag className="w-3.5 h-3.5 text-purple-400" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-zinc-100">{item.categoria}</h4>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                        {percentual}% do total
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="block text-xs font-semibold text-zinc-200">
                      {formatCurrency(item.total)}
                    </span>
                    <span className="text-[10px] text-purple-400 font-medium">
                      Participação
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}
