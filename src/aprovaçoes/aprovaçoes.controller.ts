  import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, ParseIntPipe } from '@nestjs/common';
  import { AprovaçoesService } from './aprovaçoes.service';
  import { APROVACOES } from './entities/aprovaçoe.entity';
  import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
  import { RolesGuard } from '../common/guards/roles.guard';
  import { CreateAprovaçoeDto } from './dto/create-aprovaçoe.dto';
  import { UpdateAprovaçoeDto } from './dto/update-aprovaçoe.dto';



  @ApiTags('APROVACOES')
  @Controller('APROVACOES') // Rota: http://localhost:3000/APROVACOES
  @ApiBearerAuth('token-acesso')
  @UseGuards(RolesGuard) // <--- ISSO PROTEGE O CONTROLLER INTEIRO!
  export class AprovaçoesController {
    
    constructor(private readonly aprovaçoesService: AprovaçoesService) {}

    @Post()
    @ApiOperation({ summary: 'Criar uma nova aprovação' })
    async criar(@Body() createAprovaçoeDto: CreateAprovaçoeDto) {
      // Agora recebe o DTO validado
      return await this.aprovaçoesService.inserir(createAprovaçoeDto);
    }

    @Get()
    async buscarTodas() {
      return await this.aprovaçoesService.listar();
    }

    @Get(':id')
    async buscarUma(@Param('id') id: number) {
      return await this.aprovaçoesService.buscarPorId(id);
    }
    
    @Put(':id')
    @ApiOperation({ summary: 'Atualizar/Dar parecer em uma aprovação' })
    
    async alterar(id: number, dto: UpdateAprovaçoeDto): Promise<void> {
    const existe = await this.buscarUma(id); 
    
    if (existe) {
      // Como o DTO e a Entidade têm estruturas diferentes, usamos o tipo 'any' aqui
      // para poder formatar o objeto livremente antes de enviar para o banco
      const dadosAtualizacao: any = { ...dto };
      
      // Converte os IDs do DTO (notaId) para o formato de objeto que a Entidade espera (nota: { id: ... })
      if (dto.nota) dadosAtualizacao.nota = { id: dto.nota };
      if (dto.usuario) dadosAtualizacao.usuario = { id: dto.usuario };

      // Limpa os campos antigos para não tentar inserir 'notaId' em uma coluna que não existe
      delete dadosAtualizacao.notaId;
      delete dadosAtualizacao.usuarioId;

      await this.aprovaçoesService.alterar(id, dadosAtualizacao);
    }
  }
    @Delete(':id')
    async remover(@Param('id') id: number) {
      return await this.aprovaçoesService.excluir(id);
    }
  }
