import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Usuários (E2E)', () => {
  let app: INestApplication;
  let tokenAcesso: string = '';
  const perfilIdValido: string = '354ea3ae-2584-40dc-94df-fb2d3c71f105';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    try {
      const respostaLogin = await request.default(app.getHttpServer())
        .post('/usuarios/login') 
        .send({
          email: 'admin@hidropag.com', 
          senha: 'Admin#2026' 
        });

      if (respostaLogin && respostaLogin.body) {
        tokenAcesso = respostaLogin.body.token_acesso || 
                      respostaLogin.body.token || 
                      respostaLogin.body.accessToken ||
                      respostaLogin.body.access_token || '';
      }
    } catch (err) {
      console.error('Erro ao tentar realizar o login inicial:', err);
    }
  }, 15000);

  afterAll(async () => {
    await app.close();
  });

  describe('/POST usuarios', () => {
    it('deve rejeitar a criação se o token não for enviado (Erro 401)', async () => {
      return request.default(app.getHttpServer())
        .post('/usuarios')
        .send({
          nome: 'Ivan Silva',
          email: 'sem_token@teste.com',
          senha: 'Admin#2026',
          perfil: { id: perfilIdValido }
        })
        .expect(401);
    });

    it('deve rejeitar a criação se o nome não for enviado (Erro 400)', async () => {
      return request.default(app.getHttpServer())
        .post('/usuarios')
        .set('Authorization', `Bearer ${tokenAcesso}`)
        .send({
          email: 'ivan_teste@teste.com',
          senha: 'Admin#2026',
          perfil: { id: perfilIdValido }
        })
        .expect(400); 
    });

    it('deve rejeitar a criação se a senha não for enviada (Erro 400)', async () => {
      return request.default(app.getHttpServer())
        .post('/usuarios')
        .set('Authorization', `Bearer ${tokenAcesso}`)
        .send({
          nome: 'Ivan Silva',
          email: 'ivan_teste@teste.com',
          perfil: { id: perfilIdValido }
        })
        .expect(400);
    });

    it('deve criar um usuário com sucesso se todos os dados forem válidos (Criado 201)', async () => {
      const timestamp = Date.now();
      return request.default(app.getHttpServer())
        .post('/usuarios')
        .set('Authorization', `Bearer ${tokenAcesso}`)
        .send({
          nome: `Ivan Silva Teste ${timestamp}`,
          email: `ivan_e2e_${timestamp}@teste.com`, 
          senha: 'Admin#2026', 
          perfil: { id: perfilIdValido }
        })
        .expect(201);
    });
  });

  describe('/DELETE usuarios/:id', () => {
    it('deve desativar um usuário com sucesso (Retorno 200 ou 204)', async () => {
      const timestamp = Date.now();
      const respostaNovoUsuario = await request.default(app.getHttpServer())
        .post('/usuarios')
        .set('Authorization', `Bearer ${tokenAcesso}`)
        .send({
          nome: `Usuario Para Deletar ${timestamp}`,
          email: `deletar_e2e_${timestamp}@teste.com`,
          senha: 'Admin#2026',
          perfil: { id: perfilIdValido }
        });

      const usuarioId = respostaNovoUsuario.body?.id;

      return request.default(app.getHttpServer())
        .delete(`/usuarios/${usuarioId}`)
        .set('Authorization', `Bearer ${tokenAcesso}`)
        .expect(200);
    });
  });
});