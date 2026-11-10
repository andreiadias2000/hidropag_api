// src/aprovaçoes/aprovacoes.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { APROVACOES } from './entities/aprovacoe.entity';
import { Notas } from '../notas-fiscais/entities/notas-fiscais.entity';
import { CreateAprovacoeDto } from './dto/create-aprovacoe.dto';
import { UpdateAprovacoeDto } from './dto/update-aprovacoe.dto';
import { NotasFiscaisService } from '../notas-fiscais/notas-fiscais.service';

@Injectable()
export class AprovacoesService {
  constructor(
    @InjectRepository(APROVACOES)
    private readonly repository: Repository<APROVACOES>,

    @InjectRepository(Notas)
    private readonly notaRepository: Repository<Notas>,

    private readonly notasFiscaisService: NotasFiscaisService,
  ) {}

<<<<<<< HEAD
  // Remove a senha do gestor e monta o objeto de carimbo para o Front/PDF
=======
>>>>>>> c5f3b29 (feat(aprovacoes): unifica central de auditoria e corrige fluxo de autenticação e usuários)
  private formatarComCarimbo(aprovacao: any): APROVACOES {
    if (!aprovacao) return aprovacao;

    if (aprovacao.usuario) {
      const { senha, password, ...usuarioSemSenha } = aprovacao.usuario;
      aprovacao.usuario = usuarioSemSenha;
    }

<<<<<<< HEAD
=======
    const dataRef = aprovacao.decidido_em || new Date();
    const dataFormatada = new Date(dataRef).toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
    });

>>>>>>> c5f3b29 (feat(aprovacoes): unifica central de auditoria e corrige fluxo de autenticação e usuários)
    aprovacao.carimbo = {
      gestorId: aprovacao.usuario?.id || null,
      aprovadoPor: aprovacao.usuario?.nome || 'Gestor',
      emailGestor: aprovacao.usuario?.email || '',
      statusTexto:
        aprovacao.decisao === 1
          ? 'APROVADO PARA PAGAMENTO'
          : 'REPROVADO PELO GESTOR',
      pagamentoLiberado: aprovacao.decisao === 1,
<<<<<<< HEAD
      dataHora: aprovacao.createdAt || aprovacao.data_aprovacao || new Date(),
      codigoAutenticacao: aprovacao.id
        ? String(aprovacao.id).substring(0, 8).toUpperCase()
        : '',
=======
      dataHora: dataFormatada,
      codigoAutenticacao: aprovacao.id
        ? String(aprovacao.id).substring(0, 8).toUpperCase()
        : '',
      hashAssinatura: aprovacao.hash_assinatura || null,
>>>>>>> c5f3b29 (feat(aprovacoes): unifica central de auditoria e corrige fluxo de autenticação e usuários)
    };

    return aprovacao;
  }

<<<<<<< HEAD
  // Buscar todas as aprovações
=======
>>>>>>> c5f3b29 (feat(aprovacoes): unifica central de auditoria e corrige fluxo de autenticação e usuários)
  async buscarTodas(): Promise<APROVACOES[]> {
    const aprovacoes = await this.repository.find({
      relations: ['nota', 'usuario'],
    });
    return aprovacoes.map((item) => this.formatarComCarimbo(item));
  }

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

<<<<<<< HEAD
  // Salva uma nova decisão (Aprovar/Reprovar)
=======
>>>>>>> c5f3b29 (feat(aprovacoes): unifica central de auditoria e corrige fluxo de autenticação e usuários)
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

<<<<<<< HEAD
    // Identifica o Gestor pelo Token JWT (ou usa dto.usuario se vier de teste)
