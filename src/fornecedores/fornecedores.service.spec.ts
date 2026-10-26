import { Test, TestingModule } from '@nestjs/testing';
import { FornecedorService } from './fornecedores.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Fornecedor } from './entities/fornecedor.entity';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

const mockFornecedorRepository = {
  create: jest.fn().mockImplementation((dto) => dto),
  save: jest.fn().mockImplementation((fornecedor) => Promise.resolve({ id: 'uuid-123', ...fornecedor })),
  find: jest.fn().mockResolvedValue([{ id: 'uuid-123', razao_social: 'Teste LTDA', ativo: true }]),
  findOne: jest.fn(),
  merge: jest.fn().mockImplementation((entity, dto) => Object.assign(entity, dto)),
  softRemove: jest.fn().mockResolvedValue(undefined),
};

describe('FornecedorService', () => {
  let service: FornecedorService;
  let repository: Repository<Fornecedor>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FornecedorService,
        {
          provide: getRepositoryToken(Fornecedor),
          useValue: mockFornecedorRepository,
        },
      ],
    }).compile();

    service = module.get<FornecedorService>(FornecedorService);
    repository = module.get<Repository<Fornecedor>>(getRepositoryToken(Fornecedor));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('deve criar e salvar um fornecedor com sucesso', async () => {
      const dto = { razao_social: 'Fornecedor Teste', ativo: true };
      const result = await service.create(dto as any);

      expect(result).toEqual({ id: 'uuid-123', ...dto });
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('deve retornar uma lista de fornecedores', async () => {
      const result = await service.findAll();
      expect(result).toEqual([{ id: 'uuid-123', razao_social: 'Teste LTDA', ativo: true }]);
      expect(repository.find).toHaveBeenCalledWith({ relations: ['notas'] });
    });
  });

  describe('findOne', () => {
    it('deve retornar um fornecedor caso ele exista', async () => {
      const fornecedorMock = { id: 'uuid-123', razao_social: 'Teste' };
      jest.spyOn(repository, 'findOne').mockResolvedValue(fornecedorMock as Fornecedor);

      const result = await service.findOne('uuid-123');
      expect(result).toEqual(fornecedorMock);
    });

    it('deve lançar NotFoundException se o fornecedor não for encontrado', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('uuid-inexistente')).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('deve executar o softRemove no fornecedor encontrado', async () => {
      const fornecedorMock = { id: 'uuid-123', razao_social: 'Teste' };
      jest.spyOn(service, 'findOne').mockResolvedValue(fornecedorMock as Fornecedor);

      await service.remove('uuid-123');
      expect(repository.softRemove).toHaveBeenCalledWith(fornecedorMock);
    });
  });
});