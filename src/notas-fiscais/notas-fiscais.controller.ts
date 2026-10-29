// notas-fiscais.controller.ts

import { 
  Controller, Get, Post, Body, Param, Delete, UseInterceptors, 
  UploadedFile, BadRequestException, Put, UseGuards, Req, ParseUUIDPipe 
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
        fornecedorId: { type: 'string', format: 'uuid', description: 'ID do Fornecedor' },
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
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any // <-- 1. Captura a requisição completa para acessar o token decodificado
  ) {
    const notaParaSalvar: any = { 
      ...dados,
      obra: dados.obra ? { id: dados.obra } : undefined,
      fornecedor: dados.fornecedorId ? { id: dados.fornecedorId } : undefined,
      // 2. Extrai o ID numérico do usuário do token e atrela à Nota Fiscal
      usuario: req.user && req.user.id ? { id: req.user.id } : undefined, 
    };
    return await this.notasFiscaisService.inserir(notaParaSalvar, file);
  }

  @Get()
  @ApiOperation({ summary: 'Lista as notas fiscais e exibe o link do PDF no JSON' })
  async buscarTodas() {
    return await this.notasFiscaisService.listar();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhes de uma nota fiscal com o link do PDF' })
  async buscarUma(@Param('id', ParseUUIDPipe) id: string) {
    return await this.notasFiscaisService.buscarPorId(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar apenas os dados da nota fiscal' })
  async atualizar(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() nota: UpdateNotasFiscaiDto 
  ) {
    const dadosAtualizacao: any = {
      ...nota,
      obra: nota.obra ? { id: nota.obra } : undefined,
      fornecedor: nota.fornecedorId ? { id: nota.fornecedorId } : undefined,
    };
    return await this.notasFiscaisService.alterar(id, dadosAtualizacao);
  }

  @Put(':id/upload-pdf')
  @ApiOperation({ summary: 'Substituir ou adicionar apenas o arquivo PDF da nota fiscal' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } },
  })
  async atualizarPdf(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Nenhum arquivo enviado.');
    await this.notasFiscaisService.substituirArquivoPdf(id, file);
    return { msg: 'Arquivo PDF atualizado com sucesso!' };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir uma nota fiscal e seu PDF' })
  async remover(@Param('id', ParseUUIDPipe) id: string) {
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

//   @Post()
//   @ApiOperation({ summary: 'Lança uma nova nota fiscal com arquivo PDF opcional' })
//   @ApiConsumes('multipart/form-data') 
//   @ApiBody({
//     schema: {
//       type: 'object',
//       properties: {
//         file: { type: 'string', format: 'binary' },
//         numero_nf: { type: 'number' },
//         fornecedorId: { type: 'string', format: 'uuid', description: 'ID do Fornecedor' },
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
//       obra: dados.obra ? { id: dados.obra } : undefined,
//       fornecedor: dados.fornecedorId ? { id: dados.fornecedorId } : undefined,
//     };
//     return await this.notasFiscaisService.inserir(notaParaSalvar, file);
//   }

//   @Get()
//   @ApiOperation({ summary: 'Lista as notas fiscais e exibe o link do PDF no JSON' })
//   async buscarTodas() {
//     return await this.notasFiscaisService.listar();
//   }

//   @Get(':id')
//   @ApiOperation({ summary: 'Detalhes de uma nota fiscal com o link do PDF' })
//   async buscarUma(@Param('id') id: string) {
//     return await this.notasFiscaisService.buscarPorId(id);
//   }

//   @Put(':id')
//   @ApiOperation({ summary: 'Atualizar apenas os dados da nota fiscal' })
//   async atualizar(
//     @Param('id') id: string, 
//     @Body() nota: UpdateNotasFiscaiDto 
//   ) {
//     const dadosAtualizacao: any = {
//       ...nota,
//       obra: nota.obra ? { id: nota.obra } : undefined,
//       fornecedor: nota.fornecedorId ? { id: nota.fornecedorId } : undefined,
//     };
//     return await this.notasFiscaisService.alterar(id, dadosAtualizacao);
//   }

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

//   @Delete(':id')
//   @ApiOperation({ summary: 'Excluir uma nota fiscal e seu PDF' })
//   async remover(@Param('id') id: string) {
//     return await this.notasFiscaisService.excluir(id);
//   }
// }