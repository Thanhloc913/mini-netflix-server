import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, In } from 'typeorm';
import { Movie } from './movie.entity';
import { Genre } from '../genres/genre.entity';
import { Cast } from '../casts/cast.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
    @InjectRepository(Cast)
    private readonly castRepository: Repository<Cast>,
  ) {}

  async createMovie(dto: CreateMovieDto): Promise<Movie> {
    const {
      title,
      description,
      releaseDate,
      duration,
      isSeries,
      posterUrl,
      trailerUrl,
      genreIds,
      castIds,
    } = dto;

    let genres: Genre[] = [];
    if (genreIds && genreIds.length > 0) {
      genres = await this.genreRepository.find({
        where: { id: In(genreIds) },
      });
    }

    let casts: Cast[] = [];
    if (castIds && castIds.length > 0) {
      casts = await this.castRepository.find({
        where: { id: In(castIds) },
      });
    }

    const movie = this.movieRepository.create({
      title,
      description,
      releaseDate: releaseDate ? new Date(releaseDate) : undefined,
      duration,
      isSeries,
      posterUrl,
      trailerUrl,
      genres,
      casts,
    });

    return this.movieRepository.save(movie);
  }

  getAllMovies(): Promise<Movie[]> {
    return this.movieRepository.find({
      relations: ['genres', 'casts', 'episodes', 'videoAssets'],
      order: { createdAt: 'DESC' },
    });
  }

  getMovieById(id: string): Promise<Movie | null> {
    return this.movieRepository.findOne({
      where: { id },
      relations: ['genres', 'casts', 'episodes', 'videoAssets'],
    });
  }

  getMoviesByGenre(genreId: string): Promise<Movie[]> {
    return this.movieRepository.find({
      relations: ['genres'],
      where: { genres: { id: genreId } },
    });
  }

  searchMovies(keyword: string): Promise<Movie[]> {
    return this.movieRepository.find({
      where: { title: ILike(`%${keyword}%`) },
      relations: ['genres'],
    });
  }

  async updateMovie(id: string, dto: UpdateMovieDto): Promise<Movie> {
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: ['genres', 'casts'],
    });

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    if (dto.genreIds) {
      const genres = await this.genreRepository.find({
        where: { id: In(dto.genreIds) },
      });
      movie.genres = genres;
    }

    if (dto.castIds) {
      const casts = await this.castRepository.find({
        where: { id: In(dto.castIds) },
      });
      movie.casts = casts;
    }

    Object.assign(movie, dto, {
      releaseDate: dto.releaseDate ? new Date(dto.releaseDate) : movie.releaseDate,
    });

    return this.movieRepository.save(movie);
  }

  async deleteMovie(id: string): Promise<void> {
    const movie = await this.movieRepository.findOneBy({ id });
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    await this.movieRepository.softRemove(movie);
  }

  async hardDeleteMovie(id: string): Promise<void> {
    await this.movieRepository.delete(id);
  }
}
