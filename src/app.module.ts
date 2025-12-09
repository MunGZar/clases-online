import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Módulos
import { UsuariosModule } from './usuarios/usuario.module';
import { CursosModule } from './cursos/cursos.module';
import { SesionesModule } from './sesiones/sesiones.module';
import { InscripcionesModule } from './inscripciones/inscripciones.module';
import { AsistenciasModule } from './asistencias/asistencias.module';
import { ParticipacionesModule } from './participaciones/participaciones.module';

// Entidades TypeORM
import { Usuario } from './usuarios/usuario.entity/usuario.entity';
import { Curso } from './cursos/curso.entity/curso.entity';
import { Sesion } from './sesiones/sesion.entity/sesion.entity';
import { Inscripcion } from './inscripciones/inscripcion.entity/inscripcion.entity';
import { Asistencia } from './asistencias/asistencia.entity/asistencia.entity';
import { Participacion } from './participaciones/participacion.entity/participacion.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME  ,
      password: process.env.DB_PASSWORD ,
      database: process.env.DB_NAME ,
      entities: [
        Usuario,
        Curso,
        Sesion,
        Inscripcion,
        Asistencia,
        Participacion,
      ],
      synchronize: false,
      migrations: ['dist/migrations/*.js'],
      migrationsRun: true,
    }),

    // Módulos de la aplicación
    UsuariosModule,
    CursosModule,
    SesionesModule,
    InscripcionesModule,
    AsistenciasModule,
    ParticipacionesModule,
  ],
})
export class AppModule {}
