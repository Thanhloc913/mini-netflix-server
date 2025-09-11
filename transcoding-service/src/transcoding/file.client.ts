import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom, Observable } from 'rxjs';

interface FileServiceGrpc {
  GenerateMoviePresignedUrl(
    data: Record<string, never>,
  ): Observable<{ uploadUrl: string; blobUrl: string }>;
}

@Injectable()
export class FileClient implements OnModuleInit {
  private svc!: FileServiceGrpc;

  constructor(@Inject('FILE_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.svc = this.client.getService<FileServiceGrpc>('FileService');
  }

  async getPresignedUrl() {
    const result = await lastValueFrom(this.svc.GenerateMoviePresignedUrl({}));
    console.log('Presign URL đây:', result);
    return result as { uploadUrl: string; blobUrl: string };
  }
}
