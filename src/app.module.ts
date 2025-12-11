import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Módulos
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuario.module';
import { CursosModule } from './cursos/cursos.module';
import { SesionesModule } from './sesiones/sesiones.module';
import { InscripcionesModule } from './inscripciones/inscripciones.module';
import { AsistenciasModule } from './asistencias/asistencias.module';
import { ParticipacionesModule } from './participaciones/participaciones.module';

// Entidades TypeORM
import { Usuario } from './usuarios/entities/usuario.entity';
import { Curso } from './cursos/entities/curso.entity';
import { Sesion } from './sesiones/entities/sesion.entity';
import { Inscripcion } from './inscripciones/entities/inscripcion.entity';
import { Asistencia } from './asistencias/entities/asistencia.entity';
import { Participacion } from './participaciones/entities/participacion.entity';

// Middlewares
import { EducativoMiddleware } from './common/middleware/educativo.middleware';
import { AuditMiddleware } from './common/middleware/audit.middleware';

// AGREGADO: rate-limit
import { RateLimitChatMiddleware } from './common/rate-limit/rate-limit.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        Usuario,
        Curso,
        Sesion,
        Inscripcion,
        Asistencia,
        Participacion,
      ],
      synchronize: true,
      logging: true,
    }),

    //  AUTH DEBE IMPORTARSE ANTES QUE LOS DEMÁS MÓDULOS
    AuthModule,

    // Módulos de la aplicación
    UsuariosModule,
    CursosModule,
    SesionesModule,
    InscripcionesModule,
    AsistenciasModule,
    ParticipacionesModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Middleware educativo
    consumer.apply(EducativoMiddleware).forRoutes('*');

    // Audit middleware: solo para sesiones
    consumer.apply(AuditMiddleware).forRoutes('sessions/:id');

    //  Rate limit SOLO para /sessions/:id/chat
    consumer
      .apply(RateLimitChatMiddleware)
      .forRoutes('sessions/:id/chat');
  }
}
