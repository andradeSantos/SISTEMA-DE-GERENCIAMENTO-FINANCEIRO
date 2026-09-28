'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/services/api-client';
import { PlusCircle, Trash2, CreditCard, X, Loader2, Wifi } from 'lucide-react';

interface CardItem {
  id: string;
  nome: string;
  instituicaoFinanceira: string;
  ultimosDigitos?: string | null;
  criadoEm: string;
}

const INSTITUICOES_FINANCEIRAS = [
  'Nubank',
  'Banco Inter',
  'Itaú',
  'Bradesco',
  'Santander',
  'Banco do Brasil',
  'Caixa Econômica',
  'C6 Bank',
  'BTG Pactual',
  'XP Investimentos',
  'PicPay',
  'Mercado Pago',
  'Banco Pan',
  'Neon',
  'Next',
  'Sicoob',
  'Sicredi',
  'Safra',
  'Outra Instituição',
];

export default function CartoesPage() {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [nome, setNome] = useState('');
  const [instituicaoFinanceira, setInstituicaoFinanceira] = useState(INSTITUICOES_FINANCEIRAS[0]);
  const [outraInstituicao, setOutraInstituicao] = useState('');
  const [ultimosDigitos, setUltimosDigitos] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function loadCards() {
    setLoading(true);
    apiClient<CardItem[]>('/cards')
      .then(setCards)
      .catch(() => setCards([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadCards();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const instFinal = instituicaoFinanceira === 'Outra Instituição'
      ? (outraInstituicao.trim() || 'Outra')
      : instituicaoFinanceira;

    if (!nome.trim() || !instFinal.trim()) return;

    setSubmitting(true);
    try {
      await apiClient('/cards', {
        method: 'POST',
        body: JSON.stringify({
          nome,
          instituicaoFinanceira: instFinal,
          ultimosDigitos: ultimosDigitos.trim() || undefined,
        }),
      });

      setModalOpen(false);
      setNome('');
      setInstituicaoFinanceira(INSTITUICOES_FINANCEIRAS[0]);
      setOutraInstituicao('');
      setUltimosDigitos('');
      loadCards();
    } catch (err: any) {
      alert(err.message || 'Erro ao criar cartão');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Deseja realmente excluir este cartão?')) return;
    try {
      await apiClient(`/cards/${id}`, { method: 'DELETE' });
      loadCards();
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir cartão');
    }
  }

  return (
    <div className="space-y-6">
      {/* Header da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight theme-text-primary">Meus Cartões</h2>
          <p className="text-xs theme-text-secondary mt-0.5">
            Gerencie seus cartões de crédito e débito vinculados
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setModalOpen(true)}
          className="shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Novo Cartão</span>
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 theme-text-muted">
          <Loader2 className="w-6 h-6 animate-spin theme-text-secondary mr-2" />
          <span className="text-xs">Carregando carteira de cartões...</span>
        </div>
      ) : cards.length === 0 ? (
        <Card className="p-8 sm:p-12 text-center">
          <CreditCard className="w-10 h-10 mx-auto opacity-50 mb-3" />
          <h3 className="text-sm font-semibold theme-text-primary">Nenhum cartão cadastrado</h3>
          <p className="text-xs theme-text-secondary mt-1 max-w-sm mx-auto">
            Cadastre seus cartões para acompanhar faturas e organizar seus gastos mensais com clareza.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setModalOpen(true)}
            className="mt-5"
          >
            Cadastrar Primeiro Cartão
          </Button>
        </Card>
      ) : (
        /* Galeria Neomorphic Dark / Clean Light adaptativa */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((card) => (
            <div
              key={card.id}
              className="p-6 rounded-3xl theme-card-elevated border shadow-xl transition-all relative overflow-hidden flex flex-col justify-between min-h-[190px] group hover:border-black/20 dark:hover:border-white/20"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-current opacity-5 rounded-full blur-2xl pointer-events-none" />

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider theme-text-secondary">
                    {card.instituicaoFinanceira}
                  </span>
                  <Wifi className="w-4 h-4 opacity-50 rotate-90" />
                </div>

                <h3 className="text-base font-bold theme-text-primary mt-2 tracking-tight">{card.nome}</h3>
              </div>

              {/* Chip metálico e dados */}
              <div className="mt-6">
                <div className="w-8 h-6 rounded-md bg-black/10 dark:bg-white/10 border border-black/10 dark:border-white/20 mb-3" />

                <div className="flex items-end justify-between pt-2 border-t theme-border">
                  <div className="font-mono text-xs tracking-widest theme-text-secondary">
                    •••• •••• •••• {card.ultimosDigitos || '0000'}
                  </div>

                  <button
                    onClick={() => handleDelete(card.id)}
                    className="p-1.5 theme-text-muted hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
                    title="Excluir Cartão"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Neutro */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <Card className="w-full max-w-md p-6 shadow-2xl relative overflow-hidden">
            <div className="backlight-dome" />

            <div className="flex items-center justify-between mb-5 relative z-10">
              <h3 className="text-base font-bold theme-text-primary">Novo Cartão</h3>
              <button onClick={() => setModalOpen(false)} className="theme-text-secondary hover:theme-text-primary">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 relative z-10">
              <Input
                label="Identificação do Cartão"
                placeholder="Ex: Nubank Ultravioleta, Inter Black"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />

              {/* Seleção Padronizada de Instituição Financeira */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-medium theme-text-secondary">
                  Instituição Financeira
                </label>
                <select
                  value={instituicaoFinanceira}
                  onChange={(e) => setInstituicaoFinanceira(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl theme-card border text-xs theme-text-primary focus:outline-none cursor-pointer"
                >
                  {INSTITUICOES_FINANCEIRAS.map((inst) => (
                    <option key={inst} value={inst}>
                      {inst}
                    </option>
                  ))}
                </select>
              </div>

              {instituicaoFinanceira === 'Outra Instituição' && (
                <Input
                  label="Nome da Outra Instituição"
                  placeholder="Informe o banco emissor"
                  value={outraInstituicao}
                  onChange={(e) => setOutraInstituicao(e.target.value)}
                  required
                />
              )}

              <Input
                label="Últimos 4 Dígitos (Opcional)"
                placeholder="Ex: 4892"
                maxLength={4}
                value={ultimosDigitos}
                onChange={(e) => setUltimosDigitos(e.target.value.replace(/\D/g, ''))}
              />

              <div className="flex justify-end gap-2 pt-4 border-t theme-border">
                <Button type="button" variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={submitting}>
                  {submitting ? 'Salvando...' : 'Salvar Cartão'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
