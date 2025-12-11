import { 
  Injectable, 
  CanActivate, 
  ExecutionContext, 
  ForbiddenException,
  UnauthorizedException,
  BadRequestException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtener roles requeridos del decorador
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());

    // Si el endpoint no define roles => permitir acceso
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user;

    // Usuario no autenticado
    if (!user) {
      throw new UnauthorizedException('Token inválido o ausente');
    }

    // Validar que tenga rol (tu sistema usa un solo rol)
    if (!user.rol) {
      throw new BadRequestException('El usuario no tiene rol asignado en el token');
    }

    const userRole = user.rol;

    // ¿El rol del usuario coincide con alguno requerido?
    const hasRole = requiredRoles.includes(userRole);

    if (!hasRole) {
      throw new ForbiddenException(
        `Acceso denegado. Requiere uno de estos roles: [${requiredRoles.join(', ')}]`
      );
    }

    return true;
  }
}
