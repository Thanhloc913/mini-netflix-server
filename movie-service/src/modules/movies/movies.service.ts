import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, In } from 'typeorm';
import { Movie } from './movie.entity';
import { Genre } from '../genres/genre.entity';
import { Cast } from '../casts/cast.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import {
  PaginationQueryDto,
  PaginatedResponse,
  NonPaginatedResponse,
} from '../../common/dto/pagination-query.dto';

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

  async seedAnimeMovies(): Promise<Movie[]> {
    const apiKey = process.env.TMDB_API_KEY;
    const url = `https://api.themoviedb.org/3/discover/tv?api_key=caf7f9d16fb0b3fae16182de3aa77384&with_genres=16&with_keywords=210024&language=vi-VN&page=3`;

    const res = await fetch(url);
    const data = await res.json();

    const movies: Movie[] = [];

    for (const item of data.results) {
      const movie: Partial<Movie> = {
        title: item.name,
        description: item.overview || 'Chưa có mô tả',
        releaseDate: item.first_air_date
          ? new Date(item.first_air_date)
          : undefined,
        posterUrl: item.poster_path
          ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
          : undefined,
        trailerUrl: undefined,
        isSeries: true,
        rating: item.vote_average ? Number(item.vote_average.toFixed(1)) : 0,
      };

      const entity = this.movieRepository.create(movie);
      const saved = await this.movieRepository.save(entity);
      movies.push(saved);
    }

    return movies;
  }

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

  async getAllMovies(): Promise<NonPaginatedResponse<Movie>> {
    const [data, total] = await this.movieRepository.findAndCount({
      relations: ['genres', 'casts', 'episodes', 'videoAssets'],
      order: { createdAt: 'DESC' },
    });

    return { data, total };
  }

  async getAllMoviesPaginated(
    query: PaginationQueryDto,
  ): Promise<PaginatedResponse<Movie>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await this.movieRepository.findAndCount({
      relations: ['genres', 'casts', 'episodes', 'videoAssets'],
      order: { [query.sortBy]: query.sortOrder },
      take: limit,
      skip: skip,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  getMovieById(id: string): Promise<Movie | null> {
    return this.movieRepository.findOne({
      where: { id },
      relations: ['genres', 'casts', 'episodes', 'videoAssets'],
    });
  }

  async searchMovies(keyword: string): Promise<NonPaginatedResponse<Movie>> {
    const [data, total] = await this.movieRepository.findAndCount({
      where: { title: ILike(`%${keyword}%`) },
      relations: ['genres'],
    });

    return { data, total };
  }

  async searchMoviesPaginated(
    keyword: string,
    query: PaginationQueryDto,
  ): Promise<PaginatedResponse<Movie>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await this.movieRepository.findAndCount({
      where: { title: ILike(`%${keyword}%`) },
      relations: ['genres'],
      order: { [query.sortBy]: query.sortOrder },
      take: limit,
      skip: skip,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async getMoviesByGenre(
    genreId: string,
  ): Promise<NonPaginatedResponse<Movie>> {
    const [data, total] = await this.movieRepository.findAndCount({
      relations: ['genres'],
      where: { genres: { id: genreId } },
    });

    return { data, total };
  }

  async getMoviesByGenrePaginated(
    genreId: string,
    query: PaginationQueryDto,
  ): Promise<PaginatedResponse<Movie>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await this.movieRepository.findAndCount({
      relations: ['genres'],
      where: { genres: { id: genreId } },
      order: { [query.sortBy]: query.sortOrder },
      take: limit,
      skip: skip,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
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
      releaseDate: dto.releaseDate
        ? new Date(dto.releaseDate)
        : movie.releaseDate,
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
