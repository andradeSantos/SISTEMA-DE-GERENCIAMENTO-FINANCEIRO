'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { PillButton } from '@/components/ui/pill-button';
import { Button } from '@/components/ui/button';
import { TotalHoldingCard } from '@/components/dashboard/total-holding-card';
import { InsightsGlowCard } from '@/components/dashboard/insights-glow-card';
import { CategoryWatchlist } from '@/components/dashboard/category-watchlist';
import { CardsPreviewWidget } from '@/components/dashboard/cards-preview-widget';
import { PerformanceChart } from '@/components/dashboard/performance-chart';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { useMonthFilter } from '@/hooks/use-month-filter';
import { apiClient } from '@/services/api-client';
import type { DashboardResponse } from '@app-finance/shared';
import { PlusCircle, Loader2, Sparkles } from 'lucide-react';

function DashboardContent() {
  const { mes, ano } = useMonthFilter();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'wallet' | 'tools'>('wallet');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      apiClient<DashboardResponse>(`/dashboard?mes=${mes}&ano=${ano}`).catch(() => null),
      apiClient<any[]>('/cards').catch(() => []),
    ]).then(([dashData, cardsData]) => {
      if (!isMounted) return;
      if (dashData) setData(dashData);
      if (cardsData) setCards(cardsData);
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [mes, ano]);

  const resumo = data?.resumo || {
    totalReceitas: 0,
    totalReceitasRecebidas: 0,
    totalReceitasPendentes: 0,
    totalDespesas: 0,
    totalDespesasPagas: 0,
    totalDespesasPendentes: 0,
    saldo: 0,
  };

  const categories = data?.gastosPorCategoria || [];

  return (
    <div className="space-y-6">
      {/* Barra de Filtros em Pílula (Idêntica à Referência: Market | Wallet | Tools) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="inline-flex items-center gap-1.5 p-1 rounded-full bg-[#14141b] border border-white/[0.06]">
          <PillButton
            active={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
            className="px-4 py-1.5"
          >
            Market
          </PillButton>
          <PillButton
            active={activeTab === 'wallet'}
            onClick={() => setActiveTab('wallet')}
            className="px-4 py-1.5"
          >
            Wallet
          </PillButton>
          <PillButton
            active={activeTab === 'tools'}
            onClick={() => setActiveTab('tools')}
            className="px-4 py-1.5"
          >
            Tools
          </PillButton>
        </div>

        {/* Botão de Ação Primária em Destaque Neon Glow */}
        <div className="flex items-center gap-3">
          <Link href="/gastos">
            <Button variant="glow" size="sm" className="shadow-glow-neon">
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Nova Transação</span>
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-zinc-500">
          <Loader2 className="w-6 h-6 animate-spin text-purple-400 mr-2" />
          <span className="text-xs">Carregando métricas financeiras...</span>
        </div>
      ) : (
        <>
          {/* Grid Superior de 3 Colunas Idêntico à Bíblia Visual */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Coluna 1: Total Holding + Card com Backlight Glow Neon */}
            <div className="space-y-5">
              <TotalHoldingCard
                saldo={resumo.saldo}
                totalReceitas={resumo.totalReceitas}
                totalDespesas={resumo.totalDespesas}
              />
              <InsightsGlowCard />
            </div>

            {/* Coluna 2: Watchlist de Categorias */}
            <div className="flex flex-col">
              <CategoryWatchlist data={categories} />
            </div>

            {/* Coluna 3: Meus Cartões (My Portfolio com See all) */}
            <div className="flex flex-col">
              <CardsPreviewWidget cards={cards} />
            </div>
          </div>

          {/* Seção Intermediária: Gráfico de Evolução com Curva Fluida Neon */}
          <PerformanceChart saldo={resumo.saldo} />

          {/* Seção Inferior: Transações Recentes com Toggle Pago */}
          <RecentTransactions />
        </>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-xs text-zinc-500">Carregando painel...</div>}>
      <DashboardContent />
    </Suspense>
  );
}

