import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ExpensesService } from './expenses.service.js';
import { CreateExpenseDto, MetodoPagamento } from './dto/create-expense.dto.js';
import { UpdateExpenseDto } from './dto/update-expense.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@ApiTags('Expenses')
@ApiBearerAuth('JWT-auth')
@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova despesa (com suporte a parcelamento automático)' })
  @ApiResponse({ status: 201, description: 'Despesa criada com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  create(@CurrentUser() user: any, @Body() dto: CreateExpenseDto) {
    return this.expensesService.create(user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar despesas com filtros opcionais' })
  @ApiQuery({ name: 'mes', required: false, type: Number, description: 'Filtrar por mês (1 a 12)' })
  @ApiQuery({ name: 'ano', required: false, type: Number, description: 'Filtrar por ano (ex: 2026)' })
  @ApiQuery({ name: 'categoria', required: false, type: String, description: 'Filtrar por categoria' })
  @ApiQuery({
    name: 'metodoPagamento',
    required: false,
    enum: MetodoPagamento,
    description: 'Filtrar por método de pagamento',
  })
  @ApiQuery({ name: 'pago', required: false, type: Boolean, description: 'Filtrar por status pago (true/false)' })
  @ApiQuery({ name: 'cartaoId', required: false, type: String, description: 'Filtrar por UUID do cartão' })
  @ApiResponse({ status: 200, description: 'Lista de despesas retornada com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  findAll(
    @CurrentUser() user: any,
    @Query('mes') mes?: string,
    @Query('ano') ano?: string,
    @Query('categoria') categoria?: string,
    @Query('metodoPagamento') metodoPagamento?: string,
    @Query('pago') pago?: string,
    @Query('cartaoId') cartaoId?: string,
  ) {
    return this.expensesService.findAll(user.userId, {
      mes: mes ? parseInt(mes) : undefined,
      ano: ano ? parseInt(ano) : undefined,
      categoria,
      metodoPagamento,
      pago: pago !== undefined ? pago === 'true' : undefined,
      cartaoId,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar despesa por ID' })
  @ApiParam({ name: 'id', description: 'UUID da despesa', type: String })
  @ApiResponse({ status: 200, description: 'Despesa encontrada.' })
  @ApiResponse({ status: 404, description: 'Despesa não encontrada.' })
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.expensesService.findOne(user.userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados de uma despesa' })
  @ApiParam({ name: 'id', description: 'UUID da despesa', type: String })
  @ApiResponse({ status: 200, description: 'Despesa atualizada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Despesa não encontrada.' })
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: UpdateExpenseDto) {
    return this.expensesService.update(user.userId, id, dto);
  }

  @Patch(':id/toggle-pago')
  @ApiOperation({ summary: 'Alternar status de pagamento da despesa (pago/pendente)' })
  @ApiParam({ name: 'id', description: 'UUID da despesa', type: String })
  @ApiResponse({ status: 200, description: 'Status de pagamento alterado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Despesa não encontrada.' })
  togglePago(@CurrentUser() user: any, @Param('id') id: string) {
    return this.expensesService.togglePago(user.userId, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir despesa' })
  @ApiParam({ name: 'id', description: 'UUID da despesa', type: String })
  @ApiResponse({ status: 200, description: 'Despesa excluída com sucesso.' })
  @ApiResponse({ status: 404, description: 'Despesa não encontrada.' })
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.expensesService.remove(user.userId, id);
  }
}
