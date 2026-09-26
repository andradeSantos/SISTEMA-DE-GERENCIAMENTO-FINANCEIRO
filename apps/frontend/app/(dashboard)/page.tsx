'use client';

import React, { useEffect, useState, Suspense, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TotalHoldingCard } from '@/components/dashboard/total-holding-card';
import { InsightsGlowCard } from '@/components/dashboard/insights-glow-card';
import { CategoryWatchlist } from '@/components/dashboard/category-watchlist';
import { CardsPreviewWidget } from '@/components/dashboard/cards-preview-widget';
import { PerformanceChart } from '@/components/dashboard/performance-chart';
import { RecentTransactions, type RecentTransactionItem } from '@/components/dashboard/recent-transactions';
import { useMonthFilter } from '@/hooks/use-month-filter';
import { apiClient } from '@/services/api-client';
import { formatCurrency } from '@/lib/utils';
import type { DashboardResponse } from '@app-finance/shared';
import { PlusCircle, Loader2, FileDown } from 'lucide-react';

function DashboardContent() {
  const { mes, ano } = useMonthFilter();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  function handleExportPdf() {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Por favor, permita pop-ups para gerar o documento PDF.');
      return;
    }

    const mesesNomes = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    const nomeMes = mesesNomes[mes - 1] || `${mes}`;

    const categoriesHtml = categories.length > 0
      ? categories.map(c => `
          <tr>
            <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb;">${c.categoria}</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold;">${formatCurrency(c.total)}</td>
          </tr>
        `).join('')
      : '<tr><td colspan="2" style="padding: 12px; text-align: center; color: #888;">Nenhum gasto por categoria registrado.</td></tr>';

    const transacoesHtml = transacoes.length > 0
      ? transacoes.map(t => `
          <tr>
            <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb;">${t.descricao}</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb;">${t.categoria}</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb;">${new Date(t.data).toLocaleDateString('pt-BR')}</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${t.pago ? 'Sim' : 'Pendente'}</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold; color: ${t.tipo === 'receita' ? '#059669' : '#e11d48'};">
              ${t.tipo === 'receita' ? '+' : '-'}${formatCurrency(t.valor)}
            </td>
          </tr>
        `).join('')
      : '<tr><td colspan="5" style="padding: 12px; text-align: center; color: #888;">Nenhuma transação registrada neste período.</td></tr>';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Relatório Financeiro - ${nomeMes} de ${ano}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 30px; color: #1f2937; background: #fff; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #8b5cf6; padding-bottom: 20px; margin-bottom: 25px; }
            .header h1 { margin: 0; font-size: 22px; color: #111827; }
            .header p { margin: 4px 0 0; font-size: 13px; color: #6b7280; }
            .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; background: #f3e8ff; color: #7e22ce; font-size: 12px; font-weight: bold; }
            .cards-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 30px; }
            .metric-card { padding: 16px; border-radius: 12px; background: #f9fafb; border: 1px solid #e5e7eb; }
            .metric-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; margin-bottom: 6px; }
            .metric-value { font-size: 20px; font-weight: bold; }
            .text-emerald { color: #059669; }
            .text-rose { color: #e11d48; }
            .section-title { font-size: 15px; font-weight: bold; color: #111827; margin: 25px 0 10px; border-left: 3px solid #8b5cf6; padding-left: 8px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 20px; }
            th { background: #f3f4f6; color: #4b5563; font-weight: 600; text-align: left; padding: 8px 12px; border-bottom: 1px solid #d1d5db; font-size: 11px; text-transform: uppercase; }
            .footer { margin-top: 40px; padding-top: 15px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #9ca3af; text-align: center; }
            @media print {
              body { padding: 0; }
              @page { margin: 15mm; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>App Finance — Resumo de Fluxo Financeiro</h1>
              <p>Demonstrativo consolidado de receitas, despesas e saldo patrimonial</p>
            </div>
            <div style="text-align: right;">
              <span class="badge">${nomeMes} / ${ano}</span>
              <p style="font-size: 11px; color: #9ca3af; margin-top: 5px;">Emitido em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
            </div>
          </div>

          <div class="cards-grid">
            <div class="metric-card">
              <div class="metric-label">Saldo Consolidado</div>
              <div class="metric-value ${resumo.saldo >= 0 ? 'text-emerald' : 'text-rose'}">
                ${formatCurrency(resumo.saldo)}
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Total de Receitas (Entradas)</div>
              <div class="metric-value text-emerald">
                ${formatCurrency(resumo.totalReceitas)}
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Total de Despesas (Saídas)</div>
              <div class="metric-value text-rose">
                ${formatCurrency(resumo.totalDespesas)}
              </div>
            </div>
          </div>

          <div class="section-title">Distribuição de Gastos por Categoria</div>
          <table>
            <thead>
              <tr>
                <th>Categoria</th>
                <th style="text-align: right;">Total Gasto</th>
              </tr>
            </thead>
            <tbody>
              ${categoriesHtml}
            </tbody>
          </table>

          <div class="section-title">Transações e Movimentações Registradas</div>
          <table>
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Data</th>
                <th style="text-align: center;">Status</th>
                <th style="text-align: right;">Valor</th>
              </tr>
            </thead>
            <tbody>
              ${transacoesHtml}
            </tbody>
          </table>

          <div class="footer">
            Relatório gerado pelo Sistema de Gerenciamento Financeiro (App Finance).
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }

  return (
    <div className="space-y-6">
      {/* Barra Superior de Ações: Botão Exportar PDF + Botão Nova Transação */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Botão de Exportar Resumo em PDF */}
        <button
          type="button"
          onClick={handleExportPdf}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#14141b] border border-white/[0.08] hover:border-purple-500/40 hover:bg-white/[0.04] text-xs font-medium text-zinc-200 shadow-sm transition-all cursor-pointer active:scale-[0.98]"
          title="Exportar demonstrativo financeiro em PDF"
        >
          <FileDown className="w-4 h-4 text-pink-400" />
          <span>Exportar Resumo (PDF)</span>
        </button>

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
