import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileGrpcController } from './file.grpc';

@Module({
  controllers: [FileGrpcController],
  providers: [FileService],
})
export class FileModule {}
