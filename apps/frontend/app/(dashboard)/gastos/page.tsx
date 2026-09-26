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
import { MetodoPagamento } from '@app-finance/shared';
import { PlusCircle, Trash2, CheckCircle2, Circle, X, Loader2, CreditCard, ArrowDownRight } from 'lucide-react';

interface Expense {
  id: string;
  descricao: string;
  valor: number;
  dataPagamento: string;
  categoria: string;
  metodoPagamento: MetodoPagamento;
  totalParcelas: number;
  parcelaAtual: number;
  pago: boolean;
  grupoParcelamentoId?: string;
  cartao?: { id: string; nome: string };
}

interface UserCard {
  id: string;
  nome: string;
}

function GastosContent() {
  const { mes, ano } = useMonthFilter();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [cards, setCards] = useState<UserCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pago' | 'pendente' | 'parcelado'>('all');

  // Form State
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState(0);
  const [dataPagamento, setDataPagamento] = useState(new Date().toISOString().split('T')[0]);
  const [categoria, setCategoria] = useState('Alimentação');
  const [metodoPagamento, setMetodoPagamento] = useState<MetodoPagamento>(MetodoPagamento.PIX);
  const [totalParcelas, setTotalParcelas] = useState(1);
  const [cartaoId, setCartaoId] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  function loadData() {
    setLoading(true);
    Promise.all([
      apiClient<Expense[]>(`/expenses?mes=${mes}&ano=${ano}`).catch(() => []),
      apiClient<UserCard[]>('/cards').catch(() => []),
    ]).then(([exp, c]) => {
      setExpenses(exp);
      setCards(c);
      setLoading(false);
    });
  }

  useEffect(() => {
    loadData();
  }, [mes, ano]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!descricao.trim() || valor <= 0) return;

    setSubmitting(true);
    try {
      await apiClient('/expenses', {
        method: 'POST',
        body: JSON.stringify({
          descricao,
          valor,
          dataPagamento,
          categoria,
          metodoPagamento,
          totalParcelas: Number(totalParcelas),
          cartaoId: cartaoId || undefined,
        }),
      });

      setModalOpen(false);
      setDescricao('');
      setValor(0);
      setTotalParcelas(1);
      setCartaoId('');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Erro ao criar despesa');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleTogglePago(id: string) {
    try {
      await apiClient(`/expenses/${id}/toggle-pago`, { method: 'PATCH' });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Erro ao alternar status');
    }
  }

  async function handleDelete(id: string, isParcelado: boolean) {
    const msg = isParcelado
      ? 'Atenção: Esta despesa é parcelada. Deseja excluir TODAS as parcelas deste grupo?'
      : 'Excluir esta despesa?';
    if (!confirm(msg)) return;

    try {
      await apiClient(`/expenses/${id}`, { method: 'DELETE' });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir');
    }
  }

  const filteredExpenses = expenses.filter((item) => {
    if (filterStatus === 'pago') return item.pago;
    if (filterStatus === 'pendente') return !item.pago;
    if (filterStatus === 'parcelado') return item.totalParcelas > 1;
    return true;
  });

  const total = expenses.reduce((acc, curr) => acc + Number(curr.valor), 0);
  const totalPago = expenses.filter((e) => e.pago).reduce((acc, curr) => acc + Number(curr.valor), 0);

  return (
    <div className="space-y-6">
      {/* Header com métricas no padrão da referência */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Gastos e Despesas</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 font-semibold border border-rose-500/20">
              -{formatCurrency(total)}
            </span>
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Total pago: {formatCurrency(totalPago)} • Controle de faturas e parcelas
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filtros em Pílula Idênticos à Referência */}
          <div className="inline-flex items-center gap-1 p-1 rounded-full bg-[#14141b] border border-white/[0.06]">
            <PillButton active={filterStatus === 'all'} onClick={() => setFilterStatus('all')} className="px-3 py-1">
              Todas
            </PillButton>
            <PillButton active={filterStatus === 'pago'} onClick={() => setFilterStatus('pago')} className="px-3 py-1">
              Pagas
            </PillButton>
            <PillButton active={filterStatus === 'pendente'} onClick={() => setFilterStatus('pendente')} className="px-3 py-1">
              Pendentes
            </PillButton>
            <PillButton active={filterStatus === 'parcelado'} onClick={() => setFilterStatus('parcelado')} className="px-3 py-1">
              Parceladas
            </PillButton>
          </div>

          <Button variant="glow" size="sm" onClick={() => setModalOpen(true)}>
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Nova Despesa</span>
          </Button>
        </div>
      </div>

      {/* Tabela Dark Estilizada */}
      <Card className="bg-[#14141b] border-white/[0.06] p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-zinc-500">
            <Loader2 className="w-5 h-5 animate-spin text-purple-400 mr-2" />
            <span className="text-xs">Carregando despesas...</span>
          </div>
        ) : filteredExpenses.length === 0 ? (
          <div className="text-center py-20 text-zinc-500 text-xs">
            Nenhuma despesa encontrada para os filtros selecionados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/[0.06] bg-white/[0.02] text-zinc-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Descrição</th>
                  <th className="py-3 px-4">Método / Cartão</th>
                  <th className="py-3 px-4">Categoria</th>
                  <th className="py-3 px-4">Data</th>
                  <th className="py-3 px-4 text-right">Valor</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {filteredExpenses.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleTogglePago(item.id)}
                        className="cursor-pointer"
                        title={item.pago ? 'Paga (Clique para alternar)' : 'Pendente (Clique para alternar)'}
                      >
                        {item.pago ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Circle className="w-4 h-4 text-zinc-600 hover:text-zinc-400" />
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-zinc-200">
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded-lg bg-rose-500/10 text-rose-400">
                          <ArrowDownRight className="w-3.5 h-3.5" />
                        </div>
                        <span>{item.descricao}</span>
                        {item.totalParcelas > 1 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20 font-bold">
                            {item.parcelaAtual}/{item.totalParcelas}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400">
                      <span className="capitalize">{item.metodoPagamento.toLowerCase().replace('_', ' ')}</span>
                      {item.cartao && (
                        <span className="block text-[11px] text-purple-400 flex items-center gap-1 mt-0.5">
                          <CreditCard className="w-3 h-3 inline" /> {item.cartao.nome}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400">{item.categoria}</td>
                    <td className="py-3.5 px-4 text-zinc-400">
                      {new Date(item.dataPagamento).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-rose-400">
                      -{formatCurrency(item.valor)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(item.id, item.totalParcelas > 1)}
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
          <Card className="w-full max-w-md p-6 bg-[#14141b] border-white/[0.1] shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="backlight-dome" />

            <div className="flex items-center justify-between mb-5 relative z-10">
              <h3 className="text-base font-bold text-white">Nova Despesa</h3>
              <button onClick={() => setModalOpen(false)} className="text-zinc-500 hover:text-zinc-300">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 relative z-10">
              <Input
                label="Descrição"
                placeholder="Ex: Supermercado, Monitor 4K"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
              />

              <CurrencyInput
                label="Valor da Parcela ou Total (R$)"
                value={valor}
                onChange={setValor}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Data do Gasto"
                  type="date"
                  value={dataPagamento}
                  onChange={(e) => setDataPagamento(e.target.value)}
                  required
                />
                <Input
                  label="Categoria"
                  placeholder="Ex: Alimentação"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  required
                />
              </div>

              {/* Método de Pagamento */}
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-medium text-zinc-400">
                  Método de Pagamento
                </label>
                <select
                  value={metodoPagamento}
                  onChange={(e) => setMetodoPagamento(e.target.value as MetodoPagamento)}
                  className="w-full rounded-2xl bg-[#0f0f13] border border-white/[0.08] px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-purple-500/80"
                >
                  <option value={MetodoPagamento.PIX}>PIX</option>
                  <option value={MetodoPagamento.CARTAO_CREDITO}>Cartão de Crédito</option>
                  <option value={MetodoPagamento.CARTAO_DEBITO}>Cartão de Débito</option>
                  <option value={MetodoPagamento.BOLETO}>Boleto</option>
                  <option value={MetodoPagamento.DINHEIRO}>Dinheiro</option>
                  <option value={MetodoPagamento.OUTRO}>Outro</option>
                </select>
              </div>

              {/* Vínculo a Cartão condicional */}
              {(metodoPagamento === MetodoPagamento.CARTAO_CREDITO ||
                metodoPagamento === MetodoPagamento.CARTAO_DEBITO) && (
                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-medium text-zinc-400">
                    Vincular Cartão
                  </label>
                  <select
                    value={cartaoId}
                    onChange={(e) => setCartaoId(e.target.value)}
                    className="w-full rounded-2xl bg-[#0f0f13] border border-white/[0.08] px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-purple-500/80"
                  >
                    <option value="">Nenhum cartão selecionado</option>
                    {cards.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nome}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Parcelamento com simulação em tempo real */}
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-medium text-zinc-400">
                  Total de Parcelas
                </label>
                <input
                  type="number"
                  min="1"
                  max="48"
                  value={totalParcelas}
                  onChange={(e) => setTotalParcelas(parseInt(e.target.value) || 1)}
                  className="w-full rounded-2xl bg-[#0f0f13] border border-white/[0.08] px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-purple-500/80"
                />
                {totalParcelas > 1 && (
                  <p className="text-[11px] text-zinc-400">
                    Serão gerados {totalParcelas} lançamentos mensais automáticos de {formatCurrency(valor)}.
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-white/[0.06]">
                <Button type="button" variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" variant="glow" size="sm" disabled={submitting}>
                  {submitting ? 'Salvando...' : 'Salvar Despesa'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

export default function GastosPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-xs text-zinc-500">Carregando gastos...</div>}>
      <GastosContent />
    </Suspense>
  );
}

