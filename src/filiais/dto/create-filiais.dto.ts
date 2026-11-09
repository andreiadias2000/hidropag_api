// create-filiais.dto.ts
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
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

    @ApiPropertyOptional({
    example: '12ABC678000199',
    description: 'CNPJ alfanumérico da filial sem pontuação',
    })
    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === 'string') {
        const limpo = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        return limpo === '' ? null : limpo;
        }
        return value ?? null;
    })
    @IsString({ message: 'O CNPJ deve ser um texto válido.' })
    @Length(14, 14, { message: 'O CNPJ deve conter exatamente 14 caracteres.' })
    @Matches(/^[A-Z0-9]{12}\d{2}$/, {
        message: 'Formato de CNPJ inválido. Os 12 primeiros caracteres devem ser alfanuméricos e os 2 últimos numéricos.',
    })
    cnpj?: string | null;

       

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