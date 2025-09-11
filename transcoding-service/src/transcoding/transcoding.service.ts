import { Injectable, Logger } from '@nestjs/common';
import { FfmpegUtil } from '../common/ffmpeg.util';
import { FileClient } from './file.client';
import * as fs from 'fs';
import axios from 'axios';

@Injectable()
export class TranscodingService {
  private readonly logger = new Logger(TranscodingService.name);

  constructor(
    private readonly ffmpegUtil: FfmpegUtil,
    private readonly fileClient: FileClient,
  ) {}

  async handleEncode(videoUrl: string) {
    this.logger.log(`🚀 Start encoding video: ${videoUrl}`);

    // 🔑 xin SAS read cho input
    const { sasUrl } = await this.fileClient.getReadSasUrl(videoUrl);

    const outputs = [
      { resolution: '720p', format: 'mp4' },
      { resolution: '480p', format: 'mp4' },
    ] as const;

    const results: { resolution: string; url: string }[] = [];

    for (const out of outputs) {
      const presign = await this.fileClient.getPresignedUrl();

      const outputPath = await this.ffmpegUtil.encode(
        sasUrl, // ✅ encode bằng SAS read url
        out.resolution,
        out.format,
      );

      const stats = fs.statSync(outputPath);
      const stream = fs.createReadStream(outputPath);

      await axios.put(presign.uploadUrl, stream, {
        headers: {
          'Content-Type': 'video/mp4',
          'x-ms-blob-type': 'BlockBlob',
          'Content-Length': stats.size,
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      });

      this.logger.log(`✅ Uploaded ${out.resolution} to ${presign.blobUrl}`);
      results.push({ resolution: out.resolution, url: presign.blobUrl });
    }

    return { status: 'done', results };
  }
}
