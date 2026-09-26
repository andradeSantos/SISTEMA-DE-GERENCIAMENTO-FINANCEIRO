'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/services/api-client';
import { User, Mail, Lock, ShieldCheck, CreditCard, TrendingUp, TrendingDown, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface ProfileData {
  id: string;
  nome: string;
  email: string;
  criadoEm: string;
  _count?: {
    cartoes: number;
    rendas: number;
    gastos: number;
  };
}

export default function PerfilPage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);
    try {
      const data = await apiClient<ProfileData>('/auth/me');
      setProfile(data);
      setNome(data.nome);
    } catch {
      setErrorMsg('Não foi possível carregar as informações do perfil.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    if (senha && senha.length < 6) {
      setErrorMsg('A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (senha && senha !== confirmSenha) {
      setErrorMsg('A confirmação da nova senha não confere.');
      return;
    }

    setSubmitting(true);
    try {
      const payload: { nome: string; senha?: string } = { nome };
      if (senha) payload.senha = senha;

      const updated = await apiClient<ProfileData>('/auth/profile', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });

      setProfile((prev) => (prev ? { ...prev, ...updated } : updated));
      try {
        localStorage.setItem('user_profile', JSON.stringify(updated));
      } catch {}

      setSuccessMsg('Perfil atualizado com sucesso!');
      setSenha('');
      setConfirmSenha('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao atualizar o perfil. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-zinc-500">
        <Loader2 className="w-6 h-6 animate-spin text-purple-400 mr-2" />
        <span className="text-xs">Carregando dados do usuário...</span>
      </div>
    );
  }

  const initial = (nome || profile?.nome || 'U').charAt(0).toUpperCase();
  const dataFormatada = profile?.criadoEm
    ? new Date(profile.criadoEm).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : 'Data não informada';

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white">Meu Perfil</h2>
        <p className="text-xs text-zinc-500 mt-0.5">
          Gerencie seus dados cadastrais, segurança da conta e preferências
        </p>
      </div>

      {/* Card de Identificação do Usuário */}
      <Card className="bg-[#14141b] border-white/[0.06] p-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-pink-500 flex items-center justify-center text-2xl font-bold text-white shadow-glow-neon flex-shrink-0">
              {initial}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{profile?.nome}</h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
                  <ShieldCheck className="w-3 h-3" />
                  Conta Verificada
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5 flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-zinc-500" />
                <span>{profile?.email}</span>
              </p>
              <p className="text-[11px] text-zinc-500 mt-1">Membro desde {dataFormatada}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Grid de Estatísticas do Usuário */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-[#14141b] border-white/[0.06] p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] text-zinc-500 uppercase tracking-wider">Cartões</span>
            <span className="text-lg font-bold text-white">
              {profile?._count?.cartoes ?? 0} ativos
            </span>
          </div>
        </Card>

        <Card className="bg-[#14141b] border-white/[0.06] p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] text-zinc-500 uppercase tracking-wider">Receitas</span>
            <span className="text-lg font-bold text-white">
              {profile?._count?.rendas ?? 0} registradas
            </span>
          </div>
        </Card>

        <Card className="bg-[#14141b] border-white/[0.06] p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] text-zinc-500 uppercase tracking-wider">Despesas</span>
            <span className="text-lg font-bold text-white">
              {profile?._count?.gastos ?? 0} registradas
            </span>
          </div>
        </Card>
      </div>

      {/* Formulário de Edição */}
      <Card className="bg-[#14141b] border-white/[0.06] p-6">
        <h3 className="text-sm font-bold text-white mb-4">Atualizar Informações</h3>

        {successMsg && (
          <div className="p-3 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-400">Nome Completo</label>
              <Input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                placeholder="Seu nome completo"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-400">E-mail (Informativo)</label>
              <Input
                type="email"
                value={profile?.email || ''}
                disabled
                className="opacity-60 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-white/[0.04]">
            <h4 className="text-xs font-semibold text-zinc-300 mb-2">Alterar Senha de Acesso (Opcional)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-400">Nova Senha</label>
                <Input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-400">Confirmar Nova Senha</label>
                <Input
                  type="password"
                  value={confirmSenha}
                  onChange={(e) => setConfirmSenha(e.target.value)}
                  placeholder="Repita a nova senha"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-white/[0.06]">
            <Button type="submit" variant="glow" size="lg" disabled={submitting}>
              {submitting ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
