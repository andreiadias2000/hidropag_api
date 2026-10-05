// src/clientes/clientes.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly repository: Repository<Cliente>,
  ) {}

  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    // 1. Se informou CNPJ/CPF, valida se já existe outro cliente com o mesmo documento
    if (createClienteDto.cnpj_cpf) {
      const documentoExiste = await this.repository.findOne({
        where: { cnpj_cpf: createClienteDto.cnpj_cpf },
      });

      if (documentoExiste) {
        throw new BadRequestException(
          `Já existe um cliente cadastrado com o CNPJ/CPF "${createClienteDto.cnpj_cpf}".`,
        );
      }
    }

    // 2. Cria a instância e salva no banco
    const novoCliente = this.repository.create(createClienteDto);
    return await this.repository.save(novoCliente);
  }

  async findAll(): Promise<Cliente[]> {
    return await this.repository.find({
      relations: ['obras'], // Traz as obras vinculadas ao cliente se necessário
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Cliente> {
    const cliente = await this.repository.findOne({
      where: { id },
      relations: ['obras'],
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente com ID "${id}" não encontrado.`);
    }

    return cliente;
  }

  async update(id: string, updateClienteDto: UpdateClienteDto): Promise<Cliente> {
    const cliente = await this.findOne(id);

    // Se estiver atualizando o documento, garante que outro cliente não esteja usando
    if (
      updateClienteDto.cnpj_cpf &&
      updateClienteDto.cnpj_cpf !== cliente.cnpj_cpf
    ) {
      const documentoDuplicado = await this.repository.findOne({
        where: { cnpj_cpf: updateClienteDto.cnpj_cpf, id: Not(id) },
      });

      if (documentoDuplicado) {
        throw new BadRequestException(
          `O documento "${updateClienteDto.cnpj_cpf}" já está em uso por outro cliente.`,
        );
      }
    }

    Object.assign(cliente, updateClienteDto);
    return await this.repository.save(cliente);
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.findOne(id);

    // Realiza o soft delete preenchendo a coluna deleted_at
    await this.repository.softDelete(id);

    return { message: 'Cliente removido com sucesso.' };
  }
}