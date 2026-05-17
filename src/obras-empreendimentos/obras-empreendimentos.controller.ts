import { Controller, Get, Post, Body, Param, Delete, Put, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ObrasEmpreendimentosService } from './obras-empreendimentos.service';
import { CreateObrasEmpreendimentoDto } from './dto/create-obras-empreendimento.dto';
import { UpdateObrasEmpreendimentoDto } from './dto/update-obras-empreendimento.dto';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('OBRAS')
@ApiBearerAuth('token-acesso')
@Controller('OBRAS')
@UseGuards(RolesGuard) // <--- ISSO PROTEGE O CONTROLLER INTEIRO!
export class ObrasEmpreendimentosController {
  // Mantido exatamente como o que o ivan fez: 'service'
  constructor(private readonly service: ObrasEmpreendimentosService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar nova obra' })
  // O @ApiBody manual sumiu porque o CreateObrasEmpreendimentoDto já desenha o JSON no Swagger
  async criar(@Body() obra: CreateObrasEmpreendimentoDto) { 
    return await this.service.inserir(obra);
  }

  @Get()
  async buscarTodas() {
    return await this.service.listar();
  }

  @Get(':id')
  async buscarUma(@Param('id', ParseUUIDPipe) id: string) {
    return await this.service.buscarPorId(id);
  }

  @Put(':id')
  async atualizar(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() dados: UpdateObrasEmpreendimentoDto
  ) {
    return await this.service.alterar(id, dados);
  }

  @Delete(':id')
  async remover(@Param('id', ParseUUIDPipe) id: string) {
    return await this.service.excluir(id);
  }
}



// import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
// import { ObrasEmpreendimentosService } from './obras-empreendimentos.service';
// import { Obras } from './entities/obras-empreendimento.entity';
// import { ApiBody, ApiOperation } from '@nestjs/swagger';

// @Controller('OBRAS') // Mudei para 'obras' para facilitar o teste
// export class ObrasEmpreendimentosController {
//   constructor(private readonly service: ObrasEmpreendimentosService) {}

//   @Post()
//   @ApiOperation({ summary: 'Cadastrar nova obra' })
//   @ApiBody({
//     schema: {
//       type: 'object',
//       properties: {
//         nome_obra: { type: 'string', example: 'Hospital Moinhos de Vento' },
//         filial: { 
//           type: 'object', 
//           properties: { 
//             id: { type: 'string', example: 'uuid-da-filial-aqui' } 
//           } 
//         }
//       }
//     }
//   })
//   async criar(@Body() obra: Obras) {
//   return await this.service.inserir(obra);
// }
//   @Get()
//   async buscarTodas() {
//     return await this.service.listar();
//   }

//   @Get(':id')
//   async buscarUma(@Param('id') id: string) {
//     return await this.service.buscarPorId(id);
//   }

//   @Put(':id')
//   async atualizar(@Param('id') id: string, @Body() dados: Partial<Obras>) {
//     return await this.service.alterar(id, dados);
//   }

//   @Delete(':id')
//   async remover(@Param('id') id: string) {
//     return await this.service.excluir(id);
//   }
// }
