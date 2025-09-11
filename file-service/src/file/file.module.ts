import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileGrpcController } from './file.grpc';
import { FileHttpController } from './file.http.controller';

@Module({
  controllers: [FileGrpcController, FileHttpController],
  providers: [FileService],
})
export class FileModule {}
