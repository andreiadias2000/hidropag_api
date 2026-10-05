import { Obras } from "../../obras-empreendimentos/entities/obras-empreendimento.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'CLIENTES', schema: 'public' })
export class Cliente {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'varchar', nullable: false })
  nome_razao_social?: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  cnpj_cpf?: string;

  @Column({ type: 'varchar', nullable: true })
  email?: string;

  @Column({ type: 'varchar', nullable: true })
  telefone?: string;

  @Column({ type: 'boolean', default: true })
  ativo?: boolean;

//   // Relacionamento 1:N (Um cliente possui várias obras)
  @OneToMany(() => Obras, (obra) => obra.cliente)
  obras?: Obras[];

    


  // Controle de auditoria e Soft Delete (Exclusão Lógica)
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt?: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}

