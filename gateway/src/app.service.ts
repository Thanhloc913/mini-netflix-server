import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly httpService: HttpService) {}

  private services = {
    auth: process.env.AUTH_SERVICE_URL,
    movie: process.env.MOVIE_SERVICE_URL,
    comment: process.env.COMMENT_SERVICE_URL,
    file: process.env.FILE_SERVICE_URL,
  };

  async proxyRequest(serviceName: string, path: string, req: Request, res: Response) {
    const target = this.services[serviceName];
    if (!target) {
      throw new NotFoundException(`Service ${serviceName} not found`);
    }

    const targetUrl = `${target}/${path}`;
    this.logger.log(`Proxying ${req.method} ${targetUrl}`);

    try {
      const { host, 'content-length': _, connection, ...safeHeaders } = req.headers;

      const response = await firstValueFrom(
        this.httpService.request({
          url: targetUrl,
          method: req.method as any,
          headers: safeHeaders,
          data: req.body,
          validateStatus: () => true,
        }),
      );

      this.logger.log(`Success: ${response.status}`);
      res.status(response.status).json(response.data);
    } catch (error) {
      this.logger.error(`Error: ${error.message}`);
      res
        .status(error.response?.status || 500)
        .json(error.response?.data || { message: 'Gateway Error' });
    }
  }
}
