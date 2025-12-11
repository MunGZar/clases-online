import { Body, Controller, Post, UseGuards, Get, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // LOGIN
  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión', description: 'Autentica un usuario y devuelve un token JWT' })
  @ApiResponse({ status: 200, description: 'Login exitoso, devuelve el token de acceso.' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
  @ApiBody({ type: LoginDto })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // OPCIONAL: VER PERFIL (requiere token)
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtener perfil', description: 'Devuelve información del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil recuperado exitosamente.' })
  @ApiResponse({ status: 401, description: 'No autorizado / Token inválido.' })
  getProfile(@Request() req) {
    return req.user;
  }
}
