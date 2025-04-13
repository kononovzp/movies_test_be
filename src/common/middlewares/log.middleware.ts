import type { NestMiddleware } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { type NextFunction, type Request, type Response } from 'express';

@Injectable()
export class LogMiddleware implements NestMiddleware {
  private logger = new Logger(LogMiddleware.name);

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl } = req;
    const requestStart = Date.now();
    const userAgent = req.get('user-agent') || '';

    res.on('finish', () => {
      const statusCode = res.statusCode.toString();
      const contentLength = res.get('content-length')?.toString() || 'unknown';
      const requestEnd = Date.now();
      const responseTime = (requestEnd - requestStart).toString();

      this.logger.verbose(
        `${method} ${originalUrl} - ${statusCode} status [${contentLength} bytes | ${responseTime} ms] (${userAgent})`,
      );
    });

    next();
  }
}
