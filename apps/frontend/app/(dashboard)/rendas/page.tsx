'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PillButton } from '@/components/ui/pill-button';
import { Input } from '@/components/ui/input';
import { CurrencyInput } from '@/components/forms/currency-input';
import { useMonthFilter } from '@/hooks/use-month-filter';
import { apiClient } from '@/services/api-client';
import { formatCurrency } from '@/lib/utils';
import { PlusCircle, Trash2, CheckCircle2, Clock, X, Loader2, ArrowUpRight } from 'lucide-react';

interface Income {
  id: string;
  descricao: string;
  valor: number;
  dataRecebimento: string;
  categoria: string;
  recorrente: boolean;
  recebido: boolean;
}

function RendasContent() {
  const { mes, ano } = useMonthFilter();
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'recebido' | 'pendente'>('all');

  // Form State
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState(0);
  const [dataRecebimento, setDataRecebimento] = useState(new Date().toISOString().split('T')[0]);
  const [categoria, setCategoria] = useState('Salário');
  const [recorrente, setRecorrente] = useState(false);
  const [recebido, setRecebido] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  function loadIncomes() {
    setLoading(true);
    apiClient<Income[]>(`/incomes?mes=${mes}&ano=${ano}`)
      .then(setIncomes)
      .catch(() => setIncomes([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadIncomes();
  }, [mes, ano]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!descricao.trim() || valor <= 0) return;

    setSubmitting(true);
    try {
      await apiClient('/incomes', {
        method: 'POST',
        body: JSON.stringify({
          descricao,
          valor,
          dataRecebimento,
          categoria,
          recorrente,
          recebido,
        }),
      });

      setModalOpen(false);
      setDescricao('');
      setValor(0);
      loadIncomes();
    } catch (err: any) {
      alert(err.message || 'Erro ao criar renda');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir esta renda?')) return;
    try {
      await apiClient(`/incomes/${id}`, { method: 'DELETE' });
      loadIncomes();
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir');
    }
  }

  const filteredIncomes = incomes.filter((item) => {
    if (filterStatus === 'recebido') return item.recebido;
    if (filterStatus === 'pendente') return !item.recebido;
    return true;
  });

  const total = incomes.reduce((acc, curr) => acc + Number(curr.valor), 0);
  const totalRecebido = incomes.filter((i) => i.recebido).reduce((acc, curr) => acc + Number(curr.valor), 0);

  return (
    <div className="space-y-6">
      {/* Header com métricas no padrão da referência */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Rendas e Receitas</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
              +{formatCurrency(total)}
            </span>
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Total recebido: {formatCurrency(totalRecebido)} • Gestão mensal
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filtros em Pílula Idênticos à Referência */}
          <div className="inline-flex items-center gap-1 p-1 rounded-full bg-[#14141b] border border-white/[0.06]">
            <PillButton active={filterStatus === 'all'} onClick={() => setFilterStatus('all')} className="px-3 py-1">
              Todas
            </PillButton>
            <PillButton active={filterStatus === 'recebido'} onClick={() => setFilterStatus('recebido')} className="px-3 py-1">
              Recebidas
            </PillButton>
            <PillButton active={filterStatus === 'pendente'} onClick={() => setFilterStatus('pendente')} className="px-3 py-1">
              Pendentes
            </PillButton>
          </div>

          <Button variant="glow" size="sm" onClick={() => setModalOpen(true)}>
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Nova Renda</span>
          </Button>
        </div>
      </div>

      {/* Tabela Dark Estilizada */}
      <Card className="bg-[#14141b] border-white/[0.06] p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-zinc-500">
            <Loader2 className="w-5 h-5 animate-spin text-purple-400 mr-2" />
            <span className="text-xs">Carregando receitas...</span>
          </div>
        ) : filteredIncomes.length === 0 ? (
          <div className="text-center py-20 text-zinc-500 text-xs">
            Nenhuma receita encontrada para os filtros selecionados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/[0.06] bg-white/[0.02] text-zinc-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Descrição</th>
                  <th className="py-3 px-4">Categoria</th>
                  <th className="py-3 px-4">Data</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Valor</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {filteredIncomes.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-zinc-200">
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </div>
                        <span>{item.descricao}</span>
                        {item.recorrente && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            Recorrente
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400">{item.categoria}</td>
                    <td className="py-3.5 px-4 text-zinc-400">
                      {new Date(item.dataRecebimento).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3.5 px-4">
                      {item.recebido ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" /> Recebido
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                          <Clock className="w-3 h-3" /> Pendente
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-emerald-400">
                      +{formatCurrency(item.valor)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal com Backlight Glow */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <Card className="w-full max-w-md p-6 bg-[#14141b] border-white/[0.1] shadow-2xl relative overflow-hidden">
            <div className="backlight-dome" />

            <div className="flex items-center justify-between mb-5 relative z-10">
              <h3 className="text-base font-bold text-white">Nova Renda</h3>
              <button onClick={() => setModalOpen(false)} className="text-zinc-500 hover:text-zinc-300">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 relative z-10">
              <Input
                label="Descrição"
                placeholder="Ex: Salário, Rendimentos"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
              />

              <CurrencyInput
                label="Valor (R$)"
                value={valor}
                onChange={setValor}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Data de Recebimento"
                  type="date"
                  value={dataRecebimento}
                  onChange={(e) => setDataRecebimento(e.target.value)}
                  required
                />
                <Input
                  label="Categoria"
                  placeholder="Ex: Salário"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={recebido}
                    onChange={(e) => setRecebido(e.target.checked)}
                    className="rounded bg-zinc-900 border-zinc-700 text-purple-600 focus:ring-purple-500"
                  />
                  <span>Já recebido</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={recorrente}
                    onChange={(e) => setRecorrente(e.target.checked)}
                    className="rounded bg-zinc-900 border-zinc-700 text-purple-600 focus:ring-purple-500"
                  />
                  <span>Recorrente</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-white/[0.06]">
                <Button type="button" variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" variant="glow" size="sm" disabled={submitting}>
                  {submitting ? 'Salvando...' : 'Salvar Renda'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

export default function RendasPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-xs text-zinc-500">Carregando rendas...</div>}>
      <RendasContent />
    </Suspense>
  );
}

