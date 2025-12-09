import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Curso } from './curso.entity/curso.entity';
import { CursosService } from './cursos.service';
import { CursosController } from './cursos.controller';
import { UsuariosModule } from '../usuarios/usuario.module';

@Module({
  imports: [TypeOrmModule.forFeature([Curso]), UsuariosModule],
  providers: [CursosService],
  controllers: [CursosController],
  exports: [CursosService],
})
export class CursosModule {}
