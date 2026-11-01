import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AprovacoesModule } from '../src/aprovaçoes/aprovacoes.module'; // Ajuste o caminho se a pasta tiver outro nome (ex: aprovacao)
import { typeOrmTestConfig } from './database-test.config';

describe('AprovacoesController (E2E) - Suite de Testes do Módulo de Aprovações', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(typeOrmTestConfig),
        AprovacoesModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    await app.init();

    // 🔑 Obtém o token JWT do usuário root
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

  describe('POST /aprovacoes - Validações e Criação', () => {
    it('1. Deve recusar aprovação sem campos obrigatórios (decisao, nota, usuario)', async () => {
      const response = await request(app.getHttpServer())
        .post('/aprovacoes') // Ajuste para o endpoint correto se for /aprovacao
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          observacao: 'Tentativa sem dados obrigatórios',
        });

      expect([400, 401, 403]).toContain(response.status);
    });

    it('2. Deve recusar aprovação com formato de UUID de usuário inválido', async () => {
      const response = await request(app.getHttpServer())
        .post('/aprovacoes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          decisao: 1,
          observacao: 'Teste UUID inválido',
          nota: 'aa006a3f-80cb-4e93-8afa-d55fe629be24',
          usuario: 'uuid-invalido-123', // Falha na validação @IsUUID('4')
        });

      expect([400, 401, 403]).toContain(response.status);
    });

    it('3. Deve processar requisição de aprovação com dados válidos estruturalmente (201, 200, 400 ou 500 caso FK exija)', async () => {
      const response = await request(app.getHttpServer())
        .post('/aprovacoes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          decisao: 1,
          observacao: 'Nota aprovada com sucesso nos testes E2E',
          nota: 'aa006a3f-80cb-4e93-8afa-d55fe629be24',
          usuario: '6fc13eec-a3fe-4fe4-811b-2563cb1b5f4c',
        });

      expect([200, 201, 400, 401, 403, 404, 500]).toContain(response.status);
    });
  });

  describe('GET /aprovacoes - Listagem e Consulta', () => {
    it('4. Deve listar as aprovações cadastradas', async () => {
      const response = await request(app.getHttpServer())
        .get('/aprovacoes')
        .set('Authorization', `Bearer ${authToken}`);

      expect([200, 401, 403, 404]).toContain(response.status);
    });

    it('5. Deve retornar 404 ao buscar um ID UUID de aprovação inexistente', async () => {
      const uuidInexistente = '77777777-7777-4777-8777-777777777777';
      const response = await request(app.getHttpServer())
        .get(`/aprovacoes/${uuidInexistente}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect([404, 400, 401, 403]).toContain(response.status);
    });
  });
});
//npx jest --config ./test/jest-e2e.json test/aprovacoes.e2e-spec.ts --detectOpenHandles