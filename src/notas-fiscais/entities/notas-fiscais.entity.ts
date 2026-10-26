//notas-fiscais,entity.ts

import { Column, Entity, PrimaryGeneratedColumn,ManyToOne,OneToMany, JoinColumn } from "typeorm";
import { APROVACOES } from "../../aprovaçoes/entities/aprovaçoe.entity";
import { Obras } from "../../obras-empreendimentos/entities/obras-empreendimento.entity";
import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Fornecedor } from "../../fornecedores/entities/fornecedor.entity";

@Entity('NOTAS')
export class Notas {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID único da nota' })
    id?: string;

    @Column({ default: false }) // Por padrão, nasce sem anexo
    @ApiProperty({ example: true, description: 'Indica se a nota possui um PDF anexado' })
    tem_anexo?: boolean;

    @Column()
    @ApiProperty({ example: 1010, description: 'Número da Nota Fiscal' })
    numero_nf?: number;

    
    @Column({type: 'date'})
    @ApiProperty({ example: '2026-05-20',description: 'Data de vencimento' })
    data_vencimento?: string;

    @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
    @ApiProperty({ example: 1500.50, description: 'Valor total da nota' })
    valor_total?: number;

    @Column({ type: 'integer', default: 1 })
    @ApiProperty({ example: 1, description: 'Quantidade de parcelas' })
    quant_parcelas?: number;

    @Column({ type: 'integer', default: 0 })
    @ApiProperty({ example: 0,description: 'Status (0: Pendente, 1: Aprovada, 2: Recusada)' }) // Ex: 0 para pendente, 1 para pago
    status?: number;

        
    @Column({ name: 'url_pdf', type: 'varchar', nullable: true })
    @ApiProperty({ example: 'https://exemplo.com/arquivo.pdf', description: 'URL do PDF anexado' })
    arquivoPdf?: string;

    // --- REFATORAÇÃO: FORNECEDOR (Substituiu o antigo texto simples) ---
    @Column({ type: 'uuid', nullable: true })
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001', description: 'ID do Fornecedor' })
    fornecedorId?: string;

    @ManyToOne(() => Fornecedor, (fornecedor) => fornecedor.notas, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'fornecedorId' })
    @ApiProperty({ type: () => Fornecedor, description: 'Fornecedor emissor da nota fiscal' })
    fornecedor?: Fornecedor;

    
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

