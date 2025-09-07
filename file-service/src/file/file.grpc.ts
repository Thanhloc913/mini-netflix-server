import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { FileService } from './file.service';

@Controller()
export class FileGrpcController {
  constructor(private readonly fileService: FileService) {}

  @GrpcMethod('FileService', 'UploadAvatarFile')
  async uploadAvatarFile(data: { data: Buffer }) {
    const url = await this.fileService.uploadAvatarFile(data.data);
    return { url };
  }

  @GrpcMethod('FileService', 'UploadMovieFile')
  async uploadMovieFile(data: { data: Buffer }) {
    const url = await this.fileService.uploadMovieFile(data.data);
    return { url };
  }
}
