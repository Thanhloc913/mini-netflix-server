import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './movie.entity';
import { Repository } from 'typeorm/repository/Repository.js';
import { ILike, In } from 'typeorm';
import { Genre } from '../genres/genre.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
  ) {}

  getAllMovies(): Promise<Movie[]> {
    return this.movieRepository.find({
      relations: ['genres'],
    });
  }

  getMovieById(id: string): Promise<Movie | null> {
    return this.movieRepository.findOne({
      where: { id },
      relations: ['genres'],
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
}
