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

export type DashboardResponse = {
  resumo: DashboardResumo;
  gastosPorCategoria: GastoPorCategoria[];
  gastosPorCartao: GastoPorCartao[];
  proximosVencimentos: ProximoVencimento[];
};
