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

  async uploadAvatarFile(buffer: Buffer): Promise<string> {
    const containerName =
      process.env.AZURE_STORAGE_CONTAINER_AVATARS || 'avatars';
    const containerClient =
      this.blobServiceClient.getContainerClient(containerName);

    await containerClient.createIfNotExists({ access: 'container' });

    const filename = `${uuidv4()}.jpg`;

    const blockBlobClient = containerClient.getBlockBlobClient(filename);
    await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: { blobContentType: 'image/jpeg' },
    });

    return blockBlobClient.url;
  }

  async uploadMovieFile(buffer: Buffer): Promise<string> {
    const containerName =
      process.env.AZURE_STORAGE_CONTAINER_VIDEOS || 'videos';
    const containerClient =
      this.blobServiceClient.getContainerClient(containerName);

    await containerClient.createIfNotExists({ access: 'container' });

    const filename = `${uuidv4()}.mp4`;

    const blockBlobClient = containerClient.getBlockBlobClient(filename);
    await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: { blobContentType: 'video/mp4' },
    });

    return blockBlobClient.url;
  }
}
