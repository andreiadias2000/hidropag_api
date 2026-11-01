import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { UsuariosModule } from '../../src/usuarios/usuarios.module';
import { Usuarios } from '../../src/usuarios/entities/usuario.entity';
import { Perfil } from '../../src/perfil/entities/perfil.entity';
import { Filiais } from '../../src/filiais/entities/filiais.entity';
import { Repository } from 'typeorm';

describe('UsuariosController (E2E) - Testes com Relacionamentos', () => {
  let app: INestApplication;
  let perfilRepository: Repository<Perfil>;
  let filialRepository: Repository<Filiais>;
  
  let perfilIdTeste: string;
  let filialIdTeste: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        // Banco SQLite em memória populando todas as entidades relacionadas ao Usuário
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Usuarios, Perfil, Filiais],
          synchronize: true,
        }),
        UsuariosModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Ativa os pipes de validação globalmente igual ao main.ts
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    
    await app.init();

    // 🛠️ PRÉ-REQUISITO DO TESTE: Criar um Perfil no banco temporário
    perfilRepository = moduleFixture.get<Repository<Perfil>>(getRepositoryToken(Perfil));
    const perfilSalvo = await perfilRepository.save({
      nome: 'root',
      descricao: 'Acesso total ao sistema',
    });
    perfilIdTeste = perfilSalvo.id as any;

    // 🛠️ PRÉ-REQUISITO DO TESTE: Criar uma Filial no banco temporário
    filialRepository = moduleFixture.get<Repository<Filiais>>(getRepositoryToken(Filiais));
    const filialSalva = await filialRepository.save({
      nome: 'Filial Central Porto Alegre',
      cidade: 'Porto Alegre',
      uf: 'RS',
    });
    filialIdTeste = filialSalva.id as any;
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('POST /usuarios - Validações e Criação', () => {
    
    it('1. Deve retornar Erro 400 ao tentar criar usuário sem enviar os campos obrigatórios', async () => {
      const response = await request(app.getHttpServer())
        .post('/usuarios')
        .send({
          nome: '', // Inválido
          email: 'email-errado', // Inválido
          senha: '123', // Muito curta
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('2. Deve criar um usuário com sucesso vinculando o Perfil e a Filial corretos (201)', async () => {
      const response = await request(app.getHttpServer())
        .post('/usuarios')
        .send({
          nome: 'Ivan Silva',
          email: 'ivan.teste@hidropag.com',
          senha: 'Admin#2026',
          ativo: true,
          perfil: {
            id: perfilIdTeste, // ID UUID gerado no beforeAll
          },
          filial: {
            id: filialIdTeste, // ID UUID gerado no beforeAll
          },
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.nome).toBe('Ivan Silva');
      expect(response.body.email).toBe('ivan.teste@hidropag.com');
    });
  });

  describe('GET /usuarios/:id - Consulta de Usuário', () => {
    it('Deve retornar 404 ao tentar buscar um UUID de usuário que não existe', async () => {
      const uuidFake = '99999999-9999-4999-8999-999999999999';
      
      const response = await request(app.getHttpServer())
        .get(`/usuarios/${uuidFake}`);

      expect(response.status).toBe(404);
    });
  });
});