'use client';

import React, { Suspense } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileMenuProvider } from '@/components/providers/mobile-menu-provider';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <MobileMenuProvider>
      <div className="min-h-screen w-full theme-canvas flex items-center justify-center p-0 sm:p-4 md:p-6 lg:p-8 transition-colors duration-200">
        {/* Shell Flutuante Maciço com suporte temático Dark/Light */}
        <div className="w-full max-w-[1440px] min-h-screen sm:min-h-[92vh] theme-shell border-0 sm:border rounded-none sm:rounded-[32px] shadow-2xl overflow-hidden flex flex-col lg:flex-row relative transition-colors duration-200">
          {/* Sidebar Lateral */}
          <Sidebar />

          {/* Painel Central e Conteúdo */}
          <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <Suspense fallback={<div className="py-20 text-center text-xs text-zinc-500">Carregando painel...</div>}>
              <div>
                <Header />
                <main className="mt-6">
                  {children}
                </main>
              </div>
            </Suspense>

            <Footer />
          </div>
        </div>
      </div>
    </MobileMenuProvider>
  );
}
