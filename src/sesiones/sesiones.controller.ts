import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiProperty } from '@nestjs/swagger';
import { SesionesService } from './sesiones.service';
import { CrearSesionDto } from './dto/create-sesion.dto';
import { QuerySesionesDto } from './dto/query-sesiones.dto';
import { IsNotEmpty, IsInt } from 'class-validator';

// AUTH IMPORTS
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

// DTO para iniciar/finalizar sesión
class ActorBodyDto {
  @ApiProperty({
    description: 'ID del profesor que realiza la acción (debe coincidir con el profesor del curso)',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  actorId: number;
}

@ApiTags('Sesiones')
@ApiBearerAuth('JWT-auth')
@Controller('sesiones')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SesionesController {
  constructor(private svc: SesionesService) { }

  // SOLO PROFESOR CREA SESIONES
  @Post()
  @Roles('profesor')
  @ApiOperation({
    summary: 'Crear una nueva sesión',
    description: 'Solo profesores pueden crear sesiones. La fecha de fin debe ser posterior a la de inicio.'
  })
  @ApiResponse({ status: 201, description: 'Sesión creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o fecha de fin anterior a inicio' })
  @ApiResponse({ status: 403, description: 'No autorizado - Solo profesores' })
  @ApiResponse({ status: 404, description: 'Curso no encontrado' })
  crear(@Body() dto: CrearSesionDto) {
    return this.svc.crear(dto);
  }

  // PROFESOR y ESTUDIANTE pueden listar sesiones
  @Get()
  @Roles('profesor', 'estudiante')
  @ApiOperation({
    summary: 'Listar sesiones',
    description: 'Obtiene lista paginada de sesiones con filtros por curso y rango de fechas'
  })
  @ApiResponse({ status: 200, description: 'Lista de sesiones obtenida exitosamente' })
  listar(@Query() query: QuerySesionesDto) {
    return this.svc.listar(query);
  }

  // PROFESOR y ESTUDIANTE pueden ver una sesión
  @Get(':id')
  @Roles('profesor', 'estudiante')
  @ApiOperation({ summary: 'Obtener una sesión por ID' })
  @ApiParam({ name: 'id', description: 'ID de la sesión', type: Number })
  @ApiResponse({ status: 200, description: 'Sesión encontrada' })
  @ApiResponse({ status: 404, description: 'Sesión no encontrada' })
  uno(@Param('id', ParseIntPipe) id: number) {
    return this.svc.buscarPorId(id);
  }

  // SOLO PROFESOR INICIA LA SESIÓN
  @Patch(':id/iniciar')
  @Roles('profesor')
  @ApiOperation({
    summary: 'Iniciar una sesión en vivo',
    description: 'Solo el profesor del curso puede iniciar la sesión. Se puede iniciar hasta 5 minutos antes de la hora programada. Emite evento WebSocket "session.started".'
  })
  @ApiParam({ name: 'id', description: 'ID de la sesión', type: Number })
  @ApiResponse({ status: 200, description: 'Sesión iniciada exitosamente' })
  @ApiResponse({ status: 400, description: 'Sesión no está en estado PROGRAMADA o fuera del margen de tiempo permitido' })
  @ApiResponse({ status: 403, description: 'No autorizado - Solo el profesor del curso' })
  @ApiResponse({ status: 404, description: 'Sesión no encontrada' })
  iniciar(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ActorBodyDto,
  ) {
    return this.svc.iniciarSesion(id, body.actorId);
  }

  // SOLO PROFESOR FINALIZA LA SESIÓN
  @Patch(':id/finalizar')
  @Roles('profesor')
  @ApiOperation({
    summary: 'Finalizar una sesión en vivo',
    description: 'Solo el profesor del curso puede finalizar la sesión. Solo se puede finalizar si está EN_VIVO. Emite evento WebSocket "session.ended" y desconecta a todos los usuarios.'
  })
  @ApiParam({ name: 'id', description: 'ID de la sesión', type: Number })
  @ApiResponse({ status: 200, description: 'Sesión finalizada exitosamente' })
  @ApiResponse({ status: 400, description: 'Sesión no está EN_VIVO o ya está finalizada' })
  @ApiResponse({ status: 403, description: 'No autorizado - Solo el profesor del curso' })
  @ApiResponse({ status: 404, description: 'Sesión no encontrada' })
  finalizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ActorBodyDto,
  ) {
    return this.svc.finalizarSesion(id, body.actorId);
  }
}
