import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genre } from './genre.entity';
import { CreateGenreDto, UpdateGenreDto } from './dto/genre.dto';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
  ) {}

  createGenre(dto: CreateGenreDto): Promise<Genre> {
    const genre = this.genreRepository.create(dto);
    return this.genreRepository.save(genre);
  }

  getAllGenres(): Promise<Genre[]> {
    return this.genreRepository.find({ relations: ['movies'] });
  }

  getGenreById(id: string): Promise<Genre | null> {
    return this.genreRepository.findOne({
      where: { id },
      relations: ['movies'],
    });
  }

  async updateGenre(id: string, dto: UpdateGenreDto): Promise<Genre> {
    const genre = await this.genreRepository.findOneBy({ id });
    if (!genre) throw new NotFoundException(`Genre with ID ${id} not found`);
    Object.assign(genre, dto);
    return this.genreRepository.save(genre);
  }

  async deleteGenre(id: string): Promise<void> {
    const genre = await this.genreRepository.findOneBy({ id });
    if (!genre) throw new NotFoundException(`Genre with ID ${id} not found`);
    await this.genreRepository.softRemove(genre);
  }
}
