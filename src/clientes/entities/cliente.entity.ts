import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Obras } from '../../obras-empreendimentos/entities/obras-empreendimento.entity';

export enum TipoPessoa {
  PF = 'PF',
  PJ = 'PJ',
}

@Entity({ name: 'CLIENTES', schema: 'public' })
export class Cliente {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Identificador único do cliente (UUID)' })
  id!: string;

  @Column({ type: 'enum', enum: TipoPessoa })
  @ApiProperty({ enum: TipoPessoa, description: 'PF ou PJ' })
  tipo_pessoa!: TipoPessoa;

  // --- PESSOA JURÍDICA ---
  @Column({ type: 'varchar', nullable: true })
  @ApiProperty({ example: 'Construtora Sul Ltda', description: 'Razão Social do cliente' })
  razao_social?: string;

  @Column({ type: 'varchar', length: 14, unique: true, nullable: true })
  @ApiProperty({ example: '12ABC34501DE67', description: 'CNPJ (sem máscara)' })
  cnpj?: string;

  // --- PESSOA FÍSICA ---
  @Column({ type: 'varchar', nullable: true })
  @ApiProperty({ example: 'João da Silva', description: 'Nome completo do cliente' })
  nome?: string;

  @Column({ type: 'varchar', length: 11, unique: true, nullable: true })
  @ApiPropertyOptional({ example: '12345678900', description: 'CPF (sem máscara)' })
  cpf?: string;

  // --- COMUM ---
  @Column({ type: 'varchar', nullable: true })
  @ApiPropertyOptional({ example: 'contato@construtorasul.com.br', description: 'E-mail de contato' })
  email?: string;

  @Column({ type: 'number', nullable: true })
  @ApiPropertyOptional({ example: '(51) 98765-4321', description: 'Telefone comercial ou celular' })
  telefone?: number;

  @Column({ type: 'varchar', nullable: true }) // Corrigido de 'string' para 'varchar'
  @ApiPropertyOptional({ example: 'Rua das Flores, 123', description: 'Endereço do cliente' })
  endereco?: string;

  @Column({ type: 'varchar', nullable: true }) // Corrigido de 'string' para 'varchar' e removido o default booleano
  @ApiPropertyOptional({ example: 'Apto 201', description: 'Complemento do endereço' })
  complemento?: string;

  @Column({ type: 'boolean', default: true })
  ativo!: boolean;

  @Column({ type: 'integer', nullable: true })
  codigo_elevor?: number;

  @OneToMany(() => Obras, (obra) => obra.cliente)
  @Exclude()
  obras?: Obras[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  @Exclude()
  deletedAt?: Date;
}