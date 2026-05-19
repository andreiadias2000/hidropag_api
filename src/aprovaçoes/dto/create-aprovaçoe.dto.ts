import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAprovaçoeDto {
  
  @ApiProperty({ example: 1, description: 'Decisão: 1 para Aprovado, 2 para Reprovado' })
  @IsInt({ message: 'A decisão deve ser um número inteiro' })
  @IsNotEmpty({ message: 'A decisão é obrigatória' })
  decisao!: number;

  @ApiPropertyOptional({ example: 'Nota aprovada', description: 'Observações sobre a aprovação' })
  @IsString({ message: 'A observação deve ser um texto' })
  @IsOptional()
  observacao?: string;

  @ApiProperty({ example: 'aa006a3f-80cb-4e93-8afa-d55fe629be24', description: 'ID (UUID) da Nota Fiscal' })
  @IsString({ message: 'O ID da nota deve ser um texto válido' })
  @IsNotEmpty({ message: 'O ID da nota é obrigatório' })
  nota!: string;

  @ApiProperty({ example: 1, description: 'ID do Usuário' })
  @IsInt({ message: 'O ID do usuário deve ser um número inteiro' })
  @IsNotEmpty({ message: 'O ID do usuário é obrigatório' })
  usuario!: number;
}