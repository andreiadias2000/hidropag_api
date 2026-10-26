import { Test, TestingModule } from '@nestjs/testing';
import { NotasFiscaisController } from './notas-fiscais.controller';
import { NotasFiscaisService } from './notas-fiscais.service';

const mockNotasFiscaisService = {
  inserir: jest.fn().mockImplementation((dto, file) => Promise.resolve({ id: 'uuid-123', ...dto, tem_anexo: !!file })),
  listar: jest.fn().mockResolvedValue([{ id: 'uuid-123', numero_nf: 1010 }]),
  buscarPorId: jest.fn().mockImplementation((id) => Promise.resolve({ id, numero_nf: 1010 })),
  alterar: jest.fn().mockResolvedValue(undefined),
  substituirArquivoPdf: jest.fn().mockResolvedValue(undefined),
  excluir: jest.fn().mockResolvedValue(undefined),
};

describe('NotasFiscaisController', () => {
  let controller: NotasFiscaisController;
  let service: NotasFiscaisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotasFiscaisController],
      providers: [
        {
          provide: NotasFiscaisService,
          useValue: mockNotasFiscaisService,
        },
      ],
    }).compile();

    controller = module.get<NotasFiscaisController>(NotasFiscaisController);
    service = module.get<NotasFiscaisService>(NotasFiscaisService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('criar', () => {
    it('deve chamar o service.inserir formatando a obra e o fornecedor corretamente', async () => {
      const dto = { numero_nf: 1010, obra: 'uuid-obra-1', fornecedorId: 'uuid-fornecedor-1' };
      const fileMock = { originalname: 'nota.pdf' } as Express.Multer.File;

      const result = await controller.criar(dto as any, fileMock);

      expect(result).toHaveProperty('id', 'uuid-123');
      expect(service.inserir).toHaveBeenCalledWith(
        expect.objectContaining({
          obra: { id: 'uuid-obra-1' },
          fornecedor: { id: 'uuid-fornecedor-1' },
        }),
        fileMock
      );
    });
  });

  describe('buscarTodas', () => {
    it('deve retornar a lista de notas fiscais', async () => {
      const result = await controller.buscarTodas();
      expect(result).toEqual([{ id: 'uuid-123', numero_nf: 1010 }]);
      expect(service.listar).toHaveBeenCalled();
    });
  });

  describe('buscarUma', () => {
    it('deve retornar uma nota fiscal por ID', async () => {
      const result = await controller.buscarUma('uuid-123');
      expect(result).toEqual({ id: 'uuid-123', numero_nf: 1010 });
      expect(service.buscarPorId).toHaveBeenCalledWith('uuid-123');
    });
  });

  describe('atualizar', () => {
    it('deve atualizar os dados da nota fiscal', async () => {
      const dto = { valor_total: 2000.00 };
      await controller.atualizar('uuid-123', dto as any);
      expect(service.alterar).toHaveBeenCalledWith('uuid-123', dto);
    });
  });

  describe('atualizarPdf', () => {
    it('deve substituir o arquivo PDF com sucesso', async () => {
      const fileMock = { originalname: 'novo.pdf' } as Express.Multer.File;
      const result = await controller.atualizarPdf('uuid-123', fileMock);

      expect(result).toEqual({ msg: 'Arquivo PDF atualizado com sucesso!' });
      expect(service.substituirArquivoPdf).toHaveBeenCalledWith('uuid-123', fileMock);
    });
  });

  describe('remover', () => {
    it('deve excluir a nota fiscal', async () => {
      await controller.remover('uuid-123');
      expect(service.excluir).toHaveBeenCalledWith('uuid-123');
    });
  });
});