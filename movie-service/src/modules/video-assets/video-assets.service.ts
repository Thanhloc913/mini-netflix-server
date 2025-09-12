import { BadRequestException, Injectable, NotFoundException, Logger, Inject, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { VideoAsset } from './video-asset.entity';
import { Movie } from '../movies/movie.entity';
import { Episode } from '../episodes/episode.entity';
import { CreateVideoAssetDto } from './dto/create-video-asset.dto';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class VideoAssetsService {
  private readonly logger = new Logger(VideoAssetsService.name);

  constructor(
    @InjectRepository(VideoAsset)
    private readonly assetRepo: Repository<VideoAsset>,
    @InjectRepository(Movie)
    private readonly movieRepo: Repository<Movie>,
    @InjectRepository(Episode)
    private readonly episodeRepo: Repository<Episode>,
    @Optional() @Inject('KAFKA_CLIENT') private readonly kafka?: ClientKafka,
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

    // Emit topic để transcode (nếu Kafka available)
    if (this.kafka) {
      try {
        this.kafka.emit('transcode.requested', {
          originalAssetId: saved.id,
          movieId: dto.movieId ?? null,
          episodeId: dto.episodeId ?? null,
          sourceUrl: saved.url,
          sourceResolution: saved.resolution,
          sourceFormat: saved.format,
        });
        this.logger.log(`📤 Emitted transcode request for asset ${saved.id}`);
      } catch (error) {
        this.logger.error(`❌ Failed to emit transcode request: ${error.message}`);
      }
    }

    return saved;
  }

  // Method để tạo metadata cho các file đã transcode
  async createTranscodedAssets(payload: {
    originalAssetId: string;
    movieId?: string;
    episodeId?: string;
    results: { resolution: string; format: string; url: string }[];
  }): Promise<VideoAsset[]> {
    this.logger.log(`🎬 Creating transcoded assets for original: ${payload.originalAssetId}`);

    // Tìm original asset để lấy movie/episode
    const originalAsset = await this.assetRepo.findOne({
      where: { id: payload.originalAssetId },
      relations: ['movie', 'episode'],
    });

    if (!originalAsset) {
      this.logger.error(`❌ Original asset ${payload.originalAssetId} not found`);
      return [];
    }

    const transcodedAssets: VideoAsset[] = [];

    for (const result of payload.results) {
      const partial: DeepPartial<VideoAsset> = {
        resolution: result.resolution,
        format: result.format,
        url: result.url,
        status: 'done',
      };

      // Gán cùng movie/episode như original
      if (originalAsset.movie) partial.movie = originalAsset.movie;
      if (originalAsset.episode) partial.episode = originalAsset.episode;

      const asset = this.assetRepo.create(partial);
      const saved = await this.assetRepo.save(asset);
      transcodedAssets.push(saved);
    }

    // Cập nhật status của original asset
    originalAsset.status = 'done';
    await this.assetRepo.save(originalAsset);

    this.logger.log(`✅ Created ${transcodedAssets.length} transcoded assets`);
    return transcodedAssets;
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