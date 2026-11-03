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
    // 1. Validação de duplicidade de CPF (incluindo os deletados/inativos com withDeleted)
    if (createClienteDto.tipo_pessoa === TipoPessoa.PF && createClienteDto.cpf) {
      const existe = await this.clienteRepository.findOne({ 
        where: { cpf: createClienteDto.cpf },
        withDeleted: true 
      });
      if (existe) {
        throw new BadRequestException(`Já existe um cliente cadastrado com o CPF "${createClienteDto.cpf}".`);
      }
    }

    // 2. Validação de duplicidade de CNPJ (incluindo os deletados/inativos com withDeleted)
    if (createClienteDto.tipo_pessoa === TipoPessoa.PJ && createClienteDto.cnpj) {
      const existe = await this.clienteRepository.findOne({ 
        where: { cnpj: createClienteDto.cnpj },
        withDeleted: true 
      });
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
      withDeleted: true, // 👈 Traz tanto ativos quanto inativos (soft-deleted) para o front separar nas abas
      order: { createdAt: 'DESC' }, 
    });
  }

  async findOne(id: string): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOne({ 
      where: { id },
      withDeleted: true // 👈 Permite encontrar o cliente mesmo se estiver inativo
    });
    
    if (!cliente) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado.`);
    }
    
    return cliente;
  }

  async update(id: string, updateClienteDto: UpdateClienteDto): Promise<Cliente> {
    const cliente = await this.findOne(id);

    // Se o frontend mandou deletedAt como null, executamos o restore e removemos do DTO
    if (updateClienteDto.deletedAt === null) {
      await this.clienteRepository.restore(id);
    }
    
    // Remove o deletedAt do DTO para evitar incompatibilidade no merge/save do TypeORM
    const { deletedAt, ...dadosParaAtualizar } = updateClienteDto;

    // Validação de duplicidade na edição de CPF
    if (dadosParaAtualizar.cpf && dadosParaAtualizar.cpf !== cliente.cpf) {
      const existe = await this.clienteRepository.findOne({ 
        where: { cpf: dadosParaAtualizar.cpf, id: Not(id) },
        withDeleted: true 
      });
      if (existe) {
        throw new BadRequestException(`O CPF "${dadosParaAtualizar.cpf}" já está em uso por outro cliente.`);
      }
    }

    // Validação de duplicidade na edição de CNPJ
    if (dadosParaAtualizar.cnpj && dadosParaAtualizar.cnpj !== cliente.cnpj) {
      const existe = await this.clienteRepository.findOne({ 
        where: { cnpj: dadosParaAtualizar.cnpj, id: Not(id) },
        withDeleted: true 
      });
      if (existe) {
        throw new BadRequestException(`O CNPJ "${dadosParaAtualizar.cnpj}" já está em uso por outro cliente.`);
      }
    }

    this.clienteRepository.merge(cliente, dadosParaAtualizar);
    return await this.clienteRepository.save(cliente);
  }

  async remove(id: string): Promise<void> {
    const cliente = await this.findOne(id);
    // Executa o softRemove que preenche o campo deleted_at e atualiza o status se necessário
    await this.clienteRepository.softRemove(cliente);
  }
}