=======
>>>>>>> c5f3b29 (feat(aprovacoes): unifica central de auditoria e corrige fluxo de autenticação e usuários)
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

    if (dto.decisao !== undefined && dto.nota) {
<<<<<<< HEAD
      let statusParaAtualizar = 0;
      if (dto.decisao === 1) statusParaAtualizar = 1; // 1 = Aprovada para pagamento
      else if (dto.decisao === 2) statusParaAtualizar = 2; // 2 = Reprovada

      const notaId = dto.nota as string;

      await this.notaRepository.update(notaId, {
=======
      const statusParaAtualizar = dto.decisao === 1 ? 1 : dto.decisao === 2 ? 2 : 0;
      await this.notaRepository.update(dto.nota, {
>>>>>>> c5f3b29 (feat(aprovacoes): unifica central de auditoria e corrige fluxo de autenticação e usuários)
        status: statusParaAtualizar,
      });
    }

<<<<<<< HEAD
    return await this.buscarPorId(aprovacaoSalva.id);
  }

  // Alterar aprovação existente
=======
    const aprovacaoCompleta: any = await this.buscarPorId(aprovacaoSalva.id);

    if (dto.nota) {
      const resultadoCarimbo = await this.notasFiscaisService.aplicarCarimboNoPdf(
        dto.nota,
        {
          gestorNome: aprovacaoCompleta.carimbo.aprovadoPor,
          gestorEmail: aprovacaoCompleta.carimbo.emailGestor,
          statusTexto: aprovacaoCompleta.carimbo.statusTexto,
          aprovado: dto.decisao === 1,
          dataHora: aprovacaoCompleta.carimbo.dataHora,
          codigoAutenticacao: aprovacaoCompleta.carimbo.codigoAutenticacao,
          observacao: aprovacaoCompleta.observacao,
        },
      );

      if (resultadoCarimbo) {
        await this.repository.update(aprovacaoSalva.id, {
          hash_assinatura: resultadoCarimbo.hashAssinatura,
          hash_arquivo_final: resultadoCarimbo.hashArquivoFinal,
        });
        aprovacaoCompleta.hash_assinatura = resultadoCarimbo.hashAssinatura;
        aprovacaoCompleta.hash_arquivo_final = resultadoCarimbo.hashArquivoFinal;
        aprovacaoCompleta.carimbo.hashAssinatura = resultadoCarimbo.hashAssinatura;
      }
    }

    return aprovacaoCompleta;
  }

>>>>>>> c5f3b29 (feat(aprovacoes): unifica central de auditoria e corrige fluxo de autenticação e usuários)
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

