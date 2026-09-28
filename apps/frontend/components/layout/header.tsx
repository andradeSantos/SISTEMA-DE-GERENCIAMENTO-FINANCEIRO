'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MonthNavigator } from '@/components/dashboard/month-navigator';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { apiClient } from '@/services/api-client';
import { LogOut, Menu } from 'lucide-react';
import { useMobileMenu } from '@/components/providers/mobile-menu-provider';

interface UserProfile {
  id: string;
  nome: string;
  email: string;
  criadoEm?: string;
}

export function Header() {
  const router = useRouter();
  const { openMenu } = useMobileMenu();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    apiClient<UserProfile>('/auth/me')
      .then((data) => {
        if (data && data.nome) {
          setUser(data);
          try {
            localStorage.setItem('user_profile', JSON.stringify(data));
          } catch {}
        }
      })
      .catch(() => {
        try {
          const cached = localStorage.getItem('user_profile');
          if (cached) setUser(JSON.parse(cached));
        } catch {}
      });
  }, []);

  async function handleLogout() {
    try {
      localStorage.removeItem('user_profile');
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

  const displayName = user?.nome || 'Usuário';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b theme-border transition-colors duration-200">
      {/* Linha Superior: Botão Mobile Hamburguer + Saudação */}
      <div className="flex items-center justify-between lg:justify-start gap-3">
        <div className="flex items-center gap-3">
          {/* Botão de Hambúrguer */}
          <button
            onClick={openMenu}
            className="lg:hidden p-2 rounded-2xl theme-card border theme-text-secondary hover:theme-text-primary transition-colors cursor-pointer"
            title="Abrir menu de navegação"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight theme-text-primary flex items-center gap-1.5 flex-wrap">
              <span className="theme-text-secondary font-normal">Olá,</span>
              <span className="theme-text-primary font-semibold">{displayName}</span>
            </h1>
            <p className="text-[11px] sm:text-xs theme-text-secondary mt-0.5">
              Visão geral do seu patrimônio e fluxo financeiro
            </p>
          </div>
        </div>

        {/* Em telas menores: ThemeToggle e Avatar */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <Link
            href="/perfil"
            className="w-8 h-8 rounded-full theme-btn-primary flex items-center justify-center text-xs font-bold shadow-sm"
            title="Ver meu perfil"
          >
            {initial}
          </Link>
        </div>
      </div>

      {/* Controles da Direita */}
      <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5">
        {/* Navegador em Pílula */}
        <MonthNavigator />

        {/* Seletor de Tema Noturno / Diurno (Desktop) */}
        <div className="hidden lg:block">
          <ThemeToggle />
        </div>

        {/* Avatar e Perfil (Desktop) */}
        <Link
          href="/perfil"
          className="hidden lg:flex items-center gap-2.5 pl-1.5 hover:opacity-85 transition-opacity cursor-pointer group"
          title="Ver meu perfil"
        >
          <div className="w-8 h-8 rounded-full theme-btn-primary flex items-center justify-center text-xs font-bold shadow-sm">
            {initial}
          </div>
          <div className="text-left text-xs">
            <span className="block font-semibold theme-text-primary group-hover:underline transition-colors">
              {displayName}
            </span>
            <span className="block text-[10px] theme-text-muted">Conta Ativa</span>
          </div>
        </Link>

        {/* Botão de Logout */}
        <button
          onClick={handleLogout}
          className="w-8 h-8 rounded-full theme-card border flex items-center justify-center theme-text-muted hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
          title="Sair da conta"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
}
