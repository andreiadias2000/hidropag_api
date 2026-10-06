// usuario.entity.ts

import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, DeleteDateColumn } from "typeorm";
import { Filiais } from "../../filiais/entities/filiais.entity";
import { APROVACOES } from "../../aprovaçoes/entities/aprovaçoe.entity";
import { ApiProperty } from '@nestjs/swagger';
import { Perfil } from "../../perfil/entities/perfil.entity";

@Entity()
export class Usuarios{
    @PrimaryGeneratedColumn("uuid")
    id?: number;

    @Column()    
    nome?: string;

    @Column({ unique: true }) // email vai ser unico     
    email?: string;

    @Column({ name: 'senha', nullable: false })    
    senha?: string;

    // NOVO CAMPO: Telefone/WhatsApp para notificações
    @Column({ nullable: true })
    @ApiProperty({ required: false, example: '51999999999', description: 'Número do WhatsApp com DDD para alertas' })
    whatsapp?: string;

    // NOVO CAMPO DE CONTROLE
    @Column({ default: true })
    @ApiProperty({ example: true, description: 'Indica se o usuário está ativo no sistema' })
    ativo!: boolean;
    
    // Mudança aqui: Relacionamento com a nova tabela
    @ManyToOne(() => Perfil, (perfil) => perfil.usuarios)
    @ApiProperty({ type: () => Perfil })
    perfil?: Perfil;
    
    @ManyToOne(() => Filiais, (filial) => filial.usuarios)
    filial?: Filiais;

    // Relacionamento: Um usuário pode realizar várias aprovações
    @OneToMany(() => APROVACOES, (aprovacao) => aprovacao.usuario)
    aprovacoes?: APROVACOES[];
}