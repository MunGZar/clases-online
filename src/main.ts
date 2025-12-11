import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Seguridad: Helmet
  app.use(helmet());

  // Seguridad: CORS con dos orígenes (producción) + localhost (desarrollo)
  app.enableCors({
    origin: [
      'https://frontend-estudiantes.com',
      'https://frontend-profesores.com',
      'http://localhost:3000',
      'http://localhost:4200',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5500', // Live Server VS Code
      'null', // Archivos locales (file://)
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

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Clases Online')
    .setDescription(
      'API REST y WebSocket para gestión de clases en vivo con asistencia y participación en tiempo real. ' +
      'Incluye autenticación JWT, gestión de cursos, sesiones, inscripciones, asistencias y participaciones.\n\n' +
      '**Nota:** La documentación completa de eventos WebSocket está disponible en el archivo `websocket-events.docs.md`. ' +
      'Los eventos WebSocket incluyen: join_session, send_message, ask_question, y eventos del servidor como session.started, session.ended, etc.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingrese su token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Auth', 'Autenticación y autorización')
    .addTag('Cursos', 'Gestión de cursos')
    .addTag('Sesiones', 'Gestión de sesiones en vivo')
    .addTag('Inscripciones', 'Inscripciones de estudiantes a cursos')
    .addTag('Asistencias', 'Control de asistencia automática')
    .addTag('Participaciones', 'Registro de participaciones en sesiones')
    .addTag('WebSocket', 'Eventos en tiempo real - Ver documentación completa en websocket-events.docs.md')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  logger.log('Swagger documentación disponible en /api/docs');

  await app.listen(process.env.PORT ?? 3000);
  logger.log(`Aplicación escuchando en el puerto ${process.env.PORT ?? 3000}`);
}

bootstrap();
