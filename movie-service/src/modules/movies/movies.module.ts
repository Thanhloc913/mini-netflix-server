import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Movie } from './movie.entity';
import { Genre } from '../genres/genre.entity';
import { Episode } from '../episodes/episode.entity';
import { Cast } from '../casts/cast.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movie, Genre, Episode, Cast]),
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
  exports: [MoviesService], 
})
export class MoviesModule {}
