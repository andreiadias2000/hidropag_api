// src/clientes/clientes.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { ClientesController } from './clientes.controller';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

describe('ClientesController', () => {
  let controller: ClientesController;
  let service: jest.Mocked<ClientesService>;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientesController],
      providers: [
        {
          provide: ClientesService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ClientesController>(ClientesController);
    service = module.get(ClientesService);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('deve reencaminhar a solicitação de criação para o serviço', () => {
    const dto = new CreateClienteDto();
    mockService.create.mockReturnValue('cliente criado');

    const resultado = controller.create(dto);

    expect(service.create).toHaveBeenCalledWith(dto);
    expect(resultado).toBe('cliente criado');
  });

  it('deve invocar o método de busca de todos os clientes', () => {
    mockService.findAll.mockReturnValue('todos os clientes');

    const resultado = controller.findAll();

    expect(service.findAll).toHaveBeenCalled();
    expect(resultado).toBe('todos os clientes');
  });

  it('deve converter o parâmetro de texto em numérico ao pesquisar por ID', () => {
    mockService.findOne.mockReturnValue('cliente específico');

    const resultado = controller.findOne('7');

    expect(service.findOne).toHaveBeenCalledWith(7);
    expect(resultado).toBe('cliente específico');
  });

  it('deve converter o ID e transmitir o DTO ao atualizar', () => {
    const dto = new UpdateClienteDto();
    mockService.update.mockReturnValue('cliente alterado');

    const resultado = controller.update('3', dto);

    expect(service.update).toHaveBeenCalledWith(3, dto);
    expect(resultado).toBe('cliente alterado');
  });

  it('deve converter o ID ao solicitar a remoção', () => {
    mockService.remove.mockReturnValue('cliente removido');

    const resultado = controller.remove('9');

    expect(service.remove).toHaveBeenCalledWith(9);
    expect(resultado).toBe('cliente removido');
  });
});