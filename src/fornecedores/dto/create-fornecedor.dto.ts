import { 
  IsBoolean, 
  IsEnum, 
  IsInt, 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  MaxLength, 
  ValidateIf,
  Length, 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { TipoPessoa } from '../entities/fornecedor.entity';

export class CreateFornecedorDto {
  @ApiProperty({ enum: TipoPessoa, example: TipoPessoa.PJ, description: 'Tipo de pessoa (PF ou PJ)' })
  @IsEnum(TipoPessoa)
  @IsNotEmpty({ message: 'O tipo de pessoa é obrigatório.' })
  tipo_pessoa!: TipoPessoa;

  // --- PESSOA JURÍDICA (Obrigatório se tipo_pessoa === 'PJ') ---
  @ValidateIf((o) => o.tipo_pessoa === TipoPessoa.PJ)
  @IsNotEmpty({ message: 'A razão social é obrigatória para Pessoa Jurídica.' })
  @IsString()
  @ApiPropertyOptional({ example: 'Materiais de Construção Silva LTDA', description: 'Razão Social (Obrigatório para PJ)' })
  razao_social?: string;

  @ValidateIf((o) => o.tipo_pessoa === TipoPessoa.PJ)
  @IsNotEmpty({ message: 'O CNPJ é obrigatório para Pessoa Jurídica.' })
  @Transform(({ value }) => typeof value === 'string' ? value.replace(/\D/g, '') : value)
  @IsString()
  @MaxLength(14)
  @ApiPropertyOptional({ example: '12345678000190', description: 'CNPJ somento números (Obrigatório para PJ)' })
  cnpj?: string;

  // --- PESSOA FÍSICA (Obrigatório se tipo_pessoa === 'PF') ---
  @ValidateIf((o) => o.tipo_pessoa === TipoPessoa.PF)
  @IsNotEmpty({ message: 'O nome é obrigatório para Pessoa Física.' })
  @IsString()
  @ApiPropertyOptional({ example: 'Carlos Alberto', description: 'Nome completo (Obrigatório para PF)' })
  nome?: string;

  @ValidateIf((o) => o.tipo_pessoa === TipoPessoa.PF)
  @IsNotEmpty({ message: 'O CPF é obrigatório para Pessoa Física.' })
  @Transform(({ value }) => typeof value === 'string' ? value.replace(/\D/g, '') : value)
  @IsString()
  @MaxLength(11)
  @ApiPropertyOptional({ example: '12345678900', description: 'CPF somente números (Obrigatório para PF)' })
  cpf?: string;

  // --- COMUM (Opcionais) ---
  @ApiPropertyOptional({ example: 'contato@silva.com.br', description: 'E-mail' })
  @IsString()
  @IsOptional()
  email?: string;

  @Transform(({ value }) => typeof value === 'string' ? value.replace(/\D/g, '') : value)
  @IsString()
  @Length(11, 11, { message: 'O telefone deve conter exatamente 11 dígitos (com DDD e o 9º dígito).' })
  @IsOptional()
  @ApiPropertyOptional({ example: '51999998888', description: 'Telefone somente números' })
  telefone?: string;

  @ApiPropertyOptional({ example: 'Av. Industrial, 456', description: 'Endereço' })
  @IsString()
  @IsOptional()
  endereco?: string;

  @ApiPropertyOptional({ example: 'Galpão B', description: 'Complemento' })
  @IsString()
  @IsOptional()
  complemento?: string;

  @ApiPropertyOptional({ example: true, description: 'Ativo', default: true })
  @IsBoolean()
  @IsOptional()
  ativo?: boolean;

  @ApiPropertyOptional({ example: 4567, description: 'Código do sistema Elevor' })
  @IsInt()
  @IsOptional()
  codigo_elevor?: number;
}