import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post('seed')
  seed() {
    return this.moviesService.seedAnimeMovies();
  }
  
  @Post()
  create(@Body() dto: CreateMovieDto) {
    return this.moviesService.createMovie(dto);
  }

  @Get()
  findAll() {
    return this.moviesService.getAllMovies();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.moviesService.getMovieById(id);
  }

  @Get('genre/:genreId')
  findByGenre(@Param('genreId', new ParseUUIDPipe()) genreId: string) {
    return this.moviesService.getMoviesByGenre(genreId);
  }

  @Get('search/:keyword')
  search(@Param('keyword') keyword: string) {
    return this.moviesService.searchMovies(keyword);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateMovieDto,
  ) {
    return this.moviesService.updateMovie(id, dto);
  }

  @Delete(':id')
  softDelete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.moviesService.deleteMovie(id);
  }

  @Delete(':id/hard')
  hardDelete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.moviesService.hardDeleteMovie(id);
  }
}
