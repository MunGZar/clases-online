import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Ignora datos que no esten en los DTO
      transform: true, // Transforma los datos a los tipos de los DTO
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
