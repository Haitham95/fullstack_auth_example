import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

import helmet from 'helmet';
// somewhere in your initialization file

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );

  // TODO: Apply CORS for security
  app.enableCors({
    origin: ['http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'], // allowed methods
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'], // allowed headers
  });

  await app.listen(3001);
}
bootstrap();
