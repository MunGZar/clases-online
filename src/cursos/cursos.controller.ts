import { Controller, Post, Body, Get, Param, Patch, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { CursosService } from './cursos.service';
import { CrearCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { QueryCursosDto } from './dto/query-cursos.dto';

@Controller('cursos')
export class CursosController {
  constructor(private svc: CursosService) {}

  @Post()
  crear(@Body() dto: CrearCursoDto) {
    return this.svc.crear(dto);
  }

  @Get()
  listar(@Query() query: QueryCursosDto) {
    return this.svc.listar(query);
  }

  @Get(':id')
  uno(@Param('id', ParseIntPipe) id: number) {
    return this.svc.buscarPorId(id);
  }

  @Patch(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCursoDto,
  ) {
    return this.svc.actualizar(id, dto);
  }

  @Delete(':id')
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.svc.eliminar(id);
  }
}
