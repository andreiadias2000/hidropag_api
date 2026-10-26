import { Test, TestingModule } from '@nestjs/testing';
import { FornecedorController } from './fornecedores.controller';
import { FornecedorService } from './fornecedores.service';

const mockFornecedorService = {
  create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: 'uuid-123', ...dto })),
  findAll: jest.fn().mockResolvedValue([{ id: 'uuid-123', razao_social: 'Teste LTDA' }]),
  findOne: jest.fn().mockImplementation((id) => Promise.resolve({ id, razao_social: 'Teste LTDA' })),
  update: jest.fn().mockImplementation((id, dto) => Promise.resolve({ id, ...dto })),
  remove: jest.fn().mockResolvedValue(undefined),
};

describe('FornecedorController', () => {
  let controller: FornecedorController;
  let service: FornecedorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FornecedorController],
      providers: [
        {
          provide: FornecedorService,
          useValue: mockFornecedorService,
        },
      ],
    }).compile();

    controller = module.get<FornecedorController>(FornecedorController);
    service = module.get<FornecedorService>(FornecedorService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve chamar o service.create com os dados corretos', async () => {
      const dto = { razao_social: 'Novo Fornecedor' };
      const result = await controller.create(dto as any);

      expect(result).toEqual({ id: 'uuid-123', ...dto });
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('deve retornar a lista de fornecedores', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([{ id: 'uuid-123', razao_social: 'Teste LTDA' }]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve retornar um fornecedor por ID', async () => {
      const result = await controller.findOne('uuid-123');
      expect(result).toEqual({ id: 'uuid-123', razao_social: 'Teste LTDA' });
      expect(service.findOne).toHaveBeenCalledWith('uuid-123');
    });
  });

  describe('update', () => {
    it('deve atualizar o fornecedor', async () => {
      const dto = { razao_social: 'Nome Atualizado' };
      const result = await controller.update('uuid-123', dto as any);

      expect(result).toEqual({ id: 'uuid-123', ...dto });
      expect(service.update).toHaveBeenCalledWith('uuid-123', dto);
    });
  });

  describe('remove', () => {
    it('deve remover o fornecedor', async () => {
      const result = await controller.remove('uuid-123');
      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith('uuid-123');
    });
  });
});