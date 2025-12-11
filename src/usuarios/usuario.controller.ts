import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { UsuariosService } from './usuario.service';
import { CrearUsuarioDto } from './dto/create-user.dto';

// AUTH
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Usuarios')
@ApiBearerAuth('JWT-auth')
@Controller('usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsuariosController {
  constructor(private readonly svc: UsuariosService) {}

  // Solo ADMIN crea usuarios
  @Post()
  @Roles('admin')
  @ApiOperation({ 
    summary: 'Crear un nuevo usuario', 
    description: 'Solo administradores pueden crear usuarios. Se puede especificar el rol (estudiante, profesor, admin).' 
  })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 403, description: 'No autorizado - Solo administradores' })
  crear(@Body() dto: CrearUsuarioDto) {
    return this.svc.crear(dto);
  }

  // Solo ADMIN lista usuarios
  @Get()
  @Roles('admin')
  @ApiOperation({ 
    summary: 'Listar todos los usuarios', 
    description: 'Obtiene la lista completa de usuarios registrados en el sistema' 
  })
  @ApiResponse({ status: 200, description: 'Lista de usuarios obtenida exitosamente' })
  @ApiResponse({ status: 403, description: 'No autorizado - Solo administradores' })
  listar() {
    return this.svc.listar();
  }

  // Solo ADMIN ve un usuario
  @Get(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiParam({ name: 'id', description: 'ID del usuario', type: String })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({ status: 403, description: 'No autorizado - Solo administradores' })
  uno(@Param('id') id: string) {
    return this.svc.buscarPorId(+id);
  }

  // Solo ADMIN elimina usuarios
  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ 
    summary: 'Eliminar un usuario', 
    description: 'Elimina permanentemente un usuario del sistema' 
  })
  @ApiParam({ name: 'id', description: 'ID del usuario a eliminar', type: String })
  @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({ status: 403, description: 'No autorizado - Solo administradores' })
  eliminar(@Param('id') id: string) {
    return this.svc.eliminar(+id);
  }
}
