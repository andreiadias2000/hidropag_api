//src/filiais.entity.ts
import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Obras } from "../../obras-empreendimentos/entities/obras-empreendimento.entity";
import { Usuarios } from "../../usuarios/entities/usuario.entity";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

@Entity('FILIAIS')
export class Filiais {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column({nullable: false, unique: true}) //nao pode nulo e duplicado
    @ApiProperty({ example: 'Filial Porto Alegre', description: 'Nome da unidade' })
    nome?: string;

    @Column({ nullable: false })
    @ApiProperty({ example: 'Porto Alegre', description: 'Cidade onde a filial está alocada' })
    cidade?: string;
    
    @Column({ nullable: true, length: 2 })
    @ApiProperty({ example: 'RS', description: 'Unidade Federativa / Estado' })
    uf?: string;

    @Column({ nullable: true })
    @ApiProperty({ example: '90000000', description: 'CEP da filial' })
    cep?: string;

    @Column({ nullable: true })
    @ApiProperty({ example: '1234', description: 'Número do endereço' })
    numero?: string;

    @Column({ nullable: true })
    @ApiProperty({ example: 'Av. Ipiranga', description: 'Rua/Avenida da filial' })
    logradouro?: string;

    @DeleteDateColumn({ name: 'deleted_at', nullable: true })
    @ApiProperty({ description: 'Data de desativação da filial (Soft Delete)', nullable: true })
    deletedAt?: Date;

    @Column({
    type: 'varchar',
    length: 14,
    unique: true,
    nullable: true,
    transformer: {
        to: (value?: string | null) => {
            if (!value) return null;
            const limpo = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
            return limpo.length > 0 ? limpo : null;
        },
        from: (value?: string | null) => value,
        },
    })
    @ApiPropertyOptional({
        example: '12ABC678000199',
        description: 'CNPJ alfanumérico da filial (sem pontuação)',
    })
    cnpj?: string | null;

    // CORREÇÃO: O campo em Obras chama-se 'filial' (singular)
    
    @OneToMany(() => Obras, (obra) => obra.filial) // Ajustado para bater com a classe Obras[cite: 9, 13]
    obras?: Obras[];

   
    @OneToMany(() => Usuarios, (usuario) => usuario.filial)
    usuarios?: Usuarios[];
}

