import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Filiais (E2E)', () => {
  let app: INestApplication;
  let tokenAcesso: string = '';
  let filialFixaId: string = '';

  const dadosFilialFixa = {
    nome: 'Filial Matriz de Teste E2E',
    cidade: 'Porto Alegre',
    uf: 'RS',
    cnpj: '11222333000199'
  };

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

      const respostaCriacao = await request.default(app.getHttpServer())
        .post('/FILIAIS')
        .set('Authorization', `Bearer ${tokenAcesso}`)
        .send(dadosFilialFixa);

      if (respostaCriacao.status === 201) {
        filialFixaId = respostaCriacao.body?.id;
      } else {
        const lista = await request.default(app.getHttpServer())
          .get('/FILIAIS')
          .set('Authorization', `Bearer ${tokenAcesso}`);
        
        const encontrada = lista.body?.find((f: any) => f.nome === dadosFilialFixa.nome);
        if (encontrada) {
          filialFixaId = encontrada.id;
        }
      }
    } catch (err) {
      console.error('Erro na inicialização do E2E de Filiais:', err);
    }
  }, 15000);

  afterAll(async () => {
    await app.close();
  });

  describe('/POST FILIAIS', () => {
    it('deve rejeitar a criação se o token não for enviado (Erro 401)', async () => {
      return request.default(app.getHttpServer())
        .post('/FILIAIS')
        .send({
          nome: 'Filial Sem Token',
          cidade: 'Porto Alegre',
          uf: 'RS'
        })
        .expect(401);
    });

    it('deve garantir que a filial fixa existe ou foi validada corretamente', async () => {
      expect(filialFixaId).not.toBe('');
    });

    it('deve rejeitar se o nome for duplicado (Erro 400)', async () => {
      return request.default(app.getHttpServer())
        .post('/FILIAIS')
        .set('Authorization', `Bearer ${tokenAcesso}`)
        .send({
          nome: dadosFilialFixa.nome,
          cidade: 'Outra Cidade',
          uf: 'SC'
        })
        .expect(400);
    });
  });

  describe('/GET FILIAIS', () => {
    it('deve listar todas as filiais (Retorno 200)', async () => {
      return request.default(app.getHttpServer())
        .get('/FILIAIS')
        .set('Authorization', `Bearer ${tokenAcesso}`)
        .expect(200);
    });

    it('deve buscar a filial fixa pelo ID (Retorno 200)', async () => {
      return request.default(app.getHttpServer())
        .get(`/FILIAIS/${filialFixaId}`)
        .set('Authorization', `Bearer ${tokenAcesso}`)
        .expect(200);
    });
  });

  describe('/PUT FILIAIS/:id', () => {
    it('deve atualizar os dados da filial fixa (Retorno 200)', async () => {
      return request.default(app.getHttpServer())
        .put(`/FILIAIS/${filialFixaId}`)
        .set('Authorization', `Bearer ${tokenAcesso}`)
        .send({
          nome: dadosFilialFixa.nome,
          cidade: 'Porto Alegre Alterada',
          uf: 'RS'
        })
        .expect(200);
    });
  });

  describe('/DELETE FILIAIS/:id', () => {
    it('deve remover uma filial sem vínculos permanentemente do banco (Retorno 200)', async () => {
      const timestamp = Date.now();
      const novaFilial = await request.default(app.getHttpServer())
        .post('/FILIAIS')
        .set('Authorization', `Bearer ${tokenAcesso}`)
        .send({
          nome: `Filial Sem Relacao ${timestamp}`,
          cidade: 'Teste Exclusao Fisica',
          uf: 'DF'
        });

      const tempId = novaFilial.body?.id;

      return request.default(app.getHttpServer())
        .delete(`/FILIAIS/${tempId}`)
        .set('Authorization', `Bearer ${tokenAcesso}`)
        .expect(200);
    });
  });
});