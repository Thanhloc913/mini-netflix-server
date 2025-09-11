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
import { CastsService } from './casts.service';
import { CreateCastDto, UpdateCastDto } from './dto/cast.dto';

@Controller('casts')
export class CastsController {
  constructor(private readonly castsService: CastsService) {}

  @Post()
  create(@Body() dto: CreateCastDto) {
    return this.castsService.createCast(dto);
  }

  @Get()
  findAll() {
    return this.castsService.getAllCasts();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.castsService.getCastById(id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateCastDto,
  ) {
    return this.castsService.updateCast(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.castsService.deleteCast(id);
  }
}
