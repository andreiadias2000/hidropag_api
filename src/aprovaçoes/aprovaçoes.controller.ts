import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, ParseIntPipe } from '@nestjs/common';
import { AprovaçoesService } from './aprovaçoes.service';
import { APROVACOES } from './entities/aprovaçoe.entity';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateAprovaçoeDto } from './dto/create-aprovaçoe.dto';
import { UpdateAprovaçoeDto } from './dto/update-aprovaçoe.dto';

@ApiTags('APROVACOES')
@Controller('aprovaçoes') // Rota: http://localhost:3000/aprovaçoes
@ApiBearerAuth('token-acesso')
@UseGuards(RolesGuard) 
export class AprovaçoesController {
  
  constructor(private readonly aprovaçoesService: AprovaçoesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova aprovação' })
  async criar(@Body() createAprovaçoeDto: CreateAprovaçoeDto) {
    return await this.aprovaçoesService.inserir(createAprovaçoeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as aprovações' })
  async buscarTodas() {
    return await this.aprovaçoesService.listar();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma aprovação por ID' })
  async buscarUma(@Param('id', ParseIntPipe) id: number) {
    return await this.aprovaçoesService.buscarPorId(id);
  }
  
  @Put(':id')
  @ApiOperation({ summary: 'Atualizar/Dar parecer em uma aprovação' })
  async alterar(
    @Param('id', ParseIntPipe) id: number, 
    @Body() dto: UpdateAprovaçoeDto
  ): Promise<void> {
    // Valida se a aprovação existe chamando diretamente o Service
    await this.aprovaçoesService.buscarPorId(id); 
    
    const dadosAtualizacao: any = { ...dto };
    
    // Converte os IDs do DTO para o formato de objeto que a Entidade espera
    if (dto.nota) dadosAtualizacao.nota = { id: dto.nota };
    if (dto.usuario) dadosAtualizacao.usuario = { id: dto.usuario };

    // Limpa os campos antigos para não tentar inserir chaves inválidas
    delete dadosAtualizacao.notaId;
    delete dadosAtualizacao.usuarioId;

    await this.aprovaçoesService.alterar(id, dadosAtualizacao);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir uma aprovação' })
  async remover(@Param('id', ParseIntPipe) id: number) {
    return await this.aprovaçoesService.excluir(id);
  }
}