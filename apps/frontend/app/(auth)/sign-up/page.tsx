'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterDto } from '@app-finance/shared';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Layers } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterDto>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterDto) {
    setServerError(null);
    try {
      const response = await fetch('http://localhost:4012/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erro ao cadastrar' }));
        throw new Error(errorData.message || 'Erro ao registrar usuário');
      }

      const result = await response.json();

      await fetch('/api/auth/set-cookie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: result.accessToken, user: result.user }),
      });

      router.push('/');
      router.refresh();
    } catch (err: any) {
      setServerError(err.message || 'Erro ao criar conta. Tente novamente.');
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#0a0a0c]">
      <Card className="w-full max-w-md p-8 bg-[#14141b] border-white/[0.08] shadow-2xl relative overflow-hidden">
        <div className="backlight-dome" style={{ top: '-40px', bottom: 'auto' }} />

        <div className="flex flex-col items-center mb-8 text-center relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-white shadow-glow-purple mb-4">
            <Layers className="w-6 h-6 text-purple-400" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">Criar Nova Conta</h1>
          <p className="text-xs text-zinc-500 mt-1">Junte-se à experiência premium do App Finance</p>
        </div>

        {serverError && (
          <div className="mb-6 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 text-center relative z-10">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 relative z-10">
          <Input
            label="Nome Completo"
            id="nome"
            type="text"
            placeholder="Ex: Nadia Rachel"
            error={errors.nome?.message}
            {...register('nome')}
          />

          <Input
            label="E-mail"
            id="email"
            type="email"
            placeholder="nadia@finance.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Senha"
            id="senha"
            type="password"
            placeholder="Mínimo de 6 caracteres"
            error={errors.senha?.message}
            {...register('senha')}
          />

          <Button
            type="submit"
            variant="glow"
            className="w-full mt-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Criando conta...' : 'Cadastrar na Plataforma'}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-zinc-500 relative z-10">
          Já possui uma conta?{' '}
          <Link href="/sign-in" className="text-purple-400 hover:text-purple-300 font-medium">
            Entrar
          </Link>
        </div>
      </Card>
    </div>
  );
}
