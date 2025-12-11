import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { ParticipacionesService } from './participaciones.service';
import { CrearParticipacionDto } from './dto/create.participaciones.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Participaciones')
@ApiBearerAuth('JWT-auth')
@Controller('participaciones')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ParticipacionesController {
  constructor(private svc: ParticipacionesService) { }

  @Post()
  @Roles('estudiante')
  @ApiOperation({
    summary: 'Crear una participación',
    description: 'Registra una participación de un estudiante en una sesión (mensaje, pregunta, etc.). Normalmente se hace automáticamente vía WebSocket.'
  })
  @ApiResponse({ status: 201, description: 'Participación creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 403, description: 'No autorizado - Solo estudiantes' })
  crear(@Body() dto: CrearParticipacionDto) {
    return this.svc.crear(dto);
  }

  @Get('sesion/:id')
  @Roles('profesor', 'estudiante')
  @ApiOperation({
    summary: 'Listar participaciones de una sesión',
    description: 'Obtiene la lista de participaciones (mensajes, preguntas, etc.) registradas para una sesión específica'
  })
  @ApiParam({ name: 'id', description: 'ID de la sesión', type: String })
  @ApiResponse({ status: 200, description: 'Lista de participaciones obtenida exitosamente' })
  @ApiResponse({ status: 404, description: 'Sesión no encontrada' })
  listar(@Param('id') id: string) { return this.svc.listarPorSesion(+id); }
}
