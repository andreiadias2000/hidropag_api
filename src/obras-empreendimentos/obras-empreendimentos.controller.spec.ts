// src/obras-empreendimentos/obras-empreendimentos.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { ObrasEmpreendimentosController } from './obras-empreendimentos.controller';
import { ObrasEmpreendimentosService } from './obras-empreendimentos.service';
import { CreateObrasEmpreendimentoDto } from './dto/create-obras-empreendimento.dto';
import { UpdateObrasEmpreendimentoDto } from './dto/update-obras-empreendimento.dto';
import { RolesGuard } from '../common/guards/roles.guard';

describe('ObrasEmpreendimentosController', () => {
  let controller: ObrasEmpreendimentosController;
  let service: jest.Mocked<ObrasEmpreendimentosService>;

  const mockObrasService = {
    inserir: jest.fn(),
    listar: jest.fn(),
    buscarPorId: jest.fn(),
    alterar: jest.fn(),
    desativar: jest.fn(),
    excluir: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ObrasEmpreendimentosController],
      providers: [
        {
          provide: ObrasEmpreendimentosService,
          useValue: mockObrasService,
        },
      ],
    })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true }) // Ignora guard no teste unitário
      .compile();

    controller = module.get<ObrasEmpreendimentosController>(ObrasEmpreendimentosController);
    service = module.get(ObrasEmpreendimentosService);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('criar', () => {
    it('deve chamar o service.inserir com os dados corretos', async () => {
      const dto: CreateObrasEmpreendimentoDto = {
        nome_obra: 'Nova Obra Teste',
        filialId: 'uuid-filial',
      };
      const obraEsperada = { id: 'uuid-1', ...dto };
      mockObrasService.inserir.mockResolvedValue(obraEsperada);

      const resultado = await controller.criar(dto);

      expect(service.inserir).toHaveBeenCalledWith(dto);
      expect(resultado).toEqual(obraEsperada);
    });
  });

  describe('buscarTodas', () => {
    it('deve retornar a lista de obras do service', async () => {
      const listaEsperada = [{ id: 'uuid-1', nome_obra: 'Obra 1' }];
      mockObrasService.listar.mockResolvedValue(listaEsperada);

      const resultado = await controller.buscarTodas();

      expect(service.listar).toHaveBeenCalled();
      expect(resultado).toEqual(listaEsperada);
    });
  });

  describe('buscarUma', () => {
    it('deve retornar uma obra pelo ID', async () => {
      const obraEsperada = { id: 'uuid-1', nome_obra: 'Obra 1' };
      mockObrasService.buscarPorId.mockResolvedValue(obraEsperada);

      const resultado = await controller.buscarUma('uuid-1');

      expect(service.buscarPorId).toHaveBeenCalledWith('uuid-1');
      expect(resultado).toEqual(obraEsperada);
    });
  });

  describe('atualizar', () => {
    it('deve repassar o id e o dto de atualização para o service.alterar', async () => {
      const id = 'uuid-1';
      const dto: UpdateObrasEmpreendimentoDto = { nome_obra: 'Nome Atualizado' };
      const obraAtualizada = { id, nome_obra: 'Nome Atualizado' };
      mockObrasService.alterar.mockResolvedValue(obraAtualizada);

      const resultado = await controller.atualizar(id, dto);

      expect(service.alterar).toHaveBeenCalledWith(id, dto);
      expect(resultado).toEqual(obraAtualizada);
    });
  });

  describe('desativar', () => {
    it('deve chamar o método desativar do service', async () => {
      const resposta = { message: 'Obra desativada com sucesso.' };
      mockObrasService.desativar.mockResolvedValue(resposta);

      const resultado = await controller.desativar('uuid-1');

      expect(service.desativar).toHaveBeenCalledWith('uuid-1');
      expect(resultado).toEqual(resposta);
    });
  });

  describe('remover', () => {
    it('deve chamar o método excluir (soft delete) do service', async () => {
      const resposta = { message: 'Obra removida com sucesso.' };
      mockObrasService.excluir.mockResolvedValue(resposta);

      const resultado = await controller.remover('uuid-1');

      expect(service.excluir).toHaveBeenCalledWith('uuid-1');
      expect(resultado).toEqual(resposta);
    });
  });
});