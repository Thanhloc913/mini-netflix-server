import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './modules/movies/movies.module';
import { GenresModule } from './modules/genres/genres.module';
import { EpisodesModule } from './modules/episodes/episodes.module';
import { CastsModule } from './modules/casts/casts.module';

@Module({
  imports: [MoviesModule, GenresModule, EpisodesModule, CastsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
