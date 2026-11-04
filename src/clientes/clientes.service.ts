import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clientesRepository: Repository<Cliente>,
  ) {}

  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    const cliente = this.clientesRepository.create(createClienteDto);
    return await this.clientesRepository.save(cliente);
  }

  async findAll() {
    return await this.clientesRepository.find({
      withDeleted: true, // Permite carregar registros mesmo com deleted_at preenchido
      order: { razao_social: 'ASC' }
    });
  }

  async findOne(id: string): Promise<Cliente> {
    const cliente = await this.clientesRepository.findOne({
      where: { id },
      relations: ['obras'],
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado.`);
    }

    return cliente;
  }

  async update(id: string, updateClienteDto: UpdateClienteDto): Promise<Cliente> {
    const cliente = await this.findOne(id);
    this.clientesRepository.merge(cliente, updateClienteDto);
    return await this.clientesRepository.save(cliente);
  }

  async remove(id: string): Promise<void> {
    const cliente = await this.findOne(id);
    await this.clientesRepository.softRemove(cliente);
  }
}