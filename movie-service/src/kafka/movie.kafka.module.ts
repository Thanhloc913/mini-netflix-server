import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'movie-service',
            brokers: [process.env.KAFKA_BROKER ?? 'localhost:9092'],
          },
          consumer: { groupId: 'movie-service-producer' },
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class MovieKafkaModule {}
