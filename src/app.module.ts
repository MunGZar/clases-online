import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { JwtModule } from '@nestjs/jwt';

// Módulos
import { UsuariosModule } from './usuarios/usuario.module';
import { CursosModule } from './cursos/cursos.module';
import { SesionesModule } from './sesiones/sesiones.module';
import { InscripcionesModule } from './inscripciones/inscripciones.module';
import { AsistenciasModule } from './asistencias/asistencias.module';
import { ParticipacionesModule } from './participaciones/participaciones.module';
//import { AuthModule } from './auth/auth.module';
//import { AulaGateway } from './websocket/aula.gateway';

// Entidades para TypeORM auto-load
import { Usuario } from './usuarios/usuario.entity/usuario.entity';
import { Curso } from './cursos/curso.entity/curso.entity';
import { Sesion } from './sesiones/sesion.entity/sesion.entity';
import { Inscripcion } from './inscripciones/inscripcion.entity/inscripcion.entity';
import { Asistencia } from './asistencias/asistencia.entity/asistencia.entity';
import { Participacion } from './participaciones/participacion.entity/participacion.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({ ttl: 60, limit: 100 }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecreto',
      signOptions: { expiresIn: '8h' },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'online_classes',
      entities: [Usuario, Curso, Sesion,Inscripcion, Asistencia, Participacion],
      synchronize: false,
      migrations: ['dist/migrations/*.js'],
      migrationsRun: true,
    }),
   // AuthModule,
    UsuariosModule,
    CursosModule,
    SesionesModule,
    InscripcionesModule,
    AsistenciasModule,
    ParticipacionesModule,
  ],
  providers: [AulaGateway],
})
export class AppModule {}
