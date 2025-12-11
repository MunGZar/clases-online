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
  UseGuards,
} from '@nestjs/common';
import { InscripcionesService } from './inscripciones.service';
import { CrearInscripcionDto } from './dto/crear-inscripcion.dto';
import { QueryInscripcionesDto } from './dto/query-inscripciones.dto';
import { UpdateInscripcionDto } from './dto/update-inscripcion.dto';

// AUTH
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('inscripciones')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InscripcionesController {
  constructor(private svc: InscripcionesService) {}

  // ESTUDIANTE crea inscripciones (se inscribe)
  @Post()
  @Roles('estudiante', 'profesor', 'admin')
  crear(@Body() dto: CrearInscripcionDto) {
    return this.svc.crear(dto);
  }

  // PROFESOR y ADMIN listan todo
  @Get()
  @Roles('profesor', 'admin')
  listar(@Query() query: QueryInscripcionesDto) {
    return this.svc.listar(query);
  }

  // ESTUDIANTE y PROFESOR pueden ver una inscripción
  @Get(':id')
  @Roles('profesor', 'estudiante', 'admin')
  uno(@Param('id', ParseIntPipe) id: number) {
    return this.svc.buscarPorId(id);
  }

  // PROFESOR ve inscripciones de su curso
  @Get('curso/:cursoId')
  @Roles('profesor', 'admin')
  listarPorCurso(@Param('cursoId', ParseIntPipe) cursoId: number) {
    return this.svc.listarPorCurso(cursoId);
  }

  // SOLO PROFESOR o ADMIN actualizan
  @Patch(':id')
  @Roles('profesor', 'admin')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateInscripcionDto,
  ) {
    return this.svc.actualizar(id, dto);
  }

  // PROFESOR aprueba inscripción
  @Patch(':id/aprobar')
  @Roles('profesor', 'admin')
  aprobar(@Param('id', ParseIntPipe) id: number) {
    return this.svc.aprobar(id);
  }

  // SOLO PROFESOR o ADMIN eliminan
  @Delete(':id')
  @Roles('profesor', 'admin')
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.svc.eliminar(id);
  }
}
