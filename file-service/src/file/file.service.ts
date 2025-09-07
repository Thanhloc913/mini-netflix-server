import { Injectable } from '@nestjs/common';
import { BlobServiceClient } from '@azure/storage-blob';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileService {
  private blobServiceClient: BlobServiceClient;

  constructor() {
    this.blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING!,
    );
  }

  async uploadMovieFile(buffer: Buffer): Promise<string> {
    const containerName = process.env.AZURE_STORAGE_CONTAINER || 'videos';
    const containerClient = this.blobServiceClient.getContainerClient(containerName);

    // Tạo container nếu chưa có
    await containerClient.createIfNotExists({ access: 'container' });

    // Generate filename tự động
    const filename = `${uuidv4()}.mp4`;

    const blockBlobClient = containerClient.getBlockBlobClient(filename);
    await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: { blobContentType: 'video/mp4' }, // mặc định video
    });

    return blockBlobClient.url;
  }
}
