import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RateLimitChatMiddleware implements NestMiddleware {
  private requests = new Map<string, { count: number; timestamp: number }>();

  private readonly WINDOW_MS = 5000; // 5 segundos
  private readonly MAX_REQUESTS = 10; // máximo 10 mensajes cada 5 seg

  use(req: Request, res: Response, next: NextFunction) {
    // Aplicar SOLO a /sessions/:id/chat
    if (!req.originalUrl.match(/^\/sessions\/\d+\/chat/)) {
      return next();
    }

    const ip = req.ip || 'unknown';
    const now = Date.now();

    const record = this.requests.get(ip);

    if (!record) {
      this.requests.set(ip, { count: 1, timestamp: now });
      return next();
    }

    const elapsed = now - record.timestamp;

    if (elapsed > this.WINDOW_MS) {
      this.requests.set(ip, { count: 1, timestamp: now });
      return next();
    }

    if (record.count >= this.MAX_REQUESTS) {
      throw new BadRequestException(
        'Has enviado demasiados mensajes. Intenta nuevamente en unos segundos.',
      );
    }

    record.count++;
    this.requests.set(ip, record);

    next();
  }
}

