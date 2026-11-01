import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { AprovacoesService } from './aprovacoes.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Criar uma nova aprovação' })
  async criar(@Body() createAprovacoeDto: CreateAprovacoeDto) {
    return await this.aprovaçoesService.inserir(createAprovacoeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as aprovações' })
  async buscarTodas() {
    return await this.aprovaçoesService.buscarTodas();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma aprovação por ID' })
  async buscarUma(@Param('id') id: string) { // 👈 Mudou para string (UUID)
    return await this.aprovaçoesService.buscarPorId(id);
  }
  
  @Put(':id')
  @ApiOperation({ summary: 'Atualizar/Dar parecer em uma aprovação' })
  async alterar(
    @Param('id') id: string, // 👈 Mudou para string (UUID)
    @Body() dto: UpdateAprovacoeDto
  ): Promise<void> {
    await this.aprovaçoesService.alterar(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir uma aprovação' })
  async remover(@Param('id') id: string) { // 👈 Removido o ParseIntPipe
    return await this.aprovaçoesService.excluir(id);
  }
}