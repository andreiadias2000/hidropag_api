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
import { Notas } from '../../notas-fiscais/entities/notas-fiscais.entity';

export enum TipoPessoa {
  PF = 'PF',
  PJ = 'PJ',
}

@Entity({ name: 'FORNECEDORES', schema: 'public' })
export class Fornecedor {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Identificador único do fornecedor (UUID)' })
  id!: string;

  @Column({ type: 'enum', enum: TipoPessoa, default: TipoPessoa.PJ })
  @ApiProperty({ enum: TipoPessoa, description: 'PF ou PJ' })
  tipo_pessoa!: TipoPessoa;

  // --- PESSOA JURÍDICA ---
  @Column({ type: 'varchar', nullable: true })
  @ApiPropertyOptional({ example: 'Materiais de Construção Silva LTDA', description: 'Razão Social do fornecedor' })
  razao_social?: string;

  @Column({ type: 'varchar', length: 14, unique: true, nullable: true })
  @ApiPropertyOptional({ example: '12345678000190', description: 'CNPJ (somente números)' })
  cnpj?: string;

  // --- PESSOA FÍSICA ---
  @Column({ type: 'varchar', nullable: true })
  @ApiPropertyOptional({ example: 'Carlos Alberto', description: 'Nome completo do fornecedor' })
  nome?: string;

  @Column({ type: 'varchar', length: 11, unique: true, nullable: true })
  @ApiPropertyOptional({ example: '12345678900', description: 'CPF (somente números)' })
  cpf?: string;

  // --- COMUM ---
  @Column({ type: 'varchar', nullable: true })
  @ApiPropertyOptional({ example: 'contato@silva.com.br', description: 'E-mail de contato' })
  email?: string;

  @Transform(({ value }) => (value ? value.replace(/\D/g, '') : value)) // Remove tudo que não for número
  @IsString()
  @Length(11, 11, { message: 'O telefone deve conter exatamente 11 dígitos (com DDD e o 9º dígito).' })
  @Column({ type: 'varchar', length: 20, nullable: true })
  @ApiPropertyOptional({ example: '51999998888', description: 'Telefone (somente números)' })
  telefone?: string;

  @Column({ type: 'varchar', nullable: true })
  @ApiPropertyOptional({ example: 'Av. Industrial, 456', description: 'Endereço' })
  endereco?: string;

  @Column({ type: 'varchar', nullable: true })
  @ApiPropertyOptional({ example: 'Galpão B', description: 'Complemento' })
  complemento?: string;

  @Column({ type: 'boolean', default: true })
  ativo!: boolean;

  @Column({ type: 'integer', nullable: true })
  @ApiPropertyOptional({ example: 4567, description: 'Código do sistema Elevor' })
  codigo_elevor?: number;

  @OneToMany(() => Notas, (nota) => nota.fornecedor)
  @Exclude()
  notas?: Notas[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  @Exclude()
  deletedAt?: Date;
}