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
    'Alimentação': <Utensils className="w-3.5 h-3.5 theme-text-secondary" />,
    'Moradia': <Home className="w-3.5 h-3.5 theme-text-secondary" />,
    'Transporte': <Car className="w-3.5 h-3.5 theme-text-secondary" />,
    'Lazer': <Film className="w-3.5 h-3.5 theme-text-secondary" />,
    'Compras': <ShoppingBag className="w-3.5 h-3.5 theme-text-secondary" />,
  };

  const totalGeral = data.reduce((acc, c) => acc + c.total, 0);

  const sortedCategories = [...data].sort((a, b) => {
    if (filter === 'low') return a.total - b.total;
    return b.total - a.total;
  });

  return (
    <Card className="flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4">
          <div>
            <span className="text-sm font-bold theme-text-primary">Gastos por Categoria</span>
            <span className="block text-[10px] theme-text-secondary">Distribuição mensal consolidada</span>
          </div>
          
          {/* Tabs em Pílula */}
          <div className="inline-flex items-center gap-1 p-0.5 rounded-full theme-card-elevated border self-start sm:self-auto">
            <PillButton
              active={filter === 'all'}
              onClick={() => setFilter('all')}
              className="py-1 px-2.5 sm:px-3 text-[11px]"
            >
              Principal
            </PillButton>
            <PillButton
              active={filter === 'high'}
              onClick={() => setFilter('high')}
              className="py-1 px-2.5 sm:px-3 text-[11px]"
            >
              Maiores
            </PillButton>
            <PillButton
              active={filter === 'low'}
              onClick={() => setFilter('low')}
              className="py-1 px-2.5 sm:px-3 text-[11px]"
            >
              Menores
            </PillButton>
          </div>
        </div>

        {/* Lista de Categorias */}
        {sortedCategories.length === 0 ? (
          <div className="py-8 text-center theme-text-muted space-y-2">
            <Tag className="w-6 h-6 mx-auto opacity-50" />
            <p className="text-xs">Nenhum gasto registrado neste mês.</p>
            <Link
              href="/gastos"
              className="inline-flex items-center gap-1 text-[11px] theme-text-primary underline font-medium"
            >
              <PlusCircle className="w-3 h-3" />
              <span>Registrar primeiro gasto</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3 mt-2">
            {sortedCategories.slice(0, 5).map((item, idx) => {
              const percentual = totalGeral > 0 ? ((item.total / totalGeral) * 100).toFixed(1) : '0';
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-2xl hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl theme-card-elevated border flex items-center justify-center">
                      {iconsMap[item.categoria] || <Tag className="w-3.5 h-3.5 theme-text-secondary" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold theme-text-primary">{item.categoria}</h4>
                      <span className="text-[10px] theme-text-muted uppercase tracking-wider">
                        {percentual}% do total
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="block text-xs font-semibold theme-text-primary">
                      {formatCurrency(item.total)}
                    </span>
                    <span className="text-[10px] theme-text-secondary font-medium">
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
