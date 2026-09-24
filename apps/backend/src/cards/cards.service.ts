import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCardDto } from './dto/create-card.dto.js';
import { UpdateCardDto } from './dto/update-card.dto.js';

@Injectable()
export class CardsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateCardDto) {
    return this.prisma.card.create({
      data: {
        usuarioId: userId,
        nome: dto.nome,
        instituicaoFinanceira: dto.instituicaoFinanceira,
        ultimosDigitos: dto.ultimosDigitos,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.card.findMany({
      where: { usuarioId: userId },
      orderBy: { criadoEm: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const card = await this.prisma.card.findFirst({
      where: { id, usuarioId: userId },
    });
    if (!card) throw new NotFoundException('Cartao nao encontrado');
    return card;
  }

  async update(userId: string, id: string, dto: UpdateCardDto) {
    await this.findOne(userId, id);
    return this.prisma.card.update({
      where: { id },
      data: dto,
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    return this.prisma.card.delete({ where: { id } });
  }
}
