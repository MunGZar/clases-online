import { 
  Injectable, 
  UnauthorizedException, 
  ExecutionContext 
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {

    // Si Passport lanzó un error (token expirado, inválido, etc)
    if (err) {
      throw new UnauthorizedException('Error al procesar el token');
    }

    // Si no hay usuario → no hay token o token inválido
    if (!user) {
      const reason =
        info?.message === 'No auth token'
          ? 'No se envió token en la petición'
          : info?.message || 'Token inválido';

      throw new UnauthorizedException(reason);
    }

    // Usuario válido → permitir
    return user;
  }
}
