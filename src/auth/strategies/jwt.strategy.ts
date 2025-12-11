// src/auth/strategies/jwt.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsuariosService } from '../../usuarios/usuario.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usuariosService: UsuariosService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'changeme_development_secret'),
    });
  }

  async validate(payload: any) {
    const user = await this.usuariosService.buscarPorId(payload.sub);
    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    return {
      id: user.id,
      correo: user.correo,
      rol: user.rol,
    };
  }
}
