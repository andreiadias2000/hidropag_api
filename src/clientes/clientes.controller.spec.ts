// src/clientes/clientes.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { ClientesController } from './clientes.controller';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

describe('ClientesController', () => {
  let controller: ClientesController;
  let service: ClientesService;

  // Criamos o objeto mock com as mesmas assinaturas de métodos do ClientesService
  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    // Montamos o módulo de teste isolado do NestJS
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientesController],
      providers: [
        {
          // Substituímos o serviço real pelo nosso mock
          provide: ClientesService,
          useValue: mockService,
        },
      ],
    }).compile();

    // Recuperamos as instâncias criadas pelo módulo de teste
    controller = module.get<ClientesController>(ClientesController);
    service = module.get<ClientesService>(ClientesService);

    // Limpamos o histórico de chamadas dos mocks antes de cada teste
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    // Garante que o controller foi instanciado corretamente
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve reencaminhar a solicitação de criação para o serviço', () => {
      const dto = new CreateClienteDto();
      const respostaEsperada = 'This action adds a new cliente';

      // Simulamos o retorno do método create do service
      mockService.create.mockReturnValue(respostaEsperada);

      const resultado = controller.create(dto);

      // Valida se o controller passou o DTO correto para o service
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(resultado).toBe(respostaEsperada);
    });
  });

  describe('findAll', () => {
    it('deve invocar o método de busca de todos os clientes', () => {
      const respostaEsperada = 'This action returns all clientes';
      mockService.findAll.mockReturnValue(respostaEsperada);

      const resultado = controller.findAll();

      // Valida se o método findAll foi chamado sem parâmetros
      expect(service.findAll).toHaveBeenCalled();
      expect(resultado).toBe(respostaEsperada);
    });
  });

  describe('findOne', () => {
    it('deve converter o parâmetro de texto em numérico ao pesquisar por ID', () => {
      const respostaEsperada = 'This action returns a #7 cliente';
      mockService.findOne.mockReturnValue(respostaEsperada);

      // O controller recebe '7' (string) da rota e converte com +id para 7 (number)
      const resultado = controller.findOne('7');

      expect(service.findOne).toHaveBeenCalledWith(7);
      expect(resultado).toBe(respostaEsperada);
    });
  });

  describe('update', () => {
    it('deve converter o ID e transmitir o DTO ao atualizar', () => {
      const dto = new UpdateClienteDto();
      const respostaEsperada = 'This action updates a #3 cliente';
      mockService.update.mockReturnValue(respostaEsperada);

      // O controller recebe '3' (string) e repassa 3 (number) e o dto[cite: 4]
      const resultado = controller.update('3', dto);

      expect(service.update).toHaveBeenCalledWith(3, dto);
      expect(resultado).toBe(respostaEsperada);
    });
  });

  describe('remove', () => {
    it('deve converter o ID ao solicitar a remoção', () => {
      const respostaEsperada = 'This action removes a #9 cliente';
      mockService.remove.mockReturnValue(respostaEsperada);

      // O controller recebe '9' (string) e repassa 9 (number)[cite: 4]
      const resultado = controller.remove('9');

      expect(service.remove).toHaveBeenCalledWith(9);
      expect(resultado).toBe(respostaEsperada);
    });
  });
});