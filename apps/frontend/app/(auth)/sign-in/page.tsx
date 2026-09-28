'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginDto } from '@app-finance/shared';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Layers } from 'lucide-react';

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginDto) {
    setServerError(null);
    try {
      const response = await fetch('http://localhost:4012/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Credenciais inválidas' }));
        throw new Error(errorData.message || 'Erro ao autenticar');
      }

      const result = await response.json();

      await fetch('/api/auth/set-cookie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: result.accessToken, user: result.user }),
      });

      router.push(callbackUrl);
      router.refresh();
    } catch (err: any) {
      setServerError(err.message || 'Erro ao autenticar. Verifique suas credenciais.');
    }
  }

  return (
    <Card className="w-full max-w-md p-6 sm:p-8 bg-[#121216] dark:bg-[#121216] theme-titanium:bg-[#121824] theme-light:bg-white border-white/[0.08] theme-light:border-zinc-200 shadow-2xl relative overflow-hidden">
      {/* Domo de iluminação neutro no topo do card */}
      <div className="backlight-dome" style={{ top: '-40px', bottom: 'auto' }} />

      {/* <div className="flex items-center justify-between mb-4 relative z-10">
        <div />
        <ThemeToggle />
      </div> */}

      <div className="flex flex-col items-center mb-8 text-center relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-white/[0.08] border border-white/[0.12] flex items-center justify-center text-white shadow-sm mb-4">
          <Layers className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white theme-light:text-zinc-950">App Finance</h1>
        <p className="text-xs text-zinc-400 theme-light:text-zinc-500 mt-1">Sua carteira de investimentos e gestão patrimonial</p>
      </div>

      {serverError && (
        <div className="mb-6 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 text-center relative z-10">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 relative z-10">
        <Input
          label="E-mail"
          id="email"
          type="email"
          placeholder="seu@email.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Senha"
          id="senha"
          type="password"
          placeholder="••••••••"
          error={errors.senha?.message}
          {...register('senha')}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Acessando...' : 'Entrar na Plataforma'}
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-zinc-500 relative z-10">
        Não possui uma conta?{' '}
        <Link href="/sign-up" className="text-zinc-300 hover:text-white theme-light:text-zinc-800 theme-light:hover:text-zinc-950 font-medium underline">
          Cadastre-se
        </Link>
      </div>
    </Card>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#09090b] theme-titanium:bg-[#0a0d14] theme-light:bg-[#f4f4f5] transition-colors duration-200">
      <Suspense fallback={<div className="text-zinc-500 text-center text-xs">Carregando...</div>}>
        <SignInForm />
      </Suspense>
    </div>
  );
}
