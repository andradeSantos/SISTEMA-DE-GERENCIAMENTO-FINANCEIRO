import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service.js';

@ApiTags('Health')
@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Status da aplicação / Boas-vindas' })
  @ApiResponse({ status: 200, description: 'Servidor operacional.' })
  getHello(): string {
    return this.healthService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: 'Verificação de integridade da API' })
  @ApiResponse({ status: 200, description: 'API saudável e operacional.' })
  getHealth() {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}
