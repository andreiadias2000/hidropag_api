// src/obras-empreendimentos/dto/create-obras-empreendimento.dto.ts
import { 
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsInt,
  IsEnum,
  ValidateIf,
  Length,
  Matches, 
  Min,
  IsUUID,     // 👈 1. Adicionado para validar UUIDs (filialId, clienteId)
  IsNumber, 
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';


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
  clienteId!: string;

  @ApiPropertyOptional({
    example: '123456789012',
    description: 'CNO da obra (12 dígitos numéricos, opcional)',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const limpo = value.replace(/\D/g, '');
      return limpo === '' ? null : limpo;
    }
    return value ?? null;
  })
  @IsString({ message: 'O CNO deve ser um texto válido.' })
  @Length(12, 12, { message: 'O CNO deve conter exatamente 12 números.' })
  @Matches(/^\d{12}$/, { message: 'O CNO deve conter apenas números.' })
  cno?: string | null;

  @ApiProperty({ example: 'Rua Ramiro Barcelos, 910 - Porto Alegre/RS', required: false })
  @IsString()
  @IsOptional()
  endereco_localizacao!: string;

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