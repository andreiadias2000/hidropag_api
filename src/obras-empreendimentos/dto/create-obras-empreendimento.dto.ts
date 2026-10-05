// src/obras-empreendimentos/dto/create-obras-empreendimento.dto.ts
import { IsString, IsNotEmpty, IsUUID, IsOptional, IsNumber, IsBoolean, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateObrasEmpreendimentoDto {
  @ApiProperty({ example: 'Hospital Moinhos de Vento' })
  @IsString()
  @IsNotEmpty()
  nome_obra!: string;

  @ApiProperty({ example: 'd3b07384-d113-4c4e-9c95-bd845d471018' })
  @IsUUID()
  @IsNotEmpty()
  filialId!: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', required: false })
  @IsUUID()
  @IsOptional()
  clienteId?: string;

  @ApiProperty({ example: '12.345.67890/12', required: false })
  @IsString()
  @IsOptional()
  cno?: string;

  @ApiProperty({ example: 'Rua Ramiro Barcelos, 910 - Porto Alegre/RS', required: false })
  @IsString()
  @IsOptional()
  endereco_localizacao?: string;

  @ApiProperty({ example: 150000.0, default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  valor_previsto?: number;

  @ApiProperty({ example: 1, default: 1 })
  @IsNumber()
  @IsOptional()
  status?: number;

  @ApiProperty({ example: true, default: true })
  @IsBoolean()
  @IsOptional()
  ativo?: boolean;
}