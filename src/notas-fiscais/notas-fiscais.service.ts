// notas-fiscais.service.ts

import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notas } from './entities/notas-fiscais.entity';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class NotasFiscaisService {
  private supabase: SupabaseClient;

  constructor(
    @InjectRepository(Notas)
    private readonly repository: Repository<Notas>,
  ) {
    this.supabase = createClient(
      process.env.SUPABASE_URL as string, 
      process.env.SUPABASE_KEY as string
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
        fornecedor: { id: true, razao_social: true, cnpj_cpf: true }
      },
      relations: ['obra', 'fornecedor'], 
    });

    const paths = notas
      .filter(n => n.arquivoPdf)
      .map(n => n.arquivoPdf as string); 

    const urlsMap: Record<string, string> = {};

    if (paths.length > 0) {
      const { data } = await this.supabase.storage.from('pdf').createSignedUrls(paths, 3600);
      if (data) {
        data.forEach(item => {
          if (!item.error && item.path && item.signedUrl) {
             urlsMap[item.path as string] = item.signedUrl as string;
          }
        });
      }
    }

    return notas.map(nota => {
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
        link_pdf: url || null 
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
        fornecedor: { id: true, razao_social: true, cnpj_cpf: true, email: true, telefone: true }
      }
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
      link_pdf: link_pdf || null
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

  // 5. Substituir apenas o PDF
  async substituirArquivoPdf(id: string, file: Express.Multer.File): Promise<void> {
    const notaExiste = await this.repository.findOne({ where: { id: id as any } });
    
    if (!notaExiste) {
      throw new NotFoundException(`Nota fiscal com ID ${id} não encontrada`);
    }

    if (notaExiste.arquivoPdf) {
      await this.supabase.storage.from('pdf').remove([notaExiste.arquivoPdf]);
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
      tem_anexo: true 
    });
  }

  // 6. Excluir Nota e Arquivo
  async excluir(id: string): Promise<void> {
    const notaExiste = await this.repository.findOne({ where: { id: id as any } });
    if (notaExiste) {
      if (notaExiste.arquivoPdf) {
        await this.supabase.storage.from('pdf').remove([notaExiste.arquivoPdf]);
      }
      await this.repository.delete(id);
    }
  }
}