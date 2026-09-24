import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateIncomeDto } from './dto/create-income.dto.js';
import { UpdateIncomeDto } from './dto/update-income.dto.js';

@Injectable()
export class IncomesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateIncomeDto) {
    return this.prisma.income.create({
      data: {
        usuarioId: userId,
        descricao: dto.descricao,
        valor: dto.valor,
        dataRecebimento: new Date(dto.dataRecebimento),
        categoria: dto.categoria,
        recorrente: dto.recorrente ?? false,
        recebido: dto.recebido ?? true,
      },
    });
  }

  async findAll(userId: string, mes?: number, ano?: number) {
    const where: any = { usuarioId: userId };

    if (mes !== undefined && ano !== undefined) {
      const inicio = new Date(ano, mes - 1, 1);
      const fim = new Date(ano, mes, 0, 23, 59, 59);
      where.dataRecebimento = { gte: inicio, lte: fim };
    }

    return this.prisma.income.findMany({
      where,
      orderBy: { dataRecebimento: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const income = await this.prisma.income.findFirst({
      where: { id, usuarioId: userId },
    });
    if (!income) throw new NotFoundException('Renda nao encontrada');
    return income;
  }

  async update(userId: string, id: string, dto: UpdateIncomeDto) {
    await this.findOne(userId, id);
    const data: any = { ...dto };
    if (data.dataRecebimento) {
      data.dataRecebimento = new Date(data.dataRecebimento);
    }
    return this.prisma.income.update({
      where: { id },
      data,
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    return this.prisma.income.delete({ where: { id } });
  }
}
