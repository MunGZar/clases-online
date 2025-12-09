import { Controller, Post, Body, Get, Param, Patch, Query } from '@nestjs/common';
import { SesionesService } from './sesiones.service';
import { CrearSesionDto } from './dto/create-sesion.dto';

@Controller('sesiones')
export class SesionesController {
  constructor(private svc: SesionesService) {}

  @Post()
  crear(@Body() dto: CrearSesionDto) { return this.svc.crear(dto); }

  @Get()
  listar(@Query() q) { return this.svc.listar(q); }

  @Get(':id')
  uno(@Param('id') id: string) { return this.svc.buscarPorId(+id); }

  @Patch(':id/iniciar')
  iniciar(@Param('id') id: string, @Body('actorId') actorId: number) {
    return this.svc.iniciarSesion(+id, actorId);
  }

  @Patch(':id/finalizar')
  finalizar(@Param('id') id: string, @Body('actorId') actorId: number) {
    return this.svc.finalizarSesion(+id, actorId);
  }
}
