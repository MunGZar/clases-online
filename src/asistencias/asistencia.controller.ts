import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AsistenciasService } from './asistencias.service';

// AUTH
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('asistencias')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AsistenciasController {
  constructor(private svc: AsistenciasService) {}

  // 🔵 ESTUDIANTE se conecta a la sesión
  @Post('conectar')
  @Roles('estudiante')
  conectar(
    @Body() b: { sesionId: number },
    @Req() req: any,
  ) {
    const estudianteId = req.user.id; // viene del JWT
    return this.svc.marcarConectado(b.sesionId, estudianteId);
  }

  // 🔵 ESTUDIANTE se desconecta
  @Post('desconectar')
  @Roles('estudiante')
  desconectar(
    @Body() b: { sesionId: number },
    @Req() req: any,
  ) {
    const estudianteId = req.user.id;
    return this.svc.marcarDesconectado(b.sesionId, estudianteId);
  }

  // 🔴 SOLO PROFESOR EVALÚA
  @Post('evaluar')
  @Roles('profesor')
  evaluar(
    @Body() b: { sesionId: number; estudianteId: number; umbralMin?: number },
  ) {
    return this.svc.evaluarPresencia(
      b.sesionId,
      b.estudianteId,
      b.umbralMin ?? 10,
    );
  }

  // 🔵 PROFESOR y ESTUDIANTE pueden ver
  @Get('sesion/:id')
  @Roles('profesor', 'estudiante')
  listar(@Param('id') id: string) {
    return this.svc.listarPorSesion(+id);
  }
}
