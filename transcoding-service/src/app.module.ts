import { Module } from '@nestjs/common';
import { TranscodingModule } from './transcoding/transcoding.module';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [TranscodingModule, KafkaModule],
})
export class AppModule {}
