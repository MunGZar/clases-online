import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class EducativoMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    req['currentCourseId'] =
      Number(req.headers['x-course-id'] || req.params['cursoId'] || null);

    req['currentSessionId'] =
      Number(req.headers['x-session-id'] || req.params['sessionId'] || null);

    next();
  }
}
