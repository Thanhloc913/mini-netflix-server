import { Controller, All, Req, Param } from '@nestjs/common';
import type { Request } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  // Bắt tất cả method (GET, POST, PUT, DELETE)
  @All(':serviceName/*path')
  async proxy(
    @Param('serviceName') serviceName: string,
    @Param('path') path: string,
    @Req() req: Request,
  ) {
    return this.appService.proxyRequest(serviceName, path, req);
  }
}
