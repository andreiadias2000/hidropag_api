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