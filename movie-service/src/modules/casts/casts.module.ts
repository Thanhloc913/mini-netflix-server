import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cast } from './cast.entity';
import { CastsService } from './casts.service';
import { CastsController } from './casts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Cast])],
  providers: [CastsService],
  controllers: [CastsController],
})
export class CastsModule {}
