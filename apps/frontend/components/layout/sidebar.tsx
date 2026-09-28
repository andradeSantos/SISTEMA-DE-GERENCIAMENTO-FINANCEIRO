'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  User,
  Settings, 
  Layers,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMobileMenu } from '@/components/providers/mobile-menu-provider';

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, closeMenu } = useMobileMenu();

  const mainNavItems = [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'Rendas', href: '/rendas', icon: TrendingUp },
    { label: 'Gastos', href: '/gastos', icon: TrendingDown },
    { label: 'Cartões', href: '/cartoes', icon: CreditCard },
    { label: 'Perfil', href: '/perfil', icon: User },
  ];

  const bottomNavItems = [
    { label: 'Configurações', href: '/perfil', icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full p-6 select-none">
      <div className="space-y-8">
        {/* Topo: Logo + Botão Fechar no Mobile */}
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            onClick={closeMenu}
            className="flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-2xl theme-card border flex items-center justify-center transition-all group-hover:scale-105 shadow-sm">
              <Layers className="w-5 h-5 text-current" />
            </div>
            <span className="font-bold text-base tracking-tight theme-text-primary">
              App Finance
            </span>
          </Link>

          {/* Botão de Fechar no Drawer Móvel */}
          <button
            onClick={closeMenu}
            className="lg:hidden p-1.5 rounded-xl theme-text-secondary hover:theme-text-primary transition-colors cursor-pointer"
            title="Fechar menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Itens Principais com Pílula Ativa Dinâmica */}
        <nav className="space-y-1.5">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={cn(
                  'flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-medium transition-all relative',
                  isActive
                    ? 'theme-card-elevated border shadow-sm font-semibold theme-text-primary ring-1 ring-black/5 dark:ring-white/10'
                    : 'theme-text-secondary hover:theme-text-primary hover:bg-black/[0.03] dark:hover:bg-white/[0.04]'
                )}
              >
                <Icon className={cn('w-4 h-4', isActive ? 'text-current' : 'opacity-70')} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Itens Inferiores */}
      <div className="pt-6 border-t theme-border space-y-1.5">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className={cn(
                'flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs font-medium transition-all',
                isActive
                  ? 'theme-card-elevated border theme-text-primary'
                  : 'theme-text-muted hover:theme-text-secondary hover:bg-black/[0.02] dark:hover:bg-white/[0.03]'
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Sidebar Fixa em Desktop (>= lg) */}
      <aside className="hidden lg:flex w-64 flex-col theme-shell border-r shrink-0 transition-colors duration-200">
        {sidebarContent}
      </aside>

      {/* 2. Drawer Móvel (< lg) com Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop Blur escuro */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in"
            onClick={closeMenu}
          />
          {/* Gaveta lateral deslizante */}
          <aside className="relative z-10 w-72 max-w-[85vw] h-full theme-shell border-r shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
