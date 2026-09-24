import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service.js';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Status da aplicação / Boas-vindas' })
  @ApiResponse({ status: 200, description: 'Servidor operacional.' })
  getHello(): string {
    return this.appService.getHello();
  }
}
