'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { MonthNavigator } from '@/components/dashboard/month-navigator';
import { Bell, Search, LogOut } from 'lucide-react';

export function Header({ userName = 'Nadia' }: { userName?: string }) {
  const router = useRouter();

  async function handleLogout() {
    try {
      await Promise.all([
        fetch('/api/auth/logout', { method: 'POST' }),
        fetch('http://localhost:4012/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => {}),
      ]);
      router.push('/sign-in');
      router.refresh();
    } catch {
      router.push('/sign-in');
    }
  }

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
      {/* Saudação Personalizada Idêntica à Bíblia Visual */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <span>Welcome,</span>
          <span className="bg-gradient-to-r from-pink-300 via-purple-300 to-white bg-clip-text text-transparent">
            {userName}
          </span>
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Here&apos;s your financial portfolio and monthly overview
        </p>
      </div>

      {/* Controles da Direita */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Navegador em Pílula */}
        <MonthNavigator />

        {/* Campo de Busca Minimalista */}
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14141b] border border-white/[0.08] text-xs text-zinc-400 focus-within:border-purple-500/50">
          <Search className="w-3.5 h-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search transactions..."
            className="bg-transparent border-none text-zinc-200 placeholder:text-zinc-600 focus:outline-none w-36"
          />
        </div>

        {/* Notificações */}
        <button
          className="w-8 h-8 rounded-full bg-[#14141b] border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-colors relative cursor-pointer"
          title="Notificações"
        >
          <Bell className="w-3.5 h-3.5" />
          <span className="w-1.5 h-1.5 rounded-full bg-pink-500 absolute top-2 right-2" />
        </button>

        {/* Avatar e Perfil */}
        <div className="flex items-center gap-2.5 pl-1.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-xs font-bold text-white shadow-glow-purple">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="hidden lg:block text-left text-xs">
            <span className="block font-semibold text-zinc-200">{userName}</span>
            <span className="block text-[10px] text-zinc-500">Premium Account</span>
          </div>
        </div>

        {/* Botão de Logout */}
        <button
          onClick={handleLogout}
          className="w-8 h-8 rounded-full bg-[#14141b] border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
          title="Sair da conta"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
}
