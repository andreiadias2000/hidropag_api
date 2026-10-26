import { Test, TestingModule } from '@nestjs/testing';
import { NotasFiscaisService } from './notas-fiscais.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Notas } from './entities/notas-fiscais.entity';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';

// Mock do Supabase Client
const mockSupabaseStorage = {
  upload: jest.fn().mockResolvedValue({ data: { path: 'pdf/arquivo.pdf' }, error: null }),
  createSignedUrls: jest.fn().mockResolvedValue({ data: [{ path: 'pdf/arquivo.pdf', signedUrl: 'https://supabase.co/url' }] }),
  createSignedUrl: jest.fn().mockResolvedValue({ data: { signedUrl: 'https://supabase.co/url' }, error: null }),
  remove: jest.fn().mockResolvedValue({ data: {}, error: null }),
};

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    storage: {
      from: jest.fn(() => mockSupabaseStorage),
    },
  })),
}));

const mockNotasRepository = {
  create: jest.fn().mockImplementation((dto) => dto),
  save: jest.fn().mockImplementation((nota) => Promise.resolve({ id: 'uuid-nota-123', ...nota })),
  find: jest.fn().mockResolvedValue([
    {
      id: 'uuid-nota-123',
      numero_nf: 1010,
      arquivoPdf: 'pdf/arquivo.pdf',
      obra: { id: 'uuid-obra-1', nome_obra: 'Obra Teste' },
      fornecedor: { id: 'uuid-fornecedor-1', razao_social: 'Fornecedor Teste LTDA' },
    },
  ]),
  findOne: jest.fn(),
  update: jest.fn().mockResolvedValue(undefined),
  delete: jest.fn().mockResolvedValue(undefined),
};

describe('NotasFiscaisService', () => {
  let service: NotasFiscaisService;
  let repository: Repository<Notas>;

  beforeEach(async () => {
    process.env.SUPABASE_URL = 'https://mock.supabase.co';
    process.env.SUPABASE_KEY = 'mock-key';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotasFiscaisService,
        {
          provide: getRepositoryToken(Notas),
          useValue: mockNotasRepository,
        },
      ],
    }).compile();

    service = module.get<NotasFiscaisService>(NotasFiscaisService);
    repository = module.get<Repository<Notas>>(getRepositoryToken(Notas));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('inserir', () => {
    it('deve inserir uma nota sem arquivo com sucesso', async () => {
      const dto = { numero_nf: 1010, valor_total: 1500.00 };
      const result = await service.inserir(dto);

      expect(result).toHaveProperty('id');
      expect(result.tem_anexo).toBe(false);
      expect(repository.save).toHaveBeenCalled();
    });

    it('deve inserir uma nota com arquivo PDF e enviar para o Supabase', async () => {
      const dto = { numero_nf: 1010 };
      const fileMock = {
        originalname: 'nota.pdf',
        buffer: Buffer.from('pdf-content'),
        mimetype: 'application/pdf',
      } as Express.Multer.File;

      const result = await service.inserir(dto, fileMock);

      expect(result.tem_anexo).toBe(true);
      expect(result.arquivoPdf).toBe('pdf/arquivo.pdf');
      expect(mockSupabaseStorage.upload).toHaveBeenCalled();
    });
  });

  describe('listar', () => {
    it('deve listar as notas fiscais incluindo dados de obra, fornecedor e link do PDF', async () => {
      const resultado = await service.listar();

      expect(resultado).toHaveLength(1);
      expect(resultado[0].link_pdf).toBe('https://supabase.co/url');
      expect(resultado[0].fornecedor).toBeDefined();
      expect(repository.find).toHaveBeenCalledWith(
        expect.objectContaining({ relations: ['obra', 'fornecedor'] })
      );
    });
  });

  describe('buscarPorId', () => {
    it('deve retornar uma nota específica com link assinado do PDF', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue({
        id: 'uuid-nota-123',
        numero_nf: 1010,
        arquivoPdf: 'pdf/arquivo.pdf',
      } as Notas);

      const result = await service.buscarPorId('uuid-nota-123');

      expect(result).toHaveProperty('id', 'uuid-nota-123');
      expect(result.link_pdf).toBe('https://supabase.co/url');
    });

    it('deve lançar NotFoundException se a nota não for encontrada', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.buscarPorId('uuid-inexistente')).rejects.toThrow(NotFoundException);
    });
  });

  describe('excluir', () => {
    it('deve remover a nota e o arquivo do Storage do Supabase', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue({
        id: 'uuid-nota-123',
        arquivoPdf: 'pdf/arquivo.pdf',
      } as Notas);

      await service.excluir('uuid-nota-123');

      expect(mockSupabaseStorage.remove).toHaveBeenCalledWith(['pdf/arquivo.pdf']);
      expect(repository.delete).toHaveBeenCalledWith('uuid-nota-123');
    });
  });
});