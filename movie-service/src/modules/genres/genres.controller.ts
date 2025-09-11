import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
} from '@nestjs/common';
import { GenresService } from './genres.service';
import { CreateGenreDto, UpdateGenreDto } from './dto/genre.dto';

@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Post()
  create(@Body() dto: CreateGenreDto) {
    return this.genresService.createGenre(dto);
  }

  @Get()
  findAll() {
    return this.genresService.getAllGenres();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.genresService.getGenreById(id);
  }

  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateGenreDto,
  ) {
    return this.genresService.updateGenre(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.genresService.deleteGenre(id);
  }
}
