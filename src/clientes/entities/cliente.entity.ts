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
// Importa a classe Obras (ajuste o nome do arquivo se for 'obra.entity' ou 'obras-empreendimento.entity')
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

  // --- PESSOA JURÍDICA --------------------------------------------
  @Column({ type: 'varchar', nullable: true })
  @ApiPropertyOptional({ example: 'Materiais de Construção Silva LTDA', description: 'Razão Social do cliente' })
  razao_social?: string | null;

  @Column({
    type: 'varchar',
    length: 14,
    unique: true,
    nullable: true,
    transformer: {
      to: (value?: string | null) => {
        if (!value) return null;
        const limpo = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        return limpo.length > 0 ? limpo : null;
      },
      from: (value?: string | null) => value,
    },
  })
  @ApiPropertyOptional({
    example: '12ABC678000190',
    description: 'CNPJ alfanumérico sem pontuação',
  })
  cnpj?: string | null;

  // --- PESSOA FÍSICA --------------------------------
  @Column({ type: 'varchar', nullable: true })
  @ApiPropertyOptional({ example: 'Carlos Alberto', description: 'Nome completo do cliente' })
  nome?: string | null;

  @Column({
    type: 'varchar',
    length: 11,
    unique: true,
    nullable: true,
    transformer: {
      to: (value?: string | null) => {
        if (!value) return null;
        const limpo = value.replace(/\D/g, '');
        return limpo.length > 0 ? limpo : null;
      },
      from: (value?: string | null) => value,
    },
  })
  @ApiPropertyOptional({ example: '12345678900', description: 'CPF (somente números)' })
  cpf?: string | null;

  // --- COMUM ---------------------------------------------
  @Column({ type: 'varchar', nullable: true })
  @ApiPropertyOptional({ example: 'contato@silva.com.br', description: 'E-mail de contato' })
  email?: string;

  @Column({ type: 'varchar', length: 11, nullable: true })
  @ApiPropertyOptional({ example: '51999998888', description: 'Telefone (somente números)' })
  telefone?: string;

  // --- ENDEREÇO COMPLETO -------------------------------------------
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
  @ApiPropertyOptional({ example: 'Sala 402', description: 'Complemento do endereço' })
  complemento?: string;

  @Column({ type: 'varchar', nullable: true })
  @ApiPropertyOptional({ example: 'Av. Industrial, 456', description: 'Endereço' })
  endereco?: string;

  // -----------------------------------------------------------------
  @Column({ type: 'boolean', default: true })
  ativo!: boolean;

  @Column({ type: 'integer', nullable: true })
  @ApiPropertyOptional({ example: 4567, description: 'Código do sistema Elevor' })
  codigo_elevor?: number;

  // 1 Cliente -> N Obras (conecta com @ManyToOne em Obras)
  @OneToMany(() => Obras, (obra) => obra.cliente)
  obras?: Obras[];

  // 1 Cliente -> N Notas
  @OneToMany(() => Notas, (nota) => (nota as any).cliente)
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