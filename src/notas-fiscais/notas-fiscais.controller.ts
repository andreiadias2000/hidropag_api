//notas-fiscais.controler.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, Res, StreamableFile, Put } from '@nestjs/common';
import { NotasFiscaisService } from './notas-fiscais.service';
import { Notas } from './entities/notas-fiscais.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';

@ApiTags('NOTAS') // Organiza no Swagger
@Controller('NOTAS')
export class NotasFiscaisController {
  constructor(private readonly notasFiscaisService: NotasFiscaisService) {}

  @Post()
  @ApiOperation({ summary: 'Lança uma nova nota fiscal com arquivo PDF' })
  @ApiConsumes('multipart/form-data') // CRÍTICO: Avisa que aceita arquivos
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' }, // Cria o botão de upload no Swagger
        numero_nf: { type: 'integer' },
        fornecedor: { type: 'string' },
        data_vencimento: { type: 'string', format: 'date' },
        valor_total: { type: 'number' },
        quant_parcelas: { type: 'integer' },
        status: { type: 'integer' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file')) 
  async criar(
    @Body() dados: Notas,
    @UploadedFile() file: Express.Multer.File
  ) {
    
    console.log('Arquivo recebido:', file);
    console.log('Dados recebidos:', dados);
    
    if (file) {
      // Atribui o buffer do arquivo PDF à entidade antes de salvar
      dados.arquivoPdf = file.buffer; 
    }
    
    return await this.notasFiscaisService.inserir(dados);
  }
@Get(':id/download')
@ApiOperation({ summary: 'Baixa o PDF da nota fiscal' })
async baixarPdf(@Param('id') id: string, @Res({ passthrough: true }) res: Response) {
  const nota = await this.notasFiscaisService.buscarPorId(id);

  if (!nota || !nota.arquivoPdf) {
    throw new BadRequestException('Nota não encontrada ou não possui PDF anexado.');
  }

  // Define o cabeçalho para o navegador entender que é um PDF
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename="nota_${nota.numero_nf}.pdf"`,
  });

  // Retorna o Buffer como um arquivo baixável
  return new StreamableFile(nota.arquivoPdf);
}

// @Controller('NOTAS')
// export class NotasFiscaisController {
//   constructor(private readonly notasFiscaisService: NotasFiscaisService) {}

  // @Post()
  // @UseInterceptors(FileInterceptor('file')) // 'file' é o nome do campo no Thunder Client
  // async criar(
  //   @Body() dados: Notas,
  //   @UploadedFile() file: Express.Multer.File) {
    
  //   console.log('Arquivo recebido:', file); // <-- ADICIONE ISSO
  //   console.log('Dados recebidos:', dados); // <-- ADICIONE ISSO
  //   if (file) {
  //     dados.arquivoPdf = file.buffer; // Salva o conteúdo binário do PDF
  //   }
  //   return await this.notasFiscaisService.inserir(dados);
  // }

  // @Post()
  // async criar(@Body() nota: Notas) {
  //   return await this.notasFiscaisService.inserir(nota);
  // }

  @Get()
  async buscarTodas() {
    return await this.notasFiscaisService.listar();
  }

  @Get(':id')
  async buscarUma(@Param('id') id: string) {
    return await this.notasFiscaisService.buscarPorId(id);
  }

  @Put(':id')
  async atualizar(@Param('id') id: string, @Body() nota: Partial<Notas>) {
    return await this.notasFiscaisService.alterar(id, nota);
  }

  @Delete(':id')
  async remover(@Param('id') id: string) {
    return await this.notasFiscaisService.excluir(id);
  }
}