import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

interface FileServiceGrpc {
  GenerateMoviePresignedUrl(data: { resolution: string; format: string }): any;
}

@Injectable()
export class FileClient implements OnModuleInit {
  private svc!: FileServiceGrpc;

  constructor(@Inject('FILE_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.svc = this.client.getService<FileServiceGrpc>('FileService');
  }

  async getPresignedUrl(resolution: string, format: string) {
    const result = await lastValueFrom(
      this.svc.GenerateMoviePresignedUrl({ resolution, format }),
    );

    // ép kiểu rõ ràng
    return result as { uploadUrl: string; blobUrl: string };
  }
}
