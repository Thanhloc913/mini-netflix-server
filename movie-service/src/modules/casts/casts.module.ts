import { Module } from '@nestjs/common';
import { CastsController } from './casts.controller';
import { CastsService } from './casts.service';

@Module({
  controllers: [CastsController],
  providers: [CastsService]
})
export class CastsModule {}
