import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Episode } from '../episodes/episode.entity';
import { Genre } from '../genres//genre.entity';
import { Cast } from '../casts/cast.entity';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'date', nullable: true })
  releaseDate: Date;

  @Column({ type: 'int', nullable: true })
  duration: number; // phút

  @Column({ default: false })
  isSeries: boolean;

  @Column({ nullable: true })
  posterUrl: string;

  @Column({ nullable: true })
  trailerUrl: string;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 0 })
  rating: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Episode, (episode) => episode.movie)
  episodes: Episode[];

  @ManyToMany(() => Genre, (genre) => genre.movies, { cascade: true })
  @JoinTable({ name: 'movie_genres' })
  genres: Genre[];

  @ManyToMany(() => Cast, (cast) => cast.movies, { cascade: true })
  @JoinTable({ name: 'movie_casts' })
  casts: Cast[];
}
