import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export function InsightsGlowCard() {
  return (
    <Card className="relative overflow-hidden flex flex-col justify-between text-center p-6 min-h-[210px]">
      <div>
        <h3 className="text-base font-bold theme-text-primary tracking-tight">
          Decisões Inteligentes com IA
        </h3>
        <p className="text-xs theme-text-secondary mt-2 max-w-xs mx-auto leading-relaxed">
          Vá além de suposições com análises preditivas personalizadas para a sua rotina de gastos e investimentos.
        </p>
      </div>

      {/* Área do Botão com Domo Iluminado Suave */}
      <div className="relative mt-6 pt-2">
        <div className="backlight-dome" />
        
        <Link
          href="/ia-insights"
          className="relative z-10 inline-flex items-center gap-2 px-6 py-2.5 rounded-full theme-btn-primary text-xs font-semibold shadow-sm transition-all active:scale-[0.98] cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-current opacity-70" />
          <span>Explorar Insights de IA</span>
        </Link>
      </div>
    </Card>
  );
}
