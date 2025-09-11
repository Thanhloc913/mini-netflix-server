import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
} from '@azure/storage-blob';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileService {
  private blobServiceClient: BlobServiceClient;

  constructor() {
    this.blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING!,
    );
  }

  // Upload avatar (như cũ)
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

  async generateMovieUploadUrl(): Promise<{
    uploadUrl: string;
    blobUrl: string;
  }> {
    const containerName =
      process.env.AZURE_STORAGE_CONTAINER_VIDEOS || 'videos';
    const containerClient =
      this.blobServiceClient.getContainerClient(containerName);

    await containerClient.createIfNotExists();

    const filename = `${uuidv4()}.mp4`;
    const blobClient = containerClient.getBlockBlobClient(filename);

    // 🔹 Parse từ connection string
    const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING!;
    const account = connStr.match(/AccountName=([^;]+)/)?.[1];
    const key = connStr.match(/AccountKey=([^;]+)/)?.[1];
    if (!account || !key) {
      throw new Error(
        '❌ Cannot parse AccountName/AccountKey from connection string',
      );
    }

    const credential = new StorageSharedKeyCredential(account, key);

    const expiresOn = new Date(new Date().valueOf() + 15 * 60 * 1000);

    const sas = generateBlobSASQueryParameters(
      {
        containerName,
        blobName: filename,
        permissions: BlobSASPermissions.parse('cwa'),
        expiresOn,
      },
      credential,
    ).toString();

    return {
      uploadUrl: `${blobClient.url}?${sas}`,
      blobUrl: blobClient.url,
    };
  }
}
