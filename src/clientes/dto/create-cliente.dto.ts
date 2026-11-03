import { 
  IsBoolean, 
  IsEnum, 
  IsInt, 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  IsEmail,
  Length, 
  ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { TipoPessoa } from '../entities/cliente.entity'; // ajuste para 'clientes.entity' se o seu arquivo mantiver o 's'

export class CreateClienteDto {
  @ApiProperty({ enum: TipoPessoa, example: TipoPessoa.PJ, description: 'Tipo de pessoa (PF ou PJ)' })
  @IsEnum(TipoPessoa, { message: 'O tipo de pessoa deve ser PF ou PJ.' })
  @IsNotEmpty({ message: 'O tipo de pessoa é obrigatório.' })
  tipo_pessoa!: TipoPessoa;

  // --- PESSOA JURÍDICA (Obrigatório se tipo_pessoa === 'PJ') ---
  @ValidateIf((o) => o.tipo_pessoa === TipoPessoa.PJ)
  @IsNotEmpty({ message: 'A razão social é obrigatória para Pessoa Jurídica.' })
  @IsString({ message: 'A razão social deve ser um texto.' })
  @ApiPropertyOptional({ example: 'Materiais de Construção Silva LTDA', description: 'Razão Social (Obrigatório para PJ)' })
  razao_social?: string;

  @ValidateIf((o) => o.tipo_pessoa === TipoPessoa.PJ)
  @IsNotEmpty({ message: 'O CNPJ é obrigatório para Pessoa Jurídica.' })
  @Transform(({ value }) => typeof value === 'string' ? value.replace(/\D/g, '') : value)
  @IsString()
  @Length(14, 14, { message: 'O CNPJ deve ter exatamente 14 dígitos.' })
  @ApiPropertyOptional({ example: '12345678000190', description: 'CNPJ somente números (Obrigatório para PJ)' })
  cnpj?: string;

  // --- PESSOA FÍSICA (Obrigatório se tipo_pessoa === 'PF') ---
  @ValidateIf((o) => o.tipo_pessoa === TipoPessoa.PF)
  @IsNotEmpty({ message: 'O nome é obrigatório para Pessoa Física.' })
  @IsString({ message: 'O nome deve ser um texto.' })
  @ApiPropertyOptional({ example: 'Carlos Alberto', description: 'Nome completo (Obrigatório para PF)' })
  nome?: string;

  @ValidateIf((o) => o.tipo_pessoa === TipoPessoa.PF)
  @IsNotEmpty({ message: 'O CPF é obrigatório para Pessoa Física.' })
  @Transform(({ value }) => typeof value === 'string' ? value.replace(/\D/g, '') : value)
  @IsString()
  @Length(11, 11, { message: 'O CPF deve ter exatamente 11 dígitos.' })
  @ApiPropertyOptional({ example: '12345678900', description: 'CPF somente números (Obrigatório para PF)' })
  cpf?: string;

  // --- CONTATO ---
  @ApiPropertyOptional({ example: 'contato@silva.com.br', description: 'E-mail' })
  @IsOptional()
  @IsEmail({}, { message: 'Formato de e-mail inválido.' })
  email?: string;

  @Transform(({ value }) => typeof value === 'string' ? value.replace(/\D/g, '') : value)
  @IsOptional()
  @IsString()
  @Length(10, 11, { message: 'O telefone deve conter 10 ou 11 dígitos (com DDD).' })
  @ApiPropertyOptional({ example: '51999998888', description: 'Telefone somente números' })
  telefone?: string;

  // --- ENDEREÇO COMPLETO ---
  @Transform(({ value }) => typeof value === 'string' ? value.replace(/\D/g, '') : value)
  @IsOptional()
  @IsString()
  @Length(8, 8, { message: 'O CEP deve conter exatamente 8 dígitos.' })
  @ApiPropertyOptional({ example: '90000000', description: 'CEP somente números' })
  cep?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Cristo Redentor', description: 'Bairro' })
  bairro?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: '1500', description: 'Número do imóvel' })
  numero?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Porto Alegre', description: 'Cidade' })
  cidade?: string;

  @IsOptional()
  @IsString()
  @Length(2, 2, { message: 'O estado deve conter exatamente 2 caracteres (UF).' })
  @ApiPropertyOptional({ example: 'RS', description: 'Estado (UF)' })
  estado?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Sala 402', description: 'Complemento do endereço' })
  complemento?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Av. Industrial, 456', description: 'Logradouro / Endereço' })
  endereco?: string;

  // --- CONFIGURAÇÕES ---
  @ApiPropertyOptional({ example: true, description: 'Ativo', default: true })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @ApiPropertyOptional({ example: 4567, description: 'Código do sistema Elevor' })
  @IsInt()
  @IsOptional()
  codigo_elevor?: number;
}