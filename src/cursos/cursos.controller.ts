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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CursosService } from './cursos.service';
import { CrearCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { QueryCursosDto } from './dto/query-cursos.dto';

// AUTH
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Cursos')
@ApiBearerAuth('JWT-auth')
@Controller('cursos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CursosController {
  constructor(private svc: CursosService) { }

  // SOLO PROFESOR crea cursos
  @Post()
  @Roles('profesor')
  @ApiOperation({ summary: 'Crear un nuevo curso', description: 'Solo profesores pueden crear cursos' })
  @ApiResponse({ status: 201, description: 'Curso creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado - Solo profesores' })
  crear(@Body() dto: CrearCursoDto) {
    return this.svc.crear(dto);
  }

  // ESTUDIANTE y PROFESOR pueden listar
  @Get()
  @Roles('profesor', 'estudiante')
  @ApiOperation({ summary: 'Listar cursos', description: 'Obtiene lista paginada de cursos con filtros opcionales' })
  @ApiResponse({ status: 200, description: 'Lista de cursos obtenida exitosamente' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  listar(@Query() query: QueryCursosDto) {
    return this.svc.listar(query);
  }

  // ESTUDIANTE y PROFESOR pueden ver un curso
  @Get(':id')
  @Roles('profesor', 'estudiante')
  @ApiOperation({ summary: 'Obtener un curso por ID' })
  @ApiParam({ name: 'id', description: 'ID del curso', type: Number })
  @ApiResponse({ status: 200, description: 'Curso encontrado' })
  @ApiResponse({ status: 404, description: 'Curso no encontrado' })
  uno(@Param('id', ParseIntPipe) id: number) {
    return this.svc.buscarPorId(id);
  }

  // SOLO PROFESOR actualiza
  @Patch(':id')
  @Roles('profesor')
  @ApiOperation({ summary: 'Actualizar un curso', description: 'Solo profesores pueden actualizar cursos' })
  @ApiParam({ name: 'id', description: 'ID del curso', type: Number })
  @ApiResponse({ status: 200, description: 'Curso actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Curso no encontrado' })
  @ApiResponse({ status: 403, description: 'No autorizado - Solo profesores' })
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCursoDto,
  ) {
    return this.svc.actualizar(id, dto);
  }

  // SOLO PROFESOR elimina
  @Delete(':id')
  @Roles('profesor')
  @ApiOperation({ summary: 'Eliminar un curso', description: 'Solo profesores pueden eliminar cursos' })
  @ApiParam({ name: 'id', description: 'ID del curso', type: Number })
  @ApiResponse({ status: 200, description: 'Curso eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Curso no encontrado' })
  @ApiResponse({ status: 403, description: 'No autorizado - Solo profesores' })
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.svc.eliminar(id);
  }
}
