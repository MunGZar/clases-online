import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Participacion } from './participacion.entity/participacion.entity';
import { ParticipacionesService } from './participaciones.service';
import { ParticipacionesController } from './participaciones.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Participacion])],
  providers: [ParticipacionesService],
  controllers: [ParticipacionesController],
  exports: [ParticipacionesService],
})
export class ParticipacionesModule {}
