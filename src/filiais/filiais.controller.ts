import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { FiliaisService } from './filiais.service';
import { Filiais } from './entities/filiais.entity';

@Controller('FILIAIS')
export class FiliaisController {
  constructor(private readonly filiaisService: FiliaisService) {}

  @Post()
  async criar(@Body() dados: Filiais) {
    return await this.filiaisService.inserir(dados);
  }

  @Get()
  async buscarTodas() {
    return await this.filiaisService.listar();
  }

  @Get(':id')
  async buscarUma(@Param('id') id: string) {
    return await this.filiaisService.buscarPorId(id);
  }

  @Put(':id')
  async atualizar(@Param('id') id: string, @Body() dados: Partial<Filiais>) {
    return await this.filiaisService.alterar(id, dados);
  }

  @Delete(':id')
  async remover(@Param('id') id: string) {
    return await this.filiaisService.excluir(id);
  }
}