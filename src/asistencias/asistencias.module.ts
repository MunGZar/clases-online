import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asistencia } from './asistencia.entity/asistencia.entity';
import { AsistenciasService } from './asistencias.service';
import { AsistenciasController } from './asistencia.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Asistencia])],
  providers: [AsistenciasService],
  controllers: [AsistenciasController],
  exports: [AsistenciasService],
})
export class AsistenciasModule {}
