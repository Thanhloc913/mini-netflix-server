import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

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
  findAll(@Query() query: PaginationQueryDto) {
    if (query.page || query.limit) {
      return this.moviesService.getAllMoviesPaginated(query);
    }
    return this.moviesService.getAllMovies();
  }

  @Get('search')
  search(
    @Query('keyword') keyword: string,
    @Query() paginationQuery: PaginationQueryDto
  ) {
    if (paginationQuery.page || paginationQuery.limit) {
      return this.moviesService.searchMoviesPaginated(keyword, paginationQuery);
    }
    return this.moviesService.searchMovies(keyword);
  }

  @Get('genre/:genreId')
  findByGenre(
    @Param('genreId', new ParseUUIDPipe()) genreId: string,
    @Query() paginationQuery: PaginationQueryDto
  ) {
    if (paginationQuery.page || paginationQuery.limit) {
      return this.moviesService.getMoviesByGenrePaginated(genreId, paginationQuery);
    }
    return this.moviesService.getMoviesByGenre(genreId);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.moviesService.getMovieById(id);
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