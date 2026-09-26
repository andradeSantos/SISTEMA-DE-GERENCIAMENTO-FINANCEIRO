'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowLeft, Clock, Hammer } from 'lucide-react';

function EmDesenvolvimentoContent() {
  const searchParams = useSearchParams();
  const modulo = searchParams.get('modulo') || 'Este recurso';

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

      <Card className="relative overflow-hidden bg-[#14141b] border-white/[0.06] p-8 sm:p-12 text-center flex flex-col items-center justify-center min-h-[420px]">
        <div className="backlight-dome opacity-70" />

        <div className="relative z-10 max-w-md mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-medium">
            <Clock className="w-3.5 h-3.5 text-pink-400" />
            <span>Em Desenvolvimento • Em Breve Disponível</span>
          </div>

          <div className="w-14 h-14 rounded-3xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto shadow-glow-purple">
            <Hammer className="w-7 h-7" />
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight">
            {modulo} está em construção
          </h2>

          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Nossa equipe de engenharia está finalizando a implementação e os testes desta funcionalidade.
            Ela estará disponível nas próximas atualizações do seu Sistema Financeiro!
          </p>

          <div className="pt-4">
            <Link href="/">
              <Button variant="glow" size="md">
                Voltar ao Painel
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function EmDesenvolvimentoPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-xs text-zinc-500">Carregando...</div>}>
      <EmDesenvolvimentoContent />
    </Suspense>
  );
}