<<<<<<< HEAD
    if (
      dto.decisao !== undefined &&
      aprovacaoAtual.nota &&
      aprovacaoAtual.nota.id
    ) {
      let statusParaAtualizar = 0;
      if (dto.decisao === 1) statusParaAtualizar = 1;
      else if (dto.decisao === 2) statusParaAtualizar = 2;

      const notaId = aprovacaoAtual.nota.id as string;
=======
    const notaId = aprovacaoAtual.nota?.id;
>>>>>>> c5f3b29 (feat(aprovacoes): unifica central de auditoria e corrige fluxo de autenticação e usuários)

    if (dto.decisao !== undefined && notaId) {
      const statusParaAtualizar = dto.decisao === 1 ? 1 : dto.decisao === 2 ? 2 : 0;
      await this.notaRepository.update(notaId, {
        status: statusParaAtualizar,
      });
    }

<<<<<<< HEAD
    return await this.buscarPorId(id);
=======
    const aprovacaoAtualizada: any = await this.buscarPorId(id);

    if (notaId) {
      const resultadoCarimbo = await this.notasFiscaisService.aplicarCarimboNoPdf(
        notaId,
        {
          gestorNome: aprovacaoAtualizada.carimbo.aprovadoPor,
          gestorEmail: aprovacaoAtualizada.carimbo.emailGestor,
          statusTexto: aprovacaoAtualizada.carimbo.statusTexto,
          aprovado: aprovacaoAtualizada.decisao === 1,
          dataHora: aprovacaoAtualizada.carimbo.dataHora,
          codigoAutenticacao: aprovacaoAtualizada.carimbo.codigoAutenticacao,
          observacao: aprovacaoAtualizada.observacao,
        },
      );

      if (resultadoCarimbo) {
        await this.repository.update(id, {
          hash_assinatura: resultadoCarimbo.hashAssinatura,
          hash_arquivo_final: resultadoCarimbo.hashArquivoFinal,
        });
        aprovacaoAtualizada.hash_assinatura = resultadoCarimbo.hashAssinatura;
        aprovacaoAtualizada.hash_arquivo_final = resultadoCarimbo.hashArquivoFinal;
        aprovacaoAtualizada.carimbo.hashAssinatura = resultadoCarimbo.hashAssinatura;
      }
    }

    return aprovacaoAtualizada;
>>>>>>> c5f3b29 (feat(aprovacoes): unifica central de auditoria e corrige fluxo de autenticação e usuários)
  }

  async excluir(id: string): Promise<void> {
    const existe = await this.buscarPorId(id);
    if (existe) {
      if (existe.nota && existe.nota.id) {
        await this.notaRepository.update(existe.nota.id as string, {
          status: 0,
        });
<<<<<<< HEAD
=======
        await this.notasFiscaisService.removerCarimboDoPdf(existe.nota.id);
>>>>>>> c5f3b29 (feat(aprovacoes): unifica central de auditoria e corrige fluxo de autenticação e usuários)
      }
      await this.repository.delete(id);
    }
  }

  // --- MÉTODOS DE AUDITORIA E VALIDAÇÃO ---

  private montarRespostaValidacao(aprovacao: APROVACOES, tipoValidacao: string) {
    return {
      autentico: true,
      tipoValidacao,
      mensagem: 'Documento verificado e autêntico.',
      dadosOficiais: {
        codigoAutenticacao: String(aprovacao.id).substring(0, 8).toUpperCase(),
        hashAssinatura: aprovacao.hash_assinatura,
        decisao:
          aprovacao.decisao === 1
            ? 'APROVADO PARA PAGAMENTO'
            : 'REPROVADO PELO GESTOR',
        observacao: aprovacao.observacao || '-',
        dataHora: aprovacao.decidido_em,
        gestor: {
          nome: aprovacao.usuario?.nome || 'Gestor',
          email: aprovacao.usuario?.email || '',
        },
        notaFiscal: {
          numero_nf: aprovacao.nota?.numero_nf,
          valor_total: aprovacao.nota?.valor_total,
          data_vencimento: aprovacao.nota?.data_vencimento,
          fornecedor:
            aprovacao.nota?.fornecedor?.razao_social ||
            aprovacao.nota?.fornecedor?.nome ||
            '-',
          obra: aprovacao.nota?.obra?.nome_obra || '-',
        },
      },
    };
  }

  async validarPorHash(hash: string) {
    const hashLimpo = hash.trim().toUpperCase();

    const aprovacao = await this.repository.findOne({
      where: { hash_assinatura: hashLimpo } as any,
      relations: ['nota', 'nota.fornecedor', 'nota.obra', 'usuario'],
    });

    if (!aprovacao) {
      throw new NotFoundException(
        'Código de assinatura não encontrado nos registros do HidroPag.',
      );
    }

    return this.montarRespostaValidacao(aprovacao, 'CODIGO_HASH');
  }

  async validarPorArquivo(fileBuffer: Buffer) {
    const hashCalculado = crypto
      .createHash('sha256')
      .update(fileBuffer)
      .digest('hex')
      .toUpperCase();

    const aprovacao = await this.repository.findOne({
      where: { hash_arquivo_final: hashCalculado } as any,
      relations: ['nota', 'nota.fornecedor', 'nota.obra', 'usuario'],
    });

    if (!aprovacao) {
      throw new NotFoundException(
        'O arquivo enviado não corresponde a nenhum PDF assinado pelo sistema (pode ter sido alterado ou não foi aprovado aqui).',
      );
    }

    return this.montarRespostaValidacao(aprovacao, 'INTEGRIDADE_ARQUIVO');
  }
}