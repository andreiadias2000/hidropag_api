//src/main.ts

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

import { ValidationPipe } from '@nestjs/common'; // adicionei esta linha

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 👇 ADICIONADO CONFIGURAÇÃO DE CORS
  app.enableCors({
    origin: ['https://hidropagfront.vercel.app', 'http://localhost:3000', 'http://localhost:5173'],
    methods: 'GET,HEAD,PUT,POST,DELETE',
    credentials: true,
  });
  // Ela obriga a API a validar os dados de entrada usando os DTOs.
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,          // Remove campos enviados que não estão no DTO
    forbidNonWhitelisted: true, // Retorna erro 400 se enviarem campos extras
    transform: true,          // Converte tipos automaticamente
  }));

  const config = new DocumentBuilder()
    .setTitle('Hidropag API')
    .setDescription('Sistema de Gestão de Obras e Notas Fiscais - Senac RS')
    .setVersion('1.0')
    // AQUI ESTÁ O SEGREDO DO CADEADO:
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Insira o token JWT que você recebeu no login',
        in: 'header',
      },
      'token-acesso', // Este nome deve ser igual ao que você usará nos Controllers
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();