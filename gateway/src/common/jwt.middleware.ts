import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly redisService: RedisService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // dùng originalUrl để đảm bảo còn tiền tố service (vd: /auth/login)
    if ((req as any).originalUrl?.startsWith('/auth')) {
      return next(); // bỏ qua check cho auth-service
    }

    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!);

      // check blacklist trong redis
      const isBlacklisted = await this.redisService.get(`blacklist:${(payload as any).jti}`);
      if (isBlacklisted) {
        return res.status(401).json({ message: 'Token revoked' });
      }

      (req as any).user = payload;
      next();
    } catch (err) {
      return res.status(403).json({ message: 'Forbidden' });
    }
  }
}
