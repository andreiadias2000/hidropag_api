import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Obras } from '../../obras-empreendimentos/entities/obras-empreendimento.entity';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'codigo_elevor', nullable: true })
  codigoElevor!: string;

  @Column({ name: 'nome_construtora' })
  nomeConstrutora!: string;

  @Column({ unique: true })
  cnpj!: string;

  @Column()
  endereco!: string;

  @Column()
  telefone!: string;

  @Column({ default: true })
  ativo!: boolean;

  // A relação agora aponta corretamente para a classe Obras
  @OneToMany(() => Obras, (obra) => obra.cliente)
  obras!: Obras[];
}