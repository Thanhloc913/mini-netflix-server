import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';
import * as url from 'url';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) { }

  getHello(): string {
    return 'Hello World!';
  }

  private services = {
    auth: 'http://auth-service:3001',
    movie: 'http://movie-service:3002',
    comment: 'http://comment-service:3003',
    file: 'http://file-service:3004',
  };

  async proxyRequest(serviceName: string, req: Request, res: Response) {
    const target = this.services[serviceName];
    if (!target) {
      throw new NotFoundException(`Service ${serviceName} not found`);
    }

    // Build lại URL đích
    const path = req.originalUrl.replace(`/${serviceName}`, '');
    const targetUrl = url.resolve(target, path);

    try {
      const response = await firstValueFrom(
        this.httpService.request({
          url: targetUrl,
          method: req.method as any,
          headers: req.headers,
          data: req.body,
        }),
      );

      res.status(response.status).json(response.data);
    } catch (error) {
      res
        .status(error.response?.status || 500)
        .json(error.response?.data || { message: 'Gateway Error' });
    }
  }
}
