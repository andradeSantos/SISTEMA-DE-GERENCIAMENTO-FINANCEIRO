import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@ApiTags('Dashboard')
@ApiBearerAuth('JWT-auth')
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({
    summary: 'Obter resumo consolidado financeiro',
    description:
      'Retorna total de receitas, total de despesas, saldo, gastos por categoria e gastos agrupados por cartão.',
  })
  @ApiQuery({
    name: 'mes',
    required: false,
    type: Number,
    description: 'Mês de referência (1-12). Se não informado, utiliza o mês atual.',
  })
  @ApiQuery({
    name: 'ano',
    required: false,
    type: Number,
    description: 'Ano de referência. Se não informado, utiliza o ano atual.',
  })
  @ApiResponse({ status: 200, description: 'Resumo financeiro retornado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  getSummary(
    @CurrentUser() user: any,
    @Query('mes') mes?: string,
    @Query('ano') ano?: string,
  ) {
    const now = new Date();
    const mesNum = mes ? parseInt(mes) : now.getMonth() + 1;
    const anoNum = ano ? parseInt(ano) : now.getFullYear();
    return this.dashboardService.getSummary(user.userId, mesNum, anoNum);
  }
}
