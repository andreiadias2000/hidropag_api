import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { FornecedorService } from './fornecedores.service';
import { CreateFornecedorDto } from './dto/create-fornecedor.dto';
import { UpdateFornecedorDto } from './dto/update-fornecedor.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Fornecedor } from './entities/fornecedor.entity';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('Fornecedores')
@Controller('fornecedores')
@ApiBearerAuth('token-acesso')
@UseGuards(RolesGuard)
export class FornecedorController {
  constructor(private readonly fornecedorService: FornecedorService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar um novo fornecedor' })
  @ApiResponse({ status: 201, description: 'Fornecedor criado com sucesso.', type: Fornecedor })
  create(@Body() createFornecedorDto: CreateFornecedorDto) {
    return this.fornecedorService.create(createFornecedorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os fornecedores cadastrados' })
  @ApiResponse({ status: 200, description: 'Lista retornada com sucesso.', type: [Fornecedor] })
  findAll() {
    return this.fornecedorService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar detalhes de um fornecedor por ID' })
  @ApiResponse({ status: 200, description: 'Fornecedor encontrado.', type: Fornecedor })
  @ApiResponse({ status: 404, description: 'Fornecedor não encontrado.' })
  findOne(@Param('id') id: string) {
    return this.fornecedorService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados de um fornecedor' })
  @ApiResponse({ status: 200, description: 'Fornecedor atualizado com sucesso.', type: Fornecedor })
  @ApiResponse({ status: 404, description: 'Fornecedor não encontrado.' })
  update(@Param('id') id: string, @Body() updateFornecedorDto: UpdateFornecedorDto) {
    return this.fornecedorService.update(id, updateFornecedorDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover (Soft Delete) um fornecedor' })
  @ApiResponse({ status: 204, description: 'Fornecedor removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Fornecedor não encontrado.' })
  remove(@Param('id') id: string) {
    return this.fornecedorService.remove(id);
  }
}