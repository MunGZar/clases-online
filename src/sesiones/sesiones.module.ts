import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sesion } from './sesion.entity/sesion.entity';
import { SesionesService } from './sesiones.service';
import { SesionesController } from './sesiones.controller';
import { CursosModule } from '../cursos/cursos.module';
import { UsuariosModule } from '../usuarios/usuario.module';

@Module({
  imports: [TypeOrmModule.forFeature([Sesion]), CursosModule, UsuariosModule],
  providers: [SesionesService],
  controllers: [SesionesController],
  exports: [SesionesService],
})
export class SesionesModule {}
