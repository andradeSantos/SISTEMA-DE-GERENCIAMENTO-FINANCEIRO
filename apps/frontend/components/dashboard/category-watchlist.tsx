'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { PillButton } from '@/components/ui/pill-button';
import { formatCurrency } from '@/lib/utils';
import { ShoppingBag, Utensils, Home, Car, Film, Tag } from 'lucide-react';

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

  const defaultCategories: CategoryItem[] = data.length > 0 ? data : [
    { categoria: 'Alimentação', total: 1280.50 },
    { categoria: 'Moradia', total: 2450.00 },
    { categoria: 'Transporte', total: 640.20 },
    { categoria: 'Lazer', total: 420.00 },
  ];

  return (
    <Card className="bg-[#14141b] border-white/[0.06] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-bold text-white">Watchlist</span>
          
          {/* Tabs em Pílula Idênticas à Referência */}
          <div className="inline-flex items-center gap-1 p-0.5 rounded-full bg-[#0f0f13] border border-white/[0.06]">
            <PillButton
              active={filter === 'all'}
              onClick={() => setFilter('all')}
              className="py-1 px-3 text-[11px]"
            >
              Most Viewed
            </PillButton>
            <PillButton
              active={filter === 'high'}
              onClick={() => setFilter('high')}
              className="py-1 px-3 text-[11px]"
            >
              Gain
            </PillButton>
            <PillButton
              active={filter === 'low'}
              onClick={() => setFilter('low')}
              className="py-1 px-3 text-[11px]"
            >
              Lose
            </PillButton>
          </div>
        </div>

        {/* Lista de Categorias Estilizadas */}
        <div className="space-y-3.5 mt-2">
          {defaultCategories.slice(0, 4).map((item, idx) => (
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
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Despesa Mensal</span>
                </div>
              </div>

              <div className="text-right">
                <span className="block text-xs font-semibold text-zinc-200">
                  {formatCurrency(item.total)}
                </span>
                <span className="text-[10px] text-emerald-400 font-medium">
                  +{(idx * 2.4 + 1.2).toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
