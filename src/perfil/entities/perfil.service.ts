// src/perfil/perfil.service.ts

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
import { Perfil } from './perfil.entity';
import { Repository, Not } from 'typeorm';


@Injectable()
export class PerfisService {
  constructor(
    @InjectRepository(Perfil)
    private readonly repository: Repository<Perfil>,
  ) {}

  async criar(nome: string, descricao?: string): Promise<Perfil> {
    const existe = await this.repository.findOne({ where: { nome } });
    if (existe) {
      throw new BadRequestException('Este perfil já existe.');
    }
    const novoPerfil = this.repository.create({ nome, descricao });
    return await this.repository.save(novoPerfil);
  }

  async listar(): Promise<Perfil[]> {
    return await this.repository.find({
      where: { nome: Not('root') },
      order: { id: 'ASC' },
    });
  }

  async buscarPorId(id: number): Promise<Perfil> {
    const perfil = await this.repository.findOne({ where: { id } });
    if (!perfil) {
      throw new NotFoundException(`Perfil com ID ${id} não encontrado`);
    }
    return perfil;
  }

  async buscarPorNome(nome: string): Promise<Perfil> {
    const perfil = await this.repository.findOne({ where: { nome } });
    if (!perfil) {
      throw new NotFoundException(`Perfil "${nome}" não encontrado`);
    }
    return perfil;
  }
}