import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateExpenseDto } from './dto/create-expense.dto.js';
import { UpdateExpenseDto } from './dto/update-expense.dto.js';
import { randomUUID } from 'crypto';

@Injectable()
export class ExpensesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateExpenseDto) {
    const totalParcelas = dto.totalParcelas ?? 1;

    // Gasto avulso (sem parcelamento)
    if (totalParcelas <= 1) {
      return this.prisma.expense.create({
        data: {
          usuarioId: userId,
          descricao: dto.descricao,
          valor: dto.valor,
          dataPagamento: new Date(dto.dataPagamento),
          categoria: dto.categoria,
          metodoPagamento: dto.metodoPagamento as any,
          recorrente: dto.recorrente ?? false,
          cartaoId: dto.cartaoId ?? null,
        },
      });
    }

    // Gasto parcelado: gera N registros com mesmo grupoParcelamentoId
    const grupoId = randomUUID();
    const dataInicial = new Date(dto.dataPagamento);
    const parcelas = [];

    for (let i = 0; i < totalParcelas; i++) {
      const dataParcela = new Date(dataInicial);
      dataParcela.setMonth(dataParcela.getMonth() + i);

      parcelas.push({
        usuarioId: userId,
        descricao: dto.descricao,
        valor: dto.valor,
        dataPagamento: dataParcela,
        categoria: dto.categoria,
        metodoPagamento: dto.metodoPagamento as any,
        totalParcelas,
        parcelaAtual: i + 1,
        recorrente: false,
        pago: false,
        cartaoId: dto.cartaoId ?? null,
        grupoParcelamentoId: grupoId,
      });
    }

    await this.prisma.expense.createMany({ data: parcelas });

    return this.prisma.expense.findMany({
      where: { grupoParcelamentoId: grupoId },
      orderBy: { parcelaAtual: 'asc' },
    });
  }

  async findAll(
    userId: string,
    filters?: {
      mes?: number;
      ano?: number;
      categoria?: string;
      metodoPagamento?: string;
      pago?: boolean;
      cartaoId?: string;
    },
  ) {
    const where: any = { usuarioId: userId };

    if (filters?.mes !== undefined && filters?.ano !== undefined) {
      const inicio = new Date(filters.ano, filters.mes - 1, 1);
      const fim = new Date(filters.ano, filters.mes, 0, 23, 59, 59);
      where.dataPagamento = { gte: inicio, lte: fim };
    }

    if (filters?.categoria) where.categoria = filters.categoria;
    if (filters?.metodoPagamento) where.metodoPagamento = filters.metodoPagamento;
    if (filters?.pago !== undefined) where.pago = filters.pago;
    if (filters?.cartaoId) where.cartaoId = filters.cartaoId;

    return this.prisma.expense.findMany({
      where,
      include: { cartao: true },
      orderBy: { dataPagamento: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const expense = await this.prisma.expense.findFirst({
      where: { id, usuarioId: userId },
      include: { cartao: true },
    });
    if (!expense) throw new NotFoundException('Gasto nao encontrado');
    return expense;
  }

  async update(userId: string, id: string, dto: UpdateExpenseDto) {
    await this.findOne(userId, id);
    const data: any = { ...dto };
    if (data.dataPagamento) {
      data.dataPagamento = new Date(data.dataPagamento);
    }
    return this.prisma.expense.update({
      where: { id },
      data,
    });
  }

  async remove(userId: string, id: string) {
    const expense = await this.findOne(userId, id);

    // Se faz parte de um parcelamento, deleta TODAS as parcelas do grupo
    if (expense.grupoParcelamentoId) {
      await this.prisma.expense.deleteMany({
        where: {
          grupoParcelamentoId: expense.grupoParcelamentoId,
          usuarioId: userId,
        },
      });
      return { message: `Todas as parcelas do grupo ${expense.grupoParcelamentoId} foram deletadas` };
    }

    return this.prisma.expense.delete({ where: { id } });
  }

  async togglePago(userId: string, id: string) {
    const expense = await this.findOne(userId, id);
    return this.prisma.expense.update({
      where: { id },
      data: { pago: !expense.pago },
    });
  }
}
