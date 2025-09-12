import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KafkaConsumerService } from './kafka.consumer.service';
import { VideoAssetsService } from '../modules/video-assets/video-assets.service';
import { VideoAsset } from '../modules/video-assets/video-asset.entity';
import { Movie } from '../modules/movies/movie.entity';
import { Episode } from '../modules/episodes/episode.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([VideoAsset, Movie, Episode]),
  ],
  providers: [
    KafkaConsumerService,
    VideoAssetsService,
  ],
})
export class KafkaConsumerModule {}