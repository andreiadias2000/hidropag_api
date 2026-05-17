import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { FiliaisService } from './filiais.service';

import { CreateFilialDto } from './dto/create-filiais.dto'; 
import { UpdateFilialDto } from './dto/update-filiais.dto'; 
import { ApiTags, ApiOperation, ApiResponse, ApiBadRequestResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('FILIAIS')
@ApiBearerAuth('token-acesso')
@Controller('FILIAIS')
@UseGuards(RolesGuard) // <--- ISSO PROTEGE O CONTROLLER INTEIRO!
export class FiliaisController {
  constructor(private readonly filiaisService: FiliaisService) {}

  @Post()
  async criar(@Body() dados: CreateFilialDto) { // <-- Alterado para o DTO de criação
    return await this.filiaisService.inserir(dados as any);
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
  async atualizar(@Param('id') id: string, @Body() dados: UpdateFilialDto) {
    return await this.filiaisService.alterar(id, dados);
  }

  @Delete(':id')
  async remover(@Param('id') id: string) {
    return await this.filiaisService.excluir(id);
  }
}
// import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
// import { FiliaisService } from './filiais.service';
// import { Filiais } from './entities/filiais.entity';

// @Controller('FILIAIS')
// export class FiliaisController {
//   constructor(private readonly filiaisService: FiliaisService) {}

//   @Post()
//   async criar(@Body() dados: Filiais) {
//     return await this.filiaisService.inserir(dados);
//   }
  

//   @Get()
//   async buscarTodas() {
//     return await this.filiaisService.listar();
//   }

//   @Get(':id')
//   async buscarUma(@Param('id') id: string) {
//     return await this.filiaisService.buscarPorId(id);
//   }

//   @Put(':id')
//   async atualizar(@Param('id') id: string, @Body() dados: Partial<Filiais>) {
//     return await this.filiaisService.alterar(id, dados);
//   }

//   @Delete(':id')
//   async remover(@Param('id') id: string) {
//     return await this.filiaisService.excluir(id);
//   }
// }