// src/clientes/entities/cliente.entity.ts

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

@Entity({ name: 'CLIENTES', schema: 'public' })
export class Cliente {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: '6b5e1a32-159f-43b4-a212-32a24bc91001',
    description: 'Identificador único do cliente (UUID)',
  })
  id!: string;

  @Column({ type: 'varchar', nullable: false })
  @ApiProperty({
    example: 'Construtora Sul Ltda',
    description: 'Nome ou Razão Social do cliente',
  })
  nome_razao_social!: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  @ApiPropertyOptional({
    example: '12.345.678/0001-90',
    description: 'CNPJ ou CPF do cliente',
  })
  cnpj_cpf?: string;

  @Column({ type: 'varchar', nullable: true })
  @ApiPropertyOptional({
    example: 'contato@construtorasul.com.br',
    description: 'E-mail do cliente',
  })
  email?: string;

  @Column({ type: 'varchar', nullable: true })
  @ApiPropertyOptional({
    example: '(51) 98765-4321',
    description: 'Telefone de contato',
  })
  telefone?: string;

  @Column({ type: 'boolean', default: true })
  @ApiProperty({
    example: true,
    description: 'Status ativo/inativo',
    default: true,
  })
  ativo!: boolean;

  @Column({ type: 'integer', nullable: true })
  @ApiPropertyOptional({
    example: 1042,
    description: 'Código de integração no sistema Elevor',
  })
  codigo_elevor?: number;

  @OneToMany(() => Obras, (obra) => obra.cliente)
  @Exclude()
  obras?: Obras[];

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty({ description: 'Data de criação do registro' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty({ description: 'Data da última alteração do registro' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  @Exclude()
  deletedAt?: Date;
}