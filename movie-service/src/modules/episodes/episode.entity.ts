import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Movie } from '../movies/movie.entity';

@Entity('episodes')
export class Episode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Movie, (movie) => movie.episodes, { onDelete: 'CASCADE' })
  movie: Movie;

  @Column()
  seasonNumber: number;

  @Column()
  episodeNumber: number;

  @Column({ length: 255 })
  title: string;

  @Column({ nullable: true })
  videoUrl: string;

  @Column({ type: 'int', nullable: true })
  duration: number;
}
