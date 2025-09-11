import { Controller, Post } from '@nestjs/common';
import { FileService } from './file.service';

@Controller('files')
export class FileHttpController {
  constructor(private readonly fileService: FileService) {}

  @Post('presign-movie')
  async getMoviePresignedUrl() {
    return this.fileService.generateMovieUploadUrl();
  }
}
