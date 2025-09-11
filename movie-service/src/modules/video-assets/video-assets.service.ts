import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { VideoAsset } from './video-asset.entity';
import { Movie } from '../movies/movie.entity';
import { Episode } from '../episodes/episode.entity';
import { CreateVideoAssetDto } from './dto/create-video-asset.dto';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class VideoAssetsService {
  constructor(
    @InjectRepository(VideoAsset)
    private readonly assetRepo: Repository<VideoAsset>,
    @InjectRepository(Movie)
    private readonly movieRepo: Repository<Movie>,
    @InjectRepository(Episode)
    private readonly episodeRepo: Repository<Episode>,
    @Inject('KAFKA_CLIENT') private readonly kafka: ClientKafka,
  ) {}

  async create(dto: CreateVideoAssetDto): Promise<VideoAsset> {
    if (dto.movieId && dto.episodeId) {
      throw new BadRequestException(
        'Chỉ gắn asset với movie **hoặc** episode, không phải cả hai.',
      );
    }

    let movie: Movie | null = null;
    let episode: Episode | null = null;

    if (dto.movieId) {
      movie = await this.movieRepo.findOneBy({ id: dto.movieId });
      if (!movie) throw new NotFoundException(`Movie ${dto.movieId} not found`);
    }
    if (dto.episodeId) {
      episode = await this.episodeRepo.findOne({
        where: { id: dto.episodeId },
        relations: ['movie'],
      });
      if (!episode)
        throw new NotFoundException(`Episode ${dto.episodeId} not found`);
    }

    const partial: DeepPartial<VideoAsset> = {
      resolution: dto.resolution,
      format: dto.format,
      url: dto.url,
      status: dto.status ?? 'pending',
    };
    if (movie) partial.movie = movie;
    if (episode) partial.episode = episode;

    const asset = this.assetRepo.create(partial);
    const saved = await this.assetRepo.save(asset);

    this.kafka.emit('transcode.requested', {
      assetId: saved.id,
      movieId: dto.movieId ?? null,
      episodeId: dto.episodeId ?? null,
      sourceUrl: saved.url,
      sourceResolution: saved.resolution,
      sourceFormat: saved.format,
    });

    return saved;
  }

  findByMovie(movieId: string): Promise<VideoAsset[]> {
    return this.assetRepo.find({
      where: { movie: { id: movieId } },
      order: { createdAt: 'ASC' },
    });
  }

  findByEpisode(episodeId: string): Promise<VideoAsset[]> {
    return this.assetRepo.find({
      where: { episode: { id: episodeId } },
      order: { createdAt: 'ASC' },
    });
  }

  async updateStatus(
    id: string,
    status: VideoAsset['status'],
  ): Promise<VideoAsset> {
    const asset = await this.assetRepo.findOneBy({ id });
    if (!asset) throw new NotFoundException(`Asset ${id} not found`);

    asset.status = status;
    return this.assetRepo.save(asset);
  }
}
