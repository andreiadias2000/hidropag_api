// src/usuarios/dto/create-usuario.dto.ts
import { IsEmail, IsNotEmpty, IsString, MinLength, IsObject, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsuarioDto {
  @ApiProperty({ example: 'Ivan Silva', description: 'Nome completo do utilizador' })
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  nome?: string;

  @ApiProperty({ example: 'ivan@teste.com', description: 'E-mail único de acesso' })
  @IsEmail({}, { message: 'O e-mail informado deve ser válido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  email?: string;

  @ApiProperty({ example: 'Admin#2026', description: 'Palavra-passe de acesso (mínimo 6 caracteres)' })
  @IsString()
  @IsNotEmpty({ message: 'A palavra-passe é obrigatória.' })
  @MinLength(6, { message: 'A palavra-passe deve ter pelo menos 6 caracteres.' })
  senha?: string;

  @ApiProperty({
    example: { id: '6fc13eec-a3fe-4fe4-811b-2563cb1b5f4c' },
    description: 'Objeto contendo o ID do perfil do utilizador',
  })
  @IsObject()
  @IsNotEmpty({ message: 'O perfil associado é obrigatório.' })
  perfil?: {
    id: string;
  };

//   @ApiProperty({
//     example: { id: 'uuid-da-filial' },
//     description: 'Objeto contendo o ID da filial (opcional)',
//     required: false,
//   })
  @IsObject()
  @IsOptional()
  filial?: {
    id: string;
  } | null;
}