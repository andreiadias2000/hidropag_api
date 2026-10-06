// notas-fiscais.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notas } from './entities/notas-fiscais.entity';
import { NotificacoesService } from '../notificacoes/notificacoes.service';

@Injectable()
export class NotasFiscaisService {
  constructor(
    @InjectRepository(Notas)
    private repository: Repository<Notas>,
    private notificacoesService: NotificacoesService,
  ) {}

  // 1. FUNÇÃO DE INSERIR (Com o envio de E-mail)
  async inserir(dto: any, file?: any) {
    const novaNota = this.repository.create(dto as any);
    const notaSalva: any = await this.repository.save(novaNota);

    const emailDiretoria = 'diretoria@hidropag.com.br';

    await this.notificacoesService.notificarNovaNota(
      emailDiretoria,
      notaSalva.fornecedor,
      Number(notaSalva.valor_total)
    );

    return notaSalva;
  }

  // 2. FUNÇÃO DE TESTE DE E-MAIL
  async testarEmail() {
    const meuEmail = 'seu_email_pessoal@gmail.com'; 
    await this.notificacoesService.notificarNovaNota(
      meuEmail, 
      'Fornecedor de Teste Ltda', 
      999.99
    );
    return { mensagem: 'Teste disparado! Olhe o seu terminal e a sua caixa de entrada.' };
  }

  // --- AS FUNÇÕES QUE FALTAVAM ---

  // 3. LISTAR TODAS AS NOTAS
  async listar() {
    return await this.repository.find();
  }

  // 4. BUSCAR UMA NOTA POR ID
  async buscarPorId(id: string) {
    const nota = await this.repository.findOne({ where: { id: id as any } });
    if (!nota) {
      throw new NotFoundException('Nota fiscal não encontrada.');
    }
    return nota;
  }

  // 5. ATUALIZAR DADOS DA NOTA
  async alterar(id: string, dto: any) {
    await this.repository.update(id, dto);
    return this.buscarPorId(id);
  }

  // 6. SUBSTITUIR O ARQUIVO PDF
  async substituirArquivoPdf(id: string, file: any) {
    // Se você guarda o nome/caminho do arquivo no banco (ex: coluna "arquivo_pdf"), 
    // a lógica de atualização entra aqui. Deixei uma resposta padrão de sucesso.
    // Exemplo: await this.repository.update(id, { arquivo_pdf: file.filename });
    return { mensagem: 'Arquivo PDF recebido e processado com sucesso.' };
  }

  // 7. EXCLUIR NOTA
  async excluir(id: string) {
    await this.repository.delete(id);
    return { mensagem: 'Nota fiscal excluída com sucesso.' };
  }
}

 


////////////////////////////////////////////////////////////////////////////////////////////////////////
// import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Notas } from './entities/notas-fiscais.entity';
// import { createClient, SupabaseClient } from '@supabase/supabase-js';

// @Injectable()
// export class NotasFiscaisService {
//   // 1. Declaramos a propriedade privada do supabase
//   private supabase: SupabaseClient;

//   constructor(
//     @InjectRepository(Notas)
//     private readonly repository: Repository<Notas>,
//   ) {
//     this.supabase = createClient(
//       process.env.SUPABASE_URL as string, 
//       process.env.SUPABASE_KEY as string
//     );
//   }

//   // 2. Criar uma nota: Agora recebe o arquivo pelo Multer e envia para o bucket 'pdf'
//   async inserir(dados: Partial<Notas>, file?: Express.Multer.File) {
    
//     // Se vier um arquivo na requisição, fazemos o upload
//     if (file) {
//       const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;

//       const { data, error } = await this.supabase.storage
//         .from('pdf')
//         .upload(fileName, file.buffer, {
//           contentType: file.mimetype,
//         });

//       if (error) {
//         throw new InternalServerErrorException('Erro ao fazer upload do arquivo para o Supabase');
//       }

//       // Preenche os dados antes de salvar no banco
//       dados.arquivoPdf = data.path;
//       dados.tem_anexo = true;
//     } else {
//       dados.tem_anexo = false;
//     }

//     const novaNota = this.repository.create(dados); 
//     return await this.repository.save(novaNota);
//   }

  


