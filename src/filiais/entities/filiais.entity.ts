//src/filiais.entity.ts
import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Obras } from "../../obras-empreendimentos/entities/obras-empreendimento.entity";
import { Usuarios } from "../../usuarios/entities/usuario.entity";
import { ApiProperty } from "@nestjs/swagger";

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

    @Column({ nullable: true, unique: true, length: 14 })
    @ApiProperty({ example: '12345678000199', description: 'CNPJ da filial (apenas números)' })
    cnpj?: string;

    // CORREÇÃO: O campo em Obras chama-se 'filial' (singular)
    
    @OneToMany(() => Obras, (obra) => obra.filial) // Ajustado para bater com a classe Obras[cite: 9, 13]
    obras?: Obras[];

   
    @OneToMany(() => Usuarios, (usuario) => usuario.filial)
    usuarios?: Usuarios[];
}

