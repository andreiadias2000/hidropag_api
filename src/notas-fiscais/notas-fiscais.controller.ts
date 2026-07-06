// notas-fiscais.controller.ts

import { 
  Controller, Get, Post, Body, Param, Delete, UseInterceptors, 
  UploadedFile, BadRequestException, Put, UseGuards, 
  InternalServerErrorException
} from '@nestjs/common';
import { NotasFiscaisService } from './notas-fiscais.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../common/guards/roles.guard';

import { CreateNotasFiscaiDto } from './dto/create-notas-fiscai.dto';
import { UpdateNotasFiscaiDto } from './dto/update-notas-fiscai.dto';

@ApiTags('NOTAS') 
@ApiBearerAuth('token-acesso')
@Controller('NOTAS')
@UseGuards(RolesGuard) 
export class NotasFiscaisController {
  
  constructor(private readonly notasFiscaisService: NotasFiscaisService) {}

  @Post()
  @ApiOperation({ summary: 'Lança uma nova nota fiscal com arquivo PDF opcional' })
  @ApiConsumes('multipart/form-data') 
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        numero_nf: { type: 'number' },
        fornecedor: { type: 'string' },
        data_vencimento: { type: 'string', format: 'date' },
        valor_total: { type: 'number' },
        quant_parcelas: { type: 'number' },
        status: { type: 'number' },
        obra: { type: 'string', description: 'ID da Obra' }
      },
    },
  })
  @UseInterceptors(FileInterceptor('file')) 
  async criar(
    @Body() dados: CreateNotasFiscaiDto, 
    @UploadedFile() file: Express.Multer.File
  ) {
    try {
      // 1. INSPECIONANDO OS DADOS QUE CHEGAM DO REACT
      console.log("=== INICIANDO CADASTRO DE NOTA ===");
      console.log("DADOS BRUTOS RECEBIDOS (Body):", dados);
      console.log("ARQUIVO RECEBIDO:", file ? file.originalname : "Nenhum arquivo anexado");

      const notaParaSalvar: any = { 
        ...dados,
        obra: { id: dados.obra } 
      };

      console.log("OBJETO MONTADO PARA SALVAR:", notaParaSalvar);

      // 2. CHAMA O SERVICE
      const resultado = await this.notasFiscaisService.inserir(notaParaSalvar, file);
      
      console.log("=== NOTA SALVA COM SUCESSO! ===");
      return resultado;

    } catch (error: any) {
      // 3. CAPTURA E EXIBE O ERRO REAL
      console.error("❌ ERRO FATAL AO SALVAR NOTA FISCAL:", error);
      
      // Retorna o erro detalhado para o frontend
      throw new InternalServerErrorException({
        message: 'Erro interno ao tentar salvar a nota',
        detalhe: error.message,
        stack: error.stack
      });
    }
  }

  @Get()
  @ApiOperation({ summary: 'Lista as notas fiscais e exibe o link do PDF no JSON' })
  async buscarTodas() {
    return await this.notasFiscaisService.listar();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhes de uma nota fiscal com o link do PDF' })
  async buscarUma(@Param('id') id: string) {
    return await this.notasFiscaisService.buscarPorId(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar apenas os dados da nota fiscal' })
  async atualizar(
    @Param('id') id: string, 
    @Body() nota: UpdateNotasFiscaiDto 
  ) {
    return await this.notasFiscaisService.alterar(id, nota as any);
  }

  @Put(':id/upload-pdf')
  @ApiOperation({ summary: 'Substituir ou adicionar apenas o arquivo PDF da nota fiscal' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } },
  })
  async atualizarPdf(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Nenhum arquivo enviado.');
    await this.notasFiscaisService.substituirArquivoPdf(id, file);
    return { msg: 'Arquivo PDF atualizado com sucesso!' };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir uma nota fiscal e seu PDF' })
  async remover(@Param('id') id: string) {
    return await this.notasFiscaisService.excluir(id);
  }
}



// import { 
//   Controller, Get, Post, Body, Param, Delete, UseInterceptors, 
//   UploadedFile, BadRequestException, Put, UseGuards 
// } from '@nestjs/common';
// import { NotasFiscaisService } from './notas-fiscais.service';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
// import { RolesGuard } from '../common/guards/roles.guard';

// import { CreateNotasFiscaiDto } from './dto/create-notas-fiscai.dto';
// import { UpdateNotasFiscaiDto } from './dto/update-notas-fiscai.dto';

// @ApiTags('NOTAS') 
// @ApiBearerAuth('token-acesso')
// @Controller('NOTAS')
// @UseGuards(RolesGuard) 
// export class NotasFiscaisController {
  
//   constructor(private readonly notasFiscaisService: NotasFiscaisService) {}

//   // 1. CREATE (POST) - Cria a nota e já sobe o arquivo se houver
//   @Post()
//   @ApiOperation({ summary: 'Lança uma nova nota fiscal com arquivo PDF opcional' })
//   @ApiConsumes('multipart/form-data') 
//   @ApiBody({
//     schema: {
//       type: 'object',
//       properties: {
//         file: { type: 'string', format: 'binary' },
//         numero_nf: { type: 'number' },
//         fornecedor: { type: 'string' },
//         data_vencimento: { type: 'string', format: 'date' },
//         valor_total: { type: 'number' },
//         quant_parcelas: { type: 'number' },
//         status: { type: 'number' },
//         obra: { type: 'string', description: 'ID da Obra' }
//       },
//     },
//   })
//   @UseInterceptors(FileInterceptor('file')) 
//   async criar(
//     @Body() dados: CreateNotasFiscaiDto, 
//     @UploadedFile() file: Express.Multer.File
//   ) {
//     const notaParaSalvar: any = { 
//       ...dados,
//       obra: { id: dados.obra } 
//     };
//     return await this.notasFiscaisService.inserir(notaParaSalvar, file);
//   }

//   // 2. READ ALL (GET) - Lista todas e traz o JSON com a URL do PDF
//   @Get()
//   @ApiOperation({ summary: 'Lista as notas fiscais e exibe o link do PDF no JSON' })
//   async buscarTodas() {
//     return await this.notasFiscaisService.listar();
//   }

//   // 3. READ ONE (GET) - Busca uma específica com a URL do PDF
//   @Get(':id')
//   @ApiOperation({ summary: 'Detalhes de uma nota fiscal com o link do PDF' })
//   async buscarUma(@Param('id') id: string) {
//     return await this.notasFiscaisService.buscarPorId(id);
//   }

//   // 4. UPDATE DADOS (PUT) - Atualiza apenas os textos/valores
//   @Put(':id')
//   @ApiOperation({ summary: 'Atualizar apenas os dados da nota fiscal' })
//   async atualizar(
//     @Param('id') id: string, 
//     @Body() nota: UpdateNotasFiscaiDto 
//   ) {
//     return await this.notasFiscaisService.alterar(id, nota as any);
//   }

//   // 5. UPDATE ARQUIVO (PUT) - Substitui apenas o PDF no Supabase
//   @Put(':id/upload-pdf')
//   @ApiOperation({ summary: 'Substituir ou adicionar apenas o arquivo PDF da nota fiscal' })
//   @ApiConsumes('multipart/form-data')
//   @UseInterceptors(FileInterceptor('file'))
//   @ApiBody({
//     schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } },
//   })
//   async atualizarPdf(
//     @Param('id') id: string,
//     @UploadedFile() file: Express.Multer.File,
//   ) {
//     if (!file) throw new BadRequestException('Nenhum arquivo enviado.');
//     await this.notasFiscaisService.substituirArquivoPdf(id, file);
//     return { msg: 'Arquivo PDF atualizado com sucesso!' };
//   }

//   // 6. DELETE - Remove do banco e limpa o arquivo do bucket
//   @Delete(':id')
//   @ApiOperation({ summary: 'Excluir uma nota fiscal e seu PDF' })
//   async remover(@Param('id') id: string) {
//     return await this.notasFiscaisService.excluir(id);
//   }
// }

//////////////////////////////////////////////////////////////////////////////////////




// import { 
//   Controller, Get, Post, Body, Param, Delete, UseInterceptors, 
//   UploadedFile, BadRequestException, Res, StreamableFile, Put, UseGuards 
// } from '@nestjs/common';
// import { NotasFiscaisService } from './notas-fiscais.service';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
// import type { Response } from 'express';
// import { RolesGuard } from '../common/guards/roles.guard';

// // 1. IMPORTAÇÃO DOS DTOS
// import { CreateNotasFiscaiDto } from './dto/create-notas-fiscai.dto';
// import { UpdateNotasFiscaiDto } from './dto/update-notas-fiscai.dto';

// @ApiTags('NOTAS') 
// @ApiBearerAuth('token-acesso')
// @Controller('NOTAS')
// @UseGuards(RolesGuard) 
// export class NotasFiscaisController {
  
//   constructor(private readonly notasFiscaisService: NotasFiscaisService) {}

//   @Post()
//   @ApiOperation({ summary: 'Lança uma nova nota fiscal com arquivo PDF' })
//   @ApiConsumes('multipart/form-data') 
//   @ApiBody({
//     schema: {
//       type: 'object',
//       properties: {
//         file: { type: 'string', format: 'binary' },
//         numero_nf: { type: 'number' },
//         fornecedor: { type: 'string' },
//         data_vencimento: { type: 'string', format: 'date' },
//         valor_total: { type: 'number' },
//         quant_parcelas: { type: 'number' },
//         status: { type: 'number' },
//         obra: { type: 'string', description: 'Apenas cole o ID da Obra aqui' }
//       },
//     },
//   })
//   @UseInterceptors(FileInterceptor('file')) 
//   async criar(
//     @Body() dados: CreateNotasFiscaiDto, 
//     @UploadedFile() file: Express.Multer.File
//   ) {
    
//     // Empacotamos o ID em um objeto para o TypeORM entender
//     const notaParaSalvar: any = { 
//       ...dados,
//       obra: { id: dados.obra } 
//     };
    
//     if (file) {
//       notaParaSalvar.arquivoPdf = file.buffer; 
//       notaParaSalvar.tem_anexo = true; // Bandeirinha levantada!
//     } else {
//       notaParaSalvar.tem_anexo = false;
//     }
    
//     return await this.notasFiscaisService.inserir(notaParaSalvar);
//   }

//   @Get(':id/download')
//   @ApiOperation({ summary: 'Baixa o PDF da nota fiscal' })
//   async baixarPdf(@Param('id') id: string, @Res({ passthrough: true }) res: Response) {
    
//     // 💡 MUDANÇA AQUI: Agora usamos o método que traz o PDF junto da base de dados!
//     const nota = await this.notasFiscaisService.buscarNotaComPdf(id);

//     if (!nota || !nota.arquivoPdf) {
//       throw new BadRequestException('Nota não encontrada ou não possui PDF anexado.');
//     }

//     res.set({
//       'Content-Type': 'application/pdf',
//       'Content-Disposition': `attachment; filename="nota_${nota.numero_nf}.pdf"`,
//     });

//     return new StreamableFile(nota.arquivoPdf);
//   }

//   @Get()
//   @ApiOperation({ summary: 'Lista as notas fiscais (Rápido, sem trazer o PDF)' })
//   async buscarTodas() {
//     return await this.notasFiscaisService.listar();
//   }

//   @Get(':id')
//   @ApiOperation({ summary: 'Detalhes de uma nota fiscal (Rápido, sem trazer o PDF)' })
//   async buscarUma(@Param('id') id: string) {
//     return await this.notasFiscaisService.buscarPorId(id);
//   }

//   @Put(':id')
//   @ApiOperation({ summary: 'Atualizar nota fiscal (Requer Token)' })
//   @UseGuards(RolesGuard) 
//   async atualizar(
//     @Param('id') id: string, 
//     @Body() nota: UpdateNotasFiscaiDto 
//   ) {
//     return await this.notasFiscaisService.alterar(id, nota as any);
//   }

//   @Put(':id/upload-pdf')
//   @ApiOperation({ summary: 'Substituir o arquivo PDF da nota fiscal (Requer Token)' })
//   @UseGuards(RolesGuard) 
//   @ApiConsumes('multipart/form-data')
//   @UseInterceptors(FileInterceptor('file'))
//   @ApiBody({
//     description: 'Selecione o novo arquivo PDF da nota fiscal',
//     schema: {
//       type: 'object',
//       properties: {
//         file: { type: 'string', format: 'binary' },
//       },
//     },
//   })
//   async atualizarPdf(
//     @Param('id') id: string,
//     @UploadedFile() file: Express.Multer.File,
//   ) {
    
//     if (!file) {
//       throw new BadRequestException('Nenhum arquivo enviado.');
//     }

//     // 💡 MUDANÇA AQUI: Agora ele salva o novo arquivo e levanta a bandeira caso a nota não tivesse anexo
//     await this.notasFiscaisService.alterar(id, {
//       arquivoPdf: file.buffer,
//       tem_anexo: true
//     } as any);

//     return { msg: 'Arquivo PDF atualizado com sucesso!', nomeArquivo: file.originalname };
//   }

//   @Delete(':id')
//   async remover(@Param('id') id: string) {
//     return await this.notasFiscaisService.excluir(id);
//   }
// }