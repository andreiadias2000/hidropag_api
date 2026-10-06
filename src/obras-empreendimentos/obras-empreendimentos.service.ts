// src/obras-empreendimentos/obras-empreendimentos.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Obras } from './entities/obras-empreendimento.entity';
import { CreateObrasEmpreendimentoDto } from './dto/create-obras-empreendimento.dto';
import { UpdateObrasEmpreendimentoDto } from './dto/update-obras-empreendimento.dto';
import { Filiais } from '../filiais/entities/filiais.entity';
import { Cliente } from '../clientes/entities/cliente.entity';

@Injectable()
export class ObrasEmpreendimentosService {
  constructor(
    @InjectRepository(Obras)
    private readonly repository: Repository<Obras>,

    @InjectRepository(Filiais)
    private readonly filiaisRepository: Repository<Filiais>,

    @InjectRepository(Cliente)
    private readonly clientesRepository: Repository<Cliente>,
  ) {}

  async inserir(dados: CreateObrasEmpreendimentoDto): Promise<Obras> {
    // 1. Validar se a filial existe
    const filialExiste = await this.filiaisRepository.findOne({
      where: { id: dados.filialId },
    });
    if (!filialExiste) {
      throw new NotFoundException(`A filial informada (ID: ${dados.filialId}) não foi encontrada.`);
    }

    // 2. Se informou clienteId, validar se o cliente existe
    if (dados.clienteId) {
      const clienteExiste = await this.clientesRepository.findOne({
        where: { id: dados.clienteId },
      });
      if (!clienteExiste) {
        throw new NotFoundException(`O cliente informado (ID: ${dados.clienteId}) não foi encontrado.`);
      }
    }

    // 3. Validar duplicidade de nome da obra (já que nome_obra é único)
    const obraExiste = await this.repository.findOne({
      where: { nome_obra: dados.nome_obra },
    });
    if (obraExiste) {
      throw new BadRequestException(`Já existe uma obra cadastrada com o nome "${dados.nome_obra}".`);
    }

    // 4. Instanciar e persistir com os novos campos
    const novaObra = this.repository.create({
      ...dados,
      filial: filialExiste,
    });

    return await this.repository.save(novaObra);
  }

  async listar(): Promise<Obras[]> {
    return await this.repository.find({
      relations: ['filial', 'cliente', 'notas'],
      order: { createdAt: 'DESC' },
    });
  }

  async buscarPorId(id: string): Promise<Obras> {
    const obra = await this.repository.findOne({
      where: { id },
      relations: ['filial', 'cliente', 'notas'],
    });

    if (!obra) {
      throw new NotFoundException(`Obra com ID "${id}" não encontrada.`);
    }
    return obra;
  }

  async alterar(id: string, dados: UpdateObrasEmpreendimentoDto): Promise<Obras> {
    const obra = await this.buscarPorId(id);

    // Se estiver alterando o nome, checar se não colide com outra obra existente
    if (dados.nome_obra && dados.nome_obra !== obra.nome_obra) {
      const nomeDuplicado = await this.repository.findOne({
        where: { nome_obra: dados.nome_obra, id: Not(id) },
      });
      if (nomeDuplicado) {
        throw new BadRequestException(`O nome "${dados.nome_obra}" já está em uso por outra obra.`);
      }
    }

    // Se estiver alterando a filial, verificar existência
    if (dados.filialId && dados.filialId !== obra.filialId) {
      const filialExiste = await this.filiaisRepository.findOne({
        where: { id: dados.filialId },
      });
      if (!filialExiste) {
        throw new NotFoundException(`Filial ID "${dados.filialId}" não encontrada.`);
      }
    }

    // Se estiver alterando o cliente, verificar existência
    if (dados.clienteId && dados.clienteId !== obra.clienteId) {
      const clienteExiste = await this.clientesRepository.findOne({
        where: { id: dados.clienteId },
      });
      if (!clienteExiste) {
        throw new NotFoundException(`Cliente ID "${dados.clienteId}" não encontrado.`);
      }
    }

    Object.assign(obra, dados);
    return await this.repository.save(obra);
  }

  async desativar(id: string): Promise<{ message: string }> {
    const obra = await this.buscarPorId(id);
    obra.ativo = false;
    await this.repository.save(obra);
    return { message: `Obra "${obra.nome_obra}" desativada com sucesso.` };
  }

  async excluir(id: string): Promise<{ message: string }> {
    await this.buscarPorId(id);
    // Realiza o soft delete (preenche o campo deleted_at da entidade)
    await this.repository.softDelete(id);
    return { message: 'Obra removida com sucesso.' };
  }
}