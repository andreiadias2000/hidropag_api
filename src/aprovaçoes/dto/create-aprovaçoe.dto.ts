//src/aprovaçoes/dto/create-aprovaçoe.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateAprovaçoeDto {
  @ApiProperty({ example: 1, description: 'Decisão do gestor: 1 para Aprovada, 2 para Reprovada' })
  @IsNumber()
  @IsNotEmpty()
  decisao!: number;

  @ApiPropertyOptional({ example: 'Tudo certo com os valores.', description: 'Parecer ou observação da aprovação' })
  @IsString()
  @IsOptional()
  observacao?: string;

  @ApiProperty({ example: 'uuid-da-nota', description: 'ID da Nota Fiscal que está sendo avaliada' })
  @IsUUID()
  @IsNotEmpty()
  nota!: string;

  @ApiProperty({ example: 'uuid-do-usuario', description: 'ID do Usuário (Gestor) que está aprovando' })
  @IsUUID()
  @IsNotEmpty()
  usuario!: string;
}

// import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

// export class CreateAprovaçoeDto {
  
//   @ApiProperty({ example: 1, description: 'Decisão: 1 para Aprovado, 2 para Reprovado' })
//   @IsInt({ message: 'A decisão deve ser um número inteiro' })
//   @IsNotEmpty({ message: 'A decisão é obrigatória' })
//   decisao!: number;

//   @ApiPropertyOptional({ example: 'Nota aprovada', description: 'Observações sobre a aprovação' })
//   @IsString({ message: 'A observação deve ser um texto' })
//   @IsOptional()
//   observacao?: string;

//   @ApiProperty({ example: 'aa006a3f-80cb-4e93-8afa-d55fe629be24', description: 'ID (UUID) da Nota Fiscal' })
//   @IsString({ message: 'O ID da nota deve ser um texto válido' })
//   @IsNotEmpty({ message: 'O ID da nota é obrigatório' })
//   nota!: string;

//   @ApiProperty({ example: 1, description: 'ID do Usuário' })
//   @IsInt({ message: 'O ID do usuário deve ser um número inteiro' })
//   @IsNotEmpty({ message: 'O ID do usuário é obrigatório' })
//   usuario!: number;
// }