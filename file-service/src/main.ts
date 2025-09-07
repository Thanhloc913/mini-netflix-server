import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'file',
      protoPath: join(__dirname, '../proto/file.proto'),
      url: '0.0.0.0:50052',
    },
  });

  await app.listen();
  console.log('🎬 File-service gRPC running at 0.0.0.0:50052');
}
bootstrap();
