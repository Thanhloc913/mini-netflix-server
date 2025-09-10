import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Movie } from '../movies/movie.entity';

@Entity('casts')
export class Cast {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  role: string; // ví dụ: Actor, Director

  @ManyToMany(() => Movie, (movie) => movie.casts)
  movies: Movie[];
}
