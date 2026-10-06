<<<<<<< HEAD
//src/obras-empreendimentos/dto/create-obras-empreendimento.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsNumber, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateObrasEmpreendimentoDto {
  @ApiProperty({ example: 'Hospital Moinhos de Vento', description: 'Nome da Obra' })
  @IsString()
  @IsNotEmpty()
  nome_obra: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  ativo?: boolean;

  // NOVO: Orçamento Previsto
  @ApiProperty({ example: 150000.00, description: 'Orçamento total previsto' })
  @IsNumber()
  @IsNotEmpty()
  orcamento_previsto: number;

  @ApiProperty({ example: 'uuid-da-filial-aqui', description: 'ID da Filial responsável' })
  @IsUUID()
  @IsNotEmpty()
  filialId: string;

  // NOVO: Cliente (Construtora) dona da obra
  @ApiProperty({ example: 'uuid-do-cliente-aqui', description: 'ID do Cliente (Construtora)' })
  @IsUUID()
  @IsNotEmpty()
  clienteId: string;

  
}


// import { ApiProperty } from "@nestjs/swagger";
// import { IsNotEmpty, IsString, IsBoolean, IsOptional, IsUUID } from "class-validator";

// export class CreateObrasEmpreendimentoDto {
//     @ApiProperty({ example: 'Hospital Moinhos de Vento', description: 'Nome único da Obra' })
//     @IsString({ message: 'O nome da obra deve ser uma string.' })
//     @IsNotEmpty({ message: 'O nome da obra é obrigatório.' })
//     nome_obra?: string;

//     @ApiProperty({ example: true, description: 'Indica se a obra está ativa ou concluída/arquivada', default: true, required: false })
//     @IsBoolean({ message: 'O campo ativo deve ser um booleano.' })
//     @IsOptional()
//     ativo?: boolean;

//     @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID (UUID) da filial vinculada à obra' })
//     @IsUUID('4', { message: 'O ID da filial deve ser um UUID válido.' })
//     @IsNotEmpty({ message: 'O vínculo com uma filial é obrigatório.' })
//     filialId?: string;
// }
=======
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
>>>>>>> e49fe5edc4608c096fb9a3c1f817cdcffb300d1d
