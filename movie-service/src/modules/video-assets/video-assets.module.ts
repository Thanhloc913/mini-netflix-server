import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoAsset } from './video-asset.entity';
import { Movie } from '../movies/movie.entity';
import { Episode } from '../episodes/episode.entity';
import { VideoAssetsService } from './video-assets.service';
import { VideoAssetsController } from './video-assets.controller';
import { MovieKafkaModule } from '../../kafka/movie.kafka.module';

@Module({
  imports: [TypeOrmModule.forFeature([VideoAsset, Movie, Episode]), MovieKafkaModule],
  controllers: [VideoAssetsController],
  providers: [VideoAssetsService],
  exports: [VideoAssetsService],
})
export class VideoAssetsModule {}
