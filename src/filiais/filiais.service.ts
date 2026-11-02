//src/filiais/filiais.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Filiais } from './entities/filiais.entity';
import { CreateFilialDto } from './dto/create-filiais.dto';
import { UpdateFilialDto } from './dto/update-filiais.dto';

@Injectable()
export class FiliaisService {
  constructor(
    @InjectRepository(Filiais)
    private readonly repository: Repository<Filiais>,
  ) {}

  async inserir(dados: CreateFilialDto): Promise<Filiais> {
    // 1. Busca se o nome já existe no banco (incluindo as inativas/deletadas com withDeleted: true)
    const existe = await this.repository.findOne({
      where: { nome: dados.nome },
      withDeleted: true, // 👈 Garante que não duplica nem se o nome pertencer a uma filial inativa
    });

    // 2. Se encontrar, barra na hora com erro 400
    if (existe) {
      throw new BadRequestException(`A filial com o nome "${dados.nome}" já está cadastrada.`);
    }

    // 3. Se o nome for novo, cria e salva tranquilamente
    const novaFilial = this.repository.create(dados);
    return await this.repository.save(novaFilial);
  }

  async listar(): Promise<Filiais[]> {
    return await this.repository.find({
      relations: ['obras', 'usuarios'],
      withDeleted: true, // 👈 Força o TypeORM a trazer tanto as ativas quanto as inativas/deletadas
    });
  }

  async buscarPorId(id: string): Promise<Filiais> {
    const filial = await this.repository.findOne({
      where: { id: id as any },
      relations: ['obras', 'usuarios'],
      withDeleted: true, // 👈 Permite buscar uma filial específica mesmo se ela estiver inativa/deletada
    });

    if (!filial) {
      throw new NotFoundException(`Filial com ID ${id} não encontrada`);
    }
    return filial;
  }

  async alterar(id: string, dados: UpdateFilialDto): Promise<void> {
  const filial = await this.buscarPorId(id); // Já busca com withDeleted: true

  // Se o usuário mandou deletedAt como null, garantimos que o TypeORM limpe a data no banco
  if (dados.deletedAt === null) {
    await this.repository.restore(id); // O TypeORM tem um método nativo .restore() para limpar o deletedAt!
  }

  // Atualiza os demais campos se houverem
  await this.repository.update(id, dados);
}

  async excluir(id: string): Promise<void> {
    const filial = await this.buscarPorId(id);

    const totalObras = await this.repository.manager.count('Obras', {
      where: { filial: { id } }
    });

    const totalUsuarios = await this.repository.manager.count('Usuarios', {
      where: { filial: { id } }
    });

    if (totalObras > 0 || totalUsuarios > 0) {
      await this.repository.softDelete(id);
    } else {
      await this.repository.delete(id);
    }
  }
}

// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Filiais } from './entities/filiais.entity';

// @Injectable()
// export class FiliaisService {
//   constructor(
//     @InjectRepository(Filiais)
//     private readonly repository: Repository<Filiais>,
//   ) {}

//   async inserir(dados: Filiais): Promise<Filiais> {
//     return await this.repository.save(dados);
//   }

//   async listar(): Promise<Filiais[]> {
//     return await this.repository.find({
//       relations: ['obras', 'usuarios'], // Traz os vínculos da filial[cite: 9]
//     });
//   }

//   async buscarPorId(id: string): Promise<Filiais> {
//     const filial = await this.repository.findOne({
//       where: { id: id as any },
//       relations: ['obras', 'usuarios'],
//     });

//     if (!filial) {
//       throw new NotFoundException(`Filial com ID ${id} não encontrada`);
//     }
//     return filial;
//   }

//   async alterar(id: string, dados: Partial<Filiais>): Promise<void> {
//     const existe = await this.buscarPorId(id);
//     if (existe) {
//       await this.repository.update(id, dados);
//     }
//   }

//   async excluir(id: string): Promise<void> {
//     const existe = await this.buscarPorId(id);
//     if (existe) {
//       await this.repository.delete(id);
//     }
//   }
// }