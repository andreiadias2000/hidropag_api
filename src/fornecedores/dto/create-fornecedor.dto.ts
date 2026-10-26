import { IsBoolean, IsEmail, IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFornecedorDto {
  @ApiProperty({ example: 'Materiais de Construção Silva LTDA', 
    description: 'Razão social do fornecedor' 
})
  @IsString()
  @IsNotEmpty()
  razao_social!: string;

  @ApiProperty({ example: '12.345.678/0001-90', 
    description: 'CNPJ ou CPF do fornecedor', required: false })
  @IsString()
  @IsOptional()
  cnpj_cpf?: string;

  @ApiProperty({ example: 'contato@silva.com.br', 
    description: 'E-mail de contato', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '(51) 99999-8888', 
    description: 'Telefone de contato', required: false })
  @IsString()
  @IsOptional()
  telefone?: string;

  @ApiProperty({ example: true, description: 'Indica se o fornecedor está ativo', 
    default: true, required: false })
  @IsBoolean()
  @IsOptional()
  ativo?: boolean;
}