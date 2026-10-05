//src/obras-empreendimentos/obras-empreendimentos.ts


import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Filiais } from "../../filiais/entities/filiais.entity";
import { Notas } from "../../notas-fiscais/entities/notas-fiscais.entity";
import { Cliente } from "../../clientes/entities/cliente.entity"; // IMPORTANTE: Nova importação
import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";

@Entity('OBRAS')
export class Obras {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID único da obra' })
  id?: string;

  @Column({ unique: true, nullable: false }) 
  @ApiProperty({ example: 'Hospital Moinhos de Vento', description: 'Nome único da Obra' })
  nome_obra!: string;

  @Column({ default: true })
  @ApiProperty({ example: true, description: 'Indica se a obra está ativa ou já foi concluída/arquivada' })
  ativo!: boolean;

  // NOVO: Orçamento Previsto sugerido na reunião
  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  @ApiProperty({ example: 150000.00, description: 'Orçamento total previsto para a obra' })
  orcamento_previsto!: number;

  // NOVO: Custo Acumulado (será atualizado quando notas fiscais forem aprovadas)
  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  @ApiProperty({ example: 25000.50, description: 'Custo acumulado das notas fiscais aprovadas' })
  custo_acumulado!: number;
  
  @ManyToOne(() => Filiais, (filial) => filial.obras, { nullable: false })
  @JoinColumn({ name: 'filialId' }) 
  @ApiProperty({ type: () => Filiais, description: 'Filial a qual a obra pertence' })
  filial!: Filiais; 

  // NOVO: Vínculo com a Construtora (Cliente) sugerido na reunião
  @ManyToOne(() => Cliente, (cliente) => cliente.obras, { nullable: false })
  @JoinColumn({ name: 'clienteId' })
  @ApiProperty({ type: () => Cliente, description: 'Construtora (Cliente) dona da obra' })
  cliente!: Cliente;

  @Exclude()
  @OneToMany(() => Notas, (nota) => nota.obra)
  notas?: Notas[];
}

// import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from "typeorm";
// import { Filiais } from "../../filiais/entities/filiais.entity";
// import { Notas } from "../../notas-fiscais/entities/notas-fiscais.entity";
// import { ApiProperty } from "@nestjs/swagger";
// import { Exclude } from "class-transformer";

// @Entity('OBRAS')
// export class Obras {
//   @PrimaryGeneratedColumn('uuid')
//   @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID único da obra' })
//   id?: string;

//   // adicionado o unique e nullable
//   @Column({ unique: true, nullable: false }) 
//   @ApiProperty({ example: 'Hospital Moinhos de Vento', description: 'Nome único da Obra' })
//   nome_obra!: string; // Removi o '?' pois agora é obrigatório

//   // NOVO CAMPO DE CONTROLE
//   @Column({ default: true })
//   @ApiProperty({ example: true, description: 'Indica se a obra está ativa ou já foi concluída/arquivada' })
//   ativo!: boolean;
  
//   // pra garantir que a obra sempre tenha uma filial vinculada 
//   @ManyToOne(() => Filiais, (filial) => filial.obras, { nullable: false })
//   @JoinColumn({ name: 'filialId' }) // Define o nome da coluna de união no banco
//   @ApiProperty({ type: () => Filiais, description: 'Filial a qual a obra pertence' })
//   filial!: Filiais; // Removi o '?' pois agora é obrigatório

//   @Exclude()
//   @OneToMany(() => Notas, (nota) => nota.obra)
//   notas?: Notas[];
// }


// import { Column, Entity, PrimaryGeneratedColumn,OneToMany, ManyToOne } from "typeorm";
// import { Filiais } from "../../filiais/entities/filiais.entity";
// import { Notas } from "../../notas-fiscais/entities/notas-fiscais.entity";
// import { ApiProperty } from "@nestjs/swagger";

// @Entity('OBRAS')
// export class Obras {
//     @PrimaryGeneratedColumn('uuid')
//     @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID único da obra' })
//     id?: string;

//     @Column()
//     @ApiProperty({ example: 'Residencial Melnik Porto Alegre', description: 'Nome da Obra' })
//     nome_obra?: string;

//     @ManyToOne(() => Filiais, (filial) => filial.obras)
//     @ApiProperty({ type: () => Filiais, description: 'Filial a qual a obra pertence' })
//     filial?: Filiais;

//     @OneToMany(() => Notas, (nota) => nota.obra)
//     notas?: Notas[];
// }
