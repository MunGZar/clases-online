// src/auth/auth.service.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../usuarios/usuario.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
   const user = await this.usuariosService.buscarPorCorreo(email, true);


    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const isMatch = await bcrypt.compare(password, user.clave);
    if (!isMatch) throw new UnauthorizedException('Credenciales incorrectas');

    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);

    const payload = {
      sub: user.id,
      correo: user.correo,
      rol: user.rol,  // 👈 IMPORTANTE
    };

    return {
      accessToken: this.jwtService.sign(payload),
      usuario: {
        id: user.id,
        correo: user.correo,
        rol: user.rol,
      },
    };
  }
}
