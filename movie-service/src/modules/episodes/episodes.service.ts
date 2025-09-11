import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Episode } from './episode.entity';
import { Movie } from '../movies/movie.entity';
import { CreateEpisodeDto, UpdateEpisodeDto } from './dto/episode.dto';

@Injectable()
export class EpisodesService {
  constructor(
    @InjectRepository(Episode)
    private readonly episodeRepository: Repository<Episode>,
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async createEpisode(dto: CreateEpisodeDto): Promise<Episode> {
    const movie = await this.movieRepository.findOneBy({ id: dto.movieId });
    if (!movie)
      throw new NotFoundException(`Movie with ID ${dto.movieId} not found`);

    const lastEpisode = await this.episodeRepository.findOne({
      where: { movie: { id: dto.movieId }, seasonNumber: dto.seasonNumber },
      order: { episodeNumber: 'DESC' },
    });

    const nextEpisodeNumber = lastEpisode ? lastEpisode.episodeNumber + 1 : 1;

    const episode = this.episodeRepository.create({
      ...dto,
      episodeNumber: nextEpisodeNumber,
      movie,
    });

    return this.episodeRepository.save(episode);
  }

  getEpisodesByMovie(movieId: string): Promise<Episode[]> {
    return this.episodeRepository.find({
      where: { movie: { id: movieId } },
      relations: ['movie'],
      order: { seasonNumber: 'ASC', episodeNumber: 'ASC' },
    });
  }

  getEpisodeById(id: string): Promise<Episode | null> {
    return this.episodeRepository.findOne({
      where: { id },
      relations: ['movie'],
    });
  }

  async updateEpisode(id: string, dto: UpdateEpisodeDto): Promise<Episode> {
    const episode = await this.episodeRepository.findOneBy({ id });
    if (!episode)
      throw new NotFoundException(`Episode with ID ${id} not found`);
    Object.assign(episode, dto);
    return this.episodeRepository.save(episode);
  }

  async deleteEpisode(id: string): Promise<void> {
    const episode = await this.episodeRepository.findOneBy({ id });
    if (!episode)
      throw new NotFoundException(`Episode with ID ${id} not found`);
    await this.episodeRepository.softRemove(episode);
  }
}
