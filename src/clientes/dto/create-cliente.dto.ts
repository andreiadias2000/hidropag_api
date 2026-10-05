// src/clientes/dto/create-cliente.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsBoolean,
  IsInt,
} from 'class-validator';

export class CreateClienteDto {
  @ApiProperty({
    example: 'Construtora Sul Ltda',
    description: 'Nome completo ou Razão Social do cliente',
  })
  @IsString()
  @IsNotEmpty({ message: 'O nome ou razão social é obrigatório.' })
  nome_razao_social!: string;

  @ApiPropertyOptional({
    example: '12.345.678/0001-90',
    description: 'CNPJ ou CPF do cliente',
  })
  @IsString()
  @IsOptional()
  cnpj_cpf?: string;

  @ApiPropertyOptional({
    example: 'contato@construtorasul.com.br',
    description: 'E-mail de contato',
  })
  @IsEmail({}, { message: 'Forneça um e-mail válido.' })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    example: '(51) 98765-4321',
    description: 'Telefone comercial ou celular',
  })
  @IsString()
  @IsOptional()
  telefone?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Indica se o cliente está ativo no sistema',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  ativo?: boolean;

  @ApiPropertyOptional({
    example: 1042,
    description: 'Código de integração com o sistema Elevor',
  })
  @IsInt()
  @IsOptional()
  codigo_elevor?: number;
}