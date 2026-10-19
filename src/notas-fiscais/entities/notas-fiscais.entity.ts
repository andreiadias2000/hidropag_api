//src/notas-fiscais/entities/notas-fiscais.entity.ts

import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional, ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

// Verifique se o caminho da pasta tem cedilha 'ç' no seu projeto. 
// Recomendo evitar caracteres especiais em pastas num futuro refatoramento.

import { APROVACOES } from '../../aprovaçoes/entities/aprovaçoe.entity';
import { Obras } from '../../obras-empreendimentos/entities/obras-empreendimento.entity';

// Utilitário para converter decimais da base de dados (string) para número no TypeScript
const decimalTransformer = {
  to: (value: number) => value,
  from: (value: string) => parseFloat(value),
};

// Enumeração de status baseada no fluxo discutido
export enum StatusNota {
  PENDENTE = 0,
  APROVADA = 1,
  REPROVADA = 2,
  DEVOLVIDA_PARA_EXPLICACAO = 3,
}

@Entity('NOTAS', { schema: 'public' })
export class Notas {
  // ---------------------------------------------------------------------------
  // 1. IDENTIFICAÇÃO E CHAVE PRIMÁRIA
  // ---------------------------------------------------------------------------
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Identificador único da nota fiscal (UUID)' })
  id!: string;

  // ---------------------------------------------------------------------------
  // 2. DADOS PRINCIPAIS
  // ---------------------------------------------------------------------------

  @Column({ type: 'varchar', length: 50, nullable: true })
  @ApiPropertyOptional({ example: '1010', description: 'Número da Nota Fiscal' })
  numero_nf?: string; // varchar previne que números iniciados com zero sejam corrompidos

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiPropertyOptional({ example: 'Construtora Sul Ltda', description: 'Nome do Fornecedor' })
  fornecedor?: string;

  @Column({ type: 'date', nullable: true })
  @ApiPropertyOptional({ example: '2026-05-20', description: 'Data de vencimento da nota' })
  data_vencimento?: string;

  @Column({ type: 'integer', default: 1 })
  @ApiProperty({ example: 1, description: 'Quantidade de parcelas' })
  quant_parcelas!: number;

  // ---------------------------------------------------------------------------
  // 3. CAMPOS FINANCEIROS E DE STATUS
  // ---------------------------------------------------------------------------

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
    transformer: decimalTransformer,
  })
  @ApiProperty({ example: 1500.50, description: 'Valor total da nota fiscal' })
  valor_total!: number;

  @Column({ type: 'smallint', default: StatusNota.PENDENTE })
  @ApiProperty({
    enum: StatusNota,
    description: '0: Pendente, 1: Aprovada, 2: Reprovada, 3: Devolvida para Explicação',
  })
  status!: StatusNota;

  // ---------------------------------------------------------------------------
  // 4. ANEXOS, OBSERVAÇÕES E PARECERES
  // ---------------------------------------------------------------------------

  @Column({ type: 'boolean', default: false })
  @ApiProperty({ example: true, description: 'Indica se a nota possui ficheiros anexados' })
  tem_anexo!: boolean;

  @Column({ type: 'varchar', nullable: true })
  @ApiHideProperty()
  url_pdf?: string;

  @Column({ type: 'varchar', nullable: true })
  @ApiHideProperty()
  url_xml?: string; // Armazena o ficheiro XML da nota

  @Column({ type: 'text', nullable: true })
  @ApiPropertyOptional({
    example: 'Tive de comprar cimento a mais porque a concretagem atrasou.',
    description: 'Justificação/Observação preenchida por quem lança a nota',
  })
  justificativa_lancamento?: string;

  @Column({ type: 'text', nullable: true })
  @ApiPropertyOptional({
    example: 'Aprovado, mas tente negociar este valor na próxima vez.',
    description: 'Parecer/Recado deixado pela diretoria ao aprovar ou devolver a nota',
  })
  parecer_aprovacao?: string;

  // ---------------------------------------------------------------------------
  // 5. RELACIONAMENTOS (CHAVES ESTRANGEIRAS)
  // ---------------------------------------------------------------------------
  @Column({ type: 'uuid', nullable: true })
  obraId?: string;

  @ManyToOne(() => Obras, (obra) => obra.notas, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'obraId' })
  @ApiHideProperty()
  obra?: Obras;

  @OneToMany(() => APROVACOES, (aprovacao) => aprovacao.nota)
  @Exclude()
  @ApiHideProperty()
  aprovacoes?: APROVACOES[];

  // ---------------------------------------------------------------------------
  // 6. AUDITORIA E SOFT DELETE
  // ---------------------------------------------------------------------------
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  @Exclude()
  deletedAt?: Date;
}

// import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
// import { APROVACOES } from "../../aprovaçoes/entities/aprovaçoe.entity";
// import { Obras } from "../../obras-empreendimentos/entities/obras-empreendimento.entity";
// import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";

// @Entity('NOTAS')
// export class Notas {
//     @PrimaryGeneratedColumn('uuid')
//     id?: string;

//     @Column({ default: false }) // Por padrão, nasce sem anexo
//     @ApiProperty({ example: true, description: 'Indica se a nota possui um PDF anexado' })
//     tem_anexo?: boolean;

//     @Column()
//     @ApiProperty({ example: 1010 })
//     numero_nf?: number;

//     @Column()
//     @ApiProperty({ example: 'Nome do Fornecedor' })
//     fornecedor?: string;

//     @Column({ type: 'date' })
//     @ApiProperty({ example: '2026-05-20' })
//     data_vencimento?: string;

//     @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
//     @ApiProperty({ example: 1500.50 })
//     valor_total?: number;

//     @Column()
//     @ApiProperty({ example: 1 })
//     quant_parcelas?: number;

//     @Column()
//     @ApiProperty({ example: 0 }) // Ex: 0 para pendente, 1 para pago
//     status?: number;

//     @Column({ name: 'url_pdf', type: 'varchar', nullable: true })
//     @ApiHideProperty()
//     arquivoPdf?: string;
    
//     // Relacionamento: Muitas notas pertencem a uma única Obra
//     @ApiHideProperty()
//     @ManyToOne(() => Obras, (obra) => obra.notas)
//     obra?: Obras;

//     // Relacionamento: Uma nota pode passar por várias aprovações/histórico
//     @ApiHideProperty()
//     @OneToMany(() => APROVACOES, (aprovacao) => aprovacao.nota)
//     aprovacoes?: APROVACOES[];

//     link_pdf?: string | null;

//     // NOVO CAMPO: Justificativa de Lançamento (Sugestão do Bruno)
//     @Column({ type: 'text', nullable: true })
//     @ApiProperty({ required: false, example: 'Divergência de valores devido a frete extra.', description: 'Justificativa para divergências de valor ou quantidade no lançamento' })
//     justificativa_lancamento?: string;
// }

