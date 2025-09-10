import { DataSource } from 'typeorm';
import { Movie } from '../modules/movies/movie.entity';
import { Episode } from '../modules/episodes/episode.entity';
import { Genre } from '../modules/genres/genre.entity';
import { Cast } from '../modules/casts/cast.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'movie_service',
  entities: [Movie, Episode, Genre, Cast],
  migrations: ['src/database/migrations/*{.ts,.js}'],
});
