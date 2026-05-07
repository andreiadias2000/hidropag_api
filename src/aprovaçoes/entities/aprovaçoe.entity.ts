import { timeStamp } from "node:console";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Notas } from "../../notas-fiscais/entities/notas-fiscais.entity";
import { Usuarios } from "../../usuarios/entities/usuario.entity";
import { ApiProperty } from '@nestjs/swagger';
@Entity('APROVACOES')

export class APROVACOES{

    @PrimaryGeneratedColumn('uuid')
    id?: number;

    @Column()
    @ApiProperty({ example: 1, description: 'Decisão: 1 para Aprovado, 2 para Reprovado' })
    decisao?: number;

    @Column()
    @ApiProperty({ example: 'Valor de acordo com o contrato', description: 'Observações sobre a aprovação' })
    observacao?: string;

    
    // Relacionamento: Muitas aprovações podem referenciar a mesma Nota
    @ManyToOne(() => Notas, (nota) => nota.aprovacoes)
    @ApiProperty({type: () => Notas })
    nota?: Notas;

    // Relacionamento: Muitas aprovações podem ser feitas pelo mesmo Usuário
    @ManyToOne(() => Usuarios, (usuario) => usuario.aprovacoes)
    @ApiProperty({ description: 'Usuário que realizou a aprovação' })
    usuario?: Usuarios;

    @CreateDateColumn({ type: 'timestamp' })
    decidido_em?: Date; //[cite: 1]



}
