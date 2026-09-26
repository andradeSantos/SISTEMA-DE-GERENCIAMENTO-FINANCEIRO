import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { ArrowUpRight, CreditCard, PlusCircle } from 'lucide-react';

interface CardItem {
  id: string;
  nome: string;
  instituicaoFinanceira: string;
  ultimosDigitos?: string | null;
}

export function CardsPreviewWidget({ cards = [] }: { cards?: CardItem[] }) {
  return (
    <Card className="bg-[#14141b] border-white/[0.06] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-sm font-bold text-white">Meus Cartões</span>
            <span className="block text-[10px] text-zinc-500">
              {cards.length} {cards.length === 1 ? 'cartão ativo' : 'cartões ativos'}
            </span>
          </div>
          
          <Link
            href="/cartoes"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-xs text-zinc-300 font-medium transition-colors"
          >
            <span>Ver todos</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
          </Link>
        </div>

        {cards.length === 0 ? (
          <div className="py-8 text-center text-zinc-500 space-y-2">
            <CreditCard className="w-6 h-6 mx-auto text-zinc-600" />
            <p className="text-xs">Nenhum cartão cadastrado ainda.</p>
            <Link
              href="/cartoes"
              className="inline-flex items-center gap-1 text-[11px] text-purple-400 hover:text-purple-300 font-medium"
            >
              <PlusCircle className="w-3 h-3" />
              <span>Cadastrar meu primeiro cartão</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 mt-2">
            {cards.slice(0, 4).map((c) => (
              <div
                key={c.id}
                className="p-3.5 rounded-2xl bg-[#0f0f13] border border-white/[0.05] hover:border-purple-500/30 transition-all flex flex-col justify-between min-h-[92px]"
              >
                <div>
                  <span className="block text-[11px] font-semibold text-zinc-200 truncate">
                    {c.nome}
                  </span>
                  <span className="block text-[10px] text-zinc-500 truncate">
                    {c.instituicaoFinanceira}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.03]">
                  <span className="text-[10px] font-mono text-zinc-400">
                    •••• {c.ultimosDigitos || '••••'}
                  </span>
                  <CreditCard className="w-3.5 h-3.5 text-purple-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
