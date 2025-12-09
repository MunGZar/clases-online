import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inscripcion } from './entities/inscripcion.entity';
import { InscripcionesService } from './inscripciones.service';
import { InscripcionesController } from './inscripciones.controller';
import { Curso } from '../cursos/entities/curso.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inscripcion, Curso, Usuario])],
  providers: [InscripcionesService],
  controllers: [InscripcionesController],
  exports: [InscripcionesService],
})
export class InscripcionesModule {}
