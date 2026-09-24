import { IsString, IsNumber, IsDateString, IsBoolean, IsOptional, IsEnum, IsInt, Min, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum MetodoPagamento {
  CARTAO_CREDITO = 'CARTAO_CREDITO',
  CARTAO_DEBITO = 'CARTAO_DEBITO',
  PIX = 'PIX',
  BOLETO = 'BOLETO',
  DINHEIRO = 'DINHEIRO',
  OUTRO = 'OUTRO',
}

export class CreateExpenseDto {
  @ApiProperty({
    example: 'Supermercado Mensal',
    description: 'Descrição ou nome da despesa',
  })
  @IsString()
  descricao: string;

  @ApiProperty({
    example: 350.75,
    description: 'Valor monetário da despesa (ou de cada parcela)',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  valor: number;

  @ApiProperty({
    example: '2026-09-24T00:00:00.000Z',
    description: 'Data do pagamento ou vencimento em formato ISO 8601',
  })
  @IsDateString()
  dataPagamento: string;

  @ApiProperty({
    example: 'Alimentação',
    description: 'Categoria da despesa',
  })
  @IsString()
  categoria: string;

  @ApiProperty({
    enum: MetodoPagamento,
    example: MetodoPagamento.CARTAO_CREDITO,
    description: 'Método utilizado para pagamento',
  })
  @IsEnum(MetodoPagamento)
  metodoPagamento: MetodoPagamento;

  @ApiPropertyOptional({
    example: 3,
    description: 'Total de parcelas (gera parcelas mensais vinculadas automaticamente)',
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  totalParcelas?: number;

  @ApiPropertyOptional({
    example: false,
    description: 'Indica se é uma despesa recorrente mensal',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  recorrente?: boolean;

  @ApiPropertyOptional({
    example: 'd9b2d63d-a233-4123-8478-82cd67a7a512',
    description: 'UUID do cartão caso vinculado a um cartão cadastrado',
  })
  @IsOptional()
  @IsUUID()
  cartaoId?: string;
}
