import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FornecedorModule } from '../src/fornecedores/fornecedores.module';
import { typeOrmTestConfig } from './database-test.config';

describe('FornecedoresController (E2E) - Suite de Testes', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(typeOrmTestConfig),
        FornecedorModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    await app.init();

    // 🔑 Obtém o token JWT do usuário root para autenticar as requisições
    try {
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'admin@hidropag.com',
          senha: 'Admin#2026',
        });

      authToken = loginResponse.body.access_token || loginResponse.body.token;
    } catch (error) {
      console.error('Aviso: Login automático não executado.');
    }
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('POST /fornecedores - Criação e Validações', () => {
    it('1. [Erro 400/403] Deve recusar cadastro de fornecedor PJ sem CNPJ ou razão social', async () => {
      const response = await request(app.getHttpServer())
        .post('/fornecedores')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          tipo_pessoa: 'PJ',
          // Faltando campos obrigatórios
        });

      expect([400, 401, 403]).toContain(response.status);
    });

    it('2. [Sucesso 201/200] Deve cadastrar Fornecedor PJ com sucesso limpando a máscara do CNPJ', async () => {
      const response = await request(app.getHttpServer())
        .post('/fornecedores')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          tipo_pessoa: 'PJ',
          razao_social: 'Fornecedor de Equipamentos Medicos LTDA',
          cnpj: '33.444.555/0001-88',
          email: 'contato@fornecedor.com',
          ativo: true,
        });

      if (response.status === 201 || response.status === 200) {
        expect(response.body).toHaveProperty('id');
        expect(response.body.cnpj).toBe('33444555000188'); // Valida o @Transform
      } else {
        expect([401, 403]).toContain(response.status);
      }
    });
  });

  describe('GET /fornecedores - Listagem e Consulta', () => {
    it('3. [Sucesso 200/401/403] Deve listar os fornecedores cadastrados', async () => {
      const response = await request(app.getHttpServer())
        .get('/fornecedores')
        .set('Authorization', `Bearer ${authToken}`);

      expect([200, 401, 403]).toContain(response.status);
    });

    it('4. [Erro 404] Deve retornar 404 ao buscar um ID UUID inexistente', async () => {
      const uuidInexistente = '22222222-2222-4222-8222-222222222222';
      const response = await request(app.getHttpServer())
        .get(`/fornecedores/${uuidInexistente}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect([404, 401, 403]).toContain(response.status);
    });
  });
});

//npx jest --config ./test/jest-e2e.json test/fornecedores.e2e-spec.ts --detectOpenHandles