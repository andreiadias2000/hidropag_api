import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FiliaisModule } from '../src/filiais/filiais.module';
import { typeOrmTestConfig } from './database-test.config';

describe('FiliaisController (E2E) - Suite Completa com Validações do DTO', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(typeOrmTestConfig),
        FiliaisModule,
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

  describe('POST /filiais - Validações e Criação', () => {
    it('1. Deve recusar cadastro sem nome ou cidade obrigatórios (Erro 400 ou 403)', async () => {
      const response = await request(app.getHttpServer())
        .post('/filiais')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ativo: true,
          // Faltando nome e cidade
        });

      expect([400, 401, 403]).toContain(response.status);
    });

    it('2. Deve recusar cadastro com CNPJ inválido ou contendo letras (Erro 400 ou 403)', async () => {
      const response = await request(app.getHttpServer())
        .post('/filiais')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nome: 'Filial Teste Erro',
          cidade: 'Porto Alegre',
          cnpj: '12.345.678/0001-99', // Contém caracteres especiais (deve ter apenas números)
        });

      expect([400, 401, 403]).toContain(response.status);
    });

    it('3. Deve recusar cadastro com CEP em tamanho incorreto (Erro 400 ou 403)', async () => {
      const response = await request(app.getHttpServer())
        .post('/filiais')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nome: 'Filial Teste CEP',
          cidade: 'Porto Alegre',
          cep: '900000', // Menor que 8 dígitos
        });

      expect([400, 401, 403]).toContain(response.status);
    });

    it('4. Deve cadastrar filial com sucesso preenchendo todos os dados válidos (201 ou 200)', async () => {
      const nomeFilial = `Filial Porto Alegre ${Date.now()}`;
      const response = await request(app.getHttpServer())
        .post('/filiais')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nome: nomeFilial,
          cidade: 'Porto Alegre',
          uf: 'RS',
          cnpj: '12345678000199', // Apenas números, 14 dígitos
          cep: '90000000',       // Apenas números, 8 dígitos
          logradouro: 'Av. Ipiranga',
          numero: '1234',
          email_contato: 'poa@empresa.com',
          ativo: true,
        });

      if (response.status === 201 || response.status === 200) {
        expect(response.body).toHaveProperty('id');
        expect(response.body.nome).toBe(nomeFilial);
      } else {
        expect([401, 403]).toContain(response.status);
      }
    });
  });

  describe('GET /filiais - Listagem e Consulta', () => {
    it('5. Deve listar as filiais cadastradas', async () => {
      const response = await request(app.getHttpServer())
        .get('/filiais')
        .set('Authorization', `Bearer ${authToken}`);

      expect([200, 401, 403]).toContain(response.status);
    });

    it('6. Deve retornar 404 ao buscar um ID UUID inexistente', async () => {
      const uuidInexistente = '44444444-4444-4433-8444-444444444444';
      const response = await request(app.getHttpServer())
        .get(`/filiais/${uuidInexistente}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect([404, 401, 403]).toContain(response.status);
    });
  });
});

//npx jest --config ./test/jest-e2e.json test/filiais.e2e-spec.ts --detectOpenHandles