'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowLeft, Brain, Cpu, Zap } from 'lucide-react';

export default function IaInsightsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Dashboard</span>
          </Button>
        </Link>
      </div>

      <Card className="relative overflow-hidden bg-[#121216] dark:bg-[#121216] theme-titanium:bg-[#121824] theme-light:bg-white border-white/[0.06] theme-light:border-zinc-200 p-6 sm:p-12 text-center flex flex-col items-center justify-center min-h-[460px]">
        {/* Domo Iluminado Neutro de Fundo */}
        <div className="backlight-dome opacity-60" />

        <div className="relative z-10 max-w-lg mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.1] text-zinc-300 theme-light:bg-zinc-100 theme-light:text-zinc-800 theme-light:border-zinc-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-zinc-400 theme-light:text-zinc-600" />
            <span>Recurso em Desenvolvimento • Em Breve</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white theme-light:text-zinc-950 tracking-tight">
            Decisões Inteligentes com Inteligência Artificial
          </h2>

          <p className="text-sm text-zinc-400 theme-light:text-zinc-600 leading-relaxed">
            Estamos construindo um motor de análise preditiva financeira que processará o seu padrão
            de consumo, sugerindo metas automatizadas de economia, alertas de faturas e simulações de
            investimentos sob medida.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-left">
            <div className="p-3.5 rounded-2xl bg-white/[0.03] theme-light:bg-zinc-50 border border-white/[0.05] theme-light:border-zinc-200">
              <Brain className="w-4 h-4 text-zinc-300 theme-light:text-zinc-700 mb-2" />
              <h4 className="text-xs font-semibold text-white theme-light:text-zinc-900">Análise Preditiva</h4>
              <p className="text-[11px] text-zinc-400 theme-light:text-zinc-500 mt-1">Previsão do saldo de fechamento do mês.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] theme-light:bg-zinc-50 border border-white/[0.05] theme-light:border-zinc-200">
              <Cpu className="w-4 h-4 text-zinc-300 theme-light:text-zinc-700 mb-2" />
              <h4 className="text-xs font-semibold text-white theme-light:text-zinc-900">Cortes Inteligentes</h4>
              <p className="text-[11px] text-zinc-400 theme-light:text-zinc-500 mt-1">Identificação de assinaturas ociosas.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] theme-light:bg-zinc-50 border border-white/[0.05] theme-light:border-zinc-200">
              <Zap className="w-4 h-4 text-zinc-300 theme-light:text-zinc-700 mb-2" />
              <h4 className="text-xs font-semibold text-white theme-light:text-zinc-900">Metas Automáticas</h4>
              <p className="text-[11px] text-zinc-400 theme-light:text-zinc-500 mt-1">Rebalanceamento diário para atingir metas.</p>
            </div>
          </div>

          <div className="pt-4">
            <Link href="/">
              <Button variant="primary" size="lg">
                Voltar ao Painel Principal
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
