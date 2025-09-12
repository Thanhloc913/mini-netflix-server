import { Module } from '@nestjs/common';
import { TranscodingService } from './transcoding.service';
import { TranscodingController } from './transcoding.controller';
import { FfmpegUtil } from '../common/ffmpeg.util';
import { FileClient } from './file.client';
import { KafkaProducer } from '../kafka/kafka.producer';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'FILE_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'file',
          protoPath: join(__dirname, '../../proto/file.proto'),
          url: process.env.FILE_SERVICE_GRPC_URL || 'file-service:50052',
        },
      },
    ]),
  ],
  controllers: [TranscodingController],
  providers: [TranscodingService, FfmpegUtil, FileClient, KafkaProducer],
  exports: [FileClient, TranscodingService, ClientsModule],
})
export class TranscodingModule {}