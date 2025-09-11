import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cast } from './cast.entity';
import { CastsController } from './casts.controller';
import { CastsService } from './casts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cast])],
  controllers: [CastsController],
  providers: [CastsService],
  exports: [CastsService],
})
export class CastsModule {}
