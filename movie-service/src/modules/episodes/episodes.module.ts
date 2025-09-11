import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Episode } from './episode.entity';
import { Movie } from '../movies/movie.entity';
import { EpisodesController } from './episodes.controller';
import { EpisodesService } from './episodes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Episode, Movie])],
  controllers: [EpisodesController],
  providers: [EpisodesService],
  exports: [EpisodesService],
})
export class EpisodesModule {}
