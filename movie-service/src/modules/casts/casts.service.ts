import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cast } from './cast.entity';
import { CreateCastDto, UpdateCastDto } from './dto/cast.dto';

@Injectable()
export class CastsService {
  constructor(
    @InjectRepository(Cast)
    private readonly castRepository: Repository<Cast>,
  ) {}

  createCast(dto: CreateCastDto): Promise<Cast> {
    const cast = this.castRepository.create(dto);
    return this.castRepository.save(cast);
  }

  getAllCasts(): Promise<Cast[]> {
    return this.castRepository.find({ relations: ['movies'] });
  }

  getCastById(id: string): Promise<Cast | null> {
    return this.castRepository.findOne({
      where: { id },
      relations: ['movies'],
    });
  }

  async updateCast(id: string, dto: UpdateCastDto): Promise<Cast> {
    const cast = await this.castRepository.findOneBy({ id });
    if (!cast) throw new NotFoundException(`Cast with ID ${id} not found`);
    Object.assign(cast, dto);
    return this.castRepository.save(cast);
  }

  async deleteCast(id: string): Promise<void> {
    const cast = await this.castRepository.findOneBy({ id });
    if (!cast) throw new NotFoundException(`Cast with ID ${id} not found`);
    await this.castRepository.softRemove(cast);
  }
}
