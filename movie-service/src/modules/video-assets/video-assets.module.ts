import { Module } from '@nestjs/common';
import { VideoAssetsService } from './video-assets.service';
import { VideoAssetsController } from './video-assets.controller';

@Module({
  providers: [VideoAssetsService],
  controllers: [VideoAssetsController]
})
export class VideoAssetsModule {}
