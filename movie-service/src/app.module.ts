import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesModule } from './modules/movies/movies.module';
import { GenresModule } from './modules/genres/genres.module';
import { EpisodesModule } from './modules/episodes/episodes.module';
import { CastsModule } from './modules/casts/casts.module';
import { VideoAssetsModule } from './modules/video-assets/video-assets.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5432),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'movie_service',
      autoLoadEntities: true,
      synchronize: true,
    }),
    MoviesModule,
    GenresModule,
    EpisodesModule,
    CastsModule,
    VideoAssetsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
