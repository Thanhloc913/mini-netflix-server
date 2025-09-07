import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom, Observable } from 'rxjs';

interface FileGrpcService {
  uploadAvatarFile(data: { data: Uint8Array | string }): Observable<{ url: string }>;
  uploadMovieFile(data: { data: Uint8Array | string }): Observable<{ url: string }>;
}

@Injectable()
export class FileClientService implements OnModuleInit {
  private fileService: FileGrpcService;

  constructor(@Inject('FILE_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.fileService = this.client.getService<FileGrpcService>('FileService');
  }

  async uploadAvatar(buffer: Buffer): Promise<string> {

    const data = new Uint8Array(buffer);
    const result$ = this.fileService.uploadAvatarFile({ data });
    const { url } = await lastValueFrom(result$);

    console.log("Upload Result:", url);
    return url;
  }

  async uploadMovie(buffer: Buffer): Promise<string> {
    const data = new Uint8Array(buffer);
    const result$ = this.fileService.uploadMovieFile({ data });
    const { url } = await lastValueFrom(result$);
    return url;
  }
}
