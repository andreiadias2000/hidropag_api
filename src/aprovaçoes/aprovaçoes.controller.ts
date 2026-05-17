import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { AprovaçoesService } from './aprovaçoes.service';
import { APROVACOES } from './entities/aprovaçoe.entity';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../common/guards/roles.guard';



@ApiTags('APROVACOES')
@Controller('APROVACOES') // Rota: http://localhost:3000/APROVACOES
@ApiBearerAuth('token-acesso')
@UseGuards(RolesGuard) // <--- ISSO PROTEGE O CONTROLLER INTEIRO!
export class AprovaçoesController {
  
  constructor(private readonly aprovaçoesService: AprovaçoesService) {}

  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        decisao: { type: 'number', example: '1 aprovado 2 aguardando aprovação' },
        observacao: { type: 'string', example: 'Nota aprovada' },
        nota: { 
          type: 'object', 
          properties: { id: { type: 'string', example: 'uuid-da-nota-aqui' } } 
        },
        usuario: { 
          type: 'object', 
          properties: { id: { type: 'number', example: 'uuid-do-usuario' } }
        }
      }
    }
  })
  async criar(@Body() aprovacao: APROVACOES) {
    return await this.aprovaçoesService.inserir(aprovacao);
  }

  @Get()
  async buscarTodas() {
    return await this.aprovaçoesService.listar();
  }

  @Get(':id')
  async buscarUma(@Param('id') id: string) {
    return await this.aprovaçoesService.buscarPorId(id);
  }

  @Delete(':id')
  async remover(@Param('id') id: string) {
    return await this.aprovaçoesService.excluir(id);
  }
}
