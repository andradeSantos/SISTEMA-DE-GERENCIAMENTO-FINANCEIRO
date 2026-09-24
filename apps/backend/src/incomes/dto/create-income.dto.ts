import { IsString, IsNumber, IsDateString, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateIncomeDto {
  @ApiProperty({
    example: 'Salário Mensal',
    description: 'Descrição ou fonte do rendimento',
  })
  @IsString()
  descricao: string;

  @ApiProperty({
    example: 5000.0,
    description: 'Valor monetário recebido',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  valor: number;

  @ApiProperty({
    example: '2026-09-24T00:00:00.000Z',
    description: 'Data do recebimento em formato ISO 8601',
  })
  @IsDateString()
  dataRecebimento: string;

  @ApiProperty({
    example: 'Trabalho',
    description: 'Categoria do rendimento (ex: Salário, Freelance, Rendimentos)',
  })
  @IsString()
  categoria: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Indica se este rendimento é recorrente todo mês',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  recorrente?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: 'Indica se o valor já foi creditado/recebido',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  recebido?: boolean;
}
