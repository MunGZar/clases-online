import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inscripcion } from './inscripcion.entity/inscripcion.entity';
import { InscripcionesService } from './inscripciones.service';
import { MatriculasController } from './inscripciones.controller';
import { Curso } from '../cursos/curso.entity/curso.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inscripcion, Curso])],
  providers: [InscripcionesService],
  controllers: [MatriculasController],
  exports: [InscripcionesService],
})
export class InscripcionesModule {}
