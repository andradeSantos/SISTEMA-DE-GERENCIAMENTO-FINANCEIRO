import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiParam, ApiResponse } from '@nestjs/swagger';
import { IncomesService } from './incomes.service.js';
import { CreateIncomeDto } from './dto/create-income.dto.js';
import { UpdateIncomeDto } from './dto/update-income.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@ApiTags('Incomes')
@ApiBearerAuth('JWT-auth')
@Controller('incomes')
@UseGuards(JwtAuthGuard)
export class IncomesController {
  constructor(private readonly incomesService: IncomesService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar nova receita / rendimento' })
  @ApiResponse({ status: 201, description: 'Receita cadastrada com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  create(@CurrentUser() user: any, @Body() dto: CreateIncomeDto) {
    return this.incomesService.create(user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar receitas do usuário com filtros opcionais' })
  @ApiQuery({ name: 'mes', required: false, type: Number, description: 'Filtrar por mês (1 a 12)' })
  @ApiQuery({ name: 'ano', required: false, type: Number, description: 'Filtrar por ano (ex: 2026)' })
  @ApiResponse({ status: 200, description: 'Lista de receitas retornada com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  findAll(
    @CurrentUser() user: any,
    @Query('mes') mes?: string,
    @Query('ano') ano?: string,
  ) {
    return this.incomesService.findAll(
      user.userId,
      mes ? parseInt(mes) : undefined,
      ano ? parseInt(ano) : undefined,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar receita por ID' })
  @ApiParam({ name: 'id', description: 'UUID da receita', type: String })
  @ApiResponse({ status: 200, description: 'Receita encontrada.' })
  @ApiResponse({ status: 404, description: 'Receita não encontrada.' })
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.incomesService.findOne(user.userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar receita' })
  @ApiParam({ name: 'id', description: 'UUID da receita', type: String })
  @ApiResponse({ status: 200, description: 'Receita atualizada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Receita não encontrada.' })
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: UpdateIncomeDto) {
    return this.incomesService.update(user.userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir receita' })
  @ApiParam({ name: 'id', description: 'UUID da receita', type: String })
  @ApiResponse({ status: 200, description: 'Receita excluída com sucesso.' })
  @ApiResponse({ status: 404, description: 'Receita não encontrada.' })
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.incomesService.remove(user.userId, id);
  }
}
