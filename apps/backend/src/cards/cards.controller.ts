import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CardsService } from './cards.service.js';
import { CreateCardDto } from './dto/create-card.dto.js';
import { UpdateCardDto } from './dto/update-card.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@ApiTags('Cards')
@ApiBearerAuth('JWT-auth')
@Controller('cards')
@UseGuards(JwtAuthGuard)
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar novo cartão' })
  @ApiResponse({ status: 201, description: 'Cartão criado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  create(@CurrentUser() user: any, @Body() dto: CreateCardDto) {
    return this.cardsService.create(user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os cartões do usuário logado' })
  @ApiResponse({ status: 200, description: 'Lista de cartões retornada com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  findAll(@CurrentUser() user: any) {
    return this.cardsService.findAll(user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar cartão por ID' })
  @ApiParam({ name: 'id', description: 'UUID do cartão', type: String })
  @ApiResponse({ status: 200, description: 'Cartão encontrado.' })
  @ApiResponse({ status: 404, description: 'Cartão não encontrado.' })
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.cardsService.findOne(user.userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar informações de um cartão' })
  @ApiParam({ name: 'id', description: 'UUID do cartão', type: String })
  @ApiResponse({ status: 200, description: 'Cartão atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Cartão não encontrado.' })
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: UpdateCardDto) {
    return this.cardsService.update(user.userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um cartão' })
  @ApiParam({ name: 'id', description: 'UUID do cartão', type: String })
  @ApiResponse({ status: 200, description: 'Cartão removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Cartão não encontrado.' })
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.cardsService.remove(user.userId, id);
  }
}
