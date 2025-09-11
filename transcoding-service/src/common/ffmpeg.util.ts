import { Injectable, Logger } from '@nestjs/common';
import ffmpeg from 'fluent-ffmpeg'; // ✅ import default
import * as path from 'path';
import * as os from 'os';

@Injectable()
export class FfmpegUtil {
  private readonly logger = new Logger(FfmpegUtil.name);

  async encode(
    inputUrl: string,
    resolution: '720p' | '480p' | '1080p',
    format: 'mp4' | 'mkv' | 'mov' = 'mp4',
  ): Promise<string> {
    const outputPath = path.join(os.tmpdir(), `output-${resolution}.${format}`);

    return new Promise((resolve, reject) => {
      let size = '1280x720';
      if (resolution === '480p') size = '854x480';
      if (resolution === '1080p') size = '1920x1080';

      ffmpeg(inputUrl) // ✅ gọi trực tiếp
        .inputOptions(['-protocol_whitelist', 'file,http,https,tcp,tls'])
        .outputOptions(['-vf', `scale=${size}`])
        .toFormat(format)
        .save(outputPath)
        .on('end', () => {
          this.logger.log(`🎬 Encoded ${resolution} at ${outputPath}`);
          resolve(outputPath);
        })
        .on('error', (err) => {
          this.logger.error(`❌ FFmpeg error: ${err.message}`);
          reject(err);
        });
    });
  }
}
