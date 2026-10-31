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

  @Column({ type: 'enum', enum: TipoPessoa, default: TipoPessoa.PJ })
  @ApiProperty({ enum: TipoPessoa, description: 'PF ou PJ' })
  tipo_pessoa!: TipoPessoa;

  // --- PESSOA JURÍDICA ---
  @Column({ type: 'varchar', nullable: true })
  @ApiProperty({ example: 'Construtora Sul Ltda', description: 'Razão Social do cliente' })
  razao_social?: string;

  @Column({ type: 'varchar', length: 14, unique: true, nullable: true })
  @ApiProperty({ example: '12345678000190', description: 'CNPJ (somente números)' })
  cnpj?: string;

  // --- PESSOA FÍSICA ---
  @Column({ type: 'varchar', nullable: true })
  @ApiProperty({ example: 'João da Silva', description: 'Nome completo do cliente' })
  nome?: string;

  @Column({ type: 'varchar', length: 11, unique: true, nullable: true })
  @ApiPropertyOptional({ example: '12345678900', description: 'CPF (somente números)' })
  cpf?: string;

  // --- COMUM ---
  @Column({ type: 'varchar', nullable: true })
  @ApiPropertyOptional({ example: 'contato@construtorasul.com.br', description: 'E-mail de contato' })
  email?: string;

  @Column({ type: 'varchar', length: 11, nullable: true })
  @ApiPropertyOptional({ example: '51987654321', description: 'Telefone com DDD (somente números)' })
  telefone?: string;

  // --- ENDEREÇO COMPLETO ---
  @Column({ type: 'varchar', length: 8, nullable: true })
  @ApiPropertyOptional({ example: '90000000', description: 'CEP (somente números)' })
  cep?: string;

  @Column({ type: 'varchar', nullable: true })
  @ApiPropertyOptional({ example: 'Cristo Redentor', description: 'Bairro' })
  bairro?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  @ApiPropertyOptional({ example: '1500', description: 'Número do imóvel' })
  numero?: string;

  @Column({ type: 'varchar', nullable: true })
  @ApiPropertyOptional({ example: 'Porto Alegre', description: 'Cidade' })
  cidade?: string;

  @Column({ type: 'varchar', length: 2, nullable: true })
  @ApiPropertyOptional({ example: 'RS', description: 'Estado (UF)' })
  estado?: string;

  @Column({ type: 'varchar', nullable: true })
  @ApiPropertyOptional({ example: 'Apto 201', description: 'Complemento do endereço' })
  complemento?: string;

  @Column({ type: 'varchar', nullable: true })
  @ApiPropertyOptional({ example: 'Rua das Flores, 123', description: 'Logradouro / Endereço' })
  endereco?: string;

  // --- SISTEMA ---
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