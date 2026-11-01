import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { APROVACOES } from './entities/aprovacoe.entity';
import { Notas } from '../notas-fiscais/entities/notas-fiscais.entity';
import { CreateAprovacoeDto } from './dto/create-aprovacoe.dto';
import { UpdateAprovacoeDto } from './dto/update-aprovacoe.dto';

@Injectable()
export class AprovacoesService {
  constructor(
    @InjectRepository(APROVACOES)
    private readonly repository: Repository<APROVACOES>,

    @InjectRepository(Notas)
    private readonly notaRepository: Repository<Notas>,
  ) {}

  // Buscar todas as aprovações
  async buscarTodas(): Promise<APROVACOES[]> {
    return await this.repository.find({ relations: ['nota', 'usuario'] });
  }

  // Buscar por ID
  async buscarPorId(id: string): Promise<APROVACOES> {
    const aprovacao = await this.repository.findOne({
      where: { id } as any, // Garante compatibilidade do UUID com o TypeORM
      relations: ['nota', 'usuario'],
    });

    if (!aprovacao) {
      throw new NotFoundException(`Aprovação com ID ${id} não encontrada.`);
    }

    return aprovacao;
  }

  // Salva uma nova decisão (Aprovar/Reprovar)
  async inserir(dto: CreateAprovacoeDto): Promise<APROVACOES> {
    const aprovacaoExistente = await this.repository.findOne({
      where: { nota: { id: dto.nota } } as any
    });

    if (aprovacaoExistente) {
      throw new ConflictException(`A nota fiscal com ID ${dto.nota} já foi avaliada e possui uma aprovação registrada.`);
    }

    const novaAprovacao = this.repository.create({
      decisao: dto.decisao,
      observacao: dto.observacao,
      nota: { id: dto.nota },
      usuario: { id: dto.usuario }
    } as any);

    // 🛠️ Adicionado 'as any' para garantir que o save retorne o tipo correto da entidade
    const aprovacaoSalva = await this.repository.save(novaAprovacao) as any;

    // Sincronização automática do status da Nota
    if (dto.decisao !== undefined && dto.nota) {
      let statusParaAtualizar = 0;
      if (dto.decisao === 1) statusParaAtualizar = 1;
      else if (dto.decisao === 2) statusParaAtualizar = 2;

      const notaId = dto.nota as string;

      await this.notaRepository.update(notaId, {
        status: statusParaAtualizar
      });
    }

    return aprovacaoSalva;
  }

  // Alterar aprovação existente
  async alterar(id: string, dto: UpdateAprovacoeDto): Promise<void> {
    const aprovacaoAtual = await this.repository.findOne({
      where: { id } as any,
      relations: ['nota'],
    });

    if (!aprovacaoAtual) {
      throw new NotFoundException(`Aprovação com ID ${id} não encontrada.`);
    }

    await this.repository.update(id, {
      decisao: dto.decisao ?? aprovacaoAtual.decisao,
      observacao: dto.observacao ?? aprovacaoAtual.observacao,
    } as any);

    if (dto.decisao !== undefined && aprovacaoAtual.nota && aprovacaoAtual.nota.id) {
      let statusParaAtualizar = 0;
      if (dto.decisao === 1) statusParaAtualizar = 1;
      else if (dto.decisao === 2) statusParaAtualizar = 2;

      const notaId = aprovacaoAtual.nota.id as string;

      await this.notaRepository.update(notaId, {
        status: statusParaAtualizar,
      });
    }
  }

  // Excluir aprovação
  async excluir(id: string): Promise<void> {
    const existe = await this.buscarPorId(id);
    if (existe) {
      await this.repository.delete(id);
    }
  }
}