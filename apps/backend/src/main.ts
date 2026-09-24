import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:4011',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('App Finance API')
    .setDescription(
      'Documentação interativa da API de Gestão Financeira Pessoal (Autenticação, Cartões, Receitas, Despesas e Dashboard)',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Insira o token JWT gerado na rota /auth/login ou /auth/register',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Auth', 'Registro e autenticação de usuários')
    .addTag('Cards', 'Gerenciamento de cartões')
    .addTag('Incomes', 'Gerenciamento de receitas e rendas')
    .addTag('Expenses', 'Gerenciamento de despesas e parcelas')
    .addTag('Dashboard', 'Visão geral consolidada e métricas financeiras')
    .addTag('Health', 'Verificação de integridade da API')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  const swaggerUiOptions = {
    customSiteTitle: 'App Finance - Swagger Docs',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
    },
  };

  SwaggerModule.setup('docs', app, document, swaggerUiOptions);
  SwaggerModule.setup('api/docs', app, document, swaggerUiOptions);

  const port = process.env.PORT ?? 4012;
  await app.listen(port);
  console.log(`🚀 Backend rodando em http://localhost:${port}`);
  console.log(`📚 Swagger disponível em http://localhost:${port}/docs e http://localhost:${port}/api/docs`);
}
await bootstrap();

