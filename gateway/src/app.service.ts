import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';
import * as httpProxy from 'http-proxy';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private proxy = httpProxy.createProxyServer();

  constructor(private readonly httpService: HttpService) {
    this.proxy.on('error', (err, _req, res: any) => {
      this.logger.error(`Proxy error: ${err.message}`);
      if (!res.headersSent) {
        res.writeHead(502, { 'Content-Type': 'application/json' });
      }
      res.end(JSON.stringify({ message: 'Bad Gateway', detail: err.message }));
    });
  }

  private services: Record<string, string | undefined> = {
    auth: process.env.AUTH_SERVICE_URL, // http://auth-service:3000
    movie: process.env.MOVIE_SERVICE_URL,
    comment: process.env.COMMENT_SERVICE_URL,
    file: process.env.FILE_SERVICE_URL,
  };

  async proxyRequest(
    serviceName: string,
    _path: string,
    req: Request,
    res: Response,
  ) {
    const targetBase = this.services[serviceName];
    if (!targetBase)
      throw new NotFoundException(`Service ${serviceName} not found`);

    // /auth/register -> restPath = /register
    const [, , ...rest] = req.url.split('/');
    const restPath = '/' + rest.join('/');

    if (req.is('multipart/form-data')) {
      // multipart: forward raw stream, KHÔNG nối thêm req.url
      const targetUrl = `${targetBase}${restPath}`;
      this.logger.log(`Proxying MULTIPART ${req.method} ${targetUrl}`);
      this.proxy.web(req, res, {
        target: targetUrl,
        changeOrigin: true,
        ignorePath: true, // quan trọng: không ghép lại req.url (/auth/register)
      });
      return;
    }

    // JSON / x-www-form-urlencoded: forward bằng axios
    const targetUrl = `${targetBase}${restPath}`;
    this.logger.log(`Proxying ${req.method} ${targetUrl}`);

    const {
      host,
      connection,
      'content-length': _cl,
      ...safeHeaders
    } = req.headers;
    const response = await firstValueFrom(
      this.httpService.request({
        url: targetUrl,
        method: req.method as any,
        headers: safeHeaders,
        data: req.body,
        validateStatus: () => true,
      }),
    );
    res.status(response.status).send(response.data);
  }
}
