import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AsistenciasService } from './asistencias.service';

@Controller('asistencias')
export class AsistenciasController {
  constructor(private svc: AsistenciasService) {}

  @Post('conectar')
  conectar(@Body() b: { sesionId: number; estudianteId: number }) {
    return this.svc.marcarConectado(b.sesionId, b.estudianteId);
  }

  @Post('desconectar')
  desconectar(@Body() b: { sesionId: number; estudianteId: number }) {
    return this.svc.marcarDesconectado(b.sesionId, b.estudianteId);
  }

  @Post('evaluar')
  evaluar(@Body() b: { sesionId: number; estudianteId: number; umbralMin?: number }) {
    return this.svc.evaluarPresencia(b.sesionId, b.estudianteId, b.umbralMin ?? 10);
  }

  @Get('sesion/:id')
  listar(@Param('id') id: string) { return this.svc.listarPorSesion(+id); }
}
