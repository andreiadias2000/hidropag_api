import { Column, Entity, PrimaryGeneratedColumn,OneToMany, ManyToOne } from "typeorm";
import { Filiais } from "../../filiais/entities/filiais.entity";
import { Notas } from "../../notas-fiscais/entities/notas-fiscais.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity('OBRAS')
export class Obras {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID único da obra' })
    id?: string;

    @Column()
    @ApiProperty({ example: 'Residencial Melnik Porto Alegre', description: 'Nome da Obra' })
    nome_obra?: string;

    @ManyToOne(() => Filiais, (filial) => filial.obras)
    @ApiProperty({ type: () => Filiais, description: 'Filial a qual a obra pertence' })
    filial?: Filiais;

    @OneToMany(() => Notas, (nota) => nota.obra)
    notas?: Notas[];
}