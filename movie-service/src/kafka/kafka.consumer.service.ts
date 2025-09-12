import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { VideoAssetsService } from '../modules/video-assets/video-assets.service';

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  private readonly logger = new Logger(KafkaConsumerService.name);
  private consumer: Consumer;

  constructor(private readonly videoAssetsService: VideoAssetsService) {
    const kafka = new Kafka({
      clientId: 'movie-service-consumer',
      brokers: [process.env.KAFKA_BROKER ?? 'localhost:9092'],
    });
    this.consumer = kafka.consumer({ groupId: 'movie-consumer-group' });
  }

  async onModuleInit() {
    try {
      await this.consumer.connect();
      this.logger.log('✅ Kafka Consumer connected');

      await this.consumer.subscribe({
        topic: 'transcode.completed',
        fromBeginning: false,
      });

      await this.consumer.run({
        eachMessage: async (payload) => {
          await this.handleMessage(payload);
        },
      });
    } catch (error) {
      this.logger.error(`❌ Kafka Consumer error: ${error.message}`);
    }
  }

  private async handleMessage({ topic, message }: EachMessagePayload) {
    const value = message.value?.toString();
    this.logger.log(`📩 Received message on ${topic}: ${value}`);

    if (topic === 'transcode.completed' && value) {
      try {
        const payload = JSON.parse(value);
        await this.videoAssetsService.createTranscodedAssets(payload);
      } catch (error) {
        this.logger.error(`❌ Error processing message: ${error.message}`);
      }
    }
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();
    this.logger.log('🔌 Kafka Consumer disconnected');
  }
}