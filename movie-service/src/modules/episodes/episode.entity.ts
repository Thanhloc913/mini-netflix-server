import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Movie } from '../movies/movie.entity';
import { VideoAsset } from '../video-assets/video-asset.entity';

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

  // ✅ Quan hệ mới
  @OneToMany(() => VideoAsset, (videoAsset) => videoAsset.episode)
  videoAssets: VideoAsset[];

  @Column({ type: 'int', nullable: true })
  duration: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
