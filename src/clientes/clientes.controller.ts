// src/clientes/clientes.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Cliente } from './entities/cliente.entity';

@ApiTags('CLIENTES')
@ApiBearerAuth('token-acesso')
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar um novo cliente' })
  @ApiResponse({
    status: 201,
    description: 'Cliente cadastrado com sucesso.',
    type: Cliente,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou CNPJ/CPF já existente.' })
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clientesService.create(createClienteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os clientes' })
  @ApiResponse({
    status: 200,
    description: 'Lista de clientes retornada com sucesso.',
    type: [Cliente],
  })
  findAll() {
    return this.clientesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar cliente pelo ID (UUID)' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    example: '6b5e1a32-159f-43b4-a212-32a24bc91001',
    description: 'Identificador único do cliente',
  })
  @ApiResponse({ status: 200, description: 'Cliente encontrado.', type: Cliente })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.clientesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados de um cliente' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    example: '6b5e1a32-159f-43b4-a212-32a24bc91001',
  })
  @ApiResponse({
    status: 200,
    description: 'Cliente atualizado com sucesso.',
    type: Cliente,
  })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateClienteDto: UpdateClienteDto,
  ) {
    return this.clientesService.update(id, updateClienteDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remover um cliente (Soft Delete / Inativação)' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    example: '6b5e1a32-159f-43b4-a212-32a24bc91001',
  })
  @ApiResponse({ status: 200, description: 'Cliente removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.clientesService.remove(id);
  }
}