import { Controller, All, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  // Bắt tất cả request với pattern đơn giản
  @All('*')
  async proxy(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const fullPath = req.url;
    console.log(`[GATEWAY] Original URL: ${fullPath}`);
    
    // Parse serviceName và path từ URL
    // URL format: /serviceName/path/to/resource
    const urlParts = fullPath.split('/').filter(part => part.length > 0);
    
    if (urlParts.length === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    const serviceName = urlParts[0];
    const path = urlParts.slice(1).join('/');
    
    console.log(`[GATEWAY] Service: ${serviceName}`);
    console.log(`[GATEWAY] Path: ${path}`);
    
    return this.appService.proxyRequest(serviceName, path, req, res);
  }
}
