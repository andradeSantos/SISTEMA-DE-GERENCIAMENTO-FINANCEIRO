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
    <Card className="flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-sm font-bold theme-text-primary">Meus Cartões</span>
            <span className="block text-[10px] theme-text-secondary">
              {cards.length} {cards.length === 1 ? 'cartão ativo' : 'cartões ativos'}
            </span>
          </div>
          
          <Link
            href="/cartoes"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full theme-card-elevated border text-xs theme-text-primary font-medium transition-colors"
          >
            <span>Ver todos</span>
            <ArrowUpRight className="w-3.5 h-3.5 theme-text-secondary" />
          </Link>
        </div>

        {cards.length === 0 ? (
          <div className="py-8 text-center theme-text-muted space-y-2">
            <CreditCard className="w-6 h-6 mx-auto opacity-50" />
            <p className="text-xs">Nenhum cartão cadastrado ainda.</p>
            <Link
              href="/cartoes"
              className="inline-flex items-center gap-1 text-[11px] theme-text-primary underline font-medium"
            >
              <PlusCircle className="w-3 h-3" />
              <span>Cadastrar meu primeiro cartão</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {cards.slice(0, 4).map((c) => (
              <div
                key={c.id}
                className="p-3.5 rounded-2xl theme-card-elevated border hover:border-black/20 dark:hover:border-white/20 transition-all flex flex-col justify-between min-h-[92px]"
              >
                <div>
                  <span className="block text-[11px] font-semibold theme-text-primary truncate">
                    {c.nome}
                  </span>
                  <span className="block text-[10px] theme-text-secondary truncate">
                    {c.instituicaoFinanceira}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t theme-border">
                  <span className="text-[10px] font-mono theme-text-muted">
                    •••• {c.ultimosDigitos || '••••'}
                  </span>
                  <CreditCard className="w-3.5 h-3.5 theme-text-secondary" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
