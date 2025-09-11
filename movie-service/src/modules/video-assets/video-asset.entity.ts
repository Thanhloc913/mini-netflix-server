import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Movie } from '../movies/movie.entity';
import { Episode } from '../episodes/episode.entity';

@Entity('video_assets')
export class VideoAsset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Movie, (movie) => movie.videoAssets, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  movie: Movie;

  @ManyToOne(() => Episode, (episode) => episode.videoAssets, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  episode: Episode;

  @Column()
  resolution: string; // '1080p', '720p', '480p'

  @Column()
  format: string; // 'mp4', 'hls', 'dash'

  @Column()
  url: string; // link blob hoặc playlist .m3u8

  @Column({ default: 'pending' })
  status: 'pending' | 'processing' | 'done' | 'failed';

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
