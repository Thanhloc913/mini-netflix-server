import { Controller, Post, Body, Get, Param, Patch, ParseUUIDPipe } from '@nestjs/common';
import { VideoAssetsService } from './video-assets.service';
import { CreateVideoAssetDto } from './dto/create-video-asset.dto';

@Controller('video-assets')
export class VideoAssetsController {
  constructor(private readonly videoAssetsService: VideoAssetsService) {}

  @Post()
  create(@Body() dto: CreateVideoAssetDto) {
    return this.videoAssetsService.create(dto);
  }

  @Get('movie/:movieId')
  findByMovie(@Param('movieId', ParseUUIDPipe) movieId: string) {
    return this.videoAssetsService.findByMovie(movieId);
  }

  @Get('episode/:episodeId')
  findByEpisode(@Param('episodeId', ParseUUIDPipe) episodeId: string) {
    return this.videoAssetsService.findByEpisode(episodeId);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: 'pending' | 'processing' | 'done' | 'failed',
  ) {
    return this.videoAssetsService.updateStatus(id, status);
  }
}
