import { Injectable, Logger } from '@nestjs/common';
import { EachMessagePayload } from 'kafkajs';
import { TranscodingService } from '../transcoding/transcoding.service';

@Injectable()
export class KafkaConsumer {
  private readonly logger = new Logger(KafkaConsumer.name);

  constructor(private readonly transcodingService: TranscodingService) {}

  async handleMessage({ topic, message }: EachMessagePayload) {
    const value = message.value?.toString();
    this.logger.log(`📩 Received message on ${topic}: ${value}`);

    if (topic === 'transcode.requested' && value) {
      const payload = JSON.parse(value);
      await this.transcodingService.handleEncode(payload);
    }
  }
}