import { Injectable, Logger } from '@nestjs/common';
import { FfmpegUtil } from '../common/ffmpeg.util';
import { FileClient } from './file.client';
import { KafkaProducer } from '../kafka/kafka.producer';
import * as fs from 'fs';
import axios from 'axios';

@Injectable()
export class TranscodingService {
  private readonly logger = new Logger(TranscodingService.name);

  constructor(
    private readonly ffmpegUtil: FfmpegUtil,
    private readonly fileClient: FileClient,
    private readonly kafkaProducer: KafkaProducer,
  ) {}

  async handleEncode(payload: {
    originalAssetId: string;
    movieId?: string;
    episodeId?: string;
    sourceUrl: string;
    sourceResolution: string;
    sourceFormat: string;
  }) {
    this.logger.log(`🚀 Start encoding video: ${payload.sourceUrl}`);

    try {
      const { sasUrl } = await this.fileClient.getReadSasUrl(payload.sourceUrl);

      const outputs = [
        { resolution: '720p', format: 'mp4' },
        { resolution: '480p', format: 'mp4' },
      ] as const;

      const results: { resolution: string; format: string; url: string }[] = [];

      for (const out of outputs) {
        const presign = await this.fileClient.getPresignedUrl();

        const outputPath = await this.ffmpegUtil.encode(
          sasUrl,
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
        results.push({ 
          resolution: out.resolution, 
          format: out.format,
          url: presign.blobUrl 
        });
        fs.unlinkSync(outputPath);
      }

      await this.kafkaProducer.emit('transcode.completed', {
        originalAssetId: payload.originalAssetId,
        movieId: payload.movieId,
        episodeId: payload.episodeId,
        results,
      });

      return { status: 'completed', results };
    } catch (error) {
      this.logger.error(`❌ Encoding failed: ${error.message}`);
      
      await this.kafkaProducer.emit('transcode.failed', {
        originalAssetId: payload.originalAssetId,
        movieId: payload.movieId,
        episodeId: payload.episodeId,
        error: error.message,
      });

      throw error;
    }
  }
}