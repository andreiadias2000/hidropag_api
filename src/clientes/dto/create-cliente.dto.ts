import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsBoolean,
  IsInt,
  IsEnum,
  ValidateIf,
  Length,
  Matches,
  IsNumber,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { TipoPessoa } from '../entities/cliente.entity'; // Certifique-se de que o Enum está exportado na entidade

export class CreateClienteDto {
  @ApiProperty({
    enum: TipoPessoa,
    example: TipoPessoa.PJ,
    description: 'Define se o cliente é Pessoa Física ou Jurídica',
  })
  @IsEnum(TipoPessoa, { message: 'O tipo_pessoa deve ser PF ou PJ.' })
  @IsNotEmpty({ message: 'O tipo_pessoa é obrigatório.' })
  tipo_pessoa!: TipoPessoa;

  // ==========================================
  // CAMPOS ESPECÍFICOS DE PESSOA JURÍDICA (PJ)
  // ==========================================

  @ApiPropertyOptional({
    example: 'Construtora Sul Ltda',
    description: 'Razão Social (Obrigatório apenas se for PJ)',
  })
  @ValidateIf((obj) => obj.tipo_pessoa === TipoPessoa.PJ)
  @IsString()
  @IsNotEmpty({ message: 'A razão social é obrigatória para Pessoa Jurídica.' })
  razao_social?: string;

  @ApiPropertyOptional({
    example: '12.345.678/0001-90',
    description: 'CNPJ do cliente (Pode ser enviado com ou sem máscara)',
  })
  @ValidateIf((obj) => obj.tipo_pessoa === TipoPessoa.PJ)
  @IsNotEmpty({ message: 'O CNPJ é obrigatório para Pessoa Jurídica.' })
  @IsString()
  @Transform(({ value }) => (value ? value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() : value)) // Limpa pontuação
  @Length(14, 14, { message: 'O CNPJ deve ter exatamente 14 caracteres após a remoção da máscara.' })
  @Matches(/^[A-Z0-9]{12}[0-9]{2}$/, {
    message: 'CNPJ inválido. Os 12 primeiros caracteres podem ser alfanuméricos, mas os 2 últimos devem ser numéricos.',
  })
  cnpj?: string;

  // ==========================================
  // CAMPOS ESPECÍFICOS DE PESSOA FÍSICA (PF)
  // ==========================================

  @ApiPropertyOptional({
    example: 'João da Silva',
    description: 'Nome completo (Obrigatório apenas se for PF)',
  })
  @ValidateIf((obj) => obj.tipo_pessoa === TipoPessoa.PF)
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório para Pessoa Física.' })
  nome?: string;

  @ApiPropertyOptional({
    example: '123.456.789-00',
    description: 'CPF do cliente (Pode ser enviado com ou sem máscara)',
  })
  @ValidateIf((obj) => obj.tipo_pessoa === TipoPessoa.PF)
  @IsNotEmpty({ message: 'O CPF é obrigatório para Pessoa Física.' })
  @IsString()
  @Transform(({ value }) => (value ? value.replace(/[^0-9]/g, '') : value)) // Limpa pontuação (deixa só números)
  @Length(11, 11, { message: 'O CPF deve ter exatamente 11 números após a remoção da máscara.' })
  cpf?: string;

  // ==========================================
  // CAMPOS COMUNS (COMPARTILHADOS)
  // ==========================================

  @ApiPropertyOptional({
    example: 'contato@construtorasul.com.br',
    description: 'E-mail de contato',
  })
  @IsEmail({}, { message: 'Forneça um e-mail válido.' })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    example: '5551987654321',
    description: 'Telefone comercial ou celular',
  })
  @IsNumber()
  @IsOptional()
  telefone?: number;

  @ApiPropertyOptional({
    example: 'Rua das Flores, 123',
    description: 'Endereço do cliente',
  })
  @IsString()
  @IsNotEmpty({ message: 'O endereço é obrigatório.' })
  @IsString({ message: 'O endereço não deve ter caracteres especiais.' })
  endereco?: string;

  @ApiPropertyOptional({
    example: 'Apto 1001',
    description: 'Complemento do endereço',
  })
  @IsString()
  @IsOptional()
  complemento?: string;



  @ApiPropertyOptional({
    example: true,
    description: 'Indica se o cliente está ativo no sistema',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  ativo?: boolean;

  @ApiPropertyOptional({
    example: 1042,
    description: 'Código de integração com o sistema Elevor',
  })
  @IsInt({ message: 'O código Elevor deve ser um número inteiro.' })
  @IsOptional()
  codigo_elevor?: number;
}