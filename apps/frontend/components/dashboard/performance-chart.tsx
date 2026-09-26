'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { PillButton } from '@/components/ui/pill-button';
import { formatCurrency } from '@/lib/utils';

export function PerformanceChart({ saldo = 12304.11 }: { saldo?: number }) {
  const [range, setRange] = useState<'1D' | '1W' | '1M' | '6M' | '1Y'>('6M');

  const ranges: ('1D' | '1W' | '1M' | '6M' | '1Y')[] = ['1D', '1W', '1M', '6M', '1Y'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <Card className="bg-[#14141b] border-white/[0.06] p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Portfolio Performance
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Evolução de patrimônio e saldo consolidado ao longo do ano
          </p>
        </div>

        {/* Filtros de Escala Temporal em Pílulas Idênticos à Referência */}
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
        {/* Tooltip com Ponto Focal Iluminado (Idêntico à Referência no mês Jun) */}
        <div className="absolute left-[48%] top-4 -translate-x-1/2 flex flex-col items-center pointer-events-none z-10">
          <div className="px-3 py-1.5 rounded-xl bg-[#1c1c27] border border-white/[0.1] shadow-2xl text-center">
            <span className="block text-[9px] text-zinc-400 font-medium">1st Jun 2026</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs font-bold text-white">{formatCurrency(saldo)}</span>
              <span className="text-[10px] font-semibold text-emerald-400 px-1 py-0.2 rounded bg-emerald-500/10">
                +35%
              </span>
            </div>
          </div>
          {/* Ponto focal com anel de glow neon */}
          <div className="w-3.5 h-3.5 rounded-full bg-pink-500 border-2 border-white shadow-[0_0_15px_#ec4899] mt-3 animate-pulse" />
          <div className="w-[1px] h-24 border-l border-dashed border-pink-500/40" />
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
          <path
            d="M 0,60 Q 150,50 250,75 T 450,45 T 650,90 T 900,100 L 900,180 L 0,180 Z"
            fill="url(#chartFill)"
          />

          {/* Linha principal com brilho */}
          <path
            d="M 0,60 Q 150,50 250,75 T 450,45 T 650,90 T 900,100"
            fill="none"
            stroke="url(#chartGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>

        {/* Eixo Horizontal com os Meses */}
        <div className="flex justify-between items-center text-[10px] text-zinc-500 pt-3 border-t border-white/[0.04]">
          {months.map((m) => (
            <span key={m} className={m === 'Jun' ? 'text-zinc-200 font-bold' : ''}>
              {m}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}
