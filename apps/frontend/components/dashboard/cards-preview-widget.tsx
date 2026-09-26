import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { ArrowUpRight, CreditCard } from 'lucide-react';

interface CardItem {
  id: string;
  nome: string;
  instituicaoFinanceira: string;
  ultimosDigitos?: string | null;
}

export function CardsPreviewWidget({ cards = [] }: { cards?: CardItem[] }) {
  const defaultCards: CardItem[] = cards.length > 0 ? cards : [
    { id: '1', nome: 'Nubank Ultravioleta', instituicaoFinanceira: 'Nubank', ultimosDigitos: '4892' },
    { id: '2', nome: 'Inter Black', instituicaoFinanceira: 'Inter', ultimosDigitos: '1042' },
    { id: '3', nome: 'Itaú Personalité', instituicaoFinanceira: 'Itaú', ultimosDigitos: '7721' },
    { id: '4', nome: 'C6 Carbon', instituicaoFinanceira: 'C6 Bank', ultimosDigitos: '9934' },
  ];

  return (
    <Card className="bg-[#14141b] border-white/[0.06] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-bold text-white">Meus Cartões</span>
          
          <Link
            href="/cartoes"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-xs text-zinc-300 font-medium transition-colors"
          >
            <span>See all</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
          </Link>
        </div>

        {/* Grid 2x2 Idêntico à Referência Visual */}
        <div className="grid grid-cols-2 gap-3 mt-2">
          {defaultCards.slice(0, 4).map((c, i) => (
            <div
              key={c.id || i}
              className="p-3.5 rounded-2xl bg-[#0f0f13] border border-white/[0.05] hover:border-purple-500/30 transition-all flex flex-col justify-between min-h-[92px]"
            >
              <div>
                <span className="block text-[11px] font-semibold text-zinc-200 truncate">
                  {c.nome}
                </span>
                <span className="block text-[10px] text-zinc-500">
                  {c.instituicaoFinanceira}
                </span>
              </div>

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.03]">
                <span className="text-[10px] font-mono text-zinc-400">
                  •••• {c.ultimosDigitos || '0000'}
                </span>
                <CreditCard className="w-3.5 h-3.5 text-purple-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
