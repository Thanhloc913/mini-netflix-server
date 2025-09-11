import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { Kafka, Consumer } from 'kafkajs';
import { KafkaConsumer } from './kafka.consumer';
import { TranscodingModule } from 'src/transcoding/transcoding.module';

@Module({
  imports: [TranscodingModule],
  providers: [KafkaConsumer],
  exports: [KafkaConsumer],
})
export class KafkaModule implements OnModuleInit {
  private readonly logger = new Logger(KafkaModule.name);
  private consumer: Consumer;

  constructor(private readonly kafkaConsumer: KafkaConsumer) {
    const kafka = new Kafka({
      clientId: 'transcoding-service',
      brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
    });
    this.consumer = kafka.consumer({ groupId: 'transcoding-group' });
  }

  async onModuleInit() {
    await this.consumer.connect();
    this.logger.log('✅ Kafka connected');

    await this.consumer.subscribe({
      topic: 'transcode.requested',
      fromBeginning: false,
    });

    await this.consumer.run({
      eachMessage: async (payload) => {
        await this.kafkaConsumer.handleMessage(payload);
      },
    });
  }
}
