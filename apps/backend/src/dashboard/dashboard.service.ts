import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(userId: string, mes: number, ano: number) {
    const inicio = new Date(ano, mes - 1, 1);
    const fim = new Date(ano, mes, 0, 23, 59, 59);
    const periodoFilter = { gte: inicio, lte: fim };

    // Rendas do periodo
    const rendas = await this.prisma.income.findMany({
      where: { usuarioId: userId, dataRecebimento: periodoFilter },
    });

    const totalReceitas = rendas.reduce((acc, r) => acc + Number(r.valor), 0);
    const totalReceitasRecebidas = rendas.filter(r => r.recebido).reduce((acc, r) => acc + Number(r.valor), 0);
    const totalReceitasPendentes = totalReceitas - totalReceitasRecebidas;

    // Gastos do periodo
    const gastos = await this.prisma.expense.findMany({
      where: { usuarioId: userId, dataPagamento: periodoFilter },
      include: { cartao: true },
    });

    const totalDespesas = gastos.reduce((acc, g) => acc + Number(g.valor), 0);
    const totalDespesasPagas = gastos.filter(g => g.pago).reduce((acc, g) => acc + Number(g.valor), 0);
    const totalDespesasPendentes = totalDespesas - totalDespesasPagas;

    // Gastos por categoria
    const gastosPorCategoriaMap = new Map<string, number>();
    gastos.forEach(g => {
      const atual = gastosPorCategoriaMap.get(g.categoria) || 0;
      gastosPorCategoriaMap.set(g.categoria, atual + Number(g.valor));
    });
    const gastosPorCategoria = Array.from(gastosPorCategoriaMap.entries())
      .map(([categoria, total]) => ({ categoria, total: Math.round(total * 100) / 100 }))
      .sort((a, b) => b.total - a.total);

    // Gastos por cartao
    const gastosPorCartaoMap = new Map<string | null, { nome: string | null; total: number }>();
    gastos.forEach(g => {
      const key = g.cartaoId;
      const cartaoNome = g.cartao?.nome ?? null;
      const atual = gastosPorCartaoMap.get(key) || { nome: cartaoNome, total: 0 };
      atual.total += Number(g.valor);
      gastosPorCartaoMap.set(key, atual);
    });
    const gastosPorCartao = Array.from(gastosPorCartaoMap.values())
      .map(({ nome, total }) => ({ cartao: nome, total: Math.round(total * 100) / 100 }))
      .sort((a, b) => b.total - a.total);

    // Proximos vencimentos (gastos pendentes futuros)
    const proximosVencimentos = await this.prisma.expense.findMany({
      where: {
        usuarioId: userId,
        pago: false,
        dataPagamento: { gte: new Date() },
      },
      orderBy: { dataPagamento: 'asc' },
      take: 10,
    });

    // Evolução dos 12 meses do ano selecionado para alimentar o gráfico dinâmico
    const inicioAno = new Date(ano, 0, 1);
    const fimAno = new Date(ano, 11, 31, 23, 59, 59);
    const anoFilter = { gte: inicioAno, lte: fimAno };

    const [todasRendasAno, todosGastosAno] = await Promise.all([
      this.prisma.income.findMany({
        where: { usuarioId: userId, dataRecebimento: anoFilter },
      }),
      this.prisma.expense.findMany({
        where: { usuarioId: userId, dataPagamento: anoFilter },
      }),
    ]);

    const mesesLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    let acumulado = 0;
    const evolucaoMensal = mesesLabels.map((mesLabel, idx) => {
      const mesIdx = idx;
      const receitasMes = todasRendasAno
        .filter(r => new Date(r.dataRecebimento).getMonth() === mesIdx)
        .reduce((sum, r) => sum + Number(r.valor), 0);
      const despesasMes = todosGastosAno
        .filter(g => new Date(g.dataPagamento).getMonth() === mesIdx)
        .reduce((sum, g) => sum + Number(g.valor), 0);
      const saldoMes = Math.round((receitasMes - despesasMes) * 100) / 100;
      acumulado = Math.round((acumulado + saldoMes) * 100) / 100;

      return {
        mes: mesLabel,
        mesNumero: mesIdx + 1,
        receitas: Math.round(receitasMes * 100) / 100,
        despesas: Math.round(despesasMes * 100) / 100,
        saldo: saldoMes,
        saldoAcumulado: acumulado,
      };
    });

    // Transações Recentes reais (unindo rendas e despesas do período)
    const ultimasRendas = rendas.map(r => ({
      id: r.id,
      tipo: 'receita' as const,
      descricao: r.descricao,
      categoria: r.categoria,
      valor: Number(r.valor),
      data: r.dataRecebimento.toISOString(),
      pago: r.recebido,
      metodo: 'Pix/Depósito',
    }));

    const ultimosGastos = gastos.map(g => ({
      id: g.id,
      tipo: 'despesa' as const,
      descricao: g.totalParcelas > 1 ? `${g.descricao} (${g.parcelaAtual}/${g.totalParcelas})` : g.descricao,
      categoria: g.categoria,
      valor: Number(g.valor),
      data: g.dataPagamento.toISOString(),
      pago: g.pago,
      metodo: g.metodoPagamento,
      cartao: g.cartao?.nome,
    }));

    const transacoesRecentes = [...ultimasRendas, ...ultimosGastos]
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
      .slice(0, 10);

    return {
      resumo: {
        totalReceitas: Math.round(totalReceitas * 100) / 100,
        totalReceitasRecebidas: Math.round(totalReceitasRecebidas * 100) / 100,
        totalReceitasPendentes: Math.round(totalReceitasPendentes * 100) / 100,
        totalDespesas: Math.round(totalDespesas * 100) / 100,
        totalDespesasPagas: Math.round(totalDespesasPagas * 100) / 100,
        totalDespesasPendentes: Math.round(totalDespesasPendentes * 100) / 100,
        saldo: Math.round((totalReceitasRecebidas - totalDespesasPagas) * 100) / 100,
      },
      gastosPorCategoria,
      gastosPorCartao,
      proximosVencimentos: proximosVencimentos.map(v => ({
        id: v.id,
        descricao: v.totalParcelas > 1
          ? `${v.descricao} ${v.parcelaAtual}/${v.totalParcelas}`
          : v.descricao,
        valor: Number(v.valor),
        data: v.dataPagamento,
        categoria: v.categoria,
      })),
      evolucaoMensal,
      transacoesRecentes,
    };
  }
}
