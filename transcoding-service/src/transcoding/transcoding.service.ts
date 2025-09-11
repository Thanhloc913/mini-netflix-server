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

    const outputs = [
      { resolution: '720p', format: 'mp4' },
      { resolution: '480p', format: 'mp4' },
    ] as const;

    const results: { resolution: string; url: string }[] = [];

    for (const out of outputs) {
      const presign = await this.fileClient.getPresignedUrl(
        out.resolution,
        out.format,
      );

      const outputPath = await this.ffmpegUtil.encode(
        videoUrl,
        out.resolution,
        out.format,
      );

      const buffer = fs.readFileSync(outputPath);
      await axios.put(presign.uploadUrl, buffer, {
        headers: { 'Content-Type': 'video/mp4' },
      });

      this.logger.log(`✅ Uploaded ${out.resolution} to ${presign.blobUrl}`);
      results.push({ resolution: out.resolution, url: presign.blobUrl });
    }

    return { status: 'done', results };
  }
}
