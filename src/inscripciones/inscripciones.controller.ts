import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { InscripcionesService } from './inscripciones.service';
import { CrearMatriculaDto } from './dto/create-inscricones.dto';

@Controller('matriculas')
export class MatriculasController {
  constructor(private svc: InscripcionesService) {}

  @Post()
  crear(@Body() dto: CrearMatriculaDto) { return this.svc.matricular(dto.cursoId, dto.estudianteId); }

  @Get('curso/:id')
  listarPorCurso(@Param('id') id: string) { return this.svc.listarPorCurso(+id); }

  @Patch(':id/aprobar')
  aprobar(@Param('id') id: string) { return this.svc.aprobar(+id); }
}
