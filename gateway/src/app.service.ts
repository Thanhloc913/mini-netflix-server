import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}

  private services = {
    auth: 'http://auth-service:3000',
    movie: 'http://movie-service:3000',
    comment: 'http://comment-service:3000',
    file: 'http://file-service:3000',
  };

  async proxyRequest(serviceName: string, path: string, req: Request) {
    const target = this.services[serviceName];
    if (!target) {
      throw new NotFoundException(`Service ${serviceName} not found`);
    }

    const targetUrl = `${target}/${path}`;
    console.log(`[GATEWAY] Proxying ${req.method} ${targetUrl}`);

    try {
      // Lọc bỏ các header dễ gây treo (axios sẽ tự set lại đúng)
      const { host, 'content-length': _, connection, ...safeHeaders } = req.headers;

      const response = await firstValueFrom(
        this.httpService.request({
          url: targetUrl,
          method: req.method as any,
          headers: safeHeaders,
          data: req.body,
          validateStatus: () => true, // không throw khi 4xx, 5xx
        }),
      );

      console.log(`[GATEWAY] Success: ${response.status}`);
      return response.data; // NestJS sẽ tự JSON serialize
    } catch (error) {
      console.log(`[GATEWAY] Error:`, error.message);
      console.log(`[GATEWAY] Details:`, error.response?.data);
      throw new NotFoundException(error.response?.data || { message: 'Gateway Error' });
    }
  }
}
