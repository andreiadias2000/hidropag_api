//src/notas-fiscais/dto/create-notas-fiscai.dto.ts

import { 
  IsString, 
  IsOptional, 
  IsNumber, 
  IsBoolean, 
  Min, 
  IsEnum, 
  IsUUID, 
  MaxLength 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StatusNota } from '../entities/notas-fiscais.entity';

export class CreateNotasFiscaiDto {
  // ---------------------------------------------------------------------------
  // 1. DADOS PRINCIPAIS
  // ---------------------------------------------------------------------------
  @ApiPropertyOptional({ example: '1010', description: 'Número da Nota Fiscal' })
  @IsString({ message: 'O número da nota deve ser texto.' })
  @MaxLength(50)
  @IsOptional()
  numero_nf?: string;

  @ApiPropertyOptional({ example: 'Construtora Sul Ltda', description: 'Nome do Fornecedor' })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  fornecedor?: string;

  @ApiPropertyOptional({ example: '2026-05-20', description: 'Data de vencimento da nota' })
  @IsString()
  @IsOptional()
  data_vencimento?: string;

  @ApiProperty({ example: 1, description: 'Quantidade de parcelas', default: 1 })
  @IsNumber()
  @Min(1, { message: 'A nota deve ter pelo menos 1 parcela.' })
  @IsOptional()
  quant_parcelas?: number;

  // ---------------------------------------------------------------------------
  // 2. CAMPOS FINANCEIROS E DE STATUS
  // ---------------------------------------------------------------------------
  @ApiProperty({ example: 1500.50, description: 'Valor total da nota fiscal' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'O valor total deve ser numérico (até 2 casas decimais).' })
  @Min(0, { message: 'Valores não podem ser negativos.' })
  valor_total!: number;

  @ApiPropertyOptional({ 
    enum: StatusNota, 
    default: StatusNota.PENDENTE,
    description: '0: Pendente, 1: Aprovada, 2: Reprovada, 3: Devolvida para Explicação'
  })
  @IsEnum(StatusNota, { message: 'Status de nota inválido.' })
  @IsOptional()
  status?: StatusNota;

  // ---------------------------------------------------------------------------
  // 3. ANEXOS, OBSERVAÇÕES E PARECERES
  // ---------------------------------------------------------------------------
  @ApiPropertyOptional({ example: false, description: 'Indica se a nota possui ficheiros anexados' })
  @IsBoolean()
  @IsOptional()
  tem_anexo?: boolean;

  @ApiPropertyOptional({ 
    example: 'Tive de comprar cimento a mais porque a concretagem atrasou.', 
    description: 'Justificação/Observação preenchida por quem lança a nota' 
  })
  @IsString()
  @IsOptional()
  justificativa_lancamento?: string;

  @ApiPropertyOptional({ 
    example: 'Aprovado, mas tente negociar este valor na próxima vez.', 
    description: 'Parecer/Recado deixado pela diretoria' 
  })
  @IsString()
  @IsOptional()
  parecer_aprovacao?: string;

  // ---------------------------------------------------------------------------
  // 4. RELACIONAMENTOS
  // ---------------------------------------------------------------------------
  @ApiPropertyOptional({ 
    example: '550e8400-e29b-41d4-a716-446655440000', 
    description: 'ID da Obra vinculada' 
  })
  @IsUUID('4', { message: 'O ID da obra deve ser um UUID válido.' })
  @IsOptional()
  obraId?: string;
}





// import { ApiProperty } from '@nestjs/swagger';
// import { 
//   IsNumber, 
//   IsString, 
//   IsNotEmpty, 
//   IsOptional, 
//   IsDateString, 
//   IsUUID, 
//   Min 
// } from 'class-validator';
// import { Type } from 'class-transformer';

// export class CreateNotasFiscaiDto {
  
//   @ApiProperty({ example: 1010, description: 'Número da Nota Fiscal' })
//   @Type(() => Number)
//   @IsNumber({}, { message: 'O número da NF deve ser um número' })
//   @IsNotEmpty({ message: 'O número da NF é obrigatório' })
//   numero_nf!: number; // <-- Sem o '?' (É obrigatório)

//   @ApiProperty({ example: 'Ferragem do João' })
//   @IsString()
//   @IsNotEmpty({ message: 'O nome do fornecedor é obrigatório' })
//   fornecedor!: string; // <-- Sem o '?'

//   @ApiProperty({ example: '2026-05-20' })
//   @IsDateString({}, { message: 'Envie uma data válida no formato YYYY-MM-DD' }) // <-- Valida data real
//   @IsNotEmpty({ message: 'A data de vencimento é obrigatória' })
//   data_vencimento!: string; // <-- Sem o '?'

//   @ApiProperty({ example: 1500.50, required: false })
//   @Type(() => Number)
//   @IsNumber()
//   @Min(0.01, { message: 'O valor total não pode ser negativo ou zero' }) // <-- Extra: Proteção financeira
//   //@IsOptional()
//   @IsNotEmpty({ message: 'Nota Fiscal nao pode ter valor zerado' })
//   valor_total!: number; // <-- Mantém o '?' (É opcional)

//   @ApiProperty({ example: 1 })
//   @Type(() => Number)
//   @IsNumber()
//   @Min(1, { message: 'A quantidade de parcelas deve ser pelo menos 1' }) // <-- Extra: Proteção de parcelas
//   @IsNotEmpty({ message: 'A quantidade de parcelas é obrigatória' })
//   quant_parcelas!: number; // <-- Sem o '?'

//   @ApiProperty({ example: 0, description: '0 para pendente, 1 para pago', required: false })
//   @Type(() => Number)
//   @IsNumber()
//   @IsOptional()
//   status?: number; // <-- Mantém o '?'

//   @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000", description: 'ID da Obra' })
//   @IsUUID('all', { message: 'O ID da obra deve ser um UUID válido' }) // <-- Impede o envio de textos aleatórios
//   @IsNotEmpty({ message: 'A nota fiscal precisa estar vinculada a uma obra' })
//   obra!: string; // <-- Sem o '?'
  
// }