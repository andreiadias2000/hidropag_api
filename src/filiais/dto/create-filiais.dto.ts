// create-filiais.dto.ts
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { 
    IsNotEmpty, 
    IsOptional, 
    IsString, 
    IsBoolean, 
    IsEmail, 
    Length, 
    Matches 
} from "class-validator";

export class CreateFilialDto {
    @ApiProperty({ example: 'Filial Porto Alegre', description: 'Nome da unidade' })
    @IsString({ message: 'O nome deve ser uma string.' })
    @IsNotEmpty({ message: 'O nome da filial é obrigatório.' })
    nome?: string;

    @ApiProperty({ example: '12345678000199', description: 'CNPJ da filial (apenas números)', required: false })
    @IsString()
    @IsOptional()
    @Length(14, 14, { message: 'O CNPJ deve conter exatamente 14 dígitos.' })
    @Matches(/^\d+$/, { message: 'O CNPJ deve conter apenas números.' })
    cnpj?: string;

       

    // --- BLOCO DE ENDEREÇO DETALHADO ---
    @ApiProperty({ example: 'Porto Alegre', description: 'Cidade onde a filial está alocada' })
    @IsString({ message: 'A cidade deve ser uma string.' })
    @IsNotEmpty({ message: 'A cidade é obrigatória.' })
    cidade?: string;

    @ApiProperty({ example: 'RS', description: 'Unidade Federativa / Estado', required: false })
    @IsString()
    @IsOptional()
    @Length(2, 2, { message: 'A UF deve conter exatamente 2 caracteres (Ex: RS).' })
    uf?: string;

    @ApiProperty({ example: '90000000', description: 'CEP da filial (apenas números)', required: false })
    @IsString()
    @IsOptional()
    @Length(8, 8, { message: 'O CEP deve conter exatamente 8 dígitos.' })
    @Matches(/^\d+$/, { message: 'O CEP deve conter apenas números.' })
    cep?: string;

    @ApiProperty({ example: 'Av. Ipiranga', description: 'Rua/Avenida da filial', required: false })
    @IsString()
    @IsOptional()
    logradouro?: string;

    @ApiProperty({ example: '1234', description: 'Número do endereço', required: false })
    @IsString({ message: 'O número deve ser uma string.' })
    @IsOptional() // Como você definiu como nullable no banco, aqui usamos @IsOptional
    numero?: string;
    // -----------------------------------

    @ApiProperty({ example: 'portoalegre@empresa.com', description: 'E-mail de contato da filial', required: false })
    @IsEmail({}, { message: 'Insira um e-mail de contato válido.' })
    @IsOptional()
    email_contato?: string;
}