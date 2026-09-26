'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { PillButton } from '@/components/ui/pill-button';
import { formatCurrency } from '@/lib/utils';
import type { EvolucaoMensal } from '@app-finance/shared';

interface PerformanceChartProps {
  saldo?: number;
  evolucaoMensal?: EvolucaoMensal[];
  mesSelecionado?: number;
  anoSelecionado?: number;
}

export function PerformanceChart({
  saldo = 0,
  evolucaoMensal = [],
  mesSelecionado = new Date().getMonth() + 1,
  anoSelecionado = new Date().getFullYear(),
}: PerformanceChartProps) {
  const [range, setRange] = useState<'1D' | '1S' | '1M' | '6M' | '1A'>('6M');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const ranges: ('1D' | '1S' | '1M' | '6M' | '1A')[] = ['1D', '1S', '1M', '6M', '1A'];
  const monthsPt = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const monthsFull = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  // Garante os 12 meses
  const dadosMeses: EvolucaoMensal[] = monthsPt.map((m, idx) => {
    const found = evolucaoMensal.find((item) => item.mesNumero === idx + 1);
    if (found) return found;
    return {
      mes: m,
      mesNumero: idx + 1,
      receitas: 0,
      despesas: 0,
      saldo: 0,
      saldoAcumulado: 0,
    };
  });

  // Determina valores mínimo e máximo para normalização Y (25px topo a 155px base)
  const valores = dadosMeses.map((d) => d.saldoAcumulado);
  const minVal = Math.min(...valores);
  const maxVal = Math.max(...valores);
  const valRange = maxVal - minVal === 0 ? 1 : maxVal - minVal;

  // Mapeia para pontos SVG (largura 900, altura 180)
  const points = dadosMeses.map((d, i) => {
    const x = (i / 11) * 900;
    // se todos forem 0, linha centralizada em 90
    const normalized = (d.saldoAcumulado - minVal) / valRange;
    // y invertido: maior valor fica no topo (y=25), menor na base (y=155)
    const y = maxVal === minVal ? 90 : 155 - normalized * 130;
    return { x, y, data: d, index: i };
  });

  // Constrói curva SVG cúbica suave passando por todos os pontos reais
  let pathD = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : points.length - 1];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    pathD += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }

  const fillD = `${pathD} L 900,180 L 0,180 Z`;

  // Ponto ativo: se hoveredIdx estiver definido usa ele, senão usa o mês selecionado na URL
  const activeIndex = hoveredIdx !== null ? hoveredIdx : Math.min(Math.max(mesSelecionado - 1, 0), 11);
  const activePoint = points[activeIndex];
  const activeMonthData = dadosMeses[activeIndex];

  return (
    <Card className="bg-[#14141b] border-white/[0.06] p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Evolução do Saldo
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Fluxo patrimonial baseado nas transações e movimentações do usuário em {anoSelecionado}
          </p>
        </div>

        {/* Filtros em Pílulas em Português */}
        <div className="inline-flex items-center gap-1 p-1 rounded-full bg-[#0f0f13] border border-white/[0.06]">
          {ranges.map((r) => (
            <PillButton
              key={r}
              active={range === r}
              onClick={() => setRange(r)}
              className="px-3 py-1 text-[11px]"
            >
              {r}
            </PillButton>
          ))}
        </div>
      </div>

      {/* Área do Gráfico com Curva SVG Fluida e Ponto Focal Iluminado */}
      <div className="relative w-full h-56 pt-4">
        {/* Tooltip Dinâmico com Valores Reais */}
        <div
          className="absolute flex flex-col items-center pointer-events-none z-10 transition-all duration-200"
          style={{
            left: `${(activePoint.x / 900) * 100}%`,
            top: `${Math.max(activePoint.y - 85, 0)}px`,
            transform: 'translateX(-50%)',
          }}
        >
          <div className="px-3 py-1.5 rounded-xl bg-[#1c1c27] border border-white/[0.12] shadow-2xl text-center whitespace-nowrap">
            <span className="block text-[9px] text-zinc-400 font-medium">
              {monthsFull[activeIndex]} de {anoSelecionado}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs font-bold text-white">
                {formatCurrency(activeMonthData.saldoAcumulado)}
              </span>
              <span
                className={`text-[9px] font-semibold px-1 py-0.5 rounded ${
                  activeMonthData.saldo >= 0
                    ? 'text-emerald-400 bg-emerald-500/10'
                    : 'text-rose-400 bg-rose-500/10'
                }`}
              >
                {activeMonthData.saldo >= 0 ? '+' : ''}
                {formatCurrency(activeMonthData.saldo)} no mês
              </span>
            </div>
          </div>
          {/* Ponto focal com anel de glow neon */}
          <div className="w-3.5 h-3.5 rounded-full bg-pink-500 border-2 border-white shadow-[0_0_15px_#ec4899] mt-2 animate-pulse" />
          <div className="w-[1px] h-20 border-l border-dashed border-pink-500/40" />
        </div>

        {/* Curva SVG Dinâmica com Gradiente Roxo/Rosa Neon */}
        <svg className="w-full h-44 overflow-visible" preserveAspectRatio="none" viewBox="0 0 900 180">
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#ec4899" stopOpacity="1" />
              <stop offset="100%" stopColor="#d946ef" stopOpacity="0.7" />
            </linearGradient>

            <linearGradient id="chartFill" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(236, 72, 153, 0.25)" />
              <stop offset="70%" stopColor="rgba(168, 85, 247, 0.05)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>

          {/* Área sombreada sob a curva */}
          <path d={fillD} fill="url(#chartFill)" />

          {/* Linha principal com brilho */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#chartGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Áreas invisíveis interativas para hover de cada mês */}
          {points.map((p, idx) => (
            <rect
              key={idx}
              x={Math.max(p.x - 35, 0)}
              y={0}
              width={70}
              height={180}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            />
          ))}
        </svg>

        {/* Eixo Horizontal com os 12 Meses em Português */}
        <div className="flex justify-between items-center text-[10px] text-zinc-500 pt-3 border-t border-white/[0.04]">
          {monthsPt.map((m, idx) => (
            <button
              key={m}
              type="button"
              onClick={() => setHoveredIdx(idx)}
              className={`transition-colors cursor-pointer ${
                idx === activeIndex ? 'text-zinc-100 font-bold underline decoration-pink-500 underline-offset-4' : 'hover:text-zinc-300'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}
