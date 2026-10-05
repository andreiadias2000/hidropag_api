
//### 2\. DTO de Criação (`src/clientes/dto/create-cliente.dto.ts`)

//Substitua o conteúdo de `src/clientes/dto/create-cliente.dto.ts` para proteger as entradas da API usando o `class-validator`:


import { IsString, IsNotEmpty, IsOptional, IsEmail, IsBoolean } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome ou razão social é obrigatório.' })
  nome_razao_social?: string;

  @IsString()
  @IsOptional()
  cnpj_cpf?: string;

  @IsEmail({}, { message: 'Forneça um e-mail válido.' })
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  telefone?: string;

  @IsBoolean()
  @IsOptional()
  ativo?: boolean;
}
