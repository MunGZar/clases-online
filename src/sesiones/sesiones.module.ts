import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sesion } from './entities/sesion.entity';
import { SesionesService } from './sesiones.service';
import { SesionesController } from './sesiones.controller';
import { CursosModule } from '../cursos/cursos.module';
import { UsuariosModule } from '../usuarios/usuario.module';
import { Curso } from '../cursos/entities/curso.entity';

//  IMPORTAR AUTHMODULE
import { AuthModule } from '../auth/auth.module';

// IMPORTAR EL RATE LIMIT MIDDLEWARE (NUEVO)
import { RateLimitChatMiddleware } from '../common/rate-limit/rate-limit.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sesion, Curso]),
    CursosModule,
    UsuariosModule,
    AuthModule, // 👈 NECESARIO PARA JWT + ROLES + GUARDS
  ],
  providers: [SesionesService],
  controllers: [SesionesController],
  exports: [SesionesService],
})
export class SesionesModule {
  // SE AGREGA SOLO ESTO – Nada más
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateLimitChatMiddleware)
      .forRoutes({
        path: 'sessions/:id/chat',
        method: RequestMethod.ALL,
      });
  }
}
