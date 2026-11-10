// src/notas-fiscais/notas-fiscais.service.ts

import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notas } from './entities/notas-fiscais.entity';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as crypto from 'crypto';

export interface DadosCarimboPdf {
  gestorNome: string;
  gestorEmail: string;
  statusTexto: string;
  aprovado: boolean;
  dataHora: string;
  codigoAutenticacao: string;
  observacao?: string;
}

@Injectable()
export class NotasFiscaisService {
  private supabase: SupabaseClient;

  constructor(
    @InjectRepository(Notas)
    private readonly repository: Repository<Notas>,
  ) {
    this.supabase = createClient(
      process.env.SUPABASE_URL as string,
      process.env.SUPABASE_KEY as string,
    );
  }

  // 1. Criar Nota
  async inserir(dados: Partial<Notas>, file?: Express.Multer.File) {
    if (file) {
      const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
      const { data, error } = await this.supabase.storage
        .from('pdf')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
        });

      if (error) {
        console.error('🔥 ERRO DETALHADO DO SUPABASE:', error);
        throw new InternalServerErrorException('Erro ao fazer upload para o Supabase');
      }

      dados.arquivoPdf = data.path;
      dados.tem_anexo = true;
    } else {
      dados.tem_anexo = false;
    }

    const novaNota = this.repository.create(dados);
    return await this.repository.save(novaNota);
  }

  // 2. Listar Todas
  async listar(): Promise<any[]> {
    const notas = await this.repository.find({
      select: {
        id: true,
        numero_nf: true,
        data_vencimento: true,
        valor_total: true,
        quant_parcelas: true,
        status: true,
        tem_anexo: true,
        arquivoPdf: true,
        obra: { id: true, nome_obra: true },
        fornecedor: {
          id: true,
          razao_social: true,
          nome: true,
          cnpj: true,
          cpf: true,
        },
      },
      relations: ['obra', 'fornecedor'],
    });

    const paths = notas
      .filter((n) => n.arquivoPdf)
      .map((n) => n.arquivoPdf as string);

    const urlsMap: Record<string, string> = {};

    if (paths.length > 0) {
      const { data } = await this.supabase.storage.from('pdf').createSignedUrls(paths, 3600);
      if (data) {
        data.forEach((item) => {
          if (!item.error && item.path && item.signedUrl) {
            urlsMap[item.path as string] = item.signedUrl as string;
          }
        });
      }
    }

    return notas.map((nota) => {
      const url = nota.arquivoPdf ? urlsMap[nota.arquivoPdf as string] : null;
      return {
        id: nota.id,
        numero_nf: nota.numero_nf,
        data_vencimento: nota.data_vencimento,
        valor_total: nota.valor_total,
        quant_parcelas: nota.quant_parcelas,
        status: nota.status,
        tem_anexo: nota.tem_anexo,
        obra: nota.obra,
        fornecedor: nota.fornecedor,
        link_pdf: url || null,
      };
    });
  }

  // 3. Buscar uma por ID
  async buscarPorId(id: string): Promise<any> {
    const nota = await this.repository.findOne({
      where: { id: id as any },
      relations: ['obra', 'fornecedor'],
      select: {
        id: true,
        numero_nf: true,
        data_vencimento: true,
        valor_total: true,
        quant_parcelas: true,
        status: true,
        tem_anexo: true,
        arquivoPdf: true,
        obra: { id: true, nome_obra: true, ativo: true },
        fornecedor: {
          id: true,
          razao_social: true,
          nome: true,
          cnpj: true,
          cpf: true,
          email: true,
          telefone: true,
        },
      },
    });

    if (!nota) {
      throw new NotFoundException(`Nota fiscal com ID ${id} não encontrada`);
    }

    let link_pdf: string | undefined = undefined;

    if (nota.arquivoPdf) {
      const { data } = await this.supabase.storage.from('pdf').createSignedUrl(nota.arquivoPdf, 3600);
      link_pdf = data?.signedUrl;
    }

    return {
      id: nota.id,
      numero_nf: nota.numero_nf,
      data_vencimento: nota.data_vencimento,
      valor_total: nota.valor_total,
      quant_parcelas: nota.quant_parcelas,
      status: nota.status,
      tem_anexo: nota.tem_anexo,
      obra: nota.obra,
      fornecedor: nota.fornecedor,
      link_pdf: link_pdf || null,
    };
  }

  // 4. Alterar dados
  async alterar(id: string, dados: Partial<Notas>): Promise<void> {
    const notaExiste = await this.repository.findOne({ where: { id: id as any } });
    if (notaExiste) {
      await this.repository.update(id, dados);
    } else {
      throw new NotFoundException(`Nota fiscal com ID ${id} não encontrada`);
    }
  }

  // 5. Substituir apenas o PDF (limpa também eventual backup original)
  async substituirArquivoPdf(id: string, file: Express.Multer.File): Promise<void> {
    const notaExiste = await this.repository.findOne({ where: { id: id as any } });

    if (!notaExiste) {
      throw new NotFoundException(`Nota fiscal com ID ${id} não encontrada`);
    }

    if (notaExiste.arquivoPdf) {
      await this.supabase.storage
        .from('pdf')
        .remove([notaExiste.arquivoPdf, `originais/${notaExiste.arquivoPdf}`]);
    }

    const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    const { data, error } = await this.supabase.storage
      .from('pdf')
      .upload(fileName, file.buffer, { contentType: file.mimetype });

    if (error) {
      throw new InternalServerErrorException('Erro ao atualizar PDF no Supabase');
    }

    await this.repository.update(id, {
      arquivoPdf: data.path,
      tem_anexo: true,
    });
  }

  // 6. Excluir Nota e Arquivo (incluindo backup original se existir)
  async excluir(id: string): Promise<void> {
    const notaExiste = await this.repository.findOne({ where: { id: id as any } });
    if (notaExiste) {
      if (notaExiste.arquivoPdf) {
        await this.supabase.storage
          .from('pdf')
          .remove([notaExiste.arquivoPdf, `originais/${notaExiste.arquivoPdf}`]);
      }
      await this.repository.delete(id);
    }
  }

  // 7. Aplica faixa inferior de assinatura eletrônica no PDF da Nota
  async aplicarCarimboNoPdf(
    notaId: string,
    dadosCarimbo: DadosCarimboPdf,
  ): Promise<{ hashAssinatura: string; hashArquivoFinal: string } | null> {
    const nota = await this.repository.findOne({ where: { id: notaId as any } });
    if (!nota || !nota.arquivoPdf) {
      return null;
    }

    const caminhoAtual = nota.arquivoPdf;
    const caminhoOriginal = `originais/${caminhoAtual}`;
    let bufferOriginal: Buffer;

    const { data: backupBlob } = await this.supabase.storage
      .from('pdf')
      .download(caminhoOriginal);

    if (backupBlob) {
      bufferOriginal = Buffer.from(await backupBlob.arrayBuffer());
    } else {
      const { data: atualBlob, error: downloadError } = await this.supabase.storage
        .from('pdf')
        .download(caminhoAtual);

      if (downloadError || !atualBlob) {
        throw new InternalServerErrorException('Erro ao baixar PDF da nota para carimbar.');
      }

      bufferOriginal = Buffer.from(await atualBlob.arrayBuffer());

      await this.supabase.storage
        .from('pdf')
        .upload(caminhoOriginal, bufferOriginal, {
          contentType: 'application/pdf',
          upsert: true,
        });
    }

    const pdfDoc = await PDFDocument.load(bufferOriginal);
    const pages = pdfDoc.getPages();
    const primeiraPagina = pages[0];

    const { width, height } = primeiraPagina.getSize();
    const alturaFaixa = 78;

    primeiraPagina.setMediaBox(0, -alturaFaixa, width, height + alturaFaixa);
    primeiraPagina.setCropBox(0, -alturaFaixa, width, height + alturaFaixa);

    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const corDestaque = dadosCarimbo.aprovado
      ? rgb(0.08, 0.5, 0.24)
      : rgb(0.75, 0.15, 0.15);
    const corFundo = dadosCarimbo.aprovado
      ? rgb(0.94, 0.98, 0.95)
      : rgb(0.99, 0.94, 0.94);

    primeiraPagina.drawRectangle({
      x: 15,
      y: -alturaFaixa + 8,
      width: width - 30,
      height: alturaFaixa - 14,
      color: corFundo,
      borderColor: corDestaque,
      borderWidth: 1.5,
    });

    const hashAssinatura = crypto
      .createHash('sha256')
      .update(bufferOriginal)
      .update(
        `${dadosCarimbo.codigoAutenticacao}|${dadosCarimbo.gestorEmail}|${dadosCarimbo.statusTexto}|${dadosCarimbo.dataHora}`,
      )
      .digest('hex')
      .substring(0, 28)
      .toUpperCase();

    const limparTexto = (txt: string) => txt.replace(/[^\x20-\xFF]/g, '');

    primeiraPagina.drawText(limparTexto(`HIDROPAG • ${dadosCarimbo.statusTexto}`), {
      x: 24,
      y: -21,
      size: 9.5,
      font: fontBold,
      color: corDestaque,
    });

    primeiraPagina.drawText(
      limparTexto(
        `Gestor: ${dadosCarimbo.gestorNome} (${dadosCarimbo.gestorEmail}) • Data/Hora: ${dadosCarimbo.dataHora}`,
      ),
      {
        x: 24,
        y: -35,
        size: 8,
        font: fontRegular,
        color: rgb(0.18, 0.18, 0.18),
      },
    );

    primeiraPagina.drawText(
      limparTexto(
        `Cód. Autenticação: ${dadosCarimbo.codigoAutenticacao} • Assinatura SHA-256: ${hashAssinatura}`,
      ),
      {
        x: 24,
        y: -48,
        size: 7.5,
        font: fontRegular,
        color: rgb(0.32, 0.32, 0.32),
      },
    );

    if (dadosCarimbo.observacao) {
      const obsLimpa = limparTexto(dadosCarimbo.observacao);
      const obsTexto =
        obsLimpa.length > 95 ? `${obsLimpa.substring(0, 92)}...` : obsLimpa;

      primeiraPagina.drawText(`Obs.: ${obsTexto}`, {
        x: 24,
        y: -60,
        size: 7.5,
        font: fontRegular,
        color: rgb(0.25, 0.25, 0.25),
      });
    }

    const pdfAssinadoBytes = await pdfDoc.save();
    const pdfAssinadoBuffer = Buffer.from(pdfAssinadoBytes);

    const hashArquivoFinal = crypto
      .createHash('sha256')
      .update(pdfAssinadoBuffer)
      .digest('hex')
      .toUpperCase();

    const { error: uploadError } = await this.supabase.storage
      .from('pdf')
      .upload(caminhoAtual, pdfAssinadoBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      throw new InternalServerErrorException('Erro ao salvar PDF carimbado no Supabase.');
    }

    return {
      hashAssinatura,
      hashArquivoFinal,
    };
  }

  // 8. Restaura o PDF original caso a aprovação seja excluída
  async removerCarimboDoPdf(notaId: string): Promise<void> {
    const nota = await this.repository.findOne({ where: { id: notaId as any } });
    if (!nota || !nota.arquivoPdf) return;

    const caminhoAtual = nota.arquivoPdf;
    const caminhoOriginal = `originais/${caminhoAtual}`;

    const { data: backupBlob } = await this.supabase.storage
      .from('pdf')
      .download(caminhoOriginal);

    if (backupBlob) {
      const bufferOriginal = Buffer.from(await backupBlob.arrayBuffer());
      await this.supabase.storage.from('pdf').upload(caminhoAtual, bufferOriginal, {
        contentType: 'application/pdf',
        upsert: true,
      });
      await this.supabase.storage.from('pdf').remove([caminhoOriginal]);
    }
  }
}