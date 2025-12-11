import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Seguridad: Helmet
  app.use(helmet());

  // Seguridad: CORS con dos orígenes
  app.enableCors({
    origin: [
      'https://frontend-estudiantes.com',
      'https://frontend-profesores.com',
    ],
    methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
    credentials: true,
  });

  // Logs básicos
  const logger = new Logger('Bootstrap');
  logger.log('CORS habilitado para estudiantes y profesores');
  logger.log('Helmet habilitado');
  logger.log('Aplicación iniciando...');

  //  globales de validación
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
  logger.log(`Aplicación escuchando en el puerto ${process.env.PORT ?? 3000}`);
}

bootstrap();