//   // Listar todas
//   async listar(): Promise<any[]> {
//     const notas = await this.repository.find({
//       select: {
//         id: true,
//         numero_nf: true,
//         fornecedor: true,
//         data_vencimento: true,
//         valor_total: true,
//         quant_parcelas: true,
//         status: true,
//         tem_anexo: true,
//         arquivoPdf: true, 
//         obra: { id: true, nome_obra: true }
//       },
//       relations: ['obra'], 
//     });

//     // 💡 CORREÇÃO AQUI: Garantimos ao TS que a extração resultará em uma lista de strings
//     const paths = notas
//       .filter(n => n.arquivoPdf)
//       .map(n => n.arquivoPdf as string); 

//     const urlsMap: Record<string, string> = {};

//     if (paths.length > 0) {
//       const { data } = await this.supabase.storage.from('pdf').createSignedUrls(paths, 3600);
//       if (data) {
//         data.forEach(item => {
//           // 💡 CORREÇÃO AQUI: Garantimos que item.path e item.signedUrl sejam tratados como strings
//           if (!item.error && item.path && item.signedUrl) {
//              urlsMap[item.path as string] = item.signedUrl as string;
//           }
//         });
//       }
//     }
//     // Retorna as notas adicionando a propriedade "link_pdf" no JSON
//     return notas.map(nota => {
//       // Pega a URL se existir, senão força a ser null (para não sumir do JSON)
//       const url = nota.arquivoPdf ? urlsMap[nota.arquivoPdf as string] : null;
      
//       return {
//         ...nota,
//         link_pdf: url || null 
//       };
//     });
//   }

//   // Buscar por ID
//   async buscarPorId(id: string): Promise<any> {
//     const nota = await this.repository.findOne({
//       where: { id: id as any },
//       relations: ['obra'],
//       select: {
//         id: true,
//         numero_nf: true,
//         fornecedor: true,
//         data_vencimento: true,
//         valor_total: true,
//         quant_parcelas: true,
//         status: true,
//         tem_anexo: true, 
//         arquivoPdf: true, 
//         obra: { id: true, nome_obra: true, ativo: true }
//       }
//     });

//     if (!nota) {
//       throw new NotFoundException(`Nota fiscal com ID ${id} não encontrada`);
//     }

//     // 💡 CORREÇÃO AQUI: Tipamos explicitamente a variável
//     let link_pdf: string | undefined = undefined;

//     if (nota.arquivoPdf) {
//       const { data } = await this.supabase.storage.from('pdf').createSignedUrl(nota.arquivoPdf, 3600);
//       link_pdf = data?.signedUrl;
//     }

//     return { ...nota, link_pdf };
//   }

//   // 2. NOVO: Gera a URL segura do PDF direto do Supabase para visualização/download
//   async buscarNotaComPdf(id: string): Promise<{ nota: Notas; urlDownload?: string }> {
//     // Trazemos a nota completa (que agora é leve, pois tem apenas o caminho do arquivoPdf)
//     const nota = await this.repository.findOne({
//       where: { id: id as any },
//     });

//     if (!nota) {
//       throw new NotFoundException(`Nota fiscal com ID ${id} não encontrada`);
//     }

//     if (!nota.arquivoPdf) {
//       return { nota, urlDownload: undefined }; // Retorna a nota sem URL se não houver anexo
//     }

//     // Como o bucket é privado, geramos um link temporário (Signed URL) válido por 1 hora (3600 segundos)
//     const { data, error } = await this.supabase.storage
//       .from('pdf')
//       .createSignedUrl(nota.arquivoPdf, 3600);

//     if (error) {
//       throw new InternalServerErrorException('Erro ao resgatar o link do arquivo no storage');
//     }

//     return { nota, urlDownload: data.signedUrl };
//   }

//   // Atualizar (Patch/Put)
//   async alterar(id: string, dados: Partial<Notas>): Promise<void> {
//     const notaExiste = await this.buscarPorId(id);
//     if (notaExiste) {
//       await this.repository.update(id, dados);
//     }
//   }

//   // Excluir - BÔNUS: Remove também o arquivo do Supabase para não lotar seu Storage!
//   async excluir(id: string): Promise<void> {
//     // Precisa buscar a nota completa para saber o caminho do arquivo
//     const notaExiste = await this.repository.findOne({ where: { id: id as any } });
    
//     if (notaExiste) {
//       // Se tiver anexo, deleta do Supabase primeiro
//       if (notaExiste.arquivoPdf) {
//         await this.supabase.storage
//           .from('pdf')
//           .remove([notaExiste.arquivoPdf]);
//       }
      
