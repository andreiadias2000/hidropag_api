// src/perfis/entities/perfil.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Usuarios } from '../../usuarios/entities/usuario.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Perfil {
  
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column({ unique: true })
  @ApiProperty({ example: 'root, gestor, lancador , leitor' })
  nome?: string; // 'root', 'gestor', 'lancador', 'leitor'

  @Column({ nullable: true })
  @ApiProperty({ example: 'Acesso total ao sistema, leitor , lançador , aprovador de nota  ' })
  descricao?: string;// leitor , lançador , aprovador de nota

  @OneToMany(() => Usuarios, (usuario) => usuario.perfil)
  usuarios?: Usuarios[];
}