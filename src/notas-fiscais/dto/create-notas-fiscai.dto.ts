//src/notas-fiscais/dto/create-notas-fiscai.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { 
  IsNumber, 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsDateString, 
  IsUUID, 
  Min 
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateNotasFiscaiDto {
  
  @ApiProperty({ example: 1010, description: 'Número da Nota Fiscal' })
  @Type(() => Number)
  @IsNumber({}, { message: 'O número da NF deve ser um número' })
  @IsNotEmpty({ message: 'O número da NF é obrigatório' })
  numero_nf!: number; // <-- Sem o '?' (É obrigatório)

  
  @ApiProperty({ example: '2026-05-20' })
  @IsDateString({}, { message: 'Envie uma data válida no formato YYYY-MM-DD' }) // <-- Valida data real
  @IsNotEmpty({ message: 'A data de vencimento é obrigatória' })
  data_vencimento!: string; // <-- Sem o '?'

  @ApiProperty({ example: 1500.50, required: false })
  @Type(() => Number)
  @IsNumber()
  @Min(0.01, { message: 'O valor total não pode ser negativo ou zero' }) // <-- Extra: Proteção financeira
  //@IsOptional()
  @IsNotEmpty({ message: 'Nota Fiscal nao pode ter valor zerado' })
  valor_total!: number; // <-- Mantém o '?' (É opcional)

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsNumber()
  @Min(1, { message: 'A quantidade de parcelas deve ser pelo menos 1' }) // <-- Extra: Proteção de parcelas
  @IsNotEmpty({ message: 'A quantidade de parcelas é obrigatória' })
  quant_parcelas!: number; // <-- Sem o '?'

  @ApiProperty({ example: 0, description: '0 para pendente, 1 para pago', required: false })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  status?: number; // <-- Mantém o '?'

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001', description: 'ID do Fornecedor vinculado' })
  @IsUUID()
  @IsOptional()
  fornecedorId?: string;

  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000", description: 'ID da Obra' })
  @IsUUID('all', { message: 'O ID da obra deve ser um UUID válido' }) // <-- Impede o envio de textos aleatórios
  @IsNotEmpty({ message: 'A nota fiscal precisa estar vinculada a uma obra' })
  obra!: string; // <-- Sem o '?'
  
}