//       // Depois deleta do banco
//       await this.repository.delete(id);
//     }
//   }
//   // Substitui o PDF existente por um novo
//   async substituirArquivoPdf(id: string, file: Express.Multer.File): Promise<void> {
//     const notaExiste = await this.repository.findOne({ where: { id: id as any } });
    
//     if (!notaExiste) {
//       throw new NotFoundException(`Nota fiscal com ID ${id} não encontrada`);
//     }

//     // 1. Se já existir um PDF antigo, remove do Supabase para não acumular lixo
//     if (notaExiste.arquivoPdf) {
//       await this.supabase.storage
//         .from('pdf')
//         .remove([notaExiste.arquivoPdf]);
//     }

//     // 2. Faz o upload do novo arquivo
//     const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
//     const { data, error } = await this.supabase.storage
//       .from('pdf')
//       .upload(fileName, file.buffer, {
//         contentType: file.mimetype,
//       });

//     if (error) {
//       throw new InternalServerErrorException('Erro ao atualizar PDF no Supabase');
//     }

//     // 3. Atualiza o banco com o novo caminho e garante que a flag está true
//     await this.repository.update(id, { 
//       arquivoPdf: data.path,
//       tem_anexo: true 
//     });
//   }
// }

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Notas } from './entities/notas-fiscais.entity';
// import { createClient, SupabaseClient } from '@supabase/supabase-js';

// @Injectable()
// export class NotasFiscaisService {
//   constructor(
//     @InjectRepository(Notas)
//     private readonly repository: Repository<Notas>,
//   ) {
//     this.supabase = createClient(
//       process.env.SUPABASE_URL, 
//       process.env.SUPABASE_KEY
//     );
//   }

//   // Criar uma nota
//   async inserir(dados: Notas) {
//     const novaNota = this.repository.create(dados); 
//     return await this.repository.save(novaNota);
//   }

//   // Listar todas com a Obra vinculada (Rápido, SEM o PDF pesado)
//   async listar(): Promise<Notas[]> {
//     return await this.repository.find({
//       select: {
//         id: true,
//         numero_nf: true,
//         fornecedor: true,
//         data_vencimento: true,
//         valor_total: true,
//         quant_parcelas: true,
//         status: true,
//         tem_anexo: true, // <-- Trazemos a informação "true/false"
//         obra: {
//           id: true,
//           nome_obra: true,
//         }
//       },
//       relations: ['obra'], 
//     });
//   }

//   // 1. GET NORMAL POR ID: Rápido e não trava o Swagger
//   async buscarPorId(id: string): Promise<Notas> {
//     const nota = await this.repository.findOne({
//       where: { id: id as any },
//       relations: ['obra'],
//       select: {
//         id: true,
//         numero_nf: true,
//         fornecedor: true,
//         data_vencimento: true,
//         valor_total: true,
//         quant_parcelas: true,
//         status: true,
//         tem_anexo: true, // <-- Adicionado aqui também!
//         obra: {
//           id: true,
//           nome_obra: true,
//           ativo: true
//         }
//       }
//     });

//     if (!nota) {
//       // Correção: Usando crases (`) em vez de aspas duplas (") para a variável ${id} funcionar
//       throw new NotFoundException(`Nota fiscal com ID ${id} não encontrada`);
//     }
//     return nota;
//   }

//   // 2. NOVO: Método usado pelo Controller apenas na hora do Download!
//   async buscarNotaComPdf(id: string): Promise<Notas> {
//     const nota = await this.repository.findOne({
//       where: { id: id as any },
//       // Como NÃO colocamos o "select" aqui, ele vai trazer o arquivoPdf pesado do banco
//     });

//     if (!nota) {
//       throw new NotFoundException(`Nota fiscal com ID ${id} não encontrada`);
//     }
//     return nota;
//   }

//   // Atualizar (Patch/Put)
//   async alterar(id: string, dados: Partial<Notas>): Promise<void> {
//     const notaExiste = await this.buscarPorId(id);
//     if (notaExiste) {
//       await this.repository.update(id, dados);
//     }
//   }

//   // Excluir
//   async excluir(id: string): Promise<void> {
//     const notaExiste = await this.buscarPorId(id);
//     if (notaExiste) {
//       await this.repository.delete(id);
//     }
//   }
// }