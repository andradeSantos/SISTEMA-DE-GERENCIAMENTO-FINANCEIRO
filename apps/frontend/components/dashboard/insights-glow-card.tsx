import React from 'react';
import { Card } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export function InsightsGlowCard() {
  return (
    <Card className="relative overflow-hidden bg-[#14141b] border-white/[0.06] flex flex-col justify-between text-center p-6 min-h-[210px]">
      <div>
        <h3 className="text-base font-bold text-white tracking-tight">
          Decisions Powered by Data
        </h3>
        <p className="text-xs text-zinc-400 mt-2 max-w-xs mx-auto leading-relaxed">
          Move beyond guesswork with smart financial insights tailored to your monthly spending strategy.
        </p>
      </div>

      {/* Área do Botão com Efeito de Domo Iluminado (Backlight Glow) */}
      <div className="relative mt-6 pt-2">
        <div className="backlight-dome" />
        
        <button
          type="button"
          className="relative z-10 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600/80 via-pink-600/80 to-purple-600/80 hover:brightness-110 text-white text-xs font-semibold shadow-glow-neon transition-all active:scale-[0.98] cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-pink-300" />
          <span>Explore AI Insights</span>
        </button>
      </div>
    </Card>
  );
}
