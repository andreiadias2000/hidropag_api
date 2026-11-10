// src/aprovaçoes/aprovacoes.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
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

  // Remove a senha do gestor e monta o objeto de carimbo para o Front/PDF
  private formatarComCarimbo(aprovacao: any): APROVACOES {
    if (!aprovacao) return aprovacao;

    if (aprovacao.usuario) {
      const { senha, password, ...usuarioSemSenha } = aprovacao.usuario;
      aprovacao.usuario = usuarioSemSenha;
    }

    aprovacao.carimbo = {
      gestorId: aprovacao.usuario?.id || null,
      aprovadoPor: aprovacao.usuario?.nome || 'Gestor',
      emailGestor: aprovacao.usuario?.email || '',
      statusTexto:
        aprovacao.decisao === 1
          ? 'APROVADO PARA PAGAMENTO'
          : 'REPROVADO PELO GESTOR',
      pagamentoLiberado: aprovacao.decisao === 1,
      dataHora: aprovacao.createdAt || aprovacao.data_aprovacao || new Date(),
      codigoAutenticacao: aprovacao.id
        ? String(aprovacao.id).substring(0, 8).toUpperCase()
        : '',
    };

    return aprovacao;
  }

  // Buscar todas as aprovações
  async buscarTodas(): Promise<APROVACOES[]> {
    const aprovacoes = await this.repository.find({
      relations: ['nota', 'usuario'],
    });
    return aprovacoes.map((item) => this.formatarComCarimbo(item));
  }

  // Buscar por ID
  async buscarPorId(id: string): Promise<APROVACOES> {
    const aprovacao = await this.repository.findOne({
      where: { id } as any,
      relations: ['nota', 'usuario'],
    });

    if (!aprovacao) {
      throw new NotFoundException(`Aprovação com ID ${id} não encontrada.`);
    }

    return this.formatarComCarimbo(aprovacao);
  }

  // Salva uma nova decisão (Aprovar/Reprovar)
  async inserir(
    dto: CreateAprovacoeDto,
    usuarioLogado?: any,
  ): Promise<APROVACOES> {
    const aprovacaoExistente = await this.repository.findOne({
      where: { nota: { id: dto.nota } } as any,
    });

    if (aprovacaoExistente) {
      throw new ConflictException(
        `A nota fiscal com ID ${dto.nota} já foi avaliada e possui uma aprovação registrada.`,
      );
    }

    // Identifica o Gestor pelo Token JWT (ou usa dto.usuario se vier de teste)
    const gestorId = usuarioLogado?.sub || usuarioLogado?.id || dto.usuario;

    if (!gestorId) {
      throw new ForbiddenException(
        'Não foi possível identificar o Gestor responsável pela aprovação.',
      );
    }

    const novaAprovacao = this.repository.create({
      decisao: dto.decisao,
      observacao: dto.observacao,
      nota: { id: dto.nota },
      usuario: { id: gestorId },
    } as any);

    const aprovacaoSalva = (await this.repository.save(novaAprovacao)) as any;

    // Sincronização automática do status da Nota
    if (dto.decisao !== undefined && dto.nota) {
      let statusParaAtualizar = 0;
      if (dto.decisao === 1) statusParaAtualizar = 1; // 1 = Aprovada para pagamento
      else if (dto.decisao === 2) statusParaAtualizar = 2; // 2 = Reprovada

      const notaId = dto.nota as string;

      await this.notaRepository.update(notaId, {
        status: statusParaAtualizar,
      });
    }

    return await this.buscarPorId(aprovacaoSalva.id);
  }

  // Alterar aprovação existente
  async alterar(
    id: string,
    dto: UpdateAprovacoeDto,
    usuarioLogado?: any,
  ): Promise<APROVACOES> {
    const aprovacaoAtual = await this.repository.findOne({
      where: { id } as any,
      relations: ['nota', 'usuario'],
    });

    if (!aprovacaoAtual) {
      throw new NotFoundException(`Aprovação com ID ${id} não encontrada.`);
    }

    const gestorId =
      usuarioLogado?.sub || usuarioLogado?.id || aprovacaoAtual.usuario?.id;

    await this.repository.update(id, {
      decisao: dto.decisao ?? aprovacaoAtual.decisao,
      observacao: dto.observacao ?? aprovacaoAtual.observacao,
      usuario: gestorId ? { id: gestorId } : aprovacaoAtual.usuario,
    } as any);

    if (
      dto.decisao !== undefined &&
      aprovacaoAtual.nota &&
      aprovacaoAtual.nota.id
    ) {
      let statusParaAtualizar = 0;
      if (dto.decisao === 1) statusParaAtualizar = 1;
      else if (dto.decisao === 2) statusParaAtualizar = 2;

      const notaId = aprovacaoAtual.nota.id as string;

      await this.notaRepository.update(notaId, {
        status: statusParaAtualizar,
      });
    }

    return await this.buscarPorId(id);
  }

  // Excluir aprovação
  async excluir(id: string): Promise<void> {
    const existe = await this.buscarPorId(id);
    if (existe) {
      if (existe.nota && existe.nota.id) {
        await this.notaRepository.update(existe.nota.id as string, {
          status: 0,
        });
      }
      await this.repository.delete(id);
    }
  }
}