import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaProducer implements OnModuleInit {
  private readonly logger = new Logger(KafkaProducer.name);
  private producer: Producer;

  constructor() {
    const kafka = new Kafka({
      clientId: 'transcoding-service-producer',
      brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
    });
    this.producer = kafka.producer();
  }

  async onModuleInit() {
    await this.producer.connect();
    this.logger.log('✅ Kafka Producer connected');
  }

  async emit(topic: string, payload: any) {
    try {
      await this.producer.send({
        topic,
        messages: [
          {
            value: JSON.stringify(payload),
          },
        ],
      });
      this.logger.log(`📤 Emitted to ${topic}: ${JSON.stringify(payload)}`);
    } catch (error) {
      this.logger.error(`❌ Failed to emit to ${topic}:`, error);
      throw error;
    }
  }
}