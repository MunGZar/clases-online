import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { UsuariosService } from './usuario.service';
import { CrearUsuarioDto } from './dto/create-user.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private svc: UsuariosService) {}

  @Post()
  crear(@Body() dto: CrearUsuarioDto) { return this.svc.crear(dto); }

  @Get()
  listar() { return this.svc.listar(); }

  @Get(':id')
  uno(@Param('id') id: string) { return this.svc.buscarPorId(+id); }

  @Delete(':id')
  eliminar(@Param('id') id: string) { return this.svc.eliminar(+id); }
}
