// src/aprovaçoes/aprovacoes.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  Req,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AprovacoesService } from './aprovacoes.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateAprovacoeDto } from './dto/create-aprovacoe.dto';
import { UpdateAprovacoeDto } from './dto/update-aprovacoe.dto';

@ApiTags('APROVACOES')
@Controller('aprovacoes')
@ApiBearerAuth('token-acesso')
@UseGuards(RolesGuard)
export class AprovaçoesController {
  constructor(private readonly aprovaçoesService: AprovacoesService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar uma nova aprovação (Exclusivo Gestor - Gera Carimbo)',
  })
  async criar(
    @Body() createAprovacoeDto: CreateAprovacoeDto,
    @Req() req: any,
  ) {
    return await this.aprovaçoesService.inserir(createAprovacoeDto, req?.user);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as aprovações' })
  async buscarTodas() {
    return await this.aprovaçoesService.buscarTodas();
  }

  @Get('validar/:hash')
  @ApiOperation({
    summary: 'Validar autenticidade pelo Hash SHA-256 impresso no carimbo',
  })
  async validarPorHash(@Param('hash') hash: string) {
    return await this.aprovaçoesService.validarPorHash(hash);
  }

  @Post('validar-arquivo')
  @ApiOperation({
    summary: 'Validar integridade enviando o arquivo PDF carimbado',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  async validarPorArquivo(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Envie um arquivo PDF para validação.');
    }
    return await this.aprovaçoesService.validarPorArquivo(file.buffer);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma aprovação por ID' })
  async buscarUma(@Param('id') id: string) {
    return await this.aprovaçoesService.buscarPorId(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Atualizar/Dar parecer em uma aprovação (Exclusivo Gestor)',
  })
  async alterar(
    @Param('id') id: string,
    @Body() dto: UpdateAprovacoeDto,
    @Req() req: any,
  ) {
    return await this.aprovaçoesService.alterar(id, dto, req?.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir uma aprovação' })
  async remover(@Param('id') id: string) {
    return await this.aprovaçoesService.excluir(id);
  }
}