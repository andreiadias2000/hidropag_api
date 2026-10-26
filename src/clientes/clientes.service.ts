import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Cliente, TipoPessoa } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    // 1. Validação de duplicidade de CPF (Apenas se for Pessoa Física)
    if (createClienteDto.tipo_pessoa === TipoPessoa.PF && createClienteDto.cpf) {
      const existe = await this.clienteRepository.findOne({ where: { cpf: createClienteDto.cpf } });
      if (existe) {
        throw new BadRequestException(`Já existe um cliente cadastrado com o CPF "${createClienteDto.cpf}".`);
      }
    }

    // 2. Validação de duplicidade de CNPJ (Apenas se for Pessoa Jurídica)
    if (createClienteDto.tipo_pessoa === TipoPessoa.PJ && createClienteDto.cnpj) {
      const existe = await this.clienteRepository.findOne({ where: { cnpj: createClienteDto.cnpj } });
      if (existe) {
        throw new BadRequestException(`Já existe um cliente cadastrado com o CNPJ "${createClienteDto.cnpj}".`);
      }
    }

    // 3. Cria a entidade e salva no banco de dados
    const novoCliente = this.clienteRepository.create(createClienteDto);
    return await this.clienteRepository.save(novoCliente);
  }

  async findAll(): Promise<Cliente[]> {
    return await this.clienteRepository.find({
      order: { createdAt: 'DESC' }, 
    });
  }

  async findOne(id: string): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOne({ where: { id } });
    
    if (!cliente) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado.`);
    }
    
    return cliente;
  }

  async update(id: string, updateClienteDto: UpdateClienteDto): Promise<Cliente> {
    const cliente = await this.findOne(id);

    // Validação de duplicidade na edição de CPF
    if (updateClienteDto.cpf && updateClienteDto.cpf !== cliente.cpf) {
      const existe = await this.clienteRepository.findOne({ 
        where: { cpf: updateClienteDto.cpf, id: Not(id) } 
      });
      if (existe) {
        throw new BadRequestException(`O CPF "${updateClienteDto.cpf}" já está em uso por outro cliente.`);
      }
    }

    // Validação de duplicidade na edição de CNPJ
    if (updateClienteDto.cnpj && updateClienteDto.cnpj !== cliente.cnpj) {
      const existe = await this.clienteRepository.findOne({ 
        where: { cnpj: updateClienteDto.cnpj, id: Not(id) } 
      });
      if (existe) {
        throw new BadRequestException(`O CNPJ "${updateClienteDto.cnpj}" já está em uso por outro cliente.`);
      }
    }

    this.clienteRepository.merge(cliente, updateClienteDto);
    return await this.clienteRepository.save(cliente);
  }

  async remove(id: string): Promise<void> {
    const cliente = await this.findOne(id);
    await this.clienteRepository.softRemove(cliente);
  }
}