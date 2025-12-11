import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asistencia } from './entities/asistencia.entity';
import { Sesion } from '../sesiones/entities/sesion.entity';
import { AsistenciasService } from './asistencias.service';
import { AsistenciasController } from './asistencia.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Asistencia, Sesion])],
  providers: [AsistenciasService],
  controllers: [AsistenciasController],
  exports: [AsistenciasService],
})
export class AsistenciasModule { }
