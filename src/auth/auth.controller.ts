import { Body, Controller, Post, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // LOGIN
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // OPCIONAL: VER PERFIL (requiere token)
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Body() user) {
    return user;
  }
}
