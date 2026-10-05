// src/obras-empreendimentos/entities/obra.entity.ts

import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

import { Filiais } from '../../filiais/entities/filiais.entity';
import { Notas } from '../../notas-fiscais/entities/notas-fiscais.entity';
import { Cliente } from '../../clientes/entities/cliente.entity';

@Entity('OBRAS')
export class Obras {
  // ---------------------------------------------------------------------------
  // 1. IDENTIFICAÇÃO E CHAVE PRIMÁRIA
  // ---------------------------------------------------------------------------
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Identificador único da obra (UUID v4)',
  })
  id!: string;

  // ---------------------------------------------------------------------------
  // 2. DADOS PRINCIPAIS E CADASTRAIS
  // ---------------------------------------------------------------------------
  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  @ApiProperty({
    example: 'Hospital Moinhos de Vento',
    description: 'Nome único da obra',
  })
  nome_obra!: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  @ApiProperty({
    example: '12.345.67890/12',
    description: 'CNO - Cadastro Nacional de Obras',
    required: false,
  })
  cno?: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    example: 'Rua Ramiro Barcelos, 910 - Porto Alegre/RS',
    description: 'Endereço e localização da obra',
    required: false,
  })
  endereco_localizacao?: string;

  // ---------------------------------------------------------------------------
  // 3. CAMPOS FINANCEIROS E DE STATUS
  // ---------------------------------------------------------------------------
  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  @ApiProperty({
    example: 150000.0,
    description: 'Valor orçado/previsto para a obra',
  })
  valor_previsto!: number;

  @Column({ type: 'smallint', default: 1 })
  @ApiProperty({
    example: 1,
    description: 'Status: 1 (Em Andamento), 2 (Pausada), 3 (Finalizada)',
  })
  status!: number;

  @Column({ type: 'boolean', default: true })
  @ApiProperty({
    example: true,
    description: 'Indica se o registro da obra está ativo',
  })
  ativo!: boolean;

  // ---------------------------------------------------------------------------
  // 4. RELACIONAMENTOS (CHAVES ESTRANGEIRAS)
  // ---------------------------------------------------------------------------

  // Filial (Obrigatório: Toda obra pertence a uma filial)
  @Column({ type: 'uuid' })
  filialId!: string;

  @ManyToOne(() => Filiais, (filial) => filial.obras, { nullable: false })
  @JoinColumn({ name: 'filialId' })
  @ApiProperty({
    type: () => Filiais,
    description: 'Filial responsável pela obra',
  })
  filial!: Filiais;

  // Cliente (Opcional: 1 Cliente -> N Obras)
  @Column({ type: 'uuid', nullable: true })
  clienteId?: string;

  @ManyToOne(() => Cliente, (cliente) => cliente.obras, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'clienteId' })
  @ApiProperty({
    type: () => Cliente,
    description: 'Cliente proprietário da obra',
    required: false,
  })
  cliente?: Cliente;

  // Notas Fiscais (1 Obra -> N Notas)
  @OneToMany(() => Notas, (nota) => nota.obra)
  @Exclude()
  notas?: Notas[];

  // ---------------------------------------------------------------------------
  // 5. AUDITORIA E SOFT DELETE
  // ---------------------------------------------------------------------------
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  @Exclude()
  deletedAt?: Date;
}