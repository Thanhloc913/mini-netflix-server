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
import { EpisodesService } from './episodes.service';
import { CreateEpisodeDto, UpdateEpisodeDto } from './dto/episode.dto';

@Controller('episodes')
export class EpisodesController {
  constructor(private readonly episodesService: EpisodesService) {}

  @Post()
  create(@Body() dto: CreateEpisodeDto) {
    return this.episodesService.createEpisode(dto);
  }

  @Get('movie/:movieId')
  findByMovie(@Param('movieId', new ParseUUIDPipe()) movieId: string) {
    return this.episodesService.getEpisodesByMovie(movieId);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.episodesService.getEpisodeById(id);
  }

  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateEpisodeDto,
  ) {
    return this.episodesService.updateEpisode(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.episodesService.deleteEpisode(id);
  }
}
