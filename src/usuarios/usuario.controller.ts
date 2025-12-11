import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UseGuards
} from '@nestjs/common';
import { UsuariosService } from './usuario.service';
import { CrearUsuarioDto } from './dto/create-user.dto';

// AUTH
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsuariosController {
  constructor(private svc: UsuariosService) {}

  // Solo ADMIN crea usuarios
  @Post()
  @Roles('admin')
  crear(@Body() dto: CrearUsuarioDto) {
    return this.svc.crear(dto);
  }

  // Solo ADMIN lista usuarios
  @Get()
  @Roles('admin')
  listar() {
    return this.svc.listar();
  }

  // Solo ADMIN ve un usuario
  @Get(':id')
  @Roles('admin')
  uno(@Param('id') id: string) {
    return this.svc.buscarPorId(+id);
  }

  // Solo ADMIN elimina usuarios
  @Delete(':id')
  @Roles('admin')
  eliminar(@Param('id') id: string) {
    return this.svc.eliminar(+id);
  }
}
