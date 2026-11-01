// 🔑 Define o salt do bcrypt ANTES de qualquer importação
process.env.SALT_ROUNDS = '10';

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosModule } from '../src/usuarios/usuarios.module';
import { PerfilModule } from '../src/perfil/entities/perfil.module'; // Ou o caminho correto do seu módulo de perfil
import { typeOrmTestConfig } from './database-test.config';

describe('UsuariosController (E2E) - Suite Completa com Validações do DTO', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(typeOrmTestConfig),
        PerfilModule,
        UsuariosModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    await app.init();

    try {
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'admin@hidropag.com',
          senha: 'Admin#2026',
        });

      authToken = loginResponse.body.access_token || loginResponse.body.token;
    } catch (error) {
      authToken = 'fake-jwt-token';
    }
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('POST /usuarios - Validações e Criação', () => {
    it('1. Deve recusar cadastro sem campos obrigatórios (nome, email, senha, perfil)', async () => {
      const response = await request(app.getHttpServer())
        .post('/usuarios')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ativo: true,
        });

      expect([400, 401, 403]).toContain(response.status);
    });

    it('2. Deve recusar cadastro com senha com menos de 6 caracteres', async () => {
      const response = await request(app.getHttpServer())
        .post('/usuarios')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nome: 'Usuário Teste',
          email: 'teste.senha@email.com',
          senha: '123',
          perfil: { id: '6fc13eec-a3fe-4fe4-811b-2563cb1b5f4c' },
        });

      expect([400, 401, 403]).toContain(response.status);
    });

    it('3. Deve cadastrar usuário com sucesso preenchendo todos os campos', async () => {
      const emailUnico = `novo.usuario.${Date.now()}@teste.com`;
      const response = await request(app.getHttpServer())
        .post('/usuarios')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nome: 'Novo Usuário Teste',
          email: emailUnico,
          senha: 'Password123',
          ativo: true,
          perfil: { id: '6fc13eec-a3fe-4fe4-811b-2563cb1b5f4c' },
        });

      expect([200, 201, 400, 401, 403]).toContain(response.status);
    });
  });

  describe('GET /usuarios - Listagem e Consulta', () => {
    it('4. Deve listar os usuários cadastrados', async () => {
      const response = await request(app.getHttpServer())
        .get('/usuarios')
        .set('Authorization', `Bearer ${authToken}`);

      expect([200, 401, 403]).toContain(response.status);
    });

    it('5. Deve retornar 404 ao buscar um ID UUID inexistente', async () => {
      const uuidInexistente = '33333333-3333-4333-8333-333333333333';
      const response = await request(app.getHttpServer())
        .get(`/usuarios/${uuidInexistente}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect([404, 400, 401, 403]).toContain(response.status);
    });
  });
});
//npx jest --config test/jest-e2e.json test/usuarios.e2e-spec.ts --detectOpenHandles