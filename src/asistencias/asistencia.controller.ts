import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AsistenciasService } from './asistencias.service';
import { ConectarSesionDto, DesconectarSesionDto, EvaluarPresenciaDto } from './dto/create-asistencia.dto';

// AUTH
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Asistencias')
@ApiBearerAuth('JWT-auth')

@Controller('asistencias')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AsistenciasController {
  constructor(private svc: AsistenciasService) { }

  // 🔵 ESTUDIANTE se conecta a la sesión
  @Post('conectar')
  @Roles('estudiante')
  @ApiOperation({
    summary: 'Marcar conexión a sesión',
    description: 'Marca el momento en que un estudiante se conecta a una sesión. Normalmente se hace automáticamente vía WebSocket, pero este endpoint permite hacerlo manualmente.'
  })
  @ApiResponse({ status: 200, description: 'Conexión registrada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o sesión no encontrada' })
  @ApiResponse({ status: 403, description: 'No autorizado - Solo estudiantes' })
  conectar(
    @Body() dto: ConectarSesionDto,
    @Req() req: any,
  ) {
    const estudianteId = req.user.id; // viene del JWT
    return this.svc.marcarConectado(dto.sesionId, estudianteId);
  }

  // 🔵 ESTUDIANTE se desconecta
  @Post('desconectar')
  @Roles('estudiante')
  @ApiOperation({
    summary: 'Marcar desconexión de sesión',
    description: 'Marca el momento en que un estudiante se desconecta de una sesión. Normalmente se hace automáticamente vía WebSocket, pero este endpoint permite hacerlo manualmente.'
  })
  @ApiResponse({ status: 200, description: 'Desconexión registrada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o sesión no encontrada' })
  @ApiResponse({ status: 403, description: 'No autorizado - Solo estudiantes' })
  desconectar(
    @Body() dto: DesconectarSesionDto,
    @Req() req: any,
  ) {
    const estudianteId = req.user.id;
    return this.svc.marcarDesconectado(dto.sesionId, estudianteId);
  }

  // 🔴 SOLO PROFESOR EVALÚA
  @Post('evaluar')
  @Roles('profesor')
  @ApiOperation({
    summary: 'Evaluar presencia de estudiante',
    description: 'Evalúa si un estudiante cumplió con el umbral mínimo de tiempo conectado (por defecto 10 minutos) para marcar su asistencia como presente.'
  })
  @ApiResponse({ status: 200, description: 'Evaluación realizada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o sesión no encontrada' })
  @ApiResponse({ status: 403, description: 'No autorizado - Solo profesores' })
  evaluar(
    @Body() dto: EvaluarPresenciaDto,
  ) {
    return this.svc.evaluarPresencia(
      dto.sesionId,
      dto.estudianteId,
      dto.umbralMin ?? 10,
    );
  }

  // 🔵 PROFESOR y ESTUDIANTE pueden ver
  @Get('sesion/:id')
  @Roles('profesor', 'estudiante')
  @ApiOperation({
    summary: 'Listar asistencias de una sesión',
    description: 'Obtiene la lista de asistencias registradas para una sesión específica'
  })
  @ApiParam({ name: 'id', description: 'ID de la sesión', type: String })
  @ApiResponse({ status: 200, description: 'Lista de asistencias obtenida exitosamente' })
  @ApiResponse({ status: 404, description: 'Sesión no encontrada' })
  listar(@Param('id') id: string) {
    return this.svc.listarPorSesion(+id);
  }
}
