import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoAsset } from './video-asset.entity';
import { Movie } from '../movies/movie.entity';
import { Episode } from '../episodes/episode.entity';
import { VideoAssetsService } from './video-assets.service';
import { VideoAssetsController } from './video-assets.controller';
import { KafkaProducerModule } from '../../kafka/kafka.producer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VideoAsset, Movie, Episode]), 
    KafkaProducerModule,
  ],
  controllers: [VideoAssetsController],
  providers: [VideoAssetsService],
  exports: [VideoAssetsService],
})
export class VideoAssetsModule {}