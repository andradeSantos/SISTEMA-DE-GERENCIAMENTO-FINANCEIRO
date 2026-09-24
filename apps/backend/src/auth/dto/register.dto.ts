import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'Rafael Andrade',
    description: 'Nome completo do usuário',
    minLength: 2,
  })
  @IsString()
  @MinLength(2)
  nome: string;

  @ApiProperty({
    example: 'usuario@email.com',
    description: 'E-mail para cadastro e login',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Senha de acesso (mínimo 6 caracteres)',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  senha: string;
}
