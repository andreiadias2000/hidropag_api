// src/obras-empreendimentos/obras-empreendimentos.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

import { ObrasEmpreendimentosService } from './obras-empreendimentos.service';
import { Obras } from './entities/obras-empreendimento.entity';
import { Filiais } from '../filiais/entities/filiais.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { CreateObrasEmpreendimentoDto } from './dto/create-obras-empreendimento.dto';

describe('ObrasEmpreendimentosService', () => {
  let service: ObrasEmpreendimentosService;
  let obrasRepo: jest.Mocked<Repository<Obras>>;
  let filiaisRepo: jest.Mocked<Repository<Filiais>>;
  let clientesRepo: jest.Mocked<Repository<Cliente>>;

  // Fábrica para criar mocks dos métodos do TypeORM Repository
  const createMockRepo = () => ({
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    softDelete: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ObrasEmpreendimentosService,
        {
          provide: getRepositoryToken(Obras),
          useValue: createMockRepo(),
        },
        {
          provide: getRepositoryToken(Filiais),
          useValue: createMockRepo(),
        },
        {
          provide: getRepositoryToken(Cliente),
          useValue: createMockRepo(),
        },
      ],
    }).compile();

    service = module.get<ObrasEmpreendimentosService>(ObrasEmpreendimentosService);
    obrasRepo = module.get(getRepositoryToken(Obras));
    filiaisRepo = module.get(getRepositoryToken(Filiais));
    clientesRepo = module.get(getRepositoryToken(Cliente));
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('inserir', () => {
    const dtoMock: CreateObrasEmpreendimentoDto = {
      nome_obra: 'Nova Ala Cirúrgica',
      filialId: 'filial-uuid-1',
      clienteId: 'cliente-uuid-1',
      valor_previsto: 250000,
      status: 1,
      ativo: true,
    };

    it('deve lançar NotFoundException quando a filial não existir', async () => {
      filiaisRepo.findOne.mockResolvedValue(null);

      await expect(service.inserir(dtoMock)).rejects.toThrow(NotFoundException);
      expect(filiaisRepo.findOne).toHaveBeenCalledWith({ where: { id: dtoMock.filialId } });
    });

    it('deve lançar NotFoundException quando o cliente informado não existir', async () => {
      filiaisRepo.findOne.mockResolvedValue({ id: dtoMock.filialId } as Filiais);
      clientesRepo.findOne.mockResolvedValue(null);

      await expect(service.inserir(dtoMock)).rejects.toThrow(NotFoundException);
      expect(clientesRepo.findOne).toHaveBeenCalledWith({ where: { id: dtoMock.clienteId } });
    });

    it('deve lançar BadRequestException quando o nome da obra já estiver cadastrado', async () => {
      filiaisRepo.findOne.mockResolvedValue({ id: dtoMock.filialId } as Filiais);
      clientesRepo.findOne.mockResolvedValue({ id: dtoMock.clienteId } as Cliente);
      obrasRepo.findOne.mockResolvedValue({ id: 'uuid-existente', nome_obra: dtoMock.nome_obra } as Obras);

      await expect(service.inserir(dtoMock)).rejects.toThrow(BadRequestException);
    });

    it('deve cadastrar a obra com sucesso quando todos os dados forem válidos', async () => {
      const mockFilial = { id: dtoMock.filialId } as Filiais;
      const mockObraSalva = { id: 'uuid-criado', ...dtoMock, filial: mockFilial } as unknown as Obras;

      filiaisRepo.findOne.mockResolvedValue(mockFilial);
      clientesRepo.findOne.mockResolvedValue({ id: dtoMock.clienteId } as Cliente);
      obrasRepo.findOne.mockResolvedValue(null);
      obrasRepo.create.mockReturnValue(mockObraSalva);
      obrasRepo.save.mockResolvedValue(mockObraSalva);

      const resultado = await service.inserir(dtoMock);

      expect(resultado).toEqual(mockObraSalva);
      expect(obrasRepo.save).toHaveBeenCalled();
    });
  });

  describe('buscarPorId', () => {
    it('deve retornar a obra com seus relacionamentos quando encontrada', async () => {
      const mockObra = { id: 'uuid-obra', nome_obra: 'Obra Teste' } as Obras;
      obrasRepo.findOne.mockResolvedValue(mockObra);

      const resultado = await service.buscarPorId('uuid-obra');

      expect(resultado).toEqual(mockObra);
      expect(obrasRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'uuid-obra' },
        relations: ['filial', 'cliente', 'notas'],
      });
    });

    it('deve lançar NotFoundException quando a obra não existir', async () => {
      obrasRepo.findOne.mockResolvedValue(null);

      await expect(service.buscarPorId('uuid-inexistente')).rejects.toThrow(NotFoundException);
    });
  });

  describe('desativar', () => {
    it('deve marcar a obra como ativo=false sem apagar do banco', async () => {
      const mockObra = { id: 'uuid-obra', nome_obra: 'Obra Desativada', ativo: true } as Obras;
      jest.spyOn(service, 'buscarPorId').mockResolvedValue(mockObra);
      obrasRepo.save.mockResolvedValue({ ...mockObra, ativo: false });

      const resultado = await service.desativar('uuid-obra');

      expect(resultado.message).toContain('desativada com sucesso');
      expect(mockObra.ativo).toBe(false);
      expect(obrasRepo.save).toHaveBeenCalledWith(mockObra);
    });
  });

  describe('excluir', () => {
    it('deve executar o softDelete no repositório', async () => {
      const mockObra = { id: 'uuid-obra', nome_obra: 'Obra Deletada' } as Obras;
      jest.spyOn(service, 'buscarPorId').mockResolvedValue(mockObra);
      obrasRepo.softDelete.mockResolvedValue({ raw: [], affected: 1, generatedMaps: [] });

      const resultado = await service.excluir('uuid-obra');

      expect(obrasRepo.softDelete).toHaveBeenCalledWith('uuid-obra');
      expect(resultado.message).toBe('Obra removida com sucesso.');
    });
  });
});