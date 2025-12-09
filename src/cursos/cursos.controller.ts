import { Controller, Post, Body, Get, Param, Patch, Delete, Query } from '@nestjs/common';
import { CursosService } from './cursos.service';
import { CrearCursoDto } from './dto/create-curso.dto';

@Controller('cursos')
export class CursosController {
  constructor(private svc: CursosService) {}

  @Post()
  crear(@Body() dto: CrearCursoDto) { return this.svc.crear(dto); }

  @Get()
  listar(@Query() q) { return this.svc.listar(q); }

  @Get(':id')
  uno(@Param('id') id: string) { return this.svc.buscarPorId(+id); }

  @Patch(':id')
  actualizar(@Param('id') id: string, @Body() body: Partial<CrearCursoDto>) { return this.svc.actualizar(+id, body); }

  @Delete(':id')
  eliminar(@Param('id') id: string) { return this.svc.eliminar(+id); }
}
