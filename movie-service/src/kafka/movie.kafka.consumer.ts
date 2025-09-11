// import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
// import { Kafka } from 'kafkajs';
// import { VideoAssetsService } from '../modules/video-assets/video-assets.service';

// @Injectable()
// export class MovieKafkaConsumer implements OnModuleInit {
//   private readonly logger = new Logger(MovieKafkaConsumer.name);

//   constructor(private readonly videoAssetsService: VideoAssetsService) {}

//   async onModuleInit() {
//     const kafka = new Kafka({
//       clientId: 'movie-service',
//       brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
//     });
//     const consumer = kafka.consumer({ groupId: 'movie-consumer-group' });

//     await consumer.connect();
//     await consumer.subscribe({ topic: 'video.transcoded', fromBeginning: false });

//     await consumer.run({
//       eachMessage: async ({ topic, message }) => {
//         const value = message.value?.toString();
//         this.logger.log(`📩 Received ${topic}: ${value}`);
//         if (!value) return;

//         const payload = JSON.parse(value);
//         await this.videoAssetsService.updateStatusAndUrls(
//           payload.episodeId,
//           payload.assets,
//         );
//       },
//     });
//   }
// }
