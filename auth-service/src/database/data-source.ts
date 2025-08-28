import { DataSource } from 'typeorm';
import { Account } from '../modules/accounts/account.entity';
import { Profiles } from 'src/modules/profile/profile.entity';
// import { Movie } from '../modules/movie/movie.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'mini-netflix',
  entities: [Account, Profiles],
  migrations: ['dist/migrations/*.js'],
});
