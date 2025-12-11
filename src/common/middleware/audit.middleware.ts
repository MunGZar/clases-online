import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InscripcionesService } from '../../inscripciones/inscripciones.service';

@Injectable()
export class AuditMiddleware implements NestMiddleware {
  constructor(private inscSvc: InscripcionesService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const user = req['user'] as any; // viene del JwtStrategy

    //  EVITA TU ERROR: user.id SI existe porque tú lo devuelves en validate()
    if (!user || !user.id) return next();

    const sessionId = Number(req.params['id']);
    if (!sessionId) return next();

    // revisar inscripción
    const estaInscrito = await this.inscSvc.verificarInscripcion(
      user.id,
      sessionId,
    );

    if (!estaInscrito) {
      console.log(
        `[AUDITORÍA] Usuario ${user.id} intentó entrar a sesión ${sessionId} sin estar inscrito.`
      );
    }

    next();
  }
}
