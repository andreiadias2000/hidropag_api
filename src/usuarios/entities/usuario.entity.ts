// usuario.entity.ts
import { Column, Entity, PrimaryGeneratedColumn,OneToMany, ManyToOne, } from "typeorm";
import { Filiais } from "../../filiais/entities/filiais.entity";
import { APROVACOES } from "../../aprovaçoes/entities/aprovaçoe.entity";
import { ApiProperty } from '@nestjs/swagger';
import { Perfil } from "../../perfil/entities/perfil.entity";

@Entity()
export class Usuarios{
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    
    nome?: string 

    @Column({ unique: true })// emial vai ser unico 
    
    email?: string;

    @Column({ name: 'senha', nullable: false })
    
    senha?: string;
    
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
