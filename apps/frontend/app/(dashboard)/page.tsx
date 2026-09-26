'use client';

import React, { useEffect, useState, Suspense, useCallback } from 'react';
import Link from 'next/link';
import { PillButton } from '@/components/ui/pill-button';
import { Button } from '@/components/ui/button';
import { TotalHoldingCard } from '@/components/dashboard/total-holding-card';
import { InsightsGlowCard } from '@/components/dashboard/insights-glow-card';
import { CategoryWatchlist } from '@/components/dashboard/category-watchlist';
import { CardsPreviewWidget } from '@/components/dashboard/cards-preview-widget';
import { PerformanceChart } from '@/components/dashboard/performance-chart';
import { RecentTransactions, type RecentTransactionItem } from '@/components/dashboard/recent-transactions';
import { useMonthFilter } from '@/hooks/use-month-filter';
import { apiClient } from '@/services/api-client';
import type { DashboardResponse } from '@app-finance/shared';
import { PlusCircle, Loader2 } from 'lucide-react';

function DashboardContent() {
  const { mes, ano } = useMonthFilter();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'wallet' | 'tools'>('overview');

  const loadDashboardData = useCallback(() => {
    setLoading(true);
    Promise.all([
      apiClient<DashboardResponse>(`/dashboard?mes=${mes}&ano=${ano}`).catch(() => null),
      apiClient<any[]>('/cards').catch(() => []),
    ]).then(([dashData, cardsData]) => {
      if (dashData) setData(dashData);
      if (cardsData) setCards(cardsData);
      setLoading(false);
    });
  }, [mes, ano]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  async function handleTogglePago(id: string, tipo: 'receita' | 'despesa') {
    try {
      const endpoint = tipo === 'receita' ? `/incomes/${id}/toggle-recebido` : `/expenses/${id}/toggle-pago`;
      await apiClient(endpoint, { method: 'PATCH' });
      loadDashboardData();
    } catch (err) {
      console.error('Erro ao alternar status da transação', err);
    }
  }

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
  const transacoes = (data?.transacoesRecentes || []) as RecentTransactionItem[];
  const evolucao = data?.evolucaoMensal || [];

  return (
    <div className="space-y-6">
      {/* Barra de Filtros em Pílula em Português */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="inline-flex items-center gap-1.5 p-1 rounded-full bg-[#14141b] border border-white/[0.06]">
          <PillButton
            active={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
            className="px-4 py-1.5"
          >
            Visão Geral
          </PillButton>
          <PillButton
            active={activeTab === 'wallet'}
            onClick={() => setActiveTab('wallet')}
            className="px-4 py-1.5"
          >
            Carteira
          </PillButton>
          <PillButton
            active={activeTab === 'tools'}
            onClick={() => setActiveTab('tools')}
            className="px-4 py-1.5"
          >
            Ferramentas
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
          <span className="text-xs">Carregando métricas financeiras reais...</span>
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

            {/* Coluna 2: Watchlist de Categorias Reais */}
            <div className="flex flex-col">
              <CategoryWatchlist data={categories} />
            </div>

            {/* Coluna 3: Meus Cartões Reais */}
            <div className="flex flex-col">
              <CardsPreviewWidget cards={cards} />
            </div>
          </div>

          {/* Seção Intermediária: Gráfico de Evolução com Curva SVG Baseada nas Transações Reais */}
          <PerformanceChart
            saldo={resumo.saldo}
            evolucaoMensal={evolucao}
            mesSelecionado={mes}
            anoSelecionado={ano}
          />

          {/* Seção Inferior: Transações Recentes Reais com Toggle Instantâneo */}
          <RecentTransactions items={transacoes} onTogglePago={handleTogglePago} />
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
