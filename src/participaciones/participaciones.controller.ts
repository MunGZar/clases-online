import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ParticipacionesService } from './participaciones.service';

@Controller('participaciones')
export class ParticipacionesController {
  constructor(private svc: ParticipacionesService) {}

  @Post()
  crear(@Body() dto: Partial<any>) { return this.svc.crear(dto); }

  @Get('sesion/:id')
  listar(@Param('id') id: string) { return this.svc.listarPorSesion(+id); }
}
