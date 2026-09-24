import { IsString, IsOptional, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCardDto {
  @ApiProperty({
    example: 'Nubank Roxinho',
    description: 'Nome ou identificação amigável do cartão',
  })
  @IsString()
  nome: string;

  @ApiProperty({
    example: 'Nubank',
    description: 'Nome do banco ou instituição financeira emissora',
  })
  @IsString()
  instituicaoFinanceira: string;

  @ApiPropertyOptional({
    example: '1234',
    description: 'Últimos 4 dígitos do cartão',
    minLength: 4,
    maxLength: 4,
  })
  @IsOptional()
  @IsString()
  @Length(4, 4)
  ultimosDigitos?: string;
}
