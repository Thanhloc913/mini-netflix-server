import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cast } from './cast.entity';
import { CreateCastDto, UpdateCastDto } from './/dto/cast.dto';

@Injectable()
export class CastsService {
  constructor(
    @InjectRepository(Cast)
    private readonly castRepository: Repository<Cast>,
  ) {}

  async findAll(): Promise<Cast[]> {
    return this.castRepository.find({ relations: ['movies'] });
  }

  async findOne(id: string): Promise<Cast> {
    const cast = await this.castRepository.findOne({
      where: { id },
      relations: ['movies'],
    });
    if (!cast) {
      throw new NotFoundException(`Cast with ID ${id} not found`);
    }
    return cast;
  }

  async create(data: CreateCastDto): Promise<Cast> {
    const newCast = this.castRepository.create(data);
    return this.castRepository.save(newCast);
  }

  async update(id: string, data: UpdateCastDto): Promise<Cast> {
    const cast = await this.findOne(id);
    Object.assign(cast, data);
    return this.castRepository.save(cast);
  }

  async remove(id: string): Promise<void> {
    const cast = await this.findOne(id);
    await this.castRepository.softRemove(cast);
  }
}
