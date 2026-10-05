// src/obras-empreendimentos/obras-empreendimentos.controller.ts

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { ObrasEmpreendimentosService } from './obras-empreendimentos.service';
import { CreateObrasEmpreendimentoDto } from './dto/create-obras-empreendimento.dto';
import { UpdateObrasEmpreendimentoDto } from './dto/update-obras-empreendimento.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Obras } from './entities/obras-empreendimento.entity';

@ApiTags('OBRAS')
@ApiBearerAuth('token-acesso')
@Controller('obras')
@UseGuards(RolesGuard)
export class ObrasEmpreendimentosController {
  constructor(
    private readonly obrasEmpreendimentosService: ObrasEmpreendimentosService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar nova obra/empreendimento' })
  @ApiResponse({ status: 201, description: 'Obra criada com sucesso.', type: Obras })
  async criar(@Body() dto: CreateObrasEmpreendimentoDto) {
    return await this.obrasEmpreendimentosService.inserir(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as obras' })
  @ApiResponse({ status: 200, type: [Obras] })
  async buscarTodas() {
    return await this.obrasEmpreendimentosService.listar();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar detalhes de uma obra pelo ID' })
  @ApiResponse({ status: 200, type: Obras })
  async buscarUma(@Param('id', ParseUUIDPipe) id: string) {
    return await this.obrasEmpreendimentosService.buscarPorId(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar dados cadastrais e financeiros da obra' })
  @ApiResponse({ status: 200, description: 'Obra atualizada com sucesso.', type: Obras })
  async atualizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateObrasEmpreendimentoDto,
  ) {
    return await this.obrasEmpreendimentosService.alterar(id, dto);
  }

  @Patch(':id/desativar')
  @ApiOperation({ summary: 'Desativar status operacional da obra (ativo = false)' })
  async desativar(@Param('id', ParseUUIDPipe) id: string) {
    return await this.obrasEmpreendimentosService.desativar(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Excluir obra (Soft Delete)' })
  async remover(@Param('id', ParseUUIDPipe) id: string) {
    return await this.obrasEmpreendimentosService.excluir(id);
  }
}