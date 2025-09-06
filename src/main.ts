import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express'; // <-- AÑADIR IMPORT

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(express.json({ limit: '5mb' })); // <-- AÑADIR ESTA LÍNEA

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();