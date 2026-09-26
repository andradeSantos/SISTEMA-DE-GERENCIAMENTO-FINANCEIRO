'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  Settings, 
  HelpCircle,
  Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();

  const mainNavItems = [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'Rendas', href: '/rendas', icon: TrendingUp },
    { label: 'Gastos', href: '/gastos', icon: TrendingDown },
    { label: 'Cartões', href: '/cartoes', icon: CreditCard },
  ];

  const bottomNavItems = [
    { label: 'Configurações', href: '/configuracoes', icon: Settings },
    { label: 'Suporte', href: '/suporte', icon: HelpCircle },
  ];

  return (
    <aside className="w-64 flex flex-col justify-between p-6 bg-[#0f0f13] border-r border-white/[0.06] select-none">
      <div className="space-y-8">
        {/* Logotipo Geométrico Idêntico à Referência */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-2xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-white transition-all group-hover:scale-105 group-hover:bg-white/[0.1]">
            <Layers className="w-5 h-5 text-purple-400" />
          </div>
          <span className="font-bold text-base tracking-tight text-white">
            App Finance
          </span>
        </Link>

        {/* Itens Principais com Pílula Ativa da Referência */}
        <nav className="space-y-1.5">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-medium transition-all relative',
                  isActive
                    ? 'bg-gradient-to-r from-purple-900/40 via-pink-900/20 to-transparent text-white border border-purple-500/30 shadow-[0_0_20px_-3px_rgba(168,85,247,0.3)]'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.03]'
                )}
              >
                <Icon className={cn('w-4 h-4', isActive ? 'text-pink-400' : 'text-zinc-400')} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Itens Inferiores Fixos (Settings / Support) */}
      <div className="pt-6 border-t border-white/[0.06] space-y-1.5">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs font-medium transition-all',
                isActive
                  ? 'text-white bg-white/[0.06]'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]'
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
