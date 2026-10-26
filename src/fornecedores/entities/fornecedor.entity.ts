// src/fornecedores/entities/fornecedor.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, }
from 'typeorm'; import { ApiProperty } from '@nestjs/swagger'; 
import { Notas } from '../../notas-fiscais/entities/notas-fiscais.entity';

@Entity({ name: 'FORNECEDORES', schema: 'public' })
export class Fornecedor {
@PrimaryGeneratedColumn('uuid') 
@ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID único do fornecedor' }) 
id!: string;

@Column({ type: 'varchar', nullable: false }) 
@ApiProperty({ example: 'Materiais de Construção Silva LTDA', description: 'Razão Social ou Nome do Fornecedor' }) 
razao_social!: string;

@Column({ type: 'varchar', unique: true, nullable: true }) 
@ApiProperty({ example: '12.345.678/0001-90', description: 'CNPJ ou CPF único do fornecedor', required: false }) 
cnpj_cpf?: string;

@Column({ type: 'varchar', nullable: true }) 
@ApiProperty({ example: 'contato@fornecedorsilva.com.br', description: 'E-mail principal', required: false }) 
email?: string;

@Column({ type: 'varchar', nullable: true }) 
@ApiProperty({ example: '(51) 99999-8888', description: 'Telefone de contato', required: false }) 
telefone?: string;

@Column({ type: 'boolean', default: true }) 
@ApiProperty({ example: true, description: 'Indica se o fornecedor está ativo' }) 
ativo!: boolean;

// --- RELACIONAMENTO: Um Fornecedor possui várias Notas Fiscais --- 
@OneToMany(() => Notas, (nota) => nota.fornecedor) notas?: Notas[];

// --- CONTROLE DE AUDITORIA E SOFT DELETE --- 
@CreateDateColumn({ type: 'timestamp', name: 'created_at' }) createdAt!: Date;

@UpdateDateColumn({ type: 'timestamp', name: 'updated_at' }) updatedAt!: Date;

@DeleteDateColumn({ type: 'timestamp', name: 'deleted_at', nullable: true }) deletedAt?: Date; }