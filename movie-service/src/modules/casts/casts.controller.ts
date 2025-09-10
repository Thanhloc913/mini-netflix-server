import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { CastsService } from './casts.service';
import { Cast } from './cast.entity';
import { CreateCastDto, UpdateCastDto } from './dto/cast.dto';

@Controller('casts')
export class CastsController {
  constructor(private readonly castsService: CastsService) {}

  @Get()
  findAll(): Promise<Cast[]> {
    return this.castsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Cast> {
    return this.castsService.findOne(id);
  }

  @Post()
  create(@Body() body: CreateCastDto): Promise<Cast> {
    return this.castsService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateCastDto): Promise<Cast> {
    return this.castsService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.castsService.remove(id);
    return { message: `Cast with ID ${id} deleted successfully` };
  }
}
