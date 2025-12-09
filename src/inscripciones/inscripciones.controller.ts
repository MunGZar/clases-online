import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { InscripcionesService } from './inscripciones.service';
import { CrearInscripcionDto } from './dto/crear-inscripcion.dto';
import { QueryInscripcionesDto } from './dto/query-inscripciones.dto';
import { UpdateInscripcionDto } from './dto/update-inscripcion.dto';

@Controller('inscripciones')
export class InscripcionesController {
  constructor(private svc: InscripcionesService) {}

  @Post()
  crear(@Body() dto: CrearInscripcionDto) {
    return this.svc.crear(dto);
  }

  @Get()
  listar(@Query() query: QueryInscripcionesDto) {
    return this.svc.listar(query);
  }

  @Get(':id')
  uno(@Param('id', ParseIntPipe) id: number) {
    return this.svc.buscarPorId(id);
  }

  @Get('curso/:cursoId')
  listarPorCurso(@Param('cursoId', ParseIntPipe) cursoId: number) {
    return this.svc.listarPorCurso(cursoId);
  }

  @Patch(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateInscripcionDto,
  ) {
    return this.svc.actualizar(id, dto);
  }

  @Patch(':id/aprobar')
  aprobar(@Param('id', ParseIntPipe) id: number) {
    return this.svc.aprobar(id);
  }

  @Delete(':id')
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.svc.eliminar(id);
  }
}
