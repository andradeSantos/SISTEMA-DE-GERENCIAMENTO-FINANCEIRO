'use client';

import React, { Suspense } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-[#0a0a0c] text-zinc-100 flex items-center justify-center p-3 sm:p-6 lg:p-8">
      {/* Shell Flutuante Maciço Idêntico à Referência Visual */}
      <div className="w-full max-w-[1440px] min-h-[92vh] bg-[#0f0f13] border border-white/[0.06] rounded-[28px] sm:rounded-[36px] shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
        {/* Sidebar Lateral Esquerda */}
        <Sidebar />

        {/* Painel Central e Conteúdo */}
        <div className="flex-1 flex flex-col justify-between p-6 sm:p-8 overflow-y-auto">
          <Suspense fallback={<div className="py-20 text-center text-xs text-zinc-500">Carregando painel...</div>}>
            <div>
              <Header userName="Nadia" />
              <main className="mt-6">
                {children}
              </main>
            </div>
          </Suspense>

          <Footer />
        </div>
      </div>
    </div>
  );
}
