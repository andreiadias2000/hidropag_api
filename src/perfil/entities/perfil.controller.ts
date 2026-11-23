import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { PerfisService } from './perfil.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('perfis')
@ApiBearerAuth('token-acesso')
@Controller('perfis')
export class PerfisController {
  constructor(private readonly perfisService: PerfisService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo nível de acesso' })
  create(@Body('nome') nome: string, @Body('descricao') descricao: string) {
    return this.perfisService.criar(nome, descricao);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os perfis do sistema' })
  findAll() {
    return this.perfisService.listar();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um perfil pelo ID' })
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.perfisService.buscarPorId(id);
  }
}