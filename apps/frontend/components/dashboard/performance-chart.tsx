'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { PillButton } from '@/components/ui/pill-button';
import { formatCurrency } from '@/lib/utils';
import { useTheme } from '@/components/providers/theme-provider';
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
  const { theme } = useTheme();
  const isLight = theme === 'light';

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

  const valores = dadosMeses.map((d) => d.saldoAcumulado);
  const minVal = Math.min(...valores);
  const maxVal = Math.max(...valores);
  const valRange = maxVal - minVal === 0 ? 1 : maxVal - minVal;

  const points = dadosMeses.map((d, i) => {
    const x = (i / 11) * 900;
    const normalized = (d.saldoAcumulado - minVal) / valRange;
    const y = maxVal === minVal ? 90 : 155 - normalized * 130;
    return { x, y, data: d, index: i };
  });

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

  const activeIndex = hoveredIdx !== null ? hoveredIdx : Math.min(Math.max(mesSelecionado - 1, 0), 11);
  const activePoint = points[activeIndex];
  const activeMonthData = dadosMeses[activeIndex];

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold theme-text-primary tracking-tight">
            Evolução do Saldo
          </h3>
          <p className="text-xs theme-text-secondary mt-0.5">
            Fluxo patrimonial baseado nas movimentações do usuário em {anoSelecionado}
          </p>
        </div>

        {/* Filtros em Pílulas */}
        <div className="inline-flex items-center gap-1 p-1 rounded-full theme-card-elevated border self-start sm:self-auto">
          {ranges.map((r) => (
            <PillButton
              key={r}
              active={range === r}
              onClick={() => setRange(r)}
              className="px-2.5 sm:px-3 py-1 text-[11px]"
            >
              {r}
            </PillButton>
          ))}
        </div>
      </div>

      <div className="relative w-full h-56 pt-4">
        {/* Tooltip Dinâmico */}
        <div
          className="absolute flex flex-col items-center pointer-events-none z-10 transition-all duration-200"
          style={{
            left: `${(activePoint.x / 900) * 100}%`,
            top: `${Math.max(activePoint.y - 85, 0)}px`,
            transform: 'translateX(-50%)',
          }}
        >
          <div className="px-3 py-1.5 rounded-xl theme-card-elevated border shadow-2xl text-center whitespace-nowrap">
            <span className="block text-[9px] theme-text-muted font-medium">
              {monthsFull[activeIndex]} de {anoSelecionado}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs font-bold theme-text-primary">
                {formatCurrency(activeMonthData.saldoAcumulado)}
              </span>
              <span
                className={`text-[9px] font-semibold px-1 py-0.5 rounded ${
                  activeMonthData.saldo >= 0
                    ? 'text-emerald-500 bg-emerald-500/10'
                    : 'text-rose-500 bg-rose-500/10'
                }`}
              >
                {activeMonthData.saldo >= 0 ? '+' : ''}
                {formatCurrency(activeMonthData.saldo)} no mês
              </span>
            </div>
          </div>
          {/* Ponto focal dinâmico */}
          <div className="w-3.5 h-3.5 rounded-full bg-zinc-950 dark:bg-white border-2 border-white dark:border-zinc-950 shadow-md mt-2" />
          <div className="w-[1px] h-20 border-l border-dashed theme-border" />
        </div>

        {/* Curva SVG Adaptativa ao Tema Noturno/Diurno */}
        <svg className="w-full h-44 overflow-visible" preserveAspectRatio="none" viewBox="0 0 900 180">
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={isLight ? '#09090b' : '#ffffff'} stopOpacity="0.9" />
              <stop offset="50%" stopColor={isLight ? '#475569' : '#cbd5e1'} stopOpacity="1" />
              <stop offset="100%" stopColor={isLight ? '#94a3b8' : '#94a3b8'} stopOpacity="0.8" />
            </linearGradient>

            <linearGradient id="chartFill" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255, 255, 255, 0.12)'} />
              <stop offset="60%" stopColor={isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255, 255, 255, 0.03)'} />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>

          {/* Área sombreada */}
          <path d={fillD} fill="url(#chartFill)" />

          {/* Linha principal */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#chartGradient)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Hover areas */}
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

        {/* Eixo Horizontal */}
        <div className="flex justify-between items-center text-[10px] theme-text-muted pt-3 border-t theme-border">
          {monthsPt.map((m, idx) => (
            <button
              key={m}
              type="button"
              onClick={() => setHoveredIdx(idx)}
              className={`transition-colors cursor-pointer ${
                idx === activeIndex
                  ? 'theme-text-primary font-bold underline underline-offset-4'
                  : 'hover:theme-text-primary'
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
