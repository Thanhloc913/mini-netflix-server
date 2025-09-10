import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Episode } from '../episodes/episode.entity';
import { Genre } from '../genres/genre.entity';
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
  duration: number; // phút (áp dụng cho phim lẻ)

  @Column({ default: false })
  isSeries: boolean;

  @Column({ nullable: true })
  posterUrl: string;

  @Column({ nullable: true })
  trailerUrl: string;

  // 👉 Thêm trường này: chỉ dùng cho phim lẻ
  @Column({ nullable: true })
  videoUrl: string;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 0 })
  rating: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

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
