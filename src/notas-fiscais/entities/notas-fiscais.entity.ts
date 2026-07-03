//notas-fiscais,entity.ts

import { Column, Entity, PrimaryGeneratedColumn,ManyToOne,OneToMany } from "typeorm";
import { APROVACOES } from "../../aprovaçoes/entities/aprovaçoe.entity";
import { Obras } from "../../obras-empreendimentos/entities/obras-empreendimento.entity";
import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";

@Entity('NOTAS')
export class Notas {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column({ default: false }) // Por padrão, nasce sem anexo
    @ApiProperty({ example: true, description: 'Indica se a nota possui um PDF anexado' })
    tem_anexo?: boolean;

    @Column()
    @ApiProperty({ example: 1010 })
    numero_nf?: number;

    @Column()
    @ApiProperty({ example: 'Nome do Fornecedor' })
    fornecedor?: string;

    @Column({type: 'date'})
    @ApiProperty({ example: '2026-05-20' })
    data_vencimento?: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    @ApiProperty({ example: 1500.50 })
    valor_total?: number;

    @Column()
    @ApiProperty({ example: 1 })
    quant_parcelas?: number;

    @Column()
    @ApiProperty({ example: 0 }) // Ex: 0 para pendente, 1 para pago
    status?: number;

    // @Column({ type: 'bytea', nullable: true })  codigo old do pdf
    // @ApiHideProperty()
    // arquivoPdf?: Buffer; //[cite: 3]

    // Remova a coluna antiga de buffer/blob e adicione esta:
    @Column({ name: 'url_pdf', type: 'varchar', nullable: true })
    @ApiHideProperty()
    arquivoPdf?: string;
    
    // Relacionamento: Muitas notas pertencem a uma única Obra
    @ApiHideProperty()
    @ManyToOne(() => Obras, (obra) => obra.notas)
    obra?: Obras;

    // Relacionamento: Uma nota pode passar por várias aprovações/histórico
    @ApiHideProperty()
    @OneToMany(() => APROVACOES, (aprovacao) => aprovacao.nota)
    aprovacoes?: APROVACOES[];

    link_pdf?: string | null;
}

