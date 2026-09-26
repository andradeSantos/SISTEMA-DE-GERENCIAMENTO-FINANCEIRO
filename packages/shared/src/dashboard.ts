export type DashboardResumo = {
  totalReceitas: number;
  totalReceitasRecebidas: number;
  totalReceitasPendentes: number;
  totalDespesas: number;
  totalDespesasPagas: number;
  totalDespesasPendentes: number;
  saldo: number;
};

export type GastoPorCategoria = {
  categoria: string;
  total: number;
};

export type GastoPorCartao = {
  cartao: string | null;
  total: number;
};

export type ProximoVencimento = {
  id: string;
  descricao: string;
  valor: number;
  data: Date;
  categoria: string;
};

export type EvolucaoMensal = {
  mes: string;
  mesNumero: number;
  receitas: number;
  despesas: number;
  saldo: number;
  saldoAcumulado: number;
};

export type TransacaoRecente = {
  id: string;
  tipo: 'receita' | 'despesa';
  descricao: string;
  categoria: string;
  valor: number;
  data: string;
  pago: boolean;
  metodo?: string;
  cartao?: string | null;
};

export type DashboardResponse = {
  resumo: DashboardResumo;
  gastosPorCategoria: GastoPorCategoria[];
  gastosPorCartao: GastoPorCartao[];
  proximosVencimentos: ProximoVencimento[];
  evolucaoMensal?: EvolucaoMensal[];
  transacoesRecentes?: TransacaoRecente[];
};
