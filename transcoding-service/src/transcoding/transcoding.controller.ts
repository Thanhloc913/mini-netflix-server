import { Controller, Post, Body } from '@nestjs/common';
import { TranscodingService } from './transcoding.service';

@Controller('transcoding')
export class TranscodingController {
  constructor(private readonly transcodingService: TranscodingService) {}

  @Post('test')
  async testEncode(@Body() body: { videoUrl: string }) {
    return this.transcodingService.handleEncode(body.videoUrl);
  }
}
