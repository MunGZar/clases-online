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
import { CursosService } from './cursos.service';
import { CrearCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { QueryCursosDto } from './dto/query-cursos.dto';

// AUTH
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('cursos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CursosController {
  constructor(private svc: CursosService) {}

  // SOLO PROFESOR crea cursos
  @Post()
  @Roles('profesor')
  crear(@Body() dto: CrearCursoDto) {
    return this.svc.crear(dto);
  }

  // ESTUDIANTE y PROFESOR pueden listar
  @Get()
  @Roles('profesor', 'estudiante')
  listar(@Query() query: QueryCursosDto) {
    return this.svc.listar(query);
  }

  // ESTUDIANTE y PROFESOR pueden ver un curso
  @Get(':id')
  @Roles('profesor', 'estudiante')
  uno(@Param('id', ParseIntPipe) id: number) {
    return this.svc.buscarPorId(id);
  }

  // SOLO PROFESOR actualiza
  @Patch(':id')
  @Roles('profesor')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCursoDto,
  ) {
    return this.svc.actualizar(id, dto);
  }

  // SOLO PROFESOR elimina
  @Delete(':id')
  @Roles('profesor')
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.svc.eliminar(id);
  }
}
