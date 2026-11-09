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
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { TipoPessoa } from '../entities/cliente.entity'; // ajuste para 'clientes.entity' se o seu arquivo mantiver o 's'

export class CreateClienteDto {
  @IsEnum(TipoPessoa, { message: 'O tipo de pessoa deve ser PF ou PJ.' })
  @ApiProperty({ enum: TipoPessoa, default: TipoPessoa.PJ, description: 'PF ou PJ' })
  tipo_pessoa!: TipoPessoa;

  // --- PESSOA JURÍDICA --------------------------------------------
  @ValidateIf((o) => o.tipo_pessoa === TipoPessoa.PJ)
  @IsNotEmpty({ message: 'A Razão Social é obrigatória para Pessoa Jurídica.' })
  @Transform(({ value, obj }) => (obj.tipo_pessoa === TipoPessoa.PF ? null : value?.trim() || null))
  @IsString()
  @ApiPropertyOptional({ example: 'Materiais de Construção Silva LTDA', description: 'Razão Social do cliente' })
  razao_social?: string | null;

  @ValidateIf((o) => o.tipo_pessoa === TipoPessoa.PJ)
  @IsNotEmpty({ message: 'O CNPJ é obrigatório para Pessoa Jurídica.' })
  @Transform(({ value, obj }) => {
    if (obj.tipo_pessoa === TipoPessoa.PF) return null;
    if (typeof value === 'string') {
      const limpo = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      return limpo === '' ? null : limpo;
    }
    return null;
  })
  @IsString()
  @Length(14, 14, { message: 'O CNPJ deve ter exatamente 14 caracteres.' })
  @Matches(/^[A-Z0-9]{12}\d{2}$/, {
    message: 'Formato de CNPJ inválido. Os 12 primeiros caracteres devem ser alfanuméricos e os 2 últimos numéricos.',
  })
  @ApiPropertyOptional({
    example: '12ABC678000190',
    description: 'CNPJ alfanumérico sem pontuação (Obrigatório para PJ)',
  })
  cnpj?: string | null;

  // --- PESSOA FÍSICA ----------------------------------------------
  @ValidateIf((o) => o.tipo_pessoa === TipoPessoa.PF)
  @IsNotEmpty({ message: 'O Nome é obrigatório para Pessoa Física.' })
  @Transform(({ value, obj }) => (obj.tipo_pessoa === TipoPessoa.PJ ? null : value?.trim() || null))
  @IsString()
  @ApiPropertyOptional({ example: 'Carlos Alberto', description: 'Nome completo do cliente' })
  nome?: string | null;

  @ValidateIf((o) => o.tipo_pessoa === TipoPessoa.PF)
  @IsNotEmpty({ message: 'O CPF é obrigatório para Pessoa Física.' })
  @Transform(({ value, obj }) => {
    if (obj.tipo_pessoa === TipoPessoa.PJ) return null;
    if (typeof value === 'string') {
      const limpo = value.replace(/\D/g, '');
      return limpo === '' ? null : limpo;
    }
    return null;
  })
  @IsString()
  @Length(11, 11, { message: 'O CPF deve ter exatamente 11 dígitos.' })
  @ApiPropertyOptional({ example: '12345678900', description: 'CPF somente números (Obrigatório para PF)' })
  cpf?: string | null;


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