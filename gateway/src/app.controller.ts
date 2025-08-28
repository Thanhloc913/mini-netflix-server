import { Controller, All, Req, Res, Param } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @All(':serviceName/*')
  async proxy(
    @Param('serviceName') serviceName: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.appService.proxyRequest(serviceName, req, res);
  }
}
