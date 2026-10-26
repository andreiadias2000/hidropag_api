import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fornecedor } from './entities/fornecedor.entity';
import { CreateFornecedorDto } from './dto/create-fornecedor.dto';
import { UpdateFornecedorDto } from './dto/update-fornecedor.dto';

@Injectable()
export class FornecedorService {
  constructor(
    @InjectRepository(Fornecedor)
    private readonly fornecedorRepository: Repository<Fornecedor>,
  ) {}

  async create(createFornecedorDto: CreateFornecedorDto): Promise<Fornecedor> {
    const fornecedor = this.fornecedorRepository.create(createFornecedorDto);
    return await this.fornecedorRepository.save(fornecedor);
  }

  async findAll(): Promise<Fornecedor[]> {
    return await this.fornecedorRepository.find({
      relations: ['notas'], // Traz as notas vinculadas, se necessário
    });
  }

  async findOne(id: string): Promise<Fornecedor> {
    const fornecedor = await this.fornecedorRepository.findOne({
      where: { id },
      relations: ['notas'],
    });

    if (!fornecedor) {
      throw new NotFoundException(`Fornecedor com ID ${id} não encontrado.`);
    }

    return fornecedor;
  }

  async update(id: string, updateFornecedorDto: UpdateFornecedorDto): Promise<Fornecedor> {
    const fornecedor = await this.findOne(id);
    this.fornecedorRepository.merge(fornecedor, updateFornecedorDto);
    return await this.fornecedorRepository.save(fornecedor);
  }

  async remove(id: string): Promise<void> {
    const fornecedor = await this.findOne(id);
    // Utiliza o Soft Delete configurado na entidade (coluna deletedAt)
    await this.fornecedorRepository.softRemove(fornecedor);
  }